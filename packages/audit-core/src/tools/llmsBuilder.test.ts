import { describe, expect, it } from 'vitest';
import { buildLlmsTxt, draftSections, lintLlms, pageMeta, sitemapLocs, titleFromUrl } from './llmsBuilder';

describe('llms.txt builder', () => {
  it('follows the llmstxt.org structure', () => {
    const txt = buildLlmsTxt({
      name: 'Acme',
      summary: 'Acme makes  trail shoes.',
      details: 'Ships worldwide.',
      sections: [
        { name: 'Docs', links: [{ title: 'Sizing [guide]', url: 'https://acme.test/sizing/', note: 'How to pick a size' }, { title: '', url: '', note: '' }] },
        { name: 'Empty', links: [] },
      ],
    });
    expect(txt).toBe('# Acme\n\n> Acme makes trail shoes.\n\nShips worldwide.\n\n## Docs\n\n- [Sizing guide](https://acme.test/sizing/): How to pick a size\n');
  });

  it('lints missing fields and relative links', () => {
    expect(lintLlms({ name: '', summary: '', details: '', sections: [] })).toEqual(['name', 'summary', 'links']);
    expect(lintLlms({ name: 'A', summary: 'B', details: '', sections: [{ name: 'S', links: [{ title: 'x', url: '/x', note: '' }] }] })).toEqual(['relative:/x']);
  });

  it('drafts sections from sitemap URLs', () => {
    const sections = draftSections(['https://a.test/', 'https://a.test/pricing/', 'https://a.test/blog/first-post/', 'https://a.test/blog/second_post', 'https://a.test/blog/first-post/']);
    expect(sections.map((s) => s.name)).toEqual(['Pages', 'Blog']);
    expect(sections[1].links.map((l) => l.title)).toEqual(['First post', 'Second post']);
    expect(titleFromUrl('https://a.test/')).toBe('Home');
  });

  it('extracts sitemap locs and detects sitemap indexes', () => {
    expect(sitemapLocs('<urlset><url><loc>https://a.test/x?a=1&amp;b=2</loc></url><url><loc><![CDATA[https://a.test/y]]></loc></url></urlset>'))
      .toEqual({ isIndex: false, urls: ['https://a.test/x?a=1&b=2', 'https://a.test/y'] });
    expect(sitemapLocs('<sitemapindex><sitemap><loc>https://a.test/s1.xml</loc></sitemap></sitemapindex>').isIndex).toBe(true);
  });

  it('reads page meta', () => {
    const meta = pageMeta('<title> Acme | Shoes </title><meta property="og:site_name" content="Acme"><meta name="description" content="Trail shoes.">');
    expect(meta).toEqual({ title: 'Acme | Shoes', description: 'Trail shoes.', siteName: 'Acme' });
  });
});
