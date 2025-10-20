import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET single ticket type
export async function GET(
  request: Request,
  { params }: { params: { id: string; ticketId: string } }
) {
  try {
    const { ticketId } = params

    const ticketType = await prisma.eventTicketType.findUnique({
      where: { id: ticketId },
      include: {
        tickets: {
          select: {
            id: true,
            checkInStatus: true,
          },
        },
      },
    })

    if (!ticketType) {
      return NextResponse.json(
        { success: false, error: "Ticket type not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: ticketType })
  } catch (error) {
    console.error("Error fetching ticket type:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch ticket type" },
      { status: 500 }
    )
  }
}

// PUT update ticket type
export async function PUT(
  request: Request,
  { params }: { params: { id: string; ticketId: string } }
) {
  try {
    const { ticketId } = params
    const body = await request.json()

    const ticketType = await prisma.eventTicketType.update({
      where: { id: ticketId },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        price: body.price,
        minDonation: body.minDonation,
        maxDonation: body.maxDonation,
        quantity: body.quantity,
        salesStart: body.salesStart ? new Date(body.salesStart) : null,
        salesEnd: body.salesEnd ? new Date(body.salesEnd) : null,
        hidden: body.hidden,
        requiresApproval: body.requiresApproval,
        active: body.active,
      },
    })

    return NextResponse.json({
      success: true,
      data: ticketType,
      message: "Ticket type updated successfully",
    })
  } catch (error) {
    console.error("Error updating ticket type:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update ticket type" },
      { status: 500 }
    )
  }
}

// DELETE ticket type
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; ticketId: string } }
) {
  try {
    const { ticketId } = params

    // Check if any tickets have been sold
    const soldTickets = await prisma.eventTicket.count({
      where: { ticketTypeId: ticketId },
    })

    if (soldTickets > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete ticket type with ${soldTickets} sold tickets`,
        },
        { status: 400 }
      )
    }

    await prisma.eventTicketType.delete({
      where: { id: ticketId },
    })

    return NextResponse.json({
      success: true,
      message: "Ticket type deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting ticket type:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete ticket type" },
      { status: 500 }
    )
  }
}
