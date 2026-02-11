import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET public gallery items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const program = searchParams.get("program")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const where: any = {}

    if (program && program !== "all") {
      where.program = program
    }

    if (category && category !== "all") {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ]
    }

    const media = await prisma.media.findMany({
      where,
      select: {
        id: true,
        url: true,
        alt: true,
        program: true,
        category: true,
        tags: true,
        caption: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Transform data for gallery
    const galleryItems = media.map(item => ({
      id: item.id,
      title: item.caption || 'Untitled',
      description: item.caption || '',
      date: item.createdAt.toISOString().split('T')[0],
      image: item.url,
      program: item.program || 'general',
      tags: item.tags ? item.tags.split(',').map((t: string) => t.trim()) : [],
    }))

    return NextResponse.json({ success: true, data: galleryItems })
  } catch (error) {
    console.error("Error fetching gallery:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch gallery" }, { status: 500 })
  }
}
