"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, Users, Calendar, CheckCircle, Star, Heart, Briefcase, Database, MapPin, Globe, Github } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Program {
    id: string
    name: string
    title: string
    description: string
    tagline?: string
    mission?: string
    color: string
    logo?: string
    initiatives?: any[]
    team?: any[]
    casestudies?: any[]
    clubs?: any[]
    projects?: any[]
    startups?: any[]
    repositories?: any[]
}

export default function ProgramPage({ params }: { params: { slug: string } }) {
    const [program, setProgram] = useState<Program | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        fetchProgram()
    }, [params.slug])

    const fetchProgram = async () => {
        try {
            const res = await fetch(`/api/programs/${params.slug}`)
            const data = await res.json()

            if (data.success && data.data) {
                setProgram(data.data)
            } else {
                // Handle not found or error appropriately
                console.error("Program not found")
            }
        } catch (error) {
            console.error("Error fetching program:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!program) {
        return notFound()
    }

    // Helper for dynamic colors
    const primaryColor = program.color || "#015ba7"
    const bgStyle = { backgroundColor: primaryColor }
    const textStyle = { color: primaryColor }
    const bgLightStyle = { backgroundColor: `${primaryColor}15` } // ~10% opacity
    const borderStyle = { borderColor: primaryColor }

    // Group initiatives by category if available, otherwise just list them
    const initiativesByCategory = program.initiatives?.reduce((acc: any, initiative: any) => {
        const category = initiative.category || "General"
        if (!acc[category]) acc[category] = []
        acc[category].push(initiative)
        return acc
    }, {})

    const categories = Object.keys(initiativesByCategory || {})

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="w-full py-16 md:py-24 relative overflow-hidden" style={bgStyle}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/0" />
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <AnimatedSection variant="fadeRight">
                            <div className="flex flex-col space-y-4">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{program.title}</h1>
                                <p className="text-xl text-white/90 max-w-[600px]">
                                    {program.tagline || program.description}
                                </p>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <Link href="#initiatives">
                                        <AnimatedButton className="bg-background hover:bg-background/90" style={textStyle}>
                                            Our Initiatives
                                        </AnimatedButton>
                                    </Link>
                                    <Link href="/contact">
                                        <AnimatedButton
                                            variant="outline"
                                            className="border-white text-white bg-transparent hover:bg-background/10"
                                        >
                                            Contact Us
                                        </AnimatedButton>
                                    </Link>
                                </div>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection variant="fadeLeft">
                            <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative z-10 bg-background/10 p-8 rounded-full backdrop-blur-sm"
                                >
                                    <Image
                                        src={program.logo || "/placeholder-logo.svg"}
                                        alt={program.title}
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                    />
                                </motion.div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="w-full py-12 md:py-24 bg-background" id="about">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <AnimatedSection variant="fadeUp">
                            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">About {program.title}</h2>
                            <div className="h-1 w-20 mx-auto rounded" style={bgStyle} />
                            <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                                {program.mission || program.description}
                            </p>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Initiatives / Content Tabs */}
            {(program.initiatives?.length || 0) > 0 && (
                <section className="w-full py-12 md:py-24 bg-[hsl(var(--surface-1))]" id="initiatives">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection variant="fadeUp">
                            <div className="text-center mb-12">
                                <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Key Initiatives</h2>
                                <p className="mt-2 text-muted-foreground">Discover what we're building together</p>
                            </div>
                        </AnimatedSection>

                        <Tabs defaultValue={categories[0]} className="w-full">
                            {categories.length > 1 && (
                                <div className="flex justify-center mb-8">
                                    <TabsList>
                                        {categories.map((category) => (
                                            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                            )}

                            {categories.map((category) => (
                                <TabsContent key={category} value={category} className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {initiativesByCategory[category].map((initiative: any, index: number) => (
                                            <AnimatedSection key={initiative.id} variant="fadeUp" delay={index * 0.1}>
                                                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                                    <CardHeader style={bgLightStyle} className="pb-4">
                                                        <CardTitle style={textStyle}>{initiative.title}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="pt-6">
                                                        <p className="text-muted-foreground">{initiative.description}</p>
                                                    </CardContent>
                                                </Card>
                                            </AnimatedSection>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </section>
            )}

            {/* Projects Showcase */}
            {(program.projects?.length || 0) > 0 && (
                <section className="w-full py-12 md:py-24 bg-background" id="projects">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection variant="fadeUp">
                            <div className="text-center mb-12">
                                <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Featured Projects</h2>
                                <p className="mt-2 text-muted-foreground">Open source solutions built by our community</p>
                            </div>
                        </AnimatedSection>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {program.projects?.map((project: any, index: number) => (
                                <AnimatedSection key={project.id} variant="fadeUp" delay={index * 0.1}>
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                {project.name}
                                                {project.githubUrl && (
                                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                        <Github className="h-5 w-5 text-muted-foreground hover:text-black transition-colors" />
                                                    </a>
                                                )}
                                            </CardTitle>
                                            <CardDescription>{project.technologies}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                                            <div className="flex gap-2 items-center">
                                                <Badge variant="secondary" className="capitalize">{project.status}</Badge>
                                                {project.websiteUrl && (
                                                    <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                                        <Globe className="h-3 w-3" /> Website
                                                    </a>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Clubs Showcase */}
            {(program.clubs?.length || 0) > 0 && (
                <section className="w-full py-12 md:py-24 bg-background" id="clubs">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection variant="fadeUp">
                            <div className="text-center mb-12">
                                <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Campus Clubs</h2>
                                <p className="mt-2 text-muted-foreground">Student-led FOSS societies across institutions</p>
                            </div>
                        </AnimatedSection>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {program.clubs?.map((club: any, index: number) => (
                                <AnimatedSection key={club.id} variant="fadeUp" delay={index * 0.1}>
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle className="text-xl">{club.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {club.location}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Institution:</span>
                                                    <span className="font-medium">{club.institution}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Established:</span>
                                                    <span className="font-medium">{club.established}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Active Members:</span>
                                                    <Badge variant="outline">{club.members}+</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Startups Showcase */}
            {(program.startups?.length || 0) > 0 && (
                <section className="w-full py-12 md:py-24 bg-background" id="startups">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection variant="fadeUp">
                            <div className="text-center mb-12">
                                <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Featured Startups</h2>
                                <p className="mt-2 text-muted-foreground">Innovators building sustainable businesses on FOSS</p>
                            </div>
                        </AnimatedSection>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {program.startups?.map((startup: any, index: number) => (
                                <AnimatedSection key={startup.id} variant="fadeUp" delay={index * 0.1}>
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle className="text-xl">{startup.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> Founded {startup.founded}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{startup.description}</p>
                                            <div className="flex justify-between items-center text-sm border-t pt-4">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {startup.location}
                                                </span>
                                                {startup.websiteUrl && (
                                                    <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                        Visit Website
                                                    </a>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Repositories Showcase */}
            {(program.repositories?.length || 0) > 0 && (
                <section className="w-full py-12 md:py-24 bg-[hsl(var(--surface-1))]" id="repositories">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection variant="fadeUp">
                            <div className="text-center mb-12">
                                <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Open Repositories</h2>
                                <p className="mt-2 text-muted-foreground">Secure and accessible data & knowledge archives</p>
                            </div>
                        </AnimatedSection>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {program.repositories?.map((repo: any, index: number) => (
                                <AnimatedSection key={repo.id} variant="fadeUp" delay={index * 0.1}>
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center text-xl">
                                                {repo.name}
                                                <Database className="h-5 w-5 text-primary" />
                                            </CardTitle>
                                            <CardDescription>{repo.category} • {repo.type}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-4">{repo.description}</p>
                                            {repo.features && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {repo.features.split(',').map((feature: string) => (
                                                        <Badge key={feature} variant="secondary" className="text-[10px]">{feature.trim()}</Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            {(program.team?.length || 0) > 0 && (
                <section className="w-full py-12 md:py-24 bg-[hsl(var(--surface-1))]" id="team">
                    <div className="container px-4 md:px-6">
                        <AnimatedSection variant="fadeUp">
                            <div className="text-center mb-12">
                                <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Our Team</h2>
                                <p className="mt-2 text-muted-foreground">The people driving this initiative</p>
                            </div>
                        </AnimatedSection>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {program.team?.map((member: any, index: number) => (
                                <AnimatedSection key={member.id} variant="fadeUp" delay={index * 0.1}>
                                    <AnimatedCard className="overflow-hidden h-full">
                                        <div className="h-48 bg-muted flex items-center justify-center relative">
                                            {member.avatar ? (
                                                <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                                            ) : (
                                                <Users className="h-16 w-16 text-muted-foreground" />
                                            )}
                                        </div>
                                        <CardContent className="pt-6 text-center">
                                            <h3 className="font-bold text-lg">{member.name}</h3>
                                            <p className="text-sm font-medium mb-3" style={textStyle}>{member.role}</p>
                                            {member.bio && <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>}
                                        </CardContent>
                                    </AnimatedCard>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="w-full py-16 md:py-24 text-white" style={bgStyle} id="membership">
                <div className="container px-4 md:px-6 text-center">
                    <AnimatedSection variant="scaleUp">
                        <h2 className="text-3xl font-bold mb-4">Join {program.title} Today</h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Be part of the movement and contribute to the open source ecosystem in Andhra Pradesh.
                        </p>
                        <div className="flex justify-center gap-4">
                            {program.name === 'fosstar' && (
                                <Link href="/membership">
                                    <AnimatedButton className="bg-background hover:bg-background/90" style={textStyle}>
                                        Become a Member
                                    </AnimatedButton>
                                </Link>
                            )}
                            <Link href="/contact">
                                <AnimatedButton variant="outline" className="border-white text-white hover:bg-background/10">
                                    Get Involved
                                </AnimatedButton>
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    )
}
