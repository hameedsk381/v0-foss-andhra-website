import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  name: z.string().trim().min(3).max(120).optional(),
  headline: z.string().trim().min(10).max(150).optional(),
  expertise: z.string().trim().min(3).max(300).optional(),
  bio: z.string().trim().max(1000).optional(),
  githubUrl: z.string().trim().url().max(300).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url().max(300).optional().or(z.literal("")),
  availability: z.string().trim().max(200).optional(),
  maxMentees: z.coerce.number().int().min(1).max(10).optional(),
  action: z.enum(["approve", "reject", "restore"]).optional(),
})

// GET - all mentors (admin view, includes pending)
export async function GET(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const status = request.nextUrl.searchParams.get("status")?.trim()
    const mentors = await prisma.mentorProfile.findMany({
      where: status && status !== "all" ? { status } : {},
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { MentorshipRequest: { select: { id: true, status: true } } },
      take: 500,
    })
    return NextResponse.json({ success: true, data: mentors })
  } catch (error) {
    logError(error as Error, { context: "admin_mentors_list" })
    return NextResponse.json({ success: false, error: "Failed to fetch mentors" }, { status: 500 })
  }
}

// PUT - edit a mentor, or approve/reject/restore
export async function PUT(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const body = await request.json()
    const id = String(body.id ?? "")
    if (!id) return NextResponse.json({ success: false, error: "Missing mentor id" }, { status: 400 })

    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const data: Record<string, unknown> = {}
    const assign = (key: string, value: unknown) => {
      if (value !== undefined) data[key] = value === "" ? null : value
    }
    assign("name", d.name)
    assign("headline", d.headline)
    assign("expertise", d.expertise)
    assign("bio", d.bio)
    assign("githubUrl", d.githubUrl)
    assign("linkedinUrl", d.linkedinUrl)
    assign("availability", d.availability)
    if (d.maxMentees !== undefined) data.maxMentees = d.maxMentees
    if (d.action === "approve") data.status = "approved"
    else if (d.action === "reject") data.status = "rejected"
    else if (d.action === "restore") data.status = "approved"

    const mentor = await prisma.mentorProfile.update({ where: { id }, data })
    return NextResponse.json({ success: true, data: mentor })
  } catch (error) {
    logError(error as Error, { context: "admin_mentors_update" })
    return NextResponse.json({ success: false, error: "Failed to update mentor" }, { status: 500 })
  }
}

// DELETE - remove a mentor (requests keep mentorId via SetNull)
export async function DELETE(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const id = request.nextUrl.searchParams.get("id")
    if (!id) return NextResponse.json({ success: false, error: "Missing mentor id" }, { status: 400 })

    const existing = await prisma.mentorProfile.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return NextResponse.json({ success: false, error: "Mentor not found" }, { status: 404 })

    await prisma.mentorProfile.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_mentors_delete" })
    return NextResponse.json({ success: false, error: "Failed to delete mentor" }, { status: 500 })
  }
}
