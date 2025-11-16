"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Heart, TrendingUp, DollarSign, Loader2 } from "lucide-react"

interface Donation {
  id: string
  name: string
  email: string
  amount: number
  type: string
  status: string
  createdAt: Date
  paymentId: string | null
  anonymous: boolean
}

export default function DonationsManagement() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ type: "all", status: "all" })
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchDonations()
  }, [filter])

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.type !== "all") params.append("type", filter.type)
      if (filter.status !== "all") params.append("status", filter.status)

      const res = await fetch(`/api/admin/donations?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setDonations(data.data)
      }
    } catch (error) {
      console.error("Error fetching donations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDonations = donations.filter((donation) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      donation.name.toLowerCase().includes(query) ||
      donation.email.toLowerCase().includes(query)
    )
  })

  const totalDonations = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0)
  
  const monthlyDonations = donations
    .filter((d) => {
      const date = new Date(d.createdAt)
      const now = new Date()
      return (
        d.status === "completed" &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      )
    })
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donations Management</h1>
          <p className="text-gray-600 mt-1">Track and manage donations</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">₹{totalDonations.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Total Donations</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">₹{monthlyDonations.toLocaleString()}</div>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{donations.length}</div>
                <p className="text-sm text-gray-600">Total Donors</p>
              </div>
              <Heart className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {donations.filter((d) => d.type === "Monthly" || d.type === "Recurring").length}
                </div>
                <p className="text-sm text-gray-600">Recurring Donors</p>
              </div>
              <Heart className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search donations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select
              value={filter.type}
              onValueChange={(value) => setFilter({ ...filter, type: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Donation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="One-time">One-time</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Recurring">Recurring</SelectItem>
                <SelectItem value="Program Sponsorship">Program Sponsorship</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filter.status}
              onValueChange={(value) => setFilter({ ...filter, status: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredDonations.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No donations found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Donor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Payment ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {donation.anonymous ? "Anonymous" : donation.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{donation.email}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-green-600">
                          ₹{donation.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{donation.type}</td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-xs">
                        {donation.paymentId || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            donation.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : donation.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {donation.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Receipt
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
