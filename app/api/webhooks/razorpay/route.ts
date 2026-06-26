import { NextRequest, NextResponse } from "next/server"
import {
  completeDonationPayment,
  completeMembershipPayment,
  type PaymentPurpose,
} from "@/lib/payment/fulfillment"
import {
  getRazorpayRuntimeConfig,
  verifyRazorpayWebhookSignature,
} from "@/lib/payment/razorpay"
import { prisma } from "@/lib/prisma"
import { logPaymentEvent } from "@/lib/payment/logger"

export const dynamic = "force-dynamic"

interface RazorpayPaymentEntity {
  id: string
  order_id?: string
  amount?: number
  currency?: string
  email?: string
  contact?: string
  notes?: Record<string, string>
}

function resolvePurpose(notes?: Record<string, string>): PaymentPurpose {
  return notes?.paymentPurpose === "donation" ? "donation" : "membership"
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("x-razorpay-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature header" }, { status: 400 })
  }

  let webhookSecret: string | undefined

  try {
    const config = await getRazorpayRuntimeConfig({
      requireSecret: false,
      requireWebhookSecret: true, // Webhook secret is now mandatory.
    })
    webhookSecret = config.webhookSecret
  } catch {
    console.error("[webhook] Razorpay webhook secret is not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  if (!webhookSecret) {
    console.error("[webhook] Razorpay webhook secret resolved to empty")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  const signatureValid = verifyRazorpayWebhookSignature({ body, signature, webhookSecret })
  if (!signatureValid) {
    console.error("[webhook] Invalid Razorpay webhook signature")
    await logPaymentEvent({
      event: "webhook_signature_invalid",
      metadata: { signaturePrefix: signature.slice(0, 8) },
    })
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  let event: unknown
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const eventObj = event as Record<string, unknown>

  if (eventObj?.event !== "payment.captured") {
    return NextResponse.json({ status: "ignored" })
  }

  const payment = (eventObj?.payload as any)?.payment?.entity as
    | RazorpayPaymentEntity
    | undefined

  if (!payment?.id || !payment.order_id) {
    return NextResponse.json({ status: "ignored", reason: "Missing payment metadata" })
  }

  const notes = payment.notes || {}
  const paymentPurpose = resolvePurpose(notes)

  try {
    if (paymentPurpose === "donation") {
      const donationId = notes.donationId
      if (!donationId) {
        console.warn(`[webhook] donation payment ${payment.id} missing donationId`)
        return NextResponse.json({ status: "ignored", reason: "Missing donationId" })
      }

      // Ownership check: ensure the order belongs to this donation.
      const donation = await prisma.donation.findUnique({
        where: { id: donationId },
        select: { id: true, status: true, razorpayOrderId: true, amount: true },
      })

      if (!donation) {
        console.warn(`[webhook] donationId ${donationId} not found in DB`)
        return NextResponse.json({ status: "ignored", reason: "Unknown donation" })
      }

      if (
        donation.razorpayOrderId &&
        donation.razorpayOrderId !== payment.order_id
      ) {
        console.error(
          `[webhook] order_id mismatch for donation ${donationId}: ` +
            `expected ${donation.razorpayOrderId}, got ${payment.order_id}`,
        )
        await logPaymentEvent({
          event: "webhook_order_mismatch",
          paymentId: payment.id,
          metadata: { donationId, expected: donation.razorpayOrderId, got: payment.order_id },
        })
        return NextResponse.json({ error: "Order ID mismatch" }, { status: 400 })
      }

      await completeDonationPayment({
        donationId,
        paymentId: payment.id,
        orderId: payment.order_id,
      })

      await logPaymentEvent({
        event: "donation_completed_via_webhook",
        paymentId: payment.id,
        metadata: { donationId, orderId: payment.order_id },
      })

      return NextResponse.json({ status: "ok", paymentPurpose })
    }

    // Membership path
    const email = notes.userEmail || payment.email
    if (!email) {
      console.warn(`[webhook] membership payment ${payment.id} missing email`)
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

    await logPaymentEvent({
      event: "membership_completed_via_webhook",
      paymentId: payment.id,
      metadata: { email, orderId: payment.order_id, membershipType: notes.membershipType },
    })

    return NextResponse.json({ status: "ok", paymentPurpose })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("[webhook] processing error:", message)
    await logPaymentEvent({
      event: "webhook_processing_error",
      paymentId: payment.id,
      metadata: { error: message, paymentPurpose },
    })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
