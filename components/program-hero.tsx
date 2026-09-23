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

// Flat hero shared by all seven programme pages — solid brand-color band,
// logo + title + description, no photography.
export function ProgramHero({ title, description, color, logoSrc, eyebrow = "FOSS Andhra Programme" }: ProgramHeroProps) {
  const reduced = useReducedMotion()
  const from = (p: object) => (reduced ? {} : p)

  return (
    <section className="w-full py-10 sm:py-14" style={{ backgroundColor: color }}>
      <div className="app-container">
        <motion.div
          className="max-w-2xl"
          initial={from({ opacity: 0, y: 16 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 inline-block rounded-lg bg-white px-4 py-2.5">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt={title}
              width={220}
              height={72}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">{eyebrow}</p>

          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-tight text-white text-balance">
            {title}
          </h1>

          <p className="mt-5 text-base text-white/80 leading-relaxed max-w-lg sm:text-lg">{description}</p>

          <div className="flex flex-wrap gap-3 mt-8">
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}
