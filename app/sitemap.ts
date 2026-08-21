import { MetadataRoute } from 'next';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://schemacraft-ai.site';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  const programmaticRoutes: MetadataRoute.Sitemap = Object.values(PROGRAMMATIC_SEO_PAGES).map((page) => ({
    url: `${baseUrl}/schema/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...programmaticRoutes];
}
