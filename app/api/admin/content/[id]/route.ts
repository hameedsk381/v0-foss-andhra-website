import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

// GET single content
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError
const content = await prisma.content.findUnique({
      where: { id: params.id },
    })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

// PUT update content
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError
const body = await request.json()

    const content = await prisma.content.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        metaDescription: body.metaDescription,
        keywords: body.keywords,
        status: body.status,
        ogTitle: body.ogTitle,
        ogDescription: body.ogDescription,
        ogImage: body.ogImage,
        twitterCard: body.twitterCard,
        focusKeyword: body.focusKeyword,
        canonicalUrl: body.canonicalUrl,
        publishedAt: body.status === "published" && !body.publishedAt ? new Date() : undefined,
      },
    })

    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

// DELETE content
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await requireAdminAccess(["admin"])
    if (authError) return authError
await prisma.content.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: "Content deleted successfully" })
  } catch (error) {
    console.error("Error deleting content:", error)
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
  }
}
