import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
