"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, MessageSquare, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "",
  })

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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-8">
          Get in touch with us for inquiries, support, or collaboration opportunities
        </p>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Send us an email and we'll get back to you within 24-48 hours.</p>
              <a href="mailto:info@fossandhra.org" className="text-blue-600 font-medium block mt-2 hover:underline">
                info@fossandhra.org
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-blue-600" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Call us during business hours (9 AM - 5 PM, Monday to Friday).</p>
              <a href="tel:+918000000000" className="text-blue-600 font-medium block mt-2 hover:underline">
                +91 8000000000
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Visit our office in Visakhapatnam, Andhra Pradesh.</p>
              <address className="not-italic text-blue-600 font-medium block mt-2">
                FOSS Andhra, Tech Hub
                <br />
                Visakhapatnam, Andhra Pradesh
                <br />
                India - 530003
              </address>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
                    <p className="text-green-700 mb-6">
                      Thank you for contacting FOSS Andhra. We'll get back to you shortly.
                    </p>
                    <Button onClick={() => setFormSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inquiryType">Inquiry Type</Label>
                        <Select
                          value={formData.inquiryType}
                          onValueChange={(value) => handleSelectChange("inquiryType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="membership">Membership Information</SelectItem>
                            <SelectItem value="programs">Program Information</SelectItem>
                            <SelectItem value="volunteer">Volunteer Opportunities</SelectItem>
                            <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Enter the subject of your message"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Enter your message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Find Us</CardTitle>
                <CardDescription>Our office location in Visakhapatnam, Andhra Pradesh</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 rounded-lg h-[300px] flex items-center justify-center mb-4">
                  <p className="text-gray-600">Map will be displayed here</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Office Hours</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Monday - Friday:</span>
                    </div>
                    <div>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Saturday:</span>
                    </div>
                    <div>
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Sunday:</span>
                    </div>
                    <div>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Get Directions
                </Button>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">How can I become a member of FOSS Andhra?</h4>
                    <p className="text-sm text-gray-600">
                      You can register for membership through our FOSStar program. Visit the Membership page for
                      details.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Do you provide technical support for FOSS implementations?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, we offer technical support through our FOSServe program for educational institutions and
                      government bodies.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">How can I volunteer with FOSS Andhra?</h4>
                    <p className="text-sm text-gray-600">
                      Visit our Contribute page and fill out the volunteer registration form to join our volunteer
                      network.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full">
                  View All FAQs
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
