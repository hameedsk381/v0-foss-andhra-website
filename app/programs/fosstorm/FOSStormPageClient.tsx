"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Github, Star, CheckCircle, Image } from "lucide-react"
import { PROGRAMS_BY_ID } from "@/lib/programs"

interface Program {
  title: string
  description: string
}

export default function FOSStormPage() {
  const [programData, setProgramData] = useState<Program>({
    title: PROGRAMS_BY_ID.fosstorm.displayName,
    description: PROGRAMS_BY_ID.fosstorm.description,
  })

  useEffect(() => {
    fetch("/api/programs/fosstorm")
      .then(res => res.json())
      .then(data => { if (data.success) setProgramData(data.data) })
      .catch(console.error)
  }, [])
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="px-3 py-1 text-orange-600 border-orange-200 font-medium">
            Program
          </Badge>
          <h1 className="text-4xl font-bold">{programData.title}</h1>
        </div>

        <p className="text-xl text-orange-600 mb-8">{programData.description}</p>

        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contribute">Contribute</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6" id="overview">
            <div className="prose prose-lg max-w-none mb-8">
              <p>
                FOSStorm is FOSS Andhra's community-driven software development programme that builds open source
                projects addressing real challenges in Andhra Pradesh — from regional language computing and rural
                education to local governance and agricultural connectivity. Each project is initiated through a
                public proposal process and developed collaboratively by volunteers from across the state and the
                wider open source community.
              </p>

              <p>
                All code produced under FOSStorm is released under recognised open source licences (GPL, MIT, or
                Apache 2.0), ensuring that individuals, institutions, and governments can freely use, study, modify,
                and distribute the software. Contributions come from professional developers, college students,
                designers, translators, and domain experts — anyone with skills to offer is welcome, regardless of
                experience level.
              </p>

              <p>
                FOSStorm projects are hosted on GitHub under the <strong>fossandhra</strong> organisation. Each
                repository follows a structured contribution workflow: issues labelled <em>good first issue</em>
                are reserved for new contributors, while <em>help wanted</em> issues are open to all. Monthly
                virtual contributor meetups keep the community connected, and an annual in-person sprint brings
                teams together to make concentrated progress on priority milestones.
              </p>

              <h3>Mission</h3>
              <p>
                To build a sustainable ecosystem of locally-relevant open source software that showcases Andhra
                Pradesh talent, solves real community problems, and contributes meaningfully to the global open
                source commons — while growing a culture of collaborative, public-interest technology development
                across the region.
              </p>
            </div>

            {/* Why open source for AP */}
            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-3">Why Open Source Matters for Andhra Pradesh</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Cost savings for institutions</strong> — schools, panchayats, and hospitals can deploy FOSStorm tools at zero licensing cost, redirecting budgets to services.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Telugu language computing</strong> — our NLP and localisation projects directly improve software usability for the 82 million Telugu speakers in the state.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Skill development</strong> — contributing to real production code teaches version control, code review, and collaborative workflows that classroom projects rarely replicate.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Data sovereignty</strong> — open source tools let communities inspect and control how their data is processed, critical for government and healthcare deployments.</span>
                </div>
              </div>
            </div>

            {/* Impact metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { value: "4", label: "Active Projects" },
                { value: "120+", label: "Contributors" },
                { value: "315+", label: "GitHub Stars" },
                { value: "100%", label: "Open Source" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-lg bg-orange-50">
                  <div className="text-3xl font-bold text-orange-700 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 h-5 w-5 text-orange-600" />
                    Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Collaborative development of open source software projects that address real-world needs and
                    challenges.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Github className="mr-2 h-5 w-5 text-orange-600" />
                    Open Source
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    All projects are released under open source licenses, allowing free use, modification, and
                    distribution.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-orange-600" />
                    Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Creating software solutions that have real impact on communities, organizations, and individuals.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-orange-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-bold mb-4">Join FOSStorm</h3>
              <p className="mb-6">
                Are you a developer, designer, or domain expert interested in contributing to open source projects? Join
                FOSStorm and help us build impactful software solutions through community collaboration.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact?subject=Join FOSStorm">
                  <Button className="bg-orange-600 hover:bg-orange-700">Join as a Contributor</Button>
                </Link>
                <Link href="#projects">
                  <Button variant="outline" className="border-orange-200 text-orange-600">
                    Explore Projects
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6" id="projects">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Code className="mr-2 h-6 w-6 text-orange-600" />
                Active Projects
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>TeluguNLP</CardTitle>
                        <CardDescription>Natural Language Processing toolkit for Telugu</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      A comprehensive NLP toolkit for Telugu language, including tokenization, part-of-speech tagging,
                      sentiment analysis, and more. Aimed at improving Telugu language computing and accessibility.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-gray-100">
                        Python
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        NLP
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Machine Learning
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Telugu
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-x-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>120 stars</span>
                      </div>
                      <div className="flex items-center">
                        <Github className="mr-1 h-4 w-4" />
                        <span>48 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="https://github.com/fossandhra/telugu-nlp" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center text-orange-600">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="/contact?subject=Project Inquiry: TeluguNLP">
                      <Button className="bg-orange-600 hover:bg-orange-700">Project Info</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>OpenEdu</CardTitle>
                        <CardDescription>Open source learning management system</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      A lightweight, offline-first learning management system designed for schools with limited internet
                      connectivity. Supports content synchronization, multimedia lessons, and assessment tools.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-gray-100">
                        JavaScript
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        React
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Node.js
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Education
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-x-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>85 stars</span>
                      </div>
                      <div className="flex items-center">
                        <Github className="mr-1 h-4 w-4" />
                        <span>32 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="https://github.com/fossandhra/open-edu" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center text-orange-600">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="/contact?subject=Project Inquiry: OpenEdu">
                      <Button className="bg-orange-600 hover:bg-orange-700">Project Info</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>CivicDocs</CardTitle>
                        <CardDescription>Document management for local governments</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Beta</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      A secure document management system designed for local government offices, with features for
                      document digitization, workflow automation, e-signatures, and public records access.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-gray-100">
                        Python
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Django
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        PostgreSQL
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Governance
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-x-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>62 stars</span>
                      </div>
                      <div className="flex items-center">
                        <Github className="mr-1 h-4 w-4" />
                        <span>25 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="https://github.com/fossandhra/civic-docs" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center text-orange-600">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="/contact?subject=Project Inquiry: CivicDocs">
                      <Button className="bg-orange-600 hover:bg-orange-700">Project Info</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>FarmConnect</CardTitle>
                        <CardDescription>Open platform for farmers and agricultural data</CardDescription>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Development</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      A mobile-first platform connecting farmers with agricultural resources, market information,
                      weather data, and expert advice. Includes offline functionality for rural areas with limited
                      connectivity.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-gray-100">
                        React Native
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Node.js
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        MongoDB
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100">
                        Agriculture
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-x-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>48 stars</span>
                      </div>
                      <div className="flex items-center">
                        <Github className="mr-1 h-4 w-4" />
                        <span>18 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="https://github.com/fossandhra/farm-connect" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="flex items-center text-orange-600">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="/contact?subject=Project Inquiry: FarmConnect">
                      <Button className="bg-orange-600 hover:bg-orange-700">Project Info</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <Link href="#projects">
                  <Button variant="outline" className="mt-4 border-orange-200 text-orange-600">
                    Refresh Projects
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contribute" className="mt-6" id="contribute">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Github className="mr-2 h-6 w-6 text-orange-600" />
                How to Contribute
              </h3>

              <div className="prose prose-lg max-w-none mb-8">
                <p>
                  We welcome contributions from developers, designers, testers, documentation writers, and domain
                  experts to our FOSStorm projects. Here's how you can get involved:
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-orange-600" />
                      Find a Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Browse our active projects and find one that matches your interests and skills. Each project has
                      its own GitHub repository with detailed information about the project goals and architecture.
                    </p>
                    <Link href="#projects">
                      <Button variant="outline" className="w-full text-orange-600 border-orange-200">
                        Browse Projects
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-orange-600" />
                      Setup Development Environment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Follow the project's README file to set up your local development environment. Most projects
                      include detailed instructions for getting started with development.
                    </p>
                    <Link href="/contact?subject=Developer Setup Guide">
                      <Button variant="outline" className="w-full text-orange-600 border-orange-200">
                        Inquire for Guide
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-orange-600" />
                      Pick an Issue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Check the project's GitHub issues for beginner-friendly tasks, bug fixes, or feature requests.
                      Issues labeled "good first issue" are great starting points for new contributors.
                    </p>
                    <Link href="https://github.com/fossandhra" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full text-orange-600 border-orange-200">
                        <Github className="mr-2 h-4 w-4" />
                        Browse Issues
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-orange-600" />
                      Make Contributions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Follow the project's contribution guidelines to submit your work. This typically involves forking
                      the repository, creating a branch, making changes, and submitting a pull request.
                    </p>
                    <Link href="/contact?subject=Contribution Guide">
                      <Button variant="outline" className="w-full text-orange-600 border-orange-200">
                        Inquire for Guide
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>


              <div className="bg-orange-50 p-8 rounded-lg">
                <h4 className="text-xl font-bold mb-4">Join the FOSStorm Developer Community</h4>
                <p className="mb-6">
                  Connect with other contributors, get help with issues, and stay updated on project developments by
                  joining our developer community.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="https://discord.gg/fossandhra" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-orange-600 hover:bg-orange-700">Join Discord Community</Button>
                  </Link>
                  <Link href="https://matrix.to/#/#fossandhra:matrix.org" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-orange-200 text-orange-600">
                      Join Matrix Channel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6" id="gallery">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Image className="mr-2 h-6 w-6 text-orange-600" />
              FOSStorm Project Gallery
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { id: 1, src: "/gallery/fosstorm-workshop.jpg", title: "Developer Workshop" },
                { id: 2, src: "/gallery/fosstar-summit.jpg", title: "Project Launch Event" },
                { id: 3, src: "/gallery/fossync-club.jpg", title: "Community Code Sprint" },
                { id: 4, src: "/gallery/fosserve-launch.jpg", title: "LMS Deployment" },
                { id: 5, src: "/gallery/fossart-startup.jpg", title: "Architecture Review" },
                { id: 6, src: "/gallery/fosstar-event-1.jpg", title: "NLP Tool Kit Demo" },
              ].map((item) => (
                <div key={item.id} className="overflow-hidden rounded-lg bg-gray-100 aspect-video relative group">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm opacity-90">FOSStorm application interface</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/gallery">
                <Button variant="outline" className="mt-4 border-orange-200 text-orange-600">
                  View All Gallery Images
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
