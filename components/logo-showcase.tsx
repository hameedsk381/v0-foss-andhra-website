"use client"

import { motion } from "framer-motion"
import { PROGRAMS } from "@/lib/programs"
import { FloatingLogo } from "./floating-logo"

export function LogoShowcase() {
  const programs = PROGRAMS.map((program, index) => ({
    id: program.id,
    title: program.displayName,
    logo: program.logo,
    delay: 0.1 * (index + 1),
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-gray-50 rounded-xl"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-12"
        >
          Our Programs
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {programs.map((program) => (
            <FloatingLogo
              key={program.id}
              src={program.logo}
              alt={`${program.title} Logo`}
              delay={program.delay}
              className="max-w-[200px]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
