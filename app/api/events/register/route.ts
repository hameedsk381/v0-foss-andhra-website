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

        // Member perk: flag registrations from active members so organizers can prioritise them.
        const member = await prisma.member.findFirst({
            where: {
                email: { equals: String(email).trim(), mode: "insensitive" },
                status: "active",
                expiryDate: { gt: new Date() },
            },
            select: { membershipId: true, membershipType: true },
        })
        const memberTag = member ? `[MEMBER ${member.membershipId} - ${member.membershipType}]` : ""
        const notes = [memberTag, expectations].filter(Boolean).join(" ") || undefined

        // Create registration
        const registration = await prisma.registration.create({
            data: {
                id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                eventId,
                name,
                email,
                phone,
                organization,
                notes, // Mapping expectations to notes (prefixed with member tag when applicable)
                updatedAt: new Date(),
            }
        })

        return NextResponse.json({ success: true, data: registration, isMember: Boolean(member) })
    } catch (error) {
        console.error("Error registering for event:", error)
        return NextResponse.json({ success: false, error: "Failed to register" }, { status: 500 })
    }
}
