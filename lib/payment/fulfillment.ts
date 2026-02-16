import crypto from "crypto"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendDonationReceiptEmail, sendMemberWelcomeEmail } from "@/lib/email"

const DEFAULT_MEMBERSHIP_FEE = 300
const DEFAULT_MEMBERSHIP_DURATION_MONTHS = 12
const ANONYMOUS_EMAIL_DOMAIN = "fossandhra.local"
const ANONYMOUS_PHONE_FALLBACK = "0000000000"
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[0-9][0-9\s-]{7,19}$/

const MEMBERSHIP_AMOUNT_MAP: Record<string, number> = {
  "fosstar annual": 300,
  "fosstar lifetime": 5000,
  "fosstar membership": 300,
  "fosstar student": 300,
  "fosstar teacher": 500,
  "fosstar institution": 5000,
  "fosstar institutional": 5000,
  "fosstar professional": 1000,
  "fosstar company": 10000,
  "fosstar ngo": 2000,
  student: 300,
  teacher: 500,
  institution: 5000,
  institutional: 5000,
  professional: 1000,
  company: 10000,
  ngo: 2000,
}

export type PaymentPurpose = "membership" | "donation"

export interface PaymentUserDetails {
  name: string
  email: string
  phone: string
}

export interface MembershipPaymentDefaults {
  annualFee: number
  durationMonths: number
}

export interface CreateDonationIntentInput {
  donationType: string
  amount: number
  name?: string
  email?: string
  phone?: string
  anonymous?: boolean
  notes?: string
  program?: string
}

interface CompleteDonationPaymentInput {
  donationId: string
  paymentId: string
  orderId: string
  signature?: string
}

interface CompleteMembershipPaymentInput {
  paymentId: string
  orderId: string
  userDetails: PaymentUserDetails
  membershipType?: string
  additionalData?: Record<string, unknown> | null
}

interface MemberProfileFields {
  organization?: string
  designation?: string
  experience?: string
  interests?: string
  address?: string
  referral?: string
}

function normalizeString(value: unknown, maxLength = 250): string | undefined {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  return trimmed.slice(0, maxLength)
}

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  return value as Record<string, unknown>
}

function pickStringValue(source: Record<string, unknown>, keys: string[], maxLength = 250): string | undefined {
  for (const key of keys) {
    const value = normalizeString(source[key], maxLength)
    if (value) {
      return value
    }
  }

  return undefined
}

function normalizeMembershipType(value?: string): string {
  return value?.trim() || "FOSStar Annual"
}

function normalizeMembershipTypeKey(value?: string): string {
  return (value || "FOSStar Annual").trim().toLowerCase()
}

function normalizeDonationType(value?: string): string {
  const normalized = (value || "").trim().toLowerCase()
  const donationTypeMap: Record<string, string> = {
    "one-time": "One-time",
    once: "One-time",
    monthly: "Monthly",
    recurring: "Recurring",
    annual: "Annual",
  }

  return donationTypeMap[normalized] || (value?.trim() || "One-time")
}

function isPlaceholderAnonymousEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${ANONYMOUS_EMAIL_DOMAIN}`)
}

function buildAnonymousEmail(): string {
  return `anonymous+${Date.now()}@${ANONYMOUS_EMAIL_DOMAIN}`
}

function buildMemberProfile(additionalData?: Record<string, unknown> | null): MemberProfileFields {
  const source = asObject(additionalData)

  return {
    organization: pickStringValue(source, [
      "organization",
      "institution",
      "institutionName",
      "company",
      "companyName",
      "organizationName",
    ]),
    designation: pickStringValue(source, ["designation", "course", "department"]),
    experience: pickStringValue(source, ["experience", "year", "timeline"]),
    interests: pickStringValue(source, ["interests", "contribution", "expectations", "skills"]),
    address: pickStringValue(source, ["address"], 500),
    referral: pickStringValue(source, ["referral", "referrer"]),
  }
}

function addMonths(baseDate: Date, months: number) {
  const nextDate = new Date(baseDate)
  nextDate.setMonth(nextDate.getMonth() + months)
  return nextDate
}

async function generateUniqueMembershipId() {
  for (let attempt = 0; attempt < 8; attempt++) {
    const timestamp = Date.now().toString().slice(-8)
    const randomPart = Math.floor(1000 + Math.random() * 9000)
    const membershipId = `FOSS${timestamp}${randomPart}`

    const existing = await prisma.member.findUnique({
      where: { membershipId },
      select: { id: true },
    })

    if (!existing) {
      return membershipId
    }
  }

  throw new Error("Failed to generate unique membership ID")
}

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002"
}

export async function getMembershipPaymentDefaults(): Promise<MembershipPaymentDefaults> {
  const settings = await prisma.settings.findMany({
    where: {
      key: {
        in: ["membershipFee", "membershipDuration"],
      },
    },
  })

  const settingsMap = settings.reduce<Record<string, string>>((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})

  const annualFeeParsed = Number.parseInt(settingsMap.membershipFee ?? "", 10)
  const durationParsed = Number.parseInt(settingsMap.membershipDuration ?? "", 10)

  return {
    annualFee:
      Number.isFinite(annualFeeParsed) && annualFeeParsed > 0 ? annualFeeParsed : DEFAULT_MEMBERSHIP_FEE,
    durationMonths:
      Number.isFinite(durationParsed) && durationParsed > 0 ? durationParsed : DEFAULT_MEMBERSHIP_DURATION_MONTHS,
  }
}

export function resolveMembershipAmount(membershipType: string | undefined, defaults?: MembershipPaymentDefaults): number {
  const normalizedType = normalizeMembershipTypeKey(membershipType)
  const matchedAmount = MEMBERSHIP_AMOUNT_MAP[normalizedType]

  if (typeof matchedAmount === "number") {
    return matchedAmount
  }

  return defaults?.annualFee ?? DEFAULT_MEMBERSHIP_FEE
}

export async function createPendingDonation(input: CreateDonationIntentInput) {
  const amount = Number(input.amount)
  if (!Number.isFinite(amount) || amount < 100 || amount > 100000) {
    throw new Error("Donation amount must be between Rs 100 and Rs 100,000")
  }

  const anonymous = Boolean(input.anonymous)
  const normalizedName = normalizeString(input.name, 120)
  const normalizedEmail = normalizeString(input.email, 200)
  const normalizedPhone = normalizeString(input.phone, 30)

  if (!anonymous) {
    if (!normalizedName || !normalizedEmail || !normalizedPhone) {
      throw new Error("Name, email, and phone are required")
    }
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      throw new Error("Please provide a valid email address")
    }
    if (!PHONE_REGEX.test(normalizedPhone)) {
      throw new Error("Please provide a valid phone number")
    }
  }

  const donation = await prisma.donation.create({
    data: {
      name: anonymous ? normalizedName || "Anonymous Donor" : normalizedName || "Donor",
      email: anonymous ? normalizedEmail || buildAnonymousEmail() : normalizedEmail || "",
      phone: anonymous ? normalizedPhone || ANONYMOUS_PHONE_FALLBACK : normalizedPhone || "",
      amount,
      type: normalizeDonationType(input.donationType),
      status: "pending",
      anonymous,
      notes: normalizeString(input.notes, 1000),
      program: normalizeString(input.program, 120),
    },
  })

  return donation
}

export async function getDonationCheckoutContext(donationId: string) {
  return prisma.donation.findUnique({
    where: { id: donationId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      amount: true,
      type: true,
      status: true,
      anonymous: true,
      program: true,
      notes: true,
    },
  })
}

export async function completeDonationPayment(input: CompleteDonationPaymentInput) {
  const donation = await prisma.donation.findUnique({
    where: { id: input.donationId },
  })

  if (!donation) {
    throw new Error("Donation record not found")
  }

  if (donation.status === "completed") {
    if (donation.paymentId && donation.paymentId !== input.paymentId) {
      throw new Error("Donation already completed with a different payment")
    }

    if (input.signature && !donation.razorpaySignature) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          razorpaySignature: input.signature,
          razorpayOrderId: donation.razorpayOrderId || input.orderId,
        },
      })
    }

    return {
      donationId: donation.id,
      alreadyProcessed: true,
    }
  }

  const updatedDonation = await prisma.donation.update({
    where: { id: donation.id },
    data: {
      status: "completed",
      paymentId: input.paymentId,
      razorpayOrderId: input.orderId,
      razorpaySignature: input.signature ?? null,
    },
  })

  if (updatedDonation.email && !isPlaceholderAnonymousEmail(updatedDonation.email)) {
    try {
      await sendDonationReceiptEmail(updatedDonation.email, {
        name: updatedDonation.anonymous ? "Anonymous Donor" : updatedDonation.name,
        amount: updatedDonation.amount,
        type: updatedDonation.type,
        paymentId: updatedDonation.paymentId || input.paymentId,
        date: new Date(),
      })
    } catch (emailError) {
      console.error("Donation receipt email failed:", emailError)
    }
  }

  return {
    donationId: updatedDonation.id,
    alreadyProcessed: false,
  }
}

export async function completeMembershipPayment(input: CompleteMembershipPaymentInput) {
  const email = normalizeString(input.userDetails.email, 200)
  const name = normalizeString(input.userDetails.name, 120) || "Member"
  const phone = normalizeString(input.userDetails.phone, 30) || ""

  if (!email) {
    throw new Error("Member email is required")
  }

  const alreadyProcessedMember = await prisma.member.findFirst({
    where: { paymentId: input.paymentId },
    select: { membershipId: true },
  })

  if (alreadyProcessedMember) {
    return {
      membershipId: alreadyProcessedMember.membershipId,
      alreadyProcessed: true,
    }
  }

  const defaults = await getMembershipPaymentDefaults()
  const membershipType = normalizeMembershipType(input.membershipType)
  const existingMember = await prisma.member.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      membershipId: true,
      expiryDate: true,
      password: true,
    },
  })

  const profile = buildMemberProfile(input.additionalData)
  const now = new Date()
  const baseDate = existingMember?.expiryDate && existingMember.expiryDate > now ? existingMember.expiryDate : now
  const expiryDate = addMonths(baseDate, defaults.durationMonths)

  const shouldGenerateCredentials = !existingMember || !existingMember.password
  const resetToken = shouldGenerateCredentials ? crypto.randomBytes(32).toString("hex") : undefined
  const resetTokenExpiry = shouldGenerateCredentials ? new Date(now) : undefined
  if (resetTokenExpiry) {
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 24)
  }

  const generatedPasswordHash = shouldGenerateCredentials
    ? await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10)
    : undefined

  let member:
    | {
        membershipId: string
      }
    | null = null

  for (let attempt = 0; attempt < 3; attempt++) {
    const membershipId = existingMember?.membershipId ?? (await generateUniqueMembershipId())

    try {
      member = await prisma.member.upsert({
        where: { email },
        update: {
          name,
          phone,
          membershipType,
          status: "active",
          expiryDate,
          paymentId: input.paymentId,
          organization: profile.organization,
          designation: profile.designation,
          experience: profile.experience,
          interests: profile.interests,
          address: profile.address,
          referral: profile.referral,
          ...(resetToken && resetTokenExpiry
            ? {
                resetToken,
                resetTokenExpiry,
                password: generatedPasswordHash,
              }
            : {}),
        },
        create: {
          name,
          email,
          phone,
          membershipType,
          status: "active",
          membershipId,
          expiryDate,
          paymentId: input.paymentId,
          organization: profile.organization,
          designation: profile.designation,
          experience: profile.experience,
          interests: profile.interests,
          address: profile.address,
          referral: profile.referral,
          password: generatedPasswordHash || (await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10)),
          resetToken,
          resetTokenExpiry,
        },
        select: {
          membershipId: true,
        },
      })
      break
    } catch (error) {
      if (!isUniqueConstraintError(error) || existingMember) {
        throw error
      }
    }
  }

  if (!member) {
    throw new Error("Unable to activate membership")
  }

  if (resetToken) {
    try {
      await sendMemberWelcomeEmail(email, {
        name,
        membershipId: member.membershipId,
        expiryDate,
        resetToken,
      })
    } catch (emailError) {
      console.error("Member welcome email failed:", emailError)
    }
  }

  return {
    membershipId: member.membershipId,
    alreadyProcessed: false,
  }
}
