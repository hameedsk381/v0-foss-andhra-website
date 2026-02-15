import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

        const { status } = await request.json()
        const inquiry = await prisma.inquiry.update({
            where: { id: params.id },
            data: { status },
        })
        return NextResponse.json({ success: true, data: inquiry })
    } catch (error) {
        console.error("Error updating inquiry:", error)
        return NextResponse.json({ success: false, error: "Failed to update inquiry" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
    const authError = await requireAdminAccess(["admin"])
    if (authError) return authError

        await prisma.inquiry.delete({
            where: { id: params.id },
        })
        return NextResponse.json({ success: true, message: "Inquiry deleted" })
    } catch (error) {
        console.error("Error deleting inquiry:", error)
        return NextResponse.json({ success: false, error: "Failed to delete inquiry" }, { status: 500 })
    }
}
