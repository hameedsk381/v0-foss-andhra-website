import { NextRequest, NextResponse } from "next/server"
import { requireAdminSession } from "@/lib/auth/admin"
import { prisma } from "@/lib/prisma"
import { sendMemberWelcomeEmail } from "@/lib/email"
import crypto from "crypto"

export const dynamic = "force-dynamic"

// POST — regenerate the set-password token and resend the welcome email.
// Used when a member never received or lost their onboarding email.
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { authError } = await requireAdminSession(["editor", "admin"])
    if (authError) return authError

    const member = await prisma.member.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        membershipId: true,
        expiryDate: true,
      },
    })

    if (!member) {
      return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.member.update({
      where: { id: member.id },
      data: { resetToken, resetTokenExpiry },
    })

    const result = await sendMemberWelcomeEmail(member.email, {
      name: member.name,
      membershipId: member.membershipId,
      expiryDate: member.expiryDate,
      resetToken,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Email could not be sent — check SMTP configuration" },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Welcome email with a fresh set-password link sent to ${member.email}`,
    })
  } catch (error) {
    console.error("Error resending welcome email:", error)
    return NextResponse.json({ success: false, error: "Failed to resend welcome email" }, { status: 500 })
  }
}
