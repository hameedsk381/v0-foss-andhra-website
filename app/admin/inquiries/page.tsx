"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable, Column } from "@/components/admin/data-table"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Mail, CheckCircle, Search, Trash2 } from "lucide-react"

interface Inquiry {
    id: string
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    status: string
    createdAt: string
}

export default function InquiriesManagement() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("all")
    const { toast } = useToast()

    useEffect(() => {
        fetchInquiries()
    }, [])

    const fetchInquiries = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/inquiries")
            const data = await res.json()
            if (data.success) {
                setInquiries(data.data)
            }
        } catch (error) {
            console.error("Error fetching inquiries:", error)
            toast({
                title: "Error",
                description: "Failed to fetch inquiries",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/inquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            const data = await res.json()
            if (data.success) {
                setInquiries((prev) =>
                    prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
                )
                toast({
                    title: "Status Updated",
                    description: `Inquiry marked as ${status}`,
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this inquiry?")) return

        try {
            const res = await fetch(`/api/admin/inquiries/${id}`, {
                method: "DELETE",
            })
            const data = await res.json()
            if (data.success) {
                setInquiries((prev) => prev.filter((inq) => inq.id !== id))
                toast({
                    title: "Deleted",
                    description: "Inquiry deleted successfully",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete inquiry",
                variant: "destructive",
            })
        }
    }

    const filteredInquiries = inquiries.filter((inq) =>
        statusFilter === "all" ? true : inq.status === statusFilter
    )

    const columns: Column<Inquiry>[] = [
        {
            id: "name",
            header: "From",
            accessor: (inq) => (
                <div>
                    <div className="font-medium">{inq.name}</div>
                    <div className="text-xs text-gray-500">{inq.email}</div>
                    {inq.phone && <div className="text-xs text-gray-400">{inq.phone}</div>}
                </div>
            ),
            sortable: true,
        },
        {
            id: "message",
            header: "Message",
            accessor: (inq) => (
                <div className="max-w-md">
                    <div className="font-medium mb-1">{inq.subject}</div>
                    <div className="text-sm text-gray-600 line-clamp-2">{inq.message}</div>
                </div>
            ),
        },
        {
            id: "createdAt",
            header: "Date",
            accessor: (inq) => format(new Date(inq.createdAt), "MMM dd, yyyy HH:mm"),
            sortable: true,
        },
        {
            id: "status",
            header: "Status",
            accessor: (inq) => (
                <Badge
                    className={
                        inq.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : inq.status === "read"
                                ? "bg-yellow-100 text-yellow-800"
                                : inq.status === "replied"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                    }
                >
                    {inq.status}
                </Badge>
            ),
            sortable: true,
        },
    ]

    const actions = (inq: Inquiry) => (
        <div className="flex items-center gap-2">
            {inq.status === "new" && (
                <Button
                    variant="ghost"
                    size="sm"
                    title="Mark as Read"
                    onClick={() => handleStatusUpdate(inq.id, "read")}
                >
                    <CheckCircle className="h-4 w-4" />
                </Button>
            )}
            <Button
                variant="ghost"
                size="sm"
                title="Reply"
                onClick={() => window.location.href = `mailto:${inq.email}?subject=Re: ${inq.subject}`}
            >
                <Mail className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                title="Delete"
                onClick={() => handleDelete(inq.id)}
                className="text-red-600"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-gray-600 mt-1">Manage contact form submissions</p>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Inquiries List</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="replied">Replied</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={filteredInquiries}
                        columns={columns}
                        searchable
                        searchPlaceholder="Search by name, email, or subject..."
                        searchKeys={["name", "email", "subject"]}
                        pagination
                        pageSize={10}
                        loading={loading}
                        emptyMessage="No inquiries found"
                        actions={actions}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
