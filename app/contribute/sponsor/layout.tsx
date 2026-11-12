import type { Metadata } from "next"

// Server layout: client pages cannot export metadata, so the sponsor page
// otherwise inherits the homepage title/canonical defaults.
export const metadata: Metadata = {
  title: "Sponsor FOSS Andhra",
  description:
    "Partner with FOSS Andhra: sponsorship tiers for companies and institutions supporting open-source education, events and internships in Andhra Pradesh.",
  alternates: { canonical: "/contribute/sponsor" },
}
