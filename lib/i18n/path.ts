import type { UiLang } from '@/lib/uiLang';

function splitHref(href: string): { path: string; query: string; hash: string } {
  const hashAt = href.indexOf('#');
  const hash = hashAt >= 0 ? href.slice(hashAt) : '';
  const beforeHash = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const queryAt = beforeHash.indexOf('?');
  const query = queryAt >= 0 ? beforeHash.slice(queryAt) : '';
  const path = queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash;
  return { path, query, hash };
}

function ensureSlash(path: string): string {
  if (path === '' || path === '/') return '/';
  return path.endsWith('/') ? path : `${path}/`;
}

/** Prefix an in-site href with /ar when the UI language is Arabic. External links stay as they are. */
export function withLang(href: string, lang: UiLang): string {
  if (lang !== 'ar' || !href) return href;
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  const { path, query, hash } = splitHref(href);
  if (path === '/ar' || path.startsWith('/ar/')) return href;
  const slashed = ensureSlash(path || '/');
  const prefixed = slashed === '/' ? '/ar/' : `/ar${slashed}`;
  return `${prefixed}${query}${hash}`;
}

/** The same page in the other language, keeping the query string and hash. */
export function swapLang(pathname: string, search = '', hash = ''): string {
  const slashed = ensureSlash(pathname || '/');
  const onAr = slashed === '/ar/' || slashed.startsWith('/ar/');
  const next = onAr ? ensureSlash(slashed.slice(3) || '/') : (slashed === '/' ? '/ar/' : `/ar${slashed}`);
  return `${next}${search}${hash}`;
}
