"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Megaphone, Globe, BookOpen, Presentation, Users, Newspaper } from "lucide-react"
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

export default function FOSSpeaksPage() {
  const [programData, setProgramData] = useState<Program>(programInfo.fosspeaks as any)
  const programColor = "fosspeaks"

  useEffect(() => {
    fetch("/api/programs/fosspeaks")
      .then(res => res.json())
      .then(data => { if (data.success) setProgramData(data.data) })
      .catch(console.error)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={`w-full py-16 md:py-24 bg-${programColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-fosspeaks/90 to-fosspeaks/70" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="flex flex-col space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{programData.title}</h1>
                <p className="text-xl text-white/90 max-w-[600px]">
                  {programData.tagline || programData.description || "Advocacy program for free and open-source technology for society"}
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link href="#initiatives">
                    <AnimatedButton className="bg-white text-fosspeaks hover:bg-white/90">
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
                  <Megaphone className="text-white" />
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
                  <Globe className="text-white" />
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
                  <BookOpen className="text-white" />
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
                  src="/gallery/fosspeaks-advocacy-1.jpg"
                  alt="FOSSpeaks Advocacy Event"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fosspeaks/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">Advocacy & Outreach</h3>
                  <p className="text-sm">Promoting FOSS adoption through awareness campaigns</p>
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
                      {programData.title} is the advocacy and public outreach arm of FOSS Andhra dedicated to promoting the adoption
                      and benefits of free and open-source software across society. We work to influence policy, raise
                      awareness, and foster understanding about the importance of digital freedom.
                    </p>
                    <p className="text-gray-600">
                      Through various communication channels, educational programs, and policy advocacy, we amplify the
                      message of FOSS and its relevance to education, governance, privacy, and digital independence.
                    </p>
                  </>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <Megaphone className="h-5 w-5 text-fosspeaks" />
                    </div>
                    <div>
                      <h4 className="font-medium">Public Advocacy</h4>
                      <p className="text-sm text-gray-500">Promoting FOSS awareness</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <Globe className="h-5 w-5 text-fosspeaks" />
                    </div>
                    <div>
                      <h4 className="font-medium">Policy Influence</h4>
                      <p className="text-sm text-gray-500">Shaping digital policy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <Presentation className="h-5 w-5 text-fosspeaks" />
                    </div>
                    <div>
                      <h4 className="font-medium">Educational Outreach</h4>
                      <p className="text-sm text-gray-500">FOSS workshops and seminars</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <Newspaper className="h-5 w-5 text-fosspeaks" />
                    </div>
                    <div>
                      <h4 className="font-medium">Media Engagement</h4>
                      <p className="text-sm text-gray-500">Press and public relations</p>
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
                Discover our key initiatives to promote FOSS adoption and advocacy
              </p>
            </div>
          </AnimatedSection>

          <Tabs defaultValue="advocacy" className="w-full">
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 max-w-xl mx-auto mb-8">
                <TabsTrigger value="advocacy">Public Advocacy</TabsTrigger>
                <TabsTrigger value="policy">Policy Initiatives</TabsTrigger>
                <TabsTrigger value="education">Educational Programs</TabsTrigger>
              </TabsList>
            </AnimatedSection>

            <TabsContent value="advocacy" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">FOSS Awareness Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Public awareness campaigns highlighting the benefits and importance of free and open source
                        software.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Social media campaigns</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Public service announcements</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Community events and festivals</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.3}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">Media Relations Program</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Building relationships with media to promote coverage of FOSS initiatives and benefits.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Press releases and media kits</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Journalist education programs</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Op-ed and feature article placements</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.4}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">Digital Rights Advocacy</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Promoting digital rights, privacy, and freedom through advocacy and awareness campaigns.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Privacy awareness programs</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Digital freedom initiatives</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Open internet campaigns</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>
              </div>
            </TabsContent>

            <TabsContent value="policy" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">Government FOSS Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Advocating for government policies that prioritize and mandate FOSS solutions.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Policy briefs and recommendations</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Legislative advocacy</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Public procurement guidelines</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.3}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">Digital Sovereignty Initiative</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Promoting digital sovereignty through local control of technology and data.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Local technology development</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Data localization advocacy</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Technology independence campaigns</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.4}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">Education Policy Reform</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Advocating for FOSS integration in educational curricula and institutional policies.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Curriculum development</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Educational resource development</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Teacher training programs</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">FOSS Literacy Program</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Educational programs to improve understanding of FOSS principles and applications.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Workshop series</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Online learning resources</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Community training sessions</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.3}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">Public Speaker Program</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Training advocates to speak effectively about FOSS benefits and applications.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Speaker training workshops</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Event coordination</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Speaking materials development</span>
                        </li>
                      </ul>
                    </CardContent>
                  </AnimatedCard>
                </AnimatedSection>

                <AnimatedSection variant="fadeUp" delay={0.4}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">Educational Content Creation</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-gray-600 mb-4 min-h-[80px]">
                        Developing educational content about FOSS for various audiences and contexts.
                      </CardDescription>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Video tutorials and documentaries</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Infographics and visual materials</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ChevronRight className="h-4 w-4 text-fosspeaks" />
                          <span>Whitepapers and research reports</span>
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
                Meet the advocates and communicators spreading the message of FOSS
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
                  <h3 className="font-bold">Vijay Singh</h3>
                  <p className="text-sm text-gray-500">Advocacy Director</p>
                  <p className="text-sm mt-2">
                    Communications specialist with 10+ years experience in technology advocacy.
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
                  <h3 className="font-bold">Lakshmi Devi</h3>
                  <p className="text-sm text-gray-500">Policy Coordinator</p>
                  <p className="text-sm mt-2">
                    Former policy advisor specializing in digital policy development and government relations.
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
                  <h3 className="font-bold">Anand Kumar</h3>
                  <p className="text-sm text-gray-500">Media Relations</p>
                  <p className="text-sm mt-2">
                    Journalist turned advocate with extensive contacts in regional and national media.
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
                  <h3 className="font-bold">Divya Singh</h3>
                  <p className="text-sm text-gray-500">Educational Outreach</p>
                  <p className="text-sm mt-2">
                    Curriculum developer specializing in technology literacy and digital skills education.
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
                  Have questions about our advocacy or interested in collaborating? Contact the FOSSpeaks team.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-fosspeaks"
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
                      <p className="text-sm text-gray-500">fosspeaks@fossandhra.org</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-fosspeaks"
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
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-fosspeaks"
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
                    <AnimatedButton className="bg-fosspeaks text-white hover:bg-fosspeaks/90 w-full">
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
