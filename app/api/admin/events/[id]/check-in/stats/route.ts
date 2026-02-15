import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const eventId = params.id

    const tickets = await prisma.eventTicket.findMany({
      where: { eventId },
      select: { checkInStatus: true }
    })

    const stats = {
      totalTickets: tickets.length,
      checkedIn: tickets.filter(t => t.checkInStatus === "checked_in").length,
      pending: tickets.filter(t => t.checkInStatus === "pending").length,
      cancelled: tickets.filter(t => t.checkInStatus === "cancelled").length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch check-in stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
