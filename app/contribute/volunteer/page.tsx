"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Users, CheckCircle, Send } from "lucide-react"

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    skills: "",
    interests: "",
    availability: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const skillAreas = [
    "Software Development",
    "Web Development",
    "System Administration",
    "Documentation",
    "Translation",
    "Graphic Design",
    "Event Organization",
    "Public Speaking",
    "Content Writing",
    "Social Media",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          skills: "",
          interests: "",
          availability: "",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to submit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#98d339] rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Thank You for Volunteering!</h2>
            <p className="text-muted-foreground mb-8">
              We've received your application. Our team will review it and get in touch with you soon.
            </p>
            <div className="space-y-3">
              <Link href="/contribute">
                <Button className="w-full" style={{ backgroundColor: '#015ba7' }}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Contribute
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/contribute">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contribute
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#98d339] rounded-full mb-4">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Volunteer with Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our community of volunteers making a difference in promoting FOSS across Andhra Pradesh
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Registration</CardTitle>
                  <CardDescription>
                    Fill in your details and we'll get in touch with volunteer opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    {/* Skills */}
                    <div>
                      <Label htmlFor="skills">Skills & Expertise *</Label>
                      <Textarea
                        id="skills"
                        required
                        placeholder="e.g., Python, Java, Event Management, Content Writing..."
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {/* Interests */}
                    <div>
                      <Label htmlFor="interests">Areas of Interest *</Label>
                      <Textarea
                        id="interests"
                        required
                        placeholder="What aspects of FOSS work interest you most?"
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {/* Availability */}
                    <div>
                      <Label htmlFor="availability">Availability *</Label>
                      <Textarea
                        id="availability"
                        required
                        placeholder="e.g., Weekends, Evenings, 10 hours/week..."
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        rows={2}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 text-lg"
                      style={{ backgroundColor: '#98d339' }}
                    >
                      {loading ? "Submitting..." : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-[#015ba7] text-white border-0">
                <CardHeader>
                  <CardTitle className="text-white">Why Volunteer?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#98d339]" />
                    <div>
                      <div className="font-semibold">Make an Impact</div>
                      <div className="text-sm text-blue-100">Promote FOSS adoption in your community</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#98d339]" />
                    <div>
                      <div className="font-semibold">Learn & Grow</div>
                      <div className="text-sm text-blue-100">Develop new skills and expertise</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#98d339]" />
                    <div>
                      <div className="font-semibold">Network</div>
                      <div className="text-sm text-blue-100">Connect with like-minded individuals</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Common Skills Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillAreas.map((skill) => (
                      <div key={skill} className="text-xs bg-muted px-3 py-1 rounded-full">
                        {skill}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Questions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Have questions about volunteering? Get in touch with us.
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
