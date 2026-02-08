
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://fossap.in'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/*',
                '/admin/*',
                '/login',
                '/register/success',
                '/profile/*',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
