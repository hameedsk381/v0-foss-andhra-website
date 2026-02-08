import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

// GET all members
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const members = await prisma.member.findMany({
      where: {
        ...(status && status !== "all" && { status }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        })
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: members })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 })
  }
}

// POST create new member
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate unique membership ID
    const membershipId = `FOSS${Date.now()}`

    // Calculate expiry date (1 year from now)
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)

    const member = await prisma.member.create({
      data: {
        ...body,
        membershipId,
        expiryDate,
        status: 'active'
      }
    })

    return NextResponse.json({ success: true, data: member, message: "Member created successfully" })
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json({ success: false, error: "Failed to create member" }, { status: 500 })
  }
}

// PUT update member
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "Member ID is required" }, { status: 400 })
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, data: member, message: "Member updated successfully" })
  } catch (error) {
    console.error("Error updating member:", error)
    return NextResponse.json({ success: false, error: "Failed to update member" }, { status: 500 })
  }
}

// DELETE members
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    await prisma.member.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    return NextResponse.json({ success: true, message: "Members deleted successfully" })
  } catch (error) {
    console.error("Error deleting members:", error)
    return NextResponse.json({ success: false, error: "Failed to delete members" }, { status: 500 })
  }
}
