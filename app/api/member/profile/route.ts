import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
const MEMBER_PROFILE_SELECT = {
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).userType !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const member = await prisma.member.findUnique({
      where: { id: (session.user as any).id },
      select: MEMBER_PROFILE_SELECT,
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: member })
  } catch (error) {
    console.error("Error fetching member profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).userType !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, organization, designation, interests } = body

    const updatedMember = await prisma.member.update({
      where: { id: (session.user as any).id },
      data: {
        name,
        phone,
        organization,
        designation,
        interests,
      },
      select: MEMBER_PROFILE_SELECT,
    })

    return NextResponse.json({ success: true, data: updatedMember })
  } catch (error) {
    console.error("Error updating member profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
