"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RazorpayCheckout } from "@/components/razorpay-checkout"
import { AnimatedSection } from "@/components/ui/animated-section"
import { ArrowLeft, CheckCircle, PartyPopper, GraduationCap, Users, Building, Briefcase, Heart } from "lucide-react"

interface BaseFormData {
  name: string
  email: string
  phone: string
  agreeTerms: boolean
}

interface StudentFormData extends BaseFormData {
  institution: string
  course: string
  year: string
  studentId: string
  interests: string
  experience: string
  projects: string
}

interface TeacherFormData extends BaseFormData {
  institution: string
  department: string
  designation: string
  experience: string
  subjects: string
  fossUsage: string
  trainingInterest: string
}

interface InstitutionFormData extends BaseFormData {
  institutionName: string
  institutionType: string
  address: string
  contactPerson: string
  designation: string
  studentCount: string
  currentSoftware: string
  migrationGoals: string
  timeline: string
}

interface ProfessionalFormData extends BaseFormData {
  company: string
  designation: string
  experience: string
  skills: string
  interests: string
  contribution: string
  availability: string
}

interface CompanyFormData extends BaseFormData {
  companyName: string
  industry: string
  size: string
  website: string
  contactPerson: string
  designation: string
  fossUsage: string
  goals: string
  partnership: string
}

interface NGOFormData extends BaseFormData {
  organizationName: string
  focusArea: string
  website: string
  contactPerson: string
  designation: string
  beneficiaries: string
  techNeeds: string
  collaboration: string
}

type AudienceType = "student" | "teacher" | "institution" | "professional" | "company" | "ngo"

const audienceConfig = {
  student: {
    title: "Student Registration",
    description: "Join as a student member and kickstart your FOSS journey",
    icon: GraduationCap,
    price: 300,
    color: "text-blue-600",
  },
  teacher: {
    title: "Teacher Registration",
    description: "Empower your students with FOSS education",
    icon: Users,
    price: 500,
    color: "text-green-600",
  },
  institution: {
    title: "Educational Institution Registration",
    description: "Transform your institution with FOSS solutions",
    icon: Building,
    price: 5000,
    color: "text-purple-600",
  },
  professional: {
    title: "Professional Registration",
    description: "Advance your career with FOSS expertise",
    icon: Briefcase,
    price: 1000,
    color: "text-orange-600",
  },
  company: {
    title: "Company Registration",
    description: "Leverage FOSS for business growth",
    icon: Building,
    price: 10000,
    color: "text-red-600",
  },
  ngo: {
    title: "NGO Registration",
    description: "Use FOSS to amplify your social impact",
    icon: Heart,
    price: 2000,
    color: "text-pink-600",
  },
}

