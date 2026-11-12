import type { Metadata } from "next"

// Server layout: client pages cannot export metadata, so the volunteer page
// otherwise inherits the homepage title/canonical defaults.
export const metadata: Metadata = {
  title: "Volunteer with FOSS Andhra",
  description:
    "Register as a FOSS Andhra volunteer: mentor students, run workshops, help with events and open-source projects across Andhra Pradesh.",
  alternates: { canonical: "/contribute/volunteer" },
}
