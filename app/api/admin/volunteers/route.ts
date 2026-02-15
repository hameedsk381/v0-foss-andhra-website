import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const where = status && status !== "all" ? { status } : {}

    const volunteers = await prisma.volunteer.findMany({
      where,
      orderBy: { appliedAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        skills: true,
        interests: true,
        availability: true,
        status: true,
        appliedAt: true,
      },
    })

    return NextResponse.json({ success: true, data: volunteers })
  } catch (error) {
    console.error("Error fetching volunteers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch volunteers" }, { status: 500 })
  }
}
