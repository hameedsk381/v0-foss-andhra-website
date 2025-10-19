"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Users, CheckCircle, Home, ArrowRight, PartyPopper } from "lucide-react"

function MembershipSuccessContent() {
  const searchParams = useSearchParams()
  const membershipId = searchParams.get("id")

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatedSection variant="fadeUp">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">🎉 Welcome to FOSS Andhra!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              <div className="bg-green-50 p-6 rounded-lg">
                <PartyPopper className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Membership Activated!</h3>
                <p className="text-green-700 mb-4">
                  Congratulations! Your FOSStar membership has been successfully activated.
                </p>
                {membershipId && (
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-600 mb-2">Your Membership ID:</p>
                    <p className="text-lg font-mono font-bold text-fosstar">{membershipId}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">What's Next?</h4>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>You'll receive a confirmation email with your membership details</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Access to members-only forums and resources</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Invitations to upcoming FOSS Andhra events</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Connect with the FOSS community in Andhra Pradesh</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => (window.location.href = "/")} className="flex-1 bg-fosstar hover:bg-fosstar/90">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/programs/fosstar")}
                  className="flex-1"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Explore FOSStar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  )
}

export default function MembershipSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <MembershipSuccessContent />
      </Suspense>
    </div>
  )
}
