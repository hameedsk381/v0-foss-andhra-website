// Site content system: DB-managed page content with hardcoded defaults as fallback.
// Content is stored as JSON in the Settings table (no migration needed).
// Admin editor: /admin/site-content — edits apply immediately (pages are force-dynamic).

import { prisma } from "@/lib/prisma"

/* ── Types ─────────────────────────────────────────────── */

export interface StatItem {
  value: string
  label: string
}

export interface IconItem {
  icon: string // icon name resolved on render: book-open, shield-check, heart, globe, users, calendar, map-pin
  title: string
  description: string
}

export interface PhotoItem {
  src: string
  title: string
  sub: string
}

export interface HomeContent {
  // Hero
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
  // About/goals section
  aboutEyebrow: string
  aboutLead: string
  goals: { number: string; title: string; description: string }[]
  // Programs section
  programsHeading: string
  // Events section
  eventsHeading: string
  eventsSubtitle: string
  eventsPrimaryLabel: string
  eventsPrimaryHref: string
  eventsSecondaryLabel: string
  eventsSecondaryHref: string
  eventTypes: IconItem[]
  // Community photos
  photosHeading: string
  featuredPhoto: PhotoItem
  photos: PhotoItem[]
  // Values
  valuesHeading: string
  values: IconItem[]
  // Join CTA
  joinHeading: string
  joinSubtitle: string
  joinPrimaryLabel: string
  joinPrimaryHref: string
  joinSecondaryLabel: string
  joinSecondaryHref: string
}

