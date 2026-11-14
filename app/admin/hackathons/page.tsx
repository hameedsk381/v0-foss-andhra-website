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

interface ProblemStatement {
  id: string
  title: string
  description: string
  difficulty: string
  sponsor: string | null
}

interface Team {
  id: string
  name: string
  leaderName: string
  leaderEmail: string
  college: string | null
  size: number
  memberNames: string | null
  problemStatementId: string | null
  status: string
  submissionUrl: string | null
  score: number | null
}

interface Hackathon {
  id: string
  slug: string
  title: string
  description: string
  theme: string | null
  status: string
  startDate: string
  endDate: string
  regDeadline: string | null
  venue: string | null
  rules: string | null
  prizes: string | null
  ProblemStatement: ProblemStatement[]
  _count: { Team: number }
}

const H_STATUS = [
  { value: "draft", label: "Draft" },
  { value: "registration_open", label: "Registration open" },
  { value: "judging", label: "Judging" },
  { value: "completed", label: "Completed" },
]

const emptyHackathon = {
  title: "",
  description: "",
  theme: "",
  status: "draft",
  startDate: "",
  endDate: "",
  regDeadline: "",
  venue: "",
  rules: "",
  prizes: "",
}

export default function AdminHackathonsPage() {
  const { toast } = useToast()
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<(Hackathon & { Team: Team[] }) | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Hackathon | null>(null)
  const [form, setForm] = useState(emptyHackathon)
  const [saving, setSaving] = useState(false)
  const [psForm, setPsForm] = useState({ title: "", description: "", difficulty: "medium", sponsor: "" })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/admin/hackathons")
      const j = await r.json()
      const data: Hackathon[] = j.data || []
      setHackathons(data)
      setSelectedId((cur) => (cur && data.some((h) => h.id === cur) ? cur : data[0]?.id ?? null))
    } catch {
      toast({ title: "Error", description: "Failed to load hackathons", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const loadDetail = useCallback(async (id: string) => {
    try {
      const r = await fetch(`/api/admin/hackathons/${id}/problems`)
      const j = await r.json()
      setDetail(j.success ? j.data : null)
    } catch {
      setDetail(null)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (selectedId) loadDetail(selectedId)
    else setDetail(null)
  }, [selectedId, loadDetail])

  const openNew = () => {
    setEditing(null)
    setForm(emptyHackathon)
    setDialogOpen(true)
  }

  const openEdit = (h: Hackathon) => {
    setEditing(h)
    setForm({
      title: h.title,
      description: h.description,
      theme: h.theme || "",
      status: h.status,
      startDate: h.startDate.slice(0, 16),
      endDate: h.endDate.slice(0, 16),
      regDeadline: h.regDeadline ? h.regDeadline.slice(0, 16) : "",
      venue: h.venue || "",
      rules: h.rules || "",
      prizes: h.prizes || "",
    })
    setDialogOpen(true)
  }

  const toIso = (s: string) => (s ? new Date(s).toISOString() : undefined)

  const save = async () => {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        title: form.title,
        description: form.description,
        theme: form.theme || undefined,
        status: form.status,
        startDate: toIso(form.startDate),
        endDate: toIso(form.endDate),
        venue: form.venue || undefined,
        rules: form.rules || undefined,
        prizes: form.prizes || undefined,
      }
      if (form.regDeadline) body.regDeadline = toIso(form.regDeadline)
      const r = await fetch(editing ? `/api/admin/hackathons/${editing.id}` : "/api/admin/hackathons", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to save")
      toast({ title: editing ? "Hackathon updated" : "Hackathon created" })
      setDialogOpen(false)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const deleteHackathon = async (h: Hackathon) => {
    if (!confirm(`Delete "${h.title}" and all its problem statements and team registrations?`)) return
    try {
      const r = await fetch(`/api/admin/hackathons/${h.id}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Hackathon deleted" })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  const addProblem = async () => {
    if (!selectedId) return
    setSaving(true)
    try {
      const r = await fetch(`/api/admin/hackathons/${selectedId}/problems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: psForm.title,
          description: psForm.description,
          difficulty: psForm.difficulty,
          sponsor: psForm.sponsor || undefined,
        }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to add")
      setPsForm({ title: "", description: "", difficulty: "medium", sponsor: "" })
      loadDetail(selectedId)
      toast({ title: "Problem statement added" })
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to add", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const removeProblem = async (psId: string) => {
    if (!selectedId) return
    try {
      const r = await fetch(`/api/admin/hackathons/${selectedId}/problems?problemId=${psId}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      loadDetail(selectedId)
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  const updateTeam = async (teamId: string, body: Record<string, unknown>, message: string) => {
    if (!selectedId) return
    try {
      const r = await fetch(`/api/admin/hackathons/${selectedId}/teams`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, ...body }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Update failed")
      toast({ title: message })
      loadDetail(selectedId)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Update failed", variant: "destructive" })
    }
  }

  const deleteTeam = async (teamId: string) => {
    if (!selectedId || !confirm("Delete this team registration?")) return
    try {
      const r = await fetch(`/api/admin/hackathons/${selectedId}/teams?teamId=${teamId}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Team removed" })
      loadDetail(selectedId)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  const selected = hackathons.find((h) => h.id === selectedId) ?? null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Hackathons</h1>
          <p className="text-sm text-gray-600">Manage hackathons, problem statements and team registrations.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> New hackathon
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card>
          <CardContent className="p-2">
            {loading && <p className="p-4 text-sm text-gray-500">Loading...</p>}
            {!loading && hackathons.length === 0 && <p className="p-4 text-sm text-gray-500">No hackathons yet.</p>}
            <div className="space-y-1">
              {hackathons.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedId(h.id)}
                  className={`w-full rounded-md p-3 text-left text-sm transition-colors ${
                    h.id === selectedId ? "bg-muted" : "hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{h.title}</span>
                    <Badge variant="secondary" className="shrink-0">
                      {H_STATUS.find((s) => s.value === h.status)?.label}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {h._count.Team} team{h._count.Team === 1 ? "" : "s"} · {h.ProblemStatement.length} PS
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {!selected && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-gray-500">Select a hackathon to manage it.</CardContent>
            </Card>
          )}
          {selected && detail && (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold">{selected.title}</h2>
                      <p className="text-sm text-gray-500">
                        /hackathons/{selected.slug} · {selected._count.Team} registered
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`/hackathons/${selected.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                      <Button size="sm" variant="outline" onClick={() => openEdit(selected)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteHackathon(selected)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Status:</span>
                    <Select
                      value={selected.status}
                      onValueChange={async (v) => {
                        try {
                          const r = await fetch(`/api/admin/hackathons/${selected.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: v }),
                          })
                          const j = await r.json()
                          if (!j.success) throw new Error(j.error || "Update failed")
                          toast({ title: "Status updated" })
                          load()
                          loadDetail(selected.id)
                        } catch (e) {
                          toast({ title: "Error", description: e instanceof Error ? e.message : "Update failed", variant: "destructive" })
                        }
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {H_STATUS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-3 p-4">
                  <h3 className="font-semibold">Problem statements ({detail.ProblemStatement.length})</h3>
                  {detail.ProblemStatement.map((ps) => (
                    <div key={ps.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {ps.title} <Badge variant="secondary">{ps.difficulty}</Badge>
                          {ps.sponsor && <span className="text-xs text-gray-500">({ps.sponsor})</span>}
                        </div>
                        <p className="mt-1 text-xs text-gray-600">{ps.description}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => removeProblem(ps.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="grid gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Problem statement title"
                        value={psForm.title}
                        onChange={(e) => setPsForm({ ...psForm, title: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Textarea
                        rows={2}
                        placeholder="Description"
                        value={psForm.description}
                        onChange={(e) => setPsForm({ ...psForm, description: e.target.value })}
                      />
                    </div>
                    <Select value={psForm.difficulty} onValueChange={(v) => setPsForm({ ...psForm, difficulty: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Sponsor (optional)"
                        value={psForm.sponsor}
                        onChange={(e) => setPsForm({ ...psForm, sponsor: e.target.value })}
                      />
                      <Button disabled={saving || !psForm.title.trim() || psForm.description.trim().length < 10} onClick={addProblem}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-3 p-4">
                  <h3 className="font-semibold">Teams ({detail.Team.length})</h3>
                  {detail.Team.map((t) => (
                    <div key={t.id} className="space-y-2 rounded-lg border p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            {t.name}
                            <Badge variant={t.status === "approved" ? "default" : t.status === "pending" ? "secondary" : "destructive"}>
                              {t.status}
                            </Badge>
                            {t.score !== null && <Badge className="bg-blue-600">{t.score}/100</Badge>}
                          </div>
                          <p className="text-xs text-gray-500">
                            {t.leaderName} · {t.leaderEmail} · {t.size} members{t.college ? ` · ${t.college}` : ""}
                            {t.submissionUrl && " · submitted"}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {t.status !== "approved" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateTeam(t.id, { action: "approve" }, "Team approved")}>
                              Approve
                            </Button>
                          )}
                          {t.status !== "rejected" && (
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateTeam(t.id, { action: "reject" }, "Team rejected")}>
                              Reject
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteTeam(t.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-end gap-2">
                        <div className="flex-1">
                          <Input
                            placeholder="Submission URL"
                            defaultValue={t.submissionUrl || ""}
                            onBlur={(e) => {
                              if (e.target.value !== (t.submissionUrl || "")) {
                                updateTeam(t.id, { submissionUrl: e.target.value }, "Submission saved")
                              }
                            }}
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Score"
                            defaultValue={t.score ?? ""}
                            onBlur={(e) => {
                              const v = e.target.value === "" ? null : Number(e.target.value)
                              if (v !== t.score) updateTeam(t.id, { score: v ?? 0 }, "Score saved")
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {detail.Team.length === 0 && <p className="text-sm text-gray-500">No team registrations yet.</p>}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.title}` : "New hackathon"}</DialogTitle>
          </DialogHeader>
          <div className="grid max-h-[65vh] gap-3 overflow-y-auto pr-1">
            <div>
              <Label htmlFor="h-title">Title *</Label>
              <Input id="h-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="h-desc">Description *</Label>
              <Textarea id="h-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="h-theme">Theme</Label>
                <Input id="h-theme" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="h-venue">Venue</Label>
                <Input id="h-venue" placeholder="Online or physical venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="h-start">Starts *</Label>
                <Input id="h-start" type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="h-end">Ends *</Label>
                <Input id="h-end" type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="h-reg">Registration deadline</Label>
                <Input id="h-reg" type="datetime-local" value={form.regDeadline} onChange={(e) => setForm({ ...form, regDeadline: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {H_STATUS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="h-prizes">Prizes</Label>
              <Input id="h-prizes" placeholder="e.g. ₹50,000 pool + mentorship" value={form.prizes} onChange={(e) => setForm({ ...form, prizes: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="h-rules">Rules</Label>
              <Textarea id="h-rules" rows={4} value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={saving || !form.title.trim() || form.description.trim().length < 10 || !form.startDate || !form.endDate}
              onClick={save}
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Create hackathon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
