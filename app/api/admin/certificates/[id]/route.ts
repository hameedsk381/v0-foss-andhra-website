import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { CERTIFICATE_TYPES, defaultTitleFor } from "@/lib/certificates"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  type: z.string().refine((v) => CERTIFICATE_TYPES.some((t) => t.value === v)).optional(),
  title: z.string().trim().min(3).max(150).optional(),
  program: z.string().trim().max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  // revoke requires a reason; restore clears it
  action: z.enum(["revoke", "restore"]).optional(),
  revokedReason: z.string().trim().max(500).optional(),
})

// PUT - edit or revoke/restore a certificate
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

    const existing = await prisma.certificate.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ success: false, error: "Certificate not found" }, { status: 404 })

    if (d.startDate && d.endDate && d.endDate < d.startDate) {
      return NextResponse.json({ success: false, error: "End date must be after the start date" }, { status: 400 })
    }

    const data: Record<string, unknown> = {}
    const assign = (key: string, value: unknown) => {
      if (value !== undefined) data[key] = value === "" ? null : value
    }
    assign("name", d.name)
    assign("email", d.email?.toLowerCase())
    assign("type", d.type)
    if (d.type !== undefined) {
      data.type = d.type
      if (d.title === undefined && existing.title === defaultTitleFor(existing.type)) {
        data.title = defaultTitleFor(d.type)
      }
    }
    assign("title", d.title)
    assign("program", d.program)
    assign("description", d.description)
    if (d.startDate !== undefined) data.startDate = d.startDate ? new Date(`${d.startDate}T00:00:00.000Z`) : null
    if (d.endDate !== undefined) data.endDate = d.endDate ? new Date(`${d.endDate}T00:00:00.000Z`) : null

    if (d.action === "revoke") {
      data.status = "revoked"
      data.revokedAt = new Date()
      data.revokedReason = d.revokedReason || "Revoked by FOSS Andhra"
    } else if (d.action === "restore") {
      data.status = "active"
      data.revokedAt = null
      data.revokedReason = null
    }

    const certificate = await prisma.certificate.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, data: certificate })
  } catch (error) {
    logError(error as Error, { context: "admin_certificates_update" })
    return NextResponse.json({ success: false, error: "Failed to update certificate" }, { status: 500 })
  }
}

// DELETE - permanently remove a certificate
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const existing = await prisma.certificate.findUnique({ where: { id: params.id }, select: { id: true } })
    if (!existing) return NextResponse.json({ success: false, error: "Certificate not found" }, { status: 404 })

    await prisma.certificate.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "admin_certificates_delete" })
    return NextResponse.json({ success: false, error: "Failed to delete certificate" }, { status: 500 })
  }
}
