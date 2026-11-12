import type { Metadata } from "next"
import BlogPageClient from "./BlogPageClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Blog — Open Source Guides & Community News",
  description:
    "Guides, tutorials and news on free and open source software from the FOSS Andhra community: getting started with Git, Linux, open source programs for students, FOSS clubs and more.",
  keywords: [
    "open source blog",
    "FOSS Andhra blog",
    "open source guides",
    "Git tutorial",
    "Linux for beginners",
    "open source for students",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Open Source Guides & Community News",
    description:
      "Guides, tutorials and news on free and open source software from the Andhra Pradesh open source community.",
    url: "https://fossap.in/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Open Source Guides & Community News",
    description: "Guides, tutorials and news on free and open source software from FOSS Andhra.",
  },
}

async function getPosts() {
  try {
    const { prisma } = await import("@/lib/prisma")
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      include: {
        BlogCategory: true,
        Admin: { select: { name: true } },
        BlogPostTag: { include: { BlogTag: true } },
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: 100,
    })
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      coverImage: post.coverImage ?? undefined,
      featured: post.featured,
      readingTime: (post as any).readingTime > 0 ? (post as any).readingTime : null,
      category: {
        name: (post.BlogCategory as any)?.name ?? "",
        slug: (post.BlogCategory as any)?.slug ?? "",
      },
      author: { name: (post.Admin as any)?.name ?? "FOSS Andhra" },
      publishedAt: post.publishedAt?.toISOString() ?? new Date().toISOString(),
      tags: (post.BlogPostTag ?? []).map((t: any) => ({
        tag: { name: t.BlogTag?.name ?? "", slug: t.BlogTag?.slug ?? "" },
      })),
    }))
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const { prisma } = await import("@/lib/prisma")
    const categories = await prisma.blogCategory.findMany({
      select: {
        name: true,
        slug: true,
        _count: { select: { BlogPost: { where: { status: "published" } } } },
      },
      orderBy: { name: "asc" },
    })
    return categories.map((c: any) => ({
      name: c.name,
      slug: c.slug,
      count: c._count?.BlogPost ?? 0,
    }))
  } catch {
    return []
  }
}

/** Blog + ItemList structured data so crawlers can map the whole cluster. */
function BlogListJsonLd({ posts }: { posts: Awaited<ReturnType<typeof getPosts>> }) {
  if (posts.length === 0) return null
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "FOSS Andhra Blog",
    url: "https://fossap.in/blog",
    description:
      "Guides and news on free and open source software from the FOSS Andhra community in Andhra Pradesh.",
    publisher: {
      "@type": "Organization",
      name: "FOSS Andhra",
      url: "https://fossap.in",
    },
    blogPost: posts.slice(0, 30).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://fossap.in/blog/${post.slug}`,
      datePublished: post.publishedAt,
      ...(post.excerpt ? { description: post.excerpt } : {}),
      author: { "@type": "Person", name: post.author.name },
      ...(post.coverImage ? { image: post.coverImage } : {}),
    })),
  }
  return (
    <script
      id="blog-list-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function BlogPage({ searchParams }: { searchParams?: { category?: string } }) {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()])
  return (
    <>
      <BlogListJsonLd posts={posts} />
      <BlogPageClient
        initialPosts={posts}
        categories={categories}
        initialCategory={searchParams?.category || null}
      />
    </>
  )
}
