
import { Metadata } from "next"
import ProgramsClient from "./ProgramsClient"

export const metadata: Metadata = {
    title: "Programs - FOSS Andhra",
    description:
        "Explore FOSS Andhra's flagship programs like FOSStar, FOSServe, FOSSync, FOSStorm, and more. Join our initiatives to promote open source.",
    keywords: "FOSS programs, open source initiatives, Andhra Pradesh tech programs, FOSStar, FOSServe, FOSSync",
}

export default function ProgramsPage() {
    return <ProgramsClient />
}
