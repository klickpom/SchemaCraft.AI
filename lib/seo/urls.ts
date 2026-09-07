/**
 * Single source of truth for public URLs.
 * Convention: HTTPS, apex host (no www), trailing slash on every page.
 * Matches next.config.mjs trailingSlash: true.
 */
export const SITE_ORIGIN = 'https://schemacraft-ai.site';
export const SITE_HOST = 'schemacraft-ai.site';

function pathnameFromInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '/';

  let pathname = trimmed;
  try {
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed) || trimmed.startsWith('//')) {
      const url = new URL(trimmed.startsWith('//') ? `https:${trimmed}` : trimmed);
      pathname = url.pathname;
    }
  } catch {
    pathname = trimmed;
  }

  pathname = pathname.split('?')[0].split('#')[0];
  pathname = pathname.toLowerCase();
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, '/');
  if (pathname.length > 1 && pathname.endsWith('/')) {
    // keep trailing slash; collapse happens above
  }
  return pathname;
}

/** Site-relative path in canonical form (`/` or `/foo/`). */
export function canonicalPath(input: string): string {
  let pathname = pathnameFromInput(input);
  if (pathname === '/') return '/';
  if (!pathname.endsWith('/')) pathname = `${pathname}/`;
  return pathname;
}

/** Absolute self-referential canonical URL. */
export function canonicalUrl(input: string): string {
  const path = canonicalPath(input);
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

export function schemaPath(slug: string): string {
  return canonicalPath(`/schema/${slug}`);
}

export function schemaUrl(slug: string): string {
  return canonicalUrl(schemaPath(slug));
}

export function ogImageUrl(): string {
  return `${SITE_ORIGIN}/og-image.png`;
}
