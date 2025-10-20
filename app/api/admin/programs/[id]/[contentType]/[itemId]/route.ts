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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; contentType: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId, contentType } = params
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

    const item = await model.update({
      where: { id: itemId },
      data: processedData,
    })

    return NextResponse.json({ data: item })
  } catch (error) {
    console.error("PATCH error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; contentType: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId, contentType } = params
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

    await model.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
