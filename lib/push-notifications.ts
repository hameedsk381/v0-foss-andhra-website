import webpush from "web-push"
import { prisma } from "./prisma"

// Configure web-push
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidEmail = process.env.VAPID_EMAIL || "mailto:info@fossandhra.org"

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)
}

export interface PushNotificationData {
  title: string
  message: string
  url?: string
  icon?: string
  badge?: string
  type?: string
}

/**
 * Send push notification to a specific user
 */
export async function sendPushToUser(
  userId: string,
  data: PushNotificationData
) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  })

  return sendPushToSubscriptions(subscriptions, data, userId)
}

/**
 * Send push notification to all subscribers
 */
export async function sendPushToAll(data: PushNotificationData) {
  const subscriptions = await prisma.pushSubscription.findMany()
  return sendPushToSubscriptions(subscriptions, data)
}

/**
 * Send push notification to specific subscriptions
 */
async function sendPushToSubscriptions(
  subscriptions: Array<{
    endpoint: string
    p256dh: string
    auth: string
    userId?: string | null
  }>,
  data: PushNotificationData,
  userId?: string
) {
  if (subscriptions.length === 0) {
    return { sent: 0, total: 0, errors: [] }
  }

  const payload = JSON.stringify({
    title: data.title,
    body: data.message,
    icon: data.icon || "/icon-192x192.png",
    badge: data.badge || "/icon-96x96.png",
    url: data.url || "/",
    data: {
      url: data.url || "/",
      type: data.type || "general",
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
        // Remove invalid subscriptions
        if (error.statusCode === 410 || error.statusCode === 404) {
          await prisma.pushSubscription.delete({
            where: { endpoint: subscription.endpoint },
          })
        }
        return {
          success: false,
          endpoint: subscription.endpoint,
          error: error.message,
        }
      }
    })
  )

  const successful = results.filter(
    (r) => r.status === "fulfilled" && r.value.success
  ).length

  const errors = results
    .filter((r) => r.status === "rejected" || !r.value.success)
    .map((r) => (r.status === "rejected" ? r.reason : r.value.error))

  // Create in-app notification if userId provided
  if (userId) {
    await prisma.notification.create({
      data: {
        userId,
        type: data.type || "general",
        title: data.title,
        message: data.message,
        link: data.url,
      },
    })
  }

  return {
    sent: successful,
    total: subscriptions.length,
    errors,
  }
}

/**
 * Send event reminder notification
 */
export async function sendEventReminder(
  userId: string,
  eventTitle: string,
  eventDate: Date,
  eventUrl: string
) {
  return sendPushToUser(userId, {
    title: "Event Reminder",
    message: `${eventTitle} is happening soon!`,
    url: eventUrl,
    type: "event",
    icon: "/icon-192x192.png",
  })
}

/**
 * Send blog post notification
 */
export async function sendBlogPostNotification(
  postTitle: string,
  postUrl: string,
  authorName?: string
) {
  return sendPushToAll({
    title: "New Blog Post",
    message: `${postTitle}${authorName ? ` by ${authorName}` : ""}`,
    url: postUrl,
    type: "blog",
    icon: "/icon-192x192.png",
  })
}

