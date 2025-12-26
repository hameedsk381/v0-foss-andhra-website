/**
 * Web Vitals Tracking
 * Measures Core Web Vitals and sends to analytics
 */

export interface WebVitalsMetric {
  id: string
  name: string
  value: number
  rating: "good" | "needs-improvement" | "poor"
  delta: number
  navigationType: string
}

export function reportWebVitals(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Web Vitals]", metric)
  }

  // Send to analytics (Google Analytics, Vercel Analytics, etc.)
  if (typeof window !== "undefined") {
    // Google Analytics 4
    if ((window as any).gtag) {
      ;(window as any).gtag("event", metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
      })
    }

    // Vercel Analytics
    if ((window as any).va) {
      ;(window as any).va("web-vitals", metric)
    }

    // Custom analytics endpoint
    try {
      fetch("/api/analytics/web-vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metric),
        keepalive: true,
      }).catch(() => {
        // Silently fail if analytics endpoint is not available
      })
    } catch (error) {
      // Silently fail
    }
  }
}

// Core Web Vitals thresholds
export const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 }, // First Input Delay
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint
}

export function getVitalRating(
  name: string,
  value: number
): "good" | "needs-improvement" | "poor" {
  const threshold = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS]
  if (!threshold) return "good"

  if (value <= threshold.good) return "good"
  if (value <= threshold.poor) return "needs-improvement"
  return "poor"
}

