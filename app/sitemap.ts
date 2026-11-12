import { prisma } from "@/lib/prisma"
import { MetadataRoute } from 'next'

export const dynamic = "force-dynamic"

const baseUrl = 'https://fossap.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes that should always be included
    const routes = [
        '',
        '/about',
        '/programs',
        '/events',
        '/blog',
        '/contact',
        '/membership',
        '/careers',
        '/faq',
        '/gallery',
        '/contribute',
        '/contribute/donate',
        '/contribute/sponsor',
        '/contribute/volunteer',
        '/privacy-policy',
        '/terms-of-service',
        '/refund-policy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Program detail pages
    const programSlugs = [
        'fosstar',
        'fosserve',
        'fossync',
        'fosstorm',
        'fosstart',
        'fossterage',
        'fosspeaks',
    ]
    const programRoutes = programSlugs.map((slug) => ({
        url: `${baseUrl}/programs/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Published blog posts (the most frequently changing content)
    let blogRoutes: MetadataRoute.Sitemap = []
    try {
        const posts = await prisma.blogPost.findMany({
            where: { status: 'published' },
            orderBy: { publishedAt: 'desc' },
            select: { slug: true, updatedAt: true, publishedAt: true },
        })
        blogRoutes = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.publishedAt || post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))
    } catch (error) {
        console.error('Sitemap: failed to load blog posts', error)
    }

    return [...routes, ...programRoutes, ...blogRoutes]
}
