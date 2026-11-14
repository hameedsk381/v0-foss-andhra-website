"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function HackathonRegisterForm({
  slug,
  problems,
}: {
  slug: string
  problems: { id: string; title: string }[]
}) {
  const [form, setForm] = useState({
    teamName: "",
    leaderName: "",
    leaderEmail: "",
    college: "",
    size: "4",
    memberNames: "",
    problemStatementId: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch(`/api/hackathons/${slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: form.teamName,
          leaderName: form.leaderName,
          leaderEmail: form.leaderEmail,
          college: form.college || undefined,
          size: form.size,
          memberNames: form.memberNames || undefined,
          problemStatementId: form.problemStatementId || undefined,
        }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to register")
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Card className="border-green-300 bg-green-50/50">
        <CardContent className="space-y-2 py-8 text-center">
          <p className="font-semibold text-green-700">Team registered!</p>
          <p className="text-sm text-gray-600">
            Your registration is being reviewed. Once approved, your team&apos;s spot is confirmed — watch{" "}
            {form.leaderEmail} for updates.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-5">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <div className="sm:col-span-2">
            <Label htmlFor="hk-team">Team name *</Label>
            <Input id="hk-team" required value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="hk-leader">Team leader name *</Label>
            <Input id="hk-leader" required value={form.leaderName} onChange={(e) => setForm({ ...form, leaderName: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="hk-email">Leader email *</Label>
            <Input id="hk-email" type="email" required value={form.leaderEmail} onChange={(e) => setForm({ ...form, leaderEmail: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="hk-college">College (optional)</Label>
            <Input id="hk-college" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="hk-size">Team size *</Label>
            <Input id="hk-size" type="number" min={1} max={6} required value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="hk-members">Other team members (comma separated)</Label>
            <Input id="hk-members" placeholder="e.g. Anjali, Ravi, Sai" value={form.memberNames} onChange={(e) => setForm({ ...form, memberNames: e.target.value })} />
          </div>
          {problems.length > 0 && (
            <div className="sm:col-span-2">
              <Label>Problem statement</Label>
              <Select value={form.problemStatementId} onValueChange={(v) => setForm({ ...form, problemStatementId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Decide later" />
                </SelectTrigger>
                <SelectContent>
                  {problems.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Register team"}
            </Button>
            <p className="mt-2 text-xs text-gray-500">Registrations are reviewed before your team is confirmed.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
