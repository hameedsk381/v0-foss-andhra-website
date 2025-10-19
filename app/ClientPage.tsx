"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Code,
  BookOpen,
  Users,
  Rocket,
  Server,
  Globe,
  Database,
  Megaphone,
  GraduationCap,
  Heart,
} from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { programInfo } from "@/lib/utils"

export default function Home() {
  const programs = Object.entries(programInfo).map(([key, value]) => ({
    id: key,
    title: value.title,
    description: value.description,
    href: `/programs/${key}`,
    color: value.color,
    icon: value.icon,
    logo: `/logos/${key}-logo.png`,
  }))

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Users: <Users className="h-6 w-6" />,
      BookOpen: <BookOpen className="h-6 w-6" />,
      GraduationCap: <GraduationCap className="h-6 w-6" />,
      Code: <Code className="h-6 w-6" />,
      Rocket: <Rocket className="h-6 w-6" />,
      Database: <Database className="h-6 w-6" />,
      Megaphone: <Megaphone className="h-6 w-6" />,
    }
    return icons[iconName] || <Code className="h-6 w-6" />
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-primary relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />

          {/* Floating circles */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-white/5 -left-64 -top-64"
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
            className="absolute w-[500px] h-[500px] rounded-full bg-white/5 -right-32 -bottom-32"
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
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>

          {/* Moving particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 2,
              }}
            />
          ))}
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-sm text-white">
                  Promoting Free and Open Source Solutions
                </div>
             
                <p className="text-xl text-white/80 max-w-[600px]">
                  Digitalizing education, governance, and society through free and open source solutions
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/about">
                    <AnimatedButton className="bg-white text-primary hover:bg-white/90">Learn More</AnimatedButton>
                  </Link>
                  <Link href="/programs/fosstar#membership">
                    <AnimatedButton
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 bg-transparent"
                    >
                      Join Us
                    </AnimatedButton>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft">
              <div className="relative h-[400px] w-full">
                {/* 3D Floating elements */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-48 w-48 md:h-64 md:w-64"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/30" />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    rotateY: 360,
                    z: [0, 20, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="flex items-center justify-center h-40 w-40 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl">
                    <div className="text-white text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Image
                          src="/logos/foss-andhra-logo.png"
                          width={100}
                          height={50}
                          alt="FOSS Andhra"
                          className="mx-auto"
                        />
                      </motion.div>
                      <p className="mt-3 font-medium">Open Source</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-[20%] left-[20%] h-16 w-16 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <BookOpen className="h-8 w-8 text-white/80" />
                </motion.div>

                <motion.div
                  className="absolute top-[60%] right-[20%] h-16 w-16 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center"
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, -10, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                >
                  <Code className="h-8 w-8 text-white/80" />
                </motion.div>

                <motion.div
                  className="absolute bottom-[20%] left-[30%] h-16 w-16 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center"
                  animate={{
                    y: [0, 15, 0],
                    x: [0, 10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 2,
                  }}
                >
                  <Globe className="h-8 w-8 text-white/80" />
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <AnimatedSection variant="fadeUp">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Empowering Through Open Source
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Digitalizing education, governance, and society through free and open source software
              </p>
            </div>
          </AnimatedSection>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-4">
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Open Knowledge</CardTitle>
                  <BookOpen className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Promoting open knowledge and data accessibility for all, ensuring information is freely available
                    and shareable.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.2}>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Data Privacy</CardTitle>
                  <Server className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Championing data privacy, ownership, and public welfare through transparent and secure open-source
                    solutions.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.3}>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Public Welfare</CardTitle>
                  <Heart className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Prioritizing solutions that benefit society as a whole, not just individuals or corporations.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.4}>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Offline First</CardTitle>
                  <Globe className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Building offline-first solutions for inclusive digital access, ensuring technology works for
                    everyone regardless of connectivity.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <AnimatedSection variant="fadeUp">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
                Our Programs
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Initiatives for Change
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Discover our initiatives to promote free and open source solutions across various domains
              </p>
            </div>
          </AnimatedSection>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {programs.map((program, index) => (
              <AnimatedSection key={program.id} variant="fadeUp" delay={0.1 * index}>
                <Link href={program.href} className="block h-full">
                  <AnimatedCard className="h-full overflow-hidden transition-all duration-200 hover:border-secondary">
                    <CardHeader className={`bg-transparent text-white`}>
                      <div className="flex justify-center mb-2">
                        <Image
                          src={program.logo || "/placeholder.svg"}
                          alt={`${program.title} Logo`}
                          width={200}
                          height={60}
                          className="h-12 w-auto"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardDescription className="text-sm text-gray-500 mb-4">{program.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4">
                      <span className={`text-sm font-medium text-${program.color} flex items-center`}>
                        Learn more <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </CardFooter>
                  </AnimatedCard>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborators Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <AnimatedSection variant="fadeUp">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
                Our Collaborators
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900">Partners in Innovation</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Working together with organizations that share our vision for an open source future
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4].map((i) => (
              <AnimatedSection key={i} variant="fadeUp" delay={0.1 * i}>
                <div className="bg-white p-6 rounded-lg shadow-sm h-24 w-full flex items-center justify-center">
                  <Image
                    src={`/placeholder.svg?height=80&width=160&text=Partner+${i}`}
                    alt={`Partner ${i}`}
                    width={160}
                    height={80}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#015ba7,#015ba7)]" />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-secondary/30 right-[-150px] top-[-100px]"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
          />
          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full bg-secondary/20 left-[-100px] bottom-[-50px]"
            animate={{
              x: [0, 40, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{ borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" }}
          />
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <AnimatedSection variant="fadeUp">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Join the FOSS Movement
              </h2>
              <p className="mx-auto max-w-[700px] text-blue-100 md:text-xl">
                Become a member and help us promote free and open source solutions across Andhra
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
