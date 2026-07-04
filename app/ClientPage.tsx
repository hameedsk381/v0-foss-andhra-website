"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Globe,
  Heart,
  ChevronDown,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
} from "lucide-react"
import { PROGRAMS, PROGRAM_TEXT_CLASS, PROGRAM_PHOTOS } from "@/lib/programs"
import { SkipLink } from "@/components/skip-link"
import { OrganizationJsonLd } from "@/components/structured-data"
import { buttonHover, buttonTap } from "@/lib/animations"

/* ── Data ─────────────────────────────────────────────── */

const CAMPUS_NAMES = [
  "JNTU Kakinada", "Andhra University", "NIT Tadepalligudem",
  "IIT Tirupati", "SVU Tirupati", "KL University",
  "VIT-AP", "RVR College", "GITAM",
]

const stats = [
  { value: "700+", label: "Community Members" },
  { value: "9+",   label: "Campus Clubs" },
  { value: "7",    label: "Programmes" },
  { value: "4",    label: "Open Projects" },
]

const values = [
  {
    icon: BookOpen,
    title: "Open Knowledge",
    description: "AI systems in 2026 are trained on public knowledge. We ensure that knowledge stays open — accessible to AP students without paywalls.",
    dir: "left" as const,
  },
  {
    icon: ShieldCheck,
    title: "Data Privacy",
    description: "From health records to e-governance, your data belongs to you. We champion community-owned, auditable systems.",
    dir: "right" as const,
  },
  {
    icon: Heart,
    title: "Public Welfare",
    description: "India's DPI — UPI, ONDC, DIGIT — runs on open source. We extend that ethos to every school and panchayat in AP.",
    dir: "left" as const,
  },
  {
    icon: Globe,
    title: "Offline First",
    description: "Rural AP cannot wait for 5G. We build tools that run on low-end Android and 2G — digital inclusion for everyone.",
    dir: "right" as const,
  },
]

const communityPhotos = [
  { src: "/gallery/fosstar-event-1.jpg", title: "Planning Sprints",    sub: "Roadmaps & working groups" },
  { src: "/stock/code-screen.jpg",       title: "Hack Nights",         sub: "Shipping open code" },
  { src: "/stock/workshop.jpg",          title: "Hands-on Workshops",  sub: "Skills, live and in person" },
  { src: "/stock/collaboration.jpg",     title: "Campus Meetups",      sub: "9+ clubs statewide" },
]

/* ── Animation helpers ────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16,1,0.3,1] as const } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16,1,0.3,1] as const } },
}

const stagger = (d = 0.08) => ({
  hidden: {},
  visible: { transition: { staggerChildren: d, delayChildren: 0.04 } },
})

/* ── Component ────────────────────────────────────────── */

