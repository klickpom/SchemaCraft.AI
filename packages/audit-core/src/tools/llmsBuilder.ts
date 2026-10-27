export interface LlmsLink {
  title: string;
  url: string;
  note: string;
}

export interface LlmsSection {
  name: string;
  links: LlmsLink[];
}

export interface LlmsDoc {
  name: string;
  summary: string;
  details: string;
  sections: LlmsSection[];
}

const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Format defined at https://llmstxt.org/: H1 name, blockquote summary, free text, then H2 sections of link lists. */
export function buildLlmsTxt(doc: LlmsDoc): string {
  const out: string[] = [`# ${oneLine(doc.name) || 'Site name'}`];
  if (oneLine(doc.summary)) out.push('', `> ${oneLine(doc.summary)}`);
  if (doc.details.trim()) out.push('', doc.details.trim());
  for (const section of doc.sections) {
    const links = section.links.filter((l) => l.url.trim());
    if (!oneLine(section.name) || links.length === 0) continue;
    out.push('', `## ${oneLine(section.name)}`, '');
    links.forEach((l) => {
      const title = oneLine(l.title) || l.url.trim();
      out.push(`- [${title.replace(/[[\]]/g, '')}](${l.url.trim()})${oneLine(l.note) ? `: ${oneLine(l.note)}` : ''}`);
    });
  }
  return `${out.join('\n')}\n`;
}

export function lintLlms(doc: LlmsDoc): string[] {
  const issues: string[] = [];
  if (!oneLine(doc.name)) issues.push('name');
  if (!oneLine(doc.summary)) issues.push('summary');
  const links = doc.sections.flatMap((s) => s.links).filter((l) => l.url.trim());
  if (links.length === 0) issues.push('links');
  links.forEach((l) => {
    if (!/^https?:\/\//i.test(l.url.trim())) issues.push(`relative:${l.url.trim()}`);
  });
  return issues;
}

export function titleFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const slug = pathname.split('/').filter(Boolean).pop();
    if (!slug) return 'Home';
    const words = decodeURIComponent(slug).replace(/\.(html?|php)$/i, '').replace(/[-_]+/g, ' ').trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
  } catch {
    return url;
  }
}

/** Groups sitemap URLs by their first path segment into a starting draft the user then edits. */
export function draftSections(urls: string[], max = 30): LlmsSection[] {
  const groups = new Map<string, LlmsLink[]>();
  const seen = new Set<string>();
  for (const raw of urls) {
    if (seen.size >= max) break;
    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      continue;
    }
    if (seen.has(parsed.href)) continue;
    seen.add(parsed.href);
    const segment = parsed.pathname.split('/').filter(Boolean)[0];
    const key = segment && parsed.pathname.split('/').filter(Boolean).length > 1 ? segment : 'Pages';
    const name = key === 'Pages' ? 'Pages' : titleFromUrl(`https://x/${key}`);
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name)!.push({ title: titleFromUrl(parsed.href), url: parsed.href, note: '' });
  }
  return [...groups.entries()].map(([name, links]) => ({ name, links }));
}

export function sitemapLocs(xml: string): { isIndex: boolean; urls: string[] } {
  const urls = [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\s\]]+)/gi)].map((m) => m[1].replace(/&amp;/g, '&'));
  return { isIndex: /<sitemapindex[\s>]/i.test(xml), urls };
}

export function pageMeta(html: string): { title: string | null; description: string | null; siteName: string | null } {
  const attr = (name: string) => {
    const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*>`, 'i');
    const tag = html.match(re)?.[0];
    return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() || null;
  };
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || null;
  return { title, description: attr('description') || attr('og:description'), siteName: attr('og:site_name') };
}
