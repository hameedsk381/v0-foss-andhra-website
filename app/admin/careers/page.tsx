"use client"

import { useCallback, useEffect, useState } from "react"
import { Edit, ExternalLink, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  APPLICATION_STATUSES,
  OPENING_STATUSES,
  OPENING_TYPES,
  WORK_MODES,
  typeLabel,
} from "@/lib/careers"

interface Opening {
  id: string
  slug: string
  title: string
  type: string
  department: string | null
  location: string
  workMode: string
  summary: string | null
  description: string
  requirements: string | null
  benefits: string | null
  compensation: string | null
  applyDeadline: string | null
  externalApplyUrl: string | null
  featured: boolean
  status: string
  _count?: { CareerApplication: number }
}

interface Application {
  id: string
  name: string
  email: string
  phone: string
  resumeUrl: string | null
  profileUrl: string | null
  coverLetter: string | null
  status: string
  adminNotes: string | null
  createdAt: string
  CareerOpening: { title: string; type: string } | null
}

const emptyForm = {
  title: "",
  slug: "",
  type: "job",
  workMode: "onsite",
  status: "draft",
  location: "Andhra Pradesh",
  department: "",
  summary: "",
  description: "",
  requirements: "",
  benefits: "",
  compensation: "",
  applyDeadline: "",
  externalApplyUrl: "",
  featured: false,
}

