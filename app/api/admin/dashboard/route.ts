import { NextResponse } from "next/server"
import { requireAdminAccess } from "@/lib/auth/admin"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    // Get current date and start of month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Total and active members
    const totalMembers = await prisma.member.count()
    const activeMembers = await prisma.member.count({
      where: { status: "active" },
    })

    // New members this month
    const newMembersThisMonth = await prisma.member.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    })

    // Total events and upcoming events
    const totalEvents = await prisma.event.count()
    const upcomingEvents = await prisma.event.count({
      where: {
        status: "upcoming",
        date: { gte: now },
      },
    })

    // Total donations
    const totalDonationsSum = await prisma.donation.aggregate({
      _sum: { amount: true },
      where: { status: "completed" },
    })

    // Monthly donations
    const monthlyDonationsSum = await prisma.donation.aggregate({
      _sum: { amount: true },
      where: {
        status: "completed",
        createdAt: { gte: startOfMonth },
      },
    })

    // Event attendance (sum of current attendees)
    const eventAttendanceSum = await prisma.event.aggregate({
      _sum: { currentAttendees: true },
    })

    // Recent members (last 4)
    const recentMembers = await prisma.member.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    })

    // Upcoming events (next 4)
    const upcomingEventsList = await prisma.event.findMany({
      take: 4,
      where: {
        status: "upcoming",
        date: { gte: now },
      },
      orderBy: { date: "asc" },
      select: {
        title: true,
        date: true,
        location: true,
      },
    })

    // Recent donations (last 5)
    const recentDonations = await prisma.donation.findMany({
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
    })

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalMembers,
          activeMembers,
          newMembersThisMonth,
          totalEvents,
          upcomingEvents,
          totalDonations: totalDonationsSum._sum.amount || 0,
          monthlyDonations: monthlyDonationsSum._sum.amount || 0,
          eventAttendance: eventAttendanceSum._sum.currentAttendees || 0,
        },
        recentMembers,
        upcomingEvents: upcomingEventsList,
        recentDonations,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
