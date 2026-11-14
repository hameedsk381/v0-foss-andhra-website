"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface MentorOption {
  id: string
  name: string
  headline: string
}

export function MentorshipRequestForm({
  mentors,
  prefill,
}: {
  mentors: MentorOption[]
  prefill: { name: string; email: string }
}) {
  const [form, setForm] = useState({ mentorId: "", goals: "", background: "" })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch("/api/mentors/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: form.mentorId || undefined,
          goals: form.goals,
          background: form.background || undefined,
        }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to submit request")
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Card className="border-green-300 bg-green-50/50">
        <CardContent className="space-y-2 py-8 text-center">
          <p className="font-semibold text-green-700">Request received!</p>
          <p className="text-sm text-gray-600">
            Our team reviews mentorship requests weekly and will match you with a mentor. You can submit a new request
            once this one is completed.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <p className="text-xs text-gray-500">
          Requesting as <strong>{prefill.name}</strong> ({prefill.email})
        </p>
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <Label htmlFor="mr-mentor">Preferred mentor (optional)</Label>
            <Select value={form.mentorId} onValueChange={(v) => setForm({ ...form, mentorId: v })}>
              <SelectTrigger id="mr-mentor">
                <SelectValue placeholder="Match me with anyone suitable" />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} — {m.headline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mr-goals">What do you want to work on? *</Label>
            <Textarea
              id="mr-goals"
              rows={3}
              required
              maxLength={2000}
              placeholder="e.g. Make my first contribution to a Python project, prepare for GSoC, or learn Linux system administration..."
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="mr-bg">Your background (optional)</Label>
            <Textarea
              id="mr-bg"
              rows={2}
              maxLength={1000}
              placeholder="e.g. 2nd year CSE student, comfortable with Python and Git basics"
              value={form.background}
              onChange={(e) => setForm({ ...form, background: e.target.value })}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Request mentorship"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
