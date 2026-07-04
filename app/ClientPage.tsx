"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
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
  GraduationCap,
  Code2,
  Rocket,
  Users,
} from "lucide-react"
import { PROGRAMS, PROGRAM_TEXT_CLASS } from "@/lib/programs"
import { SkipLink } from "@/components/skip-link"
import { OrganizationJsonLd } from "@/components/structured-data"
import { buttonHover, buttonTap } from "@/lib/animations"

const CAMPUS_NAMES = [
  "JNTU Kakinada",
  "Andhra University",
  "NIT Tadepalligudem",
  "IIT Tirupati",
  "SVU Tirupati",
  "KL University",
  "VIT-AP",
  "RVR College",
  "GITAM",
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
    description:
      "AI systems in 2026 are trained on public knowledge. We ensure that knowledge stays open — accessible to AP students and researchers without paywalls or lock-in.",
    dir: "left" as const,
  },
  {
    icon: ShieldCheck,
    title: "Data Privacy",
    description:
      "From health records to e-governance, your data belongs to you. We champion community-owned, auditable systems that don't trade privacy for convenience.",
    dir: "right" as const,
  },
  {
    icon: Heart,
    title: "Public Welfare",
    description:
      "India's DPI — UPI, ONDC, DIGIT — runs on open source. We extend that ethos to every school, panchayat, and hospital in Andhra Pradesh.",
    dir: "left" as const,
  },
  {
    icon: Globe,
    title: "Offline First",
    description:
      "Rural AP cannot wait for 5G. We build tools that run on low-end Android and 2G — because digital inclusion means no one is left out.",
    dir: "right" as const,
  },
]

const communityPhotos = [
  {
    src: "/gallery/fosstar-summit.jpg",
    title: "FOSStar Summit 2025",
    sub: "900+ attendees",
    span: "col-span-2 row-span-2",
    large: true,
  },
  {
    src: "/gallery/fossync-club.jpg",
    title: "FOSSynC Campus Clubs",
    sub: "9+ chapters",
    span: "col-span-1",
    large: false,
  },
  {
    src: "/gallery/fosspeaks-advocacy.jpg",
    title: "FOSSpeaks Advocacy",
    sub: "State-level outreach",
    span: "col-span-1",
    large: false,
  },
]

const pipeline = [
  {
    step: "01",
    phase: "Learn",
    icon: GraduationCap,
    desc: "Campus clubs and curated open knowledge repositories for every skill level",
    logos: [
      { src: "/logos/fossync-logo.svg", label: "FOSSynC" },
      { src: "/logos/fossterage-logo.svg", label: "FOSSterage" },
    ],
  },
  {
    step: "02",
    phase: "Build",
    icon: Code2,
    desc: "Real open-source projects in Telugu NLP, civic tech, and open education",
    logos: [
      { src: "/logos/fosstorm-logo.svg", label: "FOSStorm" },
      { src: "/logos/fosstart-logo.png", label: "FOSStart" },
    ],
  },
  {
    step: "03",
    phase: "Deploy",
    icon: Rocket,
    desc: "Open source in AP schools, panchayats, and government offices",
    logos: [
      { src: "/logos/fosserve-logo.svg", label: "FOSServe" },
    ],
  },
  {
    step: "04",
    phase: "Grow",
    icon: Users,
    desc: "A statewide network and policy platform for open source in Andhra Pradesh",
    logos: [
      { src: "/logos/fosstar-logo.svg", label: "FOSStar" },
      { src: "/logos/fosspeaks-logo.svg", label: "FOSSpeaks" },
    ],
  },
]

const makeValueVariant = (dir: "left" | "right") => ({
  hidden: { opacity: 0, x: dir === "left" ? -48 : 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
})

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const stagger = (delay = 0.08) => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
})

