"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface FloatingLogoProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  delay?: number
}

export function FloatingLogo({ src, alt, width = 150, height = 60, className = "", delay = 0 }: FloatingLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`relative ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Image src={src || "/placeholder.svg"} alt={alt} width={width} height={height} className="h-auto w-auto" />
      </motion.div>
    </motion.div>
  )
}
