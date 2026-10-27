import { describe, expect, it } from 'vitest';
import { buildRobotsTxt, normalizePaths, presetBlocked } from './robotsBuilder';
import { evaluateRobots, parseRobots } from '../audit/robots';

describe('robots builder', () => {
  it('blocks training crawlers but keeps AI search crawlers allowed', () => {
    const txt = buildRobotsTxt({ blocked: presetBlocked('search-not-training'), disallowPaths: ['/admin/'], sitemapUrl: 'https://a.test/sitemap.xml' });
    const parsed = parseRobots(txt);
    expect(evaluateRobots(parsed, 'GPTBot', '/').allowed).toBe(false);
    expect(evaluateRobots(parsed, 'ClaudeBot', '/blog/').allowed).toBe(false);
    expect(evaluateRobots(parsed, 'OAI-SearchBot', '/blog/').allowed).toBe(true);
    expect(evaluateRobots(parsed, 'PerplexityBot', '/').allowed).toBe(true);
    expect(evaluateRobots(parsed, 'Googlebot', '/admin/x').allowed).toBe(false);
    expect(evaluateRobots(parsed, 'OAI-SearchBot', '/admin/x').allowed).toBe(false);
    expect(txt).toContain('Sitemap: https://a.test/sitemap.xml');
  });

  it('allow-all produces a single permissive group', () => {
    const txt = buildRobotsTxt({ blocked: presetBlocked('allow-all'), disallowPaths: [], sitemapUrl: null });
    expect(txt).toBe('User-agent: *\nAllow: /\n');
  });

  it('block-ai keeps Googlebot and Bingbot', () => {
    const parsed = parseRobots(buildRobotsTxt({ blocked: presetBlocked('block-ai'), disallowPaths: [], sitemapUrl: null }));
    expect(evaluateRobots(parsed, 'Googlebot', '/').allowed).toBe(true);
    expect(evaluateRobots(parsed, 'Bingbot', '/').allowed).toBe(true);
    expect(evaluateRobots(parsed, 'OAI-SearchBot', '/').allowed).toBe(false);
  });

  it('normalizes path input', () => {
    expect(normalizePaths('admin/\n/cart/, /cart/\n\n*.pdf$')).toEqual(['/admin/', '/cart/', '*.pdf$']);
  });
});
