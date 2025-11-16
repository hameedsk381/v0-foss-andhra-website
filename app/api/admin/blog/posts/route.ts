import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET - Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit")
    const featured = searchParams.get("featured")

    // Build where clause
    const where: any = {}
    
    if (status && status !== "all") {
      where.status = status
    }
    
    if (category) {
      where.categoryId = category
    }
    
    if (featured === "true") {
      where.featured = true
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({ 
      success: true, 
      data: posts,
      count: posts.length,
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch blog posts"
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

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.slug || !body.categoryId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: title, slug, and categoryId are required" 
        },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: body.slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { success: false, error: "A post with this slug already exists" },
        { status: 409 }
      )
    }

    // Verify category exists
    const category = await prisma.blogCategory.findUnique({
      where: { id: body.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      coverImage, 
      categoryId, 
      tags, 
      status, 
      featured, 
      metaDescription, 
      metaKeywords,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      focusKeyword,
      canonicalUrl,
      readingTime,
    } = body

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content: content || "",
        coverImage: coverImage || null,
        categoryId,
        authorId: (session.user as any).id,
        status: status || "draft",
        featured: featured || false,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogImage: ogImage || null,
        twitterCard: twitterCard || null,
        twitterTitle: twitterTitle || null,
        twitterDescription: twitterDescription || null,
        twitterImage: twitterImage || null,
        focusKeyword: focusKeyword || null,
        canonicalUrl: canonicalUrl || null,
        readingTime: readingTime || null,
        publishedAt: status === "published" ? new Date() : null,
      },
    })

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      await prisma.blogPostTag.createMany({
        data: tags.map((tagId: string) => ({
          postId: post.id,
          tagId,
        })),
        skipDuplicates: true,
      })
    }

    // Fetch the complete post with relations
    const completePost = await prisma.blogPost.findUnique({
      where: { id: post.id },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    })

    return NextResponse.json({ 
      success: true, 
      data: completePost,
      message: "Blog post created successfully",
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create blog post"
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
