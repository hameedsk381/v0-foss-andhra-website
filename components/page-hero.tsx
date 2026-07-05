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

// Full-bleed photo hero used across marketing pages — directional blue
// gradient (opaque left where text sits, photo visible on the right),
// two-line blur-reveal headline, bottom fade into the page background.
export function PageHero({
  eyebrow,
  title,
  titleLine2,
  subtitle,
  image,
  minHeight = "min-h-[52vh]",
  children,
}: PageHeroProps) {
  const reduced = useReducedMotion()
  const from = (p: object) => (reduced ? {} : p)

  return (
    <section className={`relative w-full ${minHeight} flex items-center overflow-hidden`}>
      <div className="absolute inset-0">
        <Image src={image} alt={`${title} — ${eyebrow}`} fill priority className="object-cover object-center" />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(0,40,100,0.96) 0%, rgba(0,70,150,0.88) 40%, rgba(0,92,168,0.55) 70%, rgba(0,92,168,0.25) 100%)",
        }}
      />

      <div className="app-container relative z-10 py-20 w-full">
        <div className="max-w-2xl">
          <motion.div
            className="flex items-center gap-3 mb-7"
            initial={from({ opacity: 0, x: -18 })}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block w-8 h-[2px] bg-white/60 rounded-full" />
            <span className="text-sm font-semibold text-white/70 tracking-widest uppercase">
              {eyebrow}
            </span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[0.98] tracking-tight text-white text-balance">
            <motion.span
              className="block"
              initial={from({ opacity: 0, y: 28, filter: "blur(12px)" })}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {title}
            </motion.span>
            {titleLine2 && (
              <motion.span
                className="block text-white/85"
                initial={from({ opacity: 0, y: 28, filter: "blur(12px)" })}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.75, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              >
                {titleLine2}
              </motion.span>
            )}
          </h1>

          {subtitle && (
            <motion.p
              className="mt-6 text-lg md:text-xl text-white/65 leading-relaxed max-w-lg"
              initial={from({ opacity: 0, y: 16 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62 }}
            >
              {subtitle}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={from({ opacity: 0, y: 14 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.75 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
