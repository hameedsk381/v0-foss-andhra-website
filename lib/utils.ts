import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PROGRAMS_BY_ID, PROGRAM_BG_CLASS } from "@/lib/programs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Program information
export const programInfo = {
  fosstar: {
    title: PROGRAMS_BY_ID.fosstar.displayName,
    description: PROGRAMS_BY_ID.fosstar.description,
    color: "fosstar",
    icon: "Users",
    logo: PROGRAMS_BY_ID.fosstar.logo,
  },
  fosserve: {
    title: PROGRAMS_BY_ID.fosserve.displayName,
    description: PROGRAMS_BY_ID.fosserve.description,
    color: "fosserve",
    icon: "BookOpen",
    logo: PROGRAMS_BY_ID.fosserve.logo,
  },
  fossync: {
    title: PROGRAMS_BY_ID.fossync.displayName,
    description: PROGRAMS_BY_ID.fossync.description,
    color: "fossync",
    icon: "GraduationCap",
    logo: PROGRAMS_BY_ID.fossync.logo,
  },
  fosstorm: {
    title: PROGRAMS_BY_ID.fosstorm.displayName,
    description: PROGRAMS_BY_ID.fosstorm.description,
    color: "fosstorm",
    icon: "Code",
    logo: PROGRAMS_BY_ID.fosstorm.logo,
  },
  fosstart: {
    title: PROGRAMS_BY_ID.fosstart.displayName,
    description: PROGRAMS_BY_ID.fosstart.description,
    color: "fosstart",
    icon: "Rocket",
    logo: PROGRAMS_BY_ID.fosstart.logo,
  },

  fossterage: {
    title: PROGRAMS_BY_ID.fossterage.displayName,
    description: PROGRAMS_BY_ID.fossterage.description,
    color: "fossterage",
    icon: "Database",
    logo: PROGRAMS_BY_ID.fossterage.logo,
  },
  fosspeaks: {
    title: PROGRAMS_BY_ID.fosspeaks.displayName,
    description: PROGRAMS_BY_ID.fosspeaks.description,
    color: "fosspeaks",
    icon: "Megaphone",
    logo: PROGRAMS_BY_ID.fosspeaks.logo,
  },
}

// Program colors for styling
export const programColors = {
  ...PROGRAM_BG_CLASS,
}
