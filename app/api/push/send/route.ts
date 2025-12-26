import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import webpush from "web-push"

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidEmail = process.env.VAPID_EMAIL || "mailto:info@fossandhra.org"

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)
}

// POST - Send push notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, message, url, icon, badge, userId, type } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      )
    }

    // Get subscriptions
    const where: any = {}
    if (userId) {
      where.userId = userId
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where,
    })

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscriptions found",
        sent: 0,
      })
    }

    const payload = JSON.stringify({
      title,
      body: message,
      icon: icon || "/icon-192x192.png",
      badge: badge || "/icon-96x96.png",
      url: url || "/",
      data: {
        url: url || "/",
        type: type || "general",
      },
    })

    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            payload
          )
          return { success: true, endpoint: subscription.endpoint }
        } catch (error: any) {
          // If subscription is invalid, remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { endpoint: subscription.endpoint },
            })
          }
          return { success: false, endpoint: subscription.endpoint, error }
        }
      })
    )

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length

    // Create in-app notifications if userId specified
    if (userId) {
      await prisma.notification.create({
        data: {
          userId,
          type: type || "general",
          title,
          message,
          link: url,
        },
      })
    }

    return NextResponse.json({
      success: true,
      sent: successful,
      total: subscriptions.length,
    })
  } catch (error) {
    console.error("Error sending push notification:", error)
    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 }
    )
  }
}

// GET - Get VAPID public key
export async function GET() {
  return NextResponse.json({
    publicKey: process.env.VAPID_PUBLIC_KEY || "",
  })
}

