import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const eventId = params.id
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (!query.trim()) {
      return NextResponse.json([])
    }

    const tickets = await prisma.eventTicket.findMany({
      where: {
        eventId,
        OR: [
          { attendeeName: { contains: query, mode: "insensitive" } },
          { attendeeEmail: { contains: query, mode: "insensitive" } },
          { attendeePhone: { contains: query, mode: "insensitive" } },
          { order: { orderNumber: { contains: query, mode: "insensitive" } } }
        ]
      },
      include: {
        ticketType: {
          select: { name: true }
        },
        order: {
          select: { orderNumber: true }
        }
      },
      take: 20
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Failed to search tickets:", error)
    return NextResponse.json(
      { error: "Failed to search tickets" },
      { status: 500 }
    )
  }
}
