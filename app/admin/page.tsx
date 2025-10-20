"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Heart, TrendingUp, DollarSign, UserPlus } from "lucide-react"

export default function AdminDashboard() {
  // This would be fetched from your database
  const stats = {
    totalMembers: 1247,
    activeMembers: 892,
    totalEvents: 48,
    upcomingEvents: 12,
    totalDonations: 456789,
    monthlyDonations: 45670,
    newMembersThisMonth: 67,
    eventAttendance: 3456,
  }

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
              {((stats.activeMembers / stats.totalMembers) * 100).toFixed(1)}% of total
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
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Rajesh Kumar", email: "rajesh@example.com", date: "2 hours ago" },
                { name: "Priya Reddy", email: "priya@example.com", date: "5 hours ago" },
                { name: "Anil Sharma", email: "anil@example.com", date: "1 day ago" },
                { name: "Lakshmi Devi", email: "lakshmi@example.com", date: "2 days ago" },
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                  <p className="text-xs text-gray-400">{member.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "FOSSynC Workshop", date: "Feb 10, 2025", location: "JNTU Kakinada" },
                { title: "FOSStorm Hackathon", date: "Feb 22-23, 2025", location: "Vijayawada" },
                { title: "FOSServe Training", date: "Mar 5, 2025", location: "Amaravati" },
                { title: "Annual Conference", date: "Mar 15-16, 2025", location: "Visakhapatnam" },
              ].map((event, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                  <p className="text-xs text-gray-400">{event.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Anonymous", amount: 5000, type: "One-time", date: "1 hour ago" },
              { name: "Tech Company Ltd", amount: 50000, type: "Program Sponsorship", date: "3 hours ago" },
              { name: "Ramesh Kumar", amount: 1000, type: "Monthly", date: "1 day ago" },
              { name: "Sarah Johnson", amount: 2500, type: "One-time", date: "2 days ago" },
              { name: "Anonymous", amount: 500, type: "One-time", date: "3 days ago" },
            ].map((donation, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{donation.name}</p>
                  <p className="text-xs text-gray-500">{donation.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">₹{donation.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{donation.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
