"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Building, CheckCircle } from "lucide-react"

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-foreground">
              Contribute to FOSS Andhra
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join us in promoting free and open source solutions across Andhra Pradesh. Every contribution makes a difference.
            </p>
          </div>

          {/* Contribution Options */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {/* Donate */}
            <Link href="/contribute/donate">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#015ba7] rounded-lg flex items-center justify-center mb-3">
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
                      <CheckCircle className="h-4 w-4 text-[#98d339] mr-2 mt-0.5 flex-shrink-0" />
                      <span>One-time or monthly donations</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-[#98d339] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Secure Razorpay payment</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-[#98d339] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Tax-deductible receipts</span>
                    </li>
                  </ul>
                  <Button className="w-full" style={{ backgroundColor: '#015ba7' }}>
                    Donate Now
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Volunteer */}
            <Link href="/contribute/volunteer">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#98d339] rounded-lg flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Volunteer</CardTitle>
                  <CardDescription>
                    Share your skills and time to make a difference
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-[#98d339] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Flexible volunteering opportunities</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-[#98d339] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Skill development & networking</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-[#98d339] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Make meaningful impact</span>
                    </li>
                  </ul>
                  <Button className="w-full" style={{ backgroundColor: '#98d339' }}>
                    Become a Volunteer
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Sponsor */}
            <Link href="/contribute/sponsor">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#015ba7] rounded-lg flex items-center justify-center mb-3">
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
                      <CheckCircle className="h-4 w-4 text-[#98d339] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Tiered sponsorship packages</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-[#98d339] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Brand visibility & recognition</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-[#98d339] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Program-specific sponsorships</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Explore Sponsorships
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Impact Section */}
          <Card className="bg-[#015ba7] text-white border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl text-white">Your Contribution Powers Change</CardTitle>
              <CardDescription className="text-blue-100 text-base mt-4">
                Every contribution—whether financial, time, or expertise—helps us promote free and open source software, 
                educate communities, and build a more open digital future for Andhra Pradesh.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2 text-[#98d339]">500+</div>
                  <div className="text-sm text-blue-100">Community Members</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2 text-[#98d339]">50+</div>
                  <div className="text-sm text-blue-100">Events Organized</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2 text-[#98d339]">20+</div>
                  <div className="text-sm text-blue-100">Active Programs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
