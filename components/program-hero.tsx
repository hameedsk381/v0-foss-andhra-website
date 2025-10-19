"use client"

import type React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { fadeIn, slideIn } from "@/lib/animation"
import { Button } from "@/components/ui/button"

interface ProgramHeroProps {
  title: string
  description: string
  color: string
  logoSrc: string
  icons?: React.ReactNode
}

export function ProgramHero({ title, description, color, logoSrc, icons }: ProgramHeroProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        }}
      />

      {/* Floating icons */}
      {icons && <div className="absolute inset-0 z-0 overflow-hidden">{icons}</div>}

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div variants={fadeIn("right")} initial="hidden" animate="visible" className="flex flex-col space-y-6">
            <motion.div variants={slideIn("left")} className="mb-4">
              <Image
                src={logoSrc || "/placeholder.svg"}
                alt={`${title} Logo`}
                width={300}
                height={100}
                className="max-w-[280px] w-auto h-auto"
                priority
              />
            </motion.div>

            <motion.p variants={fadeIn("up", 0.2)} className="text-lg md:text-xl text-muted-foreground">
              {description}
            </motion.p>

            <motion.div variants={fadeIn("up", 0.4)} className="flex flex-wrap gap-4 pt-4">
              <Link href="#about">
                <Button className="text-white" style={{ backgroundColor: color }}>
                  Learn More
                </Button>
              </Link>

              <Link href="#initiatives">
                <Button variant="outline">View Initiatives</Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeIn("left")}
            initial="hidden"
            animate="visible"
            className="flex justify-center relative"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
              <motion.div
                className="absolute w-[300px] h-[300px] rounded-full bg-white/5 -right-32 -top-32"
                animate={{
                  y: [0, 30, 0],
                  x: [0, 20, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              <motion.div
                className="absolute w-[250px] h-[250px] rounded-full bg-white/5 -left-32 -bottom-32"
                animate={{
                  y: [0, -40, 0],
                  x: [0, -20, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              {/* Animated grid */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(${color}10 1px, transparent 1px)`,
                  backgroundSize: "30px 30px",
                }}
              ></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative z-10 p-8"
            >
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl p-8 max-w-md">
                <h2 className="text-2xl font-bold mb-4">About {title}</h2>
                <p className="text-muted-foreground mb-4">{description}</p>
                <div className="flex justify-end">
                  <Link href="#about">
                    <Button variant="ghost">Discover More</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
