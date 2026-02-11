"use server"

import { prisma } from "@/lib/prisma"
import { sendMemberWelcomeEmail } from "@/lib/email"

interface CreateOrderData {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
  additionalData?: any
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

    // Prepare notes from additionalData
    const notes: Record<string, string> = {
      ...data.notes,
    }

    if (data.additionalData) {
      // Razorpay notes values must be strings and have length limits
      // We truncate to ensure we don't hit limits safely, though 256 chars is usually enough for these fields
      if (data.additionalData.organization) notes.organization = String(data.additionalData.organization).substring(0, 250)
      if (data.additionalData.designation) notes.designation = String(data.additionalData.designation).substring(0, 250)
      if (data.additionalData.experience) notes.experience = String(data.additionalData.experience).substring(0, 250)
      if (data.additionalData.interests) notes.interests = String(data.additionalData.interests).substring(0, 250) // Truncate long interests
      if (data.additionalData.referral) notes.referral = String(data.additionalData.referral).substring(0, 250)
      if (data.additionalData.phone) notes.phone = String(data.additionalData.phone).substring(0, 40)
    }

    // Create order using Razorpay API
    const orderData = {
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      notes: notes,
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
  userDetails: {
    name: string
    email: string
    phone: string
  },
  membershipType?: string,
  additionalData?: any
) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keySecret) {
      throw new Error("Razorpay secret key is missing")
    }

    const crypto = await import("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(orderId + "|" + paymentId)
      .digest("hex")

    if (expectedSignature !== signature) {
      console.error("Payment verification failed: signature mismatch")
      return {
        success: false,
        error: "Payment verification failed - invalid signature",
      }
    }

    // Payment is verified successfully
    console.log("Payment verified for user:", userDetails.email)

    // Generate unique membership ID
    // Generate unique membership ID
    const membershipId = `FOSS${Date.now()}`

    // Generate secure reset token for password setting
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 24) // Valid for 24 hours

    // Generate a random initial password (not sent to user) to satisfy DB constraints if any,
    // and to ensure account is not easily accessible until password is set.
    const tempPassword = crypto.randomBytes(16).toString("hex")
    const bcrypt = await import("bcryptjs")
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)

    // Save member to database
    try {
      await prisma.member.create({
        data: {
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          membershipType: membershipType || "FOSStar Annual",
          status: "active",
          membershipId,
          expiryDate,
          paymentId,
          organization:
            additionalData?.institution ||
            additionalData?.institutionName ||
            additionalData?.company ||
            additionalData?.companyName ||
            additionalData?.organizationName,
          address: additionalData?.address,
          designation: additionalData?.designation || additionalData?.course,
          experience: additionalData?.experience || additionalData?.year,
          interests: additionalData?.interests || additionalData?.contribution || additionalData?.expectations,
          password: hashedPassword,
          resetToken: resetToken,
          resetTokenExpiry: resetTokenExpiry,
        },
      })

      console.log("Member saved to database:", membershipId)

      // Send welcome email with "Set Password" link
      try {
        await sendMemberWelcomeEmail(userDetails.email, {
          name: userDetails.name,
          membershipId,
          expiryDate,
          resetToken,
        })
        console.log("Welcome email sent to:", userDetails.email)
      } catch (emailError) {
        console.error("Warning: Member created but welcome email failed:", emailError)
      }

      return {
        success: true,
        message: "Payment verified and membership activated successfully",
        membershipId,
      }
    } catch (dbError) {
      console.error("CRITICAL: Payment received but DB save failed:", dbError)
      return {
        success: false,
        error: `Payment successful (ID: ${paymentId}), but account creation failed. Please contact support immediately.`,
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

