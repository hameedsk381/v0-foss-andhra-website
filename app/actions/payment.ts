"use server"

import { createRazorpayOrder, getRazorpayRuntimeConfig, verifyRazorpayPaymentSignature } from "@/lib/payment/razorpay"
import {
  completeDonationPayment,
  completeMembershipPayment,
  getDonationCheckoutContext,
  getMembershipPaymentDefaults,
  resolveMembershipAmount,
  type PaymentPurpose,
  type PaymentUserDetails,
} from "@/lib/payment/fulfillment"

interface CreateOrderData {
  paymentPurpose?: PaymentPurpose
  amount?: number
  currency?: string
  membershipType?: string
  donationId?: string
  userDetails: PaymentUserDetails
  notes?: Record<string, string>
  additionalData?: Record<string, unknown> | null
}

interface VerifyPaymentData {
  orderId: string
  paymentId: string
  signature: string
  paymentPurpose?: PaymentPurpose
  userDetails?: PaymentUserDetails
  membershipType?: string
  donationId?: string
  additionalData?: Record<string, unknown> | null
}

function normalizeStringValue(value: unknown, maxLength = 250): string | undefined {
  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  return trimmed.slice(0, maxLength)
}

function additionalDataToNotes(additionalData?: Record<string, unknown> | null): Record<string, string> {
  const source = additionalData && typeof additionalData === "object" ? additionalData : {}
  const asRecord = source as Record<string, unknown>

  const noteFields: Array<[string, string | undefined]> = [
    ["organization", normalizeStringValue(asRecord.organization || asRecord.institution || asRecord.company)],
    ["designation", normalizeStringValue(asRecord.designation || asRecord.course || asRecord.department)],
    ["experience", normalizeStringValue(asRecord.experience || asRecord.year || asRecord.timeline)],
    ["interests", normalizeStringValue(asRecord.interests || asRecord.contribution || asRecord.expectations)],
    ["address", normalizeStringValue(asRecord.address, 500)],
    ["referral", normalizeStringValue(asRecord.referral || asRecord.referrer)],
  ]

  return noteFields.reduce<Record<string, string>>((acc, [key, value]) => {
    if (value) {
      acc[key] = value
    }
    return acc
  }, {})
}

export async function createPaymentOrder(data: CreateOrderData) {
  try {
    const paymentPurpose: PaymentPurpose = data.paymentPurpose || "membership"
    const currency = data.currency || "INR"

    if (paymentPurpose === "donation") {
      if (!data.donationId) {
        throw new Error("Donation ID is required for donation payments")
      }

      const donation = await getDonationCheckoutContext(data.donationId)
      if (!donation) {
        throw new Error("Donation record not found")
      }

      if (donation.status === "completed") {
        throw new Error("This donation has already been completed")
      }

      const orderResult = await createRazorpayOrder({
        amountInPaise: Math.round(donation.amount * 100),
        currency,
        receipt: `donation_${donation.id}_${Date.now()}`,
        notes: {
          ...(data.notes || {}),
          paymentPurpose: "donation",
          donationId: donation.id,
          donationType: donation.type,
          anonymous: String(donation.anonymous),
          userName: donation.name,
          userEmail: donation.email,
          phone: donation.phone,
        },
      })

      return {
        success: true,
        order: orderResult.order,
        keyId: orderResult.keyId,
        amount: donation.amount,
        paymentPurpose,
      }
    }

    const defaults = await getMembershipPaymentDefaults()
    const membershipType = data.membershipType || "FOSStar Annual"
    const amount = resolveMembershipAmount(membershipType, defaults)

    const orderResult = await createRazorpayOrder({
      amountInPaise: Math.round(amount * 100),
      currency,
      receipt: `membership_${Date.now()}`,
      notes: {
        ...(data.notes || {}),
        paymentPurpose: "membership",
        membershipType,
        userEmail: data.userDetails.email,
        userName: data.userDetails.name,
        phone: data.userDetails.phone,
        ...additionalDataToNotes(data.additionalData),
      },
    })

    return {
      success: true,
      order: orderResult.order,
      keyId: orderResult.keyId,
      amount,
      paymentPurpose,
    }
  } catch (error) {
    console.error("Error creating payment order:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create payment order",
    }
  }
}

export async function verifyPayment(data: VerifyPaymentData) {
  try {
    const paymentPurpose: PaymentPurpose = data.paymentPurpose || "membership"
    const { keySecret } = await getRazorpayRuntimeConfig({ requireSecret: true })

    if (!keySecret) {
      throw new Error("Razorpay key secret is not configured")
    }

    const signatureValid = verifyRazorpayPaymentSignature({
      orderId: data.orderId,
      paymentId: data.paymentId,
      signature: data.signature,
      keySecret,
    })

    if (!signatureValid) {
      return {
        success: false,
        error: "Payment verification failed - invalid signature",
      }
    }

    if (paymentPurpose === "donation") {
      if (!data.donationId) {
        throw new Error("Donation ID is required for donation verification")
      }

      const donationResult = await completeDonationPayment({
        donationId: data.donationId,
        paymentId: data.paymentId,
        orderId: data.orderId,
        signature: data.signature,
      })

      return {
        success: true,
        message: "Donation payment verified successfully",
        paymentPurpose,
        referenceId: donationResult.donationId,
        donationId: donationResult.donationId,
      }
    }

    if (!data.userDetails) {
      throw new Error("User details are required for membership verification")
    }

    const memberResult = await completeMembershipPayment({
      paymentId: data.paymentId,
      orderId: data.orderId,
      userDetails: data.userDetails,
      membershipType: data.membershipType,
      additionalData: data.additionalData,
    })

    return {
      success: true,
      message: "Payment verified and membership activated successfully",
      paymentPurpose,
      referenceId: memberResult.membershipId,
      membershipId: memberResult.membershipId,
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment verification failed",
    }
  }
}

