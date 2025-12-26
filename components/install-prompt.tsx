"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if already installed
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      return
    }

    // Check if dismissed before
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("install-prompt-dismissed")
      if (dismissed) {
        const dismissedTime = parseInt(dismissed)
        const daysSinceDismissed =
          (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
        if (daysSinceDismissed < 7) {
          return // Don't show if dismissed within 7 days
        }
      }

      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowPrompt(true)
      }

      window.addEventListener("beforeinstallprompt", handler)

      return () => {
        window.removeEventListener("beforeinstallprompt", handler)
      }
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // iOS fallback
      toast({
        title: "Install Instructions",
        description:
          "Tap the share button and select 'Add to Home Screen'",
      })
      setShowPrompt(false)
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      toast({
        title: "Installing...",
        description: "The app is being installed",
      })
      // Track install event
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "pwa_install")
      }
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("install-prompt-dismissed", Date.now().toString())
    }
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Install FOSS Andhra</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Add to your home screen for quick access and offline support
      </p>
      <div className="flex gap-2">
        <Button onClick={handleInstall} className="flex-1">
          Install App
        </Button>
        <Button
          onClick={handleDismiss}
          variant="outline"
          className="flex-1"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  )
}

