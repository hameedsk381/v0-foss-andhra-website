"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, ExternalLink,
  Share2, Download, Ticket
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  description: string
  date: string
  endDate: string | null
  time: string
  location: string
  type: string
  status: string
  imageUrl: string | null
  gallery: string | null
  externalTicketUrl: string | null
  externalRegisterUrl: string | null
  maxAttendees: number | null
  currentAttendees: number
  program: string | null
}

export default function EventDetailsPage() {
  const params = useParams()
  const { toast } = useToast()
  const id = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      fetchEventDetails()
    }
  }, [id])

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/events/${id}`)
      const data = await res.json()
      
      if (data.success) {
        setEvent(data.data)
        
        // Parse gallery JSON
        if (data.data.gallery) {
          try {
            const images = JSON.parse(data.data.gallery)
            setGalleryImages(Array.isArray(images) ? images : [])
          } catch (e) {
            console.error("Error parsing gallery:", e)
          }
        }
      } else {
        toast({
          title: "Error",
          description: "Event not found",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching event:", error)
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied!",
        description: "Event link copied to clipboard",
      })
    }
  }

  const addToCalendar = () => {
    if (!event) return
    
    const startDate = new Date(event.date)
    const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 3 * 60 * 60 * 1000)
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
    
    window.open(calendarUrl, '_blank')
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
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-primary to-primary-600">
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <Link href="/events" className="inline-flex items-center text-white mb-4 hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
            <Badge className="mb-4">{event.type}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {event.description}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Event Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((imageUrl, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                        <Image
                          src={imageUrl}
                          alt={`${event.title} - Image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Details */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Date & Time</p>
                      <p className="text-gray-600">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}`}
                      </p>
                      <p className="text-gray-600">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>

                  {event.maxAttendees && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">Capacity</p>
                        <p className="text-gray-600">
                          {event.currentAttendees} / {event.maxAttendees} attendees
                        </p>
                      </div>
                    </div>
                  )}

                  {event.program && (
                    <div>
                      <p className="font-semibold">Program</p>
                      <Badge variant="outline">{event.program}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Ticket/Register Buttons */}
                  {event.externalTicketUrl && (
                    <Button 
                      className="w-full bg-primary hover:bg-primary-600" 
                      size="lg"
                      asChild
                    >
                      <a href={event.externalTicketUrl} target="_blank" rel="noopener noreferrer">
                        <Ticket className="h-4 w-4 mr-2" />
                        Get Tickets
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}

                  {event.externalRegisterUrl && (
                    <Button 
                      className="w-full" 
                      variant={event.externalTicketUrl ? "outline" : "default"}
                      size="lg"
                      asChild
                    >
                      <a href={event.externalRegisterUrl} target="_blank" rel="noopener noreferrer">
                        Register Now
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={addToCalendar}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Event
                  </Button>
                </div>

                {/* Event Status */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge 
                      variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'secondary' : 'outline'}
                    >
                      {event.status}
                    </Badge>
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
