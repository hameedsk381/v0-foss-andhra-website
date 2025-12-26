"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
  animation?: "pulse" | "wave" | "none"
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-800"
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  }

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-[wave_1.6s_ease-in-out_infinite]",
    none: "",
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === "number" ? `${width}px` : width
  if (height) style.height = typeof height === "number" ? `${height}px` : height

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  )
}

// Pre-built skeleton components
export function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="text" height={24} width="80%" />
      <Skeleton variant="text" height={16} width="60%" />
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height={16} width="60%" />
            <Skeleton variant="text" height={12} width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b">
        <Skeleton variant="text" height={20} width="20%" />
        <Skeleton variant="text" height={20} width="30%" />
        <Skeleton variant="text" height={20} width="25%" />
        <Skeleton variant="text" height={20} width="25%" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-2">
          <Skeleton variant="text" height={16} width="20%" />
          <Skeleton variant="text" height={16} width="30%" />
          <Skeleton variant="text" height={16} width="25%" />
          <Skeleton variant="text" height={16} width="25%" />
        </div>
      ))}
    </div>
  )
}

