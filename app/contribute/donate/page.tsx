"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Heart, DollarSign, CreditCard, Building, Users } from "lucide-react"
import { processDonation } from "@/app/actions/donation"

export default function DonatePage() {
  const router = useRouter()
  const [donationType, setDonationType] = useState("one-time")
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const predefinedAmounts = ["500", "1000", "2500", "5000", "10000"]

  const handleDonate = async () => {
    const finalAmount = customAmount || amount
    if (!finalAmount || !formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      // Create FormData for server action
      const formDataObj = new FormData()
      formDataObj.append("donationType", donationType)
      formDataObj.append("amount", finalAmount)
      formDataObj.append("name", formData.name)
      formDataObj.append("email", formData.email)
      formDataObj.append("phone", formData.phone)
      if (formData.message) {
        formDataObj.append("message", formData.message)
      }

      await processDonation(formDataObj)
    } catch (error) {
      console.error("Donation error:", error)
      alert("An error occurred. Please try again.")
      setLoading(false)
    }
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#015ba7] rounded-full mb-4">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Support FOSS Andhra</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your generous donation helps us promote Free and Open Source Software across Andhra Pradesh
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Donation Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Make a Donation</CardTitle>
                  <CardDescription>
                    Choose your contribution amount and frequency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Donation Type */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Donation Type</Label>
                    <RadioGroup value={donationType} onValueChange={setDonationType}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <RadioGroupItem value="one-time" id="one-time" className="peer sr-only" />
                          <Label
                            htmlFor="one-time"
                            className="flex items-center justify-center rounded-lg border-2 border-muted p-4 cursor-pointer hover:border-[#015ba7] peer-checked:border-[#015ba7] peer-checked:bg-[#015ba7]/10"
                          >
                            <DollarSign className="mr-2 h-5 w-5" />
                            One-Time
                          </Label>
                        </div>
                        <div className="relative">
                          <RadioGroupItem value="monthly" id="monthly" className="peer sr-only" />
                          <Label
                            htmlFor="monthly"
                            className="flex items-center justify-center rounded-lg border-2 border-muted p-4 cursor-pointer hover:border-[#015ba7] peer-checked:border-[#015ba7] peer-checked:bg-[#015ba7]/10"
                          >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Monthly
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Select Amount (₹)</Label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {predefinedAmounts.map((amt) => (
                        <Button
                          key={amt}
                          type="button"
                          variant={amount === amt ? "default" : "outline"}
                          onClick={() => {
                            setAmount(amt)
                            setCustomAmount("")
                          }}
                          className={`h-14 text-lg font-semibold ${amount === amt ? "bg-[#015ba7] hover:bg-[#015ba7]/90" : ""
                            }`}
                        >
                          ₹{parseInt(amt).toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    <div>
                      <Label htmlFor="custom-amount">Custom Amount</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value)
                          setAmount("")
                        }}
                        className="text-lg h-12"
                      />
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">Your Information</h3>
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 94944 63840"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Share why you're supporting FOSS Andhra..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleDonate}
                    disabled={loading || (!amount && !customAmount)}
                    className="w-full h-12 text-lg"
                    style={{ backgroundColor: '#015ba7' }}
                  >
                    {loading ? "Processing..." : `Donate ₹${(customAmount || amount || "0")}`}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Your donation is processed securely through Razorpay
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Impact Info */}
            <div className="space-y-6">
              <Card className="bg-[#015ba7] text-white border-0">
                <CardHeader>
                  <CardTitle className="text-white">Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#98d339]" />
                    <div>
                      <div className="font-semibold">Support Education</div>
                      <div className="text-sm text-blue-100">Fund workshops and training programs</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#98d339]" />
                    <div>
                      <div className="font-semibold">Infrastructure</div>
                      <div className="text-sm text-blue-100">Improve community resources and tools</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Heart className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-[#98d339]" />
                    <div>
                      <div className="font-semibold">Community Growth</div>
                      <div className="text-sm text-blue-100">Expand FOSS adoption in AP</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Other Ways to Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/contribute/sponsor">
                    <Button variant="outline" className="w-full justify-start">
                      <Building className="mr-2 h-4 w-4" />
                      Become a Sponsor
                    </Button>
                  </Link>
                  <Link href="/contribute/volunteer">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Volunteer
                    </Button>
                  </Link>
                  <Link href="/membership">
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      Become a Member
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
