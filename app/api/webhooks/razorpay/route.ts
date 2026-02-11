import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendMemberWelcomeEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const signature = req.headers.get("x-razorpay-signature")
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET

        if (!webhookSecret) {
            console.error("RAZORPAY_WEBHOOK_SECRET is not set")
            return NextResponse.json({ error: "Configuration error" }, { status: 500 })
        }

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 })
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex")

        if (expectedSignature !== signature) {
            console.error("Invalid webhook signature")
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
        }

        const event = JSON.parse(body)

        // Handle payment.captured event
        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity
            const notes = payment.notes || {}
            const email = notes.userEmail || payment.email
            const phone = notes.phone || payment.contact

            if (!email) {
                console.error("No email found in payment entity")
                return NextResponse.json({ message: "No email found" }, { status: 200 })
            }

            // Check if member already exists (to prevent duplicate creation if client-side success handler already ran)
            const existingMember = await prisma.member.findFirst({
                where: {
                    OR: [
                        { paymentId: payment.id },
                        { email: email }
                    ]
                }
            })

            if (existingMember) {
                console.log(`Member already exists for payment ${payment.id} or email ${email}`)
                return NextResponse.json({ message: "Member already processed" }, { status: 200 })
            }

            console.log(`Processing webhook for new member: ${email}`)

            // Create new member
            const membershipId = `FOSS${Date.now()}`
            const resetToken = crypto.randomBytes(32).toString("hex")
            const resetTokenExpiry = new Date()
            resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 24)

            const tempPassword = crypto.randomBytes(16).toString("hex")
            const hashedPassword = await bcrypt.hash(tempPassword, 10)

            const expiryDate = new Date()
            expiryDate.setFullYear(expiryDate.getFullYear() + 1)

            try {
                await prisma.member.create({
                    data: {
                        name: notes.userName || "Member",
                        email: email,
                        phone: phone || "",
                        membershipType: notes.membershipType || "FOSStar Annual",
                        status: "active",
                        membershipId,
                        expiryDate,
                        paymentId: payment.id,
                        // Map notes back to member fields
                        organization: notes.organization,
                        designation: notes.designation,
                        experience: notes.experience,
                        interests: notes.interests,
                        address: notes.address, // Might be undefined if not in notes
                        password: hashedPassword,
                        resetToken,
                        resetTokenExpiry,
                    },
                })

                console.log("Member created via webhook:", membershipId)

                // Send welcome email
                try {
                    await sendMemberWelcomeEmail(email, {
                        name: notes.userName || "Member",
                        membershipId,
                        expiryDate,
                        resetToken,
                    })
                    console.log("Welcome email sent via webhook")
                } catch (emailError) {
                    console.error("Webhook: Email failed", emailError)
                }

            } catch (dbError) {
                console.error("Webhook: DB creation failed", dbError)
                return NextResponse.json({ error: "DB error" }, { status: 500 })
            }
        }

        return NextResponse.json({ status: "ok" })
    } catch (error) {
        console.error("Webhook processing error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
