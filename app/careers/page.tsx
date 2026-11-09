import Link from "next/link"
import type { Metadata } from "next"
import { Briefcase, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { ApplyForm } from "./apply-form"
import {
  OPENING_TYPES,
  isOpeningAcceptingApplications,
  requiresMembership,
  typeLabel,
  workModeLabel,
} from "@/lib/careers"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Careers & Internships | FOSS Andhra",
  description: "Open jobs, internships, fellowships, collaborations and volunteer roles at FOSS Andhra.",
}

export default async function CareersPage({ searchParams }: { searchParams: { type?: string } }) {
  const activeType = OPENING_TYPES.some((t) => t.value === searchParams.type) ? searchParams.type : undefined

  let openings: Awaited<ReturnType<typeof prisma.careerOpening.findMany>> = []
  try {
    openings = await prisma.careerOpening.findMany({
      where: { status: "open", ...(activeType ? { type: activeType } : {}) },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    })
  } catch (error) {
    console.error("Failed to load career openings:", error)
  }
  openings = openings.filter(isOpeningAcceptingApplications)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Careers &amp; Internships</h1>
        <p className="mt-2 text-gray-600">
          Work with FOSS Andhra to grow free and open source software across the region.
        </p>
        <Link href="/careers/poster" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Download the openings poster to share →
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/careers"
          className={`rounded-full border px-3 py-1 text-sm ${!activeType ? "bg-primary text-primary-foreground" : "hover:bg-gray-50"}`}
        >
          All
        </Link>
        {OPENING_TYPES.map((t) => (
          <Link
            key={t.value}
            href={`/careers?type=${t.value}`}
            className={`rounded-full border px-3 py-1 text-sm ${activeType === t.value ? "bg-primary text-primary-foreground" : "hover:bg-gray-50"}`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {openings.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-gray-600">
            No open positions right now. Send us a general application below and we&apos;ll reach out when something
            fits.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {openings.map((o) => (
            <Link key={o.id} href={`/careers/${o.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{typeLabel(o.type)}</Badge>
                    {o.featured && <Badge>Featured</Badge>}
                    {requiresMembership(o.type) && <Badge variant="outline">FOSStar members only</Badge>}
                  </div>
                  <CardTitle className="text-lg">{o.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  {o.summary && <p className="line-clamp-2">{o.summary}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {o.location} · {workModeLabel(o.workMode)}
                    </span>
                    {o.department && (
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {o.department}
                      </span>
                    )}
                    {o.applyDeadline && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Apply by {o.applyDeadline.toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-12 rounded-lg border bg-white p-6">
        <ApplyForm heading="Don't see a fit? Send a general application" />
      </section>
    </div>
  )
}
