import { NextRequest, NextResponse } from "next/server"
import { getDonationCheckoutContext } from "@/lib/payment/fulfillment"
import { rateLimit, getRateLimitIdentifier } from "@/lib/rate-limit"

// 20 lookups per minute per IP — prevents donation-ID enumeration.
const limiter = rateLimit({ uniqueTokenPerInterval: 20, interval: 60_000 })

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await limiter.check(request, 20, getRateLimitIdentifier(request))
  } catch (rateLimitResponse) {
    return rateLimitResponse as NextResponse
  }

  try {
    const donation = await getDonationCheckoutContext(params.id)

    if (!donation) {
      return NextResponse.json({ success: false, error: "Donation not found" }, { status: 404 })
    }

    if (donation.status === "completed") {
      return NextResponse.json({ success: false, error: "Donation is already completed" }, { status: 409 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: donation.id,
        name: donation.name,
        email: donation.email,
        phone: donation.phone,
        amount: donation.amount,
        type: donation.type,
        anonymous: donation.anonymous,
      },
    })
  } catch (error) {
    console.error("Error loading donation checkout context:", error)
    return NextResponse.json({ success: false, error: "Failed to load donation details" }, { status: 500 })
  }
}

