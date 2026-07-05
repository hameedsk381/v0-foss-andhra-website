"use client"

import { useMemo } from "react"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface SeoCheckInput {
  title: string
  slug: string
  excerpt: string
  content: string
  metaDescription: string
  focusKeyword: string
  coverImage: string
}

type CheckStatus = "pass" | "warn" | "fail"

interface SeoCheck {
  label: string
  status: CheckStatus
  hint?: string
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

// Live SEO checklist for the blog post editor — pure client-side heuristics,
// mirrors what Google actually renders (title/description lengths) plus
// focus-keyword placement checks.
export function SeoChecklist({ post }: { post: SeoCheckInput }) {
  const checks = useMemo<SeoCheck[]>(() => {
    const text = stripHtml(post.content)
    const words = text.split(/\s+/).filter(Boolean)
    const kw = post.focusKeyword.trim().toLowerCase()
    const result: SeoCheck[] = []

    // Title length
    const tLen = post.title.trim().length
    result.push({
      label: `Title length (${tLen} chars)`,
      status: tLen >= 30 && tLen <= 60 ? "pass" : tLen > 0 ? "warn" : "fail",
      hint: "30–60 characters displays fully in search results",
    })

    // Meta description
    const mLen = post.metaDescription.trim().length
    result.push({
      label: `Meta description (${mLen} chars)`,
      status: mLen >= 120 && mLen <= 160 ? "pass" : mLen > 0 ? "warn" : "fail",
      hint: "120–160 characters — Google truncates beyond that",
    })

    // Content length
    result.push({
      label: `Content length (${words.length} words)`,
      status: words.length >= 600 ? "pass" : words.length >= 300 ? "warn" : "fail",
      hint: "600+ words ranks better; under 300 risks thin-content flags",
    })

    // Focus keyword checks
    if (kw) {
      result.push({
        label: "Focus keyword in title",
        status: post.title.toLowerCase().includes(kw) ? "pass" : "fail",
      })
      const first150 = text.slice(0, 600).toLowerCase()
      result.push({
        label: "Focus keyword in opening paragraph",
        status: first150.includes(kw) ? "pass" : "warn",
      })
      result.push({
        label: "Focus keyword in meta description",
        status: post.metaDescription.toLowerCase().includes(kw) ? "pass" : "warn",
      })
    } else {
      result.push({
        label: "Focus keyword set",
        status: "fail",
        hint: "Pick a primary keyword to optimise this post around",
      })
    }

    // Cover image
    result.push({
      label: "Cover image set",
      status: post.coverImage.trim() ? "pass" : "warn",
      hint: "Posts with OG images get far better social click-through",
    })

    // Slug quality
    const slugOk = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug) && post.slug.length <= 60
    result.push({
      label: "Clean URL slug",
      status: post.slug ? (slugOk ? "pass" : "warn") : "fail",
      hint: "Lowercase words separated by hyphens, under 60 characters",
    })

    return result
  }, [post])

  const score = Math.round(
    (checks.reduce((acc, c) => acc + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0), 0) /
      checks.length) *
      100
  )

  const scoreColor =
    score >= 80 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600"

  return (
    <div className="rounded-xl border border-border bg-[hsl(var(--surface-2))] p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-foreground">SEO Checklist</h4>
        <span className={`text-sm font-bold ${scoreColor}`}>{score}/100</span>
      </div>
      <ul className="space-y-1.5">
        {checks.map((check) => (
          <li key={check.label} className="flex items-start gap-2 text-sm" title={check.hint}>
            {check.status === "pass" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            ) : check.status === "warn" ? (
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            )}
            <span className={check.status === "pass" ? "text-muted-foreground" : "text-foreground"}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
