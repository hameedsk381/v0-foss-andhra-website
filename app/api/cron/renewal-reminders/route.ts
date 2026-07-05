import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendRenewalReminderEmail } from "@/lib/email"

export const dynamic = "force-dynamic"
export const maxDuration = 60

// Day boundaries for "N days from now", ignoring time-of-day so a cron that
// runs at any hour still catches members expiring "on" that calendar day.
function dayRange(daysFromNow: number) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() + daysFromNow)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { gte: start, lt: end }
}

async function sendBatch(
  windowDays: number,
  reminderField: "renewal30ReminderSentAt" | "renewal7ReminderSentAt"
) {
  const members = await prisma.member.findMany({
    where: {
      status: "active",
      expiryDate: dayRange(windowDays),
      [reminderField]: null,
    },
    select: { id: true, name: true, email: true, membershipId: true, expiryDate: true },
  })

  let sent = 0
  let failed = 0

  for (const member of members) {
    try {
      const result = await sendRenewalReminderEmail(member.email, {
        name: member.name,
        membershipId: member.membershipId,
        expiryDate: member.expiryDate,
        daysUntilExpiry: windowDays,
      })
      if (result.success) {
        await prisma.member.update({
          where: { id: member.id },
          data: { [reminderField]: new Date() },
        })
        sent++
      } else {
        failed++
      }
    } catch (error) {
      console.error(`Renewal reminder failed for ${member.email}:`, error)
      failed++
    }
  }

  return { windowDays, candidates: members.length, sent, failed }
}

// GET — triggered by an external scheduler (cron container, system crontab,
// uptime-monitor webhook). Authenticated via a shared secret header/query
// param since this isn't Vercel Cron.
export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET
  if (!expectedSecret) {
    return NextResponse.json(
      { success: false, error: "CRON_SECRET is not configured on the server" },
      { status: 500 }
    )
  }

  const providedSecret =
    request.headers.get("x-cron-secret") || request.nextUrl.searchParams.get("secret")

  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [thirtyDay, sevenDay] = await Promise.all([
      sendBatch(30, "renewal30ReminderSentAt"),
      sendBatch(7, "renewal7ReminderSentAt"),
    ])

    return NextResponse.json({
      success: true,
      ranAt: new Date().toISOString(),
      results: [thirtyDay, sevenDay],
    })
  } catch (error) {
    console.error("Renewal reminder cron failed:", error)
    return NextResponse.json({ success: false, error: "Cron job failed" }, { status: 500 })
  }
}
