import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const INTERNSHIP_POSTER = {
  src: "/posters/internship-program.png",
  /** 1200x675 JPEG (~150 KB) for link previews; the PNG is too heavy for WhatsApp and others. */
  ogSrc: "/posters/internship-program-og.jpg",
  width: 1672,
  height: 941,
  alt: "FOSS Andhra Internship Program poster: internships in Agentic AI, Website Development, Digital Marketing, UI/UX Design, AI Automation, System Design and DevOps.",
}

/** Open Graph / Twitter metadata so shared links show the poster. */
export const internshipPosterMetadata = {
  openGraph: {
    images: [{ url: INTERNSHIP_POSTER.ogSrc, width: 1200, height: 675, alt: INTERNSHIP_POSTER.alt }],
  },
  twitter: {
    card: "summary_large_image" as const,
    images: [INTERNSHIP_POSTER.ogSrc],
  },
}

interface InternshipPosterProps {
  className?: string
  /** Wrap the poster in a link (e.g. to the internship openings). */
  href?: string
  priority?: boolean
  sizes?: string
}

export function InternshipPoster({ className, href, priority, sizes = "(min-width: 1024px) 1024px, 100vw" }: InternshipPosterProps) {
  const image = (
    <Image
      src={INTERNSHIP_POSTER.src}
      alt={INTERNSHIP_POSTER.alt}
      width={INTERNSHIP_POSTER.width}
      height={INTERNSHIP_POSTER.height}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto w-full rounded-lg border border-border", className)}
    />
  )

  if (!href) return image
  return (
    <Link href={href} className="block" aria-label="View internship openings">
      {image}
    </Link>
  )
}
