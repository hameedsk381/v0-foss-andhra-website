"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Mirrors lib/site-content.ts — keep in sync when adding fields
interface StatItem {
  value: string
  label: string
}
interface PhotoItem {
  src: string
  title: string
  sub: string
}

interface HomeContent {
  heroEyebrow: string
  heroTitle: string
  heroTitleHighlight: string
  heroSubtitle: string
  heroCtaPrimaryLabel: string
  heroCtaPrimaryHref: string
  heroCtaSecondaryLabel: string
  heroCtaSecondaryHref: string
  heroImage: string
  stats: StatItem[]
  campusNames: string[]
  aboutEyebrow: string
  aboutLead: string
  goals: { number: string; title: string; description: string }[]
  programsHeading: string
  eventsHeading: string
  eventsSubtitle: string
  eventsPrimaryLabel: string
  eventsPrimaryHref: string
  eventsSecondaryLabel: string
  eventsSecondaryHref: string
  eventTypes: { icon: string; title: string; description: string }[]
  photosHeading: string
  featuredPhoto: PhotoItem
  photos: PhotoItem[]
  valuesHeading: string
  values: { icon: string; title: string; description: string }[]
  joinHeading: string
  joinSubtitle: string
  joinPrimaryLabel: string
  joinPrimaryHref: string
  joinSecondaryLabel: string
  joinSecondaryHref: string
}

interface FooterContent {
  contactEmail: string
  contactPhone: string
  addressLine1: string
  addressLine2: string
  brandTagline: string
  joinBannerTitle: string
  joinBannerBody: string
  joinBannerCtaLabel: string
  joinBannerCtaHref: string
  copyrightNote: string
}

const ICON_OPTIONS = [
  { value: "book-open", label: "Book" },
  { value: "shield-check", label: "Shield" },
  { value: "heart", label: "Heart" },
  { value: "globe", label: "Globe" },
  { value: "users", label: "Users" },
  { value: "calendar", label: "Calendar" },
  { value: "map-pin", label: "Map pin" },
]

