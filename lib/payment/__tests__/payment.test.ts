import { describe, it, expect, vi, beforeEach } from "vitest"
import crypto from "crypto"

// ─── Mock prisma so tests don't need a real DB ───────────────────────────────
vi.mock("@/lib/prisma", () => ({
  prisma: {
    settings: { findMany: vi.fn().mockResolvedValue([]) },
    donation: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    member: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    paymentLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}))

vi.mock("@/lib/email", () => ({
  sendDonationReceiptEmail: vi.fn().mockResolvedValue(undefined),
  sendMemberWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/payment/logger", () => ({
  logPaymentEvent: vi.fn().mockResolvedValue(undefined),
}))

// ─── Import after mocks ───────────────────────────────────────────────────────
import {
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from "../razorpay"
import {
  resolveMembershipAmount,
  isValidMembershipType,
  createPendingDonation,
  completeDonationPayment,
  completeMembershipPayment,
} from "../fulfillment"
import { prisma } from "@/lib/prisma"

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeSignature(secret: string, orderId: string, paymentId: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex")
}

function makeWebhookSignature(secret: string, body: string) {
  return crypto.createHmac("sha256", secret).update(body).digest("hex")
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("verifyRazorpayPaymentSignature", () => {
  const SECRET = "test_secret_key"
  const ORDER_ID = "order_abc123"
  const PAYMENT_ID = "pay_xyz789"

  it("accepts a valid HMAC-SHA256 signature", () => {
    const sig = makeSignature(SECRET, ORDER_ID, PAYMENT_ID)
    expect(verifyRazorpayPaymentSignature({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature: sig, keySecret: SECRET })).toBe(true)
  })

  it("rejects a tampered signature", () => {
    const tampered = "0".repeat(64)
    expect(verifyRazorpayPaymentSignature({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature: tampered, keySecret: SECRET })).toBe(false)
  })

  it("rejects when orderId is wrong", () => {
    const sig = makeSignature(SECRET, ORDER_ID, PAYMENT_ID)
    expect(verifyRazorpayPaymentSignature({ orderId: "order_different", paymentId: PAYMENT_ID, signature: sig, keySecret: SECRET })).toBe(false)
  })

  it("rejects when paymentId is wrong", () => {
    const sig = makeSignature(SECRET, ORDER_ID, PAYMENT_ID)
    expect(verifyRazorpayPaymentSignature({ orderId: ORDER_ID, paymentId: "pay_different", signature: sig, keySecret: SECRET })).toBe(false)
  })

  it("rejects an empty/malformed signature gracefully", () => {
    expect(verifyRazorpayPaymentSignature({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature: "not-hex!", keySecret: SECRET })).toBe(false)
  })
})

describe("verifyRazorpayWebhookSignature", () => {
  const SECRET = "webhook_secret"
  const BODY = JSON.stringify({ event: "payment.captured" })

  it("accepts a valid webhook signature", () => {
    const sig = makeWebhookSignature(SECRET, BODY)
    expect(verifyRazorpayWebhookSignature({ body: BODY, signature: sig, webhookSecret: SECRET })).toBe(true)
  })

  it("rejects a modified body", () => {
    const sig = makeWebhookSignature(SECRET, BODY)
    expect(verifyRazorpayWebhookSignature({ body: BODY + " ", signature: sig, webhookSecret: SECRET })).toBe(false)
  })

  it("rejects with wrong secret", () => {
    const sig = makeWebhookSignature(SECRET, BODY)
    expect(verifyRazorpayWebhookSignature({ body: BODY, signature: sig, webhookSecret: "wrong" })).toBe(false)
  })
})

describe("resolveMembershipAmount", () => {
  it("returns 300 for FOSStar Annual", () => {
    expect(resolveMembershipAmount("FOSStar Annual")).toBe(300)
  })

  it("returns 5000 for FOSStar Lifetime", () => {
    expect(resolveMembershipAmount("FOSStar Lifetime")).toBe(5000)
  })

  it("is case-insensitive", () => {
    expect(resolveMembershipAmount("fosstar annual")).toBe(300)
    expect(resolveMembershipAmount("FOSSTAR PROFESSIONAL")).toBe(1000)
  })

  it("returns default when type is unknown", () => {
    expect(resolveMembershipAmount("Unknown Type")).toBe(300)
  })

  it("uses provided default when type is unknown", () => {
    expect(resolveMembershipAmount("Unknown Type", { annualFee: 999, durationMonths: 12 })).toBe(999)
  })

  it("returns 10000 for FOSStar Company", () => {
    expect(resolveMembershipAmount("FOSStar Company")).toBe(10000)
  })
})

describe("isValidMembershipType", () => {
  it("accepts known types", () => {
    expect(isValidMembershipType("FOSStar Annual")).toBe(true)
    expect(isValidMembershipType("fosstar lifetime")).toBe(true)
    expect(isValidMembershipType("professional")).toBe(true)
  })

  it("rejects unknown types", () => {
    expect(isValidMembershipType("Gold Member")).toBe(false)
    expect(isValidMembershipType("")).toBe(false)
  })
})

describe("createPendingDonation", () => {
  beforeEach(() => vi.mocked(prisma.donation.create).mockResolvedValue({
    id: "don_test",
    name: "Test User",
    email: "test@example.com",
    phone: "9876543210",
    amount: 500,
    type: "One-time",
    status: "pending",
    anonymous: false,
    paymentId: null,
    razorpayOrderId: null,
    razorpaySignature: null,
    program: null,
    notes: null,
    receiptUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any))

  it("creates a donation with valid inputs", async () => {
    const result = await createPendingDonation({
      donationType: "one-time",
      amount: 500,
      name: "Test User",
      email: "test@example.com",
      phone: "9876543210",
    })
    expect(result.id).toBe("don_test")
    expect(prisma.donation.create).toHaveBeenCalledOnce()
  })

  it("rejects amount below minimum (< 100)", async () => {
    await expect(createPendingDonation({ donationType: "one-time", amount: 50, name: "A", email: "a@b.com", phone: "9876543210" }))
      .rejects.toThrow("100")
  })

  it("rejects amount above maximum (> 100000)", async () => {
    await expect(createPendingDonation({ donationType: "one-time", amount: 200000, name: "A", email: "a@b.com", phone: "9876543210" }))
      .rejects.toThrow("100,000")
  })

  it("rejects invalid email", async () => {
    await expect(createPendingDonation({ donationType: "one-time", amount: 500, name: "A", email: "notanemail", phone: "9876543210" }))
      .rejects.toThrow("email")
  })

  it("rejects invalid phone number (spaces only)", async () => {
    await expect(createPendingDonation({ donationType: "one-time", amount: 500, name: "A", email: "a@b.com", phone: "         " }))
      .rejects.toThrow("phone")
  })

  it("allows anonymous donation without personal details", async () => {
    const result = await createPendingDonation({ donationType: "one-time", amount: 500, anonymous: true })
    expect(result.id).toBe("don_test")
  })
})

describe("completeDonationPayment", () => {
  const baseData = { donationId: "don_1", paymentId: "pay_1", orderId: "order_1" }

  it("throws if donation not found", async () => {
    vi.mocked(prisma.donation.findUnique).mockResolvedValueOnce(null)
    await expect(completeDonationPayment(baseData)).rejects.toThrow("not found")
  })

  it("throws if donation is in failed state", async () => {
    vi.mocked(prisma.donation.findUnique).mockResolvedValueOnce({ status: "failed" } as any)
    await expect(completeDonationPayment(baseData)).rejects.toThrow("failed")
  })

  it("returns alreadyProcessed=true if already completed with same paymentId", async () => {
    vi.mocked(prisma.donation.findUnique).mockResolvedValueOnce({
      id: "don_1", status: "completed", paymentId: "pay_1",
      razorpaySignature: "sig", razorpayOrderId: "order_1",
      email: "a@b.com", amount: 500, name: "A", type: "One-time", anonymous: false,
    } as any)
    const result = await completeDonationPayment(baseData)
    expect(result.alreadyProcessed).toBe(true)
  })

  it("throws if completed with a different paymentId (double-payment guard)", async () => {
    vi.mocked(prisma.donation.findUnique).mockResolvedValueOnce({
      id: "don_1", status: "completed", paymentId: "pay_OTHER",
    } as any)
    await expect(completeDonationPayment(baseData)).rejects.toThrow("different payment")
  })

  it("marks pending donation as completed", async () => {
    vi.mocked(prisma.donation.findUnique).mockResolvedValueOnce({
      id: "don_1", status: "pending", paymentId: null,
    } as any)
    vi.mocked(prisma.donation.update).mockResolvedValueOnce({
      id: "don_1", status: "completed", paymentId: "pay_1",
      email: "a@b.com", amount: 500, name: "A", anonymous: false, type: "One-time",
    } as any)
    const result = await completeDonationPayment(baseData)
    expect(result.alreadyProcessed).toBe(false)
    expect(prisma.donation.update).toHaveBeenCalledOnce()
  })
})

describe("completeMembershipPayment", () => {
  const baseInput = {
    paymentId: "pay_mem_1",
    orderId: "order_mem_1",
    userDetails: { name: "Alice", email: "alice@example.com", phone: "9876543210" },
    membershipType: "FOSStar Annual",
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.member.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.member.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.member.upsert).mockResolvedValue({ membershipId: "FOSS12345678" } as any)
    vi.mocked(prisma.settings.findMany).mockResolvedValue([])
  })

  it("returns alreadyProcessed=true when paymentId already registered", async () => {
    vi.mocked(prisma.member.findFirst).mockResolvedValueOnce({ membershipId: "FOSS_EXISTING" } as any)
    const result = await completeMembershipPayment(baseInput)
    expect(result.alreadyProcessed).toBe(true)
    expect(result.membershipId).toBe("FOSS_EXISTING")
  })

  it("creates a new member for a new payment", async () => {
    const result = await completeMembershipPayment(baseInput)
    expect(result.alreadyProcessed).toBe(false)
    expect(prisma.member.upsert).toHaveBeenCalledOnce()
  })

  it("throws if email is missing", async () => {
    await expect(completeMembershipPayment({
      ...baseInput,
      userDetails: { ...baseInput.userDetails, email: "" },
    })).rejects.toThrow("email")
  })

  it("sets expiry date ~12 months from now for a new member", async () => {
    const before = Date.now()
    await completeMembershipPayment(baseInput)

    const upsertCall = vi.mocked(prisma.member.upsert).mock.calls.at(-1)![0]
    const expiry: Date = upsertCall.create.expiryDate
    const diffMs = expiry.getTime() - before
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    // Should be between 364 and 367 days
    expect(diffDays).toBeGreaterThan(364)
    expect(diffDays).toBeLessThan(367)
  })

  it("extends expiry from existing expiry when member renews before expiry", async () => {
    const futureExpiry = new Date()
    futureExpiry.setMonth(futureExpiry.getMonth() + 6) // 6 months left

    vi.mocked(prisma.member.findUnique).mockResolvedValueOnce({
      id: "mem_1",
      email: "alice@example.com",
      membershipId: "FOSS_OLD",
      expiryDate: futureExpiry,
      password: "hashed",
    } as any)

    await completeMembershipPayment(baseInput)

    const calls = vi.mocked(prisma.member.upsert).mock.calls
    const upsertCall = calls.at(-1)![0]
    const newExpiry: Date = upsertCall.update.expiryDate
    const diffFromFuture = newExpiry.getTime() - futureExpiry.getTime()
    const diffDays = diffFromFuture / (1000 * 60 * 60 * 24)

    // New expiry should be ~12 months after the old expiry
    expect(diffDays).toBeGreaterThan(364)
    expect(diffDays).toBeLessThan(367)
  })
})
