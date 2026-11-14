import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { slugify } from "@/lib/careers"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const hackathonSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(3000),
  theme: z.string().trim().max(200).optional(),
  status: z.enum(["draft", "registration_open", "judging", "completed"]).default("draft"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  regDeadline: z.string().datetime().optional(),
  venue: z.string().trim().max(200).optional(),
  externalUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  rules: z.string().trim().max(5000).optional(),
  prizes: z.string().trim().max(2000).optional(),
})

// GET - all hackathons with problem statements and team counts
export async function GET() {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const hackathons = await prisma.hackathon.findMany({
      orderBy: { startDate: "desc" },
      include: {
        ProblemStatement: { orderBy: { order: "asc" } },
        _count: { select: { Team: true } },
      },
      take: 100,
    })
    return NextResponse.json({ success: true, data: hackathons })
  } catch (error) {
    logError(error as Error, { context: "admin_hackathons_list" })
    return NextResponse.json({ success: false, error: "Failed to fetch hackathons" }, { status: 500 })
  }
}

// POST - create a hackathon
export async function POST(request: NextRequest) {
  try {
    const { session, authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = hackathonSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    if (d.endDate <= d.startDate) {
      return NextResponse.json({ success: false, error: "End date must be after the start date" }, { status: 400 })
    }

    const base = slugify(d.title) || "hackathon"
    let slug = base
    let n = 2
    while (await prisma.hackathon.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${base}-${n++}`
    }

    const hackathon = await prisma.hackathon.create({
      data: {
        slug,
        title: d.title,
        description: d.description,
        theme: d.theme || null,
        status: d.status,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
        regDeadline: d.regDeadline ? new Date(d.regDeadline) : null,
        venue: d.venue || null,
        externalUrl: d.externalUrl || null,
        rules: d.rules || null,
        prizes: d.prizes || null,
        createdBy: session?.user?.id ?? null,
      },
    })
    return NextResponse.json({ success: true, data: hackathon }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "admin_hackathons_create" })
    return NextResponse.json({ success: false, error: "Failed to create hackathon" }, { status: 500 })
  }
}
