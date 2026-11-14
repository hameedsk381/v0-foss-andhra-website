import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { slugify } from "@/lib/careers"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const lessonSchema = z.object({
  title: z.string().trim().min(3).max(200),
  summary: z.string().trim().max(300).optional(),
  content: z.string().trim().min(20, "Lesson content is too short").max(50000),
  durationMin: z.coerce.number().int().min(1).max(600).default(10),
  status: z.enum(["draft", "published"]).default("draft"),
  order: z.coerce.number().int().min(0).max(999).optional(),
})

// POST - create a lesson inside a track
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const track = await prisma.learningTrack.findUnique({ where: { id: params.id }, select: { id: true } })
    if (!track) return NextResponse.json({ success: false, error: "Track not found" }, { status: 404 })

    const parsed = lessonSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const base = slugify(d.title) || "lesson"
    let slug = base
    let n = 2
    while (
      await prisma.learningLesson.findUnique({ where: { trackId_slug: { trackId: track.id, slug } }, select: { id: true } })
    ) {
      slug = `${base}-${n++}`
    }

    const lesson = await prisma.learningLesson.create({
      data: {
        trackId: track.id,
        slug,
        title: d.title,
        summary: d.summary || null,
        content: d.content,
        durationMin: d.durationMin,
        status: d.status,
        order: d.order ?? 0,
      },
    })
    return NextResponse.json({ success: true, data: lesson }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "admin_learning_create_lesson" })
    return NextResponse.json({ success: false, error: "Failed to create lesson" }, { status: 500 })
  }
}
