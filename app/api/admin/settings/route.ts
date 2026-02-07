import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const settings = await prisma.settings.findMany()

        // Convert array to object for easier consumption on frontend
        const settingsObject = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, string>)

        return NextResponse.json({ success: true, data: settingsObject })
    } catch (error) {
        console.error("Error fetching settings:", error)
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()

        // Body is expected to be an object { key: value, key2: value2 }
        const updates = Object.entries(body).map(([key, value]) => {
            return prisma.settings.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            })
        })

        await prisma.$transaction(updates)

        return NextResponse.json({ success: true, message: "Settings saved successfully" })
    } catch (error) {
        console.error("Error saving settings:", error)
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
    }
}
