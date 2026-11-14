import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getCurrentMember } from "@/lib/member/session"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const toggleSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
})

// GET - the logged-in member's completed lesson ids
export async function GET() {
  try {
    const member = await getCurrentMember()
    if (!member) return NextResponse.json({ success: true, data: { lessonIds: [] } })

    const rows = await prisma.learningProgress.findMany({
      where: { memberId: member.id },
      select: { lessonId: true },
    })
    return NextResponse.json({ success: true, data: { lessonIds: rows.map((r) => r.lessonId) } })
  } catch (error) {
    logError(error as Error, { context: "learn_progress_get" })
    return NextResponse.json({ success: false, error: "Failed to load progress" }, { status: 500 })
  }
}

// POST - mark / unmark a lesson complete (FOSStar members only)
export async function POST(request: NextRequest) {
  try {
    const member = await getCurrentMember()
    if (!member) {
      return NextResponse.json({ success: false, error: "Sign in with your FOSStar membership to track progress." }, { status: 401 })
    }

    const parsed = toggleSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 })
    }
    const { lessonId, completed } = parsed.data

    const lesson = await prisma.learningLesson.findUnique({
      where: { id: lessonId },
      select: { id: true, status: true },
    })
    if (!lesson || lesson.status !== "published") {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 })
    }

    if (completed) {
      await prisma.learningProgress.upsert({
        where: { memberId_lessonId: { memberId: member.id, lessonId } },
        create: { memberId: member.id, lessonId },
        update: {},
      })
    } else {
      await prisma.learningProgress.deleteMany({ where: { memberId: member.id, lessonId } })
    }
    return NextResponse.json({ success: true, data: { completed } })
  } catch (error) {
    logError(error as Error, { context: "learn_progress_toggle" })
    return NextResponse.json({ success: false, error: "Failed to save progress" }, { status: 500 })
  }
}
