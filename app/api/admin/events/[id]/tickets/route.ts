import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET all ticket types for an event
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    const ticketTypes = await prisma.eventTicketType.findMany({
      where: { eventId },
      orderBy: { order: "asc" },
    })

    return NextResponse.json({ success: true, data: ticketTypes })
  } catch (error) {
    console.error("Error fetching ticket types:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch ticket types" },
      { status: 500 }
    )
  }
}

// POST create new ticket type
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.type) {
      return NextResponse.json(
        { success: false, error: "Name and type are required" },
        { status: 400 }
      )
    }

    // Get the next order value
    const maxOrder = await prisma.eventTicketType.findFirst({
      where: { eventId },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const nextOrder = maxOrder?.order !== undefined ? maxOrder.order + 1 : 0

    const ticketType = await prisma.eventTicketType.create({
      data: {
        eventId,
        name: body.name,
        description: body.description,
        type: body.type,
        price: body.price || 0,
        minDonation: body.minDonation,
        maxDonation: body.maxDonation,
        quantity: body.quantity,
        salesStart: body.salesStart ? new Date(body.salesStart) : null,
        salesEnd: body.salesEnd ? new Date(body.salesEnd) : null,
        hidden: body.hidden || false,
        requiresApproval: body.requiresApproval || false,
        order: nextOrder,
        active: body.active !== false,
      },
    })

    return NextResponse.json({
      success: true,
      data: ticketType,
      message: "Ticket type created successfully",
    })
  } catch (error) {
    console.error("Error creating ticket type:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create ticket type" },
      { status: 500 }
    )
  }
}
