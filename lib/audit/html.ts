/**
 * Extracts crawler-visible facts from raw HTML (no JavaScript execution),
 * which is what Googlebot's first wave and most AI crawlers receive.
 */

export interface Heading {
  level: number;
  text: string;
}

export interface JsonLdBlock {
  raw: string;
  data: unknown | null;
  error: string | null;
}

export interface PageFacts {
  lang: string | null;
  titles: string[];
  title: string | null;
  metaDescriptions: string[];
  metaDescription: string | null;
  metaRobots: string[];
  canonicals: string[];
  viewport: string | null;
  charset: string | null;
  metaRefresh: string | null;
  og: Record<string, string>;
  twitter: Record<string, string>;
  hreflang: { lang: string; href: string }[];
  hasFavicon: boolean;
  headings: Heading[];
  h1: string[];
  text: string;
  wordCount: number;
  leadParagraph: string | null;
  paragraphCount: number;
  listCount: number;
  tableCount: number;
  detailsCount: number;
  images: { total: number; missingAlt: number; missingDimensions: number; lazy: number; samplesMissingAlt: string[] };
  links: {
    internal: number;
    external: number;
    nofollow: number;
    emptyText: number;
    jsOnly: number;
    trust: { about: boolean; contact: boolean; privacy: boolean; terms: boolean };
    social: string[];
    internalSamples: { href: string; text: string }[];
  };
  scripts: { total: number; external: number; blockingInHead: number; inlineBytes: number };
  stylesheets: number;
  jsonLd: JsonLdBlock[];
  microdataItems: number;
  rdfaItems: number;
  spaRoot: string | null;
  frameworkHints: string[];
  noscriptText: string;
  mixedContent: string[];
  dates: { published: string | null; modified: string | null; timeElements: number };
  author: string | null;
  hasArticleElement: boolean;
  hasMainElement: boolean;
  questionHeadings: string[];
  dataNosnippetCount: number;
  priceSignals: boolean;
  cartSignals: boolean;
  addressSignals: boolean;
  telLinks: number;
  numbersInText: number;
}

const QUESTION_START = /^(how|what|why|who|when|where|which|is|are|can|do|does|should|will|could|هل|كيف|ما|ماذا|لماذا|متى|أين|من|كم|ايه|إيه|ليه)(?=[\s,:،]|$)/i;
const TRUST_PATTERNS = {
  about: /\/(about|about-us|company|who-we-are|من-نحن)(\/|$|\.)|^(about|about us|من نحن|عن الشركة|عنا)$/i,
  contact: /\/(contact|contact-us|support|اتصل)(\/|$|\.)|^(contact|contact us|اتصل بنا|تواصل معنا)$/i,
  privacy: /\/(privacy|privacy-policy)(\/|$|\.)|^(privacy|privacy policy|سياسة الخصوصية|الخصوصية)$/i,
  terms: /\/(terms|terms-of-service|tos|terms-and-conditions)(\/|$|\.)|^(terms|terms of service|الشروط|الشروط والأحكام)$/i,
};

const SOCIAL_HOSTS = [
  'twitter.com', 'x.com', 'linkedin.com', 'facebook.com', 'instagram.com', 'youtube.com', 'github.com',
  'tiktok.com', 'wikipedia.org', 'wikidata.org', 'crunchbase.com', 'threads.net', 'pinterest.com', 'g2.com', 'trustpilot.com',
];

function clean(text: string | null | undefined): string {
  return (text || '').replace(/\s+/g, ' ').trim();
}

