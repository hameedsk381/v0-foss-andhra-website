/** Resource library shared constants (client-safe). */

export const RESOURCE_CATEGORIES = [
  { value: "install-fest-kit", label: "Install fest kit" },
  { value: "poster-template", label: "Poster template" },
  { value: "slide-deck", label: "Slide deck" },
  { value: "guide", label: "Guide / handbook" },
  { value: "recording", label: "Recording" },
  { value: "dataset", label: "Dataset" },
  { value: "other", label: "Other" },
] as const

export const resourceCategoryLabel = (category: string) =>
  RESOURCE_CATEGORIES.find((c) => c.value === category)?.label ?? category

export const RESOURCE_ACCESS = [
  { value: "public", label: "Public" },
  { value: "members", label: "Members only" },
] as const

export const resourceAccessLabel = (access: string) =>
  RESOURCE_ACCESS.find((a) => a.value === access)?.label ?? access
