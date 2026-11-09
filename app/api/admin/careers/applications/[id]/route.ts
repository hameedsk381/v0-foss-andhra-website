import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSession } from "@/lib/auth/admin"
import { APPLICATION_STATUSES } from "@/lib/careers"

export const dynamic = "force-dynamic"

const patchSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  adminNotes: z.string().trim().max(4000).nullable().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSession(["editor", "admin"])
    if (authError) return authError

    const parsed = patchSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid status or notes" }, { status: 400 })
    }

    if (parsed.data.status === "offered") {
      return NextResponse.json(
        { success: false, error: "Use Issue offer letter to move an application to offered" },
        { status: 400 },
      )
    }

    const application = await prisma.careerApplication.update({
      where: { id: params.id },
      data: parsed.data,
    })
    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    console.error("Error updating career application:", error)
    return NextResponse.json({ success: false, error: "Failed to update application" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authError } = await requireAdminSession(["admin"])
    if (authError) return authError

    await prisma.careerApplication.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting career application:", error)
    return NextResponse.json({ success: false, error: "Failed to delete application" }, { status: 500 })
  }
}
