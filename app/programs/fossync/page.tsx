import type { Metadata } from "next"
import FOSSynCPageClient from "./FOSSynCPageClient"

export const metadata: Metadata = {
  title: "FOSSynC — Student FOSS Clubs in Andhra Pradesh | FOSS Andhra",
  description:
    "FOSSynC helps colleges across Andhra Pradesh start student-led open source clubs with mentorship, resources, hackathons, and community support.",
  alternates: { canonical: "/programs/fossync" },
  openGraph: {
    title: "FOSSynC — Student FOSS Clubs in Andhra Pradesh",
    description: "Start a FOSS club at your college with FOSSynC's mentorship and resources.",
    url: "https://fossap.in/programs/fossync",
  },
}

export default function FOSSynCPage() {
  return <FOSSynCPageClient />
}
