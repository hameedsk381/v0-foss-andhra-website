"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CreditCard, Bell, TrendingUp, Award, Users } from "lucide-react"
import { Skeleton } from "@/components/skeleton-loader"
import { ActivityTimeline } from "@/components/member/activity-timeline"
import Link from "next/link"

export default function MemberDashboard() {
  const { data: session } = useSession()
  const [memberData, setMemberData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchMemberData()
    }
  }, [session])

  const fetchMemberData = async () => {
    try {
      const res = await fetch("/api/member/profile")
      const data = await res.json()
      if (data.success) {
        setMemberData(data.data)
      }
    } catch (error) {
      console.error("Error fetching member data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const daysUntilExpiry = memberData?.expiryDate
    ? Math.ceil((new Date(memberData.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your membership</p>
      </div>

      {/* Membership Status Alert */}
      {memberData?.status === "active" && daysUntilExpiry < 30 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Membership Renewal Reminder</p>
                <p className="text-sm text-yellow-800 mt-1">
                  Your membership expires in {daysUntilExpiry} days. Renew now to continue enjoying benefits!
                </p>
                <Link href="/membership">
                  <Button className="mt-3" size="sm">
                    Renew Membership
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Membership Status</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <Badge className={memberData?.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {memberData?.status?.toUpperCase()}
            </Badge>
            <p className="text-xs text-gray-500 mt-2">
              {memberData?.status === "active"
                ? `Expires: ${new Date(memberData.expiryDate).toLocaleDateString()}`
                : "Membership inactive"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(memberData?.joinDate).getFullYear()}</div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(memberData?.joinDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Events Attended</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">Total events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Certificates</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-gray-500 mt-1">Earned certificates</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/member/membership">
              <Button className="w-full" variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                View Membership Card
              </Button>
            </Link>
            <Link href="/member/profile">
              <Button className="w-full" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </Link>
            <Link href="/events">
              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Browse Events
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Membership Details */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Membership ID</p>
              <p className="font-semibold">{memberData?.membershipId}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Membership Type</p>
              <p className="font-semibold">{memberData?.membershipType}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Organization</p>
              <p className="font-semibold">{memberData?.organization || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Designation</p>
              <p className="font-semibold">{memberData?.designation || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline
            activities={[
              {
                id: "1",
                type: "membership",
                title: "Membership Activated",
                description: `Joined as ${memberData?.membershipType}`,
                date: new Date(memberData?.joinDate || Date.now()),
                status: "success",
              },
              // Add more activities from API
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
