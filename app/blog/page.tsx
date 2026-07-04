import type { Metadata } from "next"
import BlogPageClient from "./BlogPageClient"

export const metadata: Metadata = {
  title: "Blog | FOSS Andhra",
  description:
    "Latest news, tutorials, and insights on free and open source software from the FOSS Andhra community in Andhra Pradesh.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | FOSS Andhra",
    description: "News, tutorials, and insights on FOSS from the Andhra Pradesh open source community.",
    url: "https://fossap.in/blog",
  },
}

export default function BlogPage() {
  return <BlogPageClient />
}
