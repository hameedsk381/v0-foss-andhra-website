import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { slugify } from "@/lib/careers"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const chapterSchema = z.object({
  city: z.string().trim().min(2).max(100),
  district: z.string().trim().max(100).optional(),
  description: z.string().trim().min(10).max(2000),
  meetingInfo: z.string().trim().max(500).optional(),
  coordinators: z.string().trim().max(300).optional(),
  contactEmail: z.string().trim().email().max(200).optional().or(z.literal("")),
  whatsappUrl: z.string().trim().url().max(300).optional().or(z.literal("")),
  telegramUrl: z.string().trim().url().max(300).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
  order: z.coerce.number().int().min(0).max(999).optional(),
})

// GET - all chapters (admin view, includes drafts)
export async function GET() {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const chapters = await prisma.chapter.findMany({ orderBy: [{ order: "asc" }, { city: "asc" }] })
    return NextResponse.json({ success: true, data: chapters })
  } catch (error) {
    logError(error as Error, { context: "admin_chapters_list" })
    return NextResponse.json({ success: false, error: "Failed to fetch chapters" }, { status: 500 })
  }
}

// POST - create a chapter (slug derived from city, unique-safe, stable once created)
export async function POST(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = chapterSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const base = slugify(d.city) || "chapter"
    let slug = base
    let n = 2
    while (await prisma.chapter.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${base}-${n++}`
    }

    const chapter = await prisma.chapter.create({
      data: {
        slug,
        city: d.city,
        district: d.district || null,
        description: d.description,
        meetingInfo: d.meetingInfo || null,
        coordinators: d.coordinators || null,
        contactEmail: d.contactEmail || null,
        whatsappUrl: d.whatsappUrl || null,
        telegramUrl: d.telegramUrl || null,
        status: d.status,
        order: d.order ?? 0,
      },
    })
    return NextResponse.json({ success: true, data: chapter }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "admin_chapters_create" })
    return NextResponse.json({ success: false, error: "Failed to create chapter" }, { status: 500 })
  }
}
