"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Mail, CheckCircle, XCircle, Edit, Eye } from "lucide-react"
import { DataTable, Column } from "@/components/admin/data-table"
import { BulkActions } from "@/components/admin/bulk-actions"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  membershipType: string
  status: string
  joinDate: Date
  expiryDate: Date
  organization: string | null
  membershipId: string
}

export default function MembersManagementImproved() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])

  const { toast } = useToast()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/members")
      const data = await res.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (ids: string[]) => {
    // Implement delete logic
    toast({
      title: "Deleted",
      description: `${ids.length} member(s) deleted`,
    })
    fetchMembers()
  }

  const handleExport = (items: Member[]) => {
    // Implement CSV export
    toast({
      title: "Export Started",
      description: `Exporting ${items.length} members to CSV`,
    })
  }

  const handleSendEmail = async (items: Member[]) => {
    // Implement email sending
    toast({
      title: "Email Sent",
      description: `Email sent to ${items.length} member(s)`,
    })
  }

  const columns: Column<Member>[] = [
    {
      id: "name",
      header: "Name",
      accessor: (member) => (
        <div>
          <div className="font-medium">{member.name}</div>
          <div className="text-xs text-gray-500">{member.membershipId}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      accessor: (member) => member.email,
      sortable: true,
    },
    {
      id: "phone",
      header: "Phone",
      accessor: (member) => member.phone,
    },
    {
      id: "organization",
      header: "Organization",
      accessor: (member) => member.organization || "N/A",
      sortable: true,
    },
    {
      id: "membershipType",
      header: "Type",
      accessor: (member) => (
        <Badge variant="outline">{member.membershipType}</Badge>
      ),
      sortable: true,
    },
    {
      id: "joinDate",
      header: "Join Date",
      accessor: (member) => format(new Date(member.joinDate), "MMM dd, yyyy"),
      sortable: true,
    },
    {
      id: "expiryDate",
      header: "Expiry Date",
      accessor: (member) => format(new Date(member.expiryDate), "MMM dd, yyyy"),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      accessor: (member) => (
        <Badge
          className={
            member.status === "active"
              ? "bg-green-100 text-green-800"
              : member.status === "expired"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {member.status === "active" ? (
            <CheckCircle className="h-3 w-3 mr-1 inline" />
          ) : (
            <XCircle className="h-3 w-3 mr-1 inline" />
          )}
          {member.status}
        </Badge>
      ),
      sortable: true,
    },
  ]

  const actions = (member: Member) => (
    <>
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
    </>
  )

  const activeMembers = members.filter((m) => m.status === "active").length
  const expiredMembers = members.filter((m) => m.status === "expired").length
  const pendingMembers = members.filter((m) => m.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Members Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage FOSStar memberships
          </p>
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
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{expiredMembers}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Expired Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingMembers}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Renewals</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <BulkActions
          selected={selectedMembers}
          onDelete={handleDelete}
          onExport={handleExport}
          onSendEmail={handleSendEmail}
        />
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={members}
            columns={columns}
            searchable
            searchPlaceholder="Search members by name, email, or phone..."
            searchKeys={["name", "email", "phone", "membershipId"]}
            pagination
            pageSize={10}
            selectable
            onSelectionChange={setSelectedMembers}
            loading={loading}
            emptyMessage="No members found"
            actions={actions}
          />
        </CardContent>
      </Card>
    </div>
  )
}

