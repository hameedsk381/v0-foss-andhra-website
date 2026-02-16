import { NextResponse } from "next/server"
import { getDonationCheckoutContext } from "@/lib/payment/fulfillment"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
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

