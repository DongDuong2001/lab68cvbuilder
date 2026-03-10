import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lab68cvbuilder.vercel.app/';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/builder/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
