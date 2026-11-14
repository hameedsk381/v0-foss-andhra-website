import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const teamUpdateSchema = z.object({
  teamId: z.string().min(1),
  name: z.string().trim().min(2).max(120).optional(),
  college: z.string().trim().max(200).optional(),
  size: z.coerce.number().int().min(1).max(6).optional(),
  problemStatementId: z.string().trim().optional().or(z.literal("")),
  submissionUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  submissionNote: z.string().trim().max(2000).optional(),
  score: z.coerce.number().int().min(0).max(100).optional(),
  judgeNotes: z.string().trim().max(2000).optional(),
  action: z.enum(["approve", "reject", "restore"]).optional(),
})

// PUT - review a team: approve/reject, record submission, score and judge notes
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = teamUpdateSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const team = await prisma.team.findFirst({
      where: { id: d.teamId, hackathonId: params.id },
      select: { id: true },
    })
    if (!team) return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 })

    const data: Record<string, unknown> = {}
    const assign = (key: string, value: unknown) => {
      if (value !== undefined) data[key] = value === "" ? null : value
    }
    assign("name", d.name)
    assign("college", d.college)
    if (d.size !== undefined) data.size = d.size
    if (d.problemStatementId !== undefined) data.problemStatementId = d.problemStatementId || null
    assign("submissionUrl", d.submissionUrl)
    assign("submissionNote", d.submissionNote)
    if (d.submissionUrl) data.submittedAt = new Date()
    assign("judgeNotes", d.judgeNotes)
    if (d.score !== undefined) data.score = d.score
    if (d.action === "approve") data.status = "approved"
    else if (d.action === "reject") data.status = "rejected"
    else if (d.action === "restore") data.status = "approved"

    const updated = await prisma.team.update({ where: { id: team.id }, data })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    logError(error as Error, { context: "admin_hackathon_team_update" })
    return NextResponse.json({ success: false, error: "Failed to update team" }, { status: 500 })
  }
}

// DELETE - remove a team (?teamId=)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const teamId = request.nextUrl.searchParams.get("teamId")
    if (!teamId) return NextResponse.json({ success: false, error: "Missing teamId" }, { status: 400 })

    const team = await prisma.team.findFirst({
      where: { id: teamId, hackathonId: params.id },
      select: { id: true },
    })
    if (!team) return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 })

    await prisma.team.delete({ where: { id: team.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_hackathon_team_delete" })
    return NextResponse.json({ success: false, error: "Failed to delete team" }, { status: 500 })
  }
}
