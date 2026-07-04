import type { Metadata } from "next"
import MembershipPageClient from "./MembershipPageClient"

export const metadata: Metadata = {
  title: "FOSStar Membership Program | FOSS Andhra",
  description:
    "Explore FOSStar membership tiers for students, professionals, and institutions. Join the FOSS Andhra community in Andhra Pradesh and access exclusive resources and events.",
  alternates: { canonical: "/membership" },
  openGraph: {
    title: "FOSStar Membership | FOSS Andhra",
    description: "Join FOSS Andhra's membership program for students, professionals, and institutions in AP.",
    url: "https://fossap.in/membership",
  },
}

export default function MembershipPage() {
  return <MembershipPageClient />
}
