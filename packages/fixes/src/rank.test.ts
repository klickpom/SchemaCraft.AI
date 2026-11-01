import { buildReport } from '@schemacraft/audit-core/audit/engine';
import { TestParser } from '@schemacraft/audit-core/audit/testParser';
import type { ServerPayload } from '@schemacraft/audit-core/audit/types';
import { describe, expect, it } from 'vitest';
import { compareAudits, fillAnswers, rankFixes } from './rank';

const WORDS = 'Nile Dental welcomes families in Cairo and explains clear aligner visits in plain language. ';

const HTML = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nile Dental</title>
<meta name="description" content="Nile Dental welcomes families in Cairo.">
<link rel="canonical" href="https://nile.example/">
</head><body>
<main>
<h1>Nile Dental</h1>
<p>${WORDS.repeat(8)}</p>
</main>
</body></html>`;

function payload(robotsTxt: string): ServerPayload {
  return {
    ok: true,
    finalUrl: 'https://nile.example/',
    status: 200,
    redirects: [],
    headers: { 'content-type': 'text/html; charset=utf-8' },
    html: HTML,
    robotsTxt,
    robotsStatus: 200,
    probes: { bots: [] },
  };
}

const blocked = 'User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nDisallow: /\n';
const allowed = 'User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n';

function report(robotsTxt: string) {
  return buildReport('https://nile.example/', payload(robotsTxt), {
    Parser: TestParser,
    id: 'NILE01',
    now: new Date('2026-11-01T00:00:00Z'),
  });
}

describe('ranked copy-paste fixes', () => {
  it('writes a robots snippet for a blocked OAI-SearchBot using that host', () => {
    const ranked = rankFixes(report(blocked));
    const robots = ranked.drafts.find((draft) => draft.id === 'robots-allow');
    expect(robots).toBeTruthy();
    expect(robots?.artifact).toContain('nile.example');
    expect(robots?.artifact).toContain('User-agent: OAI-SearchBot');
    expect(robots?.artifact).toContain('Allow: /');
    expect(ranked.top.map((draft) => draft.id)).toContain('robots-allow');
    expect(robots?.why).not.toMatch(/\n/);
    expect(robots?.whyAr.length).toBeGreaterThan(0);
  });

  it('asks for a phone number instead of inventing one', () => {
    const ranked = rankFixes(report(blocked));
    const schema = ranked.drafts.find((draft) => draft.id === 'json-ld');
    expect(schema?.questions.map((question) => question.id)).toContain('phone');
    expect(schema?.artifact.toLowerCase()).not.toContain('telephone');
    expect(schema?.artifact).not.toMatch(/\+?\d[\d\s().-]{7,}/);
    const answered = fillAnswers(schema!, { phone: '01001234567' });
    expect(answered.artifact).toContain('01001234567');
    expect(answered.artifact).not.toContain('01009999999');
  });

  it('shows a re-fetch moving the blocked crawler from fail to pass', () => {
    const before = report(blocked);
    const after = report(allowed);
    expect(before.checks.find((check) => check.id === 'ai-oai-searchbot')?.status).toBe('fail');
    expect(after.checks.find((check) => check.id === 'ai-oai-searchbot')?.status).toBe('pass');
    const changes = compareAudits(before, after);
    const moved = changes.find((change) => change.id === 'ai-oai-searchbot');
    expect(moved).toMatchObject({ before: 'fail', after: 'pass' });
    const https = changes.find((change) => change.id === 'https');
    expect(https).toBeUndefined();
  });

  it('offers IndexNow as an optional copy of the ping body', () => {
    const step = rankFixes(report(blocked)).indexNow;
    expect(step?.optional).toBe(true);
    expect(step?.endpoint).toBe('https://api.indexnow.org/indexnow');
    const body = JSON.parse(step!.body) as { host: string; key: string; keyLocation: string; urlList: string[] };
    expect(body.host).toBe('nile.example');
    expect(body.keyLocation).toBe(`https://nile.example/${body.key}.txt`);
    expect(body.urlList).toEqual(['https://nile.example/']);
    expect(step?.note).toMatch(/Optional/);
    expect(step?.note).toMatch(/Google does not participate/);
    expect(step?.noteAr.length).toBeGreaterThan(0);
  });
});
