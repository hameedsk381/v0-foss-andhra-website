import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { slugify } from "@/lib/careers"
import { openingSchema } from "@/lib/careers-schema"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const openings = await prisma.careerOpening.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { CareerApplication: true } } },
    })
    return NextResponse.json({ success: true, data: openings })
  } catch (error) {
    console.error("Error fetching career openings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch openings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = openingSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }
    const data = parsed.data

    const slug = slugify(data.slug || data.title)
    if (!slug) {
      return NextResponse.json({ success: false, error: "A valid slug is required" }, { status: 400 })
    }
    if (await prisma.careerOpening.findUnique({ where: { slug }, select: { id: true } })) {
      return NextResponse.json({ success: false, error: "An opening with this slug already exists" }, { status: 409 })
    }

    const opening = await prisma.careerOpening.create({
      data: {
        ...data,
        slug,
        featured: data.featured ?? false,
        publishedAt: data.status === "open" ? new Date() : null,
      },
    })
    return NextResponse.json({ success: true, data: opening })
  } catch (error) {
    console.error("Error creating career opening:", error)
    return NextResponse.json({ success: false, error: "Failed to create opening" }, { status: 500 })
  }
}
