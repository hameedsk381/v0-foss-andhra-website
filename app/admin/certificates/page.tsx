"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Copy, ExternalLink, Plus, RotateCcw, Trash2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CERTIFICATE_TYPES, certificateTypeLabel, defaultTitleFor } from "@/lib/certificates"

interface Certificate {
  id: string
  code: string
  name: string
  email: string | null
  type: string
  title: string
  program: string | null
  description: string | null
  startDate: string | null
  endDate: string | null
  status: string
  issuedAt: string
  revokedAt: string | null
  revokedReason: string | null
}

const emptyForm = {
  name: "",
  email: "",
  type: "internship",
  title: defaultTitleFor("internship"),
  program: "",
  description: "",
  startDate: "",
  endDate: "",
}

export default function AdminCertificatesPage() {
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      if (statusFilter !== "all") params.set("status", statusFilter)
      const r = await fetch(`/api/admin/certificates?${params.toString()}`)
      const j = await r.json()
      setCertificates(j.data || [])
    } catch {
      toast({ title: "Error", description: "Failed to load certificates", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [query, statusFilter, toast])

  useEffect(() => {
    const t = setTimeout(load, query ? 300 : 0)
    return () => clearTimeout(t)
  }, [load, query])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (c: Certificate) => {
    setEditing(c)
    setForm({
      name: c.name,
      email: c.email || "",
      type: c.type,
      title: c.title,
      program: c.program || "",
      description: c.description || "",
      startDate: c.startDate ? c.startDate.slice(0, 10) : "",
      endDate: c.endDate ? c.endDate.slice(0, 10) : "",
    })
    setDialogOpen(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      const body = {
        name: form.name,
        email: form.email || undefined,
        type: form.type,
        title: form.title || undefined,
        program: form.program || undefined,
        description: form.description || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      }
      const r = await fetch(editing ? `/api/admin/certificates/${editing.id}` : "/api/admin/certificates", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to save")
      toast({ title: editing ? "Certificate updated" : "Certificate issued", description: j.data.code })
      setDialogOpen(false)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const runAction = async (c: Certificate, body: Record<string, unknown>, message: string) => {
    try {
      const r = await fetch(`/api/admin/certificates/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Action failed")
      toast({ title: message })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Action failed", variant: "destructive" })
    }
  }

  const remove = async (c: Certificate) => {
    if (!confirm(`Permanently delete certificate ${c.code} for ${c.name}? Prefer revoking if you only want to cancel it.`)) return
    try {
      const r = await fetch(`/api/admin/certificates/${c.id}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Certificate deleted" })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  const copyLink = async (c: Certificate) => {
    try {
      await navigator.clipboard.writeText(`https://fossap.in/certificates/${c.code}`)
      toast({ title: "Public link copied" })
    } catch {
      toast({ title: "Could not copy", variant: "destructive" })
    }
  }

  const setType = (type: string) => {
    setForm((f) => ({
      ...f,
      type,
      // keep a custom title if the admin edited it away from the previous default
      title: f.title && f.title !== defaultTitleFor(f.type) ? f.title : defaultTitleFor(type),
    }))
  }

  const summary = useMemo(
    () => ({
      active: certificates.filter((c) => c.status === "active").length,
      revoked: certificates.filter((c) => c.status === "revoked").length,
    }),
    [certificates],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p className="text-sm text-gray-600">
            Issue verifiable certificates. Each gets a public verification page at fossap.in/certificates/CODE.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Issue certificate
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search name, email, code or program..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {loading ? "Loading..." : `${summary.active} active · ${summary.revoked} revoked`}
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-3 font-medium">Code</th>
                  <th className="p-3 font-medium">Recipient</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Title</th>
                  <th className="p-3 font-medium">Issued</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.id} className="border-b align-top">
                    <td className="p-3 font-mono text-xs">{c.code}</td>
                    <td className="p-3">
                      <div className="font-medium">{c.name}</div>
                      {c.email && <div className="text-xs text-gray-500">{c.email}</div>}
                      {c.program && <div className="text-xs text-gray-500">{c.program}</div>}
                    </td>
                    <td className="p-3">{certificateTypeLabel(c.type)}</td>
                    <td className="p-3">{c.title}</td>
                    <td className="p-3">{new Date(c.issuedAt).toLocaleDateString("en-IN")}</td>
                    <td className="p-3">
                      {c.status === "active" ? (
                        <Badge className="bg-green-600">Valid</Badge>
                      ) : (
                        <Badge variant="destructive">Revoked</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <a href={`/certificates/${c.code}`} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                        <Button size="sm" variant="outline" onClick={() => copyLink(c)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                          Edit
                        </Button>
                        {c.status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => {
                              const reason = prompt(`Reason for revoking ${c.code}? (shown on the public page)`) || ""
                              if (confirm(`Revoke certificate ${c.code}?`)) {
                                runAction(c, { action: "revoke", revokedReason: reason || undefined }, "Certificate revoked")
                              }
                            }}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => runAction(c, { action: "restore" }, "Certificate restored")}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => remove(c)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && certificates.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No certificates yet. Issue the first one above.
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
            <DialogTitle>{editing ? `Edit ${editing.code}` : "Issue a certificate"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="c-name">Recipient name</Label>
              <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="c-email">Email (optional)</Label>
              <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CERTIFICATE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="c-title">Certificate title</Label>
              <Input id="c-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="c-program">Program / course (optional)</Label>
              <Input
                id="c-program"
                placeholder="e.g. FOSSynC Summer Internship 2026 — Web Development"
                value={form.program}
                onChange={(e) => setForm({ ...form, program: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="c-desc">Extra line for the certificate (optional)</Label>
              <Textarea
                id="c-desc"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-start">Start date (optional)</Label>
              <Input id="c-start" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="c-end">End date (optional)</Label>
              <Input id="c-end" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={saving || form.name.trim().length < 2} onClick={save}>
              {saving ? "Saving..." : editing ? "Save changes" : "Issue certificate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
