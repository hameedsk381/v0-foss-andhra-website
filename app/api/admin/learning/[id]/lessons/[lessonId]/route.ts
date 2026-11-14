import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  summary: z.string().trim().max(300).optional(),
  content: z.string().trim().min(20).max(50000).optional(),
  durationMin: z.coerce.number().int().min(1).max(600).optional(),
  status: z.enum(["draft", "published"]).optional(),
  order: z.coerce.number().int().min(0).max(999).optional(),
})

// PUT - edit a lesson (slug stays stable so public URLs never break)
export async function PUT(request: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const lesson = await prisma.learningLesson.findUnique({
      where: { id: params.lessonId },
      select: { id: true, trackId: true },
    })
    if (!lesson || lesson.trackId !== params.id) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 })
    }

    const parsed = updateSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const data: Record<string, unknown> = {}
    for (const key of ["title", "summary", "content", "durationMin", "status", "order"] as const) {
      if (d[key] !== undefined) data[key] = key === "summary" ? (d[key] || null) : d[key]
    }

    const updated = await prisma.learningLesson.update({ where: { id: lesson.id }, data })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    logError(error as Error, { context: "admin_learning_update_lesson" })
    return NextResponse.json({ success: false, error: "Failed to update lesson" }, { status: 500 })
  }
}

// DELETE - remove a lesson (progress rows cascade)
export async function DELETE(request: NextRequest, { params }: { params: { id: string; lessonId: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const lesson = await prisma.learningLesson.findUnique({
      where: { id: params.lessonId },
      select: { id: true, trackId: true },
    })
    if (!lesson || lesson.trackId !== params.id) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 })
    }

    await prisma.learningLesson.delete({ where: { id: lesson.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_learning_delete_lesson" })
    return NextResponse.json({ success: false, error: "Failed to delete lesson" }, { status: 500 })
  }
}
