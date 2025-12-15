"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin, Clock, Users, Ticket } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: Date
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

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  }

  const excerpt = (html: string, max = 180) => {
    const text = stripHtml(html)
    return text.length > max ? text.slice(0, max - 1) + "…" : text
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const [upcomingRes, pastRes] = await Promise.all([
        fetch("/api/events?status=upcoming"),
        fetch("/api/events?status=past")
      ])

      const upcomingData = await upcomingRes.json()
      const pastData = await pastRes.json()

      if (upcomingData.success) {
        setUpcomingEvents(upcomingData.data)
      }
      if (pastData.success) {
        setPastEvents(pastData.data)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
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
      "FOSSart": "bg-pink-100 text-pink-800",
      "FOSSterage": "bg-blue-100 text-blue-800",
    }
    return program ? colors[program] || "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800"
  }

  const renderEvent = (event: Event, index: number, isPast: boolean = false) => {
    const seatsLeft = getSeatsLeft(event)
    const isFeatured = index === 0 && !isPast

    return (
      <Card key={event.id} className={isFeatured ? "border-blue-200 shadow-md" : ""}>
        <CardHeader className={isFeatured ? "bg-blue-50" : ""}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isFeatured && (
                <Badge className="bg-blue-100 text-blue-800 mb-2">Featured Event</Badge>
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Events</h1>
        <p className="text-xl text-gray-600 mb-8">Join us at our upcoming events and connect with the FOSS community</p>

        <Tabs defaultValue="upcoming" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading events...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading events...</p>
              </div>
            ) : pastEvents.length === 0 ? (
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

        <div className="bg-blue-50 p-8 rounded-lg my-12">
          <h3 className="text-2xl font-bold mb-4">Host Your Own FOSS Event</h3>
          <p className="mb-6">
            Are you interested in hosting a FOSS event at your institution or organization? FOSS Andhra provides
            support, resources, and speakers for community-organized events.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
