"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Globe,
  Heart,
  Calendar,
  MapPin,
  Users,
} from "lucide-react"
import { PROGRAMS_BY_ID, type ProgramId } from "@/lib/programs"
import type { HomeContent } from "@/lib/site-content"
import { cn } from "@/lib/utils"
import { SkipLink } from "@/components/skip-link"
import { OrganizationJsonLd } from "@/components/structured-data"
import { useOpenings } from "@/components/home/use-openings"
import { OpeningsSection } from "@/components/home/openings-section"
import { OpeningsPopup } from "@/components/home/openings-popup"
import { TaglineReveal } from "@/components/tagline-reveal"

/* ── Icon resolver (content stores icon names as strings) ─ */

const ICONS: Record<string, typeof BookOpen> = {
  "book-open": BookOpen,
  "shield-check": ShieldCheck,
  heart: Heart,
  globe: Globe,
  users: Users,
  calendar: Calendar,
  "map-pin": MapPin,
}

function iconFor(name: string) {
  return ICONS[name] ?? BookOpen
}

/* ── Miller's law: seven programmes chunked into three groups ── */

const PROGRAM_GROUPS: { label: string; ids: ProgramId[] }[] = [
  { label: "Join the community", ids: ["fosstar"] },
  { label: "Learn & build", ids: ["fossync", "fosspeaks", "fosstorm"] },
  { label: "Adopt, fund & share", ids: ["fosserve", "fosstart", "fossterage"] },
]

/* ── Animation helper ─────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

const stagger = (d = 0.06) => ({
  hidden: {},
  visible: { transition: { staggerChildren: d, delayChildren: 0.02 } },
})

/* ── Component ────────────────────────────────────────── */

