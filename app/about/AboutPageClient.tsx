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
      <section className="w-full py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <AnimatedSection variant="fadeUp">
            <div className="max-w-3xl space-y-5">
              <div className="flex items-center gap-3">
                <span className="inline-block w-8 h-0.5 bg-secondary rounded-full" />
                <span className="text-sm font-semibold text-muted-foreground">Who we are</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight text-balance">
                About FOSS Andhra
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Our mission, vision, and journey to build open source infrastructure across Andhra Pradesh.
              </p>
            </div>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-border" />
      </section>

      {/* About Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="relative rounded-xl overflow-hidden h-[400px]">
                <Image
                  src="/gallery/fosstar-event-1.jpg"
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
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">Our Story</h2>
                <p className="text-muted-foreground">
                  FOSS Andhra grew from a conviction that Andhra Pradesh's digital future should be built on software
                  that its citizens can inspect, modify, and own — not rented from distant corporations. What started
                  as a small circle of developers and educators in Vijayawada has expanded into a statewide network
                  of campus clubs, community developers, and policy advocates spanning nine universities and over
                  700 active members.
                </p>
                <p className="text-muted-foreground">
                  In 2026, that conviction matters more than ever. The tools shaping education, governance, and daily
                  life — AI assistants, data pipelines, administrative software — are increasingly proprietary and
                  opaque. We build and advocate for the alternative: open source AI infrastructure, Telugu-language
                  computing tools, and civic technology that any institution in AP can deploy, audit, and improve.
                  Our seven programmes address every stage of that pipeline, from a student's first Linux install to
                  a startup's first open source product.
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
      <section className="w-full py-12 md:py-24 bg-[hsl(var(--surface-1))]">
        <div className="container px-4 md:px-6">
          <AnimatedSection variant="fadeUp">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">Our Programs</h2>
              <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
                Discover our comprehensive range of initiatives designed to promote FOSS adoption
              </p>
            </div>
          </AnimatedSection>

          <LogoShowcase />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedSection variant="fadeRight">
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">Our Mission</h2>
                <p className="text-muted-foreground">
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
                    <span>Build Telugu-language AI and computing tools the community can own</span>
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
                    <span>Deploy open source software in AP schools and government offices</span>
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
                    <span>Grow campus contributors into global open source maintainers</span>
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
                    <span>Advocate for digital sovereignty and open standards in public policy</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft">
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">Our Vision</h2>
                <p className="text-muted-foreground">
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
                    <span>Every AP student who wants to contribute to open source can find a path to do so</span>
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
                    <span>AP government runs on auditable, community-owned software — not opaque proprietary systems</span>
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
                    <span>Telugu is a first-class language in open source AI and computing — not an afterthought</span>
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
                    <span>Open source startups from AP are recognised contributors to global technology</span>
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
                    className="border-white text-white bg-transparent hover:bg-background/10"
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
