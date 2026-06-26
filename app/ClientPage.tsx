"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Code2,
  BookOpen,
  ShieldCheck,
  Globe,
  Heart,
  Users,
  CalendarDays,
  Layers,
  ChevronRight,
} from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { PROGRAMS, PROGRAM_TEXT_CLASS } from "@/lib/programs"
import { SkipLink } from "@/components/skip-link"
import { OrganizationJsonLd } from "@/components/structured-data"
import { buttonHover, buttonTap } from "@/lib/animations"

interface HeroParticle {
  top: string
  left: string
  yOffset: number
  xOffset: number
  duration: number
  delay: number
}

function createSeededRandom(seed: number) {
  let current = seed
  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296
    return current / 4294967296
  }
}

function generateHeroParticles(seed: number, count: number): HeroParticle[] {
  const random = createSeededRandom(seed)
  return Array.from({ length: count }).map((_, index) => ({
    top: `${Math.round(random() * 100)}%`,
    left: `${Math.round(random() * 100)}%`,
    yOffset: Math.round(random() * 60 - 30),
    xOffset: Math.round(random() * 60 - 30),
    duration: 10 + Math.round(random() * 8),
    delay: index * 2,
  }))
}

const stats = [
  { value: "7", label: "Active Programs", icon: Layers },
  { value: "500+", label: "Community Members", icon: Users },
  { value: "50+", label: "Events Hosted", icon: CalendarDays },
  { value: "20+", label: "Institutions Reached", icon: Globe },
]