export function AudienceSpecificForms() {
  const [selectedAudience, setSelectedAudience] = useState<AudienceType | null>(null)
  const [currentStep, setCurrentStep] = useState<"audience" | "form" | "payment" | "success">("audience")
  const [membershipId, setMembershipId] = useState<string>("")

  // Form data states for each audience
  const [studentData, setStudentData] = useState<StudentFormData>({
    name: "",
    email: "",
    phone: "",
    agreeTerms: false,
    institution: "",
    course: "",
    year: "",
    studentId: "",
    interests: "",
    experience: "",
    projects: "",
  })

  const [teacherData, setTeacherData] = useState<TeacherFormData>({
    name: "",
    email: "",
    phone: "",
    agreeTerms: false,
    institution: "",
    department: "",
    designation: "",
    experience: "",
    subjects: "",
    fossUsage: "",
    trainingInterest: "",
  })

  const [institutionData, setInstitutionData] = useState<InstitutionFormData>({
    name: "",
    email: "",
    phone: "",
    agreeTerms: false,
    institutionName: "",
    institutionType: "",
    address: "",
    contactPerson: "",
    designation: "",
    studentCount: "",
    currentSoftware: "",
    migrationGoals: "",
    timeline: "",
  })

  const [professionalData, setProfessionalData] = useState<ProfessionalFormData>({
    name: "",
    email: "",
    phone: "",
    agreeTerms: false,
    company: "",
    designation: "",
    experience: "",
    skills: "",
    interests: "",
    contribution: "",
    availability: "",
  })

  const [companyData, setCompanyData] = useState<CompanyFormData>({
    name: "",
    email: "",
    phone: "",
    agreeTerms: false,
    companyName: "",
    industry: "",
    size: "",
    website: "",
    contactPerson: "",
    designation: "",
    fossUsage: "",
    goals: "",
    partnership: "",
  })

  const [ngoData, setNGOData] = useState<NGOFormData>({
    name: "",
    email: "",
    phone: "",
    agreeTerms: false,
    organizationName: "",
    focusArea: "",
    website: "",
    contactPerson: "",
    designation: "",
    beneficiaries: "",
    techNeeds: "",
    collaboration: "",
  })

  const handleAudienceSelect = (audience: AudienceType) => {
    setSelectedAudience(audience)
    setCurrentStep("form")
  }

  const handleBackToAudience = () => {
    setCurrentStep("audience")
    setSelectedAudience(null)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("payment")
  }

  const handlePaymentSuccess = (membershipId: string) => {
    setMembershipId(membershipId)
    setCurrentStep("success")
  }

  const getCurrentFormData = () => {
    switch (selectedAudience) {
      case "student":
        return studentData
      case "teacher":
        return teacherData
      case "institution":
        return institutionData
      case "professional":
        return professionalData
      case "company":
        return companyData
      case "ngo":
        return ngoData
      default:
        return { name: "", email: "", phone: "", agreeTerms: false }
    }
  }

  const isFormValid = () => {
    const data = getCurrentFormData()
    return data.name && data.email && data.phone && data.agreeTerms
  }

  if (currentStep === "audience") {
    return (
      <div className="max-w-6xl mx-auto">
        <AnimatedSection variant="fadeUp">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Registration Type</h1>
            <p className="text-xl text-gray-600">
              Select the category that best describes you to get a customized registration experience
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(audienceConfig).map(([key, config]) => {
              const IconComponent = config.icon
              return (
                <Card
                  key={key}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
                  onClick={() => handleAudienceSelect(key as AudienceType)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
                      <IconComponent className={`w-8 h-8 ${config.color}`} />
                    </div>
                    <CardTitle className="text-xl">{config.title}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-fosstar mb-4">₹{config.price.toLocaleString()}/year</div>
                    <Button className="w-full">Register Now</Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </AnimatedSection>
      </div>
    )
  }

  if (!selectedAudience) return null

  const config = audienceConfig[selectedAudience]
  const IconComponent = config.icon

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedSection variant="fadeUp">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="font-medium">Audience</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep !== "form" ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "form" ? "text-fosstar" : currentStep === "payment" || currentStep === "success" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "form" ? "bg-fosstar text-white" : currentStep === "payment" || currentStep === "success" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}
              >
                {currentStep === "payment" || currentStep === "success" ? <CheckCircle className="w-5 h-5" /> : "2"}
              </div>
              <span className="font-medium">Registration</span>
            </div>
            <div
              className={`w-16 h-0.5 ${currentStep === "payment" || currentStep === "success" ? "bg-green-600" : "bg-gray-300"}`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "payment" ? "text-fosstar" : currentStep === "success" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "payment" ? "bg-fosstar text-white" : currentStep === "success" ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}
              >
                {currentStep === "success" ? <CheckCircle className="w-5 h-5" /> : "3"}
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep === "success" ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "success" ? "text-fosstar" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "success" ? "bg-fosstar text-white" : "bg-gray-300 text-gray-600"}`}
              >
                {currentStep === "success" ? <PartyPopper className="w-5 h-5" /> : "4"}
              </div>
              <span className="font-medium">Complete</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
              <IconComponent className={`w-8 h-8 ${config.color}`} />
            </div>
            <CardTitle className="text-2xl text-fosstar">
              {currentStep === "form" && config.title}
              {currentStep === "payment" && "Complete Your Payment"}
              {currentStep === "success" && "🎉 Welcome to FOSS Andhra!"}
            </CardTitle>
            <CardDescription>
              {currentStep === "form" && config.description}
              {currentStep === "payment" && "Secure payment to activate your membership"}
              {currentStep === "success" && "Your membership has been successfully activated"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === "form" && (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {selectedAudience === "student" && <StudentForm data={studentData} setData={setStudentData} />}
                {selectedAudience === "teacher" && <TeacherForm data={teacherData} setData={setTeacherData} />}
                {selectedAudience === "institution" && (
                  <InstitutionForm data={institutionData} setData={setInstitutionData} />
                )}
                {selectedAudience === "professional" && (
                  <ProfessionalForm data={professionalData} setData={setProfessionalData} />
                )}
                {selectedAudience === "company" && <CompanyForm data={companyData} setData={setCompanyData} />}
                {selectedAudience === "ngo" && <NGOForm data={ngoData} setData={setNGOData} />}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={handleBackToAudience} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Selection
                  </Button>
                  <Button type="submit" className="flex-1 bg-fosstar hover:bg-fosstar/90" disabled={!isFormValid()}>
                    Continue to Payment →
                  </Button>
                </div>
              </form>
            )}

            {currentStep === "payment" && (
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
                        <strong>Name:</strong> {getCurrentFormData().name}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {getCurrentFormData().email}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {getCurrentFormData().phone}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2">
                        <strong>Type:</strong> {config.title}
                      </p>
                      <p className="mb-2">
                        <strong>Membership:</strong> FOSStar Annual
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-fosstar">₹{config.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep("form")} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Form
                  </Button>
                  <RazorpayCheckout
                    membershipType={`FOSStar ${selectedAudience}`}
                    amount={config.price}
                    userDetails={{
                      name: getCurrentFormData().name,
                      email: getCurrentFormData().email,
                      phone: getCurrentFormData().phone,
                    }}
                    onSuccess={handlePaymentSuccess}
                    className="flex-1 bg-fosstar hover:bg-fosstar/90"
                  />
                </div>
              </div>
            )}

            {currentStep === "success" && (
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

// Individual form components for each audience
function StudentForm({ data, setData }: { data: StudentFormData; setData: (data: StudentFormData) => void }) {
  const handleChange = (field: keyof StudentFormData, value: string | boolean) => {
    setData({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>
      </div>

      {/* Academic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution/College *</Label>
            <Input
              id="institution"
              value={data.institution}
              onChange={(e) => handleChange("institution", e.target.value)}
              placeholder="Your college/university name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course/Program *</Label>
            <Input
              id="course"
              value={data.course}
              onChange={(e) => handleChange("course", e.target.value)}
              placeholder="e.g., B.Tech Computer Science"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Current Year</Label>
            <Select onValueChange={(value) => handleChange("year", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your current year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
                <SelectItem value="postgrad">Post Graduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={data.studentId}
              onChange={(e) => handleChange("studentId", e.target.value)}
              placeholder="Your student ID number"
            />
          </div>
        </div>
      </div>

      {/* FOSS Interest */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">FOSS Interest & Experience</h3>
        <div className="space-y-2">
          <Label htmlFor="interests">Areas of Interest in FOSS</Label>
          <Textarea
            id="interests"
            value={data.interests}
            onChange={(e) => handleChange("interests", e.target.value)}
            placeholder="What aspects of FOSS interest you? (e.g., development, documentation, community building)"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">FOSS Experience Level</Label>
          <Select onValueChange={(value) => handleChange("experience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (Just getting started)</SelectItem>
              <SelectItem value="intermediate">Intermediate (Some experience)</SelectItem>
              <SelectItem value="advanced">Advanced (Regular contributor)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="projects">Previous Projects/Contributions</Label>
          <Textarea
            id="projects"
            value={data.projects}
            onChange={(e) => handleChange("projects", e.target.value)}
            placeholder="Tell us about any FOSS projects you've worked on or contributed to"
            rows={3}
          />
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={data.agreeTerms}
          onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm leading-relaxed">
          I agree to the Terms of Service and Privacy Policy. I understand that my membership fee of ₹300 is
          non-refundable and valid for one year.
        </Label>
      </div>
    </div>
  )
}

function TeacherForm({ data, setData }: { data: TeacherFormData; setData: (data: TeacherFormData) => void }) {
  const handleChange = (field: keyof TeacherFormData, value: string | boolean) => {
    setData({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
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
            <Label htmlFor="institution">Institution/School *</Label>
            <Input
              id="institution"
              value={data.institution}
              onChange={(e) => handleChange("institution", e.target.value)}
              placeholder="Your institution name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={data.department}
              onChange={(e) => handleChange("department", e.target.value)}
              placeholder="e.g., Computer Science, Mathematics"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Select onValueChange={(value) => handleChange("designation", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assistant-professor">Assistant Professor</SelectItem>
                <SelectItem value="associate-professor">Associate Professor</SelectItem>
                <SelectItem value="professor">Professor</SelectItem>
                <SelectItem value="lecturer">Lecturer</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Teaching Experience</Label>
            <Select onValueChange={(value) => handleChange("experience", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Years of experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">0-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* FOSS Teaching */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">FOSS in Education</h3>
        <div className="space-y-2">
          <Label htmlFor="subjects">Subjects You Teach</Label>
          <Textarea
            id="subjects"
            value={data.subjects}
            onChange={(e) => handleChange("subjects", e.target.value)}
            placeholder="List the subjects you currently teach"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fossUsage">Current FOSS Usage in Teaching</Label>
          <Textarea
            id="fossUsage"
            value={data.fossUsage}
            onChange={(e) => handleChange("fossUsage", e.target.value)}
            placeholder="How do you currently use FOSS tools in your teaching?"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trainingInterest">Training Interests</Label>
          <Textarea
            id="trainingInterest"
            value={data.trainingInterest}
            onChange={(e) => handleChange("trainingInterest", e.target.value)}
            placeholder="What FOSS training or workshops would interest you?"
            rows={3}
          />
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={data.agreeTerms}
          onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm leading-relaxed">
          I agree to the Terms of Service and Privacy Policy. I understand that my membership fee of ₹500 is
          non-refundable and valid for one year.
        </Label>
      </div>
    </div>
  )
}

function InstitutionForm({
  data,
  setData,
}: { data: InstitutionFormData; setData: (data: InstitutionFormData) => void }) {
  const handleChange = (field: keyof InstitutionFormData, value: string | boolean) => {
    setData({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Contact Person Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Primary contact person"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Official Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Official institution email"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Contact Number *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Primary contact number"
            required
          />
        </div>
      </div>

      {/* Institution Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Institution Details</h3>
        <div className="space-y-2">
          <Label htmlFor="institutionName">Institution Name *</Label>
          <Input
            id="institutionName"
            value={data.institutionName}
            onChange={(e) => handleChange("institutionName", e.target.value)}
            placeholder="Full name of your institution"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionType">Institution Type</Label>
            <Select onValueChange={(value) => handleChange("institutionType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select institution type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="research">Research Institute</SelectItem>
                <SelectItem value="training">Training Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentCount">Student Count</Label>
            <Select onValueChange={(value) => handleChange("studentCount", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Number of students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-500">0-500</SelectItem>
                <SelectItem value="500-1000">500-1000</SelectItem>
                <SelectItem value="1000-5000">1000-5000</SelectItem>
                <SelectItem value="5000+">5000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Institution Address</Label>
          <Textarea
            id="address"
            value={data.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Complete address of the institution"
            rows={2}
          />
        </div>
      </div>

      {/* FOSS Implementation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">FOSS Implementation</h3>
        <div className="space-y-2">
          <Label htmlFor="currentSoftware">Current Software Usage</Label>
          <Textarea
            id="currentSoftware"
            value={data.currentSoftware}
            onChange={(e) => handleChange("currentSoftware", e.target.value)}
            placeholder="What software systems do you currently use?"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="migrationGoals">FOSS Migration Goals</Label>
          <Textarea
            id="migrationGoals"
            value={data.migrationGoals}
            onChange={(e) => handleChange("migrationGoals", e.target.value)}
            placeholder="What are your goals for implementing FOSS solutions?"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeline">Implementation Timeline</Label>
          <Select onValueChange={(value) => handleChange("timeline", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Expected timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
              <SelectItem value="short">Short term (3-6 months)</SelectItem>
              <SelectItem value="medium">Medium term (6-12 months)</SelectItem>
              <SelectItem value="long">Long term (1+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={data.agreeTerms}
          onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm leading-relaxed">
          I agree to the Terms of Service and Privacy Policy. I understand that the institutional membership fee of
          ₹5,000 is non-refundable and valid for one year.
        </Label>
      </div>
    </div>
  )
}

function ProfessionalForm({
  data,
  setData,
}: { data: ProfessionalFormData; setData: (data: ProfessionalFormData) => void }) {
  const handleChange = (field: keyof ProfessionalFormData, value: string | boolean) => {
    setData({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
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
            <Label htmlFor="company">Company/Organization</Label>
            <Input
              id="company"
              value={data.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Your current employer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Job Title/Designation</Label>
            <Input
              id="designation"
              value={data.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              placeholder="Your current role"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Professional Experience</Label>
          <Select onValueChange={(value) => handleChange("experience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Years of experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2">0-2 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* FOSS Involvement */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">FOSS Involvement</h3>
        <div className="space-y-2">
          <Label htmlFor="skills">Technical Skills</Label>
          <Textarea
            id="skills"
            value={data.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
            placeholder="List your technical skills and expertise"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interests">FOSS Interests</Label>
          <Textarea
            id="interests"
            value={data.interests}
            onChange={(e) => handleChange("interests", e.target.value)}
            placeholder="What aspects of FOSS interest you most?"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contribution">How You Want to Contribute</Label>
          <Textarea
            id="contribution"
            value={data.contribution}
            onChange={(e) => handleChange("contribution", e.target.value)}
            placeholder="How would you like to contribute to the FOSS community?"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="availability">Availability for Community Activities</Label>
          <Select onValueChange={(value) => handleChange("availability", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Your availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekends">Weekends only</SelectItem>
              <SelectItem value="evenings">Weekday evenings</SelectItem>
              <SelectItem value="flexible">Flexible schedule</SelectItem>
              <SelectItem value="limited">Limited availability</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={data.agreeTerms}
          onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm leading-relaxed">
          I agree to the Terms of Service and Privacy Policy. I understand that my membership fee of ₹1,000 is
          non-refundable and valid for one year.
        </Label>
      </div>
    </div>
  )
}

function CompanyForm({ data, setData }: { data: CompanyFormData; setData: (data: CompanyFormData) => void }) {
  const handleChange = (field: keyof CompanyFormData, value: string | boolean) => {
    setData({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Contact Person *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Primary contact person"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Business Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Business email address"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Contact Number *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Business contact number"
            required
          />
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={data.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="Your company name"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select onValueChange={(value) => handleChange("industry", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Company Size</Label>
            <Select onValueChange={(value) => handleChange("size", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Number of employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-1000">201-1000 employees</SelectItem>
                <SelectItem value="1000+">1000+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Company Website</Label>
          <Input
            id="website"
            value={data.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://yourcompany.com"
          />
        </div>
      </div>

      {/* FOSS Strategy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">FOSS Strategy</h3>
        <div className="space-y-2">
          <Label htmlFor="fossUsage">Current FOSS Usage</Label>
          <Textarea
            id="fossUsage"
            value={data.fossUsage}
            onChange={(e) => handleChange("fossUsage", e.target.value)}
            placeholder="How does your company currently use FOSS?"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goals">FOSS Goals & Objectives</Label>
          <Textarea
            id="goals"
            value={data.goals}
            onChange={(e) => handleChange("goals", e.target.value)}
            placeholder="What are your company's goals with FOSS adoption?"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="partnership">Partnership Interests</Label>
          <Textarea
            id="partnership"
            value={data.partnership}
            onChange={(e) => handleChange("partnership", e.target.value)}
            placeholder="How would you like to partner with FOSS Andhra?"
            rows={3}
          />
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={data.agreeTerms}
          onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm leading-relaxed">
          I agree to the Terms of Service and Privacy Policy. I understand that the corporate membership fee of ₹10,000
          is non-refundable and valid for one year.
        </Label>
      </div>
    </div>
  )
}

function NGOForm({ data, setData }: { data: NGOFormData; setData: (data: NGOFormData) => void }) {
  const handleChange = (field: keyof NGOFormData, value: string | boolean) => {
    setData({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Contact Person *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Primary contact person"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Official Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Official organization email"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Contact Number *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Primary contact number"
            required
          />
        </div>
      </div>

      {/* Organization Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Organization Details</h3>
        <div className="space-y-2">
          <Label htmlFor="organizationName">Organization Name *</Label>
          <Input
            id="organizationName"
            value={data.organizationName}
            onChange={(e) => handleChange("organizationName", e.target.value)}
            placeholder="Your NGO/organization name"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="focusArea">Focus Area</Label>
            <Select onValueChange={(value) => handleChange("focusArea", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Primary focus area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="poverty">Poverty Alleviation</SelectItem>
                <SelectItem value="technology">Technology Access</SelectItem>
                <SelectItem value="rural">Rural Development</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Organization Website</Label>
            <Input
              id="website"
              value={data.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://yourorganization.org"
            />
          </div>
        </div>
      </div>

      {/* Impact & Technology */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Impact & Technology Needs</h3>
        <div className="space-y-2">
          <Label htmlFor="beneficiaries">Target Beneficiaries</Label>
          <Textarea
            id="beneficiaries"
            value={data.beneficiaries}
            onChange={(e) => handleChange("beneficiaries", e.target.value)}
            placeholder="Who are your target beneficiaries and how many do you serve?"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="techNeeds">Technology Needs</Label>
          <Textarea
            id="techNeeds"
            value={data.techNeeds}
            onChange={(e) => handleChange("techNeeds", e.target.value)}
            placeholder="What technology challenges do you face? How can FOSS help?"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="collaboration">Collaboration Interests</Label>
          <Textarea
            id="collaboration"
            value={data.collaboration}
            onChange={(e) => handleChange("collaboration", e.target.value)}
            placeholder="How would you like to collaborate with FOSS Andhra?"
            rows={3}
          />
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={data.agreeTerms}
          onCheckedChange={(checked) => handleChange("agreeTerms", checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm leading-relaxed">
          I agree to the Terms of Service and Privacy Policy. I understand that the NGO membership fee of ₹2,000 is
          non-refundable and valid for one year.
        </Label>
      </div>
    </div>
  )
}
