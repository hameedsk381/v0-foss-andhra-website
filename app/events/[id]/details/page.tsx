"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, MapPin, Clock, Users, Ticket, ArrowLeft,
  AlertCircle, Share2, Download
} from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  endDate: string | null
  time: string
  location: string
  type: string
  imageUrl: string | null
  enableTicketing: boolean
  currentAttendees: number
  maxAttendees: number | null
  program: string | null
  ticketTypes: any[]
  _count: {
    registrations: number
    orders: number
  }
}

export default function EventDetailsPage() {
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (eventId) {
      fetchEventDetails()
    }
  }, [eventId])

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`)
      const data = await res.json()
      
      if (data.success) {
        setEvent(data.data)
      }
    } catch (error) {
      console.error("Error fetching event:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getSeatsLeft = () => {
    if (!event?.maxAttendees) return null
    return event.maxAttendees - event.currentAttendees
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const seatsLeft = getSeatsLeft()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      {event.imageUrl && (
        <div className="w-full h-96 bg-gray-900">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/events" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {event.program && (
                  <Badge className="bg-blue-100 text-blue-800">{event.program}</Badge>
                )}
                <Badge variant="outline">{event.type}</Badge>
                {event.enableTicketing && (
                  <Badge className="bg-green-100 text-green-800">
                    <Ticket className="h-3 w-3 mr-1" />
                    Ticketing Available
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <p className="text-lg text-gray-600">{event.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                    {event.endDate && (
                      <p className="text-gray-600 text-sm">
                        Ends: {formatDate(event.endDate)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                {event.maxAttendees && (
                  <div className="flex items-start gap-4">
                    <Users className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Capacity</p>
                      <p className="text-gray-600">
                        {event.currentAttendees} / {event.maxAttendees} registered
                        {seatsLeft !== null && seatsLeft > 0 && (
                          <span className="text-green-600 ml-2">({seatsLeft} seats left)</span>
                        )}
                        {seatsLeft === 0 && (
                          <span className="text-red-600 ml-2">(Fully Booked)</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ticket Types Preview */}
            {event.enableTicketing && event.ticketTypes && event.ticketTypes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {event.ticketTypes.slice(0, 3).map((ticket: any) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{ticket.name}</p>
                          {ticket.description && (
                            <p className="text-sm text-gray-500">{ticket.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{ticket.price}</p>
                          {ticket.quantity && (
                            <p className="text-xs text-gray-500">
                              {ticket.quantity - ticket.quantitySold} left
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                </div>

                <div className="pt-4 border-t mt-4">
                  <p className="text-sm text-gray-600 mb-2">Share this event</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
