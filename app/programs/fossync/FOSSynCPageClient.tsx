"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, GraduationCap, MapPin, CheckCircle, CalendarDays, Image } from "lucide-react"
import { ProgramHero } from "@/components/program-hero"
import { PROGRAMS_BY_ID, PROGRAM_PHOTOS } from "@/lib/programs"

interface Program {
  title: string
  description: string
  mission?: string | null
}

export default function FOSSynCPage() {
  const [programData, setProgramData] = useState<Program>({
    title: PROGRAMS_BY_ID.fossync.displayName,
    description: PROGRAMS_BY_ID.fossync.description,
  })

  useEffect(() => {
    fetch("/api/programs/fossync")
      .then(res => res.json())
      .then(data => { if (data.success) setProgramData(data.data) })
      .catch(console.error)
  }, [])
  return (
    <div className="flex flex-col min-h-screen">
      <ProgramHero
        title={programData.title}
        description={programData.description || "Student-led open source clubs on 9+ AP campuses"}
        color="#16a34a"
        logoSrc={PROGRAMS_BY_ID.fossync.logo}
        image={PROGRAM_PHOTOS.fossync}
      />

      <div className="app-container py-12">
      <div className="max-w-5xl mx-auto">

        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6" id="overview">
            <div className="prose prose-lg max-w-none mb-8">
              <p>
                FOSSynC (FOSS on Campus) is FOSS Andhra's flagship initiative to establish and sustain student-led
                open source clubs in engineering colleges, universities, and polytechnic institutions across Andhra
                Pradesh. Each FOSSynC chapter operates as an independent student body that serves as a hub for open
                source learning, peer collaboration, and community-driven innovation on campus.
              </p>

              <p>
                Our FOSSynC clubs are run by students for students, with mentorship and organisational support from
                FOSS Andhra. Club members participate in weekly coding sessions, Linux install fests, inter-college
                hackathons, and community events. Through these activities, students build practical skills in Git,
                Linux, Python, and web development — skills that complement formal coursework with real-world open
                source experience that employers actively look for.
              </p>

              <p>
                Since its launch, FOSSynC has grown to nine active chapters with over 700 student members across
                Andhra Pradesh. Alumni of the programme have gone on to contribute to major open source projects,
                secure internships at technology companies, and mentor the next cohort of student contributors.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-3">Mission</h2>
              <p>
                To empower students as confident leaders in the open source movement by providing resources,
                mentorship, and real contribution opportunities — building a vibrant, self-sustaining FOSS community
                on every campus in Andhra Pradesh.
              </p>
            </div>

            {/* How to start a club */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">How to Start a FOSSynC Club at Your College</h2>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Express Interest",
                    body: "Fill out the interest form at fossap.in/contact or email office@fossap.in with your college name, department, and the number of students ready to join. A FOSS Andhra coordinator will respond within 3 working days.",
                  },
                  {
                    step: "2",
                    title: "Find a Faculty Advisor",
                    body: "Identify a faculty member willing to serve as an institutional point-of-contact. The advisor does not need prior open source experience — FOSS Andhra provides orientation materials and connects advisors with peer mentors.",
                  },
                  {
                    step: "3",
                    title: "Register Your Chapter",
                    body: "Submit a short application with your founding team (minimum 10 students), faculty advisor details, and your first semester activity plan. Registration is free and takes approximately one week to process.",
                  },
                  {
                    step: "4",
                    title: "Attend Onboarding",
                    body: "Your founding team participates in a half-day virtual onboarding session covering club governance, event planning, access to the FOSSynC resource kit, and introduction to the FOSS Andhra mentor network.",
                  },
                  {
                    step: "5",
                    title: "Launch and Grow",
                    body: "Host your first campus event — an install fest or intro-to-Linux workshop works well — using the ready-made slide decks and facilitation guides in the resource kit. FOSS Andhra can send a speaker for your inaugural event.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 p-4 rounded-lg border bg-background">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-fossync/10 text-fossync font-bold flex items-center justify-center text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { value: "9+", label: "Active Chapters" },
                { value: "700+", label: "Student Members" },
                { value: "25+", label: "Events Per Year" },
                { value: "3", label: "States Reached" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-lg bg-fossync/5">
                  <div className="text-3xl font-bold text-fossync mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-fossync" />
                    Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Regular workshops, training sessions, and learning resources on open source technologies and best
                    practices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-fossync" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Building a supportive community of like-minded students interested in open source technology and
                    innovation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5 text-fossync" />
                    Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Organizing hackathons, code sprints, and other events to apply FOSS skills to real-world problems.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-fossync/5 p-8 rounded-lg my-12">
              <h2 className="text-2xl font-bold mb-4">Start a FOSSynC Club at Your Institution</h2>
              <p className="mb-6">
                Are you a student or faculty member interested in starting a FOSSynC club at your educational
                institution? We provide resources, mentorship, and support to help you establish and grow your campus
                FOSS community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact?subject=Start a FOSSynC Club">
                  <Button className="bg-fossync hover:bg-fossync/90">Start a Club</Button>
                </Link>
                <Link href="/contact?subject=FOSSynC Resources">
                  <Button variant="outline" className="border-fossync/30 text-fossync">
                    View Resources
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clubs" className="mt-6" id="clubs">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <MapPin className="mr-2 h-6 w-6 text-fossync" />
                FOSSynC Club Network
              </h3>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "JNTU FOSSynC",
                    location: "Jawaharlal Nehru Technological University, Kakinada",
                    members: 120,
                    established: "2022",
                  },
                  {
                    name: "Andhra University FOSSynC",
                    location: "Andhra University, Visakhapatnam",
                    members: 85,
                    established: "2021",
                  },
                  {
                    name: "SVU FOSSynC",
                    location: "Sri Venkateswara University, Tirupati",
                    members: 95,
                    established: "2022",
                  },
                  {
                    name: "NIT FOSSynC",
                    location: "National Institute of Technology, Tadepalligudem",
                    members: 110,
                    established: "2021",
                  },
                  { name: "KLEF FOSSynC", location: "KL University, Guntur", members: 75, established: "2023" },
                  { name: "VITAP FOSSynC", location: "VIT-AP University, Amaravati", members: 65, established: "2023" },
                  {
                    name: "IIT FOSSynC",
                    location: "Indian Institute of Technology, Tirupati",
                    members: 90,
                    established: "2022",
                  },
                  {
                    name: "RVR FOSSynC",
                    location: "RVR & JC College of Engineering, Guntur",
                    members: 55,
                    established: "2023",
                  },
                  {
                    name: "GITAM FOSSynC",
                    location: "GITAM University, Visakhapatnam",
                    members: 70,
                    established: "2022",
                  },
                ].map((club, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{club.name}</CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" /> {club.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Members:</span>
                        <span className="font-medium">{club.members}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Established:</span>
                        <span className="font-medium">{club.established}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/contact?subject=Club Inquiry"
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full text-fossync border-fossync/30">
                          Inquire for Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link href="#clubs">
                  <Button variant="outline" className="mt-4 border-fossync/30 text-fossync">
                    Refresh Club Network
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>


          <TabsContent value="activities" className="mt-6" id="activities">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Regular Club Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    FOSSynC clubs organize regular activities to engage members and promote open source on campus.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Weekly Meetups</h4>
                        <p className="text-sm text-muted-foreground">
                          Regular club meetings to discuss projects, share knowledge, and plan activities
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Technical Workshops</h4>
                        <p className="text-sm text-muted-foreground">Hands-on sessions on open source technologies and tools</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Project Collaboration</h4>
                        <p className="text-sm text-muted-foreground">
                          Working together on open source projects and contributions
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Guest Lectures</h4>
                        <p className="text-sm text-muted-foreground">
                          Inviting industry experts and FOSS contributors for talks
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Special Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Beyond regular activities, FOSSynC clubs organize special events throughout the academic year.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">FOSSHack</h4>
                        <p className="text-sm text-muted-foreground">
                          Open source hackathons focused on solving real-world problems
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Install Fest</h4>
                        <p className="text-sm text-muted-foreground">
                          Events to help students install and configure Linux and open source software
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Software Freedom Day</h4>
                        <p className="text-sm text-muted-foreground">
                          Celebrating free software and open source with various campus activities
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">FOSS Fair</h4>
                        <p className="text-sm text-muted-foreground">
                          Exhibition of open source projects and solutions developed by students
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Annual FOSSynC Summit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img
                        src="/gallery/fosstar-summit.jpg"
                        alt="FOSSynC Summit"
                        className="rounded-lg w-full h-auto"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <p className="mb-4">
                        The annual FOSSynC Summit brings together all FOSSynC clubs from across Andhra Pradesh for a
                        two-day event filled with talks, workshops, project showcases, and networking opportunities.
                      </p>

                      <h4 className="font-semibold mb-2">Summit Highlights:</h4>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                          <span>Keynote speeches from FOSS leaders and industry experts</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                          <span>Inter-college hackathon with exciting prizes</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                          <span>Project showcase and competition</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                          <span>Workshops on emerging open source technologies</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-fossync mr-2 mt-0.5 flex-shrink-0" />
                          <span>FOSSynC Club Excellence Awards</span>
                        </li>
                      </ul>

                      <Link href="/contact?subject=FOSSynC Summit Inquiry">
                        <Button className="bg-fossync hover:bg-fossync/90">Learn More About the Summit</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6" id="gallery">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Image className="mr-2 h-6 w-6 text-fossync" />
              FOSSynC Events Gallery
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { id: 1, src: "/gallery/fossync-club.jpg", title: "College Club Launch" },
                { id: 2, src: "/gallery/fosstorm-workshop.jpg", title: "Campus Hackathon" },
                { id: 3, src: "/gallery/fosstar-summit.jpg", title: "Student Leader Meet" },
                { id: 4, src: "/gallery/fosserve-launch.jpg", title: "Open Source Seminar" },
                { id: 5, src: "/gallery/fossart-startup.jpg", title: "Project Demo Day" },
                { id: 6, src: "/gallery/fosspeaks-advocacy.jpg", title: "Tech Talk on Campus" },
              ].map((item) => (
                <div key={item.id} className="overflow-hidden rounded-lg bg-muted aspect-video relative group">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm opacity-90">Student-led FOSS activities</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/gallery">
                <Button variant="outline" className="mt-4 border-fossync/30 text-fossync">
                  View All Gallery Images
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  )
}
