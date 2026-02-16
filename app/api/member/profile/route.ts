import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

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
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
} as const

const updateMemberProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120, "Name is too long"),
  phone: z.string().trim().min(7, "Phone number is too short").max(20, "Phone number is too long"),
  organization: z.string().trim().max(160, "Organization is too long").optional(),
  designation: z.string().trim().max(160, "Designation is too long").optional(),
  interests: z.string().trim().max(2000, "Interests must be under 2000 characters").optional(),
})

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
    const parsed = updateMemberProfileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid profile data" },
        { status: 400 }
      )
    }

    const { name, phone, organization, designation, interests } = parsed.data

    const updatedMember = await prisma.member.update({
      where: { id: (session.user as any).id },
      data: {
        name,
        phone,
        organization: organization || null,
        designation: designation || null,
        interests: interests || null,
      },
      select: MEMBER_PROFILE_SELECT,
    })

    return NextResponse.json({ success: true, data: updatedMember })
  } catch (error) {
    console.error("Error updating member profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
