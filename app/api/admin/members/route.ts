import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

export const dynamic = "force-dynamic"
const MEMBER_LIST_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  organization: true,
  designation: true,
  experience: true,
  interests: true,
  membershipType: true,
  status: true,
  membershipId: true,
  joinDate: true,
  expiryDate: true,
  createdAt: true,
  updatedAt: true,
} as const

// GET all members
export async function GET(request: Request) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    const members = await prisma.member.findMany({
      where: {
        ...(status && status !== "all" && { status }),
        ...(type && type !== "all" && { membershipType: type }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        })
      },
      orderBy: { createdAt: 'desc' },
      select: MEMBER_LIST_SELECT,
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
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

    const body = await request.json()

    if (!body?.name || !body?.email || !body?.phone) {
      return NextResponse.json(
        { success: false, error: "Name, email, and phone are required" },
        { status: 400 }
      )
    }

    // Generate unique membership ID
    const membershipId = `FOSS${Date.now()}`

    const expiryDate = body.expiryDate ? new Date(body.expiryDate) : new Date()
    if (!body.expiryDate) {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
    }
    if (Number.isNaN(expiryDate.getTime())) {
      return NextResponse.json({ success: false, error: "Invalid expiryDate" }, { status: 400 })
    }

    const member = await prisma.member.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        organization: body.organization || null,
        designation: body.designation || null,
        experience: body.experience || null,
        interests: body.interests || null,
        membershipType: body.membershipType || "FOSStar Annual",
        membershipId,
        expiryDate,
        status: body.status || "active",
      },
      select: MEMBER_LIST_SELECT,
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
    const authError = await requireAdminAccess(["editor", "admin"])
    if (authError) return authError

    const body = await request.json()
    const { id, expiryDate, ...data } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "Member ID is required" }, { status: 400 })
    }

    let parsedExpiryDate: Date | undefined
    if (expiryDate !== undefined) {
      parsedExpiryDate = new Date(expiryDate)
      if (Number.isNaN(parsedExpiryDate.getTime())) {
        return NextResponse.json({ success: false, error: "Invalid expiryDate" }, { status: 400 })
      }
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...data,
        ...(parsedExpiryDate ? { expiryDate: parsedExpiryDate } : {}),
      },
      select: MEMBER_LIST_SELECT,
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
    const authError = await requireAdminAccess(["admin"])
    if (authError) return authError

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
