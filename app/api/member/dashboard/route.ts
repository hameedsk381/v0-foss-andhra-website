import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
const MEMBER_DASHBOARD_SELECT = {
  id: true,
  email: true,
  membershipId: true,
  membershipType: true,
  organization: true,
  designation: true,
  status: true,
  expiryDate: true,
  joinDate: true,
} as const

function isMissingRelationError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      ((error as { code?: string }).code === "P2021" || (error as { code?: string }).code === "P2022")
  )
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).userType !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const member = await prisma.member.findUnique({
      where: { id: (session.user as any).id },
      select: MEMBER_DASHBOARD_SELECT,
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const [attendedCount, registeredCount, notifications, recentRegistrations] = await Promise.all([
      prisma.registration
        .count({
          where: {
            email: member.email,
            attended: true,
          },
        })
        .catch((error) => {
          if (isMissingRelationError(error)) return 0
          throw error
        }),
      prisma.registration
        .count({
          where: {
            email: member.email,
          },
        })
        .catch((error) => {
          if (isMissingRelationError(error)) return 0
          throw error
        }),
      prisma.notification.findMany({
        where: { userId: member.id },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          read: true,
          createdAt: true,
        },
      }),
      prisma.registration
        .findMany({
          where: { email: member.email },
          include: {
            Event: {
              select: {
                title: true,
                date: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        })
        .catch((error) => {
          if (isMissingRelationError(error)) return []
          throw error
        }),
    ])

    const activityFromNotifications = notifications.map((item) => ({
      id: `notification-${item.id}`,
      type: "notification" as const,
      title: item.title,
      description: item.message,
      date: item.createdAt.toISOString(),
      status: item.read ? "success" : "pending",
    }))

    const activityFromEvents = recentRegistrations.map((item) => ({
      id: `registration-${item.id}`,
      type: "event" as const,
      title: item.attended ? "Event Attended" : "Event Registration",
      description: item.Event?.title || "Community event",
      date: item.createdAt.toISOString(),
      status: item.attended ? "success" : "pending",
    }))

    const membershipActivity = {
      id: "membership-joined",
      type: "membership" as const,
      title: "Membership Activated",
      description: `Joined as ${member.membershipType}`,
      date: member.joinDate.toISOString(),
      status: "success",
    }

    const activities = [membershipActivity, ...activityFromEvents, ...activityFromNotifications]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: {
        member,
        stats: {
          eventsAttended: attendedCount,
          eventsRegistered: registeredCount,
          certificatesEarned: attendedCount,
        },
        activities,
      },
    })
  } catch (error) {
    console.error("Error fetching member dashboard:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
