"use client"

import Link from "next/link"
import { ArrowRight, Briefcase, Clock, MapPin } from "lucide-react"
import { requiresMembership, typeLabel, workModeLabel } from "@/lib/careers"
import type { PublicOpening } from "./use-openings"

const MAX_CARDS = 6

export function OpeningsSection({ openings, loading }: { openings: PublicOpening[]; loading: boolean }) {
  const shown = openings.slice(0, MAX_CARDS)

  return (
    <section id="openings" className="w-full section-shell bg-background border-b border-border" aria-labelledby="openings-heading">
      <div className="app-container">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2">Careers &amp; internships</p>
            <h2 id="openings-heading" className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Work with FOSS Andhra.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Internships, jobs and collaborations are open to FOSStar members. Join, pick an opening and apply.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/careers" className="cta-primary">
              View all openings <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/membership" className="cta-secondary">
              Join FOSStar
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-lg border border-border bg-muted/40" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            No openings are listed right now. You can still{" "}
            <Link href="/careers" className="font-semibold text-primary underline-offset-2 hover:underline">
              send a general application
            </Link>{" "}
            and we will reach out when something fits.
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((o) => (
              <li key={o.id}>
                <Link href={`/careers/${o.slug}`} className="group block h-full">
                  <div className="h-full rounded-lg border border-border bg-card p-5 transition-colors group-hover:border-primary/40">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {typeLabel(o.type)}
                      </span>
                      {requiresMembership(o.type) && (
                        <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                          FOSStar members
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-[1.05rem] font-bold text-foreground">{o.title}</h3>
                    {o.summary && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{o.summary}</p>}
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {o.location} · {workModeLabel(o.workMode)}
                      </span>
                      {o.applyDeadline && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Apply by {new Date(o.applyDeadline).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!loading && openings.length > MAX_CARDS && (
          <p className="mt-6 text-sm text-muted-foreground">
            <Briefcase className="mr-1 inline h-4 w-4" />
            {openings.length - MAX_CARDS} more on the{" "}
            <Link href="/careers" className="font-semibold text-primary underline-offset-2 hover:underline">
              careers page
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  )
}
