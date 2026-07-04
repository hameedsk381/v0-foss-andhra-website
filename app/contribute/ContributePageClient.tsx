"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Building, CheckCircle } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { StaggerGroup, StaggerItem, AnimatedCounter, HoverLift } from "@/components/motion-primitives"

export default function ContributePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHero
        eyebrow="Get involved"
        title="Power the open"
        titleLine2="future of AP."
        subtitle="Every contribution — financial, time, or expertise — helps us promote free and open source software across Andhra Pradesh."
        image="/stock/collaboration.jpg"
      />

      <div className="app-container py-16 md:py-20">
        <div className="max-w-6xl mx-auto">

          {/* Contribution Options */}
          <StaggerGroup className="grid gap-6 md:grid-cols-3 mb-16">
            <StaggerItem from="left">
              <Link href="/contribute/donate" className="block h-full">
                <HoverLift className="h-full">
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Donate</CardTitle>
                      <CardDescription>
                        Support our mission through one-time or monthly donations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>One-time or monthly donations</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Secure Razorpay payment</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Tax-deductible receipts</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        Donate Now
                      </Button>
                    </CardContent>
                  </Card>
                </HoverLift>
              </Link>
            </StaggerItem>

            {/* Volunteer */}
            <StaggerItem>
              <Link href="/contribute/volunteer" className="block h-full">
                <HoverLift className="h-full">
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-3">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Volunteer</CardTitle>
                      <CardDescription>
                        Share your skills and time to make a difference
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Flexible volunteering opportunities</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Skill development & networking</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Make meaningful impact</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        Become a Volunteer
                      </Button>
                    </CardContent>
                  </Card>
                </HoverLift>
              </Link>
            </StaggerItem>

            {/* Sponsor */}
            <StaggerItem from="right">
              <Link href="/contribute/sponsor" className="block h-full">
                <HoverLift className="h-full">
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Sponsor</CardTitle>
                      <CardDescription>
                        Partner with us through corporate sponsorships
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        <li className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Tiered sponsorship packages</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Brand visibility & recognition</span>
                        </li>
                        <li className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Program-specific sponsorships</span>
                        </li>
                      </ul>
                      <Button className="w-full" variant="outline">
                        Explore Sponsorships
                      </Button>
                    </CardContent>
                  </Card>
                </HoverLift>
              </Link>
            </StaggerItem>
          </StaggerGroup>

          {/* Impact Section */}
          <Card className="bg-primary text-white border-0 overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              aria-hidden="true"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <CardHeader className="text-center pb-6 relative z-10">
              <CardTitle className="font-display text-3xl text-white">Your Contribution Powers Change</CardTitle>
              <CardDescription className="text-white/65 text-base mt-4">
                Every contribution—whether financial, time, or expertise—helps us promote free and open source software,
                educate communities, and build a more open digital future for Andhra Pradesh.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <AnimatedCounter value={700} suffix="+" className="block text-4xl font-extrabold font-display mb-2 text-white" />
                  <div className="text-sm text-white/65">Community Members</div>
                </div>
                <div>
                  <AnimatedCounter value={50} suffix="+" className="block text-4xl font-extrabold font-display mb-2 text-white" />
                  <div className="text-sm text-white/65">Events Organized</div>
                </div>
                <div>
                  <AnimatedCounter value={7} suffix="" className="block text-4xl font-extrabold font-display mb-2 text-white" />
                  <div className="text-sm text-white/65">Active Programs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
