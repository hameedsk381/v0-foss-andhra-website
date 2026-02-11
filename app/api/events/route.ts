import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "upcoming"

    const now = new Date()

    let whereClause: any = {}

    if (status === "upcoming") {
      whereClause = {
        date: {
          gte: now
        }
      }
    } else if (status === "past") {
      whereClause = {
        date: {
          lt: now
        }
      }
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        date: status === "upcoming" ? "asc" : "desc"
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        endDate: true,
        time: true,
        location: true,
        type: true,
        imageUrl: true,
        gallery: true,
        status: true,
        maxAttendees: true,
        currentAttendees: true,
        program: true,
        externalTicketUrl: true,
        externalRegisterUrl: true,
      }
    })

    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}
