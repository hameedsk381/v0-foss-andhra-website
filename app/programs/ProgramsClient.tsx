"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { PROGRAMS_BY_ID, PILLARS } from "@/lib/programs"
import { StaggerGroup, StaggerItem } from "@/components/motion-primitives"

const pillars = [
    { title: "Education-First", desc: "Equipping the next generation with FOSS skills via FOSSynC and FOSServe." },
    { title: "Social Advocacy", desc: "Promoting digital freedom and open tech for society through FOSSpeaks." },
    { title: "Innovation Hub", desc: "Funding and incubating open source startups with FOSStart." },
    { title: "Knowledge Management", desc: "Archiving critical research and data in FOSSterage." },
]

const team = [
    { name: "Venkata Vishnu Vardhan", affiliation: "Andhra Loyola Institute of Engineering and Technology" },
    { name: "Akhila Reddy", affiliation: "Andhra Loyola Institute of Engineering and Technology" },
    { name: "Pranathi Balusu", affiliation: "SRM University Amaravathi" },
    { name: "Dinesh Dabbikar", affiliation: "Andhra Loyola College" },
]

export default function ProgramsClient() {
    const reduced = useReducedMotion()

    return (
        <div className="flex flex-col min-h-screen">

            {/* ══ HERO — flat, two-column ═══════════════════════ */}
            <section className="w-full border-b border-border bg-primary/[0.04] py-10 sm:py-14">
                <div className="app-container grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
                    <motion.div
                        initial={reduced ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="eyebrow mb-4">What we do</p>

                        <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-foreground text-balance">
                            Seven programmes. <span className="text-primary">One open future.</span>
                        </h1>

                        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                            From a student&apos;s first Linux install to statewide open source policy —
                            each programme covers one stage of AP&apos;s open source pipeline.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/membership" className="cta-primary">
                                Find your programme <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/events" className="cta-secondary">
                                Meet the community
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
                        initial={reduced ? {} : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Image src="/gallery/fosstar-summit.jpg" alt="FOSS Andhra programmes" fill priority className="object-cover object-center" />
                    </motion.div>
                </div>
            </section>

            {/* ══ PROGRAM CARDS — grouped by ecosystem pillar ═══ */}
            <section className="w-full section-shell bg-background">
                <div className="app-container space-y-12">
                    {PILLARS.map((pillar) => (
                        <div key={pillar.id}>
                            <div className="mb-5">
                                <p className="eyebrow mb-1.5">{pillar.label}</p>
                                <p className="text-sm text-muted-foreground max-w-xl">{pillar.tagline}</p>
                            </div>
                            <StaggerGroup
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                                gap={0.07}
                            >
                                {pillar.programs.map((programId) => {
                                    const p = PROGRAMS_BY_ID[programId]
                                    return (
                                        <StaggerItem key={p.id}>
                                            <Link href={`/programs/${p.slug}`} className="group block h-full">
                                                <div className="h-full rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40">
                                                    <Image
                                                        src={p.logo}
                                                        alt={p.displayName}
                                                        width={100}
                                                        height={28}
                                                        className="h-7 w-auto object-contain mb-4"
                                                    />
                                                    <h2 className="font-display font-bold text-foreground text-lg mb-1.5">
                                                        {p.displayName}
                                                    </h2>
                                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                                        {p.description}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                                                        Explore programme <ArrowRight className="h-3.5 w-3.5" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </StaggerItem>
                                    )
                                })}
                            </StaggerGroup>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ STRATEGY ═════════════════════════════════════ */}
            <section className="w-full section-shell bg-muted/30 border-y border-border">
                <div className="app-container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="eyebrow mb-2">How it fits together</p>
                            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-5 leading-tight">
                                One strategy,<br />every layer of society.
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                Every layer of society — from students and educators to government and
                                entrepreneurs — gets a programme designed for its stage of the open source journey.
                            </p>
                            <StaggerGroup className="space-y-3" gap={0.09}>
                                {pillars.map((item) => (
                                    <StaggerItem key={item.title} from="left">
                                        <div className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-display font-bold text-foreground">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerGroup>
                        </div>

                        <div className="relative rounded-lg overflow-hidden border border-border">
                            <Image
                                src="/stock/collaboration.jpg"
                                alt="Community collaboration"
                                width={1000}
                                height={800}
                                className="object-cover w-full h-[480px]"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-6">
                                <p className="font-display text-lg font-bold text-foreground text-balance">
                                    Building digital sovereignty for Andhra Pradesh
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ OUR TEAM ═════════════════════════════════════ */}
            <section className="w-full section-shell bg-background">
                <div className="app-container">
                    <div className="mb-10 max-w-xl">
                        <p className="eyebrow mb-2">Our Team</p>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                            Campus contributors driving our programmes.
                        </h2>
                    </div>

                    <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" gap={0.07}>
                        {team.map((member) => (
                            <StaggerItem key={member.name}>
                                <div className="h-full rounded-lg border border-border bg-card p-5 text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                                        {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </div>
                                    <h3 className="font-display font-bold text-foreground text-[1.05rem]">{member.name}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{member.affiliation}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </div>
            </section>
        </div>
    )
}
