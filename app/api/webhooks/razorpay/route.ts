import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { completeDonationPayment, completeMembershipPayment, type PaymentPurpose } from "@/lib/payment/fulfillment"
import { getRazorpayRuntimeConfig } from "@/lib/payment/razorpay"

export const dynamic = "force-dynamic"

interface RazorpayPaymentEntity {
  id: string
  order_id?: string
  email?: string
  contact?: string
  notes?: Record<string, string>
}

function resolvePurpose(notes?: Record<string, string>): PaymentPurpose {
  return notes?.paymentPurpose === "donation" ? "donation" : "membership"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 })
    }

    const { webhookSecret, keySecret } = await getRazorpayRuntimeConfig({
      requireSecret: false,
      requireWebhookSecret: false,
    })
    const effectiveWebhookSecret = webhookSecret || keySecret

    if (!effectiveWebhookSecret) {
      console.error("Razorpay webhook secret is not configured")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    const expectedSignature = crypto.createHmac("sha256", effectiveWebhookSecret).update(body).digest("hex")

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)
    if (event?.event !== "payment.captured") {
      return NextResponse.json({ status: "ignored" })
    }

    const payment = event?.payload?.payment?.entity as RazorpayPaymentEntity | undefined
    if (!payment?.id || !payment.order_id) {
      return NextResponse.json({ status: "ignored", reason: "Missing payment metadata" })
    }

    const notes = payment.notes || {}
    const paymentPurpose = resolvePurpose(notes)

    if (paymentPurpose === "donation") {
      const donationId = notes.donationId
      if (!donationId) {
        console.warn(`Webhook donation payment ${payment.id} missing donationId`)
        return NextResponse.json({ status: "ignored", reason: "Missing donationId" })
      }

      await completeDonationPayment({
        donationId,
        paymentId: payment.id,
        orderId: payment.order_id,
      })

      return NextResponse.json({ status: "ok", paymentPurpose })
    }

    const email = notes.userEmail || payment.email
    if (!email) {
      console.warn(`Webhook membership payment ${payment.id} missing email`)
      return NextResponse.json({ status: "ignored", reason: "Missing email" })
    }

    await completeMembershipPayment({
      paymentId: payment.id,
      orderId: payment.order_id,
      userDetails: {
        name: notes.userName || "Member",
        email,
        phone: notes.phone || payment.contact || "",
      },
      membershipType: notes.membershipType || "FOSStar Annual",
      additionalData: notes,
    })

    return NextResponse.json({ status: "ok", paymentPurpose })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

