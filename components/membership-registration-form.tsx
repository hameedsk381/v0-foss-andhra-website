"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RazorpayCheckout } from "./razorpay-checkout"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ArrowLeft, CheckCircle, PartyPopper } from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  organization: string
  designation: string
  experience: string
  interests: string
  referral: string
  agreeTerms: boolean
}

export function MembershipRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    experience: "",
    interests: "",
    referral: "",
    agreeTerms: false,
  })

  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "success">("form")
  const [membershipId, setMembershipId] = useState<string>("")

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields")
      return
    }

    // Move to payment step
    setCurrentStep("payment")
  }

  const handleBackToForm = () => {
    setCurrentStep("form")
  }

  const handlePaymentSuccess = (membershipId: string) => {
    setMembershipId(membershipId)
    setCurrentStep("success")
  }

  const isFormValid = formData.name && formData.email && formData.phone && formData.agreeTerms

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatedSection variant="fadeUp">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${currentStep === "form" ? "text-fosstar" : "text-green-600"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "form" ? "bg-fosstar text-white" : "bg-green-600 text-white"
                  }`}
              >
                {currentStep !== "form" ? <CheckCircle className="w-5 h-5" /> : "1"}
              </div>
              <span className="font-medium">Registration</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep !== "form" ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "payment"
                ? "text-fosstar"
                : currentStep === "success"
                  ? "text-green-600"
                  : "text-gray-400"
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "payment"
                  ? "bg-fosstar text-white"
                  : currentStep === "success"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                  }`}
              >
                {currentStep === "success" ? <CheckCircle className="w-5 h-5" /> : "2"}
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep === "success" ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "success" ? "text-fosstar" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "success" ? "bg-fosstar text-white" : "bg-gray-300 text-gray-600"
                  }`}
              >
                {currentStep === "success" ? <PartyPopper className="w-5 h-5" /> : "3"}
              </div>
              <span className="font-medium">Complete</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-fosstar">
              {currentStep === "form" && "FOSStar Membership Registration"}
              {currentStep === "payment" && "Complete Your Payment"}
              {currentStep === "success" && "🎉 Welcome to FOSS Andhra!"}
            </CardTitle>
            <CardDescription>
              {currentStep === "form" && "Join the FOSS Andhra community for just ₹300/year"}
              {currentStep === "payment" && "Secure payment to activate your membership"}
              {currentStep === "success" && "Your membership has been successfully activated"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization/Institution</Label>
                      <Input
                        id="organization"
                        type="text"
                        value={formData.organization}
                        onChange={(e) => handleInputChange("organization", e.target.value)}
                        placeholder="Your organization name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation/Role</Label>
                      <Input
                        id="designation"
                        type="text"
                        value={formData.designation}
                        onChange={(e) => handleInputChange("designation", e.target.value)}
                        placeholder="Your current role"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">FOSS Experience Level</Label>
                    <Select onValueChange={(value) => handleInputChange("experience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                        <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Interests and Additional Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Areas of Interest in FOSS</Label>
                    <Textarea
                      id="interests"
                      value={formData.interests}
                      onChange={(e) => handleInputChange("interests", e.target.value)}
                      placeholder="Tell us about your interests in open source (e.g., development, advocacy, education)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referral">How did you hear about us?</Label>
                    <Select onValueChange={(value) => handleInputChange("referral", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select referral source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="friend">Friend/Colleague</SelectItem>
                        <SelectItem value="event">Event/Conference</SelectItem>
                        <SelectItem value="search">Search Engine</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked: boolean | "indeterminate") => handleInputChange("agreeTerms", checked === true)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <a href="/terms-of-service" className="text-fosstar hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy-policy" className="text-fosstar hover:underline">
                        Privacy Policy
                      </a>
                      . I understand that my membership fee of ₹300 is non-refundable and valid for one year.
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-fosstar hover:bg-fosstar/90" disabled={!isFormValid}>
                  Continue to Payment →
                </Button>
              </form>
            ) : currentStep === "payment" ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Your Registration</h3>
                  <p className="text-gray-600">Please review your details and complete the payment</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4 text-fosstar">Registration Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="mb-2">
                        <strong>Name:</strong> {formData.name}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {formData.email}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {formData.phone}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2">
                        <strong>Organization:</strong> {formData.organization || "Not specified"}
                      </p>
                      <p className="mb-2">
                        <strong>Experience:</strong> {formData.experience || "Not specified"}
                      </p>
                      <p className="mb-2">
                        <strong>Membership:</strong> FOSStar Annual
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-fosstar">₹300</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleBackToForm}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Form
                  </Button>
                  <RazorpayCheckout
                    membershipType="FOSStar Annual"
                    amount={300}
                    userDetails={{
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone,
                    }}
                    additionalData={formData}
                    onSuccess={handlePaymentSuccess}
                    className="flex-1 bg-fosstar hover:bg-fosstar/90"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="bg-green-50 p-6 rounded-lg">
                  <PartyPopper className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Membership Activated!</h3>
                  <p className="text-green-700 mb-4">
                    Congratulations! Your FOSStar membership has been successfully activated.
                  </p>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-600 mb-2">Your Membership ID:</p>
                    <p className="text-lg font-mono font-bold text-fosstar">{membershipId}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">What's Next?</h4>
                  <ul className="text-left space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>You'll receive a confirmation email with your membership details</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Access to members-only forums and resources</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Invitations to upcoming FOSS Andhra events</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Connect with the FOSS community in Andhra Pradesh</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="flex-1 bg-fosstar hover:bg-fosstar/90"
                  >
                    Go to Homepage
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/programs/fosstar")}
                    className="flex-1"
                  >
                    Back to FOSStar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  )
}
