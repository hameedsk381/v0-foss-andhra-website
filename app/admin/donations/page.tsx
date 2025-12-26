"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Heart, TrendingUp, DollarSign, Eye, FileText } from "lucide-react"
import { DataTable, Column } from "@/components/admin/data-table"
import { BulkActions } from "@/components/admin/bulk-actions"
import { AdvancedFilters, FilterOption } from "@/components/admin/advanced-filters"
import { exportToCSV, printTable } from "@/components/admin/export-utils"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

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
  const [filterValues, setFilterValues] = useState({
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  })
  const [selectedDonations, setSelectedDonations] = useState<Donation[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchDonations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValues.type, filterValues.status])

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterValues.type !== "all") params.append("type", filterValues.type)
      if (filterValues.status !== "all") params.append("status", filterValues.status)

      const res = await fetch(`/api/admin/donations?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setDonations(data.data)
      }
    } catch (error) {
      console.error("Error fetching donations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch donations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter donations based on filters
  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      if (filterValues.type !== "all" && donation.type !== filterValues.type) return false
      if (filterValues.status !== "all" && donation.status !== filterValues.status) return false
      if (filterValues.dateFrom) {
        const donationDate = new Date(donation.createdAt)
        const fromDate = new Date(filterValues.dateFrom)
        if (donationDate < fromDate) return false
      }
      if (filterValues.dateTo) {
        const donationDate = new Date(donation.createdAt)
        const toDate = new Date(filterValues.dateTo)
        if (donationDate > toDate) return false
      }
      return true
    })
  }, [donations, filterValues])

  const handleExport = (items: Donation[]) => {
    const columns = [
      { key: "name" as keyof Donation, header: "Donor Name" },
      { key: "email" as keyof Donation, header: "Email" },
      { key: "amount" as keyof Donation, header: "Amount" },
      { key: "type" as keyof Donation, header: "Type" },
      { key: "status" as keyof Donation, header: "Status" },
      { key: "paymentId" as keyof Donation, header: "Payment ID" },
    ]
    exportToCSV(items, columns, { filename: "donations" })
    toast({
      title: "Export Started",
      description: `Exporting ${items.length} donations to CSV`,
    })
  }

  const handlePrint = () => {
    const columns = [
      { key: "name" as keyof Donation, header: "Donor" },
      { key: "email" as keyof Donation, header: "Email" },
      { key: "amount" as keyof Donation, header: "Amount" },
      { key: "type" as keyof Donation, header: "Type" },
      { key: "status" as keyof Donation, header: "Status" },
    ]
    printTable(filteredDonations, columns, "Donations Report")
  }

  const filterOptions: FilterOption[] = [
    {
      id: "type",
      label: "Donation Type",
      type: "select",
      options: [
        { value: "One-time", label: "One-time" },
        { value: "Monthly", label: "Monthly" },
        { value: "Recurring", label: "Recurring" },
        { value: "Program Sponsorship", label: "Program Sponsorship" },
      ],
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "completed", label: "Completed" },
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" },
      ],
    },
    {
      id: "dateFrom",
      label: "From Date",
      type: "date",
      placeholder: "Select start date",
    },
    {
      id: "dateTo",
      label: "To Date",
      type: "date",
      placeholder: "Select end date",
    },
  ]

  const columns: Column<Donation>[] = [
    {
      id: "donor",
      header: "Donor",
      accessor: (donation) => (
        <div>
          <div className="font-medium">
            {donation.anonymous ? "Anonymous" : donation.name}
          </div>
          {donation.anonymous && (
            <div className="text-xs text-gray-500">Anonymous donation</div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      accessor: (donation) => donation.email,
      sortable: true,
    },
    {
      id: "amount",
      header: "Amount",
      accessor: (donation) => (
        <div className="font-semibold text-green-600">
          ₹{donation.amount.toLocaleString()}
        </div>
      ),
      sortable: true,
    },
    {
      id: "type",
      header: "Type",
      accessor: (donation) => <Badge variant="outline">{donation.type}</Badge>,
      sortable: true,
    },
    {
      id: "date",
      header: "Date",
      accessor: (donation) => format(new Date(donation.createdAt), "MMM dd, yyyy"),
      sortable: true,
    },
    {
      id: "paymentId",
      header: "Payment ID",
      accessor: (donation) => (
        <span className="font-mono text-xs">{donation.paymentId || "N/A"}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessor: (donation) => (
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
      ),
      sortable: true,
    },
  ]

  const actions = (donation: Donation) => (
    <>
      <Button variant="ghost" size="sm" title="View">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Receipt">
        <FileText className="h-4 w-4" />
      </Button>
    </>
  )

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

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <AdvancedFilters
              filters={filterOptions}
              values={filterValues}
              onChange={(values) => setFilterValues(values as typeof filterValues)}
            />
            <div className="flex-1" />
            <Button variant="outline" onClick={handlePrint}>
              <FileText className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            <Button variant="outline" onClick={() => handleExport(filteredDonations)}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedDonations.length > 0 && (
        <BulkActions
          selected={selectedDonations}
          onExport={handleExport}
        />
      )}

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredDonations}
            columns={columns}
            searchable
            searchPlaceholder="Search donations by donor name or email..."
            searchKeys={["name", "email", "paymentId"]}
            pagination
            pageSize={10}
            selectable
            onSelectionChange={setSelectedDonations}
            loading={loading}
            emptyMessage="No donations found"
            actions={actions}
          />
        </CardContent>
      </Card>
    </div>
  )
}