export default function Home({ content }: { content: HomeContent }) {
  const reduced = useReducedMotion()
  const from = (p: object) => (reduced ? {} : p)
  const { openings, loading: openingsLoading } = useOpenings()

  return (
    <>
      <SkipLink />
      <OpeningsPopup openings={openings} />
      <OrganizationJsonLd
        name="FOSS Andhra"
        url="https://fossap.in"
        logo="https://fossap.in/logos/foss-andhra-logo.png"
        description="Free and Open Source Software community in Andhra Pradesh"
        socialProfiles={["https://x.com/fossandhra","https://linkedin.com/company/fossandhra","https://github.com/fossandhra","https://youtube.com/@fossandhra"]}
      />

      <div className="flex flex-col min-h-screen">

        {/* ══ HERO — flat, two-column ═══════════════════════ */}
        <section id="main-content" className="w-full border-b border-border bg-primary/[0.06] py-10 sm:py-14">
          <div className="app-container grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
            <motion.div
              initial={from({ opacity: 0, y: 16 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow mb-4">{content.heroEyebrow}</p>

              <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {content.heroTitle}{" "}
                <span className="text-primary">{content.heroTitleHighlight}</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {content.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <Link href={content.heroCtaPrimaryHref} className="cta-primary w-full sm:w-auto">
                  {content.heroCtaPrimaryLabel} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={content.heroCtaSecondaryHref} className="cta-secondary w-full sm:w-auto">
                  {content.heroCtaSecondaryLabel}
                </Link>
              </div>

              {/* Law of common region: the four stats read as one bar, not four loose chips.
                  Von Restorff: the first stat is the one filled cell in the row. */}
              <div className="mt-6 overflow-hidden rounded-lg border border-border bg-border">
                <dl className="grid grid-cols-2 gap-px sm:grid-cols-4">
                  {content.stats.map(({ value, label }, i) => (
                    <div key={label} className={cn("bg-card px-3.5 py-3", i === 0 && "bg-primary/5")}>
                      <dd className="text-lg font-bold leading-tight text-foreground">{value}</dd>
                      <dt className="mt-0.5 text-xs text-muted-foreground">{label}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>

            <motion.div
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
              initial={from({ opacity: 0, y: 16 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={content.heroImage}
                alt="FOSS Andhra community summit"
                fill
                priority
                quality={90}
                className="object-cover object-center"
              />
            </motion.div>
          </div>
        </section>

        {/* ══ CAMPUS TICKER ══════════════════════════════════ */}
        <div className="w-full border-b border-border bg-background py-3.5 overflow-hidden" aria-label="Active FOSS campuses">
          <div className="ticker-track">
            {[...content.campusNames, ...content.campusNames].map((name, i) => (
              <span key={i} className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em] shrink-0 px-5 inline-flex items-center gap-5">
                {name}
                <span className="inline-block w-1 h-1 rounded-full bg-border" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>

        {/* ══ OPENINGS — careers & internships ═══════════════ */}
        <OpeningsSection openings={openings} loading={openingsLoading} />

        {/* ══ TAGLINE REVEAL ═════════════════════════════════ */}
        {content.tagline?.trim() ? (
          <section className="w-full border-b border-border bg-background py-16 sm:py-24">
            <div className="app-container">
              <TaglineReveal text={content.tagline} />
            </div>
          </section>
        ) : null}

        {/* ══ GOALS ══════════════════════════════════════════ */}
        <section className="w-full section-shell bg-background">
          <div className="app-container">
            <p className="eyebrow mb-6">{content.aboutEyebrow}</p>
            <p className="max-w-2xl text-lg leading-relaxed text-foreground sm:text-xl">
              {content.aboutLead}
            </p>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {content.goals.map((goal) => (
                <div key={goal.number}>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Goals {goal.number}</p>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{goal.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{goal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROGRAMS — flat cards ══════════════════════════ */}
        <section className="w-full section-shell bg-muted/60 border-y border-border">
          <div className="app-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
              <div>
                <p className="eyebrow mb-2">What we do</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                  {content.programsHeading}
                </h2>
              </div>
              <Link
                href="/programs"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:self-end"
              >
                All programmes <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-10">
              {PROGRAM_GROUPS.map((group) => (
                <div key={group.label}>
                  {/* Law of proximity: each group label sits tight above its cards */}
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {group.label}
                  </h3>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    variants={stagger()}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                  >
                    {group.ids.map((id) => {
                      const p = PROGRAMS_BY_ID[id]
                      const featured = p.id === "fosstar"
                      return (
                        <motion.div key={p.id} variants={fadeUp}>
                          {/* Law of similarity: one card recipe everywhere; Von Restorff: the
                              membership entry is the only ringed card and carries the tag. */}
                          <Link href={`/programs/${p.slug}`} className="group block h-full">
                            <div
                              className={cn(
                                "relative h-full rounded-lg border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                                featured
                                  ? "border-primary/40 ring-1 ring-primary/15 hover:border-primary/60"
                                  : "border-border hover:border-primary/40",
                              )}
                            >
                              {featured && (
                                <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                                  Start here
                                </span>
                              )}
                              <Image
                                src={p.logo}
                                alt={p.displayName}
                                width={100}
                                height={28}
                                className="h-7 w-auto object-contain mb-4"
                              />
                              <h4 className="font-display font-semibold text-foreground text-lg mb-1.5">
                                {p.displayName}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {p.description}
                              </p>
                              <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                                Learn more <ArrowRight className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ EVENTS TEASER — flat ═══════════════════════════ */}
        <section className="w-full section-shell bg-background">
          <div className="app-container">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              <div className="max-w-xl">
                <p className="eyebrow mb-5">Events</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight text-balance">
                  {content.eventsHeading}
                </h2>
                <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                  {content.eventsSubtitle}
                </p>
                <div className="flex gap-4 mt-8 flex-wrap">
                  <Link href={content.eventsPrimaryHref} className="cta-primary w-full sm:w-auto">
                    {content.eventsPrimaryLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={content.eventsSecondaryHref} className="cta-secondary w-full sm:w-auto">
                    {content.eventsSecondaryLabel}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
                {content.eventTypes.map(({ icon, title, description }) => {
                  const Icon = iconFor(icon)
                  return (
                    <div key={title} className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{title}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══ COMMUNITY PHOTOS ══════════════════════════════ */}
        <section className="w-full section-shell bg-muted/60 border-y border-border">
          <div className="app-container">
            <div className="mb-8">
              <p className="eyebrow mb-2">Community in action</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                {content.photosHeading}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="group col-span-2 row-span-2 relative rounded-lg border border-border overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image src={content.featuredPhoto.src} alt={content.featuredPhoto.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-4">
                  <p className="text-foreground font-display font-bold">{content.featuredPhoto.title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{content.featuredPhoto.sub}</p>
                </div>
              </div>

              {content.photos.map((photo) => (
                <div key={photo.title} className="group relative rounded-lg border border-border overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <Image src={photo.src} alt={photo.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                  <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-3">
                    <p className="text-foreground font-semibold text-sm">{photo.title}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{photo.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ VALUES ════════════════════════════════════════ */}
        <section className="w-full section-shell bg-background">
          <div className="app-container">
            <div className="mb-10 max-w-xl">
              <p className="eyebrow mb-2">What we stand for</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-balance leading-tight">
                {content.valuesHeading}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {content.values.map(({ icon, title, description }, i) => {
                const Icon = iconFor(icon)
                return (
                  <div key={i} className="flex gap-4 p-6 rounded-lg border border-border bg-card">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground mb-1.5">{title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══ JOIN CTA — flat band ══════════════════════════ */}
        <section className="w-full section-shell bg-background">
          <div className="app-container">
            <div className="rounded-lg border border-border bg-primary px-10 py-14 md:px-16 md:py-20">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                <div className="space-y-4 max-w-xl">
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight text-balance">
                    {content.joinHeading}
                  </h2>
                  <p className="text-white/75 text-lg leading-relaxed">
                    {content.joinSubtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link
                      href={content.joinPrimaryHref}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary transition-all hover:-translate-y-px hover:bg-white/90 active:translate-y-0 sm:w-auto"
                    >
                      {content.joinPrimaryLabel}
                    </Link>
                    <Link
                      href={content.joinSecondaryHref}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-white/10 active:translate-y-0 sm:w-auto"
                    >
                      {content.joinSecondaryLabel} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
