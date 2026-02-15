import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const eventId = params.id

    const recentCheckIns = await prisma.eventTicket.findMany({
      where: {
        eventId,
        checkInStatus: "checked_in"
      },
      orderBy: {
        checkInTime: "desc"
      },
      take: 10,
      include: {
        ticketType: {
          select: { name: true }
        },
        order: {
          select: { orderNumber: true }
        }
      }
    })

    return NextResponse.json(recentCheckIns)
  } catch (error) {
    console.error("Failed to fetch recent check-ins:", error)
    return NextResponse.json(
      { error: "Failed to fetch recent check-ins" },
      { status: 500 }
    )
  }
}
