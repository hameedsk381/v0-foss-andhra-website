import type { Metadata } from "next"
import FOSSteragePageClient from "./FOSSteragePageClient"

export const metadata: Metadata = {
  title: "FOSSterage — FOSS Knowledge Repository | FOSS Andhra",
  description:
    "FOSSterage is FOSS Andhra's open knowledge repository for free and open source software resources, documentation, and learning materials in Andhra Pradesh.",
  alternates: { canonical: "/programs/fossterage" },
  openGraph: {
    title: "FOSSterage — FOSS Knowledge Repository",
    description: "Access FOSS Andhra's curated open source resources, docs, and learning materials.",
    url: "https://fossap.in/programs/fossterage",
  },
}

export default function FOSSteragePage() {
  return <FOSSteragePageClient />
}
