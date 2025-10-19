"use server"

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

export async function verifyPayment(orderId: string, paymentId: string, signature: string, userDetails: any) {
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

      return {
        success: true,
        message: "Payment verified successfully",
        membershipId: `FOSS${Date.now()}`,
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
