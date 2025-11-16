import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all active programs (public)
export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      where: { status: "active" },
      include: {
        _count: {
          select: {
            initiatives: true,
            team: true,
            casestudies: true,
            clubs: true,
            projects: true,
            startups: true,
            repositories: true,
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    })

    return NextResponse.json({ success: true, data: programs })
  } catch (error) {
    console.error("Error fetching programs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch programs" },
      { status: 500 }
    )
  }
}
