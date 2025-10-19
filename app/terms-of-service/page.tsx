import type { Metadata } from "next"
import TermsOfServicePageClient from "./TermsOfServicePageClient"

export const metadata: Metadata = {
  title: "Terms of Service | FOSS Andhra",
  description: "Terms and conditions for using FOSS Andhra's website, programs, and services.",
}

export default function TermsOfServicePage() {
  return <TermsOfServicePageClient />
}
