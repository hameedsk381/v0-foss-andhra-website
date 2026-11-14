"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialForm = {
  name: "",
  email: "",
  headline: "",
  expertise: "",
  bio: "",
  githubUrl: "",
  linkedinUrl: "",
  availability: "",
  maxMentees: "2",
}

export function MentorApplyForm() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch("/api/mentors/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to submit application")
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Card className="border-green-300 bg-green-50/50 p-1">
        <div className="space-y-2 p-6 text-center">
          <p className="font-semibold text-green-700">Application received!</p>
          <p className="text-sm text-gray-600">
            Thank you for offering your time. The FOSS Andhra team reviews mentor applications and will email you once
            approved.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <form className="space-y-3" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ma-name">Name *</Label>
              <Input id="ma-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ma-email">Email *</Label>
              <Input id="ma-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="ma-headline">Headline *</Label>
            <Input
              id="ma-headline"
              required
              maxLength={150}
              placeholder="e.g. Senior engineer, contributes to GNOME; or CS professor, Linux evangelist"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="ma-expertise">Expertise (comma separated) *</Label>
            <Input
              id="ma-expertise"
              required
              maxLength={300}
              placeholder="e.g. Python, Git, Linux, web development, GSoC prep"
              value={form.expertise}
              onChange={(e) => setForm({ ...form, expertise: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="ma-bio">Short bio (optional)</Label>
            <Textarea id="ma-bio" rows={3} maxLength={1000} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ma-github">GitHub (optional)</Label>
              <Input id="ma-github" type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="ma-li">LinkedIn (optional)</Label>
              <Input id="ma-li" type="url" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ma-avail">Availability (optional)</Label>
              <Input
                id="ma-avail"
                maxLength={200}
                placeholder="e.g. Weekends, 2 hours a month"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="ma-max">Max mentees</Label>
              <Input id="ma-max" type="number" min={1} max={10} value={form.maxMentees} onChange={(e) => setForm({ ...form, maxMentees: e.target.value })} />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Apply to mentor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
