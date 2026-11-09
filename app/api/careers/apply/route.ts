import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { strictRateLimit, getRateLimitIdentifier } from "@/lib/rate-limit"
import { logError, logInfo } from "@/lib/logger"
import { isOpeningAcceptingApplications, requiresMembership } from "@/lib/careers"
import { getCurrentMember } from "@/lib/member/session"

export const dynamic = "force-dynamic"

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^https?:\/\/\S+$/i.test(v), "Must be a valid http(s) link")

const applySchema = z.object({
  openingId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Invalid email address").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s()-]{6,18}[0-9]$/, "Invalid phone number"),
  resumeUrl: optionalUrl,
  profileUrl: optionalUrl,
  coverLetter: z.string().trim().max(4000).optional(),
})

// POST - public application endpoint
export async function POST(request: NextRequest) {
  try {
    const identifier = getRateLimitIdentifier(request)
    await strictRateLimit.check(request, 5, identifier)

    const parsed = applySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }
    const data = parsed.data
    let email = data.email.toLowerCase()

    if (data.openingId) {
      const opening = await prisma.careerOpening.findUnique({
        where: { id: data.openingId },
        select: { status: true, applyDeadline: true, type: true },
      })
      if (!opening || !isOpeningAcceptingApplications(opening)) {
        return NextResponse.json({ error: "This opening is no longer accepting applications" }, { status: 400 })
      }

      // Internships are for active FOSStar members only; applications use the member's own email.
      if (requiresMembership(opening.type)) {
        const member = await getCurrentMember()
        if (!member) {
          return NextResponse.json({ error: "Please log in as a FOSStar member to apply for internships" }, { status: 401 })
        }
        if (!member.active) {
          return NextResponse.json({ error: "Your FOSStar membership has expired. Renew it to apply" }, { status: 403 })
        }
        email = member.email.trim().toLowerCase()
      }
    }

    const duplicate = await prisma.careerApplication.findFirst({
      where: { email: { equals: email, mode: "insensitive" }, openingId: data.openingId ?? null },
      select: { id: true },
    })
    if (duplicate) {
      return NextResponse.json({ error: "You have already applied for this" }, { status: 400 })
    }

    const application = await prisma.careerApplication.create({
      data: {
        openingId: data.openingId ?? null,
        name: data.name,
        email,
        phone: data.phone,
        resumeUrl: data.resumeUrl,
        profileUrl: data.profileUrl,
        coverLetter: data.coverLetter || undefined,
      },
      select: { id: true },
    })

    logInfo("Career application submitted", { applicationId: application.id, openingId: data.openingId })
    return NextResponse.json({ success: true, message: "Application submitted successfully" }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    logError(error as Error, { context: "career_application" })
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
