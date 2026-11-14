import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  mentorId: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["pending", "accepted", "declined", "completed", "cancelled"]).optional(),
  adminNotes: z.string().trim().max(2000).optional(),
})

// GET - all mentorship requests
export async function GET(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const status = request.nextUrl.searchParams.get("status")?.trim()
    const requests = await prisma.mentorshipRequest.findMany({
      where: status && status !== "all" ? { status } : {},
      orderBy: { createdAt: "desc" },
      include: { MentorProfile: { select: { id: true, name: true } } },
      take: 500,
    })
    return NextResponse.json({ success: true, data: requests })
  } catch (error) {
    logError(error as Error, { context: "admin_mentor_requests_list" })
    return NextResponse.json({ success: false, error: "Failed to fetch requests" }, { status: 500 })
  }
}

// PUT - match a request to a mentor, change status, add notes
export async function PUT(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const body = await request.json()
    const id = String(body.id ?? "")
    if (!id) return NextResponse.json({ success: false, error: "Missing request id" }, { status: 400 })

    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const data: Record<string, unknown> = {}
    if (d.mentorId !== undefined) {
      if (d.mentorId === "") {
        data.mentorId = null
      } else {
        const mentor = await prisma.mentorProfile.findFirst({
          where: { id: d.mentorId, status: "approved" },
          select: { id: true },
        })
        if (!mentor) {
          return NextResponse.json({ success: false, error: "Mentor not found or not approved" }, { status: 400 })
        }
        data.mentorId = mentor.id
      }
    }
    if (d.status !== undefined) data.status = d.status
    if (d.adminNotes !== undefined) data.adminNotes = d.adminNotes || null

    // Matching a request also flips it to accepted unless another status given
    if (data.mentorId && d.status === undefined) data.status = "accepted"

    const req = await prisma.mentorshipRequest.update({ where: { id }, data })
    return NextResponse.json({ success: true, data: req })
  } catch (error) {
    logError(error as Error, { context: "admin_mentor_requests_update" })
    return NextResponse.json({ success: false, error: "Failed to update request" }, { status: 500 })
  }
}

// DELETE - remove a request
export async function DELETE(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const id = request.nextUrl.searchParams.get("id")
    if (!id) return NextResponse.json({ success: false, error: "Missing request id" }, { status: 400 })

    const existing = await prisma.mentorshipRequest.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 })

    await prisma.mentorshipRequest.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_mentor_requests_delete" })
    return NextResponse.json({ success: false, error: "Failed to delete request" }, { status: 500 })
  }
}
