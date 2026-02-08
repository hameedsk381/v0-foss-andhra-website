
import { Metadata } from "next"
import EventsClient from "./EventsClient"

export const metadata: Metadata = {
    title: "Events - Upcoming FOSS Workshops & Meetups",
    description:
        "Join our upcoming events, workshops, and meetups. Learn about Linux, Python, Go, and more with FOSS Andhra community.",
    keywords: "tech events Andhra Pradesh, FOSS workshops, Linux meetups, Vijayawada tech events",
}

export default function EventsPage() {
    return <EventsClient />
}
