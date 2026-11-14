/** Club statuses for the FOSSynC clubs portal. */
export const CLUB_STATUSES = [
  { value: "pending", label: "Pending review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const

export const clubStatusLabel = (status: string) =>
  CLUB_STATUSES.find((s) => s.value === status)?.label ?? status

/** Public club page URL for an approved club. */
export const clubPublicPath = (slug: string | null) => (slug ? `/clubs/${slug}` : null)

export const AP_DISTRICTS = [
  "Alluri Sitharama Raju",
  "Anakapalli",
  "Ananthapuramu",
  "Annamayya",
  "Bapatla",
  "Chittoor",
  "Dr. B.R. Ambedkar Konaseema",
  "East Godavari",
  "Eluru",
  "Guntur",
  "Kakinada",
  "Krishna",
  "Kurnool",
  "Nandyal",
  "NTR",
  "Palnadu",
  "Parvathipuram Manyam",
  "Prakasam",
  "Sri Sathya Sai",
  "Srikakulam",
  "Tirupati",
  "Visakhapatnam",
  "Vizianagaram",
  "West Godavari",
  "YSR Kadapa",
]
