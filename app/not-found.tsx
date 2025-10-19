"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Image
                src="/logos/foss-andhra-logo.png"
                alt="FOSS Andhra Logo"
                width={250}
                height={80}
                className="mb-8"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-900"
            >
              404 - Page Not Found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto max-w-[600px] text-gray-500 md:text-xl"
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/">
                <Button className="bg-primary text-white hover:bg-primary/90">Return to Home</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
