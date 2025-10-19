"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Users, Star, BookOpen, Rocket } from "lucide-react"

export default function MembershipPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    membershipType: "",
    interests: "",
    skills: "",
    referrer: "",
  })

  const [formSubmitted, setFormSubmitted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (formSubmitted) {
      router.replace("/register")
    }
  }, [formSubmitted, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to your backend or API here
    console.log("Form submitted:", formData)
    setFormSubmitted(true)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {formSubmitted ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fosstar mx-auto mb-4"></div>
              <p>Redirecting to registration...</p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-2">FOSStar Membership Program</h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of open source enthusiasts and help us promote free and open source solutions.
            </p>

            <Tabs defaultValue="benefits" className="mb-12">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="benefits">Membership Benefits</TabsTrigger>
                <TabsTrigger value="types">Membership Types</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="benefits" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-5 w-5 text-blue-600" />
                        Community Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Connect with a network of FOSS enthusiasts and experts</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Participate in exclusive community events and meetups</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Collaborate on community projects and initiatives</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                        Learning Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Access to workshops, seminars, and training sessions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Mentorship opportunities from experienced FOSS contributors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Early access to educational resources and materials</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="mr-2 h-5 w-5 text-blue-600" />
                        Recognition & Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Opportunities to showcase your FOSS contributions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Support for personal FOSS projects and initiatives</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Certifications and credentials for your FOSS contributions</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Rocket className="mr-2 h-5 w-5 text-blue-600" />
                        Impact & Influence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Help shape the future of FOSS adoption in Andhra</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Participate in policy advocacy for open source adoption</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Represent FOSS Andhra at regional and national events</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="types" className="mt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Member</CardTitle>
                      <CardDescription>For students interested in FOSS</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">
                        ₹500<span className="text-sm font-normal text-gray-500">/year</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Access to community forums</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Invitations to student events</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Basic learning resources</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Student mentorship program</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSelectChange("membershipType", "student")}>
                        Select
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="border-blue-200 shadow-md">
                    <CardHeader className="bg-blue-50">
                      <div className="text-center text-blue-600 text-sm font-medium mb-1">POPULAR</div>
                      <CardTitle>Professional Member</CardTitle>
                      <CardDescription>For working professionals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">
                        ₹2000<span className="text-sm font-normal text-gray-500">/year</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>All Student benefits</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Voting rights in community decisions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Advanced workshops & training</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Project collaboration opportunities</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>FOSS certification program</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSelectChange("membershipType", "professional")}>
                        Select
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Institutional Member</CardTitle>
                      <CardDescription>For organizations and institutions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">
                        ₹10,000<span className="text-sm font-normal text-gray-500">/year</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>All Professional benefits</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Up to 10 member accounts</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>On-site training for your team</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Custom FOSS implementation support</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Logo on our website & events</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handleSelectChange("membershipType", "institutional")}>
                        Select
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Registration</CardTitle>
                    <CardDescription>
                      Join the FOSS Andhra community by filling out this registration form.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization/Institution</Label>
                          <Input
                            id="organization"
                            name="organization"
                            placeholder="Enter your organization or institution"
                            value={formData.organization}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="membershipType">Membership Type</Label>
                        <Select
                          value={formData.membershipType}
                          onValueChange={(value) => handleSelectChange("membershipType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your membership type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student Member (₹500/year)</SelectItem>
                            <SelectItem value="professional">Professional Member (₹2000/year)</SelectItem>
                            <SelectItem value="institutional">Institutional Member (₹10,000/year)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interests">Areas of Interest</Label>
                        <Textarea
                          id="interests"
                          name="interests"
                          placeholder="What FOSS technologies or areas are you most interested in?"
                          value={formData.interests}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills & Expertise</Label>
                        <Textarea
                          id="skills"
                          name="skills"
                          placeholder="What skills or expertise can you contribute to the community?"
                          value={formData.skills}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="referrer">How did you hear about us?</Label>
                        <Input
                          id="referrer"
                          name="referrer"
                          placeholder="Friend, social media, event, etc."
                          value={formData.referrer}
                          onChange={handleChange}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Submit Registration
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
