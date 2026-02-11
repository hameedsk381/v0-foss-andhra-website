"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Code, BookOpen, GraduationCap, Rocket, Database, Megaphone, Users } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedCard } from "@/components/ui/animated-card"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { programInfo } from "@/lib/utils"

export default function ProgramsClient() {
    const programs = Object.entries(programInfo).map(([key, value]) => ({
        id: key,
        title: value.title,
        description: value.description,
        href: `/programs/${key}`,
        color: value.color,
        icon: value.icon,
        logo: `/logos/${key}-logo.png`,
    }))

    const getIconComponent = (iconName: string) => {
        const icons: Record<string, React.ReactNode> = {
            Users: <Users className="h-8 w-8 text-fosstar" />,
            BookOpen: <BookOpen className="h-8 w-8 text-purple-600" />,
            GraduationCap: <GraduationCap className="h-8 w-8 text-green-600" />,
            Code: <Code className="h-8 w-8 text-orange-600" />,
            Rocket: <Rocket className="h-8 w-8 text-red-600" />,
            Database: <Database className="h-8 w-8 text-blue-600" />,
            Megaphone: <Megaphone className="h-8 w-8 text-yellow-600" />,
        }
        return icons[iconName] || <Code className="h-8 w-8" />
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="w-full py-16 md:py-24 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
                <div className="container px-4 md:px-6 relative z-10 text-center">
                    <AnimatedSection variant="fadeUp">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Our Programs</h1>
                        <p className="mx-auto max-w-[800px] text-xl text-blue-100">
                            Discover our comprehensive initiatives designed to foster a vibrant FOSS ecosystem across Andhra Pradesh
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="w-full py-12 md:py-24 bg-white">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((program, index) => (
                            <AnimatedSection key={program.id} variant="fadeUp" delay={index * 0.1}>
                                <Link href={program.href} className="block h-full group">
                                    <AnimatedCard className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-primary/5 transition-colors">
                                                    {getIconComponent(program.icon)}
                                                </div>
                                                <Image
                                                    src={program.logo}
                                                    alt={program.title}
                                                    width={100}
                                                    height={40}
                                                    className="h-8 w-auto grayscale group-hover:grayscale-0 transition-all"
                                                />
                                            </div>
                                            <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                                                {program.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base text-gray-600 line-clamp-3">
                                                {program.description}
                                            </CardDescription>
                                        </CardContent>
                                        <CardFooter className="pt-0">
                                            <div className="flex items-center text-primary font-semibold">
                                                Explore Program <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </CardFooter>
                                    </AnimatedCard>
                                </Link>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Program Pillars / Strategy Section */}
            <section className="w-full py-12 md:py-24 bg-gray-50">
                <div className="container px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <AnimatedSection variant="fadeRight">
                            <h2 className="text-3xl font-bold mb-6">Our Implementation Strategy</h2>
                            <p className="text-gray-600 text-lg mb-8">
                                FOSS Andhra operates through a strategically designed multi-program approach, ensuring that every layer of society—from students and educators to government and entrepreneurs—is empowered with open source solutions.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { title: "Education-First", desc: "Equipping the next generation with FOSS skills via FOSSynC and FOSServe." },
                                    { title: "Social Advocacy", desc: "Promoting digital freedom and open tech for society through FOSSpeaks." },
                                    { title: "Innovation Hub", desc: "Funding and incubating open source startups with FOSStart." },
                                    { title: "Knowledge Management", desc: "Archiving critical research and data in FOSSterage." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-lg bg-white shadow-sm">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedSection>
                        <AnimatedSection variant="fadeLeft">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/gallery/fosstar-summit.jpg"
                                    alt="Strategic Pillars"
                                    width={1000}
                                    height={800}
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <p className="text-2xl font-bold">Building Digital Sovereignty for Andhra Pradesh</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>
        </div>
    )
}
