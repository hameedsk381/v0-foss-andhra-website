"use client"

import { ReactNode, useEffect, useState, useRef } from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void> | void
  disabled?: boolean
  threshold?: number
  className?: string
}

export function PullToRefresh({
  children,
  onRefresh,
  disabled = false,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled || typeof window === "undefined") return

    const container = containerRef.current
    if (!container) return

    let touchStartY = 0
    let isDragging = false

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0) return // Only work at top of page
      touchStartY = e.touches[0].clientY
      startY.current = touchStartY
      isDragging = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || window.scrollY > 0) return

      const currentY = e.touches[0].clientY
      const distance = currentY - touchStartY

      if (distance > 0) {
        e.preventDefault()
        setIsPulling(true)
        setPullDistance(Math.min(distance, threshold * 1.5))
      }
    }

    const handleTouchEnd = async () => {
      if (!isDragging) return

      isDragging = false

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true)
        setIsPulling(false)
        setPullDistance(0)

        try {
          await onRefresh()
        } catch (error) {
          console.error("Refresh error:", error)
        } finally {
          setIsRefreshing(false)
        }
      } else {
        setIsPulling(false)
        setPullDistance(0)
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [disabled, pullDistance, threshold, onRefresh, isRefreshing])

  const rotation = isRefreshing ? 360 : (pullDistance / threshold) * 180
  const opacity = Math.min(pullDistance / threshold, 1)

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Pull indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-50",
          isPulling || isRefreshing ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
          height: `${Math.min(pullDistance, threshold)}px`,
        }}
      >
        <div
          className="flex flex-col items-center gap-2"
          style={{ opacity }}
        >
          <RefreshCw
            className={cn(
              "h-6 w-6 text-primary transition-transform duration-200",
              isRefreshing && "animate-spin"
            )}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isRefreshing ? "Refreshing..." : "Pull to refresh"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${isPulling || isRefreshing ? Math.min(pullDistance, threshold) : 0}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  )
}

