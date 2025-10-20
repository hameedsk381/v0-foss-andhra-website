import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    const events = await prisma.event.findMany({
      where: {
        ...(type && type !== "all" && { type }),
        ...(status && status !== "all" && { status }),
      },
      include: {
        registrations: true
      },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 })
  }
}

// POST create new event
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const event = await prisma.event.create({
      data: {
        ...body,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
      }
    })

    return NextResponse.json({ success: true, data: event, message: "Event created successfully" })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 })
  }
}
