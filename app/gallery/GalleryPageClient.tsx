"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, Filter, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { programColors, programInfo } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { PageHero } from "@/components/page-hero"
import { Reveal, StaggerGroup, StaggerItem, HoverLift } from "@/components/motion-primitives"

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
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Fetch gallery items from database
  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const res = await fetch('/api/gallery')
      const data = await res.json()
      
      if (data.success) {
        setGalleryItems(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load gallery items",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching gallery:", error)
      toast({
        title: "Error",
        description: "Failed to load gallery items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
      <PageHero
        eyebrow="Gallery"
        title="Events,"
        titleLine2="captured."
        subtitle="Explore implementations and initiatives from our seven programmes."
        image="/stock/panel.jpg"
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        </div>
      ) : (
        <>

      {/* Filter Section */}
      <section className="w-full py-8 bg-background border-b border-border">
        <div className="app-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-12 py-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary"
                  placeholder="Search for images, events, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="col-span-1">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {allTags.slice(0, 5).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {allTags.length > 5 && (
                  <button className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/70">
                    +{allTags.length - 5} more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full section-shell bg-[hsl(var(--surface-1))]">
        <div className="app-container">
          <Tabs defaultValue="all" className="w-full">
            <Reveal delay={0.1}>
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 max-w-4xl mx-auto mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="fosstar">FOSStar</TabsTrigger>
                <TabsTrigger value="fosserve">FOSServe</TabsTrigger>
                <TabsTrigger value="fossync">FOSSync</TabsTrigger>
                <TabsTrigger value="fosstorm">FOSStorm</TabsTrigger>
                <TabsTrigger value="fosstart">FOSStart</TabsTrigger>
                <TabsTrigger value="fossterage">FOSSterage</TabsTrigger>
                <TabsTrigger value="fosspeaks">FOSSpeaks</TabsTrigger>
              </TabsList>
            </Reveal>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, i) => (
                    <Reveal key={item.id} delay={Math.min(i * 0.04, 0.3)}>
                      <HoverLift>
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
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full text-white ${
                                programColors[item.program as keyof typeof programColors]?.split(" ")[0] || "bg-primary"
                              }`}
                            >
                              {getProgramLabel(item.program)}
                            </span>
                          </div>
                        </motion.div>
                        <CardContent className="p-4">
                          <h3 className="font-display font-bold text-lg mb-1 text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground/70 mt-2">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </CardContent>
                      </Card>
                      </HoverLift>
                    </Reveal>
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center p-12">
                    <div className="bg-muted p-8 rounded-full mb-4">
                      <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">No results found</h3>
                    <p className="text-muted-foreground text-center mb-6">
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
                      .map((item, i) => (
                        <Reveal key={item.id} delay={Math.min(i * 0.04, 0.3)}>
                          <HoverLift>
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
                              <h3 className="font-display font-bold text-lg mb-1 text-foreground">{item.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground/70 mt-2">
                                {new Date(item.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </CardContent>
                          </Card>
                          </HoverLift>
                        </Reveal>
                      ))
                  ) : (
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center p-12">
                      <div className="bg-muted p-8 rounded-full mb-4">
                        <Search className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">No results found</h3>
                      <p className="text-muted-foreground text-center mb-6">
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
      </>
      )}
    </div>
  )
}