export interface FooterContent {
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

/* ── Defaults (mirror the previously hardcoded content) ── */

export const DEFAULT_HOME_CONTENT: HomeContent = {
  heroEyebrow: "Andhra Pradesh's FOSS Community",
  heroTitle: "Building Andhra Pradesh's",
  heroTitleHighlight: "open future.",
  heroSubtitle:
    "700+ students, developers and educators across 9 campuses — building open-source AI, Telugu computing, and civic tech for AP.",
  heroCtaPrimaryLabel: "Join FOSStar",
  heroCtaPrimaryHref: "/membership",
  heroCtaSecondaryLabel: "Upcoming Events",
  heroCtaSecondaryHref: "/events",
  heroImage: "/stock/hero-community.jpg",
  stats: [
    { value: "700+", label: "Community Members" },
    { value: "9+", label: "Campus Clubs" },
    { value: "7", label: "Programmes" },
    { value: "4", label: "Open Projects" },
  ],
  campusNames: [
    "JNTU Kakinada",
    "Andhra University",
    "NIT Tadepalligudem",
    "IIT Tirupati",
    "SVU Tirupati",
    "KL University",
    "VIT-AP",
    "RVR College",
    "GITAM",
  ],
  aboutEyebrow: "About",
  aboutLead:
    "FOSS Andhra is a non-profit community that aims at promoting and strengthening the Free and Open Source Software ecosystem across Andhra Pradesh.",
  goals: [
    {
      number: "01",
      title: "Open Knowledge",
      description:
        "AI systems in 2026 are trained on public knowledge. We ensure that knowledge stays open — accessible to AP students without paywalls.",
    },
    {
      number: "02",
      title: "Data Privacy",
      description:
        "From health records to e-governance, your data belongs to you. We champion community-owned, auditable systems.",
    },
    {
      number: "03",
      title: "Public Welfare",
      description:
        "India's DPI — UPI, ONDC, DIGIT — runs on open source. We extend that ethos to every school and panchayat in AP.",
    },
  ],
  programsHeading: "Seven programmes, one mission.",
  eventsHeading: "Come build with us in person.",
  eventsSubtitle:
    "Workshops, hackathons, and campus meetups across Andhra Pradesh — free and open to everyone.",
  eventsPrimaryLabel: "See all events",
  eventsPrimaryHref: "/events",
  eventsSecondaryLabel: "Invite us to your campus",
  eventsSecondaryHref: "/contact",
  eventTypes: [
    { icon: "users", title: "Community Meetups", description: "Monthly open-to-all gatherings" },
    { icon: "calendar", title: "Hackathons", description: "Weekend sprints on open projects" },
    { icon: "map-pin", title: "Campus Workshops", description: "Hands-on FOSS skills, on-site" },
  ],
  photosHeading: "Real events, real impact.",
  featuredPhoto: { src: "/gallery/fosstar-summit.jpg", title: "Annual Summit", sub: "Our largest gathering of the year" },
  photos: [
    { src: "/gallery/fosstar-event-1.jpg", title: "Planning Sprints", sub: "Roadmaps & working groups" },
    { src: "/stock/code-screen.jpg", title: "Hack Nights", sub: "Shipping open code" },
    { src: "/stock/workshop.jpg", title: "Hands-on Workshops", sub: "Skills, live and in person" },
    { src: "/stock/collaboration.jpg", title: "Campus Meetups", sub: "9+ clubs statewide" },
  ],
  valuesHeading: "Technology for people, not shareholders.",
  values: [
    {
      icon: "book-open",
      title: "Open Knowledge",
      description:
        "AI systems in 2026 are trained on public knowledge. We ensure that knowledge stays open — accessible to AP students without paywalls.",
    },
    {
      icon: "shield-check",
      title: "Data Privacy",
      description:
        "From health records to e-governance, your data belongs to you. We champion community-owned, auditable systems.",
    },
    {
      icon: "heart",
      title: "Public Welfare",
      description:
        "India's DPI — UPI, ONDC, DIGIT — runs on open source. We extend that ethos to every school and panchayat in AP.",
    },
    {
      icon: "globe",
      title: "Offline First",
      description:
        "Rural AP cannot wait for 5G. We build tools that run on low-end Android and 2G — digital inclusion for everyone.",
    },
  ],
  joinHeading: "Open source is AP's advantage.",
  joinSubtitle:
    "Join 700+ members building the open technology layer for Andhra Pradesh's digital future.",
  joinPrimaryLabel: "Join FOSStar",
  joinPrimaryHref: "/membership",
  joinSecondaryLabel: "Contribute",
  joinSecondaryHref: "/contribute",
}

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  contactEmail: "office@fossap.in",
  contactPhone: "+91 94944 63840",
  addressLine1: "Yesj Centre for Excellence,",
  addressLine2: "Vijayawada, AP 520008",
  brandTagline:
    "Fostering free and open-source software adoption across education, governance, and society in Andhra Pradesh.",
  joinBannerTitle: "Put open technology to work.",
  joinBannerBody:
    "Join the people building a more capable, inclusive, and self-reliant Andhra Pradesh.",
  joinBannerCtaLabel: "Join FOSStar",
  joinBannerCtaHref: "/membership",
  copyrightNote: "Built with ♥ for the open source community",
}

/* ── Keys ──────────────────────────────────────────────── */

export const SITE_CONTENT_KEYS = {
  home: "site.home",
  footer: "site.footer",
} as const

export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[keyof typeof SITE_CONTENT_KEYS]

const KEY_ALLOWLIST = new Set<string>(Object.values(SITE_CONTENT_KEYS))

/* ── Server getter ─────────────────────────────────────── */

async function readStoredContent(key: SiteContentKey): Promise<Record<string, unknown> | null> {
  try {
    const row = await prisma.settings.findUnique({ where: { key }, select: { value: true } })
    if (!row?.value) return null
    const parsed = JSON.parse(row.value)
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null
  } catch {
    return null // corrupt JSON -> fall back to defaults rather than break the page
  }
}

export async function getHomeContent(): Promise<HomeContent> {
  const stored = await readStoredContent(SITE_CONTENT_KEYS.home)
  return stored ? { ...DEFAULT_HOME_CONTENT, ...stored } : DEFAULT_HOME_CONTENT
}

export async function getFooterContent(): Promise<FooterContent> {
  const stored = await readStoredContent(SITE_CONTENT_KEYS.footer)
  return stored ? { ...DEFAULT_FOOTER_CONTENT, ...stored } : DEFAULT_FOOTER_CONTENT
}
