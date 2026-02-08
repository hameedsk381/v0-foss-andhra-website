/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  images: {
    remotePatterns: (() => {
      const patterns = [
        { protocol: "https", hostname: "fossap.in" },
        { protocol: "https", hostname: "images.unsplash.com" },
      ]
      // Dynamically allow MinIO public URL for gallery/media assets
      const minioUrl = process.env.MINIO_PUBLIC_URL
      const bucket = process.env.MINIO_BUCKET || "foss-andhra-gallery"
      if (minioUrl) {
        try {
          const u = new URL(minioUrl)
          patterns.push({
            protocol: u.protocol.replace(":", ""),
            hostname: u.hostname,
            port: u.port || undefined,
            pathname: `/${bucket}/**`,
          })
        } catch (_) {
          // Ignore invalid URL
        }
      }
      return patterns
    })(),
    formats: ["image/avif", "image/webp"],
    unoptimized: false,
  },
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Experimental feature to skip static generation for problematic pages
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '.prisma'],
  },

  // Security headers (removed HSTS to allow reverse proxy handling)
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
