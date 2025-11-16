import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch single program with all content (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params

    const program = await prisma.program.findFirst({
      where: {
        OR: [
          { name: name },
          { id: name },
        ],
        status: "active",
      },
      include: {
        initiatives: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
        team: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
        casestudies: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
        clubs: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
        projects: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
        startups: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
        repositories: {
          where: { active: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: program })
  } catch (error) {
    console.error("Error fetching program:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch program" },
      { status: 500 }
    )
  }
}
