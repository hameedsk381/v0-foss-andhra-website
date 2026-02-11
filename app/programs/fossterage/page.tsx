"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Database, Server, Book, Brain, Share2, Users } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { programInfo } from "@/lib/utils"

interface Program {
  title: string
  description: string
  tagline?: string | null
  mission?: string | null
  logo?: string | null
}

export default function FOSSteragePage() {
  const [programData, setProgramData] = useState<Program>(programInfo.fossterage as any)
  const programColor = "fossterage"

  useEffect(() => {
    fetch("/api/programs/fossterage")
      .then(res => res.json())
      .then(data => { if (data.success) setProgramData(data.data) })
      .catch(console.error)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={`w-full py-16 md:py-24 bg-${programColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-fossterage/90 to-fossterage/70" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="flex flex-col space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{programData.title}</h1>
                <p className="text-xl text-white/90 max-w-[600px]">
                  {programData.tagline || programData.description || "Repository of knowledge bases for researchers and data scientists"}
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link href="#initiatives">
                    <AnimatedButton className="bg-white text-fossterage hover:bg-white/90">
                      Our Initiatives
                    </AnimatedButton>
                  </Link>
                  <Link href="#contact">
                    <AnimatedButton
                      variant="outline"
                      className="border-white text-white bg-transparent hover:bg-white/10"
                    >
                      Contact Us
                    </AnimatedButton>
                  </Link>
                </div>
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
                    src={programData.logo || "/placeholder.svg"}
                    alt={programData.title}
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </motion.div>

                <motion.div
                  className="absolute inset-0 z-0"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 40,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <div className="absolute inset-0 rounded-full border-8 border-dashed border-white/20" />
                </motion.div>

                <motion.div
                  className="absolute w-20 h-20 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <Database className="text-white" />
                </motion.div>

                <motion.div
                  className="absolute w-16 h-16 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center"
                  animate={{
                    x: [0, -80, 0],
                    y: [0, 60, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                >
                  <Server className="text-white" />
                </motion.div>

                <motion.div
                  className="absolute w-12 h-12 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center"
                  animate={{
                    x: [0, 60, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 2,
                  }}
                >
                  <Book className="text-white" />
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full py-12 md:py-24 bg-white" id="about">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="relative rounded-xl overflow-hidden h-[400px]">
                <Image
                  src="/gallery/fossterage-database.jpg"
                  alt="FOSSterage Knowledge Database"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fossterage/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">Knowledge Repository</h3>
                  <p className="text-sm">Centralized databases for researchers and data scientists</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900">About {programData.title}</h2>
                {programData.mission ? (
                  <p className="text-gray-600">{programData.mission}</p>
                ) : (
                  <>
                    <p className="text-gray-600">
                      {programData.title} is a specialized program by FOSS Andhra dedicated to creating and maintaining comprehensive
                      knowledge repositories for researchers, data scientists, and the general public. Our mission is to
                      democratize access to data and information through open-source solutions.
                    </p>
                    <p className="text-gray-600">
                      We focus on building sustainable, open, and accessible data infrastructures that enable knowledge
                      sharing, foster innovation, and support evidence-based decision-making across various sectors
                      including education, governance, and social development.
                    </p>
                  </>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-fossterage/10 p-2 rounded-full">
                      <Database className="h-5 w-5 text-fossterage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Open Databases</h4>
                      <p className="text-sm text-gray-500">Creating accessible data repositories</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fossterage/10 p-2 rounded-full">
                      <Server className="h-5 w-5 text-fossterage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Data Infrastructure</h4>
                      <p className="text-sm text-gray-500">Building robust data systems</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fossterage/10 p-2 rounded-full">
                      <Brain className="h-5 w-5 text-fossterage" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI & ML Resources</h4>
                      <p className="text-sm text-gray-500">Promoting ML model sharing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fossterage/10 p-2 rounded-full">
                      <Share2 className="h-5 w-5 text-fossterage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Knowledge Transfer</h4>
                      <p className="text-sm text-gray-500">Facilitating information exchange</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50" id="initiatives">
        <div className="container px-4 md:px-6">
          <AnimatedSection variant="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-gray-900">Our Initiatives</h2>
              <p className="mt-2 text-gray-600 max-w-3xl mx-auto">
                Discover our key initiatives to create and maintain knowledge repositories
              </p>
            </div>
          </AnimatedSection>

          <Tabs defaultValue="databases" className="w-full">
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 max-w-xl mx-auto mb-8">
                <TabsTrigger value="databases">Open Databases</TabsTrigger>
                <TabsTrigger value="research">Research Tools</TabsTrigger>
                <TabsTrigger value="education">Educational Resources</TabsTrigger>
              </TabsList>
            </AnimatedSection>

            <TabsContent value="databases" className="mt-0" id="databases">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fossterage/10 pb-4">
                      <CardTitle className="text-xl text-fossterage">Andhra Knowledge Archive</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        A comprehensive archive of cultural, historical, and educational data specific to Andhra
                        Pradesh.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Cultural heritage documentation</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Historical records digitization</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Open access research papers</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.3}>
                  <AnimatedCard>
                    <CardHeader className="bg-fossterage/10 pb-4">
                      <CardTitle className="text-xl text-fossterage">Data Democratization Hub</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Providing accessible and analyzable datasets for researchers, journalists, and policy-makers.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Government data visualization</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Statistical analysis tools</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Data journalism resources</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.4}>
                  <AnimatedCard>
                    <CardHeader className="bg-fossterage/10 pb-4">
                      <CardTitle className="text-xl text-fossterage">Scientific Repository Network</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Connecting scientific research data across institutions in an open, accessible format.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Academic paper archive</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Research data sharing</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Cross-institutional collaboration</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>
              </div>
            </TabsContent>

            <TabsContent value="research" className="mt-0" id="research">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fossterage/10 pb-4">
                      <CardTitle className="text-xl text-fossterage">Open Source Research Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Developing and promoting free research software tools for data analysis and visualization.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Statistical analysis packages</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Data visualization libraries</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Research documentation tools</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.3}>
                  <AnimatedCard>
                    <CardHeader className="bg-fossterage/10 pb-4">
                      <CardTitle className="text-xl text-fossterage">ML Models Repository</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        A collection of pre-trained machine learning models for various research applications.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>NLP models for Indian languages</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Computer vision applications</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Time-series prediction models</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.4}>
                  <AnimatedCard>
                    <CardHeader className="bg-fossterage/10 pb-4">
                      <CardTitle className="text-xl text-fossterage">Research Collaboration Platform</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Facilitating collaboration among researchers through open-source platforms and tools.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Project management tools</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Version control systems</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Peer review frameworks</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-0" id="education">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fossterage/10 pb-4">
                      <CardTitle className="text-xl text-fossterage">Educational Content Library</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        A comprehensive repository of educational resources for students and educators.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Curriculum-aligned materials</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Interactive learning resources</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Multilingual content support</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.3}>
                  <AnimatedCard>
                    <CardHeader className="bg-fossterage/10 pb-4">
                      <CardTitle className="text-xl text-fossterage">Digital Textbook Initiative</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Creating and distributing free digital textbooks across various subjects and grade levels.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Open textbook publishing</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Interactive content creation</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Offline access capabilities</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.4}>
                  <AnimatedCard>
                    <CardHeader className="bg-fossterage/10 pb-4">
                      <CardTitle className="text-xl text-fossterage">Data Literacy Program</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Educational resources designed to improve data literacy among students and professionals.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Basic data analysis training</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Visualization techniques</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fossterage" />
                          <span>Critical thinking with data</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <AnimatedSection variant="fadeUp">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-gray-900">Our Team</h2>
              <p className="mt-2 text-gray-600 max-w-3xl mx-auto">
                Meet the experts working to build and maintain our knowledge repositories
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Dr. Priya Sharma</h3>
                  <p className="text-sm text-gray-500">Program Director</p>
                  <p className="text-sm mt-2">
                    Data scientist with expertise in building knowledge repositories and research databases.
                  </p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.2}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Ravi Kumar</h3>
                  <p className="text-sm text-gray-500">Database Architect</p>
                  <p className="text-sm mt-2">
                    Specializes in designing scalable and accessible database systems for research applications.
                  </p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.3}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Meena Reddy</h3>
                  <p className="text-sm text-gray-500">Research Coordinator</p>
                  <p className="text-sm mt-2">
                    Facilitates collaboration between researchers and manages data collection protocols.
                  </p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.4}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Arun Nair</h3>
                  <p className="text-sm text-gray-500">ML Engineer</p>
                  <p className="text-sm mt-2">
                    Develops machine learning models and tools to enhance data analysis capabilities.
                  </p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50" id="contact">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900">Get In Touch</h2>
                <p className="text-gray-600">
                  Have questions about our knowledge repositories or interested in collaborating? Contact the FOSSterage
                  team.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-fossterage/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-fossterage"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Email Us</h4>
                      <p className="text-sm text-gray-500">office@fossap.in</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fossterage/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-fossterage"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-sm text-gray-500">+91 94944 63840</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fossterage/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-fossterage"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Office</h4>
                      <p className="text-sm text-gray-500">
                        Foss andhra, Yesj centre for excellence, Vijayawada 520008
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft">
              <Card>
                <CardContent className="pt-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Subject"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    <AnimatedButton className="bg-fossterage text-white hover:bg-fossterage/90 w-full">
                      Send Message
                    </AnimatedButton>
                  </form>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
