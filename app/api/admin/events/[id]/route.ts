import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET single event
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id },
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error("Error fetching event:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch event"
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

// PUT update event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Prepare update data
    const updateData: any = {
      title: body.title,
      description: body.description,
      date: eventDate,
      time: body.time,
      location: body.location,
      type: body.type,
      status: body.status,
      maxAttendees: body.maxAttendees ? parseInt(body.maxAttendees) : null,
      program: body.program || null,
      imageUrl: body.imageUrl || null,
    }

    // Handle optional fields
    if (body.endDate) {
      const endDate = new Date(body.endDate)
      if (!isNaN(endDate.getTime())) {
        updateData.endDate = endDate
      }
    }

    if (body.gallery !== undefined) {
      updateData.gallery = Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : body.gallery
    }

    if (body.externalTicketUrl !== undefined) {
      updateData.externalTicketUrl = body.externalTicketUrl || null
    }

    if (body.externalRegisterUrl !== undefined) {
      updateData.externalRegisterUrl = body.externalRegisterUrl || null
    }

    const event = await prisma.event.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ 
      success: true, 
      data: event, 
      message: "Event updated successfully" 
    })
  } catch (error) {
    console.error("Error updating event:", error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return NextResponse.json(
          { success: false, error: "Event not found" },
          { status: 404 }
        )
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : "Failed to update event"
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

// DELETE event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if event exists before deleting
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      )
    }

    await prisma.event.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ 
      success: true, 
      message: "Event deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting event:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to delete event"
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
