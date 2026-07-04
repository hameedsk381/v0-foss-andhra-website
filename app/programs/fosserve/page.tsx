import type { Metadata } from "next"
import FOSServePageClient from "./FOSServePageClient"

export const metadata: Metadata = {
  title: "FOSServe — Open Source in Education & Governance | FOSS Andhra",
  description:
    "FOSServe promotes open source solutions in Andhra Pradesh's educational institutions and government bodies. Partner with FOSS Andhra to transform your organization.",
  alternates: { canonical: "/programs/fosserve" },
  openGraph: {
    title: "FOSServe — Open Source in Education & Governance",
    description: "Advancing open source adoption in AP's schools, colleges, and government with FOSServe.",
    url: "https://fossap.in/programs/fosserve",
  },
}

export default function FOSServePage() {
  return <FOSServePageClient />
}
