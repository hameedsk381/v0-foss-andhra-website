import type { Metadata, ReactNode } from "next"

// Server layout: client pages cannot export metadata, so the volunteer page
// otherwise inherits the homepage title/canonical defaults.
export const metadata: Metadata = {
  // Absolute: the root layout template would otherwise append "| FOSS Andhra"
  // to a title that already contains the brand name.
  title: { absolute: "Volunteer with FOSS Andhra" },
  description:
    "Register as a FOSS Andhra volunteer: mentor students, run workshops, help with events and open-source projects across Andhra Pradesh.",
  alternates: { canonical: "/contribute/volunteer" },
}

export default function VolunteerLayout({ children }: { children: ReactNode }) {
  return children
}
