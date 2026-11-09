"use client"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ApplyForm({ openingId, heading }: { openingId?: string; heading?: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", resumeUrl: "", profileUrl: "", coverLetter: "" })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openingId,
          ...form,
          resumeUrl: form.resumeUrl || undefined,
          profileUrl: form.profileUrl || undefined,
          coverLetter: form.coverLetter || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) setDone(true)
      else setError(data.error || "Something went wrong. Please try again.")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
        <p className="font-semibold text-green-900">Application received</p>
        <p className="mt-1 text-sm text-green-800">Thank you. Our team will review it and get in touch.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {heading && <h2 className="text-xl font-semibold">{heading}</h2>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="career-name">Full name *</Label>
          <Input id="career-name" value={form.name} onChange={set("name")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="career-email">Email *</Label>
          <Input id="career-email" type="email" value={form.email} onChange={set("email")} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="career-phone">Phone *</Label>
        <Input id="career-phone" value={form.phone} onChange={set("phone")} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="career-resume">Resume link</Label>
          <Input
            id="career-resume"
            type="url"
            placeholder="https://drive.google.com/..."
            value={form.resumeUrl}
            onChange={set("resumeUrl")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="career-profile">GitHub / LinkedIn / portfolio</Label>
          <Input
            id="career-profile"
            type="url"
            placeholder="https://github.com/you"
            value={form.profileUrl}
            onChange={set("profileUrl")}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="career-cover">Why are you interested?</Label>
        <Textarea
          id="career-cover"
          rows={5}
          maxLength={4000}
          value={form.coverLetter}
          onChange={set("coverLetter")}
          placeholder="Tell us about yourself and any FOSS contributions."
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          "Submit application"
        )}
      </Button>
    </form>
  )
}
