export type MemberTier = "student" | "teacher" | "institution" | "professional" | "company" | "ngo" | "general"

export const MEMBER_RESOURCE_TYPE = "member-resource"

export interface TierBenefits {
  tier: MemberTier
  label: string
  tagline: string
  benefits: string[]
  /** Optional resource audience tags a member of this tier can see (in addition to "all"). */
  audiences: string[]
}

const TIERS: Record<MemberTier, TierBenefits> = {
  student: {
    tier: "student",
    label: "Student",
    tagline: "Learn, build and contribute to FOSS",
    benefits: [
      "Members-only learning resources and guides",
      "Priority registration for workshops and events",
      "Downloadable certificates for events you attend",
      "Mentorship and project-contribution opportunities",
    ],
    audiences: ["student"],
  },
  teacher: {
    tier: "teacher",
    label: "Teacher",
    tagline: "Bring FOSS into your classroom",
    benefits: [
      "Teaching kits and curriculum resources",
      "Priority registration for faculty training",
      "Downloadable certificates for events you attend",
      "Connect with other FOSS educators",
    ],
    audiences: ["teacher", "student"],
  },
  institution: {
    tier: "institution",
    label: "Institution",
    tagline: "Move your institution to FOSS",
    benefits: [
      "Migration playbooks and deployment guides",
      "Priority registration for institutional workshops",
      "Certificates for events your representative attends",
      "Dedicated support for FOSS adoption",
    ],
    audiences: ["institution", "teacher", "student"],
  },
  professional: {
    tier: "professional",
    label: "Professional",
    tagline: "Grow your career with FOSS",
    benefits: [
      "Members-only technical resources",
      "Priority registration for meetups and conferences",
      "Downloadable certificates for events you attend",
      "Networking with the FOSS community",
    ],
    audiences: ["professional"],
  },
  company: {
    tier: "company",
    label: "Company",
    tagline: "Leverage FOSS for your business",
    benefits: [
      "Business adoption guides and case studies",
      "Priority registration for industry events",
      "Certificates for events your team attends",
      "Partnership and sponsorship opportunities",
    ],
    audiences: ["company", "professional"],
  },
  ngo: {
    tier: "ngo",
    label: "NGO",
    tagline: "Amplify your impact with FOSS",
    benefits: [
      "Technology toolkits for non-profits",
      "Priority registration for community workshops",
      "Certificates for events your team attends",
      "Collaboration with FOSS volunteers",
    ],
    audiences: ["ngo"],
  },
  general: {
    tier: "general",
    label: "Member",
    tagline: "Welcome to FOSS Andhra",
    benefits: [
      "Members-only resources",
      "Priority registration for events",
      "Downloadable certificates for events you attend",
    ],
    audiences: [],
  },
}

/** Map a stored membershipType (e.g. "FOSStar student", "FOSStar Annual") to a tier. */
export function getTierFromMembershipType(membershipType?: string | null): MemberTier {
  const key = (membershipType || "").trim().toLowerCase().replace(/^fosstar\s+/, "")
  switch (key) {
    case "student":
      return "student"
    case "teacher":
      return "teacher"
    case "institution":
    case "institutional":
      return "institution"
    case "professional":
      return "professional"
    case "company":
      return "company"
    case "ngo":
      return "ngo"
    default:
      return "general"
  }
}

export function getTierBenefits(membershipType?: string | null): TierBenefits {
  return TIERS[getTierFromMembershipType(membershipType)]
}

/**
 * Resource keywords field holds comma-separated audience tags, e.g. "student,teacher".
 * Empty or "all" means every active member can see it.
 */
export function canMemberSeeResource(keywords: string | null | undefined, membershipType?: string | null): boolean {
  const tags = (keywords || "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
  if (tags.length === 0 || tags.includes("all")) return true
  const { audiences } = getTierBenefits(membershipType)
  return tags.some((t) => audiences.includes(t))
}

export function isMembershipActive(member: { status: string; expiryDate: Date | string }): boolean {
  return member.status === "active" && new Date(member.expiryDate).getTime() > Date.now()
}
