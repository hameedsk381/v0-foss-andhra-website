
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://fossap.in'

    // Base routes that should always be included
    const routes = [
        '',
        '/about',
        '/programs',
        '/events',
        '/blog',
        '/contact',
        '/membership',
        '/careers',
        '/donate',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return routes
}
