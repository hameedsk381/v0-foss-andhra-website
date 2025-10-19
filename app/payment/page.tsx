"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RazorpayCheckout } from "@/components/razorpay-checkout"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Heart, Users } from "lucide-react"

function PaymentContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const amount = searchParams.get("amount")
  const name = searchParams.get("name")
  const email = searchParams.get("email")
  const phone = searchParams.get("phone")
  const donationType = searchParams.get("donationType")
  const anonymous = searchParams.get("anonymous") === "true"

  if (!type || !amount || !name || !email || !phone) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Payment Request</h1>
        <p>Missing required payment information. Please go back and try again.</p>
      </div>
    )
  }

  const isDonation = type === "donation"
  const amountNum = Number.parseInt(amount)

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatedSection variant="fadeUp">
        <Card>
          <CardHeader className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
              {isDonation ? <Heart className="w-8 h-8 text-red-600" /> : <Users className="w-8 h-8 text-blue-600" />}
            </div>
            <CardTitle className="text-2xl text-fosstar">
              {isDonation ? "Complete Your Donation" : "Complete Your Membership Payment"}
            </CardTitle>
            <CardDescription>
              {isDonation
                ? "Thank you for supporting FOSS Andhra with your generous donation"
                : "Secure payment to activate your membership"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4 text-fosstar">
                  {isDonation ? "Donation Summary" : "Payment Summary"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-2">
                      <strong>Name:</strong> {anonymous ? "Anonymous" : name}
                    </p>
                    <p className="mb-2">
                      <strong>Email:</strong> {email}
                    </p>
                    <p className="mb-2">
                      <strong>Phone:</strong> {phone}
                    </p>
                  </div>
                  <div>
                    {isDonation ? (
                      <>
                        <p className="mb-2">
                          <strong>Type:</strong> {donationType}
                        </p>
                        <p className="mb-2">
                          <strong>Anonymous:</strong> {anonymous ? "Yes" : "No"}
                        </p>
                      </>
                    ) : (
                      <p className="mb-2">
                        <strong>Membership:</strong> FOSStar Annual
                      </p>
                    )}
                  </div>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-fosstar">₹{amountNum.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <RazorpayCheckout
                  membershipType={isDonation ? `Donation - ${donationType}` : "FOSStar Membership"}
                  amount={amountNum}
                  userDetails={{
                    name: name,
                    email: email,
                    phone: phone,
                  }}
                  onSuccess={(id) => {
                    if (isDonation) {
                      window.location.href = `/donation-success?id=${id}`
                    } else {
                      window.location.href = `/membership-success?id=${id}`
                    }
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
