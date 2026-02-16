"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createPaymentOrder, verifyPayment } from "@/app/actions/payment"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

type CheckoutPurpose = "membership" | "donation"

interface RazorpayCheckoutProps {
  membershipType?: string
  paymentPurpose?: CheckoutPurpose
  donationId?: string
  amount: number
  userDetails: {
    name: string
    email: string
    phone: string
  }
  className?: string
  onSuccess?: (referenceId: string) => void
  additionalData?: Record<string, unknown> | null
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
  paymentPurpose = "membership",
  donationId,
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
      if (paymentPurpose === "donation" && !donationId) {
        throw new Error("Donation reference is missing. Please restart the donation flow.")
      }

      setIsLoading(true)
      setError(null)

      const orderResult = await createPaymentOrder({
        paymentPurpose,
        donationId,
        membershipType: membershipType || "FOSStar Annual",
        amount,
        currency: "INR",
        userDetails,
        additionalData: additionalData || undefined,
      })

      if (!orderResult.success || !orderResult.order || !orderResult.keyId) {
        throw new Error(orderResult.error || "Failed to create payment order")
      }

      if (!window.Razorpay) {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)

        await new Promise((resolve, reject) => {
          script.onload = () => resolve(true)
          script.onerror = () => reject(new Error("Failed to load Razorpay checkout script"))
        })
      }

      const options: RazorpayOptions = {
        key: orderResult.keyId,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        name: "FOSS Andhra",
        description:
          paymentPurpose === "donation"
            ? "Donation Payment"
            : `${membershipType || "FOSStar"} Membership Payment`,
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

            const verificationResult = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              paymentPurpose,
              donationId,
              userDetails: paymentPurpose === "membership" ? userDetails : undefined,
              membershipType: paymentPurpose === "membership" ? membershipType || "FOSStar Annual" : undefined,
              additionalData: paymentPurpose === "membership" ? additionalData || undefined : undefined,
            })

            if (!verificationResult.success) {
              throw new Error(verificationResult.error || "Payment verification failed")
            }

            toast({
              title: "Payment successful",
              description:
                paymentPurpose === "donation"
                  ? "Thank you for supporting FOSS Andhra."
                  : "Your membership payment was successful.",
            })

            const referenceId =
              verificationResult.referenceId || verificationResult.membershipId || verificationResult.donationId

            if (onSuccess && referenceId) {
              onSuccess(referenceId)
            }
          } catch (verificationError) {
            console.error("Payment verification error:", verificationError)
            toast({
              title: "Payment verification failed",
              description: "If money was deducted, contact support with your payment reference.",
              variant: "destructive",
            })
          } finally {
            setIsVerifying(false)
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
            toast({
              title: "Payment cancelled",
              description: "You can retry checkout whenever you're ready.",
            })
          },
        },
      }

      const checkout = new window.Razorpay(options)
      checkout.open()
    } catch (paymentError) {
      const errorMessage =
        paymentError instanceof Error ? paymentError.message : "Payment failed. Please try again."
      setError(errorMessage)
      toast({
        title: "Payment error",
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
            Verifying payment...
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ₹${amount.toLocaleString()}`
        )}
      </Button>

      {error && (
        <div className="flex items-center gap-2 rounded bg-red-50 p-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

