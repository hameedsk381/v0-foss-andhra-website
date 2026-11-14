import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Mail, MapPin, MessageCircle, Send, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

async function getChapter(slug: string) {
  const chapter = await prisma.chapter.findUnique({ where: { slug } })
  if (!chapter || chapter.status !== "published") notFound()
  return chapter
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const ch = await getChapter(params.slug).catch(() => null)
  if (!ch) return { title: "Chapter not found | FOSS Andhra" }
  return {
    title: `${ch.city} Chapter — FOSS Andhra meetups in ${ch.city}`,
    description: ch.description,
    alternates: { canonical: `/chapters/${ch.slug}` },
  }
}

export default async function ChapterPage({ params }: { params: { slug: string } }) {
  const chapter = await getChapter(params.slug)
  const [events, clubs] = await Promise.all([
    prisma.event.findMany({
      where: {
        status: "upcoming",
        location: { contains: chapter.city, mode: "insensitive" },
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: 5,
      select: { id: true, title: true, date: true, location: true },
    }),
    prisma.programClub.findMany({
      where: { active: true, status: "approved", location: { contains: chapter.city, mode: "insensitive" } },
      orderBy: { members: "desc" },
      take: 10,
      select: { name: true, slug: true, institution: true, members: true },
    }),
  ])

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/chapters" className="hover:text-primary hover:underline">
          ← All chapters
        </Link>
      </nav>

      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold sm:text-4xl">
          <MapPin className="h-7 w-7 text-primary" /> {chapter.city}
        </h1>
        {chapter.district && (
          <p className="mt-1 text-gray-500">{chapter.district} district, Andhra Pradesh</p>
        )}
        <p className="mt-4 max-w-2xl text-gray-700">{chapter.description}</p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {chapter.meetingInfo && (
          <Card>
            <CardContent className="flex items-start gap-3 p-5">
              <Calendar className="mt-0.5 h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-semibold">Meetups</p>
                <p className="mt-1 text-gray-600">{chapter.meetingInfo}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {chapter.coordinators && (
          <Card>
            <CardContent className="flex items-start gap-3 p-5">
              <Users className="mt-0.5 h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-semibold">Coordinators</p>
                <p className="mt-1 text-gray-600">{chapter.coordinators}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Upcoming events in {chapter.city}</h2>
        <div className="mt-3 space-y-2">
          {events.map((ev) => (
            <Link
              key={ev.id}
              href="/events"
              className="flex items-center justify-between rounded-lg border p-3 text-sm hover:border-primary hover:bg-muted/50"
            >
              <span className="font-medium">{ev.title}</span>
              <span className="text-gray-500">{ev.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </Link>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-gray-500">
              No events scheduled right now —{" "}
              <Link href="/events" className="text-primary hover:underline">
                browse all events
              </Link>{" "}
              or subscribe to updates.
            </p>
          )}
        </div>
      </section>

      {clubs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">FOSSynC clubs in {chapter.city}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {clubs.map((club) => (
              <Link
                key={club.id}
                href={`/clubs/${club.slug}`}
                className="rounded-lg border p-3 text-sm hover:border-primary hover:bg-muted/50"
              >
                <div className="font-medium">{club.name}</div>
                <div className="text-xs text-gray-500">
                  {club.institution} · {club.members} members
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-lg border bg-muted/40 p-6 text-center">
        <h2 className="text-lg font-semibold">Get involved in {chapter.city}</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
          {chapter.whatsappUrl && (
            <a
              href={chapter.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp group
            </a>
          )}
          {chapter.telegramUrl && (
            <a
              href={chapter.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <Send className="h-4 w-4" /> Telegram group
            </a>
          )}
          {chapter.contactEmail && (
            <a href={`mailto:${chapter.contactEmail}`} className="flex items-center gap-1.5 font-semibold text-primary hover:underline">
              <Mail className="h-4 w-4" /> {chapter.contactEmail}
            </a>
          )}
          <Link href="/contact" className="font-semibold text-primary hover:underline">
            Volunteer with this chapter
          </Link>
        </div>
      </section>
    </div>
  )
}
