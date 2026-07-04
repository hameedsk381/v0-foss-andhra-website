import type { Metadata } from "next"
import ContributePageClient from "./ContributePageClient"

export const metadata: Metadata = {
  title: "Contribute to FOSS Andhra | Donate, Volunteer, Sponsor",
  description:
    "Support FOSS Andhra through donations, volunteering your skills, or corporate sponsorship. Help advance free and open source software adoption in Andhra Pradesh.",
  alternates: { canonical: "/contribute" },
  openGraph: {
    title: "Contribute to FOSS Andhra",
    description: "Donate, volunteer, or sponsor FOSS Andhra to advance open source in Andhra Pradesh.",
    url: "https://fossap.in/contribute",
  },
}

export default function ContributePage() {
  return <ContributePageClient />
}
