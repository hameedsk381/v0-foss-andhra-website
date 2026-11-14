import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { uniqueMemberSlug } from "@/lib/member/public-profile"

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
  // Public profile (opt-in)
  profileVisible: z.boolean().optional(),
  publicBio: z.string().trim().max(600, "Bio must be under 600 characters").optional().or(z.literal("")),
  publicSkills: z.string().trim().max(300, "Skills must be under 300 characters").optional().or(z.literal("")),
  githubUrl: z.string().trim().url("Enter a valid GitHub URL").max(300).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url("Enter a valid LinkedIn URL").max(300).optional().or(z.literal("")),
  websiteUrl: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
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

    if (member.status === "suspended") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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

    const suspendedMember = await prisma.member.findUnique({
      where: { id: (session.user as any).id },
      select: { status: true },
    })
    if (!suspendedMember || suspendedMember.status === "suspended") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { name, phone, organization, designation, interests } = parsed.data
    const {
      profileVisible,
      publicBio,
      publicSkills,
      githubUrl,
      linkedinUrl,
      websiteUrl,
    } = parsed.data

    // Assign the public slug once, on first visibility; never change it afterwards
    const data: Record<string, unknown> = {
      name,
      phone,
      organization: organization || null,
      designation: designation || null,
      interests: interests || null,
    }
    if (profileVisible !== undefined) {
      data.profileVisible = profileVisible
      if (profileVisible) {
        const current = await prisma.member.findUnique({
          where: { id: (session.user as any).id },
          select: { publicSlug: true, name: true },
        })
        if (current && !current.publicSlug) {
          data.publicSlug = await uniqueMemberSlug(current.name)
        }
      }
    }
    if (publicBio !== undefined) data.publicBio = publicBio || null
    if (publicSkills !== undefined) data.publicSkills = publicSkills || null
    if (githubUrl !== undefined) data.githubUrl = githubUrl || null
    if (linkedinUrl !== undefined) data.linkedinUrl = linkedinUrl || null
    if (websiteUrl !== undefined) data.websiteUrl = websiteUrl || null

    const updatedMember = await prisma.member.update({
      where: { id: (session.user as any).id },
      data,
      select: { ...MEMBER_PROFILE_SELECT, publicSlug: true },
    })

    return NextResponse.json({ success: true, data: updatedMember })
  } catch (error) {
    console.error("Error updating member profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
