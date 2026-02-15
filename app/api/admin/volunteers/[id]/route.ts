import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSession } from "@/lib/auth/admin"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session, authError } = await requireAdminSession(["editor", "admin"])
    if (authError) return authError

    const { status } = await request.json()
    const validStatuses = ["pending", "approved", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be pending, approved, or rejected" },
        { status: 400 }
      )
    }

    const volunteer = await prisma.volunteer.update({
      where: { id: params.id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: session.user?.email || "admin",
      },
    })

    return NextResponse.json({
      success: true,
      data: volunteer,
      message: "Volunteer status updated successfully",
    })
  } catch (error) {
    console.error("Error updating volunteer:", error)
    return NextResponse.json({ success: false, error: "Failed to update volunteer" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { authError } = await requireAdminSession(["admin"])
    if (authError) return authError

    await prisma.volunteer.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: "Volunteer deleted successfully" })
  } catch (error) {
    console.error("Error deleting volunteer:", error)
    return NextResponse.json({ success: false, error: "Failed to delete volunteer" }, { status: 500 })
  }
}
