import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { INTERNSHIP_POSTER, InternshipPoster, internshipPosterMetadata } from "@/components/internship-poster"

export const metadata: Metadata = {
  title: "Internship Program Poster",
  description:
    "Download and share the FOSS Andhra Internship Program poster: paid-style internships in AI, DevOps, design and system design for students across Andhra Pradesh.",
  alternates: { canonical: "/careers/poster" },
  openGraph: {
    title: "Internship Program Poster",
    description:
      "Download and share the FOSS Andhra Internship Program poster: paid-style internships in AI, DevOps, design and system design for students across Andhra Pradesh.",
    url: "https://fossap.in/careers/poster",
    ...internshipPosterMetadata.openGraph,
  },
  twitter: internshipPosterMetadata.twitter,
}

export default function PosterPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <Link href="/careers" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> All openings
      </Link>
      <h1 className="mb-2 text-3xl font-bold">Internship Program poster</h1>
      <p className="mb-6 max-w-xl text-sm text-muted-foreground">
        Download this poster and share it on WhatsApp, Instagram, LinkedIn and your campus groups.
      </p>

      <InternshipPoster priority sizes="(min-width: 1024px) 1024px, 100vw" />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a href={INTERNSHIP_POSTER.src} download="foss-andhra-internship-program-poster.png">
          <Button>
            <Download className="mr-2 h-4 w-4" /> Download poster (PNG)
          </Button>
        </a>
        <Link href="/careers?type=internship">
          <Button variant="outline">See internship openings</Button>
        </Link>
      </div>
    </div>
  )
}
