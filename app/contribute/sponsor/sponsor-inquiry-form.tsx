"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const tiers = [
  { value: "platinum", label: "Platinum (₹5,00,000+)" },
  { value: "gold", label: "Gold (₹2.5–5 L)" },
  { value: "silver", label: "Silver (₹1–2.5 L)" },
  { value: "bronze", label: "Bronze (₹50k–1 L)" },
  { value: "custom", label: "Custom / in-kind" },
]

const initialForm = {
  organization: "",
  contactName: "",
  email: "",
  phone: "",
  tier: "custom",
  budget: "",
  message: "",
}

export function SponsorInquiryForm() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch("/api/sponsor/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget: form.budget || undefined, phone: form.phone || undefined }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to submit")
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Card id="inquiry" className="border-primary/40">
        <CardContent className="space-y-2 py-10 text-center">
          <p className="text-lg font-semibold text-green-700">Thank you — inquiry received!</p>
          <p className="text-sm text-gray-600">
            Our sponsorship team will get back to you within 3–5 working days at <strong>{form.email}</strong>.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card id="inquiry" className="scroll-mt-20">
      <CardHeader>
        <CardTitle>Tell us about your organisation</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <div className="sm:col-span-2">
            <Label htmlFor="sp-org">Organisation *</Label>
            <Input id="sp-org" required value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="sp-name">Contact person *</Label>
            <Input id="sp-name" required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="sp-email">Work email *</Label>
            <Input id="sp-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="sp-phone">Phone</Label>
            <Input id="sp-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label>Tier of interest</Label>
            <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tiers.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="sp-msg">What would you like to support? *</Label>
            <Textarea
              id="sp-msg"
              rows={4}
              required
              maxLength={2000}
              placeholder="e.g. Sponsoring install fests at 10 colleges, a hackathon prize pool, or student scholarships..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit sponsorship inquiry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
