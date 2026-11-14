import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCurrentMember } from "@/lib/member/session"
import { isMembershipActive } from "@/lib/member/tiers"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const requestSchema = z.object({
  mentorId: z.string().trim().optional().or(z.literal("")),
  goals: z.string().trim().min(20, "Describe what you want to work on (at least a sentence or two)").max(2000),
  background: z.string().trim().max(1000).optional().or(z.literal("")),
})

// Public mentorship request — active FOSStar members only (membership policy)
export async function POST(request: NextRequest) {
  try {
    const member = await getCurrentMember()
    if (!member) {
      return NextResponse.json(
        { success: false, error: "Sign in with your FOSStar account to request mentorship." },
        { status: 401 },
      )
    }
    if (!member.active) {
      return NextResponse.json(
        { success: false, error: "Your membership has expired. Renew at fossap.in/member/membership to request mentorship." },
        { status: 403 },
      )
    }

    const parsed = requestSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    if (d.mentorId) {
      const mentor = await prisma.mentorProfile.findFirst({
        where: { id: d.mentorId, status: "approved" },
        select: { id: true },
      })
      if (!mentor) {
        return NextResponse.json({ success: false, error: "That mentor is not currently accepting requests." }, { status: 400 })
      }
    }

    // One open request per member at a time
    const open = await prisma.mentorshipRequest.findFirst({
      where: { memberId: member.id, status: { in: ["pending", "accepted"] } },
      select: { id: true },
    })
    if (open) {
      return NextResponse.json(
        { success: false, error: "You already have an open mentorship request. Our team is reviewing it." },
        { status: 409 },
      )
    }

    const req = await prisma.mentorshipRequest.create({
      data: {
        memberId: member.id,
        name: member.name,
        email: member.email.toLowerCase(),
        mentorId: d.mentorId || null,
        goals: d.goals,
        background: d.background || null,
        status: "pending",
      },
      select: { id: true },
    })
    return NextResponse.json({ success: true, data: req }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "mentors_request" })
    return NextResponse.json({ success: false, error: "Failed to submit request" }, { status: 500 })
  }
}

// GET - the signed-in member's own request state (for the form UI)
export async function GET() {
  try {
    const member = await getCurrentMember()
    if (!member) return NextResponse.json({ success: true, data: null })
    if (!isMembershipActive(member)) return NextResponse.json({ success: true, data: null })

    const open = await prisma.mentorshipRequest.findFirst({
      where: { memberId: member.id, status: { in: ["pending", "accepted"] } },
      select: { id: true, status: true, createdAt: true },
    })
    return NextResponse.json({ success: true, data: open })
  } catch (error) {
    logError(error as Error, { context: "mentors_request_get" })
    return NextResponse.json({ success: false, error: "Failed to load request" }, { status: 500 })
  }
}
