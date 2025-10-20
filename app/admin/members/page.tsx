"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Mail, CheckCircle, XCircle } from "lucide-react"

export default function MembersManagement() {
  const [filter, setFilter] = useState("all")

  // Mock data - replace with actual database queries
  const members = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 98765 43210",
      membershipType: "FOSStar Annual",
      status: "active",
      joinDate: "2024-01-15",
      expiryDate: "2025-01-15",
      organization: "Tech Solutions Inc",
    },
    {
      id: 2,
      name: "Priya Reddy",
      email: "priya@example.com",
      phone: "+91 98765 43211",
      membershipType: "FOSStar Annual",
      status: "active",
      joinDate: "2024-02-20",
      expiryDate: "2025-02-20",
      organization: "Andhra University",
    },
    {
      id: 3,
      name: "Anil Sharma",
      email: "anil@example.com",
      phone: "+91 98765 43212",
      membershipType: "FOSStar Annual",
      status: "expired",
      joinDate: "2023-03-10",
      expiryDate: "2024-03-10",
      organization: "Freelancer",
    },
  ]

  const filteredMembers = members.filter((member) => {
    if (filter === "all") return true
    return member.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members Management</h1>
          <p className="text-gray-600 mt-1">Manage FOSStar memberships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-sm text-gray-600">Total Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {members.filter((m) => m.status === "active").length}
            </div>
            <p className="text-sm text-gray-600">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {members.filter((m) => m.status === "expired").length}
            </div>
            <p className="text-sm text-gray-600">Expired Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <p className="text-sm text-gray-600">Pending Renewals</p>
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
                <Input placeholder="Search members..." className="pl-10" />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Membership Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="annual">FOSStar Annual</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Phone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Organization</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Expiry Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.membershipType}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{member.email}</td>
                    <td className="py-3 px-4 text-sm">{member.phone}</td>
                    <td className="py-3 px-4 text-sm">{member.organization}</td>
                    <td className="py-3 px-4 text-sm">{member.joinDate}</td>
                    <td className="py-3 px-4 text-sm">{member.expiryDate}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={member.status === "active" ? "default" : "secondary"}
                        className={
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {member.status === "active" ? (
                          <CheckCircle className="h-3 w-3 mr-1 inline" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1 inline" />
                        )}
                        {member.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
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