const values = [
  {
    icon: BookOpen,
    title: "Open Knowledge",
    description:
      "Promoting free information and data accessibility for all — ensuring knowledge is openly available and shareable across society.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: ShieldCheck,
    title: "Data Privacy",
    description:
      "Championing data privacy and public welfare through transparent, secure, and community-owned open-source solutions.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Heart,
    title: "Public Welfare",
    description:
      "Building solutions that benefit society as a whole — not just individuals or corporations — for collective digital empowerment.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Globe,
    title: "Offline First",
    description:
      "Designing inclusive digital tools that work regardless of connectivity, ensuring technology reaches every citizen.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
]

export default function Home() {
  const programs = PROGRAMS.map((program) => ({
    id: program.id,
    title: program.displayName,
    description: program.description,
    href: `/programs/${program.slug}`,
    logo: program.logo,
  }))

  const particles = useMemo(() => generateHeroParticles(20260215, 6), [])

  return (
    <>
      <SkipLink />
      <OrganizationJsonLd
        name="FOSS Andhra"
        url="https://fossandhra.org"
        logo="https://fossandhra.org/logos/foss-andhra-logo.png"
        description="Free and Open Source Software Community in Andhra Pradesh promoting FOSS in education, governance, and society"
        socialProfiles={[
          "https://x.com/fossandhra",
          "https://facebook.com/fossandhra",
          "https://linkedin.com/company/fossandhra",
        ]}
      />

      <div className="flex flex-col min-h-screen">

        {/* ── Hero ──────────────────────────────────────────── */}
        <section
          id="main-content"
          className="relative w-full overflow-hidden bg-[#01336b] min-h-[92vh] flex items-center"
        >
          {/* Mesh gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#011e42] via-[#01336b] to-[#014d9e]" />
            {/* Soft glow orbs */}
            <motion.div
              className="absolute w-[800px] h-[800px] rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #4fa8f7 0%, transparent 70%)",
                top: "-20%",
                right: "-10%",
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.25, 0.18] }}
              transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full opacity-15"
              style={{
                background: "radial-gradient(circle, #80e24a 0%, transparent 70%)",
                bottom: "-15%",
                left: "-5%",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
              transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", delay: 3 }}
            />
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            {/* Particles */}
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-white/25"
                style={{ top: p.top, left: p.left }}
                animate={{ y: [0, p.yOffset, 0], x: [0, p.xOffset, 0], opacity: [0, 0.6, 0] }}
                transition={{ duration: p.duration, repeat: Infinity, repeatType: "reverse", delay: p.delay }}
              />
            ))}
          </div>

          <div className="app-container relative z-10 py-24 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left — copy */}
              <AnimatedSection variant="fadeRight">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white/90 border border-white/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    Andhra Pradesh&apos;s FOSS Community
                  </div>

                  <div className="space-y-4">
                    <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                      Free &amp; Open{" "}
                      <span
                        className="relative"
                        style={{
                          background: "linear-gradient(135deg, #80e24a, #4fa8f7)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Source
                      </span>{" "}
                      for All
                    </h1>
                    <p className="text-xl text-white/70 max-w-[520px] leading-relaxed">
                      Digitalizing education, governance, and society through free and open source
                      solutions across Andhra Pradesh.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link href="/about">
                      <motion.button
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#01336b] bg-white hover:bg-white/95 shadow-lg shadow-black/20 transition-colors"
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </Link>
                    <Link href="/programs/fosstar#membership">
                      <motion.button
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-colors"
                      >
                        Join the Community
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>

              {/* Right — floating visual */}
              <AnimatedSection variant="fadeLeft">
                <div className="relative h-[420px] w-full hidden lg:flex items-center justify-center">
                  {/* Outer orbit ring */}
                  <motion.div
                    className="absolute w-72 h-72 rounded-full border border-dashed border-white/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute w-52 h-52 rounded-full border border-white/10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Center card */}
                  <div className="glass-dark rounded-2xl p-8 flex flex-col items-center justify-center gap-3 z-10 shadow-2xl">
                    <Image
                      src="/logos/foss-andhra-logo.png"
                      width={120}
                      height={56}
                      alt="FOSS Andhra"
                      className="mx-auto brightness-200"
                    />
                    <span className="text-white/60 text-sm font-medium">fossap.in</span>
                  </div>

                  {/* Orbiting icon chips */}
                  {[
                    { Icon: Code2, angle: 45, label: "Open Code" },
                    { Icon: BookOpen, angle: 165, label: "Education" },
                    { Icon: ShieldCheck, angle: 285, label: "Privacy" },
                  ].map(({ Icon, angle, label }, i) => (
                    <motion.div
                      key={i}
                      className="absolute glass-dark rounded-xl px-3 py-2 flex items-center gap-2 text-white/80 text-xs font-medium shadow-lg"
                      style={{
                        top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 148}px - 20px)`,
                        left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 148}px - 48px)`,
                      }}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4 + i, repeat: Infinity, repeatType: "reverse", delay: i * 1.2 }}
                    >
                      <Icon className="h-3.5 w-3.5 text-secondary" />
                      {label}
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[hsl(var(--background))] to-transparent" />
        </section>

        {/* ── Stats bar ─────────────────────────────────────── */}
        <section className="relative w-full bg-background">
          <div className="app-container py-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 -mt-10 relative z-20 gap-4">
              {stats.map(({ value, label, icon: Icon }, i) => (
                <AnimatedSection key={i} variant="fadeUp" delay={i * 0.08}>
                  <div className="surface-card p-6 flex flex-col items-center text-center gap-2 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-1">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-display text-3xl font-extrabold text-foreground">{value}</span>
                    <span className="text-sm text-muted-foreground font-medium">{label}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission / Values ──────────────────────────────── */}
        <section className="w-full section-shell bg-background">
          <div className="app-container">
            <AnimatedSection variant="fadeUp">
              <div className="text-center mb-14 space-y-4">
                <span className="label-badge">Our Mission</span>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mt-3">
                  Empowering Through{" "}
                  <span className="gradient-text">Open Source</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  We build a future where free and open source software forms the backbone of
                  education, governance, and everyday life in Andhra Pradesh.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, description, color, bg }, i) => (
                <AnimatedSection key={i} variant="fadeUp" delay={i * 0.1}>
                  <div className="surface-card interactive-lift p-6 rounded-2xl h-full flex flex-col gap-4">
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground mb-2">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Programs ─────────────────────────────────────── */}
        <section className="w-full section-shell bg-[hsl(var(--surface-1))]">
          <div className="app-container">
            <AnimatedSection variant="fadeUp">
              <div className="text-center mb-14 space-y-4">
                <span className="label-badge">Our Programs</span>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground mt-3">
                  Initiatives for Change
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Seven community-led programs spanning education, entrepreneurship, advocacy, and
                  open governance across the state.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {programs.map((program, index) => (
                <AnimatedSection key={program.id} variant="fadeUp" delay={0.06 * index}>
                  <Link href={program.href} className="block h-full group">
                    <div className="surface-card h-full rounded-2xl overflow-hidden flex flex-col transition-all duration-200 group-hover:shadow-[var(--shadow-lg)] group-hover:-translate-y-1">
                      {/* Card header band */}
                      <div className="bg-gradient-to-br from-primary/6 to-primary/2 p-6 flex items-center justify-center min-h-[88px]">
                        <Image
                          src={program.logo || "/placeholder.svg"}
                          alt={`${program.title} Logo`}
                          width={200}
                          height={60}
                          className="h-10 w-auto object-contain"
                        />
                      </div>
                      {/* Body */}
                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                          {program.description}
                        </p>
                        <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${PROGRAM_TEXT_CLASS[program.id]} group-hover:gap-2 transition-all`}>
                          Explore
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection variant="fadeUp" delay={0.3}>
              <div className="mt-10 text-center">
                <Link href="/programs">
                  <motion.button
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    View All Programs
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Impact banner ────────────────────────────────── */}
        <section className="w-full section-shell bg-background">
          <div className="app-container">
            <div className="rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#011e42] to-[#014d9e] p-12 md:p-16">
              {/* Background decorations */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <motion.div
                className="absolute -right-24 -top-24 w-64 h-64 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(128,226,74,0.3) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                    Ready to join the movement?
                  </h2>
                  <p className="text-white/70 text-lg max-w-lg">
                    Become a member, volunteer, or sponsor — help us drive digital freedom across
                    Andhra Pradesh.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 flex-shrink-0">
                  <Link href="/programs/fosstar#membership">
                    <motion.button
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#01336b] bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/30 transition-colors"
                    >
                      Become a Member
                    </motion.button>
                  </Link>
                  <Link href="/contribute">
                    <motion.button
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-colors"
                    >
                      Contribute
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
