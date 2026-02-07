"use client"

import { useEffect } from "react"
import { reportWebVitals } from "@/lib/web-vitals"

export function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Import and initialize web-vitals
    import("web-vitals").then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(reportWebVitals)
      onFCP(reportWebVitals)
      onLCP(reportWebVitals)
      onTTFB(reportWebVitals)
      onINP(reportWebVitals)
    })
  }, [])

  return null
}

