import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET event by ID (public)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const event = await prisma.event.findUnique({
      where: { id },
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
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
      { status: 500 }
    )
  }
}
