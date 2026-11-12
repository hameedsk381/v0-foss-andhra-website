import type { Metadata, ReactNode } from "next"

// Server layout: client pages cannot export metadata, so the donation page
// otherwise inherits the homepage title/canonical defaults.
export const metadata: Metadata = {
  // Absolute: the root layout template would otherwise append "| FOSS Andhra"
  // to a title that already contains the brand name.
  title: { absolute: "Donate to FOSS Andhra" },
  description:
    "Support FOSS Andhra's mission to promote free and open source software in education, governance and society across Andhra Pradesh.",
  alternates: { canonical: "/contribute/donate" },
}

export default function DonateLayout({ children }: { children: ReactNode }) {
  return children
}
