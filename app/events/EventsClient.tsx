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
import { CalendarDays, MapPin, Clock, Users, Ticket } from "lucide-react"

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
            <div className="mb-4">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="rounded-lg w-full h-48 object-cover"
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

      {/* ══ HERO — full-bleed photo + live countdown ══════ */}
      <section className="relative w-full min-h-[62vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/stock/speaker.jpg"
            alt="FOSS Andhra events"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(0,40,100,0.96) 0%, rgba(0,70,150,0.9) 45%, rgba(0,92,168,0.6) 75%, rgba(0,92,168,0.35) 100%)",
          }}
        />

        <div className="app-container relative z-10 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 min-w-0">
              <motion.div
                className="flex items-center gap-3 mb-7"
                initial={reduced ? {} : { opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="inline-block w-8 h-[2px] bg-white/60 rounded-full" />
                <span className="text-sm font-semibold text-white/70 tracking-widest uppercase">
                  Workshops · Hackathons · Meetups
                </span>
              </motion.div>

              <h1 className="font-display text-[clamp(2.6rem,5.5vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight text-white text-balance">
                <motion.span
                  className="block"
                  initial={reduced ? {} : { opacity: 0, y: 28, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  Come build
                </motion.span>
                <motion.span
                  className="block text-white/85"
                  initial={reduced ? {} : { opacity: 0, y: 28, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.75, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                >
                  with us, in person.
                </motion.span>
              </h1>

              <motion.p
                className="mt-7 text-lg md:text-xl text-white/65 leading-relaxed max-w-lg"
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.66 }}
              >
                Free and open to everyone — across 9 campuses and counting.
              </motion.p>
            </div>

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

        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
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

        <div className="bg-[hsl(var(--surface-2))] border border-border p-8 rounded-2xl my-12">
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
