"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TaglineRevealProps = {
  text: string
  className?: string
}

/**
 * Tagline reveal (landing page design system, B11).
 *
 * A large type moment that states the core benefit, separate from the hero.
 * Words start muted and activate one at a time as they cross a trigger line,
 * in reading order. Without JavaScript, or with reduced motion, the text is
 * simply readable at full contrast.
 */
export function TaglineReveal({ text, className }: TaglineRevealProps) {
  const headingRef = React.useRef<HTMLHeadingElement | null>(null)
  const [reveal, setReveal] = React.useState(false)
  const words = React.useMemo(() => text.trim().split(/\s+/), [text])

  React.useEffect(() => {
    const root = headingRef.current
    if (!root) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || typeof IntersectionObserver === "undefined") return

    const spans = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"))
    if (spans.length === 0) return

    setReveal(true)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute("data-active", "true")
          observer.unobserve(entry.target)
        }
      },
      // A trigger line just below the middle of the viewport: each word turns
      // solid as it crosses it, so the sentence resolves in reading order.
      { rootMargin: "0px 0px -40% 0px", threshold: 0.6 },
    )

    for (const span of spans) observer.observe(span)
    return () => observer.disconnect()
  }, [])

  // Nothing to reveal if the admin has cleared the tagline
  if (!text.trim()) return null

  return (
    <h2
      ref={headingRef}
      data-reveal={reveal ? "on" : undefined}
      className={cn(
        "max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl",
        className,
      )}
    >
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span data-word className="tagline-word">
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </h2>
  )
}
