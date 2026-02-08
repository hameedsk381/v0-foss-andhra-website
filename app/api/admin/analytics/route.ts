import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current date and 30 days ago
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Execute all queries in parallel for better performance
    const [
      memberGrowthRaw,
      donationTrendsRaw,
      eventTrends,
      membersByStatus,
      membersByOrganization,
      donationsByType,
      blogStats,
      recentMembers,
      recentDonations,
    ] = await Promise.all([
      // Member growth over last 30 days with proper date formatting
      prisma.$queryRaw<Array<{ date: Date; count: bigint }>>(Prisma.sql`
        SELECT DATE("createdAt") as date, COUNT(*)::integer as count
        FROM "Member"
        WHERE "createdAt" >= ${thirtyDaysAgo}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `),

      // Donation trends with proper decimal handling
      prisma.$queryRaw<Array<{ date: Date; amount: Prisma.Decimal }>>(Prisma.sql`
        SELECT DATE("createdAt") as date, SUM(amount)::numeric as amount
        FROM "Donation"
        WHERE "createdAt" >= ${thirtyDaysAgo} AND status = 'completed'
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `),

      // Event attendance trends
      prisma.event.findMany({
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
        take: 50, // Limit to prevent large responses
      }),

      // Member status distribution
      prisma.member.groupBy({
        by: ["status"],
        _count: true,
      }),

      // Member by organization (top 10, filter out null)
      prisma.member.groupBy({
        by: ["organization"],
        _count: true,
        where: {
          organization: { not: null },
        },
        orderBy: {
          _count: {
            organization: "desc",
          },
        },
        take: 10,
      }),

      // Donation by type
      prisma.donation.groupBy({
        by: ["type"],
        _sum: {
          amount: true,
        },
        _count: true,
        where: {
          status: "completed",
        },
      }),

      // Blog stats - all queries in parallel
      Promise.all([
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { status: "published" } }),
        prisma.blogPost.aggregate({ _sum: { views: true } }),
        prisma.blogComment.count(),
      ]).then(([totalPosts, publishedPosts, viewsAgg, totalComments]) => ({
        totalPosts,
        publishedPosts,
        _sum: { views: viewsAgg._sum.views || 0 },
        totalComments,
      })),

      // Recent members
      prisma.member.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          name: true,
          email: true,
          createdAt: true,
        },
      }),

      // Recent donations
      prisma.donation.findMany({
        take: 5,
        where: { status: "completed" },
        orderBy: { createdAt: "desc" },
        select: {
          name: true,
          amount: true,
          type: true,
          createdAt: true,
          anonymous: true,
        },
      }),
    ])

    // Format member growth data
    const memberGrowth = memberGrowthRaw.map((item) => ({
      date: item.date.toISOString().split('T')[0],
      count: Number(item.count),
    }))

    // Format donation trends data
    const donationTrends = donationTrendsRaw.map((item) => ({
      date: item.date.toISOString().split('T')[0],
      amount: Number(item.amount),
    }))

    // Format member by status
    const formattedMembersByStatus = membersByStatus.map((item) => ({
      status: item.status,
      _count: item._count,
    }))

    // Format member by organization
    const formattedMembersByOrganization = membersByOrganization.map((item) => ({
      organization: item.organization || "Not specified",
      _count: item._count,
    }))

    return NextResponse.json({
      success: true,
      data: {
        memberGrowth,
        donationTrends,
        eventTrends,
        membersByStatus: formattedMembersByStatus,
        membersByOrganization: formattedMembersByOrganization,
        donationsByType,
        blogStats,
        recentMembers,
        recentDonations,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch analytics"
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
