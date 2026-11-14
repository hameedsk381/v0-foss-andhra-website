import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  city: z.string().trim().min(2).max(100).optional(),
  district: z.string().trim().max(100).optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  meetingInfo: z.string().trim().max(500).optional(),
  coordinators: z.string().trim().max(300).optional(),
  contactEmail: z.string().trim().email().max(200).optional().or(z.literal("")),
  whatsappUrl: z.string().trim().url().max(300).optional().or(z.literal("")),
  telegramUrl: z.string().trim().url().max(300).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).optional(),
  order: z.coerce.number().int().min(0).max(999).optional(),
})

// PUT - edit a chapter (slug stays stable so public URLs never break)
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

    const data: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(d)) {
      if (value === undefined) continue
      data[key] = value === "" && ["district", "meetingInfo", "coordinators", "contactEmail", "whatsappUrl", "telegramUrl"].includes(key) ? null : value
    }

    const chapter = await prisma.chapter.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, data: chapter })
  } catch (error) {
    logError(error as Error, { context: "admin_chapters_update" })
    return NextResponse.json({ success: false, error: "Failed to update chapter" }, { status: 500 })
  }
}

// DELETE - remove a chapter
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const existing = await prisma.chapter.findUnique({ where: { id: params.id }, select: { id: true } })
    if (!existing) return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 })

    await prisma.chapter.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_chapters_delete" })
    return NextResponse.json({ success: false, error: "Failed to delete chapter" }, { status: 500 })
  }
}
