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
        { error: "Invalid content type" },
        { status: 400 }
      )
    }

    const model = (prisma as any)[modelName]
    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    const data = await model.findMany({
      where: { programId: id },
      orderBy: { order: "asc" },
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
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
        { error: "Invalid content type" },
        { status: 400 }
      )
    }

    const model = (prisma as any)[modelName]
    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    const body = await request.json()

    // Parse JSON fields if they're strings
    const processedData = { ...body }
    for (const key in processedData) {
      if (
        typeof processedData[key] === "string" &&
        (key === "metrics" ||
          key === "technologies" ||
          key === "features" ||
          processedData[key].startsWith("{") ||
          processedData[key].startsWith("["))
      ) {
        try {
          processedData[key] = JSON.parse(processedData[key])
        } catch {
          // Keep as string if not valid JSON
        }
      }
    }

    // Get the highest order value and add 1
    const maxOrder = await model.findFirst({
      where: { programId: id },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const nextOrder = maxOrder?.order !== undefined ? maxOrder.order + 1 : 0

    const item = await model.create({
      data: {
        ...processedData,
        programId: id,
        active: true,
        order: nextOrder,
      },
    })

    return NextResponse.json({ data: item }, { status: 201 })
  } catch (error) {
    console.error("POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
