import { Metadata } from "next"
import EventsClient from "./EventsClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Events - Upcoming FOSS Workshops & Meetups",
  description:
    "Join our upcoming events, workshops, and meetups. Learn about Linux, Python, Go, and more with FOSS Andhra community.",
  keywords: "tech events Andhra Pradesh, FOSS workshops, Linux meetups, Vijayawada tech events",
  alternates: { canonical: "/events" },
}

async function getEvents(status: "upcoming" | "past") {
  try {
    const { prisma } = await import("@/lib/prisma")
    const now = new Date()
    const events = await prisma.event.findMany({
      where: status === "upcoming" ? { date: { gte: now } } : { date: { lt: now } },
      orderBy: { date: status === "upcoming" ? "asc" : "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        time: true,
        location: true,
        type: true,
        imageUrl: true,
        status: true,
        maxAttendees: true,
        currentAttendees: true,
        program: true,
        externalTicketUrl: true,
        externalRegisterUrl: true,
      },
    })
    return events.map((e) => ({
      ...e,
      date: e.date.toISOString(),
      enableTicketing: false,
      _count: { registrations: 0 },
    }))
  } catch {
    return []
  }
}

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getEvents("upcoming"),
    getEvents("past"),
  ])
  return <EventsClient initialUpcomingEvents={upcomingEvents} initialPastEvents={pastEvents} />
}
