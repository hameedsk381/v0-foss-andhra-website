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
    logo: "/logos/fosstar-logo.png",
  },
  fosserve: {
    title: "FOSServe",
    description: "Promoting open source solutions in education and governance",
    color: "fosserve",
    icon: "BookOpen",
    logo: "/logos/fosserve-logo.png",
  },
  fossync: {
    title: "FOSSynC",
    description: "Student-led FOSS clubs in educational institutions",
    color: "fossync",
    icon: "GraduationCap",
    logo: "/logos/fossync-logo.png",
  },
  fosstorm: {
    title: "FOSStorm",
    description: "Community-led open source projects developed by FOSS Andhra",
    color: "fosstorm",
    icon: "Code",
    logo: "/logos/fosstorm-logo.png",
  },
  fosstart: {
    title: "FOSStart",
    description: "Entrepreneurship space for funding open source innovations",
    color: "fosstart",
    icon: "Rocket",
    logo: "/logos/fosstart-logo.png",
  },

  fossterage: {
    title: "FOSSterage",
    description: "Repository of knowledge bases for researchers and data scientists",
    color: "fossterage",
    icon: "Database",
    logo: "/logos/fossterage-logo.png",
  },
  fosspeaks: {
    title: "FOSSpeaks",
    description: "Advocacy program for free and open-source technology for society",
    color: "fosspeaks",
    icon: "Megaphone",
    logo: "/logos/fosspeaks-logo.png",
  },
}

// Program colors for styling
export const programColors = {
  fosstar: "bg-fosstar",
  fosserve: "bg-fosserve",
  fossync: "bg-fossync",
  fosstorm: "bg-fosstorm",
  fosstart: "bg-fosstart",
  fossstart: "bg-fossstart",
  fossterage: "bg-fossterage",
  fosspeaks: "bg-fosspeaks",
}
