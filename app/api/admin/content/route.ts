import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/auth/admin"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET all content
export async function GET(request: NextRequest) {
  try {
    const { authError } = await requireAdminSession(["viewer", "editor", "admin"])
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit")

    // Build where clause
    const where: any = {}

    if (type && type !== "all") {
      where.type = type
    }

    if (status && status !== "all") {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const content = await prisma.content.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({
      success: true,
      data: content,
      count: content.length,
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch content"
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

// POST create content
export async function POST(request: NextRequest) {
  try {
    const { session, authError } = await requireAdminSession(["editor", "admin"])
    if (authError) return authError

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.slug || !body.type) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, slug, and type are required"
        },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingContent = await prisma.content.findUnique({
      where: { slug: body.slug },
    })

    if (existingContent) {
      return NextResponse.json(
        { success: false, error: "Content with this slug already exists" },
        { status: 409 }
      )
    }

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
      twitterTitle,
      twitterDescription,
      twitterImage,
      focusKeyword,
      canonicalUrl,
    } = body

    const newContent = await prisma.content.create({
      data: {
        type,
        slug,
        title,
        content: content || "",
        metaDescription: metaDescription || null,
        keywords: keywords || null,
        status: status || "draft",
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogImage: ogImage || null,
        twitterCard: twitterCard || null,
        twitterTitle: twitterTitle || null,
        twitterDescription: twitterDescription || null,
        twitterImage: twitterImage || null,
        focusKeyword: focusKeyword || null,
        canonicalUrl: canonicalUrl || null,
        author: (session.user as any).email || "admin",
        publishedAt: status === "published" ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: newContent,
      message: "Content created successfully",
    })
  } catch (error) {
    console.error("Error creating content:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create content"
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

