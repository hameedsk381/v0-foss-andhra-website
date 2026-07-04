import type { Metadata } from "next"
import GalleryPageClient from "./GalleryPageClient"

export const metadata: Metadata = {
  title: "Gallery | FOSS Andhra Events & Community",
  description:
    "Browse photos from FOSS Andhra events, workshops, hackathons, and community gatherings across Andhra Pradesh.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | FOSS Andhra",
    description: "Photos from FOSS Andhra events and community gatherings in Andhra Pradesh.",
    url: "https://fossap.in/gallery",
  },
}

export default function GalleryPage() {
  return <GalleryPageClient />
}
