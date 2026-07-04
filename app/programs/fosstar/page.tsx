import type { Metadata } from "next"
import FOSStarPageClient from "./FOSStarPageClient"

export const metadata: Metadata = {
  title: "FOSStar — FOSS Andhra Membership Program",
  description:
    "Join FOSStar, FOSS Andhra's membership program for students, professionals, and institutions. Connect, learn, and contribute to the open source community in Andhra Pradesh.",
  alternates: { canonical: "/programs/fosstar" },
  openGraph: {
    title: "FOSStar — FOSS Andhra Membership Program",
    description: "Join the FOSStar membership program and connect with the FOSS community across Andhra Pradesh.",
    url: "https://fossap.in/programs/fosstar",
  },
}

export default function FOSStarPage() {
  return <FOSStarPageClient />
}
