import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import QRCode from "qrcode"
import { sendTicketConfirmationEmail } from "@/lib/email"
import { requireAdminAccess } from "@/lib/auth/admin"

export const dynamic = "force-dynamic"

// GET all orders for an event
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const eventId = params.id
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const orders = await prisma.eventOrder.findMany({
      where: {
        eventId,
        ...(status && status !== "all" && { status }),
      },
      include: {
        tickets: {
          include: {
            ticketType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// POST create new order (ticket purchase)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

    const eventId = params.id
    const body = await request.json()

    // Validate request
    if (!body.tickets || body.tickets.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one ticket is required" },
        { status: 400 }
      )
    }

    if (!body.customerName || !body.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Customer name and email are required" },
        { status: 400 }
      )
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate totals
    let subtotal = 0
    const ticketsData: Array<{
      ticketTypeId: string
      quantity: number
      price: number
      attendeeName: string
      attendeeEmail: string
      attendeePhone?: string
    }> = []

    for (const ticketItem of body.tickets) {
      const ticketType = await prisma.eventTicketType.findUnique({
        where: { id: ticketItem.ticketTypeId },
      })

      if (!ticketType) {
        return NextResponse.json(
          { success: false, error: `Ticket type ${ticketItem.ticketTypeId} not found` },
          { status: 404 }
        )
      }

      // Check availability
      if (ticketType.quantity !== null) {
        const soldCount = ticketType.quantitySold
        if (soldCount + ticketItem.quantity > ticketType.quantity) {
          return NextResponse.json(
            { success: false, error: `Not enough tickets available for ${ticketType.name}` },
            { status: 400 }
          )
        }
      }

      // Check sales window
      const now = new Date()
      if (ticketType.salesStart && now < ticketType.salesStart) {
        return NextResponse.json(
          { success: false, error: `Sales for ${ticketType.name} haven't started yet` },
          { status: 400 }
        )
      }
      if (ticketType.salesEnd && now > ticketType.salesEnd) {
        return NextResponse.json(
          { success: false, error: `Sales for ${ticketType.name} have ended` },
          { status: 400 }
        )
      }

      const price = ticketItem.donationAmount || ticketType.price
      subtotal += price * ticketItem.quantity

      ticketsData.push({
        ticketTypeId: ticketType.id,
        quantity: ticketItem.quantity,
        price,
        attendeeName: ticketItem.attendeeName || body.customerName,
        attendeeEmail: ticketItem.attendeeEmail || body.customerEmail,
        attendeePhone: ticketItem.attendeePhone || body.customerPhone,
      })
    }

    // Apply promo code if provided
    let discountAmount = 0
    if (body.promoCode) {
      const promo = await prisma.eventPromoCode.findFirst({
        where: {
          eventId,
          code: body.promoCode,
          active: true,
        },
      })

      if (promo) {
        const now = new Date()
        if (
          (!promo.validFrom || now >= promo.validFrom) &&
          (!promo.validUntil || now <= promo.validUntil) &&
          (!promo.maxUses || promo.usedCount < promo.maxUses) &&
          (!promo.minOrderAmount || subtotal >= promo.minOrderAmount)
        ) {
          if (promo.discountType === "percentage") {
            discountAmount = (subtotal * promo.discountValue) / 100
          } else if (promo.discountType === "fixed") {
            discountAmount = promo.discountValue
          } else if (promo.discountType === "free") {
            discountAmount = subtotal
          }

          // Update promo code usage
          await prisma.eventPromoCode.update({
            where: { id: promo.id },
            data: { usedCount: { increment: 1 } },
          })
        }
      }
    }

    const taxAmount = body.taxAmount || 0
    const feeAmount = body.feeAmount || 0
    const totalAmount = subtotal - discountAmount + taxAmount + feeAmount

    // Determine payment status
    const paymentMethod = totalAmount === 0 ? "free" : body.paymentMethod || "razorpay"
    const status = totalAmount === 0 ? "completed" : "pending"

    // Create order
    const order = await prisma.eventOrder.create({
      data: {
        eventId,
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        totalAmount,
        subtotal,
        taxAmount,
        feeAmount,
        discountAmount,
        promoCode: body.promoCode,
        status,
        paymentMethod,
        paymentId: body.paymentId,
        razorpayOrderId: body.razorpayOrderId,
        notes: body.notes,
        customFields: body.customFields ? JSON.stringify(body.customFields) : null,
      },
    })

    // Create individual tickets with QR codes
    const createdTickets = []
    for (const ticketData of ticketsData) {
      for (let i = 0; i < ticketData.quantity; i++) {
        const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

        // Generate QR code
        const qrData = JSON.stringify({
          eventId,
          orderId: order.id,
          ticketId,
          attendeeEmail: ticketData.attendeeEmail,
        })
        const qrCode = await QRCode.toDataURL(qrData)

        const ticket = await prisma.eventTicket.create({
          data: {
            eventId,
            ticketTypeId: ticketData.ticketTypeId,
            orderId: order.id,
            attendeeName: ticketData.attendeeName,
            attendeeEmail: ticketData.attendeeEmail,
            attendeePhone: ticketData.attendeePhone,
            qrCode,
            price: ticketData.price,
          },
        })

        // Update ticket type sold count
        await prisma.eventTicketType.update({
          where: { id: ticketData.ticketTypeId },
          data: { quantitySold: { increment: 1 } },
        })

        createdTickets.push(ticket)
      }
    }

    // Update event current attendees count
    await prisma.event.update({
      where: { id: eventId },
      data: {
        currentAttendees: {
          increment: createdTickets.length,
        },
      },
    })

    // Get event details for email
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        title: true,
        date: true,
        time: true,
        location: true,
      },
    })

    // Send confirmation email
    if (event) {
      try {
        await sendTicketConfirmationEmail(body.customerEmail, {
          orderNumber,
          customerName: body.customerName,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          totalAmount,
          tickets: createdTickets.map((ticket: any) => ({
            id: ticket.id,
            ticketTypeName: ticketsData.find((t: any) => t.ticketTypeId === ticket.ticketTypeId)?.attendeeName || 'Ticket',
            attendeeName: ticket.attendeeName,
            qrCode: ticket.qrCode,
          })),
        })
        console.log('✅ Confirmation email sent to', body.customerEmail)
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError)
        // Don't fail the order if email fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        order: {
          ...order,
          tickets: createdTickets,
        },
      },
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    )
  }
}
