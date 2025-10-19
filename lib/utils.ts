import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Program information
export const programInfo = {
  fosstar: {
    title: "FOSStar",
    description: "Membership program connecting and empowering the FOSS community",
    color: "fosstar",
    icon: "Users",
    logo: "/logos/fosstar-logo.svg",
  },
  fosserve: {
    title: "FOSServe",
    description: "Promoting open source solutions in education and governance",
    color: "fosserve",
    icon: "BookOpen",
    logo: "/logos/fosserve-logo.svg",
  },
  fossync: {
    title: "FOSSynC",
    description: "Student-led FOSS clubs in educational institutions",
    color: "fossync",
    icon: "GraduationCap",
    logo: "/logos/fossync-logo.svg",
  },
  fosstorm: {
    title: "FOSStorm",
    description: "Community-led open source projects developed by FOSS Andhra",
    color: "fosstorm",
    icon: "Code",
    logo: "/logos/fosstorm-logo.svg",
  },
  fossart: {
    title: "FOSSart",
    description: "Entrepreneurship space for funding open source innovations",
    color: "fossart",
    icon: "Rocket",
    logo: "/logos/fossart-logo.svg",
  },

  fossterage: {
    title: "FOSSterage",
    description: "Repository of knowledge bases for researchers and data scientists",
    color: "fossterage",
    icon: "Database",
    logo: "/logos/fossterage-logo.svg",
  },
  fosspeaks: {
    title: "FOSSpeaks",
    description: "Advocacy program for free and open-source technology for society",
    color: "fosspeaks",
    icon: "Megaphone",
    logo: "/logos/fosspeaks-logo.svg",
  },
}

// Program colors for styling
export const programColors = {
  fosstar: "bg-fosstar",
  fosserve: "bg-fosserve",
  fossync: "bg-fossync",
  fosstorm: "bg-fosstorm",
  fossart: "bg-fossart",
  fossstart: "bg-fossstart",
  fossterage: "bg-fossterage",
  fosspeaks: "bg-fosspeaks",
}
