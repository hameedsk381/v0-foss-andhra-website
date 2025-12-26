import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// POST - Subscribe to push notifications
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session ? (session.user as any).id : null

    const body = await request.json()
    const { endpoint, keys } = body

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      )
    }

    // Store or update subscription
    const subscription = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: userId || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
        updatedAt: new Date(),
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: userId || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      data: { id: subscription.id },
    })
  } catch (error) {
    console.error("Error subscribing to push:", error)
    return NextResponse.json(
      { error: "Failed to subscribe to push notifications" },
      { status: 500 }
    )
  }
}

// DELETE - Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint } = body

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      )
    }

    await prisma.pushSubscription.delete({
      where: { endpoint },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unsubscribing from push:", error)
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    )
  }
}