export default function Home() {
  const reduced = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const contentY = useTransform(heroProgress, [0, 1], reduced ? [0, 0] : [0, -100])
  const contentOpacity = useTransform(heroProgress, [0, 0.7], [1, 0])
  const blobScale = useTransform(heroProgress, [0, 1], reduced ? [1, 1] : [1, 1.4])
  const imageY = useTransform(heroProgress, [0, 1], reduced ? [0, 0] : [0, -60])

  const { scrollYProgress } = useScroll()
  const barScale = useSpring(scrollYProgress, { stiffness: 180, damping: 40, restDelta: 0.001 })

  const programs = PROGRAMS.map((p) => ({
    id: p.id,
    title: p.displayName,
    description: p.description,
    href: `/programs/${p.slug}`,
    logo: p.logo,
  }))

  const tickerItems = [...CAMPUS_NAMES, ...CAMPUS_NAMES]
  const from = (props: object) => (reduced ? {} : props)

  return (
    <>
      <SkipLink />
      <OrganizationJsonLd
        name="FOSS Andhra"
        url="https://fossap.in"
        logo="https://fossap.in/logos/foss-andhra-logo.png"
        description="Free and Open Source Software community in Andhra Pradesh — building open source infrastructure for education, governance, and Telugu-language computing"
        socialProfiles={[
          "https://x.com/fossandhra",
          "https://linkedin.com/company/fossandhra",
          "https://github.com/fossandhra",
          "https://youtube.com/@fossandhra",
        ]}
      />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[200] pointer-events-none"
        style={{ scaleX: barScale }}
      />

      <div className="flex flex-col min-h-screen">

        {/* ══ HERO ═══════════════════════════════════════════ */}
        <section
          id="main-content"
          ref={heroRef}
          className="relative w-full overflow-hidden min-h-[94vh] flex items-center bg-background"
        >
          {/* Ambient blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 800, height: 800,
                top: "-20%", right: "-15%",
                background: "radial-gradient(circle, rgba(0,92,168,0.09) 0%, transparent 65%)",
                scale: blobScale,
              }}
              animate={from({ x: [0, 32, -12, 0], y: [0, -24, 16, 0] })}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 560, height: 560,
                bottom: "-10%", left: "-5%",
                background: "radial-gradient(circle, rgba(0,92,168,0.06) 0%, transparent 60%)",
                scale: blobScale,
              }}
              animate={from({ x: [0, -20, 28, 0], y: [0, 20, -14, 0] })}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", repeatType: "mirror", delay: 4 }}
            />
          </div>

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(0,92,168,0.7) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* Telugu backdrop */}
          <div className="absolute right-0 top-1/2 -translate-y-[45%] select-none pointer-events-none lg:hidden" aria-hidden="true">
            <span style={{
              fontFamily: "'Noto Serif Telugu','Noto Sans Telugu',serif",
              fontSize: "clamp(12rem,22vw,28rem)",
              lineHeight: 1,
              color: "rgba(0,92,168,0.04)",
              display: "block",
              userSelect: "none",
              paddingRight: "2vw",
            }}>
              స్వేచ్ఛ
            </span>
          </div>

          {/* Hero content + image mosaic */}
          <div className="app-container relative z-20 py-28 md:py-32 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24">

              {/* Left: text */}
              <motion.div
                className="flex-1 min-w-0"
                style={{ y: contentY, opacity: contentOpacity }}
              >
                <motion.div
                  className="flex items-center gap-3 mb-10"
                  initial={from({ opacity: 0, x: -18 })}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.span
                    className="inline-block h-[2px] bg-primary rounded-full"
                    initial={from({ width: 0 })}
                    animate={{ width: 32 }}
                    transition={{ duration: 0.45, delay: 0.35 }}
                  />
                  <span className="text-sm font-semibold text-muted-foreground tracking-wide">
                    Andhra Pradesh&apos;s FOSS Community
                  </span>
                </motion.div>

                <h1 className="font-display text-[clamp(2.8rem,6.5vw,5.5rem)] font-extrabold leading-[0.92] tracking-tight text-foreground text-balance">
                  <motion.span
                    className="block"
                    initial={from({ opacity: 0, y: 30, filter: "blur(14px)" })}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Open source is
                  </motion.span>
                  <motion.span
                    className="block"
                    initial={from({ opacity: 0, y: 30, filter: "blur(14px)" })}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="relative inline-block text-primary">
                      AP&apos;s advantage.
                      <motion.span
                        className="absolute -bottom-2 left-0 h-[5px] bg-primary rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.7, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
                        style={{ originX: 0 }}
                      />
                    </span>
                  </motion.span>
                </h1>

                <motion.p
                  className="mt-8 text-lg text-muted-foreground max-w-lg leading-relaxed"
                  initial={from({ opacity: 0, y: 20 })}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.88 }}
                >
                  700+ members building open-source AI tools, Telugu computing, and
                  civic tech — across 9 campuses in Andhra Pradesh.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4 mt-9"
                  initial={from({ opacity: 0, y: 16 })}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 1.05 }}
                >
                  <Link href="/programs/fosstar#membership">
                    <motion.button
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-colors"
                    >
                      Join the Community
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                  <Link href="/about">
                    <motion.button
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-foreground border border-border hover:bg-muted transition-colors"
                    >
                      Our Story
                    </motion.button>
                  </Link>
                </motion.div>

                <motion.div
                  className="mt-14"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  <motion.div
                    animate={reduced ? {} : { y: [0, 7, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="text-muted-foreground/40"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right: image mosaic (desktop only) */}
              <motion.div
                className="hidden lg:block w-[400px] xl:w-[460px] shrink-0 relative"
                style={{ y: imageY, opacity: contentOpacity }}
              >
                <div className="relative h-[520px] xl:h-[560px]">

                  {/* Image 1 — top-left, large */}
                  <motion.div
                    className="absolute top-0 left-0 w-[260px] h-[185px] rounded-2xl overflow-hidden shadow-xl"
                    style={{ rotate: -2 }}
                    initial={from({ opacity: 0, y: 36, rotate: -2 })}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image src="/gallery/fosstar-summit.jpg" alt="FOSStar Summit" fill className="object-cover" />
                    <div className="absolute inset-0 bg-primary/10" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/80 to-transparent py-3 px-3">
                      <span className="text-white text-xs font-semibold">FOSStar Summit 2025</span>
                    </div>
                  </motion.div>

                  {/* Image 2 — top-right */}
                  <motion.div
                    className="absolute top-8 right-0 w-[190px] h-[155px] rounded-2xl overflow-hidden shadow-lg"
                    style={{ rotate: 2.5 }}
                    initial={from({ opacity: 0, y: 36, rotate: 2.5 })}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image src="/gallery/fossync-club.jpg" alt="FOSSynC Campus Club" fill className="object-cover" />
                    <div className="absolute inset-0 bg-primary/10" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/80 to-transparent py-3 px-3">
                      <span className="text-white text-xs font-semibold">FOSSynC Clubs</span>
                    </div>
                  </motion.div>

                  {/* Image 3 — middle-left */}
                  <motion.div
                    className="absolute top-[200px] left-6 w-[220px] h-[160px] rounded-2xl overflow-hidden shadow-lg"
                    style={{ rotate: 1.5 }}
                    initial={from({ opacity: 0, y: 36, rotate: 1.5 })}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image src="/gallery/fosstorm-workshop.jpg" alt="FOSStorm Workshop" fill className="object-cover" />
                    <div className="absolute inset-0 bg-primary/10" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/80 to-transparent py-3 px-3">
                      <span className="text-white text-xs font-semibold">FOSStorm Workshop</span>
                    </div>
                  </motion.div>

                  {/* Image 4 — bottom-right */}
                  <motion.div
                    className="absolute bottom-0 right-4 w-[210px] h-[155px] rounded-2xl overflow-hidden shadow-md"
                    style={{ rotate: -1.5 }}
                    initial={from({ opacity: 0, y: 36, rotate: -1.5 })}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image src="/gallery/fosspeaks-advocacy.jpg" alt="FOSSpeaks Advocacy" fill className="object-cover" />
                    <div className="absolute inset-0 bg-primary/10" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/80 to-transparent py-3 px-3">
                      <span className="text-white text-xs font-semibold">FOSSpeaks Advocacy</span>
                    </div>
                  </motion.div>

                  {/* Decorative connecting dots */}
                  <motion.div
                    className="absolute top-[175px] left-[140px] w-3 h-3 rounded-full bg-primary/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.4 }}
                  />
                  <motion.div
                    className="absolute top-[195px] left-[165px] w-2 h-2 rounded-full bg-primary/20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.6, duration: 0.4 }}
                  />
                  <motion.div
                    className="absolute bottom-[155px] right-[218px] w-2.5 h-2.5 rounded-full bg-primary/25"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.7, duration: 0.4 }}
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ══ CAMPUS TICKER ══════════════════════════════════ */}
        <div className="w-full bg-primary py-4 overflow-hidden" aria-label="Campuses with active FOSS clubs">
          <div className="ticker-track">
            {tickerItems.map((name, i) => (
              <span
                key={i}
                className="text-xs font-semibold text-white/70 uppercase tracking-[0.15em] shrink-0 px-5 inline-flex items-center gap-5"
              >
                {name}
                <span className="inline-block w-1 h-1 rounded-full bg-white/40" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>

        {/* ══ STATS STRIP ════════════════════════════════════ */}
        <section className="w-full py-12 bg-[hsl(var(--surface-2))]">
          <div className="app-container">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-border"
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {stats.map(({ value, label }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center px-6"
                >
                  <span className="font-display text-5xl font-extrabold text-primary leading-none">
                    {value}
                  </span>
                  <span className="mt-2 text-sm font-medium text-muted-foreground">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ VALUES ════════════════════════════════════════ */}
        <section className="w-full section-shell bg-background overflow-hidden">
          <div className="app-container">
            <motion.div
              className="mb-14 max-w-2xl"
              initial={from({ opacity: 0, y: 32 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground text-balance">
                <motion.span
                  className="block"
                  initial={from({ opacity: 0, y: 22, filter: "blur(8px)" })}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  Technology built for people,
                </motion.span>
                <motion.span
                  className="block"
                  initial={from({ opacity: 0, y: 22, filter: "blur(8px)" })}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  not shareholders.
                </motion.span>
              </h2>
              <motion.p
                className="mt-4 text-lg text-muted-foreground leading-relaxed"
                initial={from({ opacity: 0, y: 14 })}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.34 }}
              >
                Four commitments that guide everything we build and advocate for.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10"
              variants={stagger()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {values.map(({ icon: Icon, title, description, dir }, i) => (
                <motion.div
                  key={i}
                  variants={reduced ? {} : makeValueVariant(dir)}
                  className="flex gap-5"
                >
                  <motion.div
                    className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5"
                    whileHover={reduced ? {} : { scale: 1.1, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-lg mb-2">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">{description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ COMMUNITY PHOTOS ══════════════════════════════ */}
        <section className="w-full section-shell bg-[hsl(var(--surface-1))] overflow-hidden">
          <div className="app-container">
            <motion.div
              className="mb-10"
              initial={from({ opacity: 0, y: 24 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
                Community in action
              </h2>
              <p className="mt-3 text-muted-foreground text-lg">Real events, real impact, real people.</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              style={{ gridTemplateRows: "auto" }}
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {/* Large photo — spans 2 columns on md+ */}
              <motion.div
                variants={fadeUp}
                className="md:col-span-2 relative rounded-2xl overflow-hidden group cursor-pointer"
                style={{ aspectRatio: "16/9" }}
                whileHover={reduced ? {} : { scale: 1.01 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src="/gallery/fosstar-summit.jpg"
                  alt="FOSStar Summit 2025"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-white font-display font-bold text-2xl">FOSStar Summit 2025</p>
                  <p className="text-white/70 text-sm mt-1">900+ attendees · Vijayawada</p>
                </div>
              </motion.div>

              {/* Right column — two stacked photos */}
              <div className="flex flex-col gap-4">
                {[
                  { src: "/gallery/fossync-club.jpg", title: "FOSSynC Campus Clubs", sub: "9+ active chapters" },
                  { src: "/gallery/fosspeaks-advocacy.jpg", title: "FOSSpeaks Advocacy", sub: "State-level policy" },
                ].map((photo) => (
                  <motion.div
                    key={photo.title}
                    variants={fadeUp}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer flex-1"
                    style={{ aspectRatio: "4/3" }}
                    whileHover={reduced ? {} : { scale: 1.02 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-white font-semibold text-base">{photo.title}</p>
                      <p className="text-white/65 text-xs mt-0.5">{photo.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Second row of photos */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {[
                { src: "/gallery/fosstorm-workshop.jpg", title: "FOSStorm Workshop", sub: "Open source projects" },
                { src: "/gallery/fosserve-launch.jpg", title: "FOSServe Launch", sub: "School deployments" },
                { src: "/gallery/fossterage-database.jpg", title: "FOSSterage Archive", sub: "Open datasets" },
              ].map((photo) => (
                <motion.div
                  key={photo.title}
                  variants={fadeUp}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: "16/10" }}
                  whileHover={reduced ? {} : { scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/65 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="text-white font-semibold text-sm">{photo.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">{photo.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ PIPELINE DIAGRAM ══════════════════════════════ */}
        <section className="w-full section-shell bg-background overflow-hidden">
          <div className="app-container">
            <motion.div
              className="mb-14 text-center max-w-2xl mx-auto"
              initial={from({ opacity: 0, y: 24 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
                One community,<br className="hidden sm:block" /> end to end.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From a student&apos;s first Linux install to a startup&apos;s first open source product.
              </p>
            </motion.div>

            {/* Pipeline steps */}
            <div className="relative">
              {/* Connecting line (desktop) */}
              <div
                className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-[2px]"
                style={{ background: "linear-gradient(90deg, hsl(207 100% 33% / 0.2), hsl(207 100% 33% / 0.5), hsl(207 100% 33% / 0.2))" }}
                aria-hidden="true"
              />

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
                variants={stagger(0.12)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {pipeline.map(({ step, phase, icon: Icon, desc, logos }, i) => (
                  <motion.div
                    key={step}
                    variants={fadeUp}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Step icon circle */}
                    <motion.div
                      className="relative w-[104px] h-[104px] rounded-full border-2 border-primary/20 bg-background flex items-center justify-center mb-6 z-10 shadow-sm"
                      whileHover={reduced ? {} : { scale: 1.06, borderColor: "hsl(207 100% 33%)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    >
                      {/* Step number — faint background */}
                      <span
                        className="absolute inset-0 flex items-center justify-center font-display font-black text-5xl select-none pointer-events-none"
                        style={{ color: "hsl(207 100% 33% / 0.06)" }}
                        aria-hidden="true"
                      >
                        {step}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </motion.div>

                    {/* Phase label */}
                    <h3 className="font-display text-xl font-extrabold text-foreground mb-2">{phase}</h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-[220px]">{desc}</p>

                    {/* Program logos */}
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {logos.map(({ src, label }) => (
                        <div
                          key={label}
                          className="h-7 px-1 flex items-center"
                          title={label}
                        >
                          <Image
                            src={src}
                            alt={label}
                            width={80}
                            height={28}
                            className="h-6 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Arrow to next (mobile/tablet) */}
                    {i < pipeline.length - 1 && (
                      <div className="lg:hidden mt-6 text-primary/40">
                        <ChevronDown className="h-5 w-5 mx-auto" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ PROGRAMS ══════════════════════════════════════ */}
        <section className="w-full section-shell bg-[hsl(var(--surface-1))] overflow-hidden">
          <div className="app-container">
            <motion.div
              className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
              initial={from({ opacity: 0, y: 28 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
                  Seven programmes.
                  <br />One mission.
                </h2>
                <p className="mt-4 text-muted-foreground text-lg max-w-xl">
                  From campus clubs to open datasets — every programme serves AP&apos;s open source future.
                </p>
              </div>
              <Link href="/programs" className="shrink-0 self-start sm:self-end">
                <motion.button
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground border border-border hover:bg-muted transition-colors"
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="divide-y divide-border"
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {programs.map((program) => (
                <motion.div
                  key={program.id}
                  variants={reduced ? {} : { hidden: { opacity: 0, x: -28 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16,1,0.3,1] as const } } }}
                  className="group"
                >
                  <Link
                    href={program.href}
                    className="flex items-center gap-5 py-5 -mx-3 px-3 rounded-xl hover:bg-background transition-colors"
                  >
                    <div className="flex-shrink-0 w-28 sm:w-36 h-9 flex items-center">
                      <Image
                        src={program.logo || "/placeholder.svg"}
                        alt={`${program.title} programme`}
                        width={144}
                        height={36}
                        className="h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <p className="flex-1 min-w-0 text-sm text-muted-foreground leading-relaxed line-clamp-1 hidden sm:block">
                      {program.description}
                    </p>
                    <ChevronRight
                      className={`flex-shrink-0 h-5 w-5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0.5 transition-all ${PROGRAM_TEXT_CLASS[program.id]}`}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════ */}
        <section className="w-full section-shell bg-background overflow-hidden">
          <div className="app-container">
            <motion.div
              initial={from({ opacity: 0, scale: 0.97, y: 28 })}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-3xl overflow-hidden relative bg-primary px-10 py-14 md:px-16 md:py-20">
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  aria-hidden="true"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <motion.div
                  className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 65%)" }}
                  animate={reduced ? {} : { scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                  <div className="space-y-4 max-w-xl">
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight text-balance">
                      Open source is Andhra Pradesh&apos;s advantage.
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed">
                      Join 700+ members — students, developers, educators, and institutions — building the
                      open technology layer for AP&apos;s digital future.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 flex-shrink-0">
                    <Link href="/programs/fosstar#membership">
                      <motion.button
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-primary bg-white hover:bg-white/90 shadow-lg transition-colors"
                      >
                        Become a Member
                      </motion.button>
                    </Link>
                    <Link href="/contribute">
                      <motion.button
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors"
                      >
                        Contribute
                        <ArrowRight className="h-4 w-4" />
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
