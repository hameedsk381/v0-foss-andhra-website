import { NextRequest, NextResponse } from "next/server"
import { requireAdminAccess } from "@/lib/auth/admin"
import { prisma } from "@/lib/prisma"

const SECRET_KEYS = new Set(["razorpayKeySecret", "razorpayWebhookSecret", "smtpPass"])

function buildSecretMeta(settings: Record<string, string>) {
  return {
    hasRazorpayKeySecret: Boolean(settings.razorpayKeySecret),
    hasRazorpayWebhookSecret: Boolean(settings.razorpayWebhookSecret),
    hasSmtpPass: Boolean(settings.smtpPass),
  }
}

export async function GET() {
  try {
    const authError = await requireAdminAccess(["viewer", "editor", "admin"])
    if (authError) return authError

    const settingsRows = await prisma.settings.findMany()
    const settings = settingsRows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})

    const meta = buildSecretMeta(settings)
    for (const key of SECRET_KEYS) {
      if (key in settings) {
        settings[key] = ""
      }
    }

    return NextResponse.json({ success: true, data: settings, meta })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAccess(["admin"])
    if (authError) return authError

    const body = await request.json()
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 })
    }

    const updates = Object.entries(body)
      .filter(([key, value]) => {
        if (!SECRET_KEYS.has(key)) {
          return true
        }

        const secretValue = String(value ?? "").trim()
        return secretValue.length > 0
      })
      .map(([key, value]) =>
        prisma.settings.upsert({
          where: { key },
          update: { value: String(value ?? "") },
          create: { key, value: String(value ?? "") },
        }),
      )

    if (updates.length > 0) {
      await prisma.$transaction(updates)
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}

