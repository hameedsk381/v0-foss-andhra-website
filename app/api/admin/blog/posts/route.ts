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

    const posts = await prisma.blogPost.findMany({
      where: {
        ...(status && status !== "all" && { status }),
        ...(category && { categoryId: category }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } } as any,
            { excerpt: { contains: search, mode: "insensitive" } } as any,
          ],
        }),
      },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
        tags: {
          include: { tag: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
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
      focusKeyword,
    } = body

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        categoryId,
        authorId: (session.user as any).id,
        status,
        featured: featured || false,
        metaDescription,
        metaKeywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard,
        focusKeyword,
        publishedAt: status === "published" ? new Date() : null,
      },
    })

    // Add tags if provided
    if (tags && tags.length > 0) {
      await prisma.blogPostTag.createMany({
        data: tags.map((tagId: string) => ({
          postId: post.id,
          tagId,
        })),
      })
    }

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
