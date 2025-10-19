"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, Filter, X } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { programColors, programInfo } from "@/lib/utils"

type GalleryItem = {
  id: string
  title: string
  description: string
  date: string
  image: string
  program: string
  tags: string[]
}

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Gallery items
  const galleryItems: GalleryItem[] = [
    {
      id: "fosstar-event-1",
      title: "FOSStar Community Meetup",
      description: "Community meetup for FOSS enthusiasts in Vijayawada",
      date: "2023-04-15",
      image: "/gallery/fosstar-event-1.jpg",
      program: "fosstar",
      tags: ["event", "community", "meetup"],
    },
    {
      id: "fosstar-event-2",
      title: "FOSS Leadership Summit",
      description: "Annual leadership summit for FOSS community leaders",
      date: "2023-06-22",
      image: "/gallery/fosstar-event-2.jpg",
      program: "fosstar",
      tags: ["event", "leadership", "summit"],
    },
    {
      id: "fosserve-implementation-1",
      title: "Government Portal Launch",
      description: "Launch of new FOSS-based government service portal",
      date: "2023-05-10",
      image: "/gallery/fosserve-implementation-1.jpg",
      program: "fosserve",
      tags: ["implementation", "government", "launch"],
    },
    {
      id: "fossync-club-1",
      title: "University FOSS Club Inauguration",
      description: "Opening ceremony of new FOSS club at Andhra University",
      date: "2023-07-05",
      image: "/gallery/fossync-club-1.jpg",
      program: "fossync",
      tags: ["education", "university", "inauguration"],
    },
    {
      id: "fosstorm-project-1",
      title: "Project Collaboration Workshop",
      description: "Developers collaborate on open source projects",
      date: "2023-08-18",
      image: "/gallery/fosstorm-project-1.jpg",
      program: "fosstorm",
      tags: ["development", "workshop", "collaboration"],
    },
    {
      id: "fossart-startup-1",
      title: "FOSS Startup Incubation",
      description: "New startups join the FOSS entrepreneurship program",
      date: "2023-09-12",
      image: "/gallery/fossart-startup-1.jpg",
      program: "fossart",
      tags: ["startup", "entrepreneurship", "innovation"],
    },
    {
      id: "fossterage-database-1",
      title: "Open Data Repository Launch",
      description: "Launch of new open research data repository",
      date: "2023-10-05",
      image: "/gallery/fossterage-database-1.jpg",
      program: "fossterage",
      tags: ["data", "research", "repository"],
    },
    {
      id: "fosspeaks-advocacy-1",
      title: "Policy Advocacy Forum",
      description: "Forum on FOSS policy advocacy with government officials",
      date: "2023-11-19",
      image: "/gallery/fosspeaks-advocacy-1.jpg",
      program: "fosspeaks",
      tags: ["policy", "advocacy", "government"],
    },
  ]

  // All available tags
  const allTags = Array.from(new Set(galleryItems.flatMap((item) => item.tags)))

  // Filter gallery items
  const filteredItems = galleryItems.filter((item) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      programInfo[item.program as keyof typeof programInfo].title.toLowerCase().includes(searchTerm.toLowerCase())

    // Tags filter
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  // Helper for program label
  const getProgramLabel = (programKey: string) => {
    return programInfo[programKey as keyof typeof programInfo]?.title || programKey
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80" />
        <div className="container px-4 md:px-6 relative z-10">
          <AnimatedSection variant="fadeUp">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">FOSS Andhra Gallery</h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
                Explore events, implementations, and initiatives from our various programs
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Section */}
      <section className="w-full py-8 bg-white border-b">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Search for images, events, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="col-span-1">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {allTags.slice(0, 5).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {allTags.length > 5 && (
                  <button className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
                    +{allTags.length - 5} more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="all" className="w-full">
            <AnimatedSection variant="fadeUp" delay={0.1}>
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 max-w-4xl mx-auto mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="fosstar">FOSStar</TabsTrigger>
                <TabsTrigger value="fosserve">FOSServe</TabsTrigger>
                <TabsTrigger value="fossync">FOSSync</TabsTrigger>
                <TabsTrigger value="fosstorm">FOSStorm</TabsTrigger>
                <TabsTrigger value="fossart">FOSSart</TabsTrigger>
                <TabsTrigger value="fossterage">FOSSterage</TabsTrigger>
                <TabsTrigger value="fosspeaks">FOSSpeaks</TabsTrigger>
              </TabsList>
            </AnimatedSection>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <AnimatedSection key={item.id} variant="fadeUp" delay={0.1}>
                      <Card className="overflow-hidden">
                        <motion.div
                          className="relative h-48 w-full"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full text-white ${programColors[item.program].split(" ")[0]}`}
                            >
                              {getProgramLabel(item.program)}
                            </span>
                          </div>
                        </motion.div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center p-12">
                    <div className="bg-gray-100 p-8 rounded-full mb-4">
                      <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500 text-center mb-6">
                      We couldn't find any gallery items matching your search or filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedTags([])
                      }}
                      className="text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Program-specific tabs */}
            {Object.keys(programInfo).map((program) => (
              <TabsContent key={program} value={program} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredItems.filter((item) => item.program === program).length > 0 ? (
                    filteredItems
                      .filter((item) => item.program === program)
                      .map((item) => (
                        <AnimatedSection key={item.id} variant="fadeUp" delay={0.1}>
                          <Card className="overflow-hidden">
                            <motion.div
                              className="relative h-48 w-full"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </motion.div>
                            <CardContent className="p-4">
                              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                              <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(item.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </CardContent>
                          </Card>
                        </AnimatedSection>
                      ))
                  ) : (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center p-12">
                      <div className="bg-gray-100 p-8 rounded-full mb-4">
                        <Search className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-500 text-center mb-6">
                        We couldn't find any gallery items for {getProgramLabel(program)} matching your search or
                        filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("")
                          setSelectedTags([])
                        }}
                        className="text-primary hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  )
}
