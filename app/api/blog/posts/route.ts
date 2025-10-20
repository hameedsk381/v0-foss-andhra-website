import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10

    const posts = await prisma.blogPost.findMany({
      where: {
        status: "published",
        ...(category && { category: { slug: category } }),
        ...(tag && { tags: { some: { tag: { slug: tag } } } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        category: true,
        author: {
          select: { name: true, avatar: true },
        },
        tags: {
          include: { tag: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    })

    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}
