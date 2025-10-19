import Head from "next/head"

interface SEOMetaProps {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: "website" | "article"
}

export function SEOMeta({ title, description, keywords, image, url, type = "website" }: SEOMetaProps) {
  const siteUrl = "https://fossandhra.org"
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const imageUrl = image ? `${siteUrl}${image}` : `${siteUrl}/og-image.png`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <link rel="canonical" href={fullUrl} />
    </Head>
  )
}
