import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSession } from "@/lib/auth/admin"
import { APPLICATION_STATUSES } from "@/lib/careers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { authError } = await requireAdminSession(["viewer", "editor", "admin"])
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const openingId = searchParams.get("openingId")

    const applications = await prisma.careerApplication.findMany({
      where: {
        ...(status && (APPLICATION_STATUSES as readonly string[]).includes(status) ? { status } : {}),
        ...(openingId ? { openingId } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { CareerOpening: { select: { title: true, type: true } } },
    })
    return NextResponse.json({ success: true, data: applications })
  } catch (error) {
    console.error("Error fetching career applications:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch applications" }, { status: 500 })
  }
}
