import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const applySchema = z.object({
  name: z.string().trim().min(3, "Name is too short").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  headline: z.string().trim().min(10, "Add a short headline (e.g. 'Senior engineer, contributes to GNOME')").max(150),
  expertise: z.string().trim().min(3, "List at least one area of expertise").max(300),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
  githubUrl: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  availability: z.string().trim().max(200).optional().or(z.literal("")),
  maxMentees: z.coerce.number().int().min(1).max(10).default(2),
})

// Public mentor application -> admin review queue
export async function POST(request: NextRequest) {
  try {
    const parsed = applySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const duplicate = await prisma.mentorProfile.findFirst({
      where: { email: { equals: d.email.toLowerCase() }, status: { in: ["pending", "approved"] } },
      select: { id: true },
    })
    if (duplicate) {
      return NextResponse.json(
        { success: false, error: "A mentor application with this email already exists or is awaiting review." },
        { status: 409 },
      )
    }

    const mentor = await prisma.mentorProfile.create({
      data: {
        name: d.name,
        email: d.email.toLowerCase(),
        headline: d.headline,
        expertise: d.expertise,
        bio: d.bio || null,
        githubUrl: d.githubUrl || null,
        linkedinUrl: d.linkedinUrl || null,
        availability: d.availability || null,
        maxMentees: d.maxMentees,
        status: "pending",
      },
      select: { id: true },
    })
    return NextResponse.json({ success: true, data: mentor }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "mentors_apply" })
    return NextResponse.json({ success: false, error: "Failed to submit application" }, { status: 500 })
  }
}
