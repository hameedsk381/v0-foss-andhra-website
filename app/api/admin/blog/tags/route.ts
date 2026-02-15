import { NextRequest, NextResponse } from "next/server"
import { requireAdminAccess } from "@/lib/auth/admin"
import { prisma } from "@/lib/prisma"

// GET - Fetch all tags
export async function GET() {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const tags = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: { BlogPostTag: true },
        },
      },
      orderBy: { name: "asc" },
    })
    const normalized = tags.map((tag) => ({
      ...tag,
      _count: {
        posts: tag._count.BlogPostTag,
      },
    }))

    return NextResponse.json({ success: true, data: normalized })
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}

// POST - Create new tag
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

    const body = await request.json()
    const { name, slug } = body

    const tag = await prisma.blogTag.create({
      data: { name, slug },
    })

    return NextResponse.json({ success: true, data: tag })
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}
