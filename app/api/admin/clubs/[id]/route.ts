import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { slugify } from "@/lib/careers"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  name: z.string().trim().min(3).max(150).optional(),
  institution: z.string().trim().min(3).max(200).optional(),
  location: z.string().trim().min(2).max(120).optional(),
  members: z.coerce.number().int().min(0).max(100000).optional(),
  established: z.string().trim().max(20).optional(),
  description: z.string().trim().max(1000).optional(),
  contact: z.string().trim().max(200).optional(),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  coordinatorName: z.string().trim().max(120).optional(),
  coordinatorPhone: z.string().trim().max(30).optional(),
  githubUrl: z.string().trim().url().max(300).optional().or(z.literal("")),
  websiteUrl: z.string().trim().url().max(300).optional().or(z.literal("")),
  logo: z.string().trim().max(500).optional(),
  programId: z.string().trim().optional().or(z.literal("")),
  action: z.enum(["approve", "reject", "restore"]).optional(),
})

async function uniqueSlug(base: string, excludeId?: string) {
  const candidate = slugify(base) || "club"
  let slug = candidate
  let n = 2
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.programClub.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    slug = `${candidate}-${n++}`
  }
}

// PUT - edit a club, or approve/reject/restore it
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = updateSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const existing = await prisma.programClub.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ success: false, error: "Club not found" }, { status: 404 })

    const data: Record<string, unknown> = {}
    const assign = (key: string, value: unknown) => {
      if (value !== undefined) data[key] = value === "" ? null : value
    }
    assign("name", d.name)
    assign("institution", d.institution)
    assign("location", d.location)
    if (d.members !== undefined) data.members = d.members
    assign("established", d.established)
    assign("description", d.description)
    assign("contact", d.contact)
    assign("email", d.email?.toLowerCase())
    assign("coordinatorName", d.coordinatorName)
    assign("coordinatorPhone", d.coordinatorPhone)
    assign("githubUrl", d.githubUrl)
    assign("websiteUrl", d.websiteUrl)
    assign("logo", d.logo)
    assign("programId", d.programId)

    if (d.action === "approve") {
      data.status = "approved"
      data.active = true
      // Assign a public slug on first approval
      if (!existing.slug) {
        data.slug = await uniqueSlug(`${existing.institution || existing.name}`, existing.id)
      }
    } else if (d.action === "reject") {
      data.status = "rejected"
      data.active = false
    } else if (d.action === "restore") {
      data.status = "approved"
      data.active = true
    }

    // Slug is assigned once at first approval and then kept stable so public links never break

    const club = await prisma.programClub.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, data: club })
  } catch (error) {
    logError(error as Error, { context: "admin_clubs_update" })
    return NextResponse.json({ success: false, error: "Failed to update club" }, { status: 500 })
  }
}

// DELETE - permanently remove a club record
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const existing = await prisma.programClub.findUnique({ where: { id: params.id }, select: { id: true } })
    if (!existing) return NextResponse.json({ success: false, error: "Club not found" }, { status: 404 })

    await prisma.programClub.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_clubs_delete" })
    return NextResponse.json({ success: false, error: "Failed to delete club" }, { status: 500 })
  }
}
