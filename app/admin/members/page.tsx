"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Download, Mail, CheckCircle, XCircle, Eye, Edit, Plus, Trash2, Save } from "lucide-react"
import { DataTable, Column } from "@/components/admin/data-table"
import { BulkActions } from "@/components/admin/bulk-actions"
import { exportToCSV } from "@/components/admin/export-utils"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  membershipType: string
  status: string
  joinDate: string
  expiryDate: string
  organization: string | null
  membershipId: string
  designation?: string
  experience?: string
  interests?: string
}

export default function MembersManagement() {
  const [filter, setFilter] = useState("all")
  const [membershipTypeFilter, setMembershipTypeFilter] = useState("all")
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    membershipType: "FOSStar Annual",
    status: "active",
    organization: "",
    designation: "",
    expiryDate: "",
    experience: "",
    interests: "",
  })

  useEffect(() => {
    fetchMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, membershipTypeFilter])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== "all") params.append("status", filter)
      if (membershipTypeFilter !== "all") params.append("type", membershipTypeFilter)

      const res = await fetch(`/api/admin/members?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setMembers(data.data)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter members based on status and type locally if needed (though API does it)
  const filteredMembers = useMemo(() => {
    return members
  }, [members]) // Filtering is done via API calls in this implementation

  const openNewMemberDialog = () => {
    setEditingMember(null)
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    setMemberForm({
      name: "",
      email: "",
      phone: "",
      membershipType: "FOSStar Annual",
      status: "active",
      organization: "",
      designation: "",
      expiryDate: oneYearFromNow.toISOString().split('T')[0],
      experience: "",
      interests: "",
    })
    setShowDialog(true)
  }

  const openEditMemberDialog = (member: Member) => {
    setEditingMember(member)
    setMemberForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
      status: member.status,
      organization: member.organization || "",
      designation: member.designation || "",
      expiryDate: member.expiryDate ? new Date(member.expiryDate).toISOString().split('T')[0] : "",
      experience: member.experience || "",
      interests: member.interests || "",
    })
    setShowDialog(true)
  }

  const saveMember = async () => {
    if (!memberForm.name || !memberForm.email || !memberForm.phone) {
      toast({
        title: "Validation Error",
        description: "Name, Email, and Phone are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const method = editingMember ? "PUT" : "POST"

      const body: any = { ...memberForm }
      if (editingMember) {
        body.id = editingMember.id
        // Ensure dates are properly formatted if needed, or rely on API parsing
        if (memberForm.expiryDate) {
          body.expiryDate = new Date(memberForm.expiryDate).toISOString()
        }
      }

      const res = await fetch("/api/admin/members", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Member ${editingMember ? "updated" : "created"} successfully`,
        })
        setShowDialog(false)
        fetchMembers()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error saving member:", error)
      toast({
        title: "Error",
        description: `Failed to ${editingMember ? "update" : "create"} member`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (ids: string[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} member(s)?`)) return

    try {
      const res = await fetch("/api/admin/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
      const data = await res.json()
      if (data.success) {
        toast({
          title: "Success",
          description: `${ids.length} member(s) deleted`,
        })
        fetchMembers()
        setSelectedMembers([])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete members",
        variant: "destructive",
      })
    }
  }

  const handleExport = (items: Member[]) => {
    const columns = [
      { key: "name" as keyof Member, header: "Name" },
      { key: "email" as keyof Member, header: "Email" },
      { key: "phone" as keyof Member, header: "Phone" },
      { key: "membershipType" as keyof Member, header: "Membership Type" },
      { key: "status" as keyof Member, header: "Status" },
      { key: "organization" as keyof Member, header: "Organization" },
      { key: "membershipId" as keyof Member, header: "Membership ID" },
      { key: "joinDate" as keyof Member, header: "Join Date" },
      { key: "expiryDate" as keyof Member, header: "Expiry Date" },
    ]
    exportToCSV(items, columns, { filename: "members" })
    toast({
      title: "Export Started",
      description: `Exporting ${items.length} members to CSV`,
    })
  }

  const handleSendEmail = async (items: Member[]) => {
    if (items.length === 0) {
      toast({
        title: "No Recipients",
        description: "Select at least one member to send email.",
        variant: "destructive",
      })
      return
    }

    const bcc = items.map((member) => member.email).join(",")
    window.location.href = `mailto:?bcc=${encodeURIComponent(bcc)}`
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
      header: "Joined",
      accessor: (member) => format(new Date(member.joinDate), "MMM dd, yyyy"),
      sortable: true,
    },
    {
      id: "expiryDate",
      header: "Expires",
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
      <Button variant="ghost" size="sm" title="Edit" onClick={() => openEditMemberDialog(member)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Delete"
        onClick={() => handleDelete([member.id])}
        className="text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  )

  const activeMembers = members.filter((m) => m.status === "active").length
  const expiredMembers = members.filter((m) => m.status === "expired").length
  const pendingMembers = members.filter((m) => m.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">Members Management</h1>
          <p className="text-gray-600 mt-1">Manage FOSStar memberships</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button onClick={openNewMemberDialog} className="w-full bg-primary sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 xl:flex-row">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full xl:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={membershipTypeFilter} onValueChange={setMembershipTypeFilter}>
              <SelectTrigger className="w-full xl:w-[180px]">
                <SelectValue placeholder="Membership Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FOSStar Annual">FOSStar Annual</SelectItem>
                <SelectItem value="FOSStar Lifetime">FOSStar Lifetime</SelectItem>
                <SelectItem value="FOSStar Student">FOSStar Student</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden flex-1 xl:block" />
            <Button variant="outline" onClick={() => handleExport(filteredMembers)} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleSendEmail(filteredMembers)} className="w-full sm:w-auto">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <BulkActions
          selected={selectedMembers}
          onDelete={(ids) => handleDelete(ids)}
          onExport={handleExport}
          onSendEmail={handleSendEmail}
        />
      )}

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredMembers}
            columns={columns}
            searchable
            searchPlaceholder="Search members by name, email, phone, or membership ID..."
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

      {/* Member Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Member" : "Add New Member"}</DialogTitle>
            <DialogDescription>
              {editingMember ? "Update member details" : "Add a new member manually"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="membershipType">Membership Type *</Label>
                <Select
                  value={memberForm.membershipType}
                  onValueChange={(value) => setMemberForm({ ...memberForm, membershipType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOSStar Annual">FOSStar Annual</SelectItem>
                    <SelectItem value="FOSStar Lifetime">FOSStar Lifetime</SelectItem>
                    <SelectItem value="FOSStar Student">FOSStar Student</SelectItem>
                    <SelectItem value="Associate">Associate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={memberForm.organization}
                  onChange={(e) => setMemberForm({ ...memberForm, organization: e.target.value })}
                  placeholder="Company or College"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={memberForm.designation}
                  onChange={(e) => setMemberForm({ ...memberForm, designation: e.target.value })}
                  placeholder="Role"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={memberForm.status}
                  onValueChange={(value) => setMemberForm({ ...memberForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={memberForm.expiryDate}
                  onChange={(e) => setMemberForm({ ...memberForm, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select
                value={memberForm.experience}
                onValueChange={(value) => setMemberForm({ ...memberForm, experience: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                  <SelectItem value="expert">Expert (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Areas of Interest</Label>
              <Textarea
                id="interests"
                value={memberForm.interests}
                onChange={(e) => setMemberForm({ ...memberForm, interests: e.target.value })}
                placeholder="Member's areas of interest"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveMember} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : editingMember ? "Update Member" : "Create Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
