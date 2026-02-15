import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

export async function GET() {
    try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json({ success: true, data: inquiries })
    } catch (error) {
        console.error("Error fetching inquiries:", error)
        return NextResponse.json({ success: false, error: "Failed to fetch inquiries" }, { status: 500 })
    }
}
