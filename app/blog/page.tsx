import type { Metadata } from "next"
import BlogPageClient from "./BlogPageClient"

export const revalidate = 3600

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

async function getPosts() {
  try {
    const { prisma } = await import("@/lib/prisma")
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      include: {
        BlogCategory: true,
        Admin: { select: { name: true, avatar: true } },
        BlogPostTag: { include: { BlogTag: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 20,
    })
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      coverImage: post.coverImage ?? undefined,
      category: { name: (post.BlogCategory as any)?.name ?? "", slug: (post.BlogCategory as any)?.slug ?? "" },
      author: { name: (post.Admin as any)?.name ?? "FOSS Andhra" },
      views: (post as any).views ?? 0,
      publishedAt: post.publishedAt?.toISOString() ?? new Date().toISOString(),
      tags: (post.BlogPostTag ?? []).map((t: any) => ({ tag: { name: t.BlogTag?.name ?? "", slug: t.BlogTag?.slug ?? "" } })),
    }))
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const initialPosts = await getPosts()
  return <BlogPageClient initialPosts={initialPosts} />
}
