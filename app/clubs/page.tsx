import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedButton } from "@/components/ui/animated-button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "FOSSynC Campus Clubs & Leaderboard | FOSS Andhra",
  description:
    "Directory of FOSSynC student-led open source clubs across Andhra Pradesh, ranked by active members. Register your campus club and climb the state-wide leaderboard.",
  alternates: { canonical: "/clubs" },
}

export default async function ClubsPage() {
  const clubs = await prisma.programClub.findMany({
    where: { active: true, status: "approved" },
    orderBy: [{ members: "desc" }, { order: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      institution: true,
      location: true,
      members: true,
      established: true,
      description: true,
    },
  })

  const totalMembers = clubs.reduce((sum, c) => sum + c.members, 0)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">FOSSynC Campus Clubs</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Open source clubs across Andhra Pradesh</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          FOSSynC clubs are student-led open source communities at colleges, universities and polytechnics across
          Andhra Pradesh, mentored by FOSS Andhra. Clubs are ranked by their active member count.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-gray-700">
          <span>
            <strong className="text-xl text-gray-900">{clubs.length}</strong> clubs
          </span>
          <span>
            <strong className="text-xl text-gray-900">{totalMembers.toLocaleString("en-IN")}</strong> student members
          </span>
        </div>
        <div className="mt-6">
          <Link href="/clubs/register">
            <AnimatedButton>Register your campus club</AnimatedButton>
          </Link>
        </div>
      </div>

      <div className="mt-12 space-y-3">
        {clubs.map((club, index) => (
          <Card key={club.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : index === 1
                        ? "bg-gray-200 text-gray-700"
                        : index === 2
                          ? "bg-orange-100 text-orange-800"
                          : "bg-muted text-gray-600"
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <CardTitle className="text-base">
                    <Link
                      href={`/clubs/${club.slug}`}
                      className="hover:text-primary hover:underline"
                    >
                      {club.name}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {club.institution} · {club.location}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {club.members.toLocaleString("en-IN")} members
              </Badge>
            </CardHeader>
            {club.description && (
              <CardContent className="pt-1 text-sm text-gray-600">{club.description}</CardContent>
            )}
          </Card>
        ))}
        {clubs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No clubs listed yet — be the first to register yours.
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/40 p-6 text-center">
        <h2 className="text-lg font-semibold">Start a FOSSynC club at your campus</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
          FOSS Andhra provides mentorship, install-fest kits, speaker connections and hackathon support to approved
          clubs. Registration is free for student teams.
        </p>
        <div className="mt-4">
          <Link href="/clubs/register" className="font-semibold text-primary hover:underline">
            Register your club →
          </Link>
        </div>
      </div>
    </div>
  )
}
