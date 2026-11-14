import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdminSessionOrKey } from "@/lib/auth/admin"
import { logError } from "@/lib/logger"
import { SITE_CONTENT_KEYS, getHomeContent, getFooterContent } from "@/lib/site-content"

export const dynamic = "force-dynamic"

// GET - current site content (DB values merged over defaults)
export async function GET() {
  try {
    const { authError } = await requireAdminSessionOrKey(["viewer", "editor", "admin"])
    if (authError) return authError

    const [home, footer] = await Promise.all([getHomeContent(), getFooterContent()])
    return NextResponse.json({ success: true, data: { home, footer } })
  } catch (error) {
    logError(error as Error, { context: "site_content_get" })
    return NextResponse.json({ success: false, error: "Failed to load site content" }, { status: 500 })
  }
}

const payloadSchema = z.object({
  key: z.enum([SITE_CONTENT_KEYS.home, SITE_CONTENT_KEYS.footer]),
  // Arbitrary JSON object for the section; validated client-side by the editor
  value: z.record(z.unknown()),
})

// PUT - save a content section (stored as JSON in the Settings table)
export async function PUT(request: NextRequest) {
  try {
    const { authError } = await requireAdminSessionOrKey(["editor", "admin"])
    if (authError) return authError

    const parsed = payloadSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }

    await prisma.settings.upsert({
      where: { key: parsed.data.key },
      update: { value: JSON.stringify(parsed.data.value) },
      create: {
        key: parsed.data.key,
        value: JSON.stringify(parsed.data.value),
        description: "Managed by /admin/site-content",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logError(error as Error, { context: "site_content_put" })
    return NextResponse.json({ success: false, error: "Failed to save site content" }, { status: 500 })
  }
}
