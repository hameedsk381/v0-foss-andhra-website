"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AP_DISTRICTS } from "@/lib/clubs"

const initialForm = {
  name: "",
  institution: "",
  district: "",
  location: "",
  coordinatorName: "",
  email: "",
  coordinatorPhone: "",
  members: "",
  established: "",
  description: "",
  githubUrl: "",
  websiteUrl: "",
}

export function ClubRegisterForm() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch("/api/clubs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          location: form.district && form.location ? `${form.location}, ${form.district}` : form.location || form.district,
          members: form.members,
        }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to submit registration")
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit registration")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl text-green-700">Registration submitted 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-center text-sm text-gray-600">
          <p>
            Thank you for registering <strong>{form.name}</strong>. The FOSS Andhra team reviews club registrations
            within a week. Once approved, your club gets a public page on fossap.in and enters the state-wide
            leaderboard.
          </p>
          <p>
            Questions? <Link href="/contact" className="font-semibold text-primary hover:underline">Contact us</Link>.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Register your campus club</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <div className="sm:col-span-2">
            <Label htmlFor="r-name">Club name</Label>
            <Input id="r-name" required placeholder="e.g. SRKR FOSSynC Club" value={form.name} onChange={(e) => set("name")(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="r-institution">Institution</Label>
            <Input id="r-institution" required placeholder="e.g. SRKR Engineering College, Bhimavaram" value={form.institution} onChange={(e) => set("institution")(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="r-district">District</Label>
            <Select value={form.district} onValueChange={set("district")}>
              <SelectTrigger id="r-district">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {AP_DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="r-location">Town / city (optional)</Label>
            <Input id="r-location" placeholder="e.g. Bhimavaram" value={form.location} onChange={(e) => set("location")(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="r-coord">Coordinator name</Label>
            <Input id="r-coord" required value={form.coordinatorName} onChange={(e) => set("coordinatorName")(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="r-email">Coordinator email</Label>
            <Input id="r-email" type="email" required value={form.email} onChange={(e) => set("email")(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="r-phone">Phone (optional)</Label>
            <Input id="r-phone" value={form.coordinatorPhone} onChange={(e) => set("coordinatorPhone")(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="r-members">Active members</Label>
            <Input id="r-members" type="number" min={1} required placeholder="e.g. 45" value={form.members} onChange={(e) => set("members")(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="r-established">Year the club started</Label>
            <Input id="r-established" required placeholder="e.g. 2024" value={form.established} onChange={(e) => set("established")(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="r-desc">What does your club do? (no links)</Label>
            <Textarea id="r-desc" rows={3} maxLength={1000} value={form.description} onChange={(e) => set("description")(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="r-github">GitHub URL (optional)</Label>
            <Input id="r-github" type="url" placeholder="https://github.com/..." value={form.githubUrl} onChange={(e) => set("githubUrl")(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="r-website">Website (optional)</Label>
            <Input id="r-website" type="url" placeholder="https://..." value={form.websiteUrl} onChange={(e) => set("websiteUrl")(e.target.value)} />
          </div>
          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit registration"}
            </Button>
            <p className="mt-2 text-xs text-gray-500">
              Registrations are reviewed by the FOSS Andhra team before your club appears publicly.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
