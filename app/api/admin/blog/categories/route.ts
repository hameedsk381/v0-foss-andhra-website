import { NextRequest, NextResponse } from "next/server"
import { requireAdminAccess } from "@/lib/auth/admin"
import { prisma } from "@/lib/prisma"

// GET - Fetch all categories
export async function GET() {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { BlogPost: true },
        },
      },
      orderBy: { name: "asc" },
    })
    const normalized = categories.map((category) => ({
      ...category,
      _count: {
        posts: category._count.BlogPost,
      },
    }))

    return NextResponse.json({ success: true, data: normalized })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

    const body = await request.json()
    const { name, slug, description } = body

    const category = await prisma.blogCategory.create({
      data: { name, slug, description },
    })

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
