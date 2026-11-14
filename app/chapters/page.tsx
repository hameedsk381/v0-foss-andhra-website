import type { Metadata } from "next"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "FOSS Andhra City Chapters | FOSS Andhra",
  description:
    "Local FOSS Andhra chapters across Andhra Pradesh — Vijayawada, Visakhapatnam, Guntur, Tirupati and more. Meet open source enthusiasts in your city and attend local meetups.",
  alternates: { canonical: "/chapters" },
}

export default async function ChaptersPage() {
  const chapters = await prisma.chapter.findMany({
    where: { status: "published" },
    orderBy: [{ order: "asc" }, { city: "asc" }],
  })

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">City Chapters</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">FOSS Andhra near you</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Local chapters run city meetups, install fests and workshops across Andhra Pradesh. Join the one nearest to
          you — or help us start it.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {chapters.map((ch) => (
          <Card key={ch.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-4 w-4 text-primary" />
                <Link href={`/chapters/${ch.slug}`} className="hover:text-primary hover:underline">
                  {ch.city}
                </Link>
              </CardTitle>
              {ch.district && <p className="text-xs text-gray-500">{ch.district} district</p>}
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              {ch.description}
              <div className="mt-3">
                <Link href={`/chapters/${ch.slug}`} className="font-semibold text-primary hover:underline">
                  Chapter details →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {chapters.length === 0 && (
          <Card className="sm:col-span-2">
            <CardContent className="py-12 text-center text-gray-500">
              Chapters are being set up — check back soon, or{" "}
              <Link href="/contact" className="text-primary hover:underline">
                volunteer to start one in your city
              </Link>
              .
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
