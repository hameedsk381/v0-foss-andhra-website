import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

// POST - count an open/download click; returns the external URL for the client to open
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.resourceItem.findUnique({
      where: { id: params.id },
      select: { id: true, externalUrl: true, status: true, access: true },
    })
    if (!item || item.status !== "published") {
      return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 })
    }
    await prisma.resourceItem.update({
      where: { id: item.id },
      data: { downloadCount: { increment: 1 } },
    })
    return NextResponse.json({ success: true, data: { url: item.externalUrl } })
  } catch (error) {
    logError(error as Error, { context: "resources_track" })
    return NextResponse.json({ success: false, error: "Failed to track" }, { status: 500 })
  }
}
