import type { Metadata } from "next"

// Server layout: client pages cannot export metadata, so the donation page
// otherwise inherits the homepage title/canonical defaults.
export const metadata: Metadata = {
  title: "Donate to FOSS Andhra",
  description:
    "Support FOSS Andhra's mission to promote free and open source software in education, governance and society across Andhra Pradesh.",
  alternates: { canonical: "/contribute/donate" },
}
