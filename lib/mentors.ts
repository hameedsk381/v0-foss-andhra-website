/** Mentorship shared constants (client-safe). */

export const MENTOR_STATUSES = [
  { value: "pending", label: "Pending review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const

export const mentorStatusLabel = (status: string) =>
  MENTOR_STATUSES.find((s) => s.value === status)?.label ?? status

export const MENTORSHIP_REQUEST_STATUSES = [
  { value: "pending", label: "New request" },
  { value: "accepted", label: "Matched" },
  { value: "declined", label: "Declined" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const

export const requestStatusLabel = (status: string) =>
  MENTORSHIP_REQUEST_STATUSES.find((s) => s.value === status)?.label ?? status

export const expertiseTags = (expertise: string) =>
  expertise
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
