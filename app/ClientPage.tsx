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
import { PROGRAMS } from "@/lib/programs"
import type { HomeContent } from "@/lib/site-content"
import { SkipLink } from "@/components/skip-link"
import { OrganizationJsonLd } from "@/components/structured-data"
import { useOpenings } from "@/components/home/use-openings"
import { OpeningsSection } from "@/components/home/openings-section"
import { OpeningsPopup } from "@/components/home/openings-popup"

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

/* ── Animation helper ─────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
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
        <section id="main-content" className="w-full border-b border-border bg-primary/[0.04] py-10 sm:py-14">
          <div className="app-container grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
            <motion.div
              initial={from({ opacity: 0, y: 16 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow mb-4">{content.heroEyebrow}</p>

              <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight text-foreground text-balance">
                {content.heroTitle}{" "}
                <span className="text-primary">{content.heroTitleHighlight}</span>
              </h1>

              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                {content.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <Link href={content.heroCtaPrimaryHref} className="cta-primary">
                  {content.heroCtaPrimaryLabel} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={content.heroCtaSecondaryHref} className="cta-secondary">
                  {content.heroCtaSecondaryLabel}
                </Link>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                {content.stats.map(({ value, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-1.5 text-sm"
                  >
                    <span className="font-bold text-foreground">{value}</span>
                    <span className="text-muted-foreground">{label}</span>
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
              initial={from({ opacity: 0, y: 16 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
        <section className="w-full section-shell bg-muted/30 border-y border-border">
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
                className="shrink-0 self-start sm:self-end inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                All programmes <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {PROGRAMS.map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <Link href={`/programs/${p.slug}`} className="group block h-full">
                    <div className="h-full rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40">
                      <Image
                        src={p.logo}
                        alt={p.displayName}
                        width={100}
                        height={28}
                        className="h-7 w-auto object-contain mb-4"
                      />
                      <h3 className="font-display font-bold text-foreground text-[1.05rem] mb-1.5">
                        {p.displayName}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                        Learn more <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
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
                  <Link href={content.eventsPrimaryHref} className="cta-primary">
                    {content.eventsPrimaryLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={content.eventsSecondaryHref} className="cta-secondary">
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
        <section className="w-full section-shell bg-muted/30 border-y border-border">
          <div className="app-container">
            <div className="mb-8">
              <p className="eyebrow mb-2">Community in action</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                {content.photosHeading}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="col-span-2 row-span-2 relative rounded-lg border border-border overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image src={content.featuredPhoto.src} alt={content.featuredPhoto.title} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-4">
                  <p className="text-foreground font-display font-bold">{content.featuredPhoto.title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{content.featuredPhoto.sub}</p>
                </div>
              </div>

              {content.photos.map((photo) => (
                <div key={photo.title} className="relative rounded-lg border border-border overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <Image src={photo.src} alt={photo.title} fill className="object-cover" />
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
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
                    >
                      {content.joinPrimaryLabel}
                    </Link>
                    <Link
                      href={content.joinSecondaryHref}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
