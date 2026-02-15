import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; contentType: string } }
) {
  try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError
const { contentType } = params
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
    const { items } = body // Array of { id: string, order: number }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      )
    }

    // Update all items with new order in a transaction
    await prisma.$transaction(
      items.map((item) =>
        model.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reorder error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
