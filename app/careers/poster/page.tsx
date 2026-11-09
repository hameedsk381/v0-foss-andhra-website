import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PosterClient } from "./poster-client"

export const metadata: Metadata = {
  title: "Openings Poster | FOSS Andhra",
  description: "Download a shareable poster of FOSS Andhra's current openings and internships.",
}

export default function PosterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/careers" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> All openings
      </Link>
      <h1 className="mb-2 text-3xl font-bold">Openings poster</h1>
      <p className="mb-6 max-w-xl text-sm text-muted-foreground">
        Download this poster and share it on WhatsApp, Instagram, LinkedIn or your campus groups.
      </p>
      <PosterClient />
    </div>
  )
}
