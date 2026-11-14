import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const updateSchema = z.object({
  status: z.enum(["new", "contacted", "proposal", "won", "lost"]).optional(),
  notes: z.string().trim().max(2000).optional(),
})

// PUT - move an inquiry through the pipeline / add notes
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
    if (d.status !== undefined) data.status = d.status
    if (d.notes !== undefined) data.notes = d.notes || null

    const inquiry = await prisma.sponsorshipInquiry.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true, data: inquiry })
  } catch (error) {
    logError(error as Error, { context: "admin_sponsors_update" })
    return NextResponse.json({ success: false, error: "Failed to update inquiry" }, { status: 500 })
  }
}
