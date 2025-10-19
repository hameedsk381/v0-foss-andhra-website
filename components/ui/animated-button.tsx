"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
  className?: string
  hoverScale?: number
  tapScale?: number
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "fosstar"
    | "fosserve"
    | "fossync"
    | "fosstorm"
    | "fossart"
    | "fossstart"
    | "fossterage"
    | "fosspeaks"
}

export function AnimatedButton({
  children,
  className,
  hoverScale = 1.05,
  tapScale = 0.98,
  variant = "default",
  ...props
}: AnimatedButtonProps) {
  // Custom styling for program-specific buttons
  const getButtonClass = () => {
    switch (variant) {
      case "fosstar":
        return "bg-fosstar text-white hover:bg-fosstar/90"
      case "fosserve":
        return "bg-fosserve text-white hover:bg-fosserve/90"
      case "fossync":
        return "bg-fossync text-white hover:bg-fossync/90"
      case "fosstorm":
        return "bg-fosstorm text-white hover:bg-fosstorm/90"
      case "fossart":
        return "bg-fossart text-white hover:bg-fossart/90"
      case "fossstart":
        return "bg-fossstart text-white hover:bg-fossstart/90"
      case "fossterage":
        return "bg-fossterage text-white hover:bg-fossterage/90"
      case "fosspeaks":
        return "bg-fosspeaks text-white hover:bg-fosspeaks/90"
      default:
        return ""
    }
  }

  const isProgramVariant = variant.startsWith("foss")

  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className={cn(isProgramVariant ? getButtonClass() : "", className)}
        variant={isProgramVariant ? "default" : variant}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}
