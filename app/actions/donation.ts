"use server"

import { redirect } from "next/navigation"
import { createPendingDonation } from "@/lib/payment/fulfillment"

export async function processDonation(formData: FormData) {
  try {
    const donation = await createPendingDonation({
      donationType: String(formData.get("donationType") || "one-time"),
      amount: Number(formData.get("amount") || 0),
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      anonymous: String(formData.get("anonymous") || "false") === "true",
      notes: String(formData.get("message") || ""),
    })

    redirect(`/payment?donationId=${donation.id}`)
  } catch (error) {
    console.error("Donation processing error:", error)
    throw error
  }
}

