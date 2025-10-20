import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
