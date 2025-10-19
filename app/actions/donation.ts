"use server"

import { redirect } from "next/navigation"

interface DonationData {
  donationType: string
  amount: string
  name: string
  email: string
  phone: string
  anonymous?: string
}

export async function processDonation(formData: FormData) {
  try {
    const donationData: DonationData = {
      donationType: formData.get("donationType") as string,
      amount: formData.get("amount") as string,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      anonymous: formData.get("anonymous") as string,
    }

    // Validate amount range
    const amount = Number.parseInt(donationData.amount)
    if (amount < 100 || amount > 100000) {
      throw new Error("Donation amount must be between ₹100 and ₹100,000")
    }

    // Store donation data in session or database
    // For now, we'll redirect to payment page with query parameters
    const searchParams = new URLSearchParams({
      type: "donation",
      amount: donationData.amount,
      donationType: donationData.donationType,
      name: donationData.name,
      email: donationData.email,
      phone: donationData.phone,
      anonymous: donationData.anonymous || "false",
    })

    redirect(`/payment?${searchParams.toString()}`)
  } catch (error) {
    console.error("Donation processing error:", error)
    throw error
  }
}
