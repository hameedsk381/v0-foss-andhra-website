/**
 * Internship HR content: duration, venue, per-domain roles and responsibilities, and letter helpers.
 * Edit the constants below to change what every offer letter says.
 */

export const INTERNSHIP_MONTHS = 3

/** Where interns meet (same address as the site footer). */
export const OFFICE = {
  name: "Yesj Centre for Excellence",
  city: "Vijayawada, AP 520008",
}

export const officeLine = () => `${OFFICE.name}, ${OFFICE.city}`

export const HR_EMAIL = () =>
  process.env.CAREERS_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim() || "office@fossap.in"

export const SIGNATORY = {
  name: process.env.OFFER_SIGNATORY_NAME?.trim() || "",
  title: process.env.OFFER_SIGNATORY_TITLE?.trim() || "Internship Program Coordinator",
}

export interface RoleProfile {
  focus: string
  responsibilities: string[]
}

const PROFILES: { match: RegExp; profile: RoleProfile }[] = [
  {
    match: /agentic/i,
    profile: {
      focus: "Design and build AI agents that plan, use tools and complete tasks using open-source models and frameworks.",
      responsibilities: [
        "Build and test small agent workflows with open-source LLMs and agent frameworks",
        "Write prompts, tool integrations and evaluation cases, and record what works",
        "Document each agent clearly so others in the community can reuse it",
        "Share progress in weekly reviews and demo your work at the end of the program",
      ],
    },
  },
  {
    match: /website|web dev/i,
    profile: {
      focus: "Build and improve web features for FOSS Andhra and community projects.",
      responsibilities: [
        "Develop and fix pages and components in the FOSS Andhra web codebase",
        "Write clean, reviewed code through pull requests and follow the project's conventions",
        "Test your work on mobile and desktop and fix accessibility and performance issues",
        "Document changes and help other interns get started with the codebase",
      ],
    },
  },
  {
    match: /marketing/i,
    profile: {
      focus: "Grow FOSS Andhra's reach through content, social media and campus outreach.",
      responsibilities: [
        "Plan and publish social media posts, posters and short-form content",
        "Write blog posts and event announcements in clear, accurate language",
        "Support campaign planning for programs, events and the internship intake",
        "Track reach and engagement and report what is working every week",
      ],
    },
  },
  {
    match: /ui\/?ux|design/i,
    profile: {
      focus: "Design clear, accessible interfaces for FOSS Andhra products and campaigns.",
      responsibilities: [
        "Create wireframes, user flows and high-fidelity designs for web pages and features",
        "Prefer open-source design tools and share editable source files",
        "Run quick usability checks with community members and act on the feedback",
        "Hand designs over to developers with clear specifications",
      ],
    },
  },
  {
    match: /automation/i,
    profile: {
      focus: "Automate repetitive community and operations work with AI and open-source tooling.",
      responsibilities: [
        "Identify manual processes and propose automations to save volunteer time",
        "Build, test and maintain automation workflows with open-source tools",
        "Handle errors and edge cases, and keep a runbook for every automation",
        "Report the time saved and any risks to your mentor",
      ],
    },
  },
  {
    match: /system design/i,
    profile: {
      focus: "Learn to design reliable, scalable systems by working on real FOSS Andhra architecture.",
      responsibilities: [
        "Study the existing system and document its architecture and data flows",
        "Draft design proposals for improvements, with trade-offs and diagrams",
        "Review designs with your mentor and refine them based on feedback",
        "Present your final design to the team at the end of the program",
      ],
    },
  },
  {
    match: /devops/i,
    profile: {
      focus: "Learn to build, ship and run software reliably using open-source tooling.",
      responsibilities: [
        "Help maintain build, test and deployment pipelines",
        "Work with containers, monitoring and backups under mentor supervision",
        "Write and update runbooks so deployments are repeatable",
        "Follow security practices and never share credentials or secrets",
      ],
    },
  },
]

const GENERAL: RoleProfile = {
  focus: "Contribute to FOSS Andhra's programs under the guidance of a mentor.",
  responsibilities: [
    "Complete the tasks assigned by your mentor on time and to a good standard",
    "Document your work and share it openly where appropriate",
    "Take part in weekly check-ins and share honest progress updates",
  ],
}

export function getRoleProfile(department: string | null | undefined, title?: string | null): RoleProfile {
  const haystack = `${department ?? ""} ${title ?? ""}`
  return PROFILES.find((p) => p.match.test(haystack))?.profile ?? GENERAL
}

/** Responsibilities every intern shares, regardless of domain. */
export const COMMON_RESPONSIBILITIES = [
  "Attend the on-site sessions at the Yesj Centre for Excellence, Vijayawada, and the scheduled online check-ins",
  "Be punctual, communicate absences in advance, and respond to your mentor within a reasonable time",
  "Follow the FOSS Andhra Code of Conduct and treat every community member with respect",
  "Submit a short weekly progress update and a final report or demo at the end of the internship",
  "Keep any non-public information you see during the internship confidential",
]

export const TERMS = [
  "This is an unpaid, learning-focused internship. It does not create an employment relationship or any promise of future employment.",
  "Work you create for FOSS Andhra is released under an open-source licence chosen by the project. You keep credit for your contributions.",
  "On satisfactory completion and attendance you will receive a Certificate of Internship from FOSS Andhra.",
  "Either party may end the internship by giving reasonable notice. FOSS Andhra may end it earlier for a breach of the Code of Conduct.",
  "You must remain an active FOSStar member for the duration of the internship.",
]

/** Same day-of-month `months` later, minus one day (clamped to the month length). */
export function addMonthsMinusDay(start: Date, months: number) {
  const d = new Date(start)
  const day = d.getUTCDate()
  d.setUTCDate(1)
  d.setUTCMonth(d.getUTCMonth() + months)
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
  d.setUTCDate(Math.min(day, lastDay))
  d.setUTCDate(d.getUTCDate() - 1)
  return d
}

export const formatLongDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })

export const formatDateTime = (d: Date | string) =>
  new Date(d).toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })

export function baseUrl() {
  return (process.env.NEXTAUTH_URL || "https://fossap.in").replace(/\/$/, "")
}

export const offerUrl = (token: string) => `${baseUrl()}/careers/offer/${token}`
