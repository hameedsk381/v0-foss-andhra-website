"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Code, DollarSign, Users, BookOpen, Lightbulb, CheckCircle } from "lucide-react"
import { processDonation } from "@/app/actions/donation"

export default function ContributePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Contribute to FOSS Andhra</h1>
        <p className="text-xl text-gray-600 mb-8">
          Join us in promoting free and open source solutions across Andhra Pradesh
        </p>

        <Tabs defaultValue="ways" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ways">Ways to Contribute</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="ways" className="mt-6">
            <div className="prose prose-lg max-w-none mb-8">
              <p>
                FOSS Andhra is a community-driven organization that relies on the contributions of individuals,
                institutions, and organizations who share our vision of promoting free and open source solutions. There
                are many ways you can contribute to our mission and make a difference.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 h-5 w-5 text-blue-600" />
                    Code & Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Contribute your technical skills to our open source projects and initiatives.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Contribute to FOSStorm projects</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Help develop educational resources</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Create documentation and tutorials</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/programs/fosstorm" className="w-full">
                    <Button variant="outline" className="w-full">
                      View Projects
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    Volunteer & Advocate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Share your time and skills to help organize events, conduct workshops, and spread awareness.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Volunteer at FOSS Andhra events</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Conduct workshops and training sessions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Advocate for FOSS adoption in your community</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/contribute/volunteer" className="w-full">
                    <Button variant="outline" className="w-full">
                      Become a Volunteer
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                    Donate & Sponsor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Support our initiatives financially through donations or program sponsorships.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Make a one-time or recurring donation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Sponsor specific programs or events</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Provide in-kind support and resources</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/contribute/donate" className="w-full">
                    <Button variant="outline" className="w-full">
                      Donate Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-bold mb-4">Every Contribution Matters</h3>
              <p className="mb-6">
                Whether you're a developer, educator, student, or simply someone who believes in the power of open
                source, your contribution can make a significant impact on our mission to promote FOSS across Andhra
                Pradesh.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/membership">
                  <Button className="bg-blue-600 hover:bg-blue-700">Become a Member</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-blue-200 text-blue-600">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="volunteer" className="mt-6">
            <div className="prose prose-lg max-w-none mb-8">
              <p>
                Volunteers are the backbone of FOSS Andhra. By volunteering your time, skills, and expertise, you can
                help us organize events, conduct workshops, develop educational materials, and spread awareness about
                free and open source solutions.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Opportunities</CardTitle>
                  <CardDescription>Ways you can contribute your time and skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Education & Training</h4>
                        <p className="text-sm text-gray-600">
                          Conduct workshops, develop training materials, and mentor students in FOSS technologies.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Code className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Technical Support</h4>
                        <p className="text-sm text-gray-600">
                          Provide technical assistance for FOSS implementations, troubleshooting, and system
                          administration.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Event Organization</h4>
                        <p className="text-sm text-gray-600">
                          Help plan, organize, and manage FOSS Andhra events, conferences, and meetups.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Content Creation</h4>
                        <p className="text-sm text-gray-600">
                          Create blog posts, videos, graphics, and social media content to promote FOSS awareness.
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Registration</CardTitle>
                  <CardDescription>Join our volunteer network</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="skills" className="text-sm font-medium">
                        Skills & Expertise
                      </label>
                      <textarea
                        id="skills"
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="What skills can you contribute? (e.g., programming, teaching, design, etc.)"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="interests" className="text-sm font-medium">
                        Areas of Interest
                      </label>
                      <select id="interests" className="w-full p-2 border rounded-md">
                        <option value="">Select an area of interest</option>
                        <option value="education">Education & Training</option>
                        <option value="technical">Technical Support</option>
                        <option value="events">Event Organization</option>
                        <option value="content">Content Creation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="availability" className="text-sm font-medium">
                        Availability
                      </label>
                      <select id="availability" className="w-full p-2 border rounded-md">
                        <option value="">Select your availability</option>
                        <option value="weekends">Weekends Only</option>
                        <option value="weekdays">Weekdays Only</option>
                        <option value="evenings">Evenings Only</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full">
                      Submit Volunteer Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Volunteer Benefits</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">Learning Opportunities</h4>
                  <p className="text-sm text-gray-600">
                    Gain new skills and knowledge through hands-on experience and training.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">Networking</h4>
                  <p className="text-sm text-gray-600">
                    Connect with like-minded individuals, experts, and organizations in the FOSS community.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Heart className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">Make an Impact</h4>
                  <p className="text-sm text-gray-600">
                    Contribute to meaningful change and help build a more open and accessible digital future.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="donate" className="mt-6">
            <div className="prose prose-lg max-w-none mb-8">
              <p>
                Your financial support helps us sustain and expand our programs, organize events, develop educational
                resources, and advocate for free and open source solutions across Andhra Pradesh. As a non-profit
                organization, we rely on donations from individuals and organizations who share our vision.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Donation Options</CardTitle>
                  <CardDescription>Ways you can financially support FOSS Andhra</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Heart className="mr-2 h-4 w-4 text-red-600" />
                        One-Time Donation
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Make a single contribution of any amount to support our general operations or specific programs.
                      </p>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <Button variant="outline" className="text-blue-600">
                          ₹500
                        </Button>
                        <Button variant="outline" className="text-blue-600">
                          ₹1,000
                        </Button>
                        <Button variant="outline" className="text-blue-600">
                          ₹5,000
                        </Button>
                        <Button variant="outline" className="text-blue-600">
                          Custom
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Heart className="mr-2 h-4 w-4 text-red-600" />
                        Monthly Donation
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Set up a recurring monthly donation to provide sustained support for our initiatives.
                      </p>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <Button variant="outline" className="text-blue-600">
                          ₹200/mo
                        </Button>
                        <Button variant="outline" className="text-blue-600">
                          ₹500/mo
                        </Button>
                        <Button variant="outline" className="text-blue-600">
                          ₹1,000/mo
                        </Button>
                        <Button variant="outline" className="text-blue-600">
                          Custom
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Heart className="mr-2 h-4 w-4 text-red-600" />
                        Program Sponsorship
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Sponsor specific FOSS Andhra programs, events, or initiatives with targeted funding.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>FOSStar Membership Program</span>
                          <Button variant="outline" size="sm" className="text-blue-600">
                            Sponsor
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>FOSServe Educational Initiatives</span>
                          <Button variant="outline" size="sm" className="text-blue-600">
                            Sponsor
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>FOSStorm Project Development</span>
                          <Button variant="outline" size="sm" className="text-blue-600">
                            Sponsor
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Annual FOSS Andhra Conference</span>
                          <Button variant="outline" size="sm" className="text-blue-600">
                            Sponsor
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Donate</CardTitle>
                  <CardDescription>Make a donation in just a few clicks</CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={processDonation} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="donationType" className="text-sm font-medium">
                        Donation Type
                      </label>
                      <select name="donationType" id="donationType" className="w-full p-2 border rounded-md" required>
                        <option value="oneTime">One-Time Donation</option>
                        <option value="monthly">Monthly Donation</option>
                        <option value="program">Program Sponsorship</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="amount" className="text-sm font-medium">
                        Amount (₹100 - ₹100,000)
                      </label>
                      <input
                        name="amount"
                        id="amount"
                        type="number"
                        min="100"
                        max="100000"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter donation amount"
                        required
                      />
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        <button
                          type="button"
                          className="p-2 border rounded text-blue-600 hover:bg-blue-50"
                          onClick={(e) => {
                            e.preventDefault()
                            const amountInput = document.getElementById("amount") as HTMLInputElement
                            if (amountInput) amountInput.value = "500"
                          }}
                        >
                          ₹500
                        </button>
                        <button
                          type="button"
                          className="p-2 border rounded text-blue-600 hover:bg-blue-50"
                          onClick={(e) => {
                            e.preventDefault()
                            const amountInput = document.getElementById("amount") as HTMLInputElement
                            if (amountInput) amountInput.value = "1000"
                          }}
                        >
                          ₹1,000
                        </button>
                        <button
                          type="button"
                          className="p-2 border rounded text-blue-600 hover:bg-blue-50"
                          onClick={(e) => {
                            e.preventDefault()
                            const amountInput = document.getElementById("amount") as HTMLInputElement
                            if (amountInput) amountInput.value = "5000"
                          }}
                        >
                          ₹5,000
                        </button>
                        <button
                          type="button"
                          className="p-2 border rounded text-blue-600 hover:bg-blue-50"
                          onClick={(e) => {
                            e.preventDefault()
                            const amountInput = document.getElementById("amount") as HTMLInputElement
                            if (amountInput) amountInput.value = "10000"
                          }}
                        >
                          ₹10,000
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <input
                        name="name"
                        id="name"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <input
                        name="email"
                        id="email"
                        type="email"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        id="phone"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div className="flex items-start">
                      <input type="checkbox" name="anonymous" value="true" id="anonymous" className="mt-1 mr-2" />
                      <label htmlFor="anonymous" className="text-sm">
                        Make this donation anonymous
                      </label>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Proceed to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">How Your Donation Helps</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">Educational Programs</h4>
                  <p className="text-sm text-gray-600">
                    Fund workshops, training sessions, and educational resources to promote FOSS literacy.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Code className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">Project Development</h4>
                  <p className="text-sm text-gray-600">
                    Support the development of open source projects that address local needs and challenges.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">Community Building</h4>
                  <p className="text-sm text-gray-600">
                    Help organize events, meetups, and conferences that bring the FOSS community together.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="mt-6">
            <div className="prose prose-lg max-w-none mb-8">
              <p>
                FOSS Andhra collaborates with a diverse range of partners including educational institutions, government
                bodies, businesses, and other non-profit organizations to advance our mission of promoting free and open
                source solutions. Our partners provide valuable support, resources, and expertise that help us expand
                our reach and impact.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Current Partners</CardTitle>
                  <CardDescription>Organizations supporting our mission</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=100&width=150&text=Partner+Logo"
                          alt="Partner Logo"
                          className="max-h-full max-w-full"
                        />
                      </div>
                      <h4 className="font-medium">Andhra University</h4>
                      <p className="text-sm text-gray-600">Educational Partner</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=100&width=150&text=Partner+Logo"
                          alt="Partner Logo"
                          className="max-h-full max-w-full"
                        />
                      </div>
                      <h4 className="font-medium">Tech Innovators</h4>
                      <p className="text-sm text-gray-600">Technology Partner</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=100&width=150&text=Partner+Logo"
                          alt="Partner Logo"
                          className="max-h-full max-w-full"
                        />
                      </div>
                      <h4 className="font-medium">AP IT Department</h4>
                      <p className="text-sm text-gray-600">Government Partner</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=100&width=150&text=Partner+Logo"
                          alt="Partner Logo"
                          className="max-h-full max-w-full"
                        />
                      </div>
                      <h4 className="font-medium">Open Source Foundation</h4>
                      <p className="text-sm text-gray-600">Non-Profit Partner</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">View All Partners</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Become a Partner</CardTitle>
                  <CardDescription>Collaborate with FOSS Andhra</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Partnership Benefits</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Access to FOSS expertise and implementation support</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Co-branding opportunities at events and programs</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Networking with the broader FOSS community</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Collaborative project development opportunities</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Partnership Types</h4>
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h5 className="font-medium text-sm">Educational Partners</h5>
                          <p className="text-xs text-gray-600">
                            Schools, colleges, and universities interested in promoting FOSS education
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h5 className="font-medium text-sm">Technology Partners</h5>
                          <p className="text-xs text-gray-600">
                            Tech companies and startups supporting open source development
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h5 className="font-medium text-sm">Government Partners</h5>
                          <p className="text-xs text-gray-600">
                            Government departments and agencies adopting FOSS solutions
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h5 className="font-medium text-sm">Non-Profit Partners</h5>
                          <p className="text-xs text-gray-600">Organizations with aligned missions and goals</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/contact" className="w-full">
                    <Button className="w-full">Inquire About Partnership</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Partner Success Stories</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white p-6 rounded-lg">
                  <h4 className="font-medium mb-2">Andhra University FOSS Transition</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Our partnership with Andhra University led to a successful transition to open source solutions
                    across their computer science department, resulting in significant cost savings and enhanced
                    learning opportunities for students.
                  </p>
                  <Button variant="outline" size="sm">
                    Read Case Study
                  </Button>
                </div>

                <div className="bg-white p-6 rounded-lg">
                  <h4 className="font-medium mb-2">AP Rural Development FOSS Implementation</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Working with the AP Rural Development Department, we implemented open source solutions for document
                    management and citizen services, improving efficiency and transparency.
                  </p>
                  <Button variant="outline" size="sm">
                    Read Case Study
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
