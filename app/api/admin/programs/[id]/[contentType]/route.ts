import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Map content type IDs to Prisma model names
const contentTypeModelMap: Record<string, string> = {
  initiatives: "programInitiative",
  team: "programTeamMember",
  clubs: "programClub",
  projects: "programProject",
  casestudies: "programCaseStudy",
  startups: "programStartup",
  repositories: "programRepository",
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; contentType: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, contentType } = params
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

    const model = (prisma as any)[modelName]
    if (!model) {
      return NextResponse.json(
        { success: false, error: "Model not found" },
        { status: 404 }
      )
    }

    // Verify program exists (support both UUID and name)
    const program = await prisma.program.findFirst({
      where: {
        OR: [
          { id },
          { name: id },
        ],
      },
    })

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      )
    }

    const data = await model.findMany({
      where: { programId: program.id },
      orderBy: { order: "asc" },
    })

    return NextResponse.json({ 
      success: true,
      data,
      count: data.length,
      program: {
        id: program.id,
        name: program.name,
        title: program.title,
      },
    })
  } catch (error) {
    console.error("GET error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; contentType: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, contentType } = params
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

    const model = (prisma as any)[modelName]
    if (!model) {
      return NextResponse.json(
        { success: false, error: "Model not found" },
        { status: 404 }
      )
    }

    // Verify program exists (support both UUID and name)
    const program = await prisma.program.findFirst({
      where: {
        OR: [
          { id },
          { name: id },
        ],
      },
    })

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Validate required fields based on content type
    const requiredFields: Record<string, string[]> = {
      initiatives: ["title", "description"],
      team: ["name", "role"],
      clubs: ["name", "location", "institution"],
      projects: ["name", "description"],
      casestudies: ["title", "description"],
      startups: ["name", "description", "founded"],
      repositories: ["name", "description"],
    }

    const required = requiredFields[contentType] || []
    const missing = required.filter(field => !body[field])

    if (missing.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Process JSON fields
    const processedData = { ...body }
    const jsonFields = ["metrics", "technologies", "features"]
    
    for (const key in processedData) {
      if (jsonFields.includes(key) || typeof processedData[key] === "string") {
        if (
          typeof processedData[key] === "string" &&
          (processedData[key].startsWith("{") || processedData[key].startsWith("["))
        ) {
          try {
            processedData[key] = JSON.parse(processedData[key])
          } catch {
            // Keep as string if not valid JSON
          }
        }
      }
    }

    // Get the highest order value and add 1
    const maxOrder = await model.findFirst({
      where: { programId: program.id },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const nextOrder = maxOrder?.order !== undefined ? maxOrder.order + 1 : 0

    const item = await model.create({
      data: {
        ...processedData,
        programId: program.id,
        active: processedData.active !== undefined ? processedData.active : true,
        order: nextOrder,
      },
    })

    return NextResponse.json({ 
      success: true,
      data: item,
      message: `${contentType} item created successfully`,
    }, { status: 201 })
  } catch (error) {
    console.error("POST error:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    )
  }
}
