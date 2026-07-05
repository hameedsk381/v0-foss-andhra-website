import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen, Calendar, Users, Heart, FileText, FolderTree, Mail, Bell,
  Settings, Image as ImageIcon, ArrowUpRight, Sparkles, ShieldCheck,
} from "lucide-react"

interface HandbookEntry {
  icon: React.ElementType
  adminPath: string
  title: string
  controls: string
  publicPaths: { label: string; href: string }[]
  notes?: string
  tags?: string[]
}

const entries: HandbookEntry[] = [
  {
    icon: BookOpen,
    adminPath: "/admin/blog",
    title: "Blog",
    controls: "Blog posts, categories, tags, and comment moderation.",
    publicPaths: [
      { label: "Blog listing", href: "/blog" },
      { label: "Individual post pages", href: "/blog" },
    ],
    notes:
      "Use \"Write with AI\" to turn rough notes into a full SEO-ready draft — always review before publishing. The SEO checklist scores your post live as you edit.",
    tags: ["AI-assisted", "SEO checklist"],
  },
  {
    icon: Calendar,
    adminPath: "/admin/events",
    title: "Events",
    controls: "Events, ticket types, promo codes, orders, and on-site check-in.",
    publicPaths: [
      { label: "Events listing", href: "/events" },
      { label: "Event detail + registration", href: "/events" },
    ],
    notes: "Ticket buyers get an automatic QR-code confirmation email. Use Check-in on event day to scan tickets at the door.",
  },
  {
    icon: Users,
    adminPath: "/admin/members",
    title: "Members",
    controls: "FOSStar membership records, status, and renewals.",
    publicPaths: [
      { label: "Membership page", href: "/membership" },
      { label: "Member portal (after login)", href: "/member" },
    ],
    notes:
      "New members get a welcome email with a set-password link automatically. If someone says they never got it, use the mail icon on their row to resend it. Renewal reminders (30-day and 7-day) send automatically once a day.",
    tags: ["Automated emails"],
  },
  {
    icon: Heart,
    adminPath: "/admin/donations",
    title: "Donations",
    controls: "One-time and recurring donation records from the donate flow.",
    publicPaths: [{ label: "Donate page", href: "/contribute/donate" }],
    notes: "Donors receive an automatic receipt email after a successful payment.",
  },
  {
    icon: FileText,
    adminPath: "/admin/content",
    title: "Content",
    controls: "Editable text for standalone pages (About, Privacy Policy, Refund Policy, Terms of Service).",
    publicPaths: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
  {
    icon: FolderTree,
    adminPath: "/admin/programs",
    title: "Programs",
    controls: "Content for all seven programmes (FOSStar, FOSServe, FOSSynC, FOSStorm, FOSStart, FOSSterage, FOSSpeaks).",
    publicPaths: [
      { label: "Programs listing", href: "/programs" },
      { label: "Each programme's page", href: "/programs" },
    ],
    notes: "Each programme page falls back to hardcoded content if nothing is saved here, so the site never shows a blank page.",
  },
  {
    icon: ImageIcon,
    adminPath: "/admin/gallery",
    title: "Gallery / Media Library",
    controls: "Uploaded images used across the gallery page and as blog cover images.",
    publicPaths: [{ label: "Gallery page", href: "/gallery" }],
    notes: "The blog editor's \"Choose from media library\" button pulls from this same library.",
  },
  {
    icon: Mail,
    adminPath: "/admin/newsletter",
    title: "Newsletter",
    controls: "Subscriber list and newsletter campaign sending.",
    publicPaths: [{ label: "Newsletter signup (footer)", href: "/" }],
  },
  {
    icon: Bell,
    adminPath: "/admin/notifications/push",
    title: "Push Notifications",
    controls: "Browser push notifications to subscribed visitors.",
    publicPaths: [],
  },
  {
    icon: Settings,
    adminPath: "/admin/settings",
    title: "Settings",
    controls: "SMTP email and Razorpay payment configuration at runtime.",
    publicPaths: [],
    notes: "Changes here take effect immediately — no redeploy needed.",
  },
]

const notCmsDriven = [
  "Homepage and its animated sections",
  "Navigation bar and footer",
  "Design system, colors, and fonts",
]

export default function AdminHandbookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          Team Handbook
        </h1>
        <p className="text-muted-foreground mt-1">
          What each admin section controls, and where it shows up on the live site.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {entries.map((entry) => {
          const Icon = entry.icon
          return (
            <Card key={entry.adminPath}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <CardDescription className="mt-1">{entry.controls}</CardDescription>
                    </div>
                  </div>
                  <Link
                    href={entry.adminPath}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
                  >
                    Open <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {entry.publicPaths.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.publicPaths.map((p) => (
                      <a
                        key={p.href + p.label}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground hover:bg-muted/70 transition-colors inline-flex items-center gap-1"
                      >
                        {p.label} <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}
                {entry.notes && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{entry.notes}</p>
                )}
                {entry.tags && (
                  <div className="flex gap-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs gap-1">
                        <Sparkles className="h-3 w-3" /> {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-[hsl(var(--surface-2))] border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Not managed through the CMS</CardTitle>
          <CardDescription>
            These parts of the site are code-driven for design quality and require a developer to change.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            {notCmsDriven.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
