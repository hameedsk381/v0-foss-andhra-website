"use server"

import { prisma } from "@/lib/prisma"
import { sendMemberWelcomeEmail } from "@/lib/email"

interface CreateOrderData {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}

export async function createPaymentOrder(data: CreateOrderData) {
  try {
    // Debug: Log environment variables (remove in production)
    console.log("RAZORPAY_KEY_ID exists:", !!process.env.RAZORPAY_KEY_ID)
    console.log("RAZORPAY_KEY_SECRET exists:", !!process.env.RAZORPAY_KEY_SECRET)

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      console.error("Missing Razorpay credentials:", { keyId: !!keyId, keySecret: !!keySecret })
      throw new Error("Razorpay configuration is missing. Please check environment variables.")
    }

    // Create order using Razorpay API
    const orderData = {
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      notes: data.notes || {},
    }

    console.log("Creating order with data:", orderData)

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Razorpay API error:", response.status, errorText)
      throw new Error(`Razorpay API error: ${response.status} - ${errorText}`)
    }

    const order = await response.json()
    console.log("Order created successfully:", order.id)

    return {
      success: true,
      order,
      keyId: keyId,
    }
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment order",
    }
  }
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string,
  userDetails: any,
  membershipType?: string,
  additionalData?: any // ✅ Add additionalData parameter
) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      throw new Error("Razorpay secret key is missing")
    }

    const crypto = require("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(orderId + "|" + paymentId)
      .digest("hex")

    if (expectedSignature === signature) {
      // Payment is verified successfully
      console.log("Payment verified for user:", userDetails.email)

      // Generate unique membership ID
      const membershipId = `FOSS${Date.now()}`

      // Save member to database
      try {
        const expiryDate = new Date()
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)

        const newMember = await prisma.member.create({
          data: {
            name: userDetails.name,
            email: userDetails.email,
            phone: userDetails.phone,
            membershipType: membershipType || "FOSStar Annual",
            status: "active",
            membershipId,
            expiryDate,
            paymentId,
            metadata: additionalData || {}, // ✅ Save additional data
          },
        })

        console.log("Member saved to database:", membershipId)

        // Send welcome email
        await sendMemberWelcomeEmail(userDetails.email, {
          name: userDetails.name,
          membershipId,
          expiryDate
        })

        console.log("Welcome email sent to:", userDetails.email)
      } catch (dbError) {
        console.error("Error saving member to database:", dbError)
        // Continue even if DB save fails
      }

      return {
        success: true,
        message: "Payment verified successfully",
        membershipId,
      }
    } else {
      console.error("Payment verification failed: signature mismatch")
      return {
        success: false,
        error: "Payment verification failed - invalid signature",
      }
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return {
      success: false,
      error: "Payment verification failed",
    }
  }
}
