"use client"

import { useCallback, useEffect, useState } from "react"
import { ExternalLink, Plus, Star, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CONTENT_STATUSES } from "@/lib/learning"
import { RESOURCE_ACCESS, RESOURCE_CATEGORIES, resourceCategoryLabel } from "@/lib/resources"

interface ResourceItem {
  id: string
  slug: string
  title: string
  description: string
  category: string
  format: string | null
  externalUrl: string
  sizeLabel: string | null
  access: string
  featured: boolean
  downloadCount: number
  status: string
}

const emptyForm = {
  title: "",
  description: "",
  category: "guide",
  format: "",
  externalUrl: "",
  sizeLabel: "",
  access: "public",
  featured: false,
  status: "draft",
}

export default function AdminResourcesPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ResourceItem | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/admin/resources${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`)
      const j = await r.json()
      setItems(j.data || [])
    } catch {
      toast({ title: "Error", description: "Failed to load resources", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [query, toast])

  useEffect(() => {
    const t = setTimeout(load, query ? 300 : 0)
    return () => clearTimeout(t)
  }, [load, query])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (i: ResourceItem) => {
    setEditing(i)
    setForm({
      title: i.title,
      description: i.description,
      category: i.category,
      format: i.format || "",
      externalUrl: i.externalUrl,
      sizeLabel: i.sizeLabel || "",
      access: i.access,
      featured: i.featured,
      status: i.status,
    })
    setDialogOpen(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      const r = await fetch(editing ? `/api/admin/resources/${editing.id}` : "/api/admin/resources", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          format: form.format || undefined,
          externalUrl: form.externalUrl,
          sizeLabel: form.sizeLabel || undefined,
          access: form.access,
          featured: form.featured,
          status: form.status,
        }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to save")
      toast({ title: editing ? "Resource updated" : "Resource created" })
      setDialogOpen(false)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (i: ResourceItem) => {
    if (!confirm(`Delete resource "${i.title}"? Public links will stop working.`)) return
    try {
      const r = await fetch(`/api/admin/resources/${i.id}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Resource deleted" })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Resource Library</h1>
          <p className="text-sm text-gray-600">
            Manage the public resource library at fossap.in/resources. Items link to hosted files (GitHub, Drive, CDN) —
            upload binaries elsewhere and paste the URL.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> New resource
        </Button>
      </div>

      <Input
        placeholder="Search resources..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-3 font-medium">Resource</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Access</th>
                  <th className="p-3 font-medium">Opens</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className="border-b align-top">
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-medium">
                        {i.featured && <Star className="h-3 w-3 text-yellow-500" />}
                        {i.title}
                      </div>
                      <div className="text-xs text-gray-500">/resources#{i.slug}</div>
                    </td>
                    <td className="p-3">{resourceCategoryLabel(i.category)}</td>
                    <td className="p-3">{i.access === "members" ? <Badge variant="outline">Members</Badge> : <Badge variant="secondary">Public</Badge>}</td>
                    <td className="p-3">{i.downloadCount}</td>
                    <td className="p-3">
                      {i.status === "published" ? (
                        <Badge className="bg-green-600">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <a href={i.externalUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                        <Button size="sm" variant="outline" onClick={() => openEdit(i)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600" onClick={() => remove(i)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No resources yet. Add the first one.
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
            <DialogTitle>{editing ? `Edit ${editing.title}` : "New resource"}</DialogTitle>
          </DialogHeader>
          <div className="grid max-h-[65vh] gap-3 overflow-y-auto pr-1">
            <div>
              <Label htmlFor="re-title">Title *</Label>
              <Input id="re-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="re-desc">Description *</Label>
              <Textarea id="re-desc" rows={3} maxLength={1000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="re-format">Format label</Label>
                <Input id="re-format" placeholder="e.g. PDF, PPTX, ZIP" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="re-url">External URL *</Label>
              <Input id="re-url" type="url" placeholder="https://github.com/... or Drive link" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="re-size">Size label</Label>
                <Input id="re-size" placeholder="e.g. 12 MB" value={form.sizeLabel} onChange={(e) => setForm({ ...form, sizeLabel: e.target.value })} />
              </div>
              <div>
                <Label>Access</Label>
                <Select value={form.access} onValueChange={(v) => setForm({ ...form, access: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_ACCESS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="re-featured">Featured</Label>
              <Switch id="re-featured" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
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
            <Button
              disabled={saving || form.title.trim().length < 3 || form.description.trim().length < 10 || !form.externalUrl.trim()}
              onClick={save}
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Create resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
