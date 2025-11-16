"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Building, GraduationCap, CheckCircle, FileText, ImageIcon } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgramHero } from "@/components/program-hero"
import { Server, Database, Users, Code, Globe } from "lucide-react"
import { BookOpen } from "lucide-react"

interface Program {
  id: string
  name: string
  title: string
  description: string
  tagline?: string | null
  mission?: string | null
  color: string
  logo?: string | null
}

export default function FOSServePage() {
  const [programData, setProgramData] = useState<Program>({
    name: "fosserve",
    title: "FOSServe",
    description: "Promoting open-source solutions in education and governance",
    color: "#9333ea",
  } as any)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgramData()
  }, [])

  const fetchProgramData = async () => {
    try {
      const res = await fetch("/api/programs/fosserve")
      const data = await res.json()
      if (data.success && data.data) {
        setProgramData(data.data)
      }
    } catch (error) {
      console.error("Error fetching program data:", error)
    } finally {
      setLoading(false)
    }
  }
  // Icons for the hero section
  const HeroIcons = () => (
    <>
      <motion.div
        className="absolute top-20 left-[10%] text-purple-400 opacity-20 animate-float"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5 }}
      >
        <Server size={40} />
      </motion.div>
      <motion.div
        className="absolute top-40 right-[15%] text-purple-400 opacity-20 animate-float-delay-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.7 }}
      >
        <Database size={50} />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-[20%] text-purple-400 opacity-20 animate-float-delay-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.9 }}
      >
        <Users size={45} />
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-[25%] text-purple-400 opacity-20 animate-float"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.1 }}
      >
        <BookOpen size={35} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-[30%] text-purple-400 opacity-20 animate-float-delay-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.3 }}
      >
        <Code size={55} />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-[5%] text-purple-400 opacity-20 animate-float-delay-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.5 }}
      >
        <Globe size={40} />
      </motion.div>
    </>
  )

  return (
    <main className="min-h-screen">
      <ProgramHero
        title={programData.title}
        description={programData.tagline || programData.description || "Promoting open-source solutions in education and governance to enhance digital infrastructure and services."}
        color={programData.color || "#9333ea"}
        logoSrc={programData.logo || "/logos/fosserve-logo.png"}
        icons={<HeroIcons />}
      />

      {/* Rest of the page content */}
      {/* ... */}

      <div className="flex flex-col min-h-screen">
        {/* About Section */}
        <section className="w-full py-12 md:py-24 bg-white" id="about">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <AnimatedSection variant="fadeRight">
                <div className="relative rounded-xl overflow-hidden h-[400px]">
                  <Image
                    src="/gallery/fosserve-implementation-1.jpg"
                    alt="FOSServe Implementation"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold">Education & Governance</h3>
                    <p className="text-sm">Implementing open source solutions for public benefit</p>
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
                        {programData.title} is our dedicated program focused on promoting and implementing open source solutions in
                        educational institutions, government bodies, and the broader society. We believe that open source
                        software offers numerous advantages including cost-effectiveness, transparency, customizability, and
                        security.
                      </p>
                      <p className="text-gray-600">
                        Through {programData.title}, we work closely with schools, colleges, universities, and government departments
                        to help them transition to open source alternatives, providing training, support, and custom
                        implementation services.
                      </p>
                    </>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <GraduationCap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Education</h4>
                        <p className="text-sm text-gray-500">FOSS solutions for educational institutions</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Building className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Governance</h4>
                        <p className="text-sm text-gray-500">Open source for government departments</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Society</h4>
                        <p className="text-sm text-gray-500">Broader access to technology</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Implementation</h4>
                        <p className="text-sm text-gray-500">Custom deployment and support</p>
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
                  Discover our key initiatives to promote open source adoption in education and governance
                </p>
              </div>
            </AnimatedSection>

            <Tabs defaultValue="overview" className="w-full">
              <AnimatedSection variant="fadeUp" delay={0.1}>
                <TabsList className="grid grid-cols-1 sm:grid-cols-4 max-w-2xl mx-auto mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
                  <TabsTrigger value="casestudies">Case Studies</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>
              </AnimatedSection>

              <TabsContent value="overview" className="mt-0">
                <div className="prose prose-lg max-w-none mb-8">
                  <p>
                    FOSServe is our dedicated program focused on promoting and implementing open source solutions in
                    educational institutions, government bodies, and the broader society. We believe that open source
                    software offers numerous advantages including cost-effectiveness, transparency, customizability, and
                    security.
                  </p>

                  <p>
                    Through FOSServe, we work closely with schools, colleges, universities, and government departments
                    to help them transition to open source alternatives, providing training, support, and custom
                    implementation services.
                  </p>

                  <h3>Mission</h3>
                  <p>
                    To transform education and governance in Andhra Pradesh through the adoption of free and open source
                    solutions, making technology more accessible, transparent, and affordable for all institutions.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <GraduationCap className="mr-2 h-5 w-5 text-purple-600" />
                        Education
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Promoting FOSS solutions in schools, colleges, and universities through training and
                        implementation support.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building className="mr-2 h-5 w-5 text-purple-600" />
                        Governance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Supporting government departments in adopting open source solutions for efficient and
                        transparent governance.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
                        Society
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Enabling broader access to technology through open source solutions for community organizations
                        and the public.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-purple-50 p-8 rounded-lg my-12">
                  <h3 className="text-2xl font-bold mb-4">Partner with FOSServe</h3>
                  <p className="mb-6">
                    Are you an educational institution or government department interested in implementing open source
                    solutions? Partner with FOSServe for comprehensive support, training, and implementation assistance.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/contact">
                      <AnimatedButton className="bg-purple-600 hover:bg-purple-700 text-white">
                        Contact Us
                      </AnimatedButton>
                    </Link>
                    <Link href="/programs/fosserve/case-studies">
                      <AnimatedButton variant="outline" className="border-purple-200 text-purple-600">
                        View Case Studies
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="initiatives" className="mt-0">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200">
                      <CardTitle>FOSS Campus</CardTitle>
                      <CardDescription>Open source solutions for educational institutions</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        A comprehensive initiative to help educational institutions transition to open source software
                        for administration, teaching, and student projects.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Linux-based computer labs and digital classrooms</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Open source learning management systems</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>LibreOffice training for staff and students</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>FOSS-based curriculum development</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Link href="/programs/fosserve/foss-campus">
                        <AnimatedButton variant="ghost" className="text-purple-600">
                          Learn More
                        </AnimatedButton>
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200">
                      <CardTitle>FOSS Gov</CardTitle>
                      <CardDescription>Open source solutions for government departments</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        Supporting government departments and offices in implementing open source solutions for
                        efficient, transparent, and cost-effective governance.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Open source e-governance solutions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Secure document management systems</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Digital infrastructure development</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Employee training and capacity building</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Link href="/programs/fosserve/foss-gov">
                        <AnimatedButton variant="ghost" className="text-purple-600">
                          Learn More
                        </AnimatedButton>
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200">
                      <CardTitle>FOSS Library</CardTitle>
                      <CardDescription>Open source digital library solutions</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        Implementing open source library management systems and digital archives for educational
                        institutions and public libraries.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Koha library management system implementation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Digital archive solutions using DSpace</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Open access content management</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Librarian and staff training programs</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Link href="/programs/fosserve/foss-library">
                        <AnimatedButton variant="ghost" className="text-purple-600">
                          Learn More
                        </AnimatedButton>
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200">
                      <CardTitle>FOSS Training</CardTitle>
                      <CardDescription>Capacity building for FOSS adoption</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="mb-4">
                        Comprehensive training programs for institutions and organizations to facilitate smooth
                        transition to open source solutions.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Basic and advanced Linux administration</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Open source productivity suite training</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>System administrator certification courses</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Train-the-trainer programs for sustainability</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Link href="/programs/fosserve/foss-training">
                        <AnimatedButton variant="ghost" className="text-purple-600">
                          Learn More
                        </AnimatedButton>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="casestudies" className="mt-0">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <FileText className="mr-2 h-6 w-6 text-purple-600" />
                    Success Stories
                  </h3>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>State University Transition</CardTitle>
                        <CardDescription>Complete migration to open source solutions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3">
                            <Image
                              src="/placeholder.svg?height=300&width=400&text=University+Campus"
                              alt="University Campus"
                              width={400}
                              height={300}
                              className="rounded-lg w-full h-auto"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <p className="mb-4">
                              We helped a major state university transition their entire IT infrastructure to open
                              source solutions, resulting in significant cost savings and improved system performance.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Annual Cost Savings</span>
                                <span className="text-green-600 font-semibold">₹1.2 Crore</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Implementation Time</span>
                                <span>6 months</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Systems Migrated</span>
                                <span>500+</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Staff Trained</span>
                                <span>200+</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Link href="/programs/fosserve/case-studies/university">
                                <AnimatedButton variant="outline" size="sm" className="text-purple-600">
                                  Read Full Case Study
                                </AnimatedButton>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>District Administration Office</CardTitle>
                        <CardDescription>Digital transformation through open source</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3">
                            <Image
                              src="/placeholder.svg?height=300&width=400&text=Government+Office"
                              alt="Government Office"
                              width={400}
                              height={300}
                              className="rounded-lg w-full h-auto"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <p className="mb-4">
                              Implemented a comprehensive digital transformation for a district administrative office
                              using entirely open source solutions, enhancing efficiency and transparency.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Paperwork Reduction</span>
                                <span className="text-green-600 font-semibold">70%</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Processing Time Improvement</span>
                                <span className="text-green-600 font-semibold">65%</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Implementation Time</span>
                                <span>3 months</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Staff Satisfaction</span>
                                <span className="text-green-600 font-semibold">92%</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Link href="/programs/fosserve/case-studies/district-office">
                                <AnimatedButton variant="outline" size="sm" className="text-purple-600">
                                  Read Full Case Study
                                </AnimatedButton>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Rural School Network</CardTitle>
                        <CardDescription>Bringing technology to underserved areas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/3">
                            <Image
                              src="/placeholder.svg?height=300&width=400&text=Rural+School"
                              alt="Rural School"
                              width={400}
                              height={300}
                              className="rounded-lg w-full h-auto"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <p className="mb-4">
                              Implemented a network of computer labs running open source software in 25 rural schools,
                              providing technology access to over 5,000 students with limited resources.
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Schools Connected</span>
                                <span>25</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Students Impacted</span>
                                <span>5,000+</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Cost per Computer</span>
                                <span className="text-green-600 font-semibold">₹12,000</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Teacher Training Hours</span>
                                <span>1,200+</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Link href="/programs/fosserve/case-studies/rural-schools">
                                <AnimatedButton variant="outline" size="sm" className="text-purple-600">
                                  Read Full Case Study
                                </AnimatedButton>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <ImageIcon className="mr-2 h-6 w-6 text-purple-600" />
                  FOSServe Implementation Gallery
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="overflow-hidden rounded-lg bg-gray-100 aspect-video relative group">
                      <Image
                        src={`/placeholder.svg?height=450&width=800&text=FOSServe+Implementation+${item}`}
                        alt={`FOSServe implementation ${item}`}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                        <h4 className="font-medium">FOSServe Project {item}</h4>
                        <p className="text-sm opacity-90">Open source implementation</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <AnimatedButton variant="outline" className="mt-4 border-purple-200 text-purple-600">
                    View All Gallery Images
                  </AnimatedButton>
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
                  Meet the experts working to implement open source solutions in education and governance
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatedSection variant="fadeUp" delay={0.1}>
                <AnimatedCard className="overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Building className="h-24 w-24 text-gray-400" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold">Dr. Suresh Kumar</h3>
                    <p className="text-sm text-gray-500">Program Director</p>
                    <p className="text-sm mt-2">
                      Leads the FOSServe program and coordinates with educational institutions and government bodies.
                    </p>
                  </CardContent>
                </AnimatedCard>
              </AnimatedSection>

              <AnimatedSection variant="fadeUp" delay={0.2}>
                <AnimatedCard className="overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <GraduationCap className="h-24 w-24 text-gray-400" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold">Anita Reddy</h3>
                    <p className="text-sm text-gray-500">Education Specialist</p>
                    <p className="text-sm mt-2">
                      Develops FOSS implementation strategies for educational institutions.
                    </p>
                  </CardContent>
                </AnimatedCard>
              </AnimatedSection>

              <AnimatedSection variant="fadeUp" delay={0.3}>
                <AnimatedCard className="overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <BookOpen className="h-24 w-24 text-gray-400" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold">Ramesh Patel</h3>
                    <p className="text-sm text-gray-500">Training Coordinator</p>
                    <p className="text-sm mt-2">
                      Organizes and conducts training programs for institutions adopting FOSS solutions.
                    </p>
                  </CardContent>
                </AnimatedCard>
              </AnimatedSection>

              <AnimatedSection variant="fadeUp" delay={0.4}>
                <AnimatedCard className="overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <CheckCircle className="h-24 w-24 text-gray-400" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold">Kavita Singh</h3>
                    <p className="text-sm text-gray-500">Implementation Lead</p>
                    <p className="text-sm mt-2">
                      Oversees the technical implementation of FOSS solutions in partner organizations.
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
                    Interested in implementing open source solutions in your institution or department? Contact the
                    FOSServe team.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-purple-600"
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
                        <p className="text-sm text-gray-500">fosserve@fossandhra.org</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-purple-600"
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
                        <p className="text-sm text-gray-500">+91 98765 43210</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-purple-600"
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
                          FOSS Andhra, Innovation Valley, Visakhapatnam, Andhra Pradesh
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
                      <AnimatedButton className="bg-purple-600 text-white hover:bg-purple-700 w-full">
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
    </main>
  )
}
