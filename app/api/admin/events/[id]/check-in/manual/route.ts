import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

// Manual Check-In
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

    const eventId = params.id
    const body = await request.json()
    const { ticketId } = body

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      )
    }

    // Verify ticket exists and belongs to this event
    const ticket = await prisma.eventTicket.findUnique({
      where: { id: ticketId }
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
        { error: "Ticket already checked in" },
        { status: 400 }
      )
    }

    // Perform check-in
    const updatedTicket = await prisma.eventTicket.update({
      where: { id: ticketId },
      data: {
        checkInStatus: "checked_in",
        checkInTime: new Date(),
        checkInBy: "admin"
      }
    })

    return NextResponse.json({
      success: true,
      ticket: updatedTicket
    })

  } catch (error) {
    console.error("Manual check-in error:", error)
    return NextResponse.json(
      { error: "Failed to process check-in" },
      { status: 500 }
    )
  }
}
