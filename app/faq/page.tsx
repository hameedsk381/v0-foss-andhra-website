"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, Mail, MessageSquare } from "lucide-react"

export default function FAQPage() {
    const faqs = [
        {
            category: "General",
            questions: [
                {
                    q: "What is FOSS Andhra?",
                    a: "FOSS Andhra is a community-driven organization dedicated to promoting Free and Open Source Software (FOSS) across education, governance, and society in Andhra Pradesh, India. We aim to build a robust open-source ecosystem through various specialized programs."
                },
                {
                    q: "Is FOSS Andhra a government organization?",
                    a: "No, FOSS Andhra is an independent community organization. However, we work closely with government bodies through our FOSServe program to implement open-source solutions in public services."
                },
                {
                    q: "How can I join the FOSS Andhra community?",
                    a: "You can join by becoming a member through our FOSStar program, volunteering for specific initiatives via our Contribute page, or joining our online community platforms."
                }
            ]
        },
        {
            category: "Membership",
            questions: [
                {
                    q: "What are the different types of membership?",
                    a: "We offer three main membership types: Student (for individuals in educational institutions), Professional (for working individuals), and Institutional (for organizations and institutions)."
                },
                {
                    q: "What are the benefits of being a member?",
                    a: "Benefits include access to exclusive workshops, mentorship from FOSS experts, opportunities to contribute to real-world projects, voting rights in community decisions, and early access to educational resources."
                },
                {
                    q: "Is there a fee for membership?",
                    a: "Yes, we have nominal annual fees to support our community operations. Student membership is ₹500/year, Professional is ₹2,000/year, and Institutional is ₹10,000/year."
                }
            ]
        },
        {
            category: "Programs",
            questions: [
                {
                    q: "What is FOSSynC?",
                    a: "FOSSynC is our student-led FOSS clubs initiative. We help establish and mentor open-source clubs in educational institutions across Andhra Pradesh."
                },
                {
                    q: "How can my college start a FOSS club?",
                    a: "You can reach out to us through the FOSSynC program page or the Contact Us form. We'll guide you through the process of setting up a club, providing resources, and connecting you with mentors."
                },
                {
                    q: "What is FOSSart?",
                    a: "FOSSart is our entrepreneurship and incubation program. It provides funding, mentorship, and workspace for developers building open-source startups."
                }
            ]
        },
        {
            category: "Contributions",
            questions: [
                {
                    q: "How can I contribute if I'm not a developer?",
                    a: "FOSS needs more than just code! You can help with documentation, translation, graphic design, community management, social media, and event organization. Visit our Contribute page to see all volunteer roles."
                },
                {
                    q: "Can I sponsor a specific event or project?",
                    a: "Yes! We offer tiered sponsorship packages and program-specific sponsorship opportunities. Please contact our sponsorship team via the Contribute page."
                }
            ]
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <section className="w-full py-16 md:py-24 bg-primary text-white">
                <div className="container px-4 md:px-6">
                    <AnimatedSection variant="fadeUp" className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
                        <p className="mx-auto max-w-[700px] text-xl text-blue-100 mb-8">
                            Find answers to common questions about FOSS Andhra, our programs, and how you can get involved.
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 border-none shadow-lg focus:ring-2 focus:ring-secondary outline-none"
                            />
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* FAQ content */}
            <section className="w-full py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {faqs.map((cat, i) => (
                            <AnimatedSection key={i} variant="fadeUp" delay={i * 0.1}>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b">{cat.category}</h2>
                                <Accordion type="single" collapsible className="w-full bg-white rounded-xl shadow-sm border px-6">
                                    {cat.questions.map((faq, j) => (
                                        <AccordionItem key={j} value={`item-${i}-${j}`} className={j === cat.questions.length - 1 ? "border-b-0" : ""}>
                                            <AccordionTrigger className="text-left py-4 hover:no-underline font-semibold text-lg text-gray-800">
                                                {faq.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-gray-600 pb-4 text-base leading-relaxed">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still have questions? */}
            <section className="w-full py-12 md:py-24 bg-white">
                <div className="container px-4 md:px-6 text-center">
                    <AnimatedSection variant="fadeUp">
                        <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
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
                    </AnimatedSection>
                </div>
            </section>
        </div>
    )
}
