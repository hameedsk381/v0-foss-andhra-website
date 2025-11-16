import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Map content type URLs to Prisma model names
const contentTypeModelMap: Record<string, string> = {
  initiatives: "programInitiative",
  team: "programTeamMember",
  clubs: "programClub",
  projects: "programProject",
  casestudies: "programCaseStudy",
  startups: "programStartup",
  repositories: "programRepository",
}

// GET - Fetch specific content type for a program (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string; contentType: string } }
) {
  try {
    const { name, contentType } = params
    const modelName = contentTypeModelMap[contentType]

    if (!modelName) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid content type: ${contentType}`,
          validTypes: Object.keys(contentTypeModelMap),
        },
        { status: 400 }
      )
    }

    // Find the program first
    const program = await prisma.program.findFirst({
      where: {
        OR: [{ name }, { id: name }],
        status: "active",
      },
    })

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      )
    }

    // Get the content
    const model = (prisma as any)[modelName]
    const content = await model.findMany({
      where: {
        programId: program.id,
        active: true,
      },
      orderBy: { order: "asc" },
    })

    return NextResponse.json({
      success: true,
      data: content,
      program: {
        id: program.id,
        name: program.name,
        title: program.title,
      },
    })
  } catch (error) {
    console.error("Error fetching program content:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    )
  }
}
