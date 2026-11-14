/** Sponsorship shared constants (client-safe). */

export const SPONSOR_TIERS = [
  { value: "platinum", label: "Platinum" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "bronze", label: "Bronze" },
  { value: "custom", label: "Custom" },
] as const

export const tierLabel = (tier: string) => SPONSOR_TIERS.find((t) => t.value === tier)?.label ?? tier
