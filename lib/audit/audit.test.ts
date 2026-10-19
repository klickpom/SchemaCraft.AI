import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildReport } from './engine';
import { countQuantifiedStatements, parsePage } from './html';
import { evaluateRobots, parseRobots } from './robots';
import { analyzeSchema } from './schema';
import { TestParser } from './testParser';
import type { AuditReport, Category, ServerPayload } from './types';

const CATEGORY_KEYS: Record<Category, keyof AuditReport['categoryScores']> = {
  technical: 'technicalSEO',
  crawlability: 'crawlability',
  content: 'contentAnswerability',
  entity: 'entitySchema',
  ai_readiness: 'aiSearchReadiness',
};

const GOOD_HTML = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Acme Analytics — Privacy-first product analytics for SaaS teams</title>
<meta name="description" content="Acme Analytics is a privacy-first product analytics tool that shows SaaS teams which features drive retention, without cookies or personal data.">
<link rel="canonical" href="https://acme.example/">
<link rel="icon" href="/favicon.ico">
<meta property="og:title" content="Acme Analytics"><meta property="og:description" content="Privacy-first product analytics.">
<meta property="og:image" content="https://acme.example/og.png"><meta property="og:site_name" content="Acme Analytics">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
 {"@type":"Organization","@id":"https://acme.example/#org","name":"Acme Analytics","url":"https://acme.example/","logo":"https://acme.example/logo.png","sameAs":["https://www.linkedin.com/company/acme","https://github.com/acme"]},
 {"@type":"WebSite","@id":"https://acme.example/#website","name":"Acme Analytics","url":"https://acme.example/","publisher":{"@id":"https://acme.example/#org"}}
]}</script>
</head><body><header><nav><a href="/features/">Features</a><a href="/pricing/">Pricing</a><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a></nav></header>
<main><h1>Privacy-first product analytics</h1>
<p>Acme Analytics is a product analytics platform that helps SaaS teams understand which features drive retention. It runs without cookies, stores no personal data, and installs with one script tag in under 5 minutes.</p>
<h2>What does Acme Analytics measure?</h2><p>${'Acme tracks feature adoption, activation funnels and retention cohorts across 30 days, 90 days and 12 months. '.repeat(12)}</p>
<ul><li>Feature adoption</li><li>Funnels</li><li>Retention cohorts</li></ul>
<h2>How much does it cost?</h2><p>${'Plans start at $19 per month for 10,000 events and scale to 5 million events. '.repeat(10)}</p>
<table><tr><th>Plan</th><th>Price</th></tr><tr><td>Starter</td><td>$19</td></tr></table>
<h2>How do I install it?</h2><ol><li>Create an account</li><li>Add the script</li><li>Open the dashboard</li></ol>
<p>${'Teams at 1,200 companies use Acme to cut churn by 18% on average within 6 months. '.repeat(8)}</p>
</main><footer><a href="/terms/">Terms</a><a href="https://www.linkedin.com/company/acme">LinkedIn</a></footer></body></html>`;

function payload(overrides: Partial<ServerPayload> = {}): ServerPayload {
  return {
    ok: true,
    version: '2.0',
    requestedUrl: 'https://acme.example/',
    finalUrl: 'https://acme.example/',
    status: 200,
    redirects: [],
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'content-encoding': 'br',
      'strict-transport-security': 'max-age=31536000',
      'x-content-type-options': 'nosniff',
    },
    html: GOOD_HTML,
    htmlBytes: GOOD_HTML.length,
    fetch: { uaMode: 'standard', firstStatus: 200, ttfbMs: 220, totalMs: 300, httpVersion: '2', certExpiry: '2099-01-01T00:00:00+00:00' },
    robotsTxt: 'User-agent: *\nAllow: /\n\nSitemap: https://acme.example/sitemap.xml\n',
    robotsStatus: 200,
    sitemapXml: '<urlset><url><loc>https://acme.example/</loc></url></urlset>',
    sitemapUrl: 'https://acme.example/sitemap.xml',
    sitemapStatus: 200,
    llmsTxt: '# Acme Analytics\n\n> Privacy-first product analytics.\n\n## Docs\n- [Install](https://acme.example/docs/)\n',
    llmsStatus: 200,
    llmsContentType: 'text/plain',
    probes: {
      bots: ['googlebot', 'bingbot', 'oai-searchbot', 'gptbot', 'chatgpt-user', 'claudebot', 'perplexitybot'].map((id) => ({
        id, status: 200, error: null, bytes: 20000, ms: 200, challenge: null, title: 'Acme', location: null,
      })),
      httpVariant: { url: 'http://acme.example/', status: 301, error: null, location: 'https://acme.example/' },
      notFound: { url: 'https://acme.example/schemacraft-404-check-abcd/', status: 404, error: null, location: null, title: 'Not found' },
    },
    ...overrides,
  };
}

const build = (p: ServerPayload | null, url = 'https://acme.example/') => buildReport(url, p, { Parser: TestParser, id: 'TEST01', now: new Date('2026-10-19T00:00:00Z') });

function assertConsistent(report: AuditReport) {
  if (report.failure) {
    expect(report.overallScore).toBeNull();
    expect(Object.values(report.categoryScores).every((v) => v === null)).toBe(true);
    expect(report.checks).toHaveLength(0);
    return;
  }
  for (const check of report.checks) {
    if (check.status === 'pass' || check.status === 'warn' || check.status === 'fail') {
      expect(check.weight, check.id).toBeGreaterThan(0);
    } else {
      expect(check.weight, check.id).toBe(0);
    }
    expect(check.detail, check.id).not.toBe('');
    if (check.status === 'warn' || check.status === 'fail') expect(check.fix, check.id).not.toBe('');
  }
  (Object.keys(CATEGORY_KEYS) as Category[]).forEach((category) => {
    const score = report.categoryScores[CATEGORY_KEYS[category]];
    const scored = report.checks.filter((c) => c.category === category && c.weight > 0);
    const deductions = scored.filter((c) => c.status === 'warn' || c.status === 'fail');
    if (scored.length === 0) expect(score, category).toBeNull();
    else if (score === 100) expect(deductions, category).toHaveLength(0);
    else expect(deductions.length, `${category} is ${score} but has no visible deduction`).toBeGreaterThan(0);
  });
  if (report.overallScore !== null && report.uncappedScore !== null && report.overallScore < report.uncappedScore) {
    expect(report.scoreCap).not.toBeNull();
  }
  expect(new Set(report.checks.map((c) => c.id)).size).toBe(report.checks.length);
}

describe('robots.txt (RFC 9309)', () => {
  it('uses the longest matching rule and lets allow win ties', () => {
    const r = parseRobots('User-agent: *\nDisallow: /shop\nAllow: /shop/public\nDisallow: /a\nAllow: /a\n');
    expect(evaluateRobots(r, 'Googlebot', '/shop/cart').allowed).toBe(false);
    expect(evaluateRobots(r, 'Googlebot', '/shop/public/x').allowed).toBe(true);
    expect(evaluateRobots(r, 'Googlebot', '/a').allowed).toBe(true);
  });

  it('prefers the specific group over *, and merges repeated groups', () => {
    const r = parseRobots('User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: gptbot\nDisallow: /private\n');
    expect(evaluateRobots(r, 'OAI-SearchBot', '/').allowed).toBe(false);
    const gpt = evaluateRobots(r, 'GPTBot', '/');
    expect(gpt.allowed).toBe(true);
    expect(gpt.matchedBy).toBe('token');
    expect(evaluateRobots(r, 'GPTBot', '/private/x').allowed).toBe(false);
  });

  it('supports * and $ patterns and shared user-agent lines', () => {
    const r = parseRobots('User-agent: ClaudeBot\nUser-agent: PerplexityBot\nDisallow: /*.pdf$\nDisallow: /search?*q=\n');
    expect(evaluateRobots(r, 'ClaudeBot', '/files/a.pdf').allowed).toBe(false);
    expect(evaluateRobots(r, 'PerplexityBot', '/files/a.pdf?x=1').allowed).toBe(true);
    expect(evaluateRobots(r, 'PerplexityBot', '/search?page=2&q=x').allowed).toBe(false);
    expect(evaluateRobots(r, 'Googlebot', '/files/a.pdf').matchedBy).toBe('none');
  });

  it('treats an empty Disallow as allow-all and records unknown lines', () => {
    const r = parseRobots('User-agent: *\nDisallow:\nthis is not valid\nCrawl-delay: 5\n');
    expect(evaluateRobots(r, 'Bingbot', '/anything').allowed).toBe(true);
    expect(r.invalidLines).toHaveLength(1);
  });
});

describe('opening paragraph', () => {
  it('uses the lede in an article header and skips the site chrome', () => {
    const html = `<html><body><header><p>${'Free shipping on every order this week only. '.repeat(3)}</p></header><main><header><p class="eyebrow">Guide</p><h1>Title</h1><p>Acme is a tool that helps teams ship an audit with evidence instead of a guess.</p></header><article><p>This later paragraph is also long enough to be mistaken for the opening if the header lede is skipped.</p></article></main></body></html>`;
    const page = parsePage(html, 'https://acme.example/', TestParser);
    expect(page.leadParagraph?.startsWith('Acme is a tool')).toBe(true);
  });
});

describe('citable facts', () => {
  it('counts units, percents and durations, and ignores bare digits', () => {
    expect(countQuantifiedStatements('about 50 checks in 2026')).toBe(0);
    expect(countQuantifiedStatements('finishes within 20 seconds, limited to 20 audits per 10 minutes, and cut churn by 18%')).toBe(3);
    expect(countQuantifiedStatements('22 ms and 76 KB, used 3 times')).toBe(3);
    expect(countQuantifiedStatements('Google stops reading robots.txt after 500 KiB')).toBe(1);
    expect(countQuantifiedStatements('بحد 20 فحصاً كل 10 دقائق وخلال 20 ثانية وعلى مدى 3 أيام')).toBe(3);
  });
});

describe('JSON-LD validation', () => {
  it('flags missing required Product properties but ignores variant/url stubs', () => {
    const analysis = analyzeSchema([
      { raw: '', error: null, data: { '@context': 'https://schema.org', '@type': 'ProductGroup', name: 'Runner', offers: { '@type': 'Offer', price: '98', priceCurrency: 'USD' }, hasVariant: [{ '@type': 'Product', url: 'https://x.example/?size=8' }] } },
      { raw: '', error: null, data: { '@context': 'https://schema.org', '@type': 'Product', name: 'Bare product' } },
    ]);
    const required = analysis.problems.filter((p) => p.level === 'required');
    expect(required).toEqual([{ type: 'Product', level: 'required', property: 'offers or review or aggregateRating' }]);
  });

  it('counts parse errors and does not treat them as nodes', () => {
    const analysis = analyzeSchema([{ raw: '{bad', error: 'Unexpected token', data: null }]);
    expect(analysis.parseErrors).toHaveLength(1);
    expect(analysis.nodes).toHaveLength(0);
  });
});

describe('audit engine', () => {
  it('gives no score at all when the page could not be fetched', () => {
    for (const p of [null, { ok: false, error: 'timeout' }, { ok: false, error: 'dns' }] as (ServerPayload | null)[]) {
      const report = build(p);
      expect(report.failure).not.toBeNull();
      assertConsistent(report);
    }
  });

  it('reports bot protection instead of scoring a 403 or a challenge page', () => {
    const blocked = build(payload({ status: 403, html: '<html><body>Access denied</body></html>' }));
    expect(blocked.failure?.code).toBe('bot_protection');
    const interstitial = build(payload({ html: '<html><head><meta http-equiv="refresh" content="5; URL=\'/?bm-verify=AAQ\'"></head><body></body></html>' }));
    expect(interstitial.failure?.code).toBe('bot_protection');
    assertConsistent(interstitial);
  });

  it('does not deduct points when a software app has no real reviews', () => {
    const html = GOOD_HTML.replace(
      '</head>',
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"Acme","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script></head>',
    );
    const report = build(payload({ html }));
    assertConsistent(report);
    expect(report.checks.find((c) => c.id === 'schema-properties')?.status).toBe('pass');
    expect(report.checks.find((c) => c.id === 'schema-review-stars')?.status).toBe('info');
    expect(report.checks.find((c) => c.id === 'schema-review-stars')?.weight).toBe(0);
  });

  it('scores a well-built page highly with every number explained', () => {
    const report = build(payload());
    assertConsistent(report);
    expect(report.failure).toBeNull();
    expect(report.overallScore).toBeGreaterThanOrEqual(85);
    expect(report.scoreCap).toBeNull();
    expect(report.summary.siteName).toBe('Acme Analytics');
    expect(report.botMatrix.find((b) => b.userAgent === 'OAI-SearchBot')?.robots).toBe('allowed');
  });

  it('caps the score when the page is noindex', () => {
    const report = build(payload({ html: GOOD_HTML.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex">') }));
    assertConsistent(report);
    expect(report.checks.find((c) => c.id === 'indexability')?.status).toBe('fail');
    expect(report.overallScore).toBeLessThanOrEqual(40);
    expect(report.scoreCap?.cap).toBe(40);
  });

  it('caps the score when robots.txt blocks Googlebot', () => {
    const report = build(payload({ robotsTxt: 'User-agent: *\nDisallow: /\n' }));
    assertConsistent(report);
    expect(report.checks.find((c) => c.id === 'robots-googlebot')?.status).toBe('fail');
    expect(report.checks.find((c) => c.id === 'ai-oai-searchbot')?.status).toBe('fail');
    expect(report.overallScore).toBeLessThanOrEqual(40);
  });

  it('treats a blocked training crawler as policy, not a penalty', () => {
    const open = build(payload());
    const noTraining = build(payload({ robotsTxt: 'User-agent: GPTBot\nDisallow: /\n\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: *\nAllow: /\n' }));
    assertConsistent(noTraining);
    expect(noTraining.checks.find((c) => c.id === 'ai-training-policy')?.status).toBe('info');
    expect(noTraining.overallScore).toBe(open.overallScore);
  });

  it('flags JavaScript-only pages and does not double-penalise content', () => {
    const shell = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>App</title><script type="module" src="/assets/index.js"></script></head><body><div id="root"></div><noscript>You need to enable JavaScript to run this app.</noscript></body></html>';
    const report = build(payload({ html: shell, htmlBytes: shell.length }));
    assertConsistent(report);
    expect(report.checks.find((c) => c.id === 'ai-javascript')?.status).toBe('fail');
    expect(report.checks.find((c) => c.id === 'content-depth')?.status).toBe('info');
    expect(report.overallScore).toBeLessThanOrEqual(50);
  });

  it('marks checks without data as not assessed (v1 payload without probes)', () => {
    const report = build(payload({ probes: undefined, fetch: undefined, llmsStatus: undefined, llmsTxt: undefined }));
    assertConsistent(report);
    const na = report.checks.filter((c) => c.status === 'not_assessed').map((c) => c.id);
    expect(na).toEqual(expect.arrayContaining(['soft-404', 'ttfb']));
  });

  const fixtureDir = process.env.SC_AUDIT_FIXTURES || '';
  it.skipIf(!fixtureDir || !existsSync(fixtureDir))('stays consistent on recorded real-site payloads (SC_AUDIT_FIXTURES)', () => {
    for (const file of readdirSync(fixtureDir)) {
      const { url, payload: recorded } = JSON.parse(readFileSync(`${fixtureDir}/${file}`, 'utf8'));
      assertConsistent(build(recorded, url));
    }
  });
});
