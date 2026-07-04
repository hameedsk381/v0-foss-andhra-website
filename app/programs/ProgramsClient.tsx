"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { PROGRAMS, PROGRAM_PHOTOS } from "@/lib/programs"
import { Reveal, StaggerGroup, StaggerItem, Parallax, HoverLift } from "@/components/motion-primitives"

const pillars = [
    { title: "Education-First", desc: "Equipping the next generation with FOSS skills via FOSSynC and FOSServe." },
    { title: "Social Advocacy", desc: "Promoting digital freedom and open tech for society through FOSSpeaks." },
    { title: "Innovation Hub", desc: "Funding and incubating open source startups with FOSStart." },
    { title: "Knowledge Management", desc: "Archiving critical research and data in FOSSterage." },
]

export default function ProgramsClient() {
    const reduced = useReducedMotion()

    return (
        <div className="flex flex-col min-h-screen">

            {/* ══ HERO — full-bleed photo ══════════════════════ */}
            <section className="relative w-full min-h-[62vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/gallery/fosstar-summit.jpg"
                        alt="FOSS Andhra programmes"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                </div>
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(100deg, rgba(0,40,100,0.96) 0%, rgba(0,70,150,0.88) 40%, rgba(0,92,168,0.55) 70%, rgba(0,92,168,0.25) 100%)",
                    }}
                />

                <div className="app-container relative z-10 py-24">
                    <div className="max-w-2xl">
                        <motion.div
                            className="flex items-center gap-3 mb-7"
                            initial={reduced ? {} : { opacity: 0, x: -18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="inline-block w-8 h-[2px] bg-white/60 rounded-full" />
                            <span className="text-sm font-semibold text-white/70 tracking-widest uppercase">
                                What we do
                            </span>
                        </motion.div>

                        <h1 className="font-display text-[clamp(2.6rem,5.5vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight text-white text-balance">
                            <motion.span
                                className="block"
                                initial={reduced ? {} : { opacity: 0, y: 28, filter: "blur(12px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                                Seven programmes.
                            </motion.span>
                            <motion.span
                                className="block text-white/85"
                                initial={reduced ? {} : { opacity: 0, y: 28, filter: "blur(12px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.75, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                            >
                                One open future.
                            </motion.span>
                        </h1>

                        <motion.p
                            className="mt-7 text-lg md:text-xl text-white/65 leading-relaxed max-w-lg"
                            initial={reduced ? {} : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.66 }}
                        >
                            From a student&apos;s first Linux install to statewide open source policy —
                            each programme covers one stage of AP&apos;s open source pipeline.
                        </motion.p>
                    </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
            </section>

            {/* ══ PROGRAM CARDS ════════════════════════════════ */}
            <section className="w-full section-shell bg-background">
                <div className="app-container">
                    <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" gap={0.07}>
                        {PROGRAMS.map((p) => (
                            <StaggerItem key={p.id}>
                                <HoverLift className="h-full">
                                    <Link href={`/programs/${p.slug}`} className="group block h-full">
                                        <div className="h-full rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300">
                                            <div className="relative h-44 overflow-hidden">
                                                <Image
                                                    src={PROGRAM_PHOTOS[p.id]}
                                                    alt={p.displayName}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/15 to-transparent" />
                                                <div className="absolute bottom-3 left-3">
                                                    <Image
                                                        src={p.logo}
                                                        alt={p.displayName}
                                                        width={92}
                                                        height={30}
                                                        className="h-7 w-auto object-contain drop-shadow-md"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h2 className="font-display font-bold text-foreground text-lg mb-1.5 group-hover:text-primary transition-colors">
                                                    {p.displayName}
                                                </h2>
                                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                                    {p.description}
                                                </p>
                                                <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                                                    Explore programme <ArrowRight className="h-3.5 w-3.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </HoverLift>
                            </StaggerItem>
                        ))}
                    </StaggerGroup>
                </div>
            </section>

            {/* ══ STRATEGY ═════════════════════════════════════ */}
            <section className="w-full section-shell bg-[hsl(var(--surface-1))] overflow-hidden">
                <div className="app-container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Reveal>
                                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">How it fits together</p>
                                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground mb-5 leading-tight">
                                    One strategy,<br />every layer of society.
                                </h2>
                                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                    Every layer of society — from students and educators to government and
                                    entrepreneurs — gets a programme designed for its stage of the open source journey.
                                </p>
                            </Reveal>
                            <StaggerGroup className="space-y-3" gap={0.09}>
                                {pillars.map((item) => (
                                    <StaggerItem key={item.title} from="left">
                                        <div className="flex gap-4 p-4 rounded-xl bg-card border border-border">
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

                        <Parallax distance={36}>
                            <Reveal blur={false}>
                                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                    <Image
                                        src="/stock/collaboration.jpg"
                                        alt="Community collaboration"
                                        width={1000}
                                        height={800}
                                        className="object-cover w-full h-[480px]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <p className="font-display text-2xl font-bold text-balance">
                                            Building digital sovereignty for Andhra Pradesh
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        </Parallax>
                    </div>
                </div>
            </section>
        </div>
    )
}
