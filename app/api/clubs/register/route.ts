import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const registerSchema = z.object({
  name: z.string().trim().min(3, "Club name is too short").max(150),
  institution: z.string().trim().min(3, "Institution name is too short").max(200),
  location: z.string().trim().min(2, "Location is too short").max(120),
  coordinatorName: z.string().trim().min(3, "Coordinator name is too short").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  coordinatorPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{6,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  members: z.coerce.number().int().min(1, "Member count must be at least 1").max(100000),
  established: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter the year the club started (e.g. 2024)"),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  githubUrl: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  websiteUrl: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
})

// Public club registration -> lands in the admin review queue as pending
export async function POST(request: NextRequest) {
  try {
    const parsed = registerSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    // Reject obvious self-promotion spam with a honeypot-style URL field check
    const suspicious = /https?:\/\//i.test(`${d.description ?? ""}`)
    if (suspicious) {
      return NextResponse.json(
        { success: false, error: "Remove links from the description — you can add website URLs in their own fields." },
        { status: 400 },
      )
    }

    const duplicate = await prisma.programClub.findFirst({
      where: {
        OR: [
          { institution: { equals: d.institution, mode: "insensitive" } },
          { email: { equals: d.email.toLowerCase() } },
        ],
        status: { in: ["pending", "approved"] },
      },
      select: { id: true },
    })
    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          error: "A club from this institution (or with this email) is already registered or awaiting review.",
        },
        { status: 409 },
      )
    }

    const club = await prisma.programClub.create({
      data: {
        name: d.name,
        institution: d.institution,
        location: d.location,
        coordinatorName: d.coordinatorName,
        coordinatorPhone: d.coordinatorPhone || null,
        email: d.email.toLowerCase(),
        members: d.members,
        established: d.established,
        description: d.description || null,
        githubUrl: d.githubUrl || null,
        websiteUrl: d.websiteUrl || null,
        status: "pending",
        active: false,
      },
      select: { id: true },
    })
    return NextResponse.json({ success: true, data: club }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "clubs_register" })
    return NextResponse.json({ success: false, error: "Failed to submit registration" }, { status: 500 })
  }
}
