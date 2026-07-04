"use client"

import { useRef, type ReactNode } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useInView,
  animate,
  useMotionValue,
} from "framer-motion"
import { useEffect } from "react"

const EASE = [0.16, 1, 0.3, 1] as const

/* ── Scroll progress bar (site-wide, rendered by template) ── */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 40, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[200] pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #005ca8, #3b9dff)",
      }}
      aria-hidden="true"
    />
  )
}

/* ── Blur reveal on scroll into view ── */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  blur = true,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  blur?: boolean
  once?: boolean
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={
        reduced
          ? { opacity: 1 }
          : { opacity: 0, y, filter: blur ? "blur(10px)" : "none" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ── Stagger group + item ── */

export function StaggerGroup({
  children,
  className,
  gap = 0.08,
}: {
  children: ReactNode
  className?: string
  gap?: number
}) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap, delayChildren: 0.05 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  from = "up",
}: {
  children: ReactNode
  className?: string
  from?: "up" | "left" | "right"
}) {
  const reduced = useReducedMotion()
  const offset =
    from === "left" ? { x: -32, y: 0 } : from === "right" ? { x: 32, y: 0 } : { x: 0, y: 24 }
  return (
    <motion.div
      className={className}
      variants={
        reduced
          ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
          : {
              hidden: { opacity: 0, ...offset },
              visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.55, ease: EASE } },
            }
      }
    >
      {children}
    </motion.div>
  )
}

/* ── Animated counter — counts up when scrolled into view ── */

export function AnimatedCounter({
  value,
  suffix = "",
  className,
  duration = 1.6,
}: {
  value: number
  suffix?: string
  className?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const count = useMotionValue(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      count.set(value)
      if (ref.current) ref.current.textContent = `${value}${suffix}`
      return
    }
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return controls.stop
  }, [inView, value, suffix, duration, reduced, count])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}

/* ── Parallax wrapper — child drifts slower than scroll ── */

export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode
  className?: string
  distance?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [distance, -distance])
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}

/* ── Hover lift — for cards ── */

export function HoverLift({
  children,
  className,
  lift = -6,
}: {
  children: ReactNode
  className?: string
  lift?: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      whileHover={reduced ? {} : { y: lift }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      {children}
    </motion.div>
  )
}
