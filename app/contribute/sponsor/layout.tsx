import type { Metadata, ReactNode } from "next"

// Server layout: client pages cannot export metadata, so the sponsor page
// otherwise inherits the homepage title/canonical defaults.
export const metadata: Metadata = {
  // Absolute: the root layout template would otherwise append "| FOSS Andhra"
  // to a title that already contains the brand name.
  title: { absolute: "Sponsor FOSS Andhra" },
  description:
    "Partner with FOSS Andhra: sponsorship tiers for companies and institutions supporting open-source education, events and internships in Andhra Pradesh.",
  alternates: { canonical: "/contribute/sponsor" },
}

export default function SponsorLayout({ children }: { children: ReactNode }) {
  return children
}
