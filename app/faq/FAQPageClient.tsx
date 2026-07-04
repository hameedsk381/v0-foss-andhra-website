"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, Mail, MessageSquare } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives"

export default function FAQPage() {
    const faqs = [
        {
            category: "General",
            questions: [
                {
                    q: "What is FOSS Andhra?",
                    a: "FOSS Andhra (fossap.in) is an independent community organisation based in Vijayawada, Andhra Pradesh. We promote free and open source software across education, governance, and society through seven programmes: FOSStar, FOSServe, FOSSynC, FOSStorm, FOSStart, FOSSterage, and FOSSpeaks."
                },
                {
                    q: "What is FOSS Andhra's role in the AI era?",
                    a: "The most critical AI infrastructure in 2026 — PyTorch, Llama, Mistral, Hugging Face — is open source. FOSS Andhra helps AP students and institutions understand and contribute to this stack rather than depending solely on proprietary AI. Our FOSStorm programme builds Telugu-language NLP tools and open datasets to address the gap in regional-language AI resources."
                },
                {
                    q: "How does FOSS Andhra relate to India's Digital Public Infrastructure?",
                    a: "India's DPI stack — UPI, ONDC, DIGIT, Beckn — is built on open source principles. FOSS Andhra advocates for AP government bodies to adopt DPI-compatible open source tools, and our FOSServe programme works directly with educational institutions and local government offices to deploy and support these solutions."
                },
                {
                    q: "Is FOSS Andhra a government organisation?",
                    a: "No. FOSS Andhra is an independent NGO. We collaborate with government bodies and educational institutions but are not affiliated with or funded by any government agency."
                }
            ]
        },
        {
            category: "Membership",
            questions: [
                {
                    q: "How can I join FOSS Andhra?",
                    a: "Join through the FOSStar membership programme at fossap.in/programs/fosstar. Tiers are available for Students, Professionals, and Institutions. Members get access to events, workshops, the FOSS Andhra mentor network, and FOSStorm project opportunities."
                },
                {
                    q: "What are the benefits of being a member?",
                    a: "Members get access to exclusive workshops, mentorship from open source practitioners, opportunities to contribute to FOSStorm projects, early access to events, and a network spanning 700+ students and professionals across Andhra Pradesh."
                },
                {
                    q: "Is there a fee for membership?",
                    a: "We have nominal annual fees to keep community operations sustainable. Visit fossap.in/membership for current pricing across Student, Professional, and Institutional tiers."
                }
            ]
        },
        {
            category: "Programs",
            questions: [
                {
                    q: "What is FOSSynC and how can my college start a club?",
                    a: "FOSSynC is our campus club programme with 9+ active chapters at AP universities including JNTU Kakinada, Andhra University, NIT Tadepalligudem, and IIT Tirupati. To start a club, email office@fossap.in with your college name and a founding team of at least 10 students. We provide a resource kit, mentor access, and a speaker for your first event — free of charge."
                },
                {
                    q: "What open source projects does FOSS Andhra build?",
                    a: "FOSStorm builds community software for AP's specific needs: TeluguNLP (NLP toolkit for Telugu language), OpenEdu (offline-first LMS for schools with limited connectivity), CivicDocs (document management for local government), and FarmConnect (agricultural data platform for farmers). All code is on github.com/fossandhra under open licences."
                },
                {
                    q: "What is FOSStart?",
                    a: "FOSStart is our incubation programme for founders building on open source foundations. It provides seed funding support, mentorship, open source licensing guidance, and connections to the wider AP tech ecosystem. Enquire at fossap.in/programs/fosstart."
                },
                {
                    q: "What is FOSSterage?",
                    a: "FOSSterage is our open knowledge repository — curated datasets, research archives, documentation, and learning materials focused on Telugu-language computing, regional data science, and FOSS toolchains. Particularly relevant for researchers and AI practitioners working with Indic languages."
                }
            ]
        },
        {
            category: "Contributing",
            questions: [
                {
                    q: "How can I contribute if I am not a developer?",
                    a: "Non-developer contributions are essential: technical writing, Telugu translation, event organisation, graphic design, outreach to colleges, and financial support via donation or sponsorship. Visit fossap.in/contribute or email office@fossap.in to match your skills to an active need."
                },
                {
                    q: "Can organisations sponsor FOSS Andhra?",
                    a: "Yes. We offer event-level, programme-level, and annual sponsorship packages. Sponsors gain visibility across our 700+ member network, campus events, and online presence. Contact office@fossap.in or visit fossap.in/contribute/sponsor for details."
                }
            ]
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <PageHero
                eyebrow="Support"
                title="Frequently asked"
                titleLine2="questions."
                subtitle="Find answers about FOSS Andhra, our programmes, and how you can get involved."
                image="/stock/classroom.jpg"
            >
                <div className="relative max-w-xl mt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full pl-12 pr-4 py-4 rounded-full text-foreground bg-white border-none shadow-lg focus:ring-2 focus:ring-secondary outline-none"
                    />
                </div>
            </PageHero>

            {/* FAQ content */}
            <section className="w-full section-shell bg-background">
                <div className="app-container">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {faqs.map((cat, i) => (
                            <Reveal key={i} delay={i * 0.08}>
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">{cat.category}</h2>
                                <Accordion type="single" collapsible className="w-full bg-card rounded-xl shadow-sm border border-border px-6">
                                    {cat.questions.map((faq, j) => (
                                        <AccordionItem key={j} value={`item-${i}-${j}`} className={j === cat.questions.length - 1 ? "border-b-0" : ""}>
                                            <AccordionTrigger className="text-left py-4 hover:no-underline font-semibold text-lg text-foreground">
                                                {faq.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground pb-4 text-base leading-relaxed">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still have questions? */}
            <section className="w-full section-shell bg-[hsl(var(--surface-1))]">
                <div className="app-container text-center">
                    <Reveal>
                        <h2 className="font-display text-3xl font-extrabold text-foreground mb-6">Still have questions?</h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                            If you couldn't find the answer you were looking for, please don't hesitate to get in touch with our team.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/contact">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2">
                                    <Mail className="h-4 w-4" /> Contact Support
                                </Button>
                            </Link>
                            <Link href="/contribute/volunteer">
                                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 gap-2">
                                    <MessageSquare className="h-4 w-4" /> Ask Community
                                </Button>
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    )
}
