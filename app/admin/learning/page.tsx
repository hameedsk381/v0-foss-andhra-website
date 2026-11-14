"use client"

import { useCallback, useEffect, useState } from "react"
import { BookOpen, ExternalLink, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CONTENT_STATUSES, TRACK_LEVELS, levelBadgeClass, levelLabel } from "@/lib/learning"

interface Lesson {
  id: string
  slug: string
  title: string
  summary: string | null
  content: string
  durationMin: number
  status: string
  order: number
}

interface Track {
  id: string
  slug: string
  title: string
  description: string
  level: string
  estimatedHours: number | null
  status: string
  order: number
  LearningLesson: Lesson[]
}

const emptyTrackForm = { title: "", description: "", level: "beginner", estimatedHours: "", status: "draft" }
const emptyLessonForm = { title: "", summary: "", content: "", durationMin: "10", status: "draft" }

export default function AdminLearningPage() {
  const { toast } = useToast()
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [trackDialog, setTrackDialog] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [trackForm, setTrackForm] = useState(emptyTrackForm)
  const [lessonDialog, setLessonDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [lessonForm, setLessonForm] = useState(emptyLessonForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/admin/learning")
      const j = await r.json()
      const data: Track[] = j.data || []
      setTracks(data)
      setSelectedId((cur) => (cur && data.some((t) => t.id === cur) ? cur : data[0]?.id ?? null))
    } catch {
      toast({ title: "Error", description: "Failed to load learning tracks", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const selected = tracks.find((t) => t.id === selectedId) ?? null

  const openNewTrack = () => {
    setEditingTrack(null)
    setTrackForm(emptyTrackForm)
    setTrackDialog(true)
  }

  const openEditTrack = (t: Track) => {
    setEditingTrack(t)
    setTrackForm({
      title: t.title,
      description: t.description,
      level: t.level,
      estimatedHours: t.estimatedHours ? String(t.estimatedHours) : "",
      status: t.status,
    })
    setTrackDialog(true)
  }

  const saveTrack = async () => {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        title: trackForm.title,
        description: trackForm.description,
        level: trackForm.level,
        status: trackForm.status,
      }
      if (trackForm.estimatedHours) body.estimatedHours = trackForm.estimatedHours
      const r = await fetch(editingTrack ? `/api/admin/learning/${editingTrack.id}` : "/api/admin/learning", {
        method: editingTrack ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to save")
      toast({ title: editingTrack ? "Track updated" : "Track created" })
      setTrackDialog(false)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const openNewLesson = () => {
    setEditingLesson(null)
    setLessonForm(emptyLessonForm)
    setLessonDialog(true)
  }

  const openEditLesson = (l: Lesson) => {
    setEditingLesson(l)
    setLessonForm({
      title: l.title,
      summary: l.summary || "",
      content: l.content,
      durationMin: String(l.durationMin),
      status: l.status,
    })
    setLessonDialog(true)
  }

  const saveLesson = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const r = await fetch(
        editingLesson ? `/api/admin/learning/${selected.id}/lessons/${editingLesson.id}` : `/api/admin/learning/${selected.id}/lessons`,
        {
          method: editingLesson ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: lessonForm.title,
            summary: lessonForm.summary || undefined,
            content: lessonForm.content,
            durationMin: lessonForm.durationMin,
            status: lessonForm.status,
          }),
        },
      )
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to save")
      toast({ title: editingLesson ? "Lesson updated" : "Lesson created" })
      setLessonDialog(false)
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const deleteTrack = async (t: Track) => {
    if (!confirm(`Delete track "${t.title}" and all its lessons? This cannot be undone.`)) return
    try {
      const r = await fetch(`/api/admin/learning/${t.id}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Track deleted" })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  const deleteLesson = async (l: Lesson) => {
    if (!selected || !confirm(`Delete lesson "${l.title}"?`)) return
    try {
      const r = await fetch(`/api/admin/learning/${selected.id}/lessons/${l.id}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Lesson deleted" })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  const StatusBadge = ({ status }: { status: string }) =>
    status === "published" ? <Badge className="bg-green-600">Published</Badge> : <Badge variant="secondary">Draft</Badge>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Learning Hub</h1>
          <p className="text-sm text-gray-600">
            Manage learning tracks and lessons. Public pages: fossap.in/learn (only published content is shown).
          </p>
        </div>
        <Button onClick={openNewTrack}>
          <Plus className="mr-2 h-4 w-4" /> New track
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Track list */}
        <Card>
          <CardContent className="p-2">
            {loading && <p className="p-4 text-sm text-gray-500">Loading...</p>}
            {!loading && tracks.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No tracks yet. Create the first one.</p>
            )}
            <div className="space-y-1">
              {tracks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full rounded-md p-3 text-left text-sm transition-colors ${
                    t.id === selectedId ? "bg-muted" : "hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{t.title}</span>
                    <Badge variant="secondary" className={`${levelBadgeClass(t.level)} shrink-0`}>
                      {levelLabel(t.level)}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <StatusBadge status={t.status} />
                    <span>
                      {t.LearningLesson.length} lesson{t.LearningLesson.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected track + lessons */}
        <Card>
          <CardContent className="space-y-4 p-4">
            {!selected && <p className="py-8 text-center text-sm text-gray-500">Select a track to manage its lessons.</p>}
            {selected && (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{selected.title}</h2>
                    <p className="text-sm text-gray-500">/learn/{selected.slug}</p>
                    <p className="mt-1 max-w-xl text-sm text-gray-600">{selected.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/learn/${selected.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                    <Button size="sm" variant="outline" onClick={() => openEditTrack(selected)}>
                      Edit track
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteTrack(selected)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <BookOpen className="h-4 w-4" /> Lessons ({selected.LearningLesson.length})
                  </h3>
                  <Button size="sm" onClick={openNewLesson}>
                    <Plus className="mr-1 h-3 w-3" /> Add lesson
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-left">
                        <th className="p-2 font-medium">#</th>
                        <th className="p-2 font-medium">Title</th>
                        <th className="p-2 font-medium">Min</th>
                        <th className="p-2 font-medium">Status</th>
                        <th className="p-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.LearningLesson.map((l, i) => (
                        <tr key={l.id} className="border-b">
                          <td className="p-2">{i + 1}</td>
                          <td className="p-2">
                            <div className="font-medium">{l.title}</div>
                            <div className="text-xs text-gray-500">/learn/{selected.slug}/{l.slug}</div>
                          </td>
                          <td className="p-2">{l.durationMin}</td>
                          <td className="p-2">
                            <StatusBadge status={l.status} />
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <a href={`/learn/${selected.slug}/${l.slug}`} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </a>
                              <Button size="sm" variant="outline" onClick={() => openEditLesson(l)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteLesson(l)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {selected.LearningLesson.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-500">
                            No lessons yet. Add the first lesson to publish this track.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Track dialog */}
      <Dialog open={trackDialog} onOpenChange={setTrackDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTrack ? `Edit ${editingTrack.title}` : "New learning track"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="t-title">Title</Label>
              <Input id="t-title" value={trackForm.title} onChange={(e) => setTrackForm({ ...trackForm, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="t-desc">Description</Label>
              <Textarea id="t-desc" rows={3} value={trackForm.description} onChange={(e) => setTrackForm({ ...trackForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Level</Label>
                <Select value={trackForm.level} onValueChange={(v) => setTrackForm({ ...trackForm, level: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRACK_LEVELS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="t-hours">Est. hours</Label>
                <Input id="t-hours" type="number" min={1} value={trackForm.estimatedHours} onChange={(e) => setTrackForm({ ...trackForm, estimatedHours: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={trackForm.status} onValueChange={(v) => setTrackForm({ ...trackForm, status: v })}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrackDialog(false)}>
              Cancel
            </Button>
            <Button
              disabled={saving || trackForm.title.trim().length < 3 || trackForm.description.trim().length < 10}
              onClick={saveTrack}
            >
              {saving ? "Saving..." : editingTrack ? "Save changes" : "Create track"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson dialog */}
      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLesson ? `Edit ${editingLesson.title}` : "New lesson"}</DialogTitle>
          </DialogHeader>
          <div className="grid max-h-[65vh] gap-3 overflow-y-auto pr-1">
            <div>
              <Label htmlFor="l-title">Title</Label>
              <Input id="l-title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="l-summary">Summary (shown on the track page)</Label>
              <Input id="l-summary" value={lessonForm.summary} onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="l-content">Content (Markdown)</Label>
              <Textarea
                id="l-content"
                rows={14}
                className="font-mono text-xs"
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="l-duration">Duration (min)</Label>
                <Input id="l-duration" type="number" min={1} value={lessonForm.durationMin} onChange={(e) => setLessonForm({ ...lessonForm, durationMin: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={lessonForm.status} onValueChange={(v) => setLessonForm({ ...lessonForm, status: v })}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialog(false)}>
              Cancel
            </Button>
            <Button
              disabled={saving || lessonForm.title.trim().length < 3 || lessonForm.content.trim().length < 20}
              onClick={saveLesson}
            >
              {saving ? "Saving..." : editingLesson ? "Save changes" : "Create lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
