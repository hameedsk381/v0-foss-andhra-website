"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, User, Clock, Search, ArrowRight, Star, ArrowUpRight } from "lucide-react"
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
  featured?: boolean
  readingTime?: number | null
  category: { name: string; slug: string }
  author: { name: string }
  publishedAt: string
  tags: Array<{ tag: { name: string; slug: string } }>
}

interface CategoryOption {
  name: string
  slug: string
  count: number
}

interface Props {
  initialPosts?: BlogPost[]
  categories?: CategoryOption[]
}

const PAGE_SIZE = 9

/** Distinct soft gradients per category so coverless posts still look designed. */
const GRADIENTS = [
  "from-primary/80 to-primary/50",
  "from-emerald-500/80 to-emerald-500/50",
  "from-amber-500/80 to-amber-500/50",
  "from-fuchsia-500/70 to-fuchsia-500/40",
  "from-sky-500/80 to-sky-500/50",
  "from-rose-500/70 to-rose-500/40",
]

function gradientFor(slug: string) {
  const i = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length
  return GRADIENTS[i]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function Meta({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground ${className ?? ""}`}>
      <div className="flex items-center gap-1.5">
        <User className="h-4 w-4" aria-hidden="true" />
        <span>{post.author.name}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4" aria-hidden="true" />
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </div>
      {post.readingTime != null && post.readingTime > 0 && (
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>{post.readingTime} min read</span>
        </div>
      )}
    </div>
  )
}

function CoverOrGradient({ post, tall }: { post: BlogPost; tall?: boolean }) {
  if (post.coverImage) {
    return (
      <div className={`relative w-full ${tall ? "h-64 md:h-full" : "h-44"}`}>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          sizes={tall ? "(max-width: 768px) 100vw, 640px" : "(max-width: 768px) 100vw, 380px"}
        />
      </div>
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`flex w-full items-center justify-center bg-gradient-to-br ${gradientFor(post.category.slug)} ${tall ? "h-48 md:h-full" : "h-36"}`}
    >
      <span className="font-display text-5xl font-bold text-white/80">
        {post.title.charAt(0)}
      </span>
    </div>
  )
}

export default function BlogPageClient({ initialPosts = [], categories = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const featured = initialPosts.find((p) => p.featured)

  const filteredPosts = useMemo(
    () =>
      initialPosts.filter((post) => {
        if (activeCategory && post.category.slug !== activeCategory) return false
        if (featured && post.id === featured.id && !searchTerm && !activeCategory) return false
        if (!searchTerm) return true
        const q = searchTerm.toLowerCase()
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((t) => t.tag.name.toLowerCase().includes(q))
        )
      }),
    [initialPosts, activeCategory, searchTerm, featured]
  )

  const visiblePosts = filteredPosts.slice(0, visibleCount)

  const pickCategory = (slug: string | null) => {
    setActiveCategory(slug)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        eyebrow="Blog"
        title="Open source guides"
        titleLine2="and community news."
        subtitle="Practical tutorials and updates on free and open source software from the FOSS Andhra community — Git, Linux, student programs, clubs and more."
        image="/stock/code-screen.jpg"
      />

      <div className="app-container py-10 sm:py-14">
        {/* Featured post */}
        {featured && !searchTerm && (
          <Link href={`/blog/${featured.slug}`} className="block mb-12 focus-visible:outline-none">
            <HoverLift>
              <article className="grid overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-2">
                <CoverOrGradient post={featured} tall />
                <CardContent className="flex flex-col justify-center py-8 md:py-10 md:pr-10">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      Featured
                    </Badge>
                    <Badge variant="outline">{featured.category.name}</Badge>
                  </div>
                  <h2 className="font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground line-clamp-3">{featured.excerpt}</p>
                  <Meta post={featured} className="mt-5" />
                  <span className="mt-6 inline-flex items-center gap-1 font-display font-semibold text-primary">
                    Read the announcement
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </CardContent>
              </article>
            </HoverLift>
          </Link>
        )}

        {/* Category filter + search */}
        <div className="mb-10 flex flex-col items-start gap-5">
          <div className="relative w-full max-w-xl">
            <label htmlFor="blog-search" className="sr-only">
              Search blog posts
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="blog-search"
              type="search"
              placeholder="Search guides, topics, tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-base"
            />
          </div>

          {categories.length > 0 && (
            <nav aria-label="Blog categories" className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => pickCategory(null)}
                aria-pressed={activeCategory === null}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                All posts
              </button>
              {categories
                .filter((c) => c.count > 0)
                .map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => pickCategory(category.slug === activeCategory ? null : category.slug)}
                    aria-pressed={activeCategory === category.slug}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeCategory === category.slug
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {category.name}
                    <span className="ml-1.5 opacity-60">{category.count}</span>
                  </button>
                ))}
            </nav>
          )}
        </div>

        {/* Post grid */}
        {visiblePosts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              {searchTerm
                ? `No posts match "${searchTerm}".`
                : "No posts in this category yet."}
            </p>
            {(searchTerm || activeCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  pickCategory(null)
                }}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <StaggerGroup
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Blog post list"
            >
              {visiblePosts.map((post) => (
                <StaggerItem key={post.id}>
                  <article className="h-full">
                    <HoverLift className="h-full">
                      <Card className="flex h-full flex-col overflow-hidden">
                        <Link href={`/blog/${post.slug}`} aria-hidden="true" tabIndex={-1}>
                          <CoverOrGradient post={post} />
                        </Link>
                        <CardContent className="flex flex-1 flex-col pt-5">
                          <Badge
                            className="mb-3 self-start bg-primary/10 text-primary hover:bg-primary/10"
                            aria-label={`Category: ${post.category.name}`}
                          >
                            {post.category.name}
                          </Badge>
                          <h3 className="font-display text-lg font-bold leading-snug text-foreground">
                            <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {post.tags.slice(0, 3).map((tagItem) => (
                                <Badge key={tagItem.tag.slug} variant="secondary" className="text-xs">
                                  {tagItem.tag.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <Meta post={post} className="mt-auto pt-4" />
                        </CardContent>
                      </Card>
                    </HoverLift>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>

            {filteredPosts.length > visibleCount && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-display font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  Load more posts
                  ({filteredPosts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}

        {/* Internal-link CTA band */}
        <div className="mt-16 rounded-xl border border-border bg-primary/[0.04] p-8 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                Start contributing today
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Take the first step: read{" "}
                <Link
                  href="/blog/why-students-should-contribute-to-open-source"
                  className="font-medium text-primary hover:underline"
                >
                  why students should contribute to open source
                </Link>
                , browse our{" "}
                <Link href="/careers?type=internship" className="font-medium text-primary hover:underline">
                  internship openings
                </Link>{" "}
                and become a{" "}
                <Link href="/membership" className="font-medium text-primary hover:underline">
                  FOSStar member
                </Link>
                .
              </p>
            </div>
            <Link href="/events" className="cta-secondary shrink-0">
              Upcoming events <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
