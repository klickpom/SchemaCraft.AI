import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { evaluateEvidence, type RawEvidence } from '@/lib/auditEngine';
import { looksLikeHtml, parsePageHtml } from '@/lib/audit/parsePage';
import { assertAuditConsistency, countCritical, countFindings, countPassed, scoresFromChecks } from '@/lib/audit/scoring';

const FIXTURE = '_madar_api.json';

describe.skipIf(!existsSync(FIXTURE))('live madar.bond payload', () => {
  it('produces a professional inspected report from the Hostinger PHP fetch', () => {
    const payload = JSON.parse(readFileSync(FIXTURE, 'utf8'));
    expect(payload.ok).toBe(true);
    expect(payload.status).toBe(200);
    expect(payload.html.length).toBeGreaterThan(1000);

    const parsed = parsePageHtml(payload.html);
    const robotsTxt = payload.robotsTxt || '';
    const robotsFetched = robotsTxt.toLowerCase().includes('user-agent');
    const sitemapXml = payload.sitemapXml || '';
    const llms = payload.llmsTxt || '';

    const raw: RawEvidence = {
      httpStatus: payload.status,
      robotsTxtFound: robotsFetched,
      robotsTxtContent: robotsTxt,
      sitemapFound: sitemapXml.includes('<urlset') || sitemapXml.includes('<sitemapindex'),
      sitemapUrl: payload.sitemapUrl || '',
      canonicalUrl: parsed.canonicalUrl,
      metaRobots: parsed.metaRobots,
      xRobotsTag: payload.headers?.['x-robots-tag'] || null,
      title: parsed.title,
      metaDescription: parsed.metaDescription,
      h1Tags: parsed.h1Tags,
      h2Tags: parsed.h2Tags,
      leadParagraph: parsed.leadParagraph,
      hasQuestionHeadings: parsed.hasQuestionHeadings,
      hasDefinitionPatterns: parsed.hasDefinitionPatterns,
      schemaTypesDetected: parsed.schemaTypesDetected,
      rawJsonLd: parsed.rawJsonLd,
      oaiSearchBotDirective: 'not_specified',
      oaiAdsBotDirective: 'not_specified',
      googleExtendedDirective: 'not_specified',
      googlebotDirective: 'not_specified',
      perplexityBotDirective: 'not_specified',
      potentialBotBarrier: false,
      detectedSiteType: 'general',
      htmlFetched: true,
      robotsFetched,
      fetchMode: 'server',
      finalUrl: payload.finalUrl,
      htmlLang: parsed.htmlLang,
      ogTitle: parsed.ogTitle,
      llmsTxtFound: true,
      llmsTxtContent: llms,
      llmsTxtContentType: payload.llmsContentType,
      llmsTxtLooksLikeHtml: looksLikeHtml(llms),
    };

    const report = evaluateEvidence('https://madar.bond/', raw, 'MADAR');
    expect(report.categoryScores.technicalSEO).not.toBeNull();
    expect(report.categoryScores.contentAnswerability).not.toBeNull();
    expect(countPassed(report.checks)).toBeGreaterThan(0);
    expect(report.evidenceLedger.some((e) => e.status === 'pass')).toBe(true);
    expect(() => assertAuditConsistency(report.checks, report.categoryScores)).not.toThrow();
    expect(report.categoryScores).toEqual(scoresFromChecks(report.checks));

    // Professional invariants vs this specific site
    expect(parsed.htmlLang).toBe('ar');
    expect(parsed.canonicalUrl).toMatch(/madar\.bond/);
    expect(parsed.h1Tags.length).toBe(0);
    expect(looksLikeHtml(llms)).toBe(true);
    expect(countFindings(report.checks)).toBeGreaterThan(0);
    expect(countCritical(report.checks)).toBe(0);
    expect(countPassed(report.checks)).toBeGreaterThanOrEqual(10);
    expect(report.categoryScores.technicalSEO).toBe(78);
    expect(report.categoryScores.crawlability).toBe(85);
    expect(report.categoryScores.contentAnswerability).toBe(78);
    expect(report.categoryScores.entitySchema).toBe(100);
    expect(report.evidence.fetchMode).toBe('server');
    expect(report.lockedIssues.length).toBe(0);
    expect(report.criticalBlockers.every((i) => i.severity !== 'critical')).toBe(true);
  });
});