export function countWords(text: string): number {
  if (!text) return 0;
  const cjk = (text.match(/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/g) || []).length;
  const spaced = text.replace(/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return spaced + Math.round(cjk / 1.5);
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).host.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

function resolve(href: string, base: string): string | null {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

/**
 * A number sitting next to a unit, percent, duration or size.
 * Bare digits ("50 checks", years, IDs) do not count — they are not a citable measurement.
 */
const QUANTIFIED_STATEMENT =
  /\b\d+(?:[.,]\d+)?\s?(?:%|٪|percent|milliseconds?|seconds?|secs?|minutes?|mins?|hours?|hrs?|days?|weeks?|months?|years?|ms|kb|mb|gb|kib|x\b|times|users|customers|مللي ثانية|ثواني|ثوانٍ|ثانية|دقائق|دقيقة|ساعات|ساعة|أيام|يوم|أسابيع|أسبوع|أشهر|شهر|سنوات|سنة)/gi;

export function countQuantifiedStatements(text: string): number {
  return (text.match(QUANTIFIED_STATEMENT) || []).length;
}

type DomParserCtor = new () => { parseFromString(html: string, type: string): Document };

export function parsePage(html: string, pageUrl: string, Parser?: DomParserCtor): PageFacts {
  const Ctor = Parser || (typeof DOMParser !== 'undefined' ? (DOMParser as unknown as DomParserCtor) : null);
  if (!Ctor) throw new Error('No DOMParser available');
  const doc = new Ctor().parseFromString(html, 'text/html');
  const head = doc.querySelector('head');
  const body = doc.querySelector('body') || doc.documentElement;
  const pageHost = hostOf(pageUrl);

  const metaByName = (name: string) =>
    Array.from(doc.querySelectorAll('meta'))
      .filter((m) => (m.getAttribute('name') || '').toLowerCase() === name)
      .map((m) => clean(m.getAttribute('content')))
      .filter(Boolean);

  const titles = Array.from(doc.querySelectorAll('title'))
    .filter((t) => !t.closest('svg'))
    .map((t) => clean(t.textContent))
    .filter(Boolean);
  const metaDescriptions = metaByName('description');
  const metaRobots = [...metaByName('robots'), ...metaByName('googlebot')];

  const canonicals = Array.from(doc.querySelectorAll('link'))
    .filter((l) => (l.getAttribute('rel') || '').toLowerCase().split(/\s+/).includes('canonical'))
    .map((l) => clean(l.getAttribute('href')))
    .filter(Boolean);

  const og: Record<string, string> = {};
  const twitter: Record<string, string> = {};
  doc.querySelectorAll('meta').forEach((m) => {
    const prop = (m.getAttribute('property') || m.getAttribute('name') || '').toLowerCase();
    const content = clean(m.getAttribute('content'));
    if (!content) return;
    if (prop.startsWith('og:') && !og[prop.slice(3)]) og[prop.slice(3)] = content;
    if (prop.startsWith('twitter:') && !twitter[prop.slice(8)]) twitter[prop.slice(8)] = content;
    if (prop.startsWith('article:') && !og[prop]) og[prop] = content;
  });

  const charsetMeta = doc.querySelector('meta[charset]')?.getAttribute('charset') || null;
  const httpEquivCt = Array.from(doc.querySelectorAll('meta')).find(
    (m) => (m.getAttribute('http-equiv') || '').toLowerCase() === 'content-type',
  );
  const charset = charsetMeta || (httpEquivCt ? (httpEquivCt.getAttribute('content') || '').match(/charset=([^;\s]+)/i)?.[1] || null : null);
  const refresh = Array.from(doc.querySelectorAll('meta')).find(
    (m) => (m.getAttribute('http-equiv') || '').toLowerCase() === 'refresh',
  );

  const hreflang = Array.from(doc.querySelectorAll('link'))
    .filter((l) => (l.getAttribute('rel') || '').toLowerCase() === 'alternate' && l.getAttribute('hreflang'))
    .map((l) => ({ lang: clean(l.getAttribute('hreflang')), href: clean(l.getAttribute('href')) }));

  const hasFavicon = Array.from(doc.querySelectorAll('link')).some((l) =>
    (l.getAttribute('rel') || '').toLowerCase().split(/\s+/).some((r) => r === 'icon' || r === 'apple-touch-icon'),
  );

  const headings: Heading[] = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) => ({
    level: Number(h.tagName.substring(1)),
    text: clean(h.textContent).slice(0, 200),
  }));
  const h1 = headings.filter((h) => h.level === 1).map((h) => h.text);
  const questionHeadings = headings
    .filter((h) => h.level >= 2 && h.level <= 4 && h.text && (/[?؟]\s*$/.test(h.text) || QUESTION_START.test(h.text)))
    .map((h) => h.text);

  const scriptsAll = Array.from(doc.querySelectorAll('script'));
  const jsonLd: JsonLdBlock[] = scriptsAll
    .filter((s) => (s.getAttribute('type') || '').toLowerCase().trim() === 'application/ld+json')
    .map((s) => {
      const raw = (s.textContent || '').trim();
      try {
        return { raw, data: JSON.parse(raw), error: null };
      } catch (err) {
        return { raw, data: null, error: err instanceof Error ? err.message.slice(0, 160) : 'Invalid JSON' };
      }
    });

  const executable = scriptsAll.filter((s) => {
    const type = (s.getAttribute('type') || '').toLowerCase().trim();
    return !type || type === 'text/javascript' || type === 'module' || type === 'application/javascript';
  });
  const blockingInHead = head
    ? Array.from(head.querySelectorAll('script')).filter((s) => {
        const type = (s.getAttribute('type') || '').toLowerCase().trim();
        return s.getAttribute('src') && !s.hasAttribute('async') && !s.hasAttribute('defer') && type !== 'module' && (!type || type.includes('javascript'));
      }).length
    : 0;
  const inlineBytes = executable.filter((s) => !s.getAttribute('src')).reduce((sum, s) => sum + (s.textContent || '').length, 0);

  const stylesheets = Array.from(doc.querySelectorAll('link')).filter((l) =>
    (l.getAttribute('rel') || '').toLowerCase().split(/\s+/).includes('stylesheet'),
  ).length;

  const noscriptText = clean(Array.from(doc.querySelectorAll('noscript')).map((n) => n.textContent || '').join(' ')).slice(0, 400);

  const textRoot = body.cloneNode(true) as Element;
  textRoot.querySelectorAll('script, style, noscript, template, svg, iframe, object, canvas').forEach((n) => n.remove());
  const text = clean(textRoot.textContent);
  const wordCount = countWords(text);

  const contentRoot = (textRoot.querySelector('main') || textRoot.querySelector('article') || textRoot) as Element;
  let leadParagraph: string | null = null;
  for (const p of Array.from(contentRoot.querySelectorAll('p'))) {
    if (p.closest('nav, footer, aside, form, [role="navigation"], [aria-hidden="true"]')) continue;
    // Site chrome <header> is navigation. An article header (it contains the h1, or it sits inside main) holds the lede.
    const header = p.closest('header');
    if (header && !header.querySelector('h1') && !header.closest('main, article')) continue;
    const t = clean(p.textContent);
    if (t.length >= 60 && !/©|cookie|all rights reserved|جميع الحقوق/i.test(t)) {
      leadParagraph = t.slice(0, 600);
      break;
    }
  }
  const paragraphCount = Array.from(textRoot.querySelectorAll('p')).filter((p) => clean(p.textContent).length >= 40).length;
  const listCount = Array.from(textRoot.querySelectorAll('ul, ol')).filter(
    (l) => !l.closest('nav, header, footer') && l.querySelectorAll('li').length >= 3,
  ).length;
  const tableCount = Array.from(textRoot.querySelectorAll('table')).filter((t) => t.querySelectorAll('tr').length >= 2).length;
  const detailsCount = textRoot.querySelectorAll('details').length;

  const imgs = Array.from(doc.querySelectorAll('img'));
  const imagesMissingAlt = imgs.filter((img) => !img.hasAttribute('alt'));
  const images = {
    total: imgs.length,
    missingAlt: imagesMissingAlt.length,
    missingDimensions: imgs.filter((img) => !img.getAttribute('width') || !img.getAttribute('height')).length,
    lazy: imgs.filter((img) => (img.getAttribute('loading') || '').toLowerCase() === 'lazy').length,
    samplesMissingAlt: imagesMissingAlt
      .slice(0, 3)
      .map((img) => (img.getAttribute('src') || img.getAttribute('data-src') || '').slice(0, 120))
      .filter(Boolean),
  };

  const links: PageFacts['links'] = {
    internal: 0, external: 0, nofollow: 0, emptyText: 0, jsOnly: 0,
    trust: { about: false, contact: false, privacy: false, terms: false },
    social: [],
    internalSamples: [],
  };
  const seenInternal = new Set<string>();
  doc.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    const label = clean(a.textContent) || clean(a.getAttribute('aria-label')) || clean(a.getAttribute('title')) ||
      clean(Array.from(a.querySelectorAll('img')).map((i) => i.getAttribute('alt') || '').join(' '));
    if (!href || href.startsWith('#') || /^javascript:/i.test(href)) {
      if (/^javascript:/i.test(href) || (!href && a.getAttribute('onclick'))) links.jsOnly += 1;
      return;
    }
    if (/^(mailto|tel|sms|whatsapp):/i.test(href)) return;
    const abs = resolve(href, pageUrl);
    if (!abs) return;
    const host = hostOf(abs);
    if (host && pageHost && host === pageHost) {
      links.internal += 1;
      const key = abs.split('#')[0];
      if (!seenInternal.has(key) && label && label.length <= 60 && links.internalSamples.length < 12) {
        seenInternal.add(key);
        links.internalSamples.push({ href: key, text: label });
      }
    } else {
      links.external += 1;
      if (host && SOCIAL_HOSTS.some((s) => host === s || host.endsWith(`.${s}`))) {
        const profile = abs.split('?')[0].replace(/\/$/, '');
        const isShare = /\/(share|sharer|intent|hashtag)\b/i.test(profile);
        if (!isShare && !links.social.includes(profile) && links.social.length < 8) links.social.push(profile);
      }
    }
    if ((a.getAttribute('rel') || '').toLowerCase().includes('nofollow')) links.nofollow += 1;
    if (!label) links.emptyText += 1;
    let path = '';
    try {
      path = new URL(abs).pathname.toLowerCase();
    } catch {
      path = '';
    }
    const lowerLabel = label.toLowerCase();
    (Object.keys(TRUST_PATTERNS) as Array<keyof typeof TRUST_PATTERNS>).forEach((key) => {
      if (TRUST_PATTERNS[key].test(path) || TRUST_PATTERNS[key].test(lowerLabel)) links.trust[key] = true;
    });
  });

  const telLinks = Array.from(doc.querySelectorAll('a')).filter((a) => /^tel:/i.test(a.getAttribute('href') || '')).length;

  const spaCandidates = ['#root', '#__next', '#app', '#__nuxt', '[data-reactroot]', 'app-root', '#svelte', '#q-app'];
  let spaRoot: string | null = null;
  for (const selector of spaCandidates) {
    const el = doc.querySelector(selector);
    if (el) {
      spaRoot = selector;
      break;
    }
  }
  const frameworkHints: string[] = [];
  if (doc.getElementById('__NEXT_DATA__') || html.includes('/_next/static/')) frameworkHints.push('Next.js');
  if (html.includes('window.__NUXT__') || doc.getElementById('__nuxt')) frameworkHints.push('Nuxt');
  if (doc.querySelector('[ng-version]')) frameworkHints.push('Angular');
  if (html.includes('wp-content/') || html.includes('wp-includes/')) frameworkHints.push('WordPress');
  if (html.includes('cdn.shopify.com') || html.includes('Shopify.theme')) frameworkHints.push('Shopify');
  if (html.includes('static.wixstatic.com') || html.includes('wix.com')) frameworkHints.push('Wix');
  if (html.includes('squarespace.com')) frameworkHints.push('Squarespace');
  if (html.includes('webflow.com') || doc.querySelector('html[data-wf-site]')) frameworkHints.push('Webflow');
  if (/\/assets\/index-[\w-]+\.js/.test(html) || html.includes('/@vite/client')) frameworkHints.push('Vite SPA');

  const mixedContent: string[] = [];
  if (pageUrl.startsWith('https://')) {
    doc.querySelectorAll('img[src], script[src], iframe[src], audio[src], video[src], source[src], link[rel="stylesheet"][href]').forEach((el) => {
      const value = el.getAttribute('src') || el.getAttribute('href') || '';
      if (/^http:\/\//i.test(value) && mixedContent.length < 5) mixedContent.push(value.slice(0, 140));
    });
  }

  const timeElements = doc.querySelectorAll('time[datetime]').length;
  const published = og['article:published_time'] || metaByName('date')[0] || null;
  const modified = og['article:modified_time'] || og['updated_time'] || metaByName('last-modified')[0] || null;
  const author = metaByName('author')[0] ||
    clean(doc.querySelector('[rel="author"]')?.textContent) ||
    clean(doc.querySelector('[itemprop="author"]')?.textContent) || null;

  const visibleSample = text.slice(0, 20000);
  const priceSignals = /(?:[$€£¥₹]|USD|EUR|GBP|SAR|AED|EGP|ج\.م|ر\.س)\s?\d|\d[\d,.]*\s?(?:USD|EUR|SAR|AED|EGP|ريال|جنيه|درهم)/i.test(visibleSample) || !!og['price:amount'] || !!og['product:price:amount'];
  const cartSignals = /add to cart|add to bag|buy now|أضف إلى السلة|اشتر الآن/i.test(visibleSample) || !!doc.querySelector('form[action*="cart"], [name="add"], button[name="add-to-cart"]');
  const addressSignals = !!doc.querySelector('address') || /\b\d{1,5}\s+\w+\s+(street|st\.|road|rd\.|avenue|ave\.|blvd)\b/i.test(visibleSample) || /شارع|ميدان/.test(visibleSample);
  const numbersInText = countQuantifiedStatements(visibleSample);

  return {
    lang: clean(doc.documentElement.getAttribute('lang')) || null,
    titles,
    title: titles[0] || null,
    metaDescriptions,
    metaDescription: metaDescriptions[0] || null,
    metaRobots,
    canonicals,
    viewport: clean(Array.from(doc.querySelectorAll('meta')).find((m) => (m.getAttribute('name') || '').toLowerCase() === 'viewport')?.getAttribute('content')) || null,
    charset,
    metaRefresh: refresh ? clean(refresh.getAttribute('content')) : null,
    og,
    twitter,
    hreflang,
    hasFavicon,
    headings,
    h1,
    text,
    wordCount,
    leadParagraph,
    paragraphCount,
    listCount,
    tableCount,
    detailsCount,
    images,
    links,
    scripts: { total: executable.length, external: executable.filter((s) => s.getAttribute('src')).length, blockingInHead, inlineBytes },
    stylesheets,
    jsonLd,
    microdataItems: doc.querySelectorAll('[itemscope]').length,
    rdfaItems: doc.querySelectorAll('[typeof]').length,
    spaRoot,
    frameworkHints,
    noscriptText,
    mixedContent,
    dates: { published, modified, timeElements },
    author,
    hasArticleElement: !!doc.querySelector('article'),
    hasMainElement: !!doc.querySelector('main'),
    questionHeadings,
    dataNosnippetCount: doc.querySelectorAll('[data-nosnippet]').length,
    priceSignals,
    cartSignals,
    addressSignals,
    telLinks,
    numbersInText,
  };
}
