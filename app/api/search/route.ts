import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (query.length < 2) {
      return NextResponse.json({ success: true, data: { members: [], events: [], blog: [], total: 0 } })
    }

    // Search members (public info only)
    const members = await prisma.member.findMany({
      where: {
        status: "active",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { organization: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        organization: true,
        membershipId: true,
      },
      take: 5,
    })

    // Search events
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        location: true,
        type: true,
      },
      take: 5,
      orderBy: { date: "desc" },
    })

    // Search blog posts
    const blog = await prisma.blogPost.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        category: {
          select: { name: true },
        },
      },
      take: 5,
      orderBy: { publishedAt: "desc" },
    })

    const total = members.length + events.length + blog.length

    return NextResponse.json({
      success: true,
      data: {
        members,
        events,
        blog,
        total,
      },
    })
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
