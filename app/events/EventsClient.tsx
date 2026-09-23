"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCountdownCard } from "@/components/ui/event-countdown-card"
import { CalendarDays, MapPin, Clock, Users, Ticket, ArrowRight } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: string
  imageUrl: string | null
  status: string
  maxAttendees: number | null
  currentAttendees: number
  enableTicketing: boolean
  program: string | null
  externalTicketUrl?: string | null
  externalRegisterUrl?: string | null
  _count: {
    registrations: number
  }
}

interface Props {
  initialUpcomingEvents?: Event[]
  initialPastEvents?: Event[]
}

export default function EventsClient({ initialUpcomingEvents = [], initialPastEvents = [] }: Props) {
  const [upcomingEvents] = useState<Event[]>(initialUpcomingEvents)
  const [pastEvents] = useState<Event[]>(initialPastEvents)
  const router = useRouter()
  const reduced = useReducedMotion()
  const nextEvent = upcomingEvents[0]

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  }

  const excerpt = (html: string, max = 180) => {
    const text = stripHtml(html)
    return text.length > max ? text.slice(0, max - 1) + "…" : text
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  }

  const getSeatsLeft = (event: Event) => {
    if (!event.maxAttendees) return null
    return event.maxAttendees - event.currentAttendees
  }

  const getProgramBadgeColor = (program: string | null) => {
    const colors: { [key: string]: string } = {
      "FOSStar": "bg-yellow-100 text-yellow-800",
      "FOSServe": "bg-purple-100 text-purple-800",
      "FOSSynC": "bg-green-100 text-green-800",
      "FOSStorm": "bg-orange-100 text-orange-800",
      "FOSStart": "bg-pink-100 text-pink-800",
      "FOSSterage": "bg-blue-100 text-blue-800",
    }
    return program ? colors[program] || "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800"
  }

  const renderEvent = (event: Event, index: number, isPast: boolean = false) => {
    const seatsLeft = getSeatsLeft(event)
    const isFeatured = index === 0 && !isPast

    return (
      <Card key={event.id} className={isFeatured ? "border-primary/30 shadow-md" : ""}>
        <CardHeader className={isFeatured ? "bg-primary/5" : ""}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isFeatured && (
                <Badge className="bg-primary/10 text-primary mb-2">Featured Event</Badge>
              )}
              {event.program && (
                <Badge className={`${getProgramBadgeColor(event.program)} mb-2 mr-2`}>
                  {event.program}
                </Badge>
              )}
              {isPast && (
                <Badge className="bg-gray-100 text-gray-800 mb-2">Past Event</Badge>
              )}
              <CardTitle className={isFeatured ? "text-2xl" : ""}>{event.title}</CardTitle>
              <CardDescription>{excerpt(event.description)}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isFeatured && event.imageUrl && (
            <div className="mb-4 relative h-48 w-full overflow-hidden rounded-lg">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-2 h-4 w-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{event.location}</span>
            </div>
            {event.maxAttendees && (
              <div className="flex items-center text-sm text-gray-500">
                <Users className="mr-2 h-4 w-4" />
                <span>
                  {event.currentAttendees} / {event.maxAttendees} attendees
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2 flex-wrap">
            {!isPast && seatsLeft !== null && seatsLeft > 0 && (
              <Badge variant="outline" className="text-gray-500">
                {seatsLeft} seats left
              </Badge>
            )}
            {!isPast && seatsLeft === 0 && (
              <Badge variant="outline" className="text-red-500">
                Fully Booked
              </Badge>
            )}
            {event.enableTicketing && (
              <Badge variant="outline" className="text-green-600">
                <Ticket className="h-3 w-3 mr-1" />
                Ticketing Available
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={`/events/${event.id}/details`}>
              <Button variant="outline">View Details</Button>
            </Link>
            {!isPast && event.enableTicketing ? (
              event.externalTicketUrl ? (
                <a href={event.externalTicketUrl} target="_blank" rel="noopener noreferrer">
                  <Button>Buy Tickets</Button>
                </a>
              ) : (
                <Link href={`/events/${event.id}`}>
                  <Button>Buy Tickets</Button>
                </Link>
              )
            ) : !isPast && !event.enableTicketing ? (
              event.externalRegisterUrl ? (
                <a href={event.externalRegisterUrl} target="_blank" rel="noopener noreferrer">
                  <Button>Register</Button>
                </a>
              ) : (
                <Link href={`/events/${event.id}/register`}>
                  <Button>Register</Button>
                </Link>
              )
            ) : null}
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* ══ HERO — flat, two-column ═══════════════════════ */}
      <section className="w-full border-b border-border bg-primary/[0.04] py-10 sm:py-14">
        <div className="app-container">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div
              className="flex-1 min-w-0"
              initial={reduced ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow mb-4">Workshops · Hackathons · Meetups</p>

              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-foreground text-balance">
                Come build <span className="text-primary">with us, in person.</span>
              </h1>

              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Free and open to everyone — across 9 campuses and counting.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/membership" className="cta-primary">
                  Join FOSStar <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="cta-secondary">
                  Host an event
                </Link>
              </div>
            </motion.div>

            {nextEvent && (
              <div className="w-full max-w-sm shrink-0">
                <EventCountdownCard
                  title={nextEvent.title}
                  date={new Date(nextEvent.date)}
                  image={nextEvent.imageUrl}
                  attendees={nextEvent.currentAttendees}
                  onJoin={() => router.push(`/events/${nextEvent.id}/details`)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ EVENT LIST ════════════════════════════════════ */}
      <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">

        <Tabs defaultValue="upcoming" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No upcoming events at the moment.</p>
                <p className="text-sm text-gray-400">Check back soon for new events!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingEvents.map((event, index) => renderEvent(event, index, false))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No past events to display.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pastEvents.map((event, index) => renderEvent(event, index, true))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="bg-muted/40 border border-border p-8 rounded-lg my-12">
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">Host Your Own FOSS Event</h3>
          <p className="mb-6 text-muted-foreground">
            Are you interested in hosting a FOSS event at your institution or organization? FOSS Andhra provides
            support, resources, and speakers for community-organized events.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-white">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
