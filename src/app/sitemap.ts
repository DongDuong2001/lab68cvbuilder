import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lab68cvbuilder.vercel.app/';

  // Default locale (en) has no URL prefix; other locales are prefixed
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/',      priority: 1.0, changeFrequency: 'weekly'  },
    { path: '/try',   priority: 0.9, changeFrequency: 'monthly' },
    { path: '/login', priority: 0.7, changeFrequency: 'monthly' },
  ];

  const defaultEntries: MetadataRoute.Sitemap = routes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const viEntries: MetadataRoute.Sitemap = routes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}/vi${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority: priority * 0.9,
  }));

  return [...defaultEntries, ...viEntries];
}
