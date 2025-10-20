"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Heart, TrendingUp, DollarSign } from "lucide-react"

export default function DonationsManagement() {
  // Mock data
  const donations = [
    {
      id: 1,
      name: "Anonymous",
      email: "anonymous@example.com",
      amount: 5000,
      type: "One-time",
      status: "completed",
      date: "2025-02-05",
      paymentId: "pay_123456",
    },
    {
      id: 2,
      name: "Tech Company Ltd",
      email: "contact@techcompany.com",
      amount: 50000,
      type: "Program Sponsorship",
      status: "completed",
      date: "2025-02-04",
      paymentId: "pay_123457",
    },
    {
      id: 3,
      name: "Ramesh Kumar",
      email: "ramesh@example.com",
      amount: 1000,
      type: "Monthly",
      status: "active",
      date: "2025-02-01",
      paymentId: "pay_123458",
    },
  ]

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0)
  const monthlyDonations = donations
    .filter((d) => new Date(d.date).getMonth() === new Date().getMonth())
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
                  {donations.filter((d) => d.type === "Monthly").length}
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
                <Input placeholder="Search donations..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Donation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="onetime">One-time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="sponsorship">Program Sponsorship</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="active">Active (Recurring)</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{donation.name}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{donation.email}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-green-600">₹{donation.amount.toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{donation.type}</td>
                    <td className="py-3 px-4 text-sm">{donation.date}</td>
                    <td className="py-3 px-4 text-sm font-mono text-xs">{donation.paymentId}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          donation.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
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
        </CardContent>
      </Card>
    </div>
  )
}
