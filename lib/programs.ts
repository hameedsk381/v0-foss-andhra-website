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
    description: "Membership program connecting and empowering the FOSS community",
  },
  {
    id: "fosserve",
    displayName: "FOSServe",
    slug: "fosserve",
    logo: "/logos/fosserve-logo.png",
    themeClass: "text-fosserve",
    description: "Promoting open source solutions in education and governance",
  },
  {
    id: "fossync",
    displayName: "FOSSynC",
    slug: "fossync",
    logo: "/logos/fossync-logo.png",
    themeClass: "text-fossync",
    description: "Student-led FOSS clubs in educational institutions",
  },
  {
    id: "fosstorm",
    displayName: "FOSStorm",
    slug: "fosstorm",
    logo: "/logos/fosstorm-logo.png",
    themeClass: "text-fosstorm",
    description: "Community-led open source projects developed by FOSS Andhra",
  },
  {
    id: "fosstart",
    displayName: "FOSStart",
    slug: "fosstart",
    logo: "/logos/fosstart-logo.png",
    themeClass: "text-fosstart",
    description: "Entrepreneurship space for funding open source innovations",
  },
  {
    id: "fossterage",
    displayName: "FOSSterage",
    slug: "fossterage",
    logo: "/logos/fossterage-logo.png",
    themeClass: "text-fossterage",
    description: "Repository of knowledge bases for researchers and data scientists",
  },
  {
    id: "fosspeaks",
    displayName: "FOSSpeaks",
    slug: "fosspeaks",
    logo: "/logos/fosspeaks-logo.png",
    themeClass: "text-fosspeaks",
    description: "Advocacy program for free and open-source technology for society",
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
