"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, DollarSign, Rocket, CheckCircle, Award, Image } from "lucide-react"

interface Program {
  title: string
  description: string
}

export default function FOSStartPage() {
  const [programData, setProgramData] = useState<Program>({
    title: "FOSStart",
    description: "Entrepreneurship space for funding open source innovations",
  })

  useEffect(() => {
    fetch("/api/programs/fosstart")
      .then(res => res.json())
      .then(data => { if (data.success) setProgramData(data.data) })
      .catch(console.error)
  }, [])
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="outline" className="px-3 py-1 text-red-600 border-red-200 font-medium">
            Program
          </Badge>
          <h1 className="text-4xl font-bold">{programData.title}</h1>
        </div>

        <p className="text-xl text-red-600 mb-8">{programData.description}</p>

        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="startups">Startups</TabsTrigger>
            <TabsTrigger value="apply">Apply for Funding</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6" id="overview">
            <div className="prose prose-lg max-w-none mb-8">
              <p>
                FOSStart is our entrepreneurship and innovation program focused on supporting startups and projects that
                build sustainable businesses around open source solutions. We provide funding, mentorship, networking
                opportunities, and resources to help open source innovations succeed commercially.
              </p>

              <p>
                Through FOSStart, we aim to demonstrate that open source and commercial success can go hand in hand,
                creating sustainable businesses that contribute to the open source ecosystem while generating economic
                value and jobs.
              </p>

              <h3>Mission</h3>
              <p>
                To foster a thriving ecosystem of open source startups in Andhra Pradesh by providing funding,
                mentorship, and support for entrepreneurs who build businesses around open source solutions and
                principles.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-red-600" />
                    Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Supporting innovative ideas and solutions that leverage the power of open source technology to solve
                    real problems.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-red-600" />
                    Funding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Providing seed funding, grants, and investment opportunities for open source startups and projects.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="mr-2 h-5 w-5 text-red-600" />
                    Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Helping open source entrepreneurs scale their solutions through mentorship, networking, and resource
                    access.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-red-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-bold mb-4">Apply for FOSStart Funding</h3>
              <p className="mb-6">
                Are you building a business around open source solutions? Apply for FOSStart funding and support to take
                your open source innovation to the next level.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#apply">
                  <Button className="bg-red-600 hover:bg-red-700">Apply for Funding</Button>
                </Link>
                <Link href="#startups">
                  <Button variant="outline" className="border-red-200 text-red-600">
                    View Supported Startups
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="startups" className="mt-6" id="startups">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Award className="mr-2 h-6 w-6 text-red-600" />
                FOSStart Supported Startups
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>OpenHealth</CardTitle>
                        <CardDescription>Open source healthcare management solutions</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Funded</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src="/placeholder.svg?height=120&width=120&text=Logo"
                          alt="OpenHealth Logo"
                          className="rounded-lg w-20 h-20 object-cover"
                        />
                      </div>
                      <div>
                        <p className="mb-2">
                          OpenHealth develops open source hospital and clinic management software designed specifically
                          for rural and small healthcare providers, with features for patient records, appointment
                          scheduling, inventory, and billing.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-gray-100">
                            Healthcare
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100">
                            Management Software
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100">
                            Rural Focus
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">Founded:</span>
                          <span className="font-medium">2022</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Location:</span>
                          <span className="font-medium">Visakhapatnam</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Funding Stage:</span>
                          <span className="font-medium">Seed</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Team Size:</span>
                          <span className="font-medium">8 members</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="/contact?subject=Contact OpenHealth">
                      <Button variant="outline" className="text-red-600 border-red-200">
                        Contact
                      </Button>
                    </Link>
                    <Link href="/contact?subject=Inquiry: OpenHealth Startup">
                      <Button className="bg-red-600 hover:bg-red-700">Project Info</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>LocalMarket</CardTitle>
                        <CardDescription>Open platform for small businesses and artisans</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Funded</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src="/placeholder.svg?height=120&width=120&text=Logo"
                          alt="LocalMarket Logo"
                          className="rounded-lg w-20 h-20 object-cover"
                        />
                      </div>
                      <div>
                        <p className="mb-2">
                          LocalMarket is building an open source e-commerce platform specifically for small businesses,
                          artisans, and farmers to sell their products online. Features include inventory management,
                          payment processing, and local delivery integration.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-gray-100">
                            E-commerce
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100">
                            Small Business
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100">
                            Local Economy
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">Founded:</span>
                          <span className="font-medium">2021</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Location:</span>
                          <span className="font-medium">Vijayawada</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Funding Stage:</span>
                          <span className="font-medium">Series A</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Team Size:</span>
                          <span className="font-medium">12 members</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="/contact?subject=Contact LocalMarket">
                      <Button variant="outline" className="text-red-600 border-red-200">
                        Contact
                      </Button>
                    </Link>
                    <Link href="/contact?subject=Inquiry: LocalMarket Startup">
                      <Button className="bg-red-600 hover:bg-red-700">Project Info</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>EduOpen</CardTitle>
                        <CardDescription>Open source educational technology solutions</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Incubation</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src="/placeholder.svg?height=120&width=120&text=Logo"
                          alt="EduOpen Logo"
                          className="rounded-lg w-20 h-20 object-cover"
                        />
                      </div>
                      <div>
                        <p className="mb-2">
                          EduOpen develops open source educational technology solutions including a comprehensive
                          learning management system, interactive lesson content, and assessment tools designed for
                          schools with limited resources.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-gray-100">
                            EdTech
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100">
                            Education
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100">
                            Learning Tools
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">Founded:</span>
                          <span className="font-medium">2023</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Location:</span>
                          <span className="font-medium">Tirupati</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Funding Stage:</span>
                          <span className="font-medium">Pre-seed</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Team Size:</span>
                          <span className="font-medium">5 members</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="/contact?subject=Contact EduOpen">
                      <Button variant="outline" className="text-red-600 border-red-200">
                        Contact
                      </Button>
                    </Link>
                    <Link href="/contact?subject=Inquiry: EduOpen Startup">
                      <Button className="bg-red-600 hover:bg-red-700">Project Info</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>GreenTech</CardTitle>
                        <CardDescription>Open hardware for sustainable agriculture</CardDescription>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pre-Funding</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <img
                          src="/placeholder.svg?height=120&width=120&text=Logo"
                          alt="GreenTech Logo"
                          className="rounded-lg w-20 h-20 object-cover"
                        />
                      </div>
                      <div>
                        <p className="mb-2">
                          GreenTech is developing open hardware solutions for sustainable agriculture, including sensor
                          networks for soil monitoring, automated irrigation systems, and data analytics tools to help
                          farmers optimize resource use.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-gray-100">
                            AgriTech
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100">
                            Open Hardware
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100">
                            Sustainability
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">Founded:</span>
                          <span className="font-medium">2023</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Location:</span>
                          <span className="font-medium">Guntur</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Funding Stage:</span>
                          <span className="font-medium">Concept</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Team Size:</span>
                          <span className="font-medium">3 members</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="/contact?subject=Contact GreenTech">
                      <Button variant="outline" className="text-red-600 border-red-200">
                        Contact
                      </Button>
                    </Link>
                    <Link href="/contact?subject=Inquiry: GreenTech Startup">
                      <Button className="bg-red-600 hover:bg-red-700">Project Info</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <Link href="#startups">
                  <Button variant="outline" className="mt-4 border-red-200 text-red-600">
                    Refresh Startups
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apply" className="mt-6" id="apply">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Rocket className="mr-2 h-6 w-6 text-red-600" />
                FOSStart Funding Programs
              </h3>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
                    <CardTitle>Idea Grant</CardTitle>
                    <CardDescription>For early-stage open source ideas</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-red-600">₹1,00,000</div>
                      <div className="text-sm text-gray-500">Non-equity grant</div>
                    </div>
                    <p className="mb-4">
                      The Idea Grant provides initial funding for promising open source ideas in the concept or
                      prototype stage. This non-equity grant helps entrepreneurs validate their ideas and develop
                      initial prototypes.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Eligibility</h4>
                          <p className="text-sm text-gray-600">
                            Individuals or teams with innovative open source ideas
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Requirements</h4>
                          <p className="text-sm text-gray-600">Commitment to open source principles and licensing</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Support Includes</h4>
                          <p className="text-sm text-gray-600">Funding, mentorship, and workspace access</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/contact?subject=Apply for Idea Grant" className="w-full">
                      <Button className="w-full bg-red-600 hover:bg-red-700">Apply for Idea Grant</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
                    <CardTitle>Seed Investment</CardTitle>
                    <CardDescription>For established open source startups</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-red-600">₹5,00,000</div>
                      <div className="text-sm text-gray-500">Equity investment</div>
                    </div>
                    <p className="mb-4">
                      The Seed Investment program provides equity funding for open source startups that have a working
                      product and initial traction. This investment helps startups scale their solutions and reach more
                      users.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Eligibility</h4>
                          <p className="text-sm text-gray-600">
                            Registered startups with a working open source product
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Requirements</h4>
                          <p className="text-sm text-gray-600">Sustainable business model around open source</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Support Includes</h4>
                          <p className="text-sm text-gray-600">Funding, strategic guidance, and networking</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/contact?subject=Apply for Seed Investment" className="w-full">
                      <Button className="w-full bg-red-600 hover:bg-red-700">Apply for Seed Investment</Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Application Process</CardTitle>
                    <CardDescription>How to apply for FOSStart funding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-red-600 font-bold">1</span>
                        </div>
                        <h4 className="font-medium mb-1">Initial Application</h4>
                        <p className="text-sm text-gray-600">
                          Submit your online application with basic information about your idea or startup
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-red-600 font-bold">2</span>
                        </div>
                        <h4 className="font-medium mb-1">Screening</h4>
                        <p className="text-sm text-gray-600">
                          Our team reviews applications and selects promising candidates for the next stage
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-red-600 font-bold">3</span>
                        </div>
                        <h4 className="font-medium mb-1">Pitch & Interview</h4>
                        <p className="text-sm text-gray-600">
                          Selected candidates present their ideas and answer questions from our panel
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-red-600 font-bold">4</span>
                        </div>
                        <h4 className="font-medium mb-1">Decision & Onboarding</h4>
                        <p className="text-sm text-gray-600">
                          Final selection and onboarding of successful applicants into the FOSStart program
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-red-50 p-8 rounded-lg">
                <h4 className="text-xl font-bold mb-4">Ready to Apply?</h4>
                <p className="mb-6">
                  If you have an open source idea or startup that you'd like to grow with FOSStart support, we encourage
                  you to apply for our funding programs.
                </p>
                <Link href="/contact?subject=FOSStart Application">
                  <Button className="bg-red-600 hover:bg-red-700">Start Your Application</Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6" id="gallery">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Image className="mr-2 h-6 w-6 text-red-600" />
              FOSStart Events & Startups Gallery
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="overflow-hidden rounded-lg bg-gray-100 aspect-video relative group">
                  <img
                    src={`/placeholder.svg?height=450&width=800&text=FOSStart+Event+${item}`}
                    alt={`FOSStart event ${item}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <h4 className="font-medium">FOSStart Event {item}</h4>
                    <p className="text-sm opacity-90">Startup showcase and networking</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/gallery">
                <Button variant="outline" className="mt-4 border-red-200 text-red-600">
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
