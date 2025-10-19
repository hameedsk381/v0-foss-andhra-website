"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

type AnimationVariant =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "fadeIn"
  | "scaleUp"
  | "float"
  | "pulse"
  | "none"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

export function AnimatedSection({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  once = true,
}: AnimatedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  })

  const getVariants = () => {
    switch (variant) {
      case "fadeUp":
        return {
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
        }
      case "fadeDown":
        return {
          hidden: { opacity: 0, y: -30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
        }
      case "fadeLeft":
        return {
          hidden: { opacity: 0, x: 30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
        }
      case "fadeRight":
        return {
          hidden: { opacity: 0, x: -30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
        }
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
        }
      case "scaleUp":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
        }
      case "float":
        return {
          hidden: { y: 0 },
          visible: {
            y: [0, -10, 0],
            transition: {
              duration: 3,
              delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            },
          },
        }
      case "pulse":
        return {
          hidden: { opacity: 1 },
          visible: {
            opacity: [1, 0.8, 1],
            transition: {
              duration: 2,
              delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            },
          },
        }
      case "none":
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 },
        }
      default:
        return {
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
        }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={getVariants()}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
