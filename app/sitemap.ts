import { MetadataRoute } from 'next';
import { canonicalUrl } from '@/lib/seo/urls';
import { isNoindexRoute, listPublicRoutes } from '@/lib/seo/routeManifest';
import { lastmodForFiles } from '@/lib/seo/gitLastmod';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = listPublicRoutes().filter((route) => !isNoindexRoute(route.path));
  const entries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: lastmodForFiles(route.sourceFiles),
  }));

  const urls = entries.map((entry) => entry.url);
  const unique = new Set(urls);
  if (unique.size !== urls.length) {
    throw new Error('Sitemap contains duplicate URLs');
  }

  const expected = new Set(routes.map((route) => canonicalUrl(route.path)));
  for (const url of urls) {
    if (!expected.has(url)) {
      throw new Error(`Sitemap URL is not a live route: ${url}`);
    }
  }
  for (const expectedUrl of expected) {
    if (!urls.includes(expectedUrl)) {
      throw new Error(`Live route missing from sitemap: ${expectedUrl}`);
    }
  }

  return entries;
}
