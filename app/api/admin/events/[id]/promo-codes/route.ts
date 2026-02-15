import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

// GET all promo codes for an event
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const eventId = params.id

    const promoCodes = await prisma.eventPromoCode.findMany({
      where: { eventId },
      include: {
        applicableTickets: {
          include: {
            ticketType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: promoCodes })
  } catch (error) {
    console.error("Error fetching promo codes:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch promo codes" },
      { status: 500 }
    )
  }
}

// POST create new promo code
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

    const eventId = params.id
    const body = await request.json()

    // Validate required fields
    if (!body.code || !body.discountType || body.discountValue === undefined) {
      return NextResponse.json(
        { success: false, error: "Code, discount type, and discount value are required" },
        { status: 400 }
      )
    }

    // Check if code already exists for this event
    const existing = await prisma.eventPromoCode.findFirst({
      where: {
        eventId,
        code: body.code.toUpperCase(),
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Promo code already exists for this event" },
        { status: 400 }
      )
    }

    // Create promo code
    const promoCode = await prisma.eventPromoCode.create({
      data: {
        eventId,
        code: body.code.toUpperCase(),
        description: body.description,
        discountType: body.discountType,
        discountValue: body.discountValue,
        maxUses: body.maxUses,
        validFrom: body.validFrom ? new Date(body.validFrom) : null,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        minOrderAmount: body.minOrderAmount,
        active: body.active !== false,
      },
    })

    // Link to ticket types if specified
    if (body.applicableTicketIds && body.applicableTicketIds.length > 0) {
      await prisma.promoCodeTicket.createMany({
        data: body.applicableTicketIds.map((ticketTypeId: string) => ({
          promoCodeId: promoCode.id,
          ticketTypeId,
        })),
      })
    }

    return NextResponse.json({
      success: true,
      data: promoCode,
      message: "Promo code created successfully",
    })
  } catch (error) {
    console.error("Error creating promo code:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create promo code" },
      { status: 500 }
    )
  }
}

// DELETE promo code by query param id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAccess(["admin"])
    if (authError) return authError

    const eventId = params.id
    const { searchParams } = new URL(request.url)
    const promoCodeId = searchParams.get("id")

    if (!promoCodeId) {
      return NextResponse.json(
        { success: false, error: "Promo code id is required" },
        { status: 400 }
      )
    }

    await prisma.promoCodeTicket.deleteMany({
      where: { promoCodeId },
    })

    await prisma.eventPromoCode.deleteMany({
      where: {
        id: promoCodeId,
        eventId,
      },
    })

    return NextResponse.json({ success: true, message: "Promo code deleted successfully" })
  } catch (error) {
    console.error("Error deleting promo code:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete promo code" },
      { status: 500 }
    )
  }
}
