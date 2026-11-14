import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const problemSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(3000),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  sponsor: z.string().trim().max(120).optional(),
  order: z.coerce.number().int().min(0).max(99).optional(),
})

// GET - problem statements + teams for a hackathon
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: params.id },
      include: {
        ProblemStatement: { orderBy: { order: "asc" } },
        Team: { orderBy: [{ status: "asc" }, { score: "desc" }, { createdAt: "asc" }] },
      },
    })
    if (!hackathon) return NextResponse.json({ success: false, error: "Hackathon not found" }, { status: 404 })

    return NextResponse.json({ success: true, data: hackathon })
  } catch (error) {
    logError(error as Error, { context: "admin_hackathon_detail" })
    return NextResponse.json({ success: false, error: "Failed to fetch hackathon" }, { status: 500 })
  }
}

// POST - add a problem statement
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const hackathon = await prisma.hackathon.findUnique({ where: { id: params.id }, select: { id: true } })
    if (!hackathon) return NextResponse.json({ success: false, error: "Hackathon not found" }, { status: 404 })

    const parsed = problemSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const problem = await prisma.problemStatement.create({
      data: {
        hackathonId: hackathon.id,
        title: d.title,
        description: d.description,
        difficulty: d.difficulty,
        sponsor: d.sponsor || null,
        order: d.order ?? 0,
      },
    })
    return NextResponse.json({ success: true, data: problem }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "admin_hackathon_problem_create" })
    return NextResponse.json({ success: false, error: "Failed to add problem statement" }, { status: 500 })
  }
}

// DELETE - remove a problem statement (?problemId=)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const problemId = request.nextUrl.searchParams.get("problemId")
    if (!problemId) return NextResponse.json({ success: false, error: "Missing problemId" }, { status: 400 })

    const problem = await prisma.problemStatement.findFirst({
      where: { id: problemId, hackathonId: params.id },
      select: { id: true },
    })
    if (!problem) return NextResponse.json({ success: false, error: "Problem statement not found" }, { status: 404 })

    await prisma.problemStatement.delete({ where: { id: problem.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_hackathon_problem_delete" })
    return NextResponse.json({ success: false, error: "Failed to delete problem statement" }, { status: 500 })
  }
}
