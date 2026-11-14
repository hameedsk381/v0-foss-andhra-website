/** Certificate types and their default certificate titles. */
export const CERTIFICATE_TYPES: { value: string; label: string; defaultTitle: string }[] = [
  { value: "internship", label: "Internship", defaultTitle: "Certificate of Internship" },
  { value: "event", label: "Event participation", defaultTitle: "Certificate of Participation" },
  { value: "workshop", label: "Workshop", defaultTitle: "Certificate of Completion" },
  { value: "club", label: "Campus club activity", defaultTitle: "Certificate of Appreciation" },
  { value: "contribution", label: "Open source contribution", defaultTitle: "Certificate of Contribution" },
  { value: "custom", label: "Custom", defaultTitle: "Certificate of Recognition" },
]

export const certificateTypeLabel = (type: string) =>
  CERTIFICATE_TYPES.find((t) => t.value === type)?.label ?? type

export const defaultTitleFor = (type: string) =>
  CERTIFICATE_TYPES.find((t) => t.value === type)?.defaultTitle ?? "Certificate of Recognition"

/** Public code format: FOSSAP-CERT-XXXXXXXX (8 hex characters). */
export const CODE_PREFIX = "FOSSAP-CERT-"
export const CODE_PATTERN = /^FOSSAP-CERT-[A-F0-9]{8}$/

export function newCertificateCode() {
  return CODE_PREFIX + randomBytes(4).toString("hex").toUpperCase()
}

/** Normalise user input: uppercase, allow "fossap cert x" / missing prefix variants. */
export function normaliseCodeInput(input: string): string {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, "-")
  if (CODE_PATTERN.test(cleaned)) return cleaned
  // Accept codes typed without the FOSSAP-CERT- prefix
  if (/^[A-F0-9]{8}$/.test(cleaned)) return CODE_PREFIX + cleaned
  return cleaned
}

export const CERTIFICATE_STATUSES = ["active", "revoked"] as const
