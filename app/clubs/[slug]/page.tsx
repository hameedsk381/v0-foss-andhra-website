import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Github, Globe, MapPin, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const club = await prisma.programClub.findFirst({
    where: { slug: params.slug, active: true, status: "approved" },
  })
  if (!club) return { title: "Club not found | FOSS Andhra" }
  return {
    title: `${club.name} — ${club.institution} | FOSSynC Clubs`,
    description:
      club.description ||
      `${club.name} is a student-led FOSSynC open source club at ${club.institution}, ${club.location}, part of the FOSS Andhra campus club network with ${club.members} active members.`,
    alternates: { canonical: `/clubs/${club.slug}` },
  }
}

export default async function ClubPage({ params }: { params: { slug: string } }) {
  const club = await prisma.programClub.findFirst({
    where: { slug: params.slug, active: true, status: "approved" },
  })
  if (!club) notFound()

  // State-wide rank by member count
  const higher = await prisma.programClub.count({
    where: { active: true, status: "approved", members: { gt: club.members } },
  })

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/clubs" className="hover:text-primary hover:underline">
          ← All FOSSynC clubs
        </Link>
      </nav>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{club.name}</h1>
              <p className="mt-1 text-gray-600">{club.institution}</p>
            </div>
            <div className="flex gap-3 text-sm text-gray-700">
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                <Users className="h-4 w-4" /> {club.members.toLocaleString("en-IN")} members
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                #{higher + 1} state-wide
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {club.location}
            </span>
            {club.established && <span>Active since {club.established}</span>}
          </div>

          {club.description && <p className="mt-6 leading-relaxed text-gray-700">{club.description}</p>}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {club.githubUrl && (
              <a
                href={club.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:border-primary hover:bg-muted/50"
              >
                <Github className="h-4 w-4" /> {club.githubUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            )}
            {club.websiteUrl && (
              <a
                href={club.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:border-primary hover:bg-muted/50"
              >
                <Globe className="h-4 w-4" /> {club.websiteUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 rounded-lg border bg-muted/40 p-6 text-center text-sm text-gray-600">
        {club.name} is part of the FOSSynC network of student-led open source clubs run by{" "}
        <Link href="/programs/fossync" className="font-semibold text-primary hover:underline">
          FOSS Andhra&apos;s FOSSynC program
        </Link>
        . Want a club at your campus?{" "}
        <Link href="/clubs/register" className="font-semibold text-primary hover:underline">
          Register one
        </Link>
        .
      </div>
    </div>
  )
}
