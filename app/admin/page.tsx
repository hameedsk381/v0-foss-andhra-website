"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Heart, TrendingUp, DollarSign, UserPlus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/skeleton-loader"

interface DashboardData {
  stats: {
    totalMembers: number
    activeMembers: number
    newMembersThisMonth: number
    totalEvents: number
    upcomingEvents: number
    totalDonations: number
    monthlyDonations: number
    eventAttendance: number
  }
  recentMembers: Array<{ name: string; email: string; createdAt: Date }>
  upcomingEvents: Array<{ title: string; date: Date; location: string }>
  recentDonations: Array<{
    name: string
    amount: number
    type: string
    createdAt: Date
    anonymous: boolean
  }>
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard")
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 sm:h-9 sm:w-64" />
          <Skeleton className="h-5 w-full max-w-sm sm:max-w-lg" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500">Failed to load dashboard data</p>
      </div>
    )
  }

  const { stats, recentMembers, upcomingEvents, recentDonations } = data

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-600 sm:text-base dark:text-slate-300">Welcome to FOSS Andhra CMS</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Members</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{stats.totalMembers}</div>
            <p className="mt-1 flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{stats.newMembersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Active Members</CardTitle>
            <UserPlus className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{stats.activeMembers}</div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {stats.totalMembers > 0 ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{stats.totalEvents}</div>
            <p className="mt-1 text-xs text-blue-600">{stats.upcomingEvents} upcoming</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">&#8377;{stats.totalDonations.toLocaleString()}</div>
            <p className="mt-1 flex items-center text-xs text-green-600">
              <Heart className="mr-1 h-3 w-3" />
              &#8377;{stats.monthlyDonations.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Members</CardTitle>
            <Link href="/admin/members" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMembers.length > 0 ? (
                recentMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{member.name}</p>
                      <p className="truncate text-xs text-slate-500">{member.email}</p>
                    </div>
                    <p className="shrink-0 text-xs text-slate-400">
                      {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-sm text-slate-500">No recent members</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Link href="/admin/events" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{event.title}</p>
                      <p className="truncate text-xs text-slate-500">{event.location}</p>
                    </div>
                    <p className="shrink-0 text-xs text-slate-400">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-sm text-slate-500">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Donations</CardTitle>
          <Link href="/admin/donations" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDonations.length > 0 ? (
              recentDonations.map((donation, index) => (
                <div key={index} className="flex items-center justify-between gap-4 border-b pb-3 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{donation.anonymous ? "Anonymous" : donation.name}</p>
                    <p className="text-xs text-slate-500">{donation.type}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-green-600">&#8377;{donation.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-slate-500">No recent donations</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
