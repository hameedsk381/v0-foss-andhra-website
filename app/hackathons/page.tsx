import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, MapPin, Trophy } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Hackathons | FOSS Andhra",
  description:
    "Open source hackathons across Andhra Pradesh — student teams, real problem statements, FOSS-first judging. Register your team for the next FOSS Andhra hackathon.",
  alternates: { canonical: "/hackathons" },
}

const statusBadge = (status: string) => {
  switch (status) {
    case "registration_open":
      return <Badge className="bg-green-600">Registration open</Badge>
    case "judging":
      return <Badge className="bg-blue-600">Judging</Badge>
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    default:
      return <Badge variant="secondary">Coming soon</Badge>
  }
}

export default async function HackathonsPage() {
  const hackathons = await prisma.hackathon.findMany({
    where: { status: { not: "draft" } },
    orderBy: { startDate: "desc" },
    include: { _count: { select: { Team: { where: { status: "approved" } } } } },
    take: 50,
  })

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Hackathons</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Build open source, compete with campuses</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          FOSS Andhra hackathons bring student teams together to solve real problems with open source. Everything built
          must be submitted under an open license.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {hackathons.map((h) => (
          <Card key={h.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    <Link href={`/hackathons/${h.slug}`} className="hover:text-primary hover:underline">
                      {h.title}
                    </Link>
                  </h2>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {h.startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {h.endDate.getTime() !== h.startDate.getTime() &&
                        ` – ${h.endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                    </span>
                    {h.venue && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" /> {h.venue}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {statusBadge(h.status)}
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Trophy className="h-3.5 w-3.5" /> {h._count.Team} team{h._count.Team === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{h.description}</p>
            </CardContent>
          </Card>
        ))}
        {hackathons.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No hackathons announced yet — check back soon.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
