"use client"

import { useCallback, useEffect, useState } from "react"
import { ExternalLink, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CONTENT_STATUSES } from "@/lib/learning"

interface Chapter {
  id: string
  slug: string
  city: string
  district: string | null
  description: string
  meetingInfo: string | null
  coordinators: string | null
  contactEmail: string | null
  whatsappUrl: string | null
  telegramUrl: string | null
  status: string
  order: number
}

const emptyForm = {
  city: "",
  district: "",
  description: "",
  meetingInfo: "",
  coordinators: "",
  contactEmail: "",
  whatsappUrl: "",
  telegramUrl: "",
  status: "draft",
}

export default function AdminChaptersPage() {
  const { toast } = useToast()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Chapter | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/admin/chapters")
      const j = await r.json()
      setChapters(j.data || [])
    } catch {
      toast({ title: "Error", description: "Failed to load chapters", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (c: Chapter) => {
    setEditing(c)
    setForm({
      city: c.city,
      district: c.district || "",
      description: c.description,
      meetingInfo: c.meetingInfo || "",
      coordinators: c.coordinators || "",
      contactEmail: c.contactEmail || "",
      whatsappUrl: c.whatsappUrl || "",
      telegramUrl: c.telegramUrl || "",
      status: c.status,
    })
    setDialogOpen(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      const r = await fetch(editing ? `/api/admin/chapters/${editing.id}` : "/api/admin/chapters", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: form.city,
          district: form.district || undefined,
          description: form.description,
          meetingInfo: form.meetingInfo || undefined,
          coordinators: form.coordinators || undefined,
          contactEmail: form.contactEmail || undefined,
          whatsappUrl: form.whatsappUrl || undefined,
          telegramUrl: form.telegramUrl || undefined,
          status: form.status,
        }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to save")
      toast({ title: editing ? "Chapter updated" : "Chapter created" })
      setDialogOpen(false)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (c: Chapter) => {
    if (!confirm(`Delete the ${c.city} chapter? Public links to /chapters/${c.slug} will stop working.`)) return
    try {
      const r = await fetch(`/api/admin/chapters/${c.id}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Chapter deleted" })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">City Chapters</h1>
          <p className="text-sm text-gray-600">
            Manage local chapters shown at fossap.in/chapters. Published chapters get their own city page with live
            events and clubs.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> New chapter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-3 font-medium">City</th>
                  <th className="p-3 font-medium">District</th>
                  <th className="p-3 font-medium">Coordinators</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((c) => (
                  <tr key={c.id} className="border-b align-top">
                    <td className="p-3">
                      <div className="font-medium">{c.city}</div>
                      <div className="text-xs text-gray-500">/chapters/{c.slug}</div>
                    </td>
                    <td className="p-3">{c.district || "—"}</td>
                    <td className="p-3">{c.coordinators || "—"}</td>
                    <td className="p-3">
                      {c.status === "published" ? (
                        <Badge className="bg-green-600">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {c.status === "published" && (
                          <a href={`/chapters/${c.slug}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        )}
                        <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => remove(c)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && chapters.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No chapters yet. Create the first one.
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
            <DialogTitle>{editing ? `Edit ${editing.city}` : "New chapter"}</DialogTitle>
          </DialogHeader>
          <div className="grid max-h-[65vh] gap-3 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ch-city">City *</Label>
                <Input id="ch-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="ch-district">District</Label>
                <Input id="ch-district" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="ch-desc">Description *</Label>
              <Textarea id="ch-desc" rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ch-meet">Meetup info</Label>
              <Input id="ch-meet" placeholder="e.g. First Sunday of the month, Yesj Centre, 10 AM" value={form.meetingInfo} onChange={(e) => setForm({ ...form, meetingInfo: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ch-coord">Coordinators</Label>
              <Input id="ch-coord" placeholder="e.g. Ravi Kumar, Priya S." value={form.coordinators} onChange={(e) => setForm({ ...form, coordinators: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ch-email">Contact email</Label>
              <Input id="ch-email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="ch-wa">WhatsApp group URL</Label>
                <Input id="ch-wa" type="url" value={form.whatsappUrl} onChange={(e) => setForm({ ...form, whatsappUrl: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="ch-tg">Telegram group URL</Label>
                <Input id="ch-tg" type="url" value={form.telegramUrl} onChange={(e) => setForm({ ...form, telegramUrl: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "published" ? "Published" : "Draft"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={saving || form.city.trim().length < 2 || form.description.trim().length < 10} onClick={save}>
              {saving ? "Saving..." : editing ? "Save changes" : "Create chapter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
