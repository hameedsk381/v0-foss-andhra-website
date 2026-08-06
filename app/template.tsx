"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ScrollProgress } from "@/components/motion-primitives"

// Re-mounts on every route change, so each page gets an entrance transition.
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <>
      <ScrollProgress />
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  )
}
