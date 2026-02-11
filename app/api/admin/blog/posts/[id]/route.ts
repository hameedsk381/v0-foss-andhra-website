import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET - Fetch single blog post
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: {
        BlogCategory: true,
        Admin: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        BlogPostTag: {
          include: { BlogTag: true },
        },
        BlogComment: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

// PUT - Update blog post
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        categoryId,
        status,
        featured,
        metaDescription,
        metaKeywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard,
        focusKeyword,
        publishedAt: status === "published" && !body.publishedAt ? new Date() : undefined,
      },
    })

    // Update tags
    if (tags) {
      // Delete existing tags
      await prisma.blogPostTag.deleteMany({
        where: { postId: params.id },
      })

      // Add new tags
      if (tags.length > 0) {
        await prisma.blogPostTag.createMany({
          data: tags.map((tagId: string) => ({
            postId: post.id,
            tagId,
          })),
        })
      }
    }

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.blogPost.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
