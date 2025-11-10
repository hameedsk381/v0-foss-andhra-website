"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

// Create a wrapper component for the unsubscribe page to handle suspense
function UnsubscribePageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleUnsubscribe = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      if (email) params.append("email", email)
      if (token) params.append("token", token)

      const res = await fetch(`/api/newsletter/unsubscribe?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "Failed to unsubscribe")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Unsubscribed Successfully
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-orange-600" />
                  Unsubscribe from Newsletter
                </>
              )}
            </CardTitle>
            <CardDescription>
              {success
                ? "You've been unsubscribed from our newsletter."
                : "We're sorry to see you go!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You have been successfully unsubscribed from the FOSS Andhra Foundation newsletter.
                  You will no longer receive emails from us.
                </p>
                <p className="text-sm text-muted-foreground">
                  If this was a mistake, you can always subscribe again on our website.
                </p>
                <Link href="/">
                  <Button className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Homepage
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {email && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Email:</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Click the button below to confirm you want to unsubscribe from our newsletter.
                </p>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleUnsubscribe}
                  disabled={loading || (!email && !token)}
                  variant="destructive"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Unsubscribing...
                    </>
                  ) : (
                    "Confirm Unsubscribe"
                  )}
                </Button>

                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel & Go Back
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Wrap the component with Suspense to handle useSearchParams
export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnsubscribePageContent />
    </Suspense>
  )
}