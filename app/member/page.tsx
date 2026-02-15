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
import { ChangePasswordModal } from "@/components/member/change-password-modal"

interface DashboardResponse {
  member: {
    membershipId: string
    membershipType: string
    organization?: string | null
    designation?: string | null
    status: string
    expiryDate: string
    joinDate: string
  }
  stats: {
    eventsAttended: number
    eventsRegistered: number
    certificatesEarned: number
  }
  activities: Array<{
    id: string
    type: "membership" | "event" | "payment" | "certificate" | "notification"
    title: string
    description?: string
    date: string
    status?: "success" | "pending" | "failed"
  }>
}

export default function MemberDashboard() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchMemberDashboard()
    }
  }, [session])

  const fetchMemberDashboard = async () => {
    try {
      const res = await fetch("/api/member/dashboard")
      const data = await res.json()
      if (data.success) {
        setDashboardData(data.data)
      }
    } catch (error) {
      console.error("Error fetching member dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="mb-2 h-9 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-sm text-gray-500">
        Failed to load dashboard data
      </div>
    )
  }

  const { member, stats, activities } = dashboardData

  const daysUntilExpiry = member?.expiryDate
    ? Math.ceil((new Date(member.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="rounded-lg bg-white p-3 shadow-sm sm:p-4">
        <h1 className="text-lg font-bold text-gray-900 sm:text-2xl">Welcome back, {session?.user?.name}!</h1>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm">Here&apos;s what&apos;s happening with your membership</p>
      </div>

      {member?.status === "active" && daysUntilExpiry < 30 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Membership Renewal Reminder</p>
                <p className="mt-1 text-sm text-yellow-800">
                  Your membership expires in {daysUntilExpiry} days. Renew now to continue enjoying benefits.
                </p>
                <Link href="/member/membership">
                  <Button className="mt-3" size="sm">
                    Renew Membership
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-3 pb-1 pt-2 sm:px-4 sm:pt-3">
            <CardTitle className="text-[10px] font-medium text-gray-500 sm:text-xs">Membership Status</CardTitle>
            <CreditCard className="h-3 w-3 text-blue-600 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent className="px-3 pb-2 sm:px-4 sm:pb-3">
            <Badge className={`text-[10px] sm:text-xs ${member?.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {member?.status?.toUpperCase()}
            </Badge>
            <p className="mt-1 truncate text-[10px] text-gray-500 sm:text-xs">
              {member?.status === "active" ? `Expires: ${new Date(member.expiryDate).toLocaleDateString()}` : "Membership inactive"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-3 pb-1 pt-2 sm:px-4 sm:pt-3">
            <CardTitle className="text-[10px] font-medium text-gray-500 sm:text-xs">Member Since</CardTitle>
            <Calendar className="h-3 w-3 text-purple-600 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent className="px-3 pb-2 sm:px-4 sm:pb-3">
            <div className="text-lg font-bold sm:text-xl">{new Date(member?.joinDate).getFullYear()}</div>
            <p className="text-[10px] text-gray-500 sm:text-xs">{new Date(member?.joinDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-3 pb-1 pt-2 sm:px-4 sm:pt-3">
            <CardTitle className="text-[10px] font-medium text-gray-500 sm:text-xs">Events Attended</CardTitle>
            <Users className="h-3 w-3 text-orange-600 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent className="px-3 pb-2 sm:px-4 sm:pb-3">
            <div className="text-lg font-bold sm:text-xl">{stats.eventsAttended}</div>
            <p className="text-[10px] text-gray-500 sm:text-xs">{stats.eventsRegistered} registered</p>
            <Link href="/events" className="inline-block text-[10px] text-primary hover:underline sm:text-xs">
              Browse Events
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between px-3 pb-1 pt-2 sm:px-4 sm:pt-3">
            <CardTitle className="text-[10px] font-medium text-gray-500 sm:text-xs">Certificates</CardTitle>
            <Award className="h-3 w-3 text-green-600 sm:h-4 sm:w-4" />
          </CardHeader>
          <CardContent className="px-3 pb-2 sm:px-4 sm:pb-3">
            <div className="text-lg font-bold sm:text-xl">{stats.certificatesEarned}</div>
            <p className="text-[10px] text-gray-500 sm:text-xs">Earned certificates</p>
            <Link href="/programs" className="inline-block text-[10px] text-primary hover:underline sm:text-xs">
              View Programs
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-3 pb-2 sm:px-6">
          <CardTitle className="text-sm sm:text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-2 sm:px-6">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/member/membership">
              <Button className="h-9 w-full text-xs sm:h-10 sm:text-sm" variant="outline">
                <CreditCard className="mr-1 h-3 w-3 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="truncate">View Membership Card</span>
              </Button>
            </Link>
            <Link href="/member/profile">
              <Button className="h-9 w-full text-xs sm:h-10 sm:text-sm" variant="outline">
                <TrendingUp className="mr-1 h-3 w-3 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="truncate">Update Profile</span>
              </Button>
            </Link>
            <Link href="/events">
              <Button className="h-9 w-full text-xs sm:h-10 sm:text-sm" variant="outline">
                <Calendar className="mr-1 h-3 w-3 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="truncate">Browse Events</span>
              </Button>
            </Link>
            <ChangePasswordModal />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-3 pb-2 sm:px-6">
          <CardTitle className="text-sm sm:text-base">Membership Details</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-2 sm:px-6">
          <div className="grid grid-cols-2 gap-2 text-xs sm:gap-3 sm:text-sm md:grid-cols-4">
            <div>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs">Membership ID</p>
              <p className="truncate font-semibold">{member?.membershipId}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs">Membership Type</p>
              <p className="truncate font-semibold">{member?.membershipType}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs">Organization</p>
              <p className="truncate font-semibold">{member?.organization || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-xs">Designation</p>
              <p className="truncate font-semibold">{member?.designation || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-3 pb-2 sm:px-6">
          <CardTitle className="text-sm sm:text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-2 sm:px-6">
          <ActivityTimeline
            activities={activities.map((activity) => ({
              ...activity,
              date: new Date(activity.date),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  )
}
