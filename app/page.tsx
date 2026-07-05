import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "FOSS Andhra - Free & Open Source Software Community in Andhra Pradesh",
  description:
    "FOSS Andhra is a community promoting Free and Open Source Software through events, education, hackathons, and developer collaboration across India.",
  keywords:
    "FOSS Andhra, FOSSAP, open source software, free software, Andhra Pradesh, Linux community, FOSS education, open source training, open source community India",
  alternates: { canonical: "/" },
}

export default function Home() {
  return <ClientPage />
}
