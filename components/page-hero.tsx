"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

interface PageHeroProps {
  eyebrow: string
  title: string
  titleLine2?: string
  subtitle?: string
  image: string
  minHeight?: string
  children?: React.ReactNode
}

// Flat, two-column hero used across marketing pages — plain surface
// background, left-aligned copy, a bordered photo card on the right.
export function PageHero({ eyebrow, title, titleLine2, subtitle, image, children }: PageHeroProps) {
  const reduced = useReducedMotion()
  const from = (p: object) => (reduced ? {} : p)

  return (
    <section className="w-full border-b border-border bg-primary/[0.06] py-10 sm:py-14">
      <div className="app-container grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
        <motion.div
          initial={from({ opacity: 0, y: 16 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-4">{eyebrow}</p>

          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
            {titleLine2 && <span className="block text-primary">{titleLine2}</span>}
          </h1>

          {subtitle && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-6">{children}</div>}
        </motion.div>

        <motion.div
          className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
          initial={from({ opacity: 0, y: 16 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={image} alt={`${title} — ${eyebrow}`} fill priority className="object-cover object-center" />
        </motion.div>
      </div>
    </section>
  )
}
