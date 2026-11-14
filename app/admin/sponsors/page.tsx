"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { tierLabel } from "@/lib/sponsors"

interface Inquiry {
  id: string
  organization: string
  contactName: string
  email: string
  phone: string | null
  tier: string
  budget: string | null
  message: string
  status: string
  notes: string | null
  createdAt: string
}

const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal", label: "Proposal sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
]

const statusBadge = (s: string) =>
  s === "won" ? "bg-green-600" : s === "lost" ? "bg-gray-500" : s === "proposal" ? "bg-blue-600" : s === "contacted" ? "bg-yellow-600" : "bg-primary"

export default function AdminSponsorsPage() {
  const { toast } = useToast()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.set("status", statusFilter)
      const r = await fetch(`/api/admin/sponsors?${params.toString()}`)
      const j = await r.json()
      setInquiries(j.data || [])
    } catch {
      toast({ title: "Error", description: "Failed to load inquiries", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, toast])

  useEffect(() => {
    load()
  }, [load])

  const setInquiryStatus = async (inq: Inquiry, status: string) => {
    try {
      const r = await fetch(`/api/admin/sponsors/${inq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Update failed")
      toast({ title: `Marked as ${STATUSES.find((s) => s.value === status)?.label}` })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Update failed", variant: "destructive" })
    }
  }

  const newCount = inquiries.filter((i) => i.status === "new").length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Sponsorship Pipeline</h1>
          <p className="text-sm text-gray-600">
            Inquiries from the sponsor form on /contribute/sponsor. Move each one through: New → Contacted → Proposal → Won/Lost.
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && inquiries.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-gray-500">No sponsorship inquiries yet.</CardContent>
          </Card>
        )}
        {inquiries.map((i) => (
          <Card key={i.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{i.organization}</span>
                    <Badge variant="secondary">{tierLabel(i.tier)}</Badge>
                    <Badge className={statusBadge(i.status)}>{STATUSES.find((s) => s.value === i.status)?.label ?? i.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {i.contactName} · <a href={`mailto:${i.email}`} className="text-primary hover:underline">{i.email}</a>
                    {i.phone && ` · ${i.phone}`}
                    {i.budget && ` · Budget: ${i.budget}`}
                  </p>
                </div>
                <Select value={i.status} onValueChange={(v) => setInquiryStatus(i, v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-gray-700">{i.message}</p>
              {i.notes && <p className="text-xs text-gray-500">Notes: {i.notes}</p>}
              <p className="text-xs text-gray-400">{new Date(i.createdAt).toLocaleString("en-IN")}</p>
            </CardContent>
          </Card>
        ))}
        {!loading && newCount > 0 && statusFilter !== "new" && (
          <p className="text-xs text-gray-500">{newCount} new inquir{newCount === 1 ? "y" : "ies"} in this view.</p>
        )}
      </div>
    </div>
  )
}
