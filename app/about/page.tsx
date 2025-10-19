import type { Metadata } from "next"
import AboutPageClient from "./AboutPageClient"

export const metadata: Metadata = {
  title: "About FOSS Andhra - Our Mission and Vision",
  description:
    "Learn about FOSS Andhra's mission to promote free and open source software across education, governance, and society in Andhra Pradesh.",
  keywords: "FOSS Andhra, about, mission, vision, open source, free software, Andhra Pradesh",
}

export default function AboutPage() {
  return <AboutPageClient />
}
