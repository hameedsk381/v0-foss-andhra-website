"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle, Calendar, MapPin, Loader2 } from "lucide-react"

interface Event {
    id: string
    title: string
    date: string
    location: string
    enableTicketing: boolean
}

export default function EventRegisterPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        organization: "",
        expectations: ""
    })

    useEffect(() => {
        if (id) {
            fetchEvent()
        }
    }, [id])

    const fetchEvent = async () => {
        try {
            const res = await fetch(`/api/events/${id}`)
            const data = await res.json()
            if (data.success) {
                setEvent(data.data)
            } else {
                router.push("/events")
            }
        } catch (error) {
            console.error("Error fetching event:", error)
            router.push("/events")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch("/api/events/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId: id,
                    ...formData
                }),
            })

            if (response.ok) {
                setSubmitted(true)
            } else {
                alert("Failed to register. Please try again.")
            }
        } catch (error) {
            console.error("Error submitting registration:", error)
            alert("An unexpected error occurred.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
                    <p className="text-gray-600 mb-8">
                        You have successfully registered for <strong>{event?.title}</strong>.
                        Confirmation details have been sent to your email.
                    </p>
                    <div className="flex flex-col gap-4">
                        <Link href={`/events/${id}/details`}>
                            <Button className="w-full">View Event Details</Button>
                        </Link>
                        <Link href="/events">
                            <Button variant="outline" className="w-full">Back to All Events</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <Link href={`/events/${id}/details`}>
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Details
                    </Button>
                </Link>

                <Card className="border-t-4 border-t-primary">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl font-bold">Register for Event</CardTitle>
                                <CardDescription className="text-lg text-gray-600 mt-2">
                                    {event?.title}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 border-t pt-4">
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4" /> {event && new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" /> {event?.location}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+91 80000 00000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="organization">Organization / Institution</Label>
                                    <Input
                                        id="organization"
                                        placeholder="Your college or workplace"
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expectations">What do you hope to learn or achieve? (Optional)</Label>
                                <Textarea
                                    id="expectations"
                                    placeholder="Share any specific topics you're interested in..."
                                    value={formData.expectations}
                                    onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-lg" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                                    </>
                                ) : "Confirm Registration"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-gray-50 text-center text-xs text-gray-500 py-4">
                        By registering, you agree to our terms of participation and code of conduct.
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
