import type { Metadata } from "next"
import FOSStartPageClient from "./FOSStartPageClient"

export const metadata: Metadata = {
  title: "FOSStart — Open Source Startup Incubation | FOSS Andhra",
  description:
    "FOSStart incubates open source startups in Andhra Pradesh with seed funding, mentorship, and a network of FOSS entrepreneurs. Build a sustainable business on open source.",
  alternates: { canonical: "/programs/fosstart" },
  openGraph: {
    title: "FOSStart — Open Source Startup Incubation",
    description: "Launch your open source startup in Andhra Pradesh with FOSStart funding and mentorship.",
    url: "https://fossap.in/programs/fosstart",
  },
}

export default function FOSStartPage() {
  return <FOSStartPageClient />
}
