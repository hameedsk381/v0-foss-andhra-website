"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, CreditCard } from "lucide-react"
import QRCode from "qrcode"
import Image from "next/image"
import Link from "next/link"

export default function MembershipPage() {
  const [memberData, setMemberData] = useState<any>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMemberData()
  }, [])

  const fetchMemberData = async () => {
    try {
      const res = await fetch("/api/member/profile")
      const data = await res.json()
      if (data.success) {
        setMemberData(data.data)
        // Generate QR code with membership ID
        const qrData = JSON.stringify({
          membershipId: data.data.membershipId,
          name: data.data.name,
          email: data.data.email,
          status: data.data.status,
        })
        const qrUrl = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
        })
        setQrCodeUrl(qrUrl)
      }
    } catch (error) {
      console.error("Error fetching member data:", error)
    } finally {
      setLoading(false)
    }
  }

  const printCard = () => {
    if (cardRef.current) {
      window.print()
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  const isActive = memberData?.status === "active"
  const daysUntilExpiry = memberData?.expiryDate
    ? Math.ceil((new Date(memberData.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Membership</h1>
        <p className="text-gray-600 mt-1">View and manage your membership details</p>
      </div>

      {/* Digital Membership Card */}
      <Card ref={cardRef} className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-lg font-semibold">FOSS Andhra</span>
                </div>
                <p className="text-sm text-blue-100">Member Card</p>
              </div>
              <Badge className={isActive ? "bg-green-500" : "bg-red-500"}>
                {isActive ? "ACTIVE" : "INACTIVE"}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div>
                  <p className="text-xs text-blue-100 uppercase tracking-wide">Member Name</p>
                  <p className="text-xl font-bold">{memberData?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-100 uppercase tracking-wide">Membership ID</p>
                    <p className="text-sm font-mono font-semibold">{memberData?.membershipId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-100 uppercase tracking-wide">Type</p>
                    <p className="text-sm font-semibold">{memberData?.membershipType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-100 uppercase tracking-wide">Join Date</p>
                    <p className="text-sm">
                      {new Date(memberData?.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-100 uppercase tracking-wide">Valid Until</p>
                    <p className="text-sm">
                      {new Date(memberData?.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                {qrCodeUrl && (
                  <div className="bg-white p-3 rounded-lg">
                    <Image src={qrCodeUrl} alt="QR Code" width={128} height={128} unoptimized />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Button */}
      <div className="max-w-2xl mx-auto">
        <Button onClick={printCard} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Print Membership Card
        </Button>
      </div>

      {/* Membership Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {isActive ? "ACTIVE" : "INACTIVE"}
            </Badge>
            {isActive && daysUntilExpiry > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {daysUntilExpiry} days remaining
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>Access to all events</li>
              <li>Networking opportunities</li>
              <li>Exclusive resources</li>
              <li>Certificates</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Renewal */}
      {!isActive || daysUntilExpiry < 30 && (
        <Card className="max-w-2xl mx-auto border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-yellow-900 mb-2">
              {isActive ? "Renewal Reminder" : "Membership Inactive"}
            </h3>
            <p className="text-sm text-yellow-800 mb-4">
              {isActive
                ? "Your membership is expiring soon. Renew now to continue enjoying benefits."
                : "Your membership has expired. Renew to regain access to all benefits."}
            </p>
            <Link href="/membership">
              <Button>Renew Membership</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
