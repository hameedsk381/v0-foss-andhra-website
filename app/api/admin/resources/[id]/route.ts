import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { RESOURCE_CATEGORIES } from "@/lib/resources"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(10).max(1000).optional(),
  category: z.string().refine((v) => RESOURCE_CATEGORIES.some((c) => c.value === v)).optional(),
  format: z.string().trim().max(50).optional(),
  externalUrl: z.string().trim().url().max(500).optional(),
  sizeLabel: z.string().trim().max(30).optional(),
  access: z.enum(["public", "members"]).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
  order: z.coerce.number().int().min(0).max(999).optional(),
})

// PUT - edit a resource (slug stays stable)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = updateSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const data: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(d)) {
      if (value === undefined) continue
      data[key] = value === "" && ["format", "sizeLabel"].includes(key) ? null : value
    }

    const resource = await prisma.resourceItem.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, data: resource })
  } catch (error) {
    logError(error as Error, { context: "admin_resources_update" })
    return NextResponse.json({ success: false, error: "Failed to update resource" }, { status: 500 })
  }
}

// DELETE - remove a resource
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const existing = await prisma.resourceItem.findUnique({ where: { id: params.id }, select: { id: true } })
    if (!existing) return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 })

    await prisma.resourceItem.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_resources_delete" })
    return NextResponse.json({ success: false, error: "Failed to delete resource" }, { status: 500 })
  }
}
