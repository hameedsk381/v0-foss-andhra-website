import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

// GET - list all clubs (including pending registrations) with optional status filter and q search
export async function GET(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const status = request.nextUrl.searchParams.get("status")?.trim()
    const q = request.nextUrl.searchParams.get("q")?.trim()

    const clubs = await prisma.programClub.findMany({
      where: {
        ...(status && status !== "all" ? { status } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { institution: { contains: q, mode: "insensitive" } },
                { location: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 500,
    })
    return NextResponse.json({ success: true, data: clubs })
  } catch (error) {
    logError(error as Error, { context: "admin_clubs_list" })
    return NextResponse.json({ success: false, error: "Failed to fetch clubs" }, { status: 500 })
  }
}
