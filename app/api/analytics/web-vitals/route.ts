import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST - Store Web Vitals metrics
export async function POST(request: NextRequest) {
  try {
    const metric = await request.json()

    // Store in analytics table
    await prisma.analytics.create({
      data: {
        id: `av-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: `web-vital-${metric.name}`,
        value: metric.value,
        metadata: JSON.stringify({
          rating: metric.rating,
          delta: metric.delta,
          navigationType: metric.navigationType,
          id: metric.id,
        }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error storing web vitals:", error)
    // Don't fail the request - vitals tracking should be non-blocking
    return NextResponse.json({ success: false }, { status: 200 })
  }
}

