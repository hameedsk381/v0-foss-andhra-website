import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from "@/lib/auth/admin"

// PATCH - Update volunteer status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session, authError } = await requireAdminSession(["editor", "admin"])
    if (authError) return authError

    const { id } = params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, approved, or rejected' },
        { status: 400 }
      )
    }

    // Update volunteer
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: session.user?.email || 'admin',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Volunteer status updated successfully',
        volunteer: {
          id: volunteer.id,
          status: volunteer.status,
          reviewedAt: volunteer.reviewedAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating volunteer:', error)
    return NextResponse.json(
      { error: 'Failed to update volunteer' },
      { status: 500 }
    )
  }
}

// DELETE - Delete volunteer (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { authError } = await requireAdminSession(["admin"])
    if (authError) return authError

    const { id } = params

    await prisma.volunteer.delete({
      where: { id },
    })

    return NextResponse.json(
      { success: true, message: 'Volunteer deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting volunteer:', error)
    return NextResponse.json(
      { error: 'Failed to delete volunteer' },
      { status: 500 }
    )
  }
}
