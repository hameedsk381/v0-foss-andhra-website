import type { Metadata } from "next"
import FOSStormPageClient from "./FOSStormPageClient"

export const metadata: Metadata = {
  title: "FOSStorm — Community Open Source Projects | FOSS Andhra",
  description:
    "FOSStorm develops open source projects addressing local challenges in Andhra Pradesh. Collaborate on impactful solutions for education, governance, and digital inclusion.",
  alternates: { canonical: "/programs/fosstorm" },
  openGraph: {
    title: "FOSStorm — Community Open Source Projects",
    description: "Build open source solutions for Andhra Pradesh's local challenges with FOSStorm.",
    url: "https://fossap.in/programs/fosstorm",
  },
}

export default function FOSStormPage() {
  return <FOSStormPageClient />
}
