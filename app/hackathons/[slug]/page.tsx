import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, MapPin, Trophy } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HackathonRegisterForm } from "./register-form"

export const dynamic = "force-dynamic"

async function getHackathon(slug: string) {
  const hackathon = await prisma.hackathon.findUnique({
    where: { slug },
    include: {
      ProblemStatement: { orderBy: { order: "asc" } },
      Team: { where: { status: "approved", score: { not: null } }, orderBy: { score: "desc" }, take: 10 },
    },
  })
  if (!hackathon || hackathon.status === "draft") notFound()
  return hackathon
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const h = await getHackathon(params.slug).catch(() => null)
  if (!h) return { title: "Hackathon not found | FOSS Andhra" }
  return {
    title: `${h.title} — FOSS Andhra Hackathon`,
    description: h.description,
    alternates: { canonical: `/hackathons/${h.slug}` },
  }
}

export default async function HackathonPage({ params }: { params: { slug: string } }) {
  const h = await getHackathon(params.slug)
  const registrationOpen = h.status === "registration_open" && (!h.regDeadline || h.regDeadline.getTime() >= Date.now())

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/hackathons" className="hover:text-primary hover:underline">
          ← All hackathons
        </Link>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold sm:text-4xl">{h.title}</h1>
          {h.status === "registration_open" && <Badge className="bg-green-600">Registration open</Badge>}
          {h.status === "judging" && <Badge className="bg-blue-600">Judging</Badge>}
          {h.status === "completed" && <Badge variant="secondary">Completed</Badge>}
        </div>
        <p className="mt-4 text-gray-700">{h.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {h.startDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            {h.endDate.getTime() !== h.startDate.getTime() &&
              ` – ${h.endDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
          </span>
          {h.venue && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {h.venue}
            </span>
          )}
          {h.regDeadline && registrationOpen && (
            <span>Register by {h.regDeadline.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          )}
        </div>
      </header>

      {h.prizes && (
        <Card className="mt-8 border-yellow-200 bg-yellow-50/50">
          <CardContent className="flex items-start gap-3 p-5">
            <Trophy className="mt-0.5 h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-semibold">Prizes</p>
              <p className="text-sm text-gray-700">{h.prizes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {h.ProblemStatement.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Problem statements</h2>
          <div className="mt-3 space-y-3">
            {h.ProblemStatement.map((ps) => (
              <Card key={ps.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{ps.title}</h3>
                    <Badge variant="secondary">{ps.difficulty}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{ps.description}</p>
                  {ps.sponsor && <p className="mt-1 text-xs text-gray-500">Sponsored by {ps.sponsor}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {h.rules && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Rules</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{h.rules}</p>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold">Register your team</h2>
        {registrationOpen ? (
          <div className="mt-3">
            <HackathonRegisterForm slug={h.slug} problems={h.ProblemStatement.map((p) => ({ id: p.id, title: p.title }))} />
          </div>
        ) : (
          <Card className="mt-3">
            <CardContent className="py-8 text-center text-sm text-gray-600">
              {h.status === "registration_open"
                ? "The registration deadline has passed."
                : h.status === "completed"
                  ? "This hackathon has concluded."
                  : "Registration is not open yet."}
            </CardContent>
          </Card>
        )}
      </section>

      {h.Team.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Leaderboard</h2>
          <div className="mt-3 space-y-2">
            {h.Team.map((team, i) => (
              <div key={team.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <span className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">#{i + 1}</span>
                  <span className="font-medium">{team.name}</span>
                  {team.college && <span className="text-gray-500">{team.college}</span>}
                </span>
                <Badge variant="secondary">{team.score}/100</Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 rounded-lg border bg-muted/40 p-5 text-center text-sm text-gray-600">
        Teams must build with open technologies and submit under an open license. Winning projects are encouraged to
        continue with a{" "}
        <Link href="/programs/fossync" className="font-semibold text-primary hover:underline">
          FOSSynC club
        </Link>{" "}
        at their campus.
      </div>
    </div>
  )
}
