import { NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// POST create Razorpay order
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { amount, currency = "INR", notes } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      )
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: notes || {},
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error: any) {
    console.error("Razorpay order creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create payment order",
      },
      { status: 500 }
    )
  }
}
