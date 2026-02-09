import type { Metadata } from "next"
import ClientPage from "./ClientPage"

const initiatives = [
  {
    name: "FOSStar",
    description: "Kickstarting your Open Source Journey",
    color: "fosstar",
    link: "https://fosstar.ieeevit.org/",
  },
  {
    name: "FOSServe",
    description: "Contributing to Society with Open Source",
    color: "fosserve",
    link: "https://fosserve.ieeevit.org/",
  },
  {
    name: "FOSSynC",
    description: "Syncing Ideas to reality",
    color: "fossync",
    link: "https://fossync.ieeevit.org/",
  },
  {
    name: "FOSStorm",
    description: "Brainstorming the future of Open Source",
    color: "fosstorm",
    link: "https://fosstorm.ieeevit.org/",
  },
  {
    name: "FOSStart",
    description: "The Art of Open Source",
    color: "fosstart",
    link: "https://fosstart.ieeevit.org/",
  },
  {
    name: "FOSSterage",
    description: "A storage house of Open Source projects",
    color: "fossterage",
    link: "https://fossterage.ieeevit.org/",
  },
  {
    name: "FOSSpeaks",
    description: "Let your voice be heard",
    color: "fosspeaks",
    link: "https://fosspeaks.ieeevit.org/",
  },
]

export const metadata: Metadata = {
  title: "FOSS Andhra - Free & Open Source Software Community in Andhra Pradesh",
  description:
    "Join FOSS Andhra to promote free and open source software in education, governance, and society. Discover our programs, events, and community initiatives in Andhra Pradesh.",
  keywords:
    "FOSS Andhra, open source software, free software, Andhra Pradesh, Linux community, FOSS education, open source training",
}

export default function Home() {
  return <ClientPage />
}
