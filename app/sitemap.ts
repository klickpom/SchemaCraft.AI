import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://schemacraft.ai';
  const dynamicRoutes = [
    '',
    '/schema/shopify-product',
    '/schema/nextjs-software',
    '/schema/saas-faq',
    '/schema/local-seo-schema',
  ];

  return dynamicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
