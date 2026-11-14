import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "node:crypto"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { requireAdminSession } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"
import { INTERNSHIP_MONTHS, addMonthsMinusDay } from "@/lib/internship-offer"
import { sendInterviewInvite, sendOfferEmail, sendRejection } from "@/lib/careers-emails"

export const dynamic = "force-dynamic"

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("interview"),
    interviewAt: z.string().datetime({ offset: true }),
    note: z.string().trim().max(1000).optional(),
  }),
  z.object({
    action: z.literal("offer"),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be YYYY-MM-DD").optional(),
    notes: z.string().trim().max(2000).optional(),
  }),
  z.object({ action: z.literal("resend-offer") }),
  z.object({ action: z.literal("reject") }),
])

const OFFER_BLOCKED = ["rejected", "hired"]

async function nextOfferRef(prefix: string) {
  const year = new Date().getFullYear()
  const p = `${prefix}/${year}/`
  const count = await prisma.careerApplication.count({ where: { offerRef: { startsWith: p } } })
  return `${p}${String(count + 1).padStart(4, "0")}`
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSession(["editor", "admin"])
    if (authError) return authError

    const parsed = actionSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 },
      )
    }
    const input = parsed.data

    const application = await prisma.careerApplication.findUnique({
      where: { id: params.id },
      include: { CareerOpening: { select: { title: true, type: true } } },
    })
    if (!application) return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 })

    const roleTitle = application.CareerOpening?.title ?? "FOSS Andhra opportunity"
    // No opening = general application; these are offers for the internship program.
    const isInternship = !application.CareerOpening || application.CareerOpening.type === "internship"
    const who = { name: application.name, email: application.email }

    if (input.action === "reject") {
      const updated = await prisma.careerApplication.update({ where: { id: application.id }, data: { status: "rejected" } })
      const emailed = await sendRejection(who, roleTitle)
      return NextResponse.json({ success: true, emailed, data: updated })
    }

    if (input.action === "interview") {
      const at = new Date(input.interviewAt)
      if (at.getTime() < Date.now()) {
        return NextResponse.json({ success: false, error: "Interview time must be in the future" }, { status: 400 })
      }
      const updated = await prisma.careerApplication.update({
        where: { id: application.id },
        data: { status: "shortlisted", interviewAt: at, interviewNote: input.note || null },
      })
      const emailed = await sendInterviewInvite(who, roleTitle, at, input.note)
      return NextResponse.json({ success: true, emailed, data: updated })
    }

    // Offer actions: any role type. Internships (and general applications, which
    // feed the internship program) get the standard 3-month letter; other roles
    // can set a custom end date.
    if (OFFER_BLOCKED.includes(application.status)) {
      return NextResponse.json(
        { success: false, error: `Cannot issue an offer for an application marked ${application.status}` },
        { status: 400 },
      )
    }

    if (input.action === "resend-offer") {
      if (!application.offerToken || !application.offerRef || !application.startDate || !application.endDate) {
        return NextResponse.json({ success: false, error: "No offer has been issued yet" }, { status: 400 })
      }
      const emailed = await sendOfferEmail(who, roleTitle, {
        token: application.offerToken,
        ref: application.offerRef,
        startDate: application.startDate,
        endDate: application.endDate,
        isInternship,
      })
      return NextResponse.json({ success: true, emailed, data: application })
    }

    // Issue (or re-issue with new dates) the offer. A re-issue keeps the same reference and link.
    const start = new Date(`${input.startDate}T00:00:00.000Z`)
    if (Number.isNaN(start.getTime()) || start.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
      return NextResponse.json({ success: false, error: "Start date must be today or later" }, { status: 400 })
    }
    let end: Date
    if (input.endDate) {
      end = new Date(`${input.endDate}T00:00:00.000Z`)
      if (Number.isNaN(end.getTime()) || end.getTime() <= start.getTime()) {
        return NextResponse.json({ success: false, error: "End date must be after the start date" }, { status: 400 })
      }
    } else {
      end = addMonthsMinusDay(start, INTERNSHIP_MONTHS)
    }

    let updated = null
    for (let attempt = 0; attempt < 3 && !updated; attempt++) {
      try {
        updated = await prisma.careerApplication.update({
          where: { id: application.id },
          data: {
            status: "offered",
            offerRef: application.offerRef ?? (await nextOfferRef(isInternship ? "FOSSAP/INT" : "FOSSAP/OFF")),
            offerToken: application.offerToken ?? randomBytes(24).toString("hex"),
            offerIssuedAt: new Date(),
            offerNotes: input.notes || null,
            startDate: start,
            endDate: end,
            // Changed terms need a fresh acceptance
            offerAcceptedAt: null,
          },
        })
      } catch (error) {
        // Reference collision with a concurrent issue: retry with the next number
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") || attempt === 2) throw error
      }
    }
    if (!updated?.offerToken || !updated.offerRef) throw new Error("Offer was not saved")

    const emailed = await sendOfferEmail(who, roleTitle, {
      token: updated.offerToken,
      ref: updated.offerRef,
      startDate: start,
      endDate: end,
      isInternship,
    })
    return NextResponse.json({ success: true, emailed, data: updated })
  } catch (error) {
    logError(error as Error, { context: "career_application_action" })
    return NextResponse.json({ success: false, error: "Action failed" }, { status: 500 })
  }
}
