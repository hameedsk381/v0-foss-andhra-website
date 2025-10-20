import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// QR Code Check-In
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()
    const { qrData } = body

    if (!qrData) {
      return NextResponse.json(
        { error: "QR code data is required" },
        { status: 400 }
      )
    }

    // Parse QR code data
    let ticketData
    try {
      ticketData = JSON.parse(qrData)
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid QR code format" },
        { status: 400 }
      )
    }

    // Verify ticket exists and belongs to this event
    const ticket = await prisma.eventTicket.findUnique({
      where: { id: ticketData.ticketId },
      include: {
        ticketType: { select: { name: true } },
        order: { select: { orderNumber: true } }
      }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      )
    }

    if (ticket.eventId !== eventId) {
      return NextResponse.json(
        { error: "Ticket does not belong to this event" },
        { status: 403 }
      )
    }

    if (ticket.checkInStatus === "cancelled") {
      return NextResponse.json(
        { error: "This ticket has been cancelled" },
        { status: 400 }
      )
    }

    if (ticket.checkInStatus === "checked_in") {
      return NextResponse.json(
        { 
          error: "Ticket already checked in",
          ticket: {
            attendeeName: ticket.attendeeName,
            checkInTime: ticket.checkInTime
          }
        },
        { status: 400 }
      )
    }

    // Perform check-in
    const updatedTicket = await prisma.eventTicket.update({
      where: { id: ticket.id },
      data: {
        checkInStatus: "checked_in",
        checkInTime: new Date(),
        // In a real app, you'd get the admin user ID from session
        checkInBy: "admin"
      },
      include: {
        ticketType: { select: { name: true } },
        order: { select: { orderNumber: true } }
      }
    })

    return NextResponse.json({
      success: true,
      ticket: updatedTicket
    })

  } catch (error) {
    console.error("Check-in error:", error)
    return NextResponse.json(
      { error: "Failed to process check-in" },
      { status: 500 }
    )
  }
}
