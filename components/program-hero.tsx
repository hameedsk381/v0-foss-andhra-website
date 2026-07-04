"use client"

import type React from "react"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface ProgramHeroProps {
  title: string
  description: string
  color: string
  logoSrc: string
  image: string
  eyebrow?: string
}

// Full-bleed photo hero shared by all seven programme pages — same visual
// language as the rest of the site (blur-reveal headline, directional
// gradient), tinted with the programme's own brand color so each page still
// reads as visually distinct.
export function ProgramHero({ title, description, color, logoSrc, image, eyebrow = "FOSS Andhra Programme" }: ProgramHeroProps) {
  const reduced = useReducedMotion()
  const from = (p: object) => (reduced ? {} : p)

  return (
    <section className="relative w-full min-h-[56vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src={image} alt="" fill priority className="object-cover object-center" />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(100deg, ${color}f5 0%, ${color}e0 40%, ${color}90 70%, ${color}40 100%)`,
        }}
      />

      <div className="app-container relative z-10 py-16 w-full">
        <div className="max-w-2xl">
          <motion.div
            className="mb-7"
            initial={from({ opacity: 0, y: 16 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt={title}
              width={220}
              height={72}
              className="h-14 w-auto object-contain drop-shadow-md"
              priority
            />
          </motion.div>

          <motion.p
            className="text-sm font-semibold text-white/70 tracking-widest uppercase mb-4"
            initial={from({ opacity: 0, x: -18 })}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {eyebrow}
          </motion.p>

          <h1 className="font-display text-[clamp(2.2rem,4.5vw,3.75rem)] font-extrabold leading-[1.02] tracking-tight text-white text-balance">
            <motion.span
              className="block"
              initial={from({ opacity: 0, y: 24, filter: "blur(10px)" })}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {title}
            </motion.span>
          </h1>

          <motion.p
            className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg"
            initial={from({ opacity: 0, y: 16 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 mt-8"
            initial={from({ opacity: 0, y: 14 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.7 }}
          >
            <Link href="#initiatives">
              <Button className="bg-white hover:bg-white/90" style={{ color }}>
                Our Initiatives
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#about">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
