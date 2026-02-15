import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

const DEFAULT_PREFERENCES = {
  eventReminders: true,
  newBlogPosts: true,
  membershipUpdates: true,
}

function preferencesKey(memberId: string) {
  return `member-notification-preferences:${memberId}`
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).userType !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const key = preferencesKey((session.user as any).id)
    const setting = await prisma.settings.findUnique({ where: { key } })

    if (!setting) {
      return NextResponse.json({ success: true, data: DEFAULT_PREFERENCES })
    }

    let parsed = DEFAULT_PREFERENCES
    try {
      parsed = {
        ...DEFAULT_PREFERENCES,
        ...(JSON.parse(setting.value) || {}),
      }
    } catch {
      parsed = DEFAULT_PREFERENCES
    }

    return NextResponse.json({ success: true, data: parsed })
  } catch (error) {
    console.error("Error fetching member preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).userType !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = {
      eventReminders: Boolean(body?.eventReminders),
      newBlogPosts: Boolean(body?.newBlogPosts),
      membershipUpdates: Boolean(body?.membershipUpdates),
    }

    const key = preferencesKey((session.user as any).id)
    await prisma.settings.upsert({
      where: { key },
      update: {
        value: JSON.stringify(data),
        description: "Member notification preferences",
      },
      create: {
        key,
        value: JSON.stringify(data),
        description: "Member notification preferences",
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error updating member preferences:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
