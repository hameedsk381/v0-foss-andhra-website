"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { expertiseTags, mentorStatusLabel, requestStatusLabel } from "@/lib/mentors"

interface Mentor {
  id: string
  name: string
  email: string
  headline: string
  expertise: string
  bio: string | null
  availability: string | null
  maxMentees: number
  status: string
  MentorshipRequest: { id: string; status: string }[]
}

interface MentorRequest {
  id: string
  name: string
  email: string
  memberId: string | null
  mentorId: string | null
  MentorProfile: { id: string; name: string } | null
  goals: string
  background: string | null
  status: string
  createdAt: string
}

const REQUEST_STATUSES = ["pending", "accepted", "declined", "completed", "cancelled"]

export default function AdminMentorsPage() {
  const { toast } = useToast()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [requests, setRequests] = useState<MentorRequest[]>([])
  const [approvedMentors, setApprovedMentors] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [mr, rr] = await Promise.all([
        fetch("/api/admin/mentors").then((r) => r.json()),
        fetch("/api/admin/mentor-requests").then((r) => r.json()),
      ])
      setMentors(mr.data || [])
      setRequests(rr.data || [])
      setApprovedMentors((mr.data || []).filter((m: Mentor) => m.status === "approved").map((m: Mentor) => ({ id: m.id, name: m.name })))
    } catch {
      toast({ title: "Error", description: "Failed to load mentorship data", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const runMentorAction = async (m: Mentor, body: Record<string, unknown>, message: string) => {
    try {
      const r = await fetch("/api/admin/mentors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id, ...body }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Action failed")
      toast({ title: message })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Action failed", variant: "destructive" })
    }
  }

  const deleteMentor = async (m: Mentor) => {
    if (!confirm(`Delete mentor "${m.name}" (${m.email})? Their approved profile disappears from /mentors.`)) return
    try {
      const r = await fetch(`/api/admin/mentors?id=${m.id}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Mentor deleted" })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  const updateRequest = async (req: MentorRequest, body: Record<string, unknown>, message: string) => {
    try {
      const r = await fetch("/api/admin/mentor-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: req.id, ...body }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Update failed")
      toast({ title: message })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Update failed", variant: "destructive" })
    }
  }

  const deleteRequest = async (req: MentorRequest) => {
    if (!confirm(`Delete mentorship request from ${req.name}?`)) return
    try {
      const r = await fetch(`/api/admin/mentor-requests?id=${req.id}`, { method: "DELETE" })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Delete failed")
      toast({ title: "Request deleted" })
      load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Delete failed", variant: "destructive" })
    }
  }

  const pendingMentors = mentors.filter((m) => m.status === "pending")
  const openRequests = requests.filter((r) => r.status === "pending" || r.status === "accepted")

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Mentorship</h1>
        <p className="text-sm text-gray-600">
          Approve mentor applications and match member requests at fossap.in/mentors.
        </p>
      </div>

      <Tabs defaultValue="mentors">
        <TabsList>
          <TabsTrigger value="mentors">
            Mentors {pendingMentors.length > 0 && <Badge className="ml-2 bg-yellow-600">{pendingMentors.length} pending</Badge>}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests {openRequests.length > 0 && <Badge className="ml-2 bg-blue-600">{openRequests.length} open</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="mt-4 space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && mentors.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-gray-500">No mentor applications yet.</CardContent>
            </Card>
          )}
          {mentors.map((m) => (
            <Card key={m.id}>
              <CardContent className="space-y-2 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{m.name}</span>
                      <Badge
                        variant="secondary"
                        className={
                          m.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : m.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {mentorStatusLabel(m.status)}
                      </Badge>
                      <span className="text-xs text-gray-500">{m.MentorshipRequest.length} request(s)</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {m.headline} · <a href={`mailto:${m.email}`} className="text-primary hover:underline">{m.email}</a>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {expertiseTags(m.expertise).map((tag) => (
                        <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {m.bio && <p className="mt-1 text-sm text-gray-600">{m.bio}</p>}
                    {m.availability && <p className="text-xs text-gray-500">Availability: {m.availability}</p>}
                  </div>
                  <div className="flex gap-1">
                    {m.status !== "approved" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => runMentorAction(m, { action: "approve" }, "Mentor approved")}>
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    {m.status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => {
                          if (confirm(`Reject ${m.name}? They stay hidden from /mentors.`)) {
                            runMentorAction(m, { action: "reject" }, "Mentor rejected")
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteMentor(m)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="requests" className="mt-4 space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && requests.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-gray-500">No mentorship requests yet.</CardContent>
            </Card>
          )}
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="space-y-2 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{req.name}</span>
                      <Badge variant={req.status === "pending" ? "default" : "secondary"}>
                        {requestStatusLabel(req.status)}
                      </Badge>
                      {req.mentorId && (
                        <Badge variant="outline">with {req.MentorProfile?.name ?? "mentor"}</Badge>
                      )}
                      {req.memberId && <Badge variant="outline">FOSStar</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">
                      <a href={`mailto:${req.email}`} className="text-primary hover:underline">{req.email}</a> ·{" "}
                      {new Date(req.createdAt).toLocaleDateString("en-IN")}
                    </p>
                    {req.background && <p className="mt-1 text-xs text-gray-500">Background: {req.background}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Select
                      value={req.mentorId ?? ""}
                      onValueChange={(v) => updateRequest(req, { mentorId: v }, "Mentor matched")}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Match mentor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {approvedMentors.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={req.status} onValueChange={(v) => updateRequest(req, { status: v }, "Status updated")}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REQUEST_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {requestStatusLabel(s)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteRequest(req)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{req.goals}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
