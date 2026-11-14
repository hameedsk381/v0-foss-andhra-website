import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const registerSchema = z.object({
  teamName: z.string().trim().min(2, "Team name is too short").max(120),
  leaderName: z.string().trim().min(2, "Leader name is too short").max(120),
  leaderEmail: z.string().trim().email("Enter a valid email").max(200),
  college: z.string().trim().max(200).optional().or(z.literal("")),
  size: z.coerce.number().int().min(1, "Teams need at least 1 member").max(6, "Max team size is 6"),
  memberNames: z.string().trim().max(1000).optional().or(z.literal("")),
  problemStatementId: z.string().trim().optional().or(z.literal("")),
})

// Public team registration -> pending review
export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const hackathon = await prisma.hackathon.findUnique({ where: { slug: params.slug }, select: { id: true, status: true, regDeadline: true } })
    if (!hackathon || hackathon.status === "draft") {
      return NextResponse.json({ success: false, error: "Hackathon not found" }, { status: 404 })
    }
    if (hackathon.status !== "registration_open") {
      return NextResponse.json({ success: false, error: "Registration is closed for this hackathon." }, { status: 400 })
    }
    if (hackathon.regDeadline && hackathon.regDeadline.getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: "The registration deadline has passed." }, { status: 400 })
    }

    const parsed = registerSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    if (d.problemStatementId) {
      const ps = await prisma.problemStatement.findFirst({
        where: { id: d.problemStatementId, hackathonId: hackathon.id },
        select: { id: true },
      })
      if (!ps) {
        return NextResponse.json({ success: false, error: "Invalid problem statement" }, { status: 400 })
      }
    }

    const duplicate = await prisma.team.findFirst({
      where: { hackathonId: hackathon.id, leaderEmail: { equals: d.leaderEmail.toLowerCase() } },
      select: { id: true },
    })
    if (duplicate) {
      return NextResponse.json(
        { success: false, error: "A team with this leader email is already registered for this hackathon." },
        { status: 409 },
      )
    }

    const team = await prisma.team.create({
      data: {
        hackathonId: hackathon.id,
        name: d.teamName,
        leaderName: d.leaderName,
        leaderEmail: d.leaderEmail.toLowerCase(),
        college: d.college || null,
        size: d.size,
        memberNames: d.memberNames || null,
        problemStatementId: d.problemStatementId || null,
        status: "pending",
      },
      select: { id: true },
    })
    return NextResponse.json({ success: true, data: team }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "hackathon_register" })
    return NextResponse.json({ success: false, error: "Failed to register team" }, { status: 500 })
  }
}
