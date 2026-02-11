"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createPaymentOrder, verifyPayment } from "@/app/actions/payment"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface RazorpayCheckoutProps {
  membershipType: string
  amount: number
  userDetails: {
    name: string
    email: string
    phone: string
  }
  className?: string
  onSuccess?: (membershipId: string) => void
  additionalData?: any // ✅ Add additionalData prop
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  image?: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

interface RazorpayInstance {
  open: () => void
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export function RazorpayCheckout({
  membershipType,
  amount,
  userDetails,
  className,
  onSuccess,
  additionalData,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Starting payment process for:", userDetails.email)

      // Create order on server
      const orderResult = await createPaymentOrder({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          membershipType,
          userEmail: userDetails.email,
          userName: userDetails.name,
        },
        additionalData,
      })

      console.log("Order creation result:", orderResult)

      if (!orderResult.success || !orderResult.order || !orderResult.keyId) {
        throw new Error(orderResult.error || "Failed to create payment order")
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        console.log("Loading Razorpay script...")
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)

        await new Promise((resolve, reject) => {
          script.onload = () => {
            console.log("Razorpay script loaded successfully")
            resolve(true)
          }
          script.onerror = () => {
            console.error("Failed to load Razorpay script")
            reject(new Error("Failed to load Razorpay script"))
          }
        })
      }

      const options: RazorpayOptions = {
        key: orderResult.keyId,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        name: "FOSS Andhra",
        description: `${membershipType} Membership`,
        order_id: orderResult.order.id,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: "#015ba7",
        },
        handler: async (response: RazorpayResponse) => {
          try {
            setIsVerifying(true)
            console.log("Payment completed, verifying...")

            // Verify payment on server
            const verificationResult = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              userDetails,
              membershipType, // ✅ Pass membershipType to save in DB
              additionalData, // ✅ Pass additionalData
            )

            if (verificationResult.success) {
              toast({
                title: "🎉 Payment Successful!",
                description: `Welcome to FOSS Andhra! Your ${membershipType} membership is now active.`,
              })

              // Call success callback if provided
              if (onSuccess && verificationResult.membershipId) {
                onSuccess(verificationResult.membershipId)
              }
            } else {
              throw new Error(verificationResult.error)
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted from your account.",
              variant: "destructive",
            })
          } finally {
            setIsVerifying(false)
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
            console.log("Payment modal dismissed")
            toast({
              title: "Payment Cancelled",
              description: "Your payment was cancelled. You can try again anytime.",
            })
          },
        },
      }

      console.log("Opening Razorpay checkout with options:", { ...options, key: "***" })
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again."
      setError(errorMessage)
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isProcessing = isLoading || isVerifying

  return (
    <div className="space-y-2">
      <Button onClick={handlePayment} disabled={isProcessing} className={className}>
        {isVerifying ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4 animate-pulse" />
            Verifying Payment...
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ₹${amount}`
        )}
      </Button>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
