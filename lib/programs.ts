export type ProgramId =
  | "fosstar"
  | "fosserve"
  | "fossync"
  | "fosstorm"
  | "fosstart"
  | "fossterage"
  | "fosspeaks"

export interface ProgramDefinition {
  id: ProgramId
  displayName: string
  slug: ProgramId
  logo: string
  themeClass: string
  description: string
}

export const PROGRAMS: ProgramDefinition[] = [
  {
    id: "fosstar",
    displayName: "FOSStar",
    slug: "fosstar",
    logo: "/logos/fosstar-logo.png",
    themeClass: "text-fosstar",
    description: "Connect with 700+ students, developers, and institutions driving open source adoption across Andhra Pradesh.",
  },
  {
    id: "fosserve",
    displayName: "FOSServe",
    slug: "fosserve",
    logo: "/logos/fosserve-logo.png",
    themeClass: "text-fosserve",
    description: "Helping AP schools and government offices replace proprietary software with auditable, community-owned tools.",
  },
  {
    id: "fossync",
    displayName: "FOSSynC",
    slug: "fossync",
    logo: "/logos/fossync-logo.png",
    themeClass: "text-fossync",
    description: "Student-led open source clubs on 9+ AP campuses — building the next generation of contributors and maintainers.",
  },
  {
    id: "fosstorm",
    displayName: "FOSStorm",
    slug: "fosstorm",
    logo: "/logos/fosstorm-logo.png",
    themeClass: "text-fosstorm",
    description: "Community developers building Telugu NLP, offline education software, and civic tech — all freely licensed.",
  },
  {
    id: "fosstart",
    displayName: "FOSStart",
    slug: "fosstart",
    logo: "/logos/fosstart-logo.png",
    themeClass: "text-fosstart",
    description: "Seed funding, mentorship, and a network for founders building products on open source foundations.",
  },
  {
    id: "fossterage",
    displayName: "FOSSterage",
    slug: "fossterage",
    logo: "/logos/fossterage-logo.png",
    themeClass: "text-fossterage",
    description: "Open datasets, research archives, and curated resources for Telugu-language computing and AI development.",
  },
  {
    id: "fosspeaks",
    displayName: "FOSSpeaks",
    slug: "fosspeaks",
    logo: "/logos/fosspeaks-logo.png",
    themeClass: "text-fosspeaks",
    description: "Speakers, workshops, and policy advocacy making the case for open source in AP institutions and government.",
  },
]

export const PROGRAMS_BY_ID = Object.fromEntries(PROGRAMS.map((program) => [program.id, program])) as Record<
  ProgramId,
  ProgramDefinition
>

export const PROGRAM_TEXT_CLASS: Record<ProgramId, string> = {
  fosstar: "text-fosstar",
  fosserve: "text-fosserve",
  fossync: "text-fossync",
  fosstorm: "text-fosstorm",
  fosstart: "text-fosstart",
  fossterage: "text-fossterage",
  fosspeaks: "text-fosspeaks",
}

export const PROGRAM_BG_CLASS: Record<ProgramId, string> = {
  fosstar: "bg-fosstar",
  fosserve: "bg-fosserve",
  fossync: "bg-fossync",
  fosstorm: "bg-fosstorm",
  fosstart: "bg-fosstart",
  fossterage: "bg-fossterage",
  fosspeaks: "bg-fosspeaks",
}

export const PROGRAM_HOVER_BG_CLASS: Record<ProgramId, string> = {
  fosstar: "hover:bg-fosstar/10",
  fosserve: "hover:bg-fosserve/10",
  fossync: "hover:bg-fossync/10",
  fosstorm: "hover:bg-fosstorm/10",
  fosstart: "hover:bg-fosstart/10",
  fossterage: "hover:bg-fossterage/10",
  fosspeaks: "hover:bg-fosspeaks/10",
}
