import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "FOSS Andhra - Free & Open Source Software Community in Andhra Pradesh",
  description:
    "Join FOSS Andhra to promote free and open source software in education, governance, and society. Discover our programs, events, and community initiatives in Andhra Pradesh.",
  keywords:
    "FOSS Andhra, open source software, free software, Andhra Pradesh, Linux community, FOSS education, open source training",
}

export default function Home() {
  return <ClientPage />
}
