import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

// POST { token } — confirm a member's email address
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token || typeof token !== "string") {
      return NextResponse.json({ success: false, error: "Missing verification token" }, { status: 400 })
    }

    const member = await prisma.member.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpiry: { gt: new Date() },
      },
      select: { id: true, emailVerified: true },
    })

    if (!member) {
      return NextResponse.json(
        { success: false, error: "This verification link is invalid or has expired" },
        { status: 400 }
      )
    }

    await prisma.member.update({
      where: { id: member.id },
      data: {
        emailVerified: member.emailVerified ?? new Date(),
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    })

    return NextResponse.json({ success: true, message: "Email verified — you can now log in" })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}

// PUT { email } — resend the verification email.
// Always responds with the same message so it can't be used to probe accounts.
export async function PUT(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const genericResponse = NextResponse.json({
      success: true,
      message: "If an unverified account exists for this email, a verification link has been sent",
    })

    const member = await prisma.member.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, name: true, email: true, emailVerified: true, verifyTokenExpiry: true },
    })

    if (!member || member.emailVerified) {
      return genericResponse
    }

    // Light rate limit: reuse window — don't send more than one mail per 2 minutes
    if (member.verifyTokenExpiry && member.verifyTokenExpiry.getTime() - Date.now() > 24 * 60 * 60 * 1000 - 2 * 60 * 1000) {
      return genericResponse
    }

    const verifyToken = crypto.randomBytes(32).toString("hex")
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.member.update({
      where: { id: member.id },
      data: { verifyToken, verifyTokenExpiry },
    })

    await sendVerificationEmail(member.email, { name: member.name, token: verifyToken })

    return genericResponse
  } catch (error) {
    console.error("Error resending verification email:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification email" }, { status: 500 })
  }
}
