import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { slugify } from "@/lib/careers"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const trackSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(10).max(1000),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  estimatedHours: z.coerce.number().int().min(1).max(1000).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  order: z.coerce.number().int().min(0).max(999).optional(),
})

// GET - all tracks with their lessons (admin view: includes drafts)
export async function GET() {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const tracks = await prisma.learningTrack.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { LearningLesson: { orderBy: { order: "asc" } } },
    })
    return NextResponse.json({ success: true, data: tracks })
  } catch (error) {
    logError(error as Error, { context: "admin_learning_list" })
    return NextResponse.json({ success: false, error: "Failed to fetch tracks" }, { status: 500 })
  }
}

// POST - create a track (slug derived from title, unique-safe)
export async function POST(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = trackSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const base = slugify(d.title) || "track"
    let slug = base
    let n = 2
    while (await prisma.learningTrack.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${base}-${n++}`
    }

    const track = await prisma.learningTrack.create({
      data: {
        slug,
        title: d.title,
        description: d.description,
        level: d.level,
        estimatedHours: d.estimatedHours ?? null,
        status: d.status,
        order: d.order ?? 0,
      },
    })
    return NextResponse.json({ success: true, data: track }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "admin_learning_create_track" })
    return NextResponse.json({ success: false, error: "Failed to create track" }, { status: 500 })
  }
}
