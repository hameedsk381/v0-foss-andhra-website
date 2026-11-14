import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(10).max(3000).optional(),
  theme: z.string().trim().max(200).optional(),
  status: z.enum(["draft", "registration_open", "judging", "completed"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  regDeadline: z.string().datetime().optional(),
  venue: z.string().trim().max(200).optional(),
  externalUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  rules: z.string().trim().max(5000).optional(),
  prizes: z.string().trim().max(2000).optional(),
})

// PUT - edit a hackathon (slug stays stable)
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
    for (const key of ["title", "description", "theme", "status", "venue", "rules", "prizes"] as const) {
      const value = d[key]
      if (value !== undefined) data[key] = value === "" ? null : value
    }
    if (d.startDate) data.startDate = new Date(d.startDate)
    if (d.endDate) data.endDate = new Date(d.endDate)
    if (d.regDeadline !== undefined) data.regDeadline = d.regDeadline ? new Date(d.regDeadline) : null
    if (d.externalUrl !== undefined) data.externalUrl = d.externalUrl || null

    const hackathon = await prisma.hackathon.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, data: hackathon })
  } catch (error) {
    logError(error as Error, { context: "admin_hackathons_update" })
    return NextResponse.json({ success: false, error: "Failed to update hackathon" }, { status: 500 })
  }
}

// DELETE - remove a hackathon (problem statements and teams cascade)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const existing = await prisma.hackathon.findUnique({ where: { id: params.id }, select: { id: true } })
    if (!existing) return NextResponse.json({ success: false, error: "Hackathon not found" }, { status: 404 })

    await prisma.hackathon.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_hackathons_delete" })
    return NextResponse.json({ success: false, error: "Failed to delete hackathon" }, { status: 500 })
  }
}
