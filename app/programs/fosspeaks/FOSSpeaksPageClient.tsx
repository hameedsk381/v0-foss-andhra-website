"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronRight, Megaphone, Globe, BookOpen, Presentation, Users, Newspaper } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgramContactSection } from "@/components/program-contact-section"
import { ProgramHero } from "@/components/program-hero"
import { PROGRAMS_BY_ID, PROGRAM_PHOTOS } from "@/lib/programs"

interface Program {
  title: string
  description: string
  tagline?: string | null
  mission?: string | null
  logo?: string | null
}

export default function FOSSpeaksPage() {
  const [programData, setProgramData] = useState<Program>({
    title: PROGRAMS_BY_ID.fosspeaks.displayName,
    description: PROGRAMS_BY_ID.fosspeaks.description,
    logo: PROGRAMS_BY_ID.fosspeaks.logo,
  })

  useEffect(() => {
    fetch("/api/programs/fosspeaks")
      .then(res => res.json())
      .then(data => { if (data.success) setProgramData(data.data) })
      .catch(console.error)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <ProgramHero
        title={programData.title}
        description={programData.tagline || programData.description || "Advocacy program for free and open-source technology for society"}
        color="#0891b2"
        logoSrc={programData.logo || "/logos/fosspeaks-logo.svg"}
        image={PROGRAM_PHOTOS.fosspeaks}
      />

      {/* About Section */}
      <section className="w-full py-12 md:py-24 bg-background" id="about">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection variant="fadeRight">
              <div className="relative rounded-xl overflow-hidden h-[400px]">
                <Image
                  src="/gallery/fosspeaks-advocacy.jpg"
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
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">About {programData.title}</h2>
                {programData.mission ? (
                  <p className="text-muted-foreground">{programData.mission}</p>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      {programData.title} is the advocacy and public outreach arm of FOSS Andhra dedicated to promoting the adoption
                      and benefits of free and open-source software across society. We work to influence policy, raise
                      awareness, and foster understanding about the importance of digital freedom.
                    </p>
                    <p className="text-muted-foreground">
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
                      <p className="text-sm text-muted-foreground">Promoting FOSS awareness</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <Globe className="h-5 w-5 text-fosspeaks" />
                    </div>
                    <div>
                      <h4 className="font-medium">Policy Influence</h4>
                      <p className="text-sm text-muted-foreground">Shaping digital policy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <Presentation className="h-5 w-5 text-fosspeaks" />
                    </div>
                    <div>
                      <h4 className="font-medium">Educational Outreach</h4>
                      <p className="text-sm text-muted-foreground">FOSS workshops and seminars</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-fosspeaks/10 p-2 rounded-full">
                      <Newspaper className="h-5 w-5 text-fosspeaks" />
                    </div>
                    <div>
                      <h4 className="font-medium">Media Engagement</h4>
                      <p className="text-sm text-muted-foreground">Press and public relations</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="w-full py-12 md:py-24 bg-[hsl(var(--surface-1))]" id="initiatives">
        <div className="container px-4 md:px-6">
          <AnimatedSection variant="fadeUp">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Our Initiatives</h2>
              <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
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

            <TabsContent value="advocacy" className="mt-0" id="advocacy">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">FOSS Awareness Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-muted-foreground mb-4 min-h-[80px]">
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
                      <CardDescription className="text-muted-foreground mb-4 min-h-[80px]">
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
                      <CardDescription className="text-muted-foreground mb-4 min-h-[80px]">
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

            <TabsContent value="policy" className="mt-0" id="policy">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">Government FOSS Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-muted-foreground mb-4 min-h-[80px]">
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
                      <CardDescription className="text-muted-foreground mb-4 min-h-[80px]">
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
                      <CardDescription className="text-muted-foreground mb-4 min-h-[80px]">
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

            <TabsContent value="education" className="mt-0" id="education">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedSection variant="fadeUp" delay={0.2}>
                  <AnimatedCard>
                    <CardHeader className="bg-fosspeaks/10 pb-4">
                      <CardTitle className="text-xl text-fosspeaks">FOSS Literacy Program</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-muted-foreground mb-4 min-h-[80px]">
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
                      <CardDescription className="text-muted-foreground mb-4 min-h-[80px]">
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
                      <CardDescription className="text-muted-foreground mb-4 min-h-[80px]">
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
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <AnimatedSection variant="fadeUp">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Our Team</h2>
              <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
                Meet the advocates and communicators spreading the message of FOSS
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <Users className="h-24 w-24 text-muted-foreground" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Vijay Singh</h3>
                  <p className="text-sm text-muted-foreground">Advocacy Director</p>
                  <p className="text-sm mt-2">
                    Communications specialist with 10+ years experience in technology advocacy.
                  </p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.2}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <Users className="h-24 w-24 text-muted-foreground" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Lakshmi Devi</h3>
                  <p className="text-sm text-muted-foreground">Policy Coordinator</p>
                  <p className="text-sm mt-2">
                    Former policy advisor specializing in digital policy development and government relations.
                  </p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.3}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <Users className="h-24 w-24 text-muted-foreground" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Anand Kumar</h3>
                  <p className="text-sm text-muted-foreground">Media Relations</p>
                  <p className="text-sm mt-2">
                    Journalist turned advocate with extensive contacts in regional and national media.
                  </p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.4}>
              <AnimatedCard className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <Users className="h-24 w-24 text-muted-foreground" />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold">Divya Singh</h3>
                  <p className="text-sm text-muted-foreground">Educational Outreach</p>
                  <p className="text-sm mt-2">
                    Curriculum developer specializing in technology literacy and digital skills education.
                  </p>
                </CardContent>
              </AnimatedCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <ProgramContactSection
        description="Have questions about our advocacy or interested in collaborating? Contact the FOSSpeaks team."
        iconBgClass="bg-fosspeaks/10"
        iconClass="text-fosspeaks"
        submitButtonClass="bg-fosspeaks text-white hover:bg-fosspeaks/90"
      />
    </div>
  )
}
