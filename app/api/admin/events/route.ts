import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET all events
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit")

    // Build where clause
    const where: any = {}
    
    if (type && type !== "all") {
      where.type = type
    }
    
    if (status && status !== "all") {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ]
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "desc" },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({ 
      success: true, 
      data: events,
      count: events.length,
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch events"
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

// POST create new event
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.date || !body.location) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: title, date, and location are required" 
        },
        { status: 400 }
      )
    }

    // Validate date
    const eventDate = new Date(body.date)
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      )
    }

    // Prepare event data
    const eventData: any = {
      title: body.title,
      description: body.description || "",
      date: eventDate,
      time: body.time || "00:00",
      location: body.location,
      type: body.type || "Meetup",
      status: body.status || "upcoming",
      maxAttendees: body.maxAttendees ? parseInt(body.maxAttendees) : null,
      currentAttendees: 0,
      program: body.program || null,
      imageUrl: body.imageUrl || null,
      createdBy: session.user?.email || null,
    }

    // Handle optional fields
    if (body.endDate) {
      const endDate = new Date(body.endDate)
      if (!isNaN(endDate.getTime())) {
        eventData.endDate = endDate
      }
    }

    if (body.gallery && Array.isArray(body.gallery)) {
      eventData.gallery = JSON.stringify(body.gallery)
    }

    if (body.externalTicketUrl) {
      eventData.externalTicketUrl = body.externalTicketUrl
    }

    if (body.externalRegisterUrl) {
      eventData.externalRegisterUrl = body.externalRegisterUrl
    }

    const event = await prisma.event.create({
      data: eventData,
    })

    return NextResponse.json({ 
      success: true, 
      data: event, 
      message: "Event created successfully" 
    })
  } catch (error) {
    console.error("Error creating event:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create event"
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
