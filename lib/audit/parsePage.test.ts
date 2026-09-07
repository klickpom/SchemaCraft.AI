import { describe, expect, it } from 'vitest';
import { looksLikeHtml, parsePageHtml } from './parsePage';

const fixture = `<!doctype html><html lang="ar"><head>
<title>MADAR OS</title>
<meta name="description" content="SEO and GEO operating system for Arabic brands.">
<link rel="canonical" href="https://madar.bond/">
<meta property="og:title" content="MADAR OS">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"MADAR OS"}</script>
</head><body>
<h1>MADAR OS</h1>
<p>This product maps schema, crawl directives, and answer-engine eligibility for a public website.</p>
</body></html>`;

describe('parsePageHtml', () => {
  it('extracts title, canonical, json-ld type, and h1 from a real HTML fixture', () => {
    const page = parsePageHtml(fixture);
    expect(page.title).toBe('MADAR OS');
    expect(page.canonicalUrl).toBe('https://madar.bond/');
    expect(page.htmlLang).toBe('ar');
    expect(page.h1Tags).toEqual(['MADAR OS']);
    expect(page.schemaTypesDetected).toContain('SoftwareApplication');
    expect(page.ogTitle).toBe('MADAR OS');
    expect(page.leadParagraph).toMatch(/schema/i);
  });
});

describe('looksLikeHtml', () => {
  it('detects an HTML document served at llms.txt', () => {
    expect(looksLikeHtml('<!DOCTYPE html><html lang="ar">')).toBe(true);
    expect(looksLikeHtml('# SchemaCraft.AI\n> audit product')).toBe(false);
  });
});
