"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RazorpayCheckout } from "@/components/razorpay-checkout"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Heart, AlertCircle } from "lucide-react"

interface DonationCheckoutDetails {
  id: string
  name: string
  email: string
  phone: string
  amount: number
  type: string
  anonymous: boolean
}

const ANONYMOUS_EMAIL_SUFFIX = "@fossandhra.local"

function PaymentContent() {
  const searchParams = useSearchParams()
  const donationId = searchParams.get("donationId")
  const [donation, setDonation] = useState<DonationCheckoutDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!donationId) {
      setError("Missing donation reference. Please start your donation again.")
      setLoading(false)
      return
    }

    const loadDonation = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/payment/donations/${donationId}`)
        const payload = await response.json()

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Unable to load donation details")
        }

        setDonation(payload.data)
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Failed to load donation details")
      } finally {
        setLoading(false)
      }
    }

    void loadDonation()
  }, [donationId])

  if (loading) {
    return <div className="text-center">Loading payment details...</div>
  }

  if (error || !donation) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <h1 className="mb-2 text-2xl font-bold text-red-600">Unable to continue checkout</h1>
        <p>{error || "Donation details are unavailable. Please try again."}</p>
      </div>
    )
  }

  const hideEmail = donation.anonymous && donation.email.endsWith(ANONYMOUS_EMAIL_SUFFIX)
  const hidePhone = donation.anonymous && donation.phone === "0000000000"
  const displayName = donation.anonymous ? "Anonymous Donor" : donation.name

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatedSection variant="fadeUp">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-fosstar">Complete Your Donation</CardTitle>
            <CardDescription>Thank you for supporting FOSS Andhra.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-6">
                <h4 className="mb-4 font-semibold text-fosstar">Donation Summary</h4>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="mb-2">
                      <strong>Name:</strong> {displayName}
                    </p>
                    {!hideEmail && (
                      <p className="mb-2">
                        <strong>Email:</strong> {donation.email}
                      </p>
                    )}
                    {!hidePhone && (
                      <p className="mb-2">
                        <strong>Phone:</strong> {donation.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="mb-2">
                      <strong>Type:</strong> {donation.type}
                    </p>
                    <p className="mb-2">
                      <strong>Anonymous:</strong> {donation.anonymous ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-fosstar">₹{donation.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <RazorpayCheckout
                  paymentPurpose="donation"
                  donationId={donation.id}
                  membershipType={`Donation - ${donation.type}`}
                  amount={donation.amount}
                  userDetails={{
                    name: donation.name,
                    email: donation.email,
                    phone: donation.phone,
                  }}
                  onSuccess={(id) => {
                    window.location.href = `/donation-success?id=${id}`
                  }}
                  className="w-full bg-fosstar hover:bg-fosstar/90"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<div>Loading payment details...</div>}>
        <PaymentContent />
      </Suspense>
    </div>
  )
}
