import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET all content
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const content = await prisma.content.findMany({
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

// POST create content
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      type, 
      slug, 
      title, 
      content, 
      metaDescription, 
      keywords, 
      status,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      focusKeyword,
      canonicalUrl,
    } = body

    const newContent = await prisma.content.create({
      data: {
        type,
        slug,
        title,
        content,
        metaDescription,
        keywords,
        status,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard,
        focusKeyword,
        canonicalUrl,
        author: (session.user as any).id,
        publishedAt: status === "published" ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true, data: newContent })
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}
