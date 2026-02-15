import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdminAccess } from "@/lib/auth/admin"

export const dynamic = "force-dynamic"

// GET all donations
export async function GET(request: Request) {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    const donations = await prisma.donation.findMany({
      where: {
        ...(type && type !== "all" && { type }),
        ...(status && status !== "all" && { status }),
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: donations })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch donations" }, { status: 500 })
  }
}
