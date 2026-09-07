export interface ParsedPage {
  title: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  metaRobots: string | null;
  htmlLang: string | null;
  ogTitle: string | null;
  ogUrl: string | null;
  twitterCard: string | null;
  h1Tags: string[];
  h2Tags: string[];
  leadParagraph: string | null;
  hasQuestionHeadings: boolean;
  hasDefinitionPatterns: boolean;
  schemaTypesDetected: string[];
  rawJsonLd: unknown[];
  hreflangTags: { lang: string; href: string }[];
}

function attr(tag: string, name: string): string | null {
  const re = new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i');
  return re.exec(tag)?.[1]?.trim() || null;
}

function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function collectJsonLdTypes(node: unknown, into: string[]): void {
  if (!node || typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  if (obj['@type']) {
    const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
    for (const t of types) if (typeof t === 'string') into.push(t);
  }
  if (Array.isArray(obj['@graph'])) {
    for (const child of obj['@graph']) collectJsonLdTypes(child, into);
  }
}

function parseJsonLdBlocks(html: string): { raw: unknown[]; types: string[] } {
  const raw: unknown[] = [];
  const types: string[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    try {
      const json = JSON.parse(match[1].trim());
      raw.push(json);
      collectJsonLdTypes(json, types);
    } catch {
      /* invalid JSON-LD is recorded as empty parse by caller */
    }
  }
  return { raw, types: [...new Set(types)] };
}

function parseWithDom(html: string): ParsedPage {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const title = doc.querySelector('title')?.textContent?.trim() || null;
  const metaDescription = doc.querySelector('meta[name="description" i]')?.getAttribute('content')?.trim() || null;
  const canonicalUrl = doc.querySelector('link[rel="canonical" i]')?.getAttribute('href')?.trim() || null;
  const metaRobots = doc.querySelector('meta[name="robots" i]')?.getAttribute('content')?.trim() || null;
  const htmlLang = doc.documentElement.getAttribute('lang')?.trim() || null;
  const ogTitle = doc.querySelector('meta[property="og:title" i]')?.getAttribute('content')?.trim() || null;
  const ogUrl = doc.querySelector('meta[property="og:url" i]')?.getAttribute('content')?.trim() || null;
  const twitterCard = doc.querySelector('meta[name="twitter:card" i]')?.getAttribute('content')?.trim() || null;

  const h1Tags: string[] = [];
  doc.querySelectorAll('h1').forEach((el) => {
    const text = el.textContent?.trim();
    if (text && text.length > 1) h1Tags.push(text);
  });
  const h2Tags: string[] = [];
  let hasQuestionHeadings = false;
  doc.querySelectorAll('h2').forEach((el) => {
    const text = el.textContent?.trim();
    if (text && text.length > 1) {
      h2Tags.push(text);
      if (text.includes('?') || text.includes('؟') || /^(how|what|why|who|is|can|do|does|هل|كيف|ما|لماذا)/i.test(text)) {
        hasQuestionHeadings = true;
      }
    }
  });

  let leadParagraph: string | null = null;
  const paragraphs = doc.querySelectorAll('main p, article p, section p, p');
  for (const p of paragraphs) {
    const text = p.textContent?.trim();
    if (text && text.length > 30 && !text.includes('©') && !/cookie|privacy/i.test(text)) {
      leadParagraph = text.length > 300 ? text.slice(0, 300) : text;
      break;
    }
  }

  const hreflangTags: ParsedPage['hreflangTags'] = [];
  doc.querySelectorAll('link[rel="alternate" i][hreflang]').forEach((el) => {
    const lang = el.getAttribute('hreflang')?.trim();
    const href = el.getAttribute('href')?.trim();
    if (lang && href) hreflangTags.push({ lang, href });
  });

  const { raw, types } = parseJsonLdBlocks(html);
  return {
    title,
    metaDescription,
    canonicalUrl,
    metaRobots,
    htmlLang,
    ogTitle,
    ogUrl,
    twitterCard,
    h1Tags,
    h2Tags,
    leadParagraph,
    hasQuestionHeadings,
    hasDefinitionPatterns: leadParagraph ? /is a |are |defined as |يعتبر |هو |عبارة عن/i.test(leadParagraph) : false,
    schemaTypesDetected: types,
    rawJsonLd: raw,
    hreflangTags,
  };
}

function parseWithRegex(html: string): ParsedPage {
  const title = decode(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || '') || null;
  let metaDescription: string | null = null;
  let metaRobots: string | null = null;
  let ogTitle: string | null = null;
  let ogUrl: string | null = null;
  let twitterCard: string | null = null;
  const metaRe = /<meta\b[^>]*>/gi;
  let metaTag: RegExpExecArray | null;
  while ((metaTag = metaRe.exec(html))) {
    const tag = metaTag[0];
    const name = (attr(tag, 'name') || attr(tag, 'property') || '').toLowerCase();
    const content = attr(tag, 'content');
    if (!content) continue;
    if (name === 'description') metaDescription = content;
    if (name === 'robots') metaRobots = content;
    if (name === 'og:title') ogTitle = content;
    if (name === 'og:url') ogUrl = content;
    if (name === 'twitter:card') twitterCard = content;
  }

  const canonicalTag = /<link\b[^>]*rel=["']canonical["'][^>]*>/i.exec(html)?.[0]
    || /<link\b[^>]*rel=["']canonical["'][^>]*>/i.exec(html.replace(/rel=canonical/i, ''))?.[0];
  const canonicalMatch = /<link\b[^>]*>/gi;
  let canonicalUrl: string | null = null;
  let linkTag: RegExpExecArray | null;
  const hreflangTags: ParsedPage['hreflangTags'] = [];
  while ((linkTag = canonicalMatch.exec(html))) {
    const tag = linkTag[0];
    const rel = (attr(tag, 'rel') || '').toLowerCase();
    if (rel === 'canonical') canonicalUrl = attr(tag, 'href');
    if (rel === 'alternate') {
      const lang = attr(tag, 'hreflang');
      const href = attr(tag, 'href');
      if (lang && href) hreflangTags.push({ lang, href });
    }
  }

  const htmlLang = /<html\b[^>]*lang=["']([^"']+)["']/i.exec(html)?.[1] || null;
  const h1Tags = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((m) => decode(m[1].replace(/<[^>]+>/g, '')))
    .filter((t) => t.length > 1);
  const h2Tags = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((m) => decode(m[1].replace(/<[^>]+>/g, '')))
    .filter((t) => t.length > 1);
  const hasQuestionHeadings = h2Tags.some(
    (t) => t.includes('?') || t.includes('؟') || /^(how|what|why|who|is|can|do|does|هل|كيف|ما|لماذا)/i.test(t)
  );

  let leadParagraph: string | null = null;
  for (const m of html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = decode(m[1].replace(/<[^>]+>/g, ''));
    if (text.length > 30 && !text.includes('©') && !/cookie|privacy/i.test(text)) {
      leadParagraph = text.length > 300 ? text.slice(0, 300) : text;
      break;
    }
  }

  const { raw, types } = parseJsonLdBlocks(html);
  void canonicalTag;
  return {
    title,
    metaDescription,
    canonicalUrl,
    metaRobots,
    htmlLang,
    ogTitle,
    ogUrl,
    twitterCard,
    h1Tags,
    h2Tags,
    leadParagraph,
    hasQuestionHeadings,
    hasDefinitionPatterns: leadParagraph ? /is a |are |defined as |يعتبر |هو |عبارة عن/i.test(leadParagraph) : false,
    schemaTypesDetected: types,
    rawJsonLd: raw,
    hreflangTags,
  };
}

export function parsePageHtml(html: string): ParsedPage {
  if (typeof DOMParser !== 'undefined') {
    try {
      return parseWithDom(html);
    } catch {
      return parseWithRegex(html);
    }
  }
  return parseWithRegex(html);
}

export function looksLikeHtml(body: string): boolean {
  const slice = body.slice(0, 200).toLowerCase();
  return slice.includes('<html') || slice.includes('<!doctype html');
}
