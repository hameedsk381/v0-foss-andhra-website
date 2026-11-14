import type { Metadata } from "next"
import ClientPage from "./ClientPage"
import { getHomeContent } from "@/lib/site-content"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomeContent()
  return {
    title: "FOSS Andhra | Open Source Community in Andhra Pradesh",
    description: content.heroSubtitle,
    keywords:
      "FOSS Andhra, FOSSAP, open source software, free software, Andhra Pradesh, Linux community, FOSS education, open source training, open source community India",
    alternates: { canonical: "/" },
  }
}

export default async function Home() {
  const content = await getHomeContent()
  return <ClientPage content={content} />
}
