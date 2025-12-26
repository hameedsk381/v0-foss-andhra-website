"use client"

import { useEffect } from "react"

export function RegisterSW() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration.scope)

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New version available
                  console.log("🆕 New service worker version available")
                  // Optionally show a toast notification
                  if (
                    typeof window !== "undefined" &&
                    window.confirm("New version available! Reload to update?")
                  ) {
                    window.location.reload()
                  }
                }
              })
            }
          })

          // Check for updates every hour
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000)
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error)
        })
    }
  }, [])

  return null
}

