"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PushSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkSupport()
    checkSubscription()
  }, [])

  const checkSupport = () => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
      setIsSupported(true)
    } else {
      setIsSupported(false)
      setIsLoading(false)
    }
  }

  const checkSubscription = async () => {
    if (!isSupported) return

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error("Error checking subscription:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const subscribe = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get VAPID public key
      const response = await fetch("/api/push/send")
      const { publicKey } = await response.json()

      if (!publicKey) {
        throw new Error("VAPID public key not configured")
      }

      // Register service worker
      const registration = await navigator.serviceWorker.ready

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      // Send subscription to server
      const subResponse = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
            auth: arrayBufferToBase64(subscription.getKey("auth")!),
          },
        }),
      })

      if (!subResponse.ok) {
        throw new Error("Failed to save subscription")
      }

      setIsSubscribed(true)
      toast({
        title: "Subscribed!",
        description: "You'll now receive push notifications",
      })
    } catch (error: any) {
      console.error("Error subscribing:", error)
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to enable push notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async () => {
    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // Unsubscribe from push
        await subscription.unsubscribe()

        // Remove from server
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        })

        setIsSubscribed(false)
        toast({
          title: "Unsubscribed",
          description: "You won't receive push notifications anymore",
        })
      }
    } catch (error: any) {
      console.error("Error unsubscribing:", error)
      toast({
        title: "Unsubscribe Failed",
        description: error.message || "Failed to disable push notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return null
  }

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Bell className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  return (
    <Button
      variant={isSubscribed ? "default" : "outline"}
      size="sm"
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={isLoading}
    >
      {isSubscribed ? (
        <>
          <BellOff className="h-4 w-4 mr-2" />
          Disable Notifications
        </>
      ) : (
        <>
          <Bell className="h-4 w-4 mr-2" />
          Enable Notifications
        </>
      )}
    </Button>
  )
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