export default function Home() {
  const reduced = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start","end start"] })
  const heroY   = useTransform(heroScroll, [0,1], reduced ? [0,0] : [0,-80])
  const heroOp  = useTransform(heroScroll, [0,0.75], [1,0])

  const from = (p: object) => reduced ? {} : p

  return (
    <>
      <SkipLink />
      <OrganizationJsonLd
        name="FOSS Andhra"
        url="https://fossap.in"
        logo="https://fossap.in/logos/foss-andhra-logo.png"
        description="Free and Open Source Software community in Andhra Pradesh"
        socialProfiles={["https://x.com/fossandhra","https://linkedin.com/company/fossandhra","https://github.com/fossandhra","https://youtube.com/@fossandhra"]}
      />

      <div className="flex flex-col min-h-screen">

        {/* ══ HERO — full-bleed photo ════════════════════════ */}
        <section
          id="main-content"
          ref={heroRef}
          className="relative w-full min-h-screen flex items-center overflow-hidden"
        >
          {/* Background photo */}
          <div className="absolute inset-0">
            <Image
              src="/stock/hero-community.jpg"
              alt="FOSS Andhra community summit"
              fill
              priority
              quality={90}
              className="object-cover object-center"
            />
          </div>

          {/* Gradient overlay: strong blue left → fades right so photo shows */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                "linear-gradient(105deg,",
                "  rgba(0,40,100,0.97) 0%,",
                "  rgba(0,70,150,0.92) 35%,",
                "  rgba(0,92,168,0.75) 55%,",
                "  rgba(0,92,168,0.35) 75%,",
                "  transparent 100%",
                ")",
              ].join(""),
            }}
          />
          {/* Bottom fade so ticker connects cleanly */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-primary to-transparent" />

          {/* Content */}
          <motion.div
            className="app-container relative z-10 py-32 md:py-40"
            style={{ y: heroY, opacity: heroOp }}
          >
            <div className="max-w-[680px]">

              {/* Tag */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={from({ opacity: 0, x: -18 })}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16,1,0.3,1] }}
              >
                <span className="inline-block w-8 h-[2px] bg-white/60 rounded-full" />
                <span className="text-sm font-semibold text-white/70 tracking-widest uppercase">
                  Andhra Pradesh&apos;s FOSS Community
                </span>
              </motion.div>

              {/* Headline */}
              <h1 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-white text-balance">
                <motion.span
                  className="block"
                  initial={from({ opacity: 0, y: 32, filter: "blur(12px)" })}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.16,1,0.3,1] }}
                >
                  Building Andhra
                </motion.span>
                <motion.span
                  className="block"
                  initial={from({ opacity: 0, y: 32, filter: "blur(12px)" })}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.52, ease: [0.16,1,0.3,1] }}
                >
                  Pradesh&apos;s
                </motion.span>
                <motion.span
                  className="block relative w-fit"
                  initial={from({ opacity: 0, y: 32, filter: "blur(12px)" })}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.68, ease: [0.16,1,0.3,1] }}
                >
                  open future.
                  <motion.span
                    className="absolute -bottom-2 left-0 h-1 bg-white rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.65, delay: 1.2, ease: [0.16,1,0.3,1] }}
                    style={{ originX: 0 }}
                  />
                </motion.span>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="mt-8 text-lg md:text-xl text-white/70 leading-relaxed max-w-lg"
                initial={from({ opacity: 0, y: 18 })}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.82 }}
              >
                700+ students, developers and educators across 9 campuses —
                building open-source AI, Telugu computing, and civic tech for AP.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-wrap gap-4 mt-9"
                initial={from({ opacity: 0, y: 14 })}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.98 }}
              >
                <Link href="/programs/fosstar#membership">
                  <motion.button
                    whileHover={buttonHover} whileTap={buttonTap}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-primary bg-white hover:bg-white/90 shadow-xl transition-colors"
                  >
                    Join the Community <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
                <Link href="/events">
                  <motion.button
                    whileHover={buttonHover} whileTap={buttonTap}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
                  >
                    Upcoming Events
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stat pills */}
              <motion.div
                className="flex flex-wrap gap-3 mt-10"
                initial={from({ opacity: 0 })}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25 }}
              >
                {stats.map(({ value, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-sm"
                  >
                    <span className="font-extrabold">{value}</span>
                    <span className="text-white/60">{label}</span>
                  </span>
                ))}
              </motion.div>

            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            <motion.div
              animate={reduced ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/40"
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.div>
        </section>

        {/* ══ CAMPUS TICKER ══════════════════════════════════ */}
        <div className="w-full bg-primary py-3.5 overflow-hidden" aria-label="Active FOSS campuses">
          <div className="ticker-track">
            {[...CAMPUS_NAMES, ...CAMPUS_NAMES].map((name, i) => (
              <span key={i} className="text-xs font-semibold text-white/65 uppercase tracking-[0.14em] shrink-0 px-5 inline-flex items-center gap-5">
                {name}
                <span className="inline-block w-1 h-1 rounded-full bg-white/35" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>

        {/* ══ WHAT WE DO — programs as photo cards ══════════ */}
        <section className="w-full section-shell bg-background">
          <div className="app-container">
            <motion.div
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
              initial={from({ opacity: 0, y: 22 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">What we do</p>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
                  Seven programmes,<br />one mission.
                </h2>
              </div>
              <Link href="/programs" className="shrink-0 self-start sm:self-end">
                <motion.button
                  whileHover={buttonHover} whileTap={buttonTap}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground border border-border hover:bg-muted transition-colors"
                >
                  All programmes <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {PROGRAMS.map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <Link href={`/programs/${p.slug}`} className="group block h-full">
                    <div className="h-full rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300">
                      {/* Photo */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={PROGRAM_PHOTOS[p.id] || "/placeholder.jpg"}
                          alt={p.displayName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                        {/* Program logo on photo */}
                        <div className="absolute bottom-3 left-3">
                          <Image
                            src={p.logo}
                            alt={p.displayName}
                            width={88}
                            height={30}
                            className="h-7 w-auto object-contain drop-shadow-md"
                          />
                        </div>
                      </div>
                      {/* Text */}
                      <div className="p-5">
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
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ EVENTS TEASER — bg-primary ════════════════════ */}
        <section className="w-full bg-primary overflow-hidden">
          <div className="app-container py-14 md:py-20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

              {/* Left: copy */}
              <motion.div
                className="max-w-xl"
                initial={from({ opacity: 0, y: 22 })}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Calendar className="h-5 w-5 text-white/60" />
                  <span className="text-sm font-bold uppercase tracking-widest text-white/60">Events</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight text-balance">
                  Come build with us in person.
                </h2>
                <p className="mt-4 text-white/65 text-lg leading-relaxed">
                  Workshops, hackathons, and campus meetups across Andhra Pradesh —
                  free and open to everyone.
                </p>
                <div className="flex gap-4 mt-8 flex-wrap">
                  <Link href="/events">
                    <motion.button
                      whileHover={buttonHover} whileTap={buttonTap}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-primary bg-white hover:bg-white/90 shadow-lg transition-colors"
                    >
                      See all events <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                  <Link href="/contact">
                    <motion.button
                      whileHover={buttonHover} whileTap={buttonTap}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors"
                    >
                      Invite us to your campus
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Right: event type pills */}
              <motion.div
                className="grid grid-cols-1 gap-3 w-full max-w-sm"
                variants={stagger(0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { icon: Users,    label: "Community Meetups",  desc: "Monthly open-to-all gatherings" },
                  { icon: Calendar, label: "Hackathons",         desc: "Weekend sprints on open projects" },
                  { icon: MapPin,   label: "Campus Workshops",   desc: "Hands-on FOSS skills, on-site" },
                ].map(({ icon: Icon, label, desc }) => (
                  <motion.div
                    key={label}
                    variants={slideLeft}
                    className="flex items-center gap-4 rounded-xl bg-white/10 border border-white/15 px-5 py-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{label}</p>
                      <p className="text-white/55 text-xs mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </section>

        {/* ══ COMMUNITY PHOTOS ══════════════════════════════ */}
        <section className="w-full section-shell bg-[hsl(var(--surface-1))]">
          <div className="app-container">
            <motion.div
              className="mb-8"
              initial={from({ opacity: 0, y: 22 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Community in action</p>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
                Real events,<br />real impact.
              </h2>
            </motion.div>

            {/* Main photo grid */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {/* Large featured photo */}
              <motion.div
                variants={fadeUp}
                className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group"
                style={{ aspectRatio: "4/3" }}
                whileHover={reduced ? {} : { scale: 1.01 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src="/gallery/fosstar-summit.jpg"
                  alt="Annual community summit"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-2 backdrop-blur-sm">
                    Featured
                  </span>
                  <p className="text-white font-display font-bold text-xl leading-snug">Annual Summit</p>
                  <p className="text-white/65 text-sm mt-0.5">Our largest gathering of the year</p>
                </div>
              </motion.div>

              {/* Smaller photos */}
              {communityPhotos.map((photo) => (
                <motion.div
                  key={photo.title}
                  variants={fadeUp}
                  className="relative rounded-2xl overflow-hidden group"
                  style={{ aspectRatio: "4/3" }}
                  whileHover={reduced ? {} : { scale: 1.02 }}
                  transition={{ duration: 0.35 }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3.5">
                    <p className="text-white font-semibold text-sm leading-snug">{photo.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">{photo.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ VALUES ════════════════════════════════════════ */}
        <section className="w-full section-shell bg-background">
          <div className="app-container">
            <motion.div
              className="mb-10 max-w-xl"
              initial={from({ opacity: 0, y: 22 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">What we stand for</p>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground text-balance leading-tight">
                Technology for people,<br />not shareholders.
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={stagger(0.09)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {values.map(({ icon: Icon, title, description }, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex gap-4 p-6 rounded-2xl bg-[hsl(var(--surface-2))] border border-border"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-1.5">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ JOIN CTA ═══════════════════════════════════════ */}
        <section className="w-full section-shell bg-[hsl(var(--surface-1))]">
          <div className="app-container">
            <motion.div
              initial={from({ opacity: 0, scale: 0.97, y: 22 })}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
              className="rounded-3xl overflow-hidden relative bg-primary px-10 py-14 md:px-16 md:py-20"
            >
              {/* Dot grid */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                aria-hidden="true"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              {/* Glow */}
              <motion.div
                className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)" }}
                animate={reduced ? {} : { scale: [1,1.3,1], opacity: [0.3,0.5,0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              {/* Image collage top-right */}
              <div className="absolute top-0 right-0 bottom-0 w-2/5 hidden lg:block overflow-hidden opacity-25">
                <Image src="/gallery/fosstorm-workshop.jpg" alt="" fill className="object-cover object-left" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 lg:max-w-[60%]">
                <div className="space-y-4">
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight text-balance">
                    Open source is AP&apos;s advantage.
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed max-w-lg">
                    Join 700+ members building the open technology layer for Andhra Pradesh&apos;s digital future.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link href="/programs/fosstar#membership">
                      <motion.button
                        whileHover={buttonHover} whileTap={buttonTap}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-primary bg-white hover:bg-white/90 shadow-lg transition-colors"
                      >
                        Become a Member
                      </motion.button>
                    </Link>
                    <Link href="/contribute">
                      <motion.button
                        whileHover={buttonHover} whileTap={buttonTap}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors"
                      >
                        Contribute <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  )
}
