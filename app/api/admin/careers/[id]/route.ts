import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { slugify } from "@/lib/careers"
import { openingSchema } from "@/lib/careers-schema"

export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const existing = await prisma.careerOpening.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ success: false, error: "Opening not found" }, { status: 404 })

    const parsed = openingSchema.partial().safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }
    const data = parsed.data

    let slug: string | undefined
    if (data.slug !== undefined) {
      slug = slugify(data.slug)
      if (!slug) return NextResponse.json({ success: false, error: "A valid slug is required" }, { status: 400 })
      const clash = await prisma.careerOpening.findUnique({ where: { slug }, select: { id: true } })
      if (clash && clash.id !== params.id) {
        return NextResponse.json({ success: false, error: "An opening with this slug already exists" }, { status: 409 })
      }
    }

    const opening = await prisma.careerOpening.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(slug ? { slug } : {}),
        ...(data.status === "open" && !existing.publishedAt ? { publishedAt: new Date() } : {}),
      },
    })
    return NextResponse.json({ success: true, data: opening })
  } catch (error) {
    console.error("Error updating career opening:", error)
    return NextResponse.json({ success: false, error: "Failed to update opening" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["admin"])
    if (authError) return authError

    // Applications are kept (openingId is set to null) so applicant records aren't lost.
    await prisma.careerOpening.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting career opening:", error)
    return NextResponse.json({ success: false, error: "Failed to delete opening" }, { status: 500 })
  }
}
