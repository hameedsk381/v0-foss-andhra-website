import type { Metadata } from "next"
import FOSSpeaksPageClient from "./FOSSpeaksPageClient"

export const metadata: Metadata = {
  title: "FOSSpeaks — FOSS Advocacy & Public Speaking | FOSS Andhra",
  description:
    "FOSSpeaks advocates for free and open source software adoption in Andhra Pradesh through public speaking, workshops, conferences, and community outreach.",
  alternates: { canonical: "/programs/fosspeaks" },
  openGraph: {
    title: "FOSSpeaks — FOSS Advocacy & Public Speaking",
    description: "Spreading the FOSS message across Andhra Pradesh through talks, workshops, and advocacy.",
    url: "https://fossap.in/programs/fosspeaks",
  },
}

export default function FOSSpeaksPage() {
  return <FOSSpeaksPageClient />
}
