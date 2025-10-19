"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, type CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode
  className?: string
  hoverScale?: number
  hoverElevation?: boolean
}

export function AnimatedCard({
  children,
  className,
  hoverScale = 1.02,
  hoverElevation = true,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: hoverScale,
        y: hoverElevation ? -5 : 0,
        boxShadow: hoverElevation
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "none",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="w-full"
    >
      <Card className={cn(className)} {...props}>
        {children}
      </Card>
    </motion.div>
  )
}
