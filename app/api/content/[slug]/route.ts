import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch content by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const content = await prisma.content.findUnique({
      where: {
        slug,
        status: "published",
      },
    })

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    )
  }
}
