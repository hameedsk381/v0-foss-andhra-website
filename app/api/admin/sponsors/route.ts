import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

// GET - sponsorship inquiries with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const status = request.nextUrl.searchParams.get("status")?.trim()
    const inquiries = await prisma.sponsorshipInquiry.findMany({
      where: status && status !== "all" ? { status } : {},
      orderBy: { createdAt: "desc" },
      take: 500,
    })
    return NextResponse.json({ success: true, data: inquiries })
  } catch (error) {
    logError(error as Error, { context: "admin_sponsors_list" })
    return NextResponse.json({ success: false, error: "Failed to fetch inquiries" }, { status: 500 })
  }
}
