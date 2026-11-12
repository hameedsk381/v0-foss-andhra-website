import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  // Absolute: with the "%s | FOSS Andhra" template this would exceed 60 chars.
  title: { absolute: "Contact FOSS Andhra | Vijayawada, Andhra Pradesh" },
  description:
    "Get in touch with FOSS Andhra. Email office@fossap.in or call +91 94944 63840. Office at Yesj Centre for Excellence, Vijayawada, AP 520008.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact FOSS Andhra",
    description: "Reach out to the FOSS Andhra team in Vijayawada, Andhra Pradesh.",
    url: "https://fossap.in/contact",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
