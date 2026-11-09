import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isOpeningAcceptingApplications } from "@/lib/careers"

export const dynamic = "force-dynamic"

// GET - public list of currently open openings (used by the home page section and popup).
export async function GET() {
  try {
    const openings = await prisma.careerOpening.findMany({
      where: { status: "open" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: 50,
      select: {
        id: true,
        slug: true,
        title: true,
        type: true,
        summary: true,
        location: true,
        workMode: true,
        applyDeadline: true,
        status: true,
        featured: true,
      },
    })

    const data = openings.filter(isOpeningAcceptingApplications).map(({ status: _status, ...rest }) => rest)
    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("Failed to load public career openings:", error)
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}
