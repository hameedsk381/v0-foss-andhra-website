import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { slugify } from "@/lib/careers"
import { RESOURCE_CATEGORIES } from "@/lib/resources"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const resourceSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(1000),
  category: z.string().refine((v) => RESOURCE_CATEGORIES.some((c) => c.value === v), "Unknown category"),
  format: z.string().trim().max(50).optional(),
  externalUrl: z.string().trim().url("Enter a valid URL").max(500),
  sizeLabel: z.string().trim().max(30).optional(),
  access: z.enum(["public", "members"]).default("public"),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  order: z.coerce.number().int().min(0).max(999).optional(),
})

// GET - all resources (admin view, includes drafts)
export async function GET(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const q = request.nextUrl.searchParams.get("q")?.trim()
    const resources = await prisma.resourceItem.findMany({
      where: q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      take: 500,
    })
    return NextResponse.json({ success: true, data: resources })
  } catch (error) {
    logError(error as Error, { context: "admin_resources_list" })
    return NextResponse.json({ success: false, error: "Failed to fetch resources" }, { status: 500 })
  }
}

// POST - create a resource
export async function POST(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = resourceSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const base = slugify(d.title) || "resource"
    let slug = base
    let n = 2
    while (await prisma.resourceItem.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${base}-${n++}`
    }

    const resource = await prisma.resourceItem.create({
      data: {
        slug,
        title: d.title,
        description: d.description,
        category: d.category,
        format: d.format || null,
        externalUrl: d.externalUrl,
        sizeLabel: d.sizeLabel || null,
        access: d.access,
        featured: d.featured,
        status: d.status,
        order: d.order ?? 0,
      },
    })
    return NextResponse.json({ success: true, data: resource }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "admin_resources_create" })
    return NextResponse.json({ success: false, error: "Failed to create resource" }, { status: 500 })
  }
}
