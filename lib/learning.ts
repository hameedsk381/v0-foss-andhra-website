/** Learning Hub shared constants (client-safe). */

export const TRACK_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const

export const levelLabel = (level: string) =>
  TRACK_LEVELS.find((l) => l.value === level)?.label ?? level

export const CONTENT_STATUSES = ["draft", "published"] as const

export const levelBadgeClass = (level: string) =>
  level === "advanced"
    ? "bg-purple-100 text-purple-800"
    : level === "intermediate"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800"
