import type { Metadata } from "next"
import Link from "next/link"
import { Download, Lock, Star } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { resourceAccessLabel, resourceCategoryLabel } from "@/lib/resources"
import { ResourceOpenButton } from "./open-button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Resource Library — Kits, Templates & Guides | FOSS Andhra",
  description:
    "Free downloadable resources from FOSS Andhra: install fest kits, poster and slide templates, workshop guides and materials for running open source activities on your campus.",
  alternates: { canonical: "/resources" },
}

export default async function ResourcesPage() {
  const items = await prisma.resourceItem.findMany({
    where: { status: "published" },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  })

  const categories = [...new Set(items.map((i) => i.category))]

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Resource Library</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Run open source activities on your campus</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Everything FOSS Andhra teams and FOSSynC clubs need: install fest kits, poster and slide templates, workshop
          guides and more. Free to use and share.
        </p>
      </div>

      {categories.length > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <a
              key={c}
              href={`#cat-${c}`}
              className="rounded-full border px-3 py-1 text-sm text-gray-700 hover:border-primary hover:text-primary"
            >
              {resourceCategoryLabel(c)}
            </a>
          ))}
        </div>
      )}

      {categories.map((category) => (
        <section key={category} id={`cat-${category}`} className="mt-10 scroll-mt-20">
          <h2 className="text-xl font-bold">{resourceCategoryLabel(category)}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {items
              .filter((i) => i.category === category)
              .map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug">{item.title}</h3>
                      {item.featured && <Star className="h-4 w-4 shrink-0 text-yellow-500" aria-label="Featured" />}
                    </div>
                    <p className="flex-1 text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                      <div className="flex flex-wrap gap-1.5">
                        {item.format && <Badge variant="secondary">{item.format}</Badge>}
                        {item.sizeLabel && <span>{item.sizeLabel}</span>}
                        {item.access === "members" && (
                          <Badge variant="outline" className="gap-1">
                            <Lock className="h-3 w-3" /> {resourceAccessLabel(item.access)}
                          </Badge>
                        )}
                      </div>
                      {item.access === "members" ? (
                        <Link
                          href="/membership"
                          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                        >
                          <Lock className="h-3.5 w-3.5" /> Members only
                        </Link>
                      ) : (
                        <ResourceOpenButton id={item.id} url={item.externalUrl} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      ))}

      {items.length === 0 && (
        <Card className="mt-10">
          <CardContent className="py-12 text-center text-gray-500">
            Resources are being added — check back soon.
          </CardContent>
        </Card>
      )}

      <div className="mt-10 rounded-lg border bg-muted/40 p-6 text-center text-sm text-gray-600">
        Running a campus club?{" "}
        <Link href="/clubs/register" className="font-semibold text-primary hover:underline">
          Register your FOSSynC club
        </Link>{" "}
        to get mentorship and event support alongside these materials.
      </div>
    </div>
  )
}
