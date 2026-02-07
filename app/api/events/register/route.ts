import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { eventId, name, email, phone, organization, expectations } = data

        if (!eventId || !name || !email) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
        }

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        if (!event) {
            return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 })
        }

        // Create registration
        const registration = await prisma.registration.create({
            data: {
                eventId,
                name,
                email,
                phone,
                organization,
                notes: expectations, // Mapping expectations to notes
            }
        })

        return NextResponse.json({ success: true, data: registration })
    } catch (error) {
        console.error("Error registering for event:", error)
        return NextResponse.json({ success: false, error: "Failed to register" }, { status: 500 })
    }
}
