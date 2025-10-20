import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current date and 30 days ago
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Member growth over last 30 days
    const memberGrowth = await prisma.$queryRaw<Array<{ date: string; count: number }>>`
      SELECT DATE(createdAt) as date, COUNT(*) as count
      FROM Member
      WHERE createdAt >= ${thirtyDaysAgo}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `

    // Donation trends
    const donationTrends = await prisma.$queryRaw<Array<{ date: string; amount: number }>>`
      SELECT DATE(createdAt) as date, SUM(amount) as amount
      FROM Donation
      WHERE createdAt >= ${thirtyDaysAgo} AND status = 'completed'
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `

    // Event attendance trends
    const eventTrends = await prisma.event.findMany({
      where: {
        date: { gte: thirtyDaysAgo },
      },
      select: {
        title: true,
        date: true,
        currentAttendees: true,
        maxAttendees: true,
      },
      orderBy: { date: "asc" },
    })

    // Member status distribution
    const membersByStatus = await prisma.member.groupBy({
      by: ["status"],
      _count: true,
    })

    // Member by organization (top 10)
    const membersByOrganization = await prisma.member.groupBy({
      by: ["organization"],
      _count: true,
      orderBy: {
        _count: {
          organization: "desc",
        },
      },
      take: 10,
    })

    // Donation by type
    const donationsByType = await prisma.donation.groupBy({
      by: ["type"],
      _sum: {
        amount: true,
      },
      _count: true,
      where: {
        status: "completed",
      },
    })

    // Blog stats
    const blogStats = {
      totalPosts: await prisma.blogPost.count(),
      publishedPosts: await prisma.blogPost.count({ where: { status: "published" } }),
      totalViews: await prisma.blogPost.aggregate({
        _sum: { views: true },
      }),
      totalComments: await prisma.blogComment.count(),
    }

    // Recent activity
    const recentMembers = await prisma.member.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    })

    const recentDonations = await prisma.donation.findMany({
      take: 5,
      where: { status: "completed" },
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        amount: true,
        type: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        memberGrowth,
        donationTrends,
        eventTrends,
        membersByStatus,
        membersByOrganization,
        donationsByType,
        blogStats,
        recentMembers,
        recentDonations,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
