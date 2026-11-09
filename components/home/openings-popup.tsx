"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { typeLabel } from "@/lib/careers"
import type { PublicOpening } from "./use-openings"

const STORAGE_KEY = "openings-popup-dismissed-at"
const SNOOZE_DAYS = 3
const SHOW_DELAY_MS = 2500
const LISTED = 4

/** Safe localStorage access (can throw in private mode or when blocked). */
function readDismissedAt(): number {
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

function writeDismissedAt() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    // ignore
  }
}

/**
 * Announces open positions once the visitor has been on the home page for a moment.
 * Shown only when there are openings, and not again for a few days after it is closed.
 */
export function OpeningsPopup({ openings }: { openings: PublicOpening[] }) {
  const [open, setOpen] = useState(false)
  const hasOpenings = openings.length > 0

  useEffect(() => {
    if (!hasOpenings) return
    const snoozedUntil = readDismissedAt() + SNOOZE_DAYS * 24 * 60 * 60 * 1000
    if (Date.now() < snoozedUntil) return

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [hasOpenings])

  const close = () => {
    writeDismissedAt()
    setOpen(false)
  }

  if (!hasOpenings) return null

  const listed = openings.slice(0, LISTED)

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <p className="eyebrow">We&apos;re hiring</p>
          <DialogTitle className="font-display text-2xl">
            {openings.length} open {openings.length === 1 ? "position" : "positions"} at FOSS Andhra
          </DialogTitle>
          <DialogDescription>
            Internships, jobs and collaborations are open to FOSStar members.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2">
          {listed.map((o) => (
            <li key={o.id}>
              <Link
                href={`/careers/${o.slug}`}
                onClick={close}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <span className="font-medium text-foreground">{o.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{typeLabel(o.type)}</span>
              </Link>
            </li>
          ))}
          {openings.length > LISTED && (
            <li className="px-1 text-xs text-muted-foreground">+ {openings.length - LISTED} more</li>
          )}
        </ul>

        <div className="flex flex-wrap gap-3">
          <Link href="/careers" onClick={close} className="cta-primary">
            View all openings <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/membership" onClick={close} className="cta-secondary">
            Join FOSStar
          </Link>
        </div>
        <button
          type="button"
          onClick={close}
          className="self-start text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Maybe later
        </button>
      </DialogContent>
    </Dialog>
  )
}
