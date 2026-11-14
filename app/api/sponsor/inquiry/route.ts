import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { logError } from "@/lib/logger"

export const dynamic = "force-dynamic"

const inquirySchema = z.object({
  organization: z.string().trim().min(2, "Organisation name is too short").max(200),
  contactName: z.string().trim().min(2, "Contact name is too short").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(20).optional(),
  tier: z.enum(["platinum", "gold", "silver", "bronze", "custom"]).default("custom"),
  budget: z.string().trim().max(50).optional(),
  message: z.string().trim().min(10, "Tell us a bit more about what you'd like to support").max(2000),
})

// Public sponsorship inquiry -> admin pipeline at /admin/sponsors
export async function POST(request: NextRequest) {
  try {
    const parsed = inquirySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      )
    }
    const d = parsed.data

    const inquiry = await prisma.sponsorshipInquiry.create({
      data: {
        organization: d.organization,
        contactName: d.contactName,
        email: d.email.toLowerCase(),
        phone: d.phone || null,
        tier: d.tier,
        budget: d.budget || null,
        message: d.message,
        status: "new",
      },
      select: { id: true },
    })
    return NextResponse.json({ success: true, data: inquiry }, { status: 201 })
  } catch (error) {
    logError(error as Error, { context: "sponsor_inquiry" })
    return NextResponse.json({ success: false, error: "Failed to submit inquiry" }, { status: 500 })
  }
}
