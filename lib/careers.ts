export const OPENING_TYPES = [
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "fellowship", label: "Fellowship" },
  { value: "contract", label: "Contract" },
  { value: "volunteer", label: "Volunteer Role" },
] as const

export const WORK_MODES = [
  { value: "onsite", label: "On-site" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
] as const

export const OPENING_STATUSES = ["draft", "open", "closed"] as const
export const APPLICATION_STATUSES = ["new", "reviewing", "shortlisted", "rejected", "hired"] as const

export const typeLabel = (value: string) => OPENING_TYPES.find((t) => t.value === value)?.label ?? value
export const workModeLabel = (value: string) => WORK_MODES.find((m) => m.value === value)?.label ?? value

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)
}

/** Internships can only be applied to by active FOSStar members. */
export const requiresMembership = (type: string) => type === "internship"

/** An opening is visible/applicable only while open and before its deadline (end of that day). */
export function isOpeningAcceptingApplications(opening: { status: string; applyDeadline: Date | null }) {
  if (opening.status !== "open") return false
  if (!opening.applyDeadline) return true
  const endOfDeadline = new Date(opening.applyDeadline)
  endOfDeadline.setHours(23, 59, 59, 999)
  return endOfDeadline.getTime() >= Date.now()
}
