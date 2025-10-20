import Head from "next/head"
import { Metadata } from "next"

interface SEOMetadataProps {
  title: string
  description: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonicalUrl?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  author,
  publishedTime,
  modifiedTime,
  noIndex = false,
}: SEOMetadataProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fossandhra.org"
  const defaultImage = `${siteUrl}/og-default.png`
  
  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.split(",").map(k => k.trim()),
    authors: author ? [{ name: author }] : undefined,
    robots: noIndex ? "noindex,nofollow" : "index,follow",
    openGraph: {
      type: ogType as any,
      title: ogTitle || title,
      description: ogDescription || description,
      images: [
        {
          url: ogImage || defaultImage,
          width: 1200,
          height: 630,
          alt: ogTitle || title,
        },
      ],
      siteName: "FOSS Andhra",
      locale: "en_US",
      url: canonicalUrl || siteUrl,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: (twitterCard || "summary_large_image") as any,
      title: twitterTitle || ogTitle || title,
      description: twitterDescription || ogDescription || description,
      images: [twitterImage || ogImage || defaultImage],
      creator: "@fossandhra",
      site: "@fossandhra",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }

  return metadata
}

// Helper function for blog posts
export function generateBlogPostMetadata(post: {
  title: string
  excerpt: string
  slug: string
  metaDescription?: string | null
  metaKeywords?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  twitterCard?: string | null
  twitterTitle?: string | null
  twitterDescription?: string | null
  twitterImage?: string | null
  canonicalUrl?: string | null
  coverImage?: string | null
  author?: { name: string }
  publishedAt?: Date | null
  updatedAt?: Date
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fossandhra.org"
  
  return generateSEOMetadata({
    title: `${post.title} | FOSS Andhra Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords || undefined,
    ogTitle: post.ogTitle || post.title,
    ogDescription: post.ogDescription || post.excerpt,
    ogImage: post.ogImage || post.coverImage || undefined,
    ogType: "article",
    twitterCard: post.twitterCard || "summary_large_image",
    twitterTitle: post.twitterTitle || post.title,
    twitterDescription: post.twitterDescription || post.excerpt,
    twitterImage: post.twitterImage || post.coverImage || undefined,
    canonicalUrl: post.canonicalUrl || `${siteUrl}/blog/${post.slug}`,
    author: post.author?.name,
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt?.toISOString(),
  })
}

// Helper function for content pages
export function generateContentMetadata(content: {
  title: string
  content: string
  slug: string
  metaDescription?: string | null
  keywords?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  twitterCard?: string | null
  twitterTitle?: string | null
  twitterDescription?: string | null
  twitterImage?: string | null
  canonicalUrl?: string | null
  publishedAt?: Date | null
  updatedAt?: Date
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fossandhra.org"
  
  // Extract plain text from HTML content for description fallback
  const plainText = content.content.replace(/<[^>]*>/g, "").substring(0, 160)
  
  return generateSEOMetadata({
    title: `${content.title} | FOSS Andhra`,
    description: content.metaDescription || plainText,
    keywords: content.keywords || undefined,
    ogTitle: content.ogTitle || content.title,
    ogDescription: content.ogDescription || content.metaDescription || plainText,
    ogImage: content.ogImage || undefined,
    twitterCard: content.twitterCard || "summary_large_image",
    twitterTitle: content.twitterTitle || content.title,
    twitterDescription: content.twitterDescription || content.metaDescription || plainText,
    twitterImage: content.twitterImage || undefined,
    canonicalUrl: content.canonicalUrl || `${siteUrl}/${content.slug}`,
    publishedTime: content.publishedAt?.toISOString(),
    modifiedTime: content.updatedAt?.toISOString(),
  })
}
