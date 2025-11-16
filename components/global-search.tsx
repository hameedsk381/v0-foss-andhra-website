"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2, FileText, Users, Calendar, Folder, FileText as PageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchResult {
  members: any[]
  events: any[]
  blog: any[]
  programs: any[]
  content: any[]
  total: number
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
        setResults(null)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults(null)
      return
    }

    const timer = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (url: string) => {
    setIsOpen(false)
    setQuery("")
    setResults(null)
    router.push(url)
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-white border rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search members, events, blog posts, programs, pages..."
                  className="pl-10 pr-10 py-6 text-lg border-none focus:ring-0"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery("")
                      setResults(null)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-4">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              )}

              {!loading && results && results.total === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No results found for "{query}"
                </div>
              )}

              {!loading && results && results.total > 0 && (
                <div className="space-y-6">
                  {/* Blog Posts */}
                  {results.blog.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Blog Posts ({results.blog.length})
                      </h3>
                      <div className="space-y-2">
                        {results.blog.map((post: any) => (
                          <Card
                            key={post.id}
                            className="cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => handleResultClick(`/blog/${post.slug}`)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{post.title}</p>
                                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                                    {post.excerpt}
                                  </p>
                                  <Badge variant="secondary" className="mt-2 text-xs">
                                    {post.category.name}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events */}
                  {results.events.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Events ({results.events.length})
                      </h3>
                      <div className="space-y-2">
                        {results.events.map((event: any) => (
                          <Card
                            key={event.id}
                            className="cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => handleResultClick(`/events`)}
                          >
                            <CardContent className="p-3">
                              <p className="font-medium text-sm">{event.title}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(event.date).toLocaleDateString()} • {event.location}
                              </p>
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {event.type}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Members */}
                  {results.members.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Members ({results.members.length})
                      </h3>
                      <div className="space-y-2">
                        {results.members.map((member: any) => (
                          <Card key={member.id} className="hover:bg-gray-50 transition">
                            <CardContent className="p-3">
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-gray-500">
                                {member.organization || "No organization"}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Programs */}
                  {results.programs && results.programs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        Programs ({results.programs.length})
                      </h3>
                      <div className="space-y-2">
                        {results.programs.map((program: any) => (
                          <Card
                            key={program.id}
                            className="cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => handleResultClick(`/programs/${program.name}`)}
                          >
                            <CardContent className="p-3">
                              <p className="font-medium text-sm">{program.title}</p>
                              <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                                {program.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Pages */}
                  {results.content && results.content.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                        <PageIcon className="h-4 w-4" />
                        Pages ({results.content.length})
                      </h3>
                      <div className="space-y-2">
                        {results.content.map((page: any) => (
                          <Card
                            key={page.id}
                            className="cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => handleResultClick(`/${page.slug}`)}
                          >
                            <CardContent className="p-3">
                              <p className="font-medium text-sm">{page.title}</p>
                              {page.metaDescription && (
                                <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                                  {page.metaDescription}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!loading && !results && query.length > 0 && query.length < 2 && (
                <div className="text-center py-12 text-gray-500 text-sm">
                  Type at least 2 characters to search
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
              <div>
                Press <kbd className="px-2 py-1 bg-white border rounded">ESC</kbd> to close
              </div>
              {results && results.total > 0 && (
                <div>
                  Found {results.total} result{results.total !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