const safeHref = (url: string | null) => (url && /^https?:\/\//i.test(url) ? url : undefined)

export default function CareersAdminPage() {
  const { toast } = useToast()
  const [openings, setOpenings] = useState<Opening[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Opening | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [viewing, setViewing] = useState<Application | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [o, a] = await Promise.all([
        fetch("/api/admin/careers").then((r) => r.json()),
        fetch("/api/admin/careers/applications").then((r) => r.json()),
      ])
      setOpenings(o.data || [])
      setApplications(a.data || [])
    } catch {
      toast({ title: "Error", description: "Failed to load careers data", variant: "destructive" })
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

  const openEdit = (o: Opening) => {
    setEditing(o)
    setForm({
      title: o.title,
      slug: o.slug,
      type: o.type,
      workMode: o.workMode,
      status: o.status,
      location: o.location,
      department: o.department ?? "",
      summary: o.summary ?? "",
      description: o.description,
      requirements: o.requirements ?? "",
      benefits: o.benefits ?? "",
      compensation: o.compensation ?? "",
      applyDeadline: o.applyDeadline ? o.applyDeadline.slice(0, 10) : "",
      externalApplyUrl: o.externalApplyUrl ?? "",
      featured: o.featured,
    })
    setDialogOpen(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(editing ? `/api/admin/careers/${editing.id}` : "/api/admin/careers", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save")
      toast({ title: "Saved", description: editing ? "Opening updated" : "Opening created" })
      setDialogOpen(false)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const removeOpening = async (o: Opening) => {
    if (!confirm(`Delete "${o.title}"? Its applications are kept but unlinked.`)) return
    const res = await fetch(`/api/admin/careers/${o.id}`, { method: "DELETE" })
    if (res.ok) load()
    else toast({ title: "Error", description: "Failed to delete opening", variant: "destructive" })
  }

  const setApplicationStatus = async (a: Application, status: string) => {
    const res = await fetch(`/api/admin/careers/applications/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setApplications((prev) => prev.map((x) => (x.id === a.id ? { ...x, status } : x)))
      setViewing((v) => (v && v.id === a.id ? { ...v, status } : v))
    } else {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
    }
  }

  const removeApplication = async (a: Application) => {
    if (!confirm(`Permanently delete the application from ${a.name}? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/careers/applications/${a.id}`, { method: "DELETE" })
    if (res.ok) {
      setViewing(null)
      load()
    } else {
      toast({ title: "Error", description: "Failed to delete application", variant: "destructive" })
    }
  }

  const field = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Careers</h1>
          <p className="text-muted-foreground">Manage openings, internships and applications</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> New opening
        </Button>
      </div>

      <Tabs defaultValue="openings">
        <TabsList>
          <TabsTrigger value="openings">Openings ({openings.length})</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="openings" className="mt-4 space-y-3">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading...</p>
          ) : openings.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No openings yet. Create the first one.</p>
          ) : (
            openings.map((o) => (
              <Card key={o.id}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{o.title}</h3>
                      <Badge variant="secondary">{typeLabel(o.type)}</Badge>
                      <Badge variant={o.status === "open" ? "default" : "outline"}>{o.status}</Badge>
                      {o.featured && <Badge>Featured</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">
                      /careers/{o.slug} · {o._count?.CareerApplication ?? 0} application(s)
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(o)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600" onClick={() => removeOpening(o)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-4 space-y-3">
          {loading ? (
            <p className="py-8 text-center text-gray-500">Loading...</p>
          ) : applications.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No applications yet.</p>
          ) : (
            applications.map((a) => (
              <Card key={a.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-medium">{a.name}</p>
                    <p className="text-sm text-gray-500">
                      {a.email} · {a.CareerOpening?.title ?? "General application"} ·{" "}
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={a.status} onValueChange={(v) => setApplicationStatus(a, v)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APPLICATION_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => setViewing(a)}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Opening editor */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit opening" : "New opening"}</DialogTitle>
            <DialogDescription>
              Description, requirements and benefits accept Markdown. Only &quot;open&quot; openings are public.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-title">Title *</Label>
                <Input id="c-title" value={form.title} onChange={field("title")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-slug">Slug (optional)</Label>
                <Input id="c-slug" value={form.slug} onChange={field("slug")} placeholder="auto from title" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPENING_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Work mode</Label>
                <Select value={form.workMode} onValueChange={(v) => setForm((p) => ({ ...p, workMode: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_MODES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPENING_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-location">Location *</Label>
                <Input id="c-location" value={form.location} onChange={field("location")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-dept">Team / department</Label>
                <Input id="c-dept" value={form.department} onChange={field("department")} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-comp">Compensation / stipend</Label>
                <Input id="c-comp" value={form.compensation} onChange={field("compensation")} placeholder="e.g. Unpaid, ₹10,000/month" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-deadline">Apply by</Label>
                <Input id="c-deadline" type="date" value={form.applyDeadline} onChange={field("applyDeadline")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-summary">Short summary (shown on the list)</Label>
              <Input id="c-summary" maxLength={300} value={form.summary} onChange={field("summary")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-desc">Description *</Label>
              <Textarea id="c-desc" rows={6} value={form.description} onChange={field("description")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-req">Requirements</Label>
              <Textarea id="c-req" rows={4} value={form.requirements} onChange={field("requirements")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-ben">What you get</Label>
              <Textarea id="c-ben" rows={3} value={form.benefits} onChange={field("benefits")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-ext">External apply link (optional)</Label>
              <Input
                id="c-ext"
                value={form.externalApplyUrl}
                onChange={field("externalApplyUrl")}
                placeholder="https:// — leave empty to use the built-in form"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
              />
              Feature this opening at the top of the list
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application viewer */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.name}</DialogTitle>
                <DialogDescription>
                  {viewing.CareerOpening?.title ?? "General application"} ·{" "}
                  {new Date(viewing.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Email:</strong> {viewing.email}
                </p>
                <p>
                  <strong>Phone:</strong> {viewing.phone}
                </p>
                {safeHref(viewing.resumeUrl) && (
                  <p>
                    <strong>Resume:</strong>{" "}
                    <a className="inline-flex items-center gap-1 text-primary underline" href={safeHref(viewing.resumeUrl)} target="_blank" rel="noopener noreferrer">
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                )}
                {safeHref(viewing.profileUrl) && (
                  <p>
                    <strong>Profile:</strong>{" "}
                    <a className="inline-flex items-center gap-1 text-primary underline" href={safeHref(viewing.profileUrl)} target="_blank" rel="noopener noreferrer">
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                )}
                {viewing.coverLetter && (
                  <div>
                    <strong>Why interested:</strong>
                    <p className="mt-1 whitespace-pre-wrap text-gray-700">{viewing.coverLetter}</p>
                  </div>
                )}
              </div>
              <DialogFooter className="sm:justify-between">
                <Button variant="outline" className="text-red-600" onClick={() => removeApplication(viewing)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <Select value={viewing.status} onValueChange={(v) => setApplicationStatus(viewing, v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
