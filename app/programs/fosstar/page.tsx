"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Users, Calendar, CheckCircle, Star, Heart } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { programInfo } from "@/lib/utils"

export default function FOSStarPage() {
  const programData = programInfo.fosstar
  const programColor = "fosstar"

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={`w-full py-16 md:py-24 bg-${programColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-fosstar/90 to-fosstar/70" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="flex flex-col space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{programData.title}</h1>
                <p className="text-xl text-white/90 max-w-[600px]">
                  Our flagship membership program connecting and empowering the FOSS community across Andhra Pradesh
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link href="#initiatives">
                    <AnimatedButton className="bg-white text-fosstar hover:bg-white/90">Our Initiatives</AnimatedButton>
                  </Link>
                  <Link href="/register">
                    <AnimatedButton
                      variant="outline"
                      className="border-white text-white bg-transparent hover:bg-white/10"
                    >
                      Become a Member
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
                    src={programData.logo || "/logos/fosstar-logo.svg"}
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
                  <Users className="text-white" />
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
                  <Calendar className="text-white" />
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
                  <Star className="text-white" />
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
                <Image src="/gallery/fosstar-event-1.jpg" alt="FOSStar Community Event" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-fosstar/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">Community Building</h3>
                  <p className="text-sm">Connecting FOSS enthusiasts across Andhra Pradesh</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeLeft">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tighter text-gray-900">About FOSStar</h2>
                <p className="text-gray-600">
                  FOSStar is FOSS Andhra's comprehensive membership program designed to connect individuals, students,
                  professionals, and institutions who share a common interest in promoting and adopting free and open
                  source software solutions.
                </p>
                <p className="text-gray-600">
                  Through FOSStar, we aim to build a vibrant community of FOSS enthusiasts who collaborate, learn, and
                  advocate for open source adoption across educational institutions, government bodies, and society at
                  large.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosstar/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-fosstar" />
                    </div>
                    <div>
                      <h4 className="font-medium">Community</h4>
                      <p className="text-sm text-gray-500">Building a strong FOSS network</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosstar/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-fosstar" />
                    </div>
                    <div>
                      <h4 className="font-medium">Events</h4>
                      <p className="text-sm text-gray-500">Regular meetups and workshops</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosstar/10 p-2 rounded-full">
                      <Star className="h-5 w-5 text-fosstar" />
                    </div>
                    <div>
                      <h4 className="font-medium">Recognition</h4>
                      <p className="text-sm text-gray-500">Acknowledging contributions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosstar/10 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-fosstar" />
                    </div>
                    <div>
                      <h4 className="font-medium">Support</h4>
                      <p className="text-sm text-gray-500">Resources for FOSS adoption</p>
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
                Discover our key initiatives to connect and empower the FOSS community
              </p>
            </div>
          </AnimatedSection>

          <Tabs defaultValue="benefits" className="w-full">
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 max-w-xl mx-auto mb-8">
                <TabsTrigger value="benefits">Membership Benefits</TabsTrigger>
                <TabsTrigger value="activities">Community Activities</TabsTrigger>
                <TabsTrigger value="types">Membership Types</TabsTrigger>
              </TabsList>
            </AnimatedSection>

            <TabsContent value="benefits" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <Card>
                    <CardHeader className="bg-fosstar/10 pb-4">
                      <CardTitle>For Students</CardTitle>
                      <CardDescription>Benefits for student members</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Access to learning resources and study materials</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Mentorship opportunities from experienced professionals</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Participation in student-focused hackathons and competitions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Internship opportunities with partner organizations</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.3}>
                  <Card>
                    <CardHeader className="bg-fosstar/10 pb-4">
                      <CardTitle>For Professionals</CardTitle>
                      <CardDescription>Benefits for professional members</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Networking opportunities with industry leaders</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Advanced workshops and training sessions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Speaking opportunities at FOSS Andhra events</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Participation in community governance</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.4}>
                  <Card>
                    <CardHeader className="bg-fosstar/10 pb-4">
                      <CardTitle>For Institutions</CardTitle>
                      <CardDescription>Benefits for institutional members</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Custom FOSS implementation consultations</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>On-site training and workshops for staff</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Support for establishing FOSSynC campus clubs</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Visibility through branding at events and website</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.5}>
                  <Card>
                    <CardHeader className="bg-fosstar/10 pb-4">
                      <CardTitle>Community Access</CardTitle>
                      <CardDescription>Benefits for all members</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Access to members-only online forums and discussions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Invitations to regional and national FOSS events</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Access to the FOSStar resource library</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Quarterly FOSStar newsletter and updates</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </TabsContent>

            <TabsContent value="activities" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosstar/10 pb-4">
                      <CardTitle className="text-xl text-fosstar">Workshops & Training</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Regular workshops and training sessions on various open source technologies, tools, and
                        practices.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosstar" />
                          <span>Linux Administration</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosstar" />
                          <span>Open Source Development</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosstar" />
                          <span>FOSS Alternatives</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.3}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosstar/10 pb-4">
                      <CardTitle className="text-xl text-fosstar">Meetups & Networking</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Regular community meetups, both in-person and virtual, to foster networking and collaboration.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosstar" />
                          <span>Monthly Member Meetups</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosstar" />
                          <span>Expert Panel Discussions</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosstar" />
                          <span>Networking Events</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.4}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosstar/10 pb-4">
                      <CardTitle className="text-xl text-fosstar">Hackathons & Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Collaborative coding events and long-term projects that address local challenges.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosstar" />
                          <span>Quarterly Hackathons</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosstar" />
                          <span>Community Projects</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosstar" />
                          <span>Bug Squashing Parties</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>
              </div>
            </TabsContent>

            <TabsContent value="types" className="mt-0" id="membership">
              <div className="max-w-4xl mx-auto">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <Card className="border-fosstar shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-fosstar to-fosstar/70"></div>
                    <div className="absolute -top-1 right-4 bg-fosstar text-white text-xs px-3 py-1 rounded-b-md">
                      ANNUAL MEMBERSHIP
                    </div>
                    <CardHeader className="bg-fosstar/5 text-center">
                      <CardTitle className="text-2xl">FOSStar Member</CardTitle>
                      <CardDescription>Join the FOSS Andhra community</CardDescription>
                      <div className="text-4xl font-bold text-fosstar mt-4">
                        ₹300<span className="text-lg font-normal text-gray-500">/year</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold mb-3">Community Benefits</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Access to members-only forums</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Invitations to exclusive events</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Networking opportunities</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Monthly newsletters</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Learning & Growth</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Access to learning resources</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Workshops and training sessions</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Mentorship opportunities</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>Project collaboration</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="text-center">
                        <Link href="/register">
                          <AnimatedButton className="bg-fosstar hover:bg-fosstar/90 text-white px-8 py-3">
                            Join Now - ₹300/year
                          </AnimatedButton>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
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
                Meet the community leaders driving the FOSStar program
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
                  <h3 className="font-bold">Rajesh Kumar</h3>
                  <p className="text-sm text-gray-500">Community Director</p>
                  <p className="text-sm mt-2">Leads the FOSStar community initiatives and membership programs.</p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.2}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Priya Reddy</h3>
                  <p className="text-sm text-gray-500">Events Coordinator</p>
                  <p className="text-sm mt-2">Organizes FOSStar events, workshops, and networking opportunities.</p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.3}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Anil Sharma</h3>
                  <p className="text-sm text-gray-500">Membership Manager</p>
                  <p className="text-sm mt-2">Handles membership registrations and member relations.</p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.4}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Users className="h-24 w-24 text-gray-400" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Lakshmi Devi</h3>
                  <p className="text-sm text-gray-500">Education Lead</p>
                  <p className="text-sm mt-2">Develops educational resources and training programs for members.</p>
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
                  Have questions about our membership program or interested in joining? Contact the FOSStar team.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosstar/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-fosstar"
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
                      <p className="text-sm text-gray-500">fosstar@fossandhra.org</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosstar/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-fosstar"
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
                    <div className="bg-fosstar/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-fosstar"
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
                    <AnimatedButton className="bg-fosstar text-white hover:bg-fosstar/90 w-full">
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
