"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, ExternalLink, Pencil, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { clubStatusLabel } from "@/lib/clubs"

interface Club {
  id: string
  programId: string | null
  name: string
  institution: string
  location: string
  members: number
  established: string
  description: string | null
  contact: string | null
  slug: string | null
  status: string
  email: string | null
  coordinatorName: string | null
  coordinatorPhone: string | null
  githubUrl: string | null
  websiteUrl: string | null
}

const emptyForm = {
  name: "",
  institution: "",
  location: "",
  members: "0",
  established: "",
  description: "",
  email: "",
  coordinatorName: "",
  coordinatorPhone: "",
  githubUrl: "",
  websiteUrl: "",
}

export default function AdminClubsPage() {
  const { toast } = useToast()
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Club | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      if (statusFilter !== "all") params.set("status", statusFilter)
      const r = await fetch(`/api/admin/clubs?${params.toString()}`)
      const j = await r.json()
      setClubs(j.data || [])
    } catch {
      toast({ title: "Error", description: "Failed to load clubs", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [query, statusFilter, toast])

  useEffect(() => {
    const t = setTimeout(load, query ? 300 : 0)
    return () => clearTimeout(t)
  }, [load, query])

  const pendingCount = clubs.filter((c) => c.status === "pending").length

  const openEdit = (c: Club) => {
    setEditing(c)
    setForm({
      name: c.name,
      institution: c.institution,
      location: c.location,
      members: String(c.members),
      established: c.established || "",
      description: c.description || "",
      email: c.email || "",
      coordinatorName: c.coordinatorName || "",
      coordinatorPhone: c.coordinatorPhone || "",
      githubUrl: c.githubUrl || "",
      websiteUrl: c.websiteUrl || "",
    })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const r = await fetch(`/api/admin/clubs/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          institution: form.institution,
          location: form.location,
          members: form.members,
          established: form.established,
          description: form.description || undefined,
          email: form.email || undefined,
          coordinatorName: form.coordinatorName || undefined,
          coordinatorPhone: form.coordinatorPhone || undefined,
          githubUrl: form.githubUrl || undefined,
          websiteUrl: form.websiteUrl || undefined,
        }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to save")
      toast({ title: "Club updated" })
      setDialogOpen(false)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const runAction = async (c: Club, body: Record<string, unknown>, message: string) => {
    try {
      const r = await fetch(`/api/admin/clubs/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Action failed")
      toast({ title: message, description: j.data.slug ? `Public page: /clubs/${j.data.slug}` : undefined })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Action failed", variant: "destructive" })
    }
  }

  const remove = async (c: Club) => {
    if (!confirm(`Permanently delete club "${c.name}" at ${c.institution}? This cannot be undone.`)) return
    try {
      const r = await fetch(`/api/admin/clubs/${c.id}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Club deleted" })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">FOSSynC Clubs</h1>
        <p className="text-sm text-gray-600">
          Review club registrations and manage the public club directory and state-wide leaderboard at fossap.in/clubs.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search club, institution, location or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {loading ? "Loading..." : `${clubs.length} shown${pendingCount ? ` · ${pendingCount} pending` : ""}`}
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-3 font-medium">Club</th>
                  <th className="p-3 font-medium">Coordinator</th>
                  <th className="p-3 font-medium">Members</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((c) => (
                  <tr key={c.id} className="border-b align-top">
                    <td className="p-3">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.institution}</div>
                      <div className="text-xs text-gray-500">{c.location}</div>
                    </td>
                    <td className="p-3">
                      <div>{c.coordinatorName || "—"}</div>
                      {c.email && <div className="text-xs text-gray-500">{c.email}</div>}
                      {c.coordinatorPhone && <div className="text-xs text-gray-500">{c.coordinatorPhone}</div>}
                    </td>
                    <td className="p-3">{c.members}</td>
                    <td className="p-3">
                      {c.status === "approved" ? (
                        <Badge className="bg-green-600">Approved</Badge>
                      ) : c.status === "pending" ? (
                        <Badge className="bg-yellow-600">Pending</Badge>
                      ) : (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {c.status === "approved" && c.slug && (
                          <a href={`/clubs/${c.slug}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        )}
                        <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        {c.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => runAction(c, { action: "approve" }, "Club approved")}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => {
                                if (confirm(`Reject registration from ${c.institution}?`)) {
                                  runAction(c, { action: "reject" }, "Registration rejected")
                                }
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : c.status === "rejected" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => runAction(c, { action: "restore" }, "Club restored")}
                          >
                            Restore
                          </Button>
                        ) : null}
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => remove(c)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && clubs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No clubs found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.name}` : "Edit club"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="cl-name">Club name</Label>
              <Input id="cl-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="cl-inst">Institution</Label>
              <Input id="cl-inst" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cl-loc">Location</Label>
              <Input id="cl-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cl-members">Active members</Label>
              <Input id="cl-members" type="number" min={0} value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cl-est">Established (year)</Label>
              <Input id="cl-est" value={form.established} onChange={(e) => setForm({ ...form, established: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cl-email">Contact email</Label>
              <Input id="cl-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cl-coord">Coordinator name</Label>
              <Input id="cl-coord" value={form.coordinatorName} onChange={(e) => setForm({ ...form, coordinatorName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cl-phone">Coordinator phone</Label>
              <Input id="cl-phone" value={form.coordinatorPhone} onChange={(e) => setForm({ ...form, coordinatorPhone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cl-github">GitHub URL</Label>
              <Input id="cl-github" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cl-web">Website</Label>
              <Input id="cl-web" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="cl-desc">Description</Label>
              <Textarea id="cl-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={saving || form.name.trim().length < 3 || form.institution.trim().length < 3} onClick={save}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
