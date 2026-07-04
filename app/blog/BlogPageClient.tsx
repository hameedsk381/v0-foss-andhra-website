"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, User, Eye, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PageHero } from "@/components/page-hero"
import { StaggerGroup, StaggerItem, HoverLift } from "@/components/motion-primitives"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  category: { name: string; slug: string }
  author: { name: string }
  views: number
  publishedAt: string
  tags: Array<{ tag: { name: string; slug: string } }>
}

interface Props {
  initialPosts?: BlogPost[]
}

export default function BlogPageClient({ initialPosts = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPosts = initialPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        eyebrow="Blog"
        title="News, tutorials,"
        titleLine2="and insights."
        subtitle="Free and open source software coverage from the FOSS Andhra community."
        image="/stock/code-screen.jpg"
      />

      <div className="app-container py-12">
        <div className="mb-10">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">
            {searchTerm ? "No posts match your search." : "No blog posts published yet."}
          </p>
        ) : (
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <StaggerItem key={post.id}>
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <HoverLift className="h-full">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                      {post.coverImage && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="pt-6">
                        <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">{post.category.name}</Badge>
                        <h2 className="font-display text-xl font-bold mb-2 line-clamp-2 text-foreground">{post.title}</h2>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.slice(0, 3).map((tagItem) => (
                              <Badge key={tagItem.tag.slug} variant="secondary" className="text-xs">
                                {tagItem.tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </HoverLift>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </div>
  )
}
