import fs from 'fs';
import path from 'path';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import { canonicalPath } from '@/lib/seo/urls';

export interface PublicRoute {
  path: string;
  sourceFiles: string[];
}

const SKIP_DIRS = new Set(['api']);

function walkAppPages(dir: string, urlSegments: string[], routes: PublicRoute[]): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const pageFile = entries.find((entry) => entry.isFile() && entry.name === 'page.tsx');
  const relativeDir = path.relative(path.join(process.cwd(), 'app'), dir).replace(/\\/g, '/') || '.';

  if (pageFile) {
    const sourceFile = path.join('app', relativeDir === '.' ? 'page.tsx' : path.join(relativeDir, 'page.tsx')).replace(/\\/g, '/');
    const dynamicSegment = urlSegments.find((segment) => segment.startsWith('[') && segment.endsWith(']'));

    if (dynamicSegment === '[type]' && urlSegments[0] === 'schema') {
      for (const slug of Object.keys(PROGRAMMATIC_SEO_PAGES)) {
        routes.push({
          path: canonicalPath(`/schema/${slug}`),
          sourceFiles: [sourceFile, 'lib/seoData.ts'],
        });
      }
    } else if (!dynamicSegment) {
      const joined = urlSegments.length === 0 ? '/' : `/${urlSegments.join('/')}`;
      routes.push({
        path: canonicalPath(joined),
        sourceFiles: [sourceFile],
      });
    }
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('_')) continue;
    walkAppPages(path.join(dir, entry.name), [...urlSegments, entry.name], routes);
  }
}

/** Live indexable routes derived from the App Router tree. */
export function listPublicRoutes(): PublicRoute[] {
  const appDir = path.join(process.cwd(), 'app');
  const routes: PublicRoute[] = [];
  walkAppPages(appDir, [], routes);
  const seen = new Set<string>();
  return routes.filter((route) => {
    if (seen.has(route.path)) return false;
    seen.add(route.path);
    return true;
  });
}

export function isNoindexRoute(_path: string): boolean {
  return false;
}