export default function SiteContentPage() {
  const { toast } = useToast()
  const [home, setHome] = useState<HomeContent | null>(null)
  const [footer, setFooter] = useState<FooterContent | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/site-content")
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to load")
      setHome(j.data.home)
      setFooter(j.data.footer)
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to load", variant: "destructive" })
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const save = async (key: "site.home" | "site.footer", value: unknown, label: string) => {
    setSaving(true)
    try {
      const r = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.error || "Failed to save")
      toast({ title: `${label} saved`, description: "Changes are live immediately." })
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (!home || !footer) {
    return <p className="text-sm text-gray-500">Loading site content...</p>
  }

  // Field helpers
  const str = (v: string) => v || ""

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Site content</h1>
        <p className="text-sm text-gray-600">
          Edit the homepage and footer without touching code. Changes go live immediately.
        </p>
      </div>

      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">Homepage</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* ── Homepage ── */}
        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Eyebrow</Label>
                <Input value={str(home.heroEyebrow)} onChange={(e) => setHome({ ...home, heroEyebrow: e.target.value })} />
              </div>
              <div>
                <Label>Hero image (path)</Label>
                <Input value={str(home.heroImage)} onChange={(e) => setHome({ ...home, heroImage: e.target.value })} placeholder="/gallery/..." />
              </div>
              <div>
                <Label>Title (before highlight)</Label>
                <Input value={str(home.heroTitle)} onChange={(e) => setHome({ ...home, heroTitle: e.target.value })} />
              </div>
              <div>
                <Label>Title (highlighted words)</Label>
                <Input value={str(home.heroTitleHighlight)} onChange={(e) => setHome({ ...home, heroTitleHighlight: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Subtitle</Label>
                <Textarea rows={2} value={str(home.heroSubtitle)} onChange={(e) => setHome({ ...home, heroSubtitle: e.target.value })} />
              </div>
              <div>
                <Label>Primary button label</Label>
                <Input value={str(home.heroCtaPrimaryLabel)} onChange={(e) => setHome({ ...home, heroCtaPrimaryLabel: e.target.value })} />
              </div>
              <div>
                <Label>Primary button link</Label>
                <Input value={str(home.heroCtaPrimaryHref)} onChange={(e) => setHome({ ...home, heroCtaPrimaryHref: e.target.value })} />
              </div>
              <div>
                <Label>Secondary button label</Label>
                <Input value={str(home.heroCtaSecondaryLabel)} onChange={(e) => setHome({ ...home, heroCtaSecondaryLabel: e.target.value })} />
              </div>
              <div>
                <Label>Secondary button link</Label>
                <Input value={str(home.heroCtaSecondaryHref)} onChange={(e) => setHome({ ...home, heroCtaSecondaryHref: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats chips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {home.stats.map((s, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="w-32">
                    <Label>Value</Label>
                    <Input value={s.value} onChange={(e) => {
                      const stats = [...home.stats]
                      stats[i] = { ...stats[i], value: e.target.value }
                      setHome({ ...home, stats })
                    }} />
                  </div>
                  <div className="flex-1">
                    <Label>Label</Label>
                    <Input value={s.label} onChange={(e) => {
                      const stats = [...home.stats]
                      stats[i] = { ...stats[i], label: e.target.value }
                      setHome({ ...home, stats })
                    }} />
                  </div>
                  <Button variant="outline" className="text-red-600" onClick={() => setHome({ ...home, stats: home.stats.filter((_, x) => x !== i) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setHome({ ...home, stats: [...home.stats, { value: "", label: "" }] })}>
                <Plus className="mr-2 h-4 w-4" /> Add stat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campus ticker</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>One campus per line</Label>
              <Textarea
                rows={6}
                value={home.campusNames.join("\n")}
                onChange={(e) => setHome({ ...home, campusNames: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About & goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Eyebrow</Label>
                <Input value={str(home.aboutEyebrow)} onChange={(e) => setHome({ ...home, aboutEyebrow: e.target.value })} />
              </div>
              <div>
                <Label>Lead paragraph</Label>
                <Textarea rows={2} value={str(home.aboutLead)} onChange={(e) => setHome({ ...home, aboutLead: e.target.value })} />
              </div>
              {home.goals.map((g, i) => (
                <div key={i} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[80px_1fr]">
                  <div>
                    <Label>No.</Label>
                    <Input value={g.number} onChange={(e) => {
                      const goals = [...home.goals]
                      goals[i] = { ...goals[i], number: e.target.value }
                      setHome({ ...home, goals })
                    }} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Title</Label>
                        <Input value={g.title} onChange={(e) => {
                          const goals = [...home.goals]
                          goals[i] = { ...goals[i], title: e.target.value }
                          setHome({ ...home, goals })
                        }} />
                      </div>
                      <Button variant="outline" className="text-red-600" onClick={() => setHome({ ...home, goals: home.goals.filter((_, x) => x !== i) })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea rows={2} value={g.description} onChange={(e) => {
                        const goals = [...home.goals]
                        goals[i] = { ...goals[i], description: e.target.value }
                        setHome({ ...home, goals })
                      }} />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setHome({ ...home, goals: [...home.goals, { number: String(home.goals.length + 1).padStart(2, "0"), title: "", description: "" }] })}>
                <Plus className="mr-2 h-4 w-4" /> Add goal
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Programs & events sections</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Programs heading</Label>
                <Input value={str(home.programsHeading)} onChange={(e) => setHome({ ...home, programsHeading: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Events heading</Label>
                <Input value={str(home.eventsHeading)} onChange={(e) => setHome({ ...home, eventsHeading: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Events subtitle</Label>
                <Textarea rows={2} value={str(home.eventsSubtitle)} onChange={(e) => setHome({ ...home, eventsSubtitle: e.target.value })} />
              </div>
              <div>
                <Label>Events primary label</Label>
                <Input value={str(home.eventsPrimaryLabel)} onChange={(e) => setHome({ ...home, eventsPrimaryLabel: e.target.value })} />
              </div>
              <div>
                <Label>Events primary link</Label>
                <Input value={str(home.eventsPrimaryHref)} onChange={(e) => setHome({ ...home, eventsPrimaryHref: e.target.value })} />
              </div>
              <div>
                <Label>Events secondary label</Label>
                <Input value={str(home.eventsSecondaryLabel)} onChange={(e) => setHome({ ...home, eventsSecondaryLabel: e.target.value })} />
              </div>
              <div>
                <Label>Events secondary link</Label>
                <Input value={str(home.eventsSecondaryHref)} onChange={(e) => setHome({ ...home, eventsSecondaryHref: e.target.value })} />
              </div>
              {home.eventTypes.map((t, i) => (
                <div key={i} className="grid gap-2 rounded-lg border p-3 sm:col-span-2 sm:grid-cols-[140px_1fr_auto]">
                  <div>
                    <Label>Icon</Label>
                    <select
                      className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      value={t.icon}
                      onChange={(e) => {
                        const eventTypes = [...home.eventTypes]
                        eventTypes[i] = { ...eventTypes[i], icon: e.target.value }
                        setHome({ ...home, eventTypes })
                      }}
                    >
                      {ICON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Label" value={t.title} onChange={(e) => {
                      const eventTypes = [...home.eventTypes]
                      eventTypes[i] = { ...eventTypes[i], title: e.target.value }
                      setHome({ ...home, eventTypes })
                    }} />
                    <Input placeholder="Description" value={t.description} onChange={(e) => {
                      const eventTypes = [...home.eventTypes]
                      eventTypes[i] = { ...eventTypes[i], description: e.target.value }
                      setHome({ ...home, eventTypes })
                    }} />
                  </div>
                  <Button variant="outline" className="text-red-600" onClick={() => setHome({ ...home, eventTypes: home.eventTypes.filter((_, x) => x !== i) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="sm:col-span-2">
                <Button variant="outline" size="sm" onClick={() => setHome({ ...home, eventTypes: [...home.eventTypes, { icon: "calendar", title: "", description: "" }] })}>
                  <Plus className="mr-2 h-4 w-4" /> Add event type
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="sm:col-span-2">
                <Label>Heading</Label>
                <Input value={str(home.photosHeading)} onChange={(e) => setHome({ ...home, photosHeading: e.target.value })} />
              </div>
              <p className="text-xs text-gray-500">
                Featured photo (large tile) + 4 small tiles. Image paths start with &quot;/&quot; — upload files in
                Content &rarr; Media first, then paste the path here.
              </p>
              <div className="grid gap-2 rounded-lg border p-3">
                <Label>Featured photo</Label>
                <Input placeholder="Image path" value={home.featuredPhoto.src} onChange={(e) => setHome({ ...home, featuredPhoto: { ...home.featuredPhoto, src: e.target.value } })} />
                <Input placeholder="Title" value={home.featuredPhoto.title} onChange={(e) => setHome({ ...home, featuredPhoto: { ...home.featuredPhoto, title: e.target.value } })} />
                <Input placeholder="Caption" value={home.featuredPhoto.sub} onChange={(e) => setHome({ ...home, featuredPhoto: { ...home.featuredPhoto, sub: e.target.value } })} />
              </div>
              {home.photos.map((p, i) => (
                <div key={i} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto]">
                  <Input placeholder="Image path" value={p.src} onChange={(e) => {
                    const photos = [...home.photos]
                    photos[i] = { ...photos[i], src: e.target.value }
                    setHome({ ...home, photos })
                  }} />
                  <div className="space-y-2">
                    <Input placeholder="Title" value={p.title} onChange={(e) => {
                      const photos = [...home.photos]
                      photos[i] = { ...photos[i], title: e.target.value }
                      setHome({ ...home, photos })
                    }} />
                    <Input placeholder="Caption" value={p.sub} onChange={(e) => {
                      const photos = [...home.photos]
                      photos[i] = { ...photos[i], sub: e.target.value }
                      setHome({ ...home, photos })
                    }} />
                  </div>
                  <Button variant="outline" className="text-red-600" onClick={() => setHome({ ...home, photos: home.photos.filter((_, x) => x !== i) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setHome({ ...home, photos: [...home.photos, { src: "", title: "", sub: "" }] })}>
                <Plus className="mr-2 h-4 w-4" /> Add photo tile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Heading</Label>
                <Input value={str(home.valuesHeading)} onChange={(e) => setHome({ ...home, valuesHeading: e.target.value })} />
              </div>
              {home.values.map((v, i) => (
                <div key={i} className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[140px_1fr_auto]">
                  <div>
                    <Label>Icon</Label>
                    <select
                      className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                      value={v.icon}
                      onChange={(e) => {
                        const values = [...home.values]
                        values[i] = { ...values[i], icon: e.target.value }
                        setHome({ ...home, values })
                      }}
                    >
                      {ICON_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Title" value={v.title} onChange={(e) => {
                      const values = [...home.values]
                      values[i] = { ...values[i], title: e.target.value }
                      setHome({ ...home, values })
                    }} />
                    <Textarea rows={2} placeholder="Description" value={v.description} onChange={(e) => {
                      const values = [...home.values]
                      values[i] = { ...values[i], description: e.target.value }
                      setHome({ ...home, values })
                    }} />
                  </div>
                  <Button variant="outline" className="text-red-600" onClick={() => setHome({ ...home, values: home.values.filter((_, x) => x !== i) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setHome({ ...home, values: [...home.values, { icon: "heart", title: "", description: "" }] })}>
                <Plus className="mr-2 h-4 w-4" /> Add value
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Join CTA band</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Heading</Label>
                <Input value={str(home.joinHeading)} onChange={(e) => setHome({ ...home, joinHeading: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Subtitle</Label>
                <Textarea rows={2} value={str(home.joinSubtitle)} onChange={(e) => setHome({ ...home, joinSubtitle: e.target.value })} />
              </div>
              <div>
                <Label>Primary label</Label>
                <Input value={str(home.joinPrimaryLabel)} onChange={(e) => setHome({ ...home, joinPrimaryLabel: e.target.value })} />
              </div>
              <div>
                <Label>Primary link</Label>
                <Input value={str(home.joinPrimaryHref)} onChange={(e) => setHome({ ...home, joinPrimaryHref: e.target.value })} />
              </div>
              <div>
                <Label>Secondary label</Label>
                <Input value={str(home.joinSecondaryLabel)} onChange={(e) => setHome({ ...home, joinSecondaryLabel: e.target.value })} />
              </div>
              <div>
                <Label>Secondary link</Label>
                <Input value={str(home.joinSecondaryHref)} onChange={(e) => setHome({ ...home, joinSecondaryHref: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button disabled={saving} onClick={() => save("site.home", home, "Homepage")}>
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save homepage"}
            </Button>
          </div>
        </TabsContent>

        {/* ── Footer ── */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact & brand</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Email</Label>
                <Input value={str(footer.contactEmail)} onChange={(e) => setFooter({ ...footer, contactEmail: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={str(footer.contactPhone)} onChange={(e) => setFooter({ ...footer, contactPhone: e.target.value })} />
              </div>
              <div>
                <Label>Address line 1</Label>
                <Input value={str(footer.addressLine1)} onChange={(e) => setFooter({ ...footer, addressLine1: e.target.value })} />
              </div>
              <div>
                <Label>Address line 2</Label>
                <Input value={str(footer.addressLine2)} onChange={(e) => setFooter({ ...footer, addressLine2: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Brand tagline</Label>
                <Textarea rows={2} value={str(footer.brandTagline)} onChange={(e) => setFooter({ ...footer, brandTagline: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Copyright note (right side)</Label>
                <Input value={str(footer.copyrightNote)} onChange={(e) => setFooter({ ...footer, copyrightNote: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Join banner (top of footer)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Title</Label>
                <Input value={str(footer.joinBannerTitle)} onChange={(e) => setFooter({ ...footer, joinBannerTitle: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Body</Label>
                <Textarea rows={2} value={str(footer.joinBannerBody)} onChange={(e) => setFooter({ ...footer, joinBannerBody: e.target.value })} />
              </div>
              <div>
                <Label>Button label</Label>
                <Input value={str(footer.joinBannerCtaLabel)} onChange={(e) => setFooter({ ...footer, joinBannerCtaLabel: e.target.value })} />
              </div>
              <div>
                <Label>Button link</Label>
                <Input value={str(footer.joinBannerCtaHref)} onChange={(e) => setFooter({ ...footer, joinBannerCtaHref: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button disabled={saving} onClick={() => save("site.footer", footer, "Footer")}>
              <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save footer"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
