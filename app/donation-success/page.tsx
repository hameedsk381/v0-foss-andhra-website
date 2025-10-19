"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Heart, CheckCircle, Home, ArrowRight } from "lucide-react"

function DonationSuccessContent() {
  const searchParams = useSearchParams()
  const donationId = searchParams.get("id")

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatedSection variant="fadeUp">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">🎉 Thank You for Your Donation!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              <div className="bg-green-50 p-6 rounded-lg">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Donation Successful!</h3>
                <p className="text-green-700 mb-4">
                  Your generous contribution will help us promote FOSS solutions across Andhra Pradesh.
                </p>
                {donationId && (
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-600 mb-2">Your Donation ID:</p>
                    <p className="text-lg font-mono font-bold text-fosstar">{donationId}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">What Happens Next?</h4>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>You'll receive a donation receipt via email</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Your contribution will be used for FOSS education and advocacy</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Stay updated on our progress through our newsletter</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => (window.location.href = "/")} className="flex-1">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/contribute")} className="flex-1">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Learn More Ways to Help
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  )
}

export default function DonationSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <DonationSuccessContent />
      </Suspense>
    </div>
  )
}
