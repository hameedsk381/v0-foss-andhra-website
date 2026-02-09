"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Heart, TrendingUp, DollarSign, UserPlus, Loader2 } from "lucide-react"
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
      <div className="space-y-8">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
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

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    )
  }

  const { stats, recentMembers, upcomingEvents, recentDonations } = data

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to FOSS Andhra CMS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{stats.newMembersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.totalMembers > 0
                ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(1)
                : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-blue-600 mt-1">{stats.upcomingEvents} upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalDonations.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Heart className="h-3 w-3 mr-1" />
              ₹{stats.monthlyDonations.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
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
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent members</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
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
                  <div key={index} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card>
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
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {donation.anonymous ? "Anonymous" : donation.name}
                    </p>
                    <p className="text-xs text-gray-500">{donation.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent donations</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
