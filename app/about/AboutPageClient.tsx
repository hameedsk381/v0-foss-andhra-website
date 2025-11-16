"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedButton } from "@/components/ui/animated-button"
import { LogoShowcase } from "@/components/logo-showcase"

interface ContentData {
  title: string
  content: string
}

export default function AboutPageClient() {
  const [pageContent, setPageContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/content/about")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPageContent(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="flex flex-col space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">About FOSS Andhra</h1>
                <p className="text-xl text-white/90 max-w-[600px]">
                  Our mission, vision, and journey to promote free and open source software across Andhra Pradesh
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft">
              <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  <Image
                    src="/logos/foss-andhra-logo.png"
                    alt="FOSS Andhra"
                    width={300}
                    height={100}
                    className="object-contain"
                  />
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="relative rounded-xl overflow-hidden h-[400px]">
                <Image
                  src="/placeholder.svg?height=800&width=1200&text=FOSS+Andhra+Team"
                  alt="FOSS Andhra Team"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">Our Team</h3>
                  <p className="text-sm">Dedicated to promoting FOSS across Andhra Pradesh</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900">Our Story</h2>
                <p className="text-gray-600">
                  FOSS Andhra was established with a vision to promote the adoption of free and open source software
                  across educational institutions, government bodies, and society at large in Andhra Pradesh. We believe
                  that open source solutions offer numerous advantages including cost-effectiveness, transparency,
                  security, and customizability.
                </p>
                <p className="text-gray-600">
                  Our journey began with a small group of FOSS enthusiasts who recognized the potential of open source
                  software to transform digital infrastructure in the region. Today, we have grown into a vibrant
                  community of developers, educators, policy advocates, and technology enthusiasts working together to
                  advance the cause of free and open source software.
                </p>
                <div className="pt-4">
                  <Link href="/contact">
                    <AnimatedButton className="bg-primary text-white hover:bg-primary/90">Contact Us</AnimatedButton>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Logo Showcase Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <AnimatedSection variant="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-gray-900">Our Programs</h2>
              <p className="mt-2 text-gray-600 max-w-3xl mx-auto">
                Discover our comprehensive range of initiatives designed to promote FOSS adoption
              </p>
            </div>
          </AnimatedSection>

          <LogoShowcase />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedSection variant="fadeRight">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900">Our Mission</h2>
                <p className="text-gray-600">
                  To promote the adoption of free and open source software across educational institutions, government
                  bodies, and society at large in Andhra Pradesh, fostering a culture of digital freedom, innovation,
                  and collaboration.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Promote FOSS adoption in educational institutions</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advocate for FOSS solutions in government</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Build a vibrant community of FOSS contributors</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Develop open source solutions for local challenges</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900">Our Vision</h2>
                <p className="text-gray-600">
                  A digitally empowered Andhra Pradesh where free and open source software forms the backbone of
                  education, governance, and society, ensuring digital sovereignty, inclusivity, and innovation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>FOSS-first approach in all educational institutions</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Open source e-governance solutions</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Thriving ecosystem of FOSS startups and innovations</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Digital inclusion through accessible FOSS solutions</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#015ba7,#015ba7)]" />
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <AnimatedSection variant="fadeUp">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Join Our Community
              </h2>
              <p className="mx-auto max-w-[700px] text-blue-100 md:text-xl">
                Become a part of FOSS Andhra and help us promote free and open source software across the region
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Link href="/programs/fosstar#membership">
                  <AnimatedButton className="bg-secondary text-black hover:bg-secondary/90">
                    Become a Member
                  </AnimatedButton>
                </Link>
                <Link href="/contribute">
                  <AnimatedButton
                    variant="outline"
                    className="border-white text-white bg-transparent hover:bg-white/10"
                  >
                    Contribute
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
