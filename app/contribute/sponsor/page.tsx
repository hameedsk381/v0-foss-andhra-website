"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building, Star, Users, Trophy, CheckCircle, Mail } from "lucide-react"

export default function SponsorPage() {
  const sponsorshipTiers = [
    {
      name: "Platinum Sponsor",
      amount: "₹5,00,000+",
      color: "from-gray-300 to-gray-400",
      benefits: [
        "Exclusive naming rights for major events",
        "Prime logo placement on all materials",
        "Dedicated blog post and social media coverage",
        "Speaking slot at flagship events",
        "Direct collaboration on program design",
        "Quarterly impact reports",
        "Access to talent pool for recruitment",
      ],
    },
    {
      name: "Gold Sponsor",
      amount: "₹2,50,000 - ₹4,99,999",
      color: "from-yellow-400 to-yellow-600",
      benefits: [
        "Logo on event materials and website",
        "Social media mentions and recognition",
        "Sponsor booth at major events",
        "Quarterly newsletter feature",
        "Access to community network",
        "Co-branded materials for one program",
      ],
    },
    {
      name: "Silver Sponsor",
      amount: "₹1,00,000 - ₹2,49,999",
      color: "from-gray-400 to-gray-500",
      benefits: [
        "Logo on website sponsors page",
        "Social media acknowledgment",
        "Event mentions and recognition",
        "Access to community events",
        "Biannual progress updates",
      ],
    },
    {
      name: "Bronze Sponsor",
      amount: "₹50,000 - ₹99,999",
      color: "from-orange-400 to-orange-600",
      benefits: [
        "Website listing",
        "Social media recognition",
        "Event acknowledgment",
        "Community newsletter mention",
      ],
    },
  ]

  const programSponsorship = [
    {
      program: "FOSStar",
      description: "Support our flagship membership and community program",
      impact: "Enable 500+ members to access resources and training",
    },
    {
      program: "FOSServe",
      description: "Sponsor FOSS implementation services for organizations",
      impact: "Help 10+ institutions migrate to open-source solutions",
    },
    {
      program: "FOSSynC",
      description: "Support student clubs and campus initiatives",
      impact: "Establish FOSS clubs in 20+ colleges",
    },
    {
      program: "FOSStorm",
      description: "Fund hackathons and collaborative development",
      impact: "Support 50+ open-source projects",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/contribute">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contribute
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
              <Building className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Become a Sponsor</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Partner with FOSS Andhra to promote open-source solutions and support the tech community in Andhra Pradesh
            </p>
          </div>

          {/* Why Sponsor */}
          <Card className="mb-12 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Why Sponsor FOSS Andhra?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Users className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Reach Talent</h3>
                  <p className="text-purple-100 text-sm">
                    Connect with skilled developers, students, and tech professionals
                  </p>
                </div>
                <div>
                  <Star className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Brand Visibility</h3>
                  <p className="text-purple-100 text-sm">
                    Enhance your brand presence in the open-source community
                  </p>
                </div>
                <div>
                  <Trophy className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Give Back</h3>
                  <p className="text-purple-100 text-sm">
                    Support the growth of FOSS ecosystem and education
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sponsorship Tiers */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Sponsorship Tiers</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {sponsorshipTiers.map((tier) => (
                <Card key={tier.name} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tier.color}`} />
                  <CardHeader>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-gray-900">
                      {tier.amount}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Program Sponsorship */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-center">Program Sponsorship</h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Sponsor specific programs that align with your organization's goals and values
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {programSponsorship.map((program) => (
                <Card key={program.program}>
                  <CardHeader>
                    <CardTitle>{program.program}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm font-semibold text-blue-900 mb-1">Impact</div>
                      <div className="text-sm text-blue-700">{program.impact}</div>
                    </div>
                    <Link href={`/programs/${program.program.toLowerCase()}`} className="mt-4 block">
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Sponsorship */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Custom Sponsorship Packages</CardTitle>
              <CardDescription>
                We can create tailored sponsorship opportunities that align with your specific goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="font-semibold mb-1">Event Sponsorship</div>
                  <div className="text-sm text-gray-600">Sponsor workshops, hackathons, or conferences</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="font-semibold mb-1">Infrastructure Support</div>
                  <div className="text-sm text-gray-600">Provide servers, hosting, or technical resources</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="font-semibold mb-1">In-Kind Contributions</div>
                  <div className="text-sm text-gray-600">Software licenses, training, or services</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-center">
            <CardContent className="py-12">
              <Mail className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to Partner with Us?</h2>
              <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                Get in touch to discuss sponsorship opportunities and how we can work together to promote FOSS in Andhra Pradesh
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                    Contact Sponsorship Team
                  </Button>
                </Link>
                <a href="mailto:sponsors@fossandhra.org">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Email: sponsors@fossandhra.org
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
