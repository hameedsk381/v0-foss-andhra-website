import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  title: z.string().trim().min(3).max(150).optional(),
  description: z.string().trim().min(10).max(1000).optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  estimatedHours: z.coerce.number().int().min(1).max(1000).optional().or(z.literal("").transform(() => undefined)),
  status: z.enum(["draft", "published"]).optional(),
  order: z.coerce.number().int().min(0).max(999).optional(),
})

// PUT - edit a track (slug stays stable so public URLs never break)
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
    for (const key of ["title", "description", "level", "status", "order"] as const) {
      if (d[key] !== undefined) data[key] = d[key]
    }
    if (d.estimatedHours !== undefined) data.estimatedHours = d.estimatedHours

    const track = await prisma.learningTrack.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, data: track })
  } catch (error) {
    logError(error as Error, { context: "admin_learning_update_track" })
    return NextResponse.json({ success: false, error: "Failed to update track" }, { status: 500 })
  }
}

// DELETE - remove a track (lessons cascade)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const existing = await prisma.learningTrack.findUnique({ where: { id: params.id }, select: { id: true } })
    if (!existing) return NextResponse.json({ success: false, error: "Track not found" }, { status: 404 })

    await prisma.learningTrack.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_learning_delete_track" })
    return NextResponse.json({ success: false, error: "Failed to delete track" }, { status: 500 })
  }
}
