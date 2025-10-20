import Script from "next/script"

interface BlogPostJsonLdProps {
  post: {
    title: string
    excerpt: string
    slug: string
    coverImage?: string | null
    author: { name: string }
    publishedAt?: Date | null
    updatedAt: Date
    category: { name: string }
  }
}

export function BlogPostJsonLd({ post }: BlogPostJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fossandhra.org"
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || `${siteUrl}/og-default.png`,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "FOSS Andhra",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: post.publishedAt?.toISOString() || post.updatedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category.name,
  }

  return (
    <Script
      id="blog-post-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface OrganizationJsonLdProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  socialProfiles?: string[]
}

export function OrganizationJsonLd({
  name = "FOSS Andhra",
  url = "https://fossandhra.org",
  logo = "https://fossandhra.org/logo.png",
  description = "Free and Open Source Software Community in Andhra Pradesh",
  socialProfiles = [
    "https://twitter.com/fossandhra",
    "https://facebook.com/fossandhra",
    "https://linkedin.com/company/fossandhra",
  ],
}: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    sameAs: socialProfiles,
  }

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface EventJsonLdProps {
  event: {
    title: string
    description: string
    date: Date
    endDate?: Date | null
    time: string
    location: string
    imageUrl?: string | null
  }
}

export function EventJsonLd({ event }: EventJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fossandhra.org"
  
  const startDateTime = new Date(event.date)
  const [hours, minutes] = event.time.split(":")
  startDateTime.setHours(parseInt(hours), parseInt(minutes))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: startDateTime.toISOString(),
    endDate: event.endDate?.toISOString() || startDateTime.toISOString(),
    location: {
      "@type": "Place",
      name: event.location,
      address: event.location,
    },
    image: event.imageUrl || `${siteUrl}/og-default.png`,
    organizer: {
      "@type": "Organization",
      name: "FOSS Andhra",
      url: siteUrl,
    },
  }

  return (
    <Script
      id="event-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
