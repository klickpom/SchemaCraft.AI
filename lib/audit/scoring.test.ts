import { describe, expect, it } from 'vitest';
import {
  assembleChecks,
  assertAuditConsistency,
  auditBadgeLabels,
  countCritical,
  countFindings,
  countPassed,
  scoresFromChecks,
} from './scoring';
import type { AuditIssue } from '@/lib/auditEngine';
import { evaluateEvidence, SAMPLE_PROFILES, type RawEvidence } from '@/lib/auditEngine';

function issue(partial: Partial<AuditIssue> & Pick<AuditIssue, 'id' | 'category'>): AuditIssue {
  return {
    severity: 'high',
    weight: 3,
    title: partial.id,
    titleAr: partial.id,
    signalDetected: '',
    signalDetectedAr: '',
    evidence: '',
    evidenceAr: '',
    whyItMatters: '',
    whyItMattersAr: '',
    recommendedAction: '',
    recommendedActionAr: '',
    fixCategory: 'content',
    ...partial,
  };
}

const unreachableHtml: RawEvidence = {
  httpStatus: null,
  robotsTxtFound: false,
  robotsTxtContent: '',
  sitemapFound: null,
  sitemapUrl: '',
  canonicalUrl: null,
  metaRobots: null,
  xRobotsTag: null,
  title: null,
  metaDescription: null,
  h1Tags: [],
  h2Tags: [],
  leadParagraph: null,
  hasQuestionHeadings: false,
  hasDefinitionPatterns: false,
  schemaTypesDetected: [],
  rawJsonLd: [],
  oaiSearchBotDirective: 'not_specified',
  oaiAdsBotDirective: 'not_specified',
  googleExtendedDirective: 'not_specified',
  googlebotDirective: 'not_specified',
  perplexityBotDirective: 'not_specified',
  potentialBotBarrier: true,
  detectedSiteType: 'general',
  htmlFetched: false,
  robotsFetched: false,
};

describe('scoresFromChecks', () => {
  it('is 100 when a category has no failing checks', () => {
    const checks = assembleChecks([], [
      { name: 'HTTP', nameAr: 'HTTP', status: 'pass', detail: '200', detailAr: '200' },
    ]);
    expect(scoresFromChecks(checks).technicalSEO).toBe(100);
  });

  it('deducts only from failing checks in that category', () => {
    const checks = assembleChecks([
      issue({ id: 'bluf', category: 'content', weight: 3 }),
    ], []);
    expect(scoresFromChecks(checks).contentAnswerability).toBe(78);
    expect(scoresFromChecks(checks).technicalSEO).toBe(100);
  });
});

describe('assertAuditConsistency', () => {
  it('throws when a category lost points with no visible finding', () => {
    const checks = assembleChecks([], []);
    expect(() =>
      assertAuditConsistency(checks, {
        technicalSEO: 100,
        crawlability: 100,
        contentAnswerability: 50,
        entitySchema: 50,
        aiSearchReadiness: 50,
      })
    ).toThrow(/contentAnswerability/);
  });

  it('passes when every deducted category has a failing check', () => {
    const checks = assembleChecks([
      issue({ id: 'c', category: 'content', penalty: 50, weight: 0 }),
      issue({ id: 'e', category: 'entity', penalty: 50, weight: 0 }),
    ], []);
    expect(() => assertAuditConsistency(checks, scoresFromChecks(checks))).not.toThrow();
  });
});

describe('auditBadgeLabels', () => {
  it('uses singular Critical Blocker when the count is 1', () => {
    expect(auditBadgeLabels(1, 'en', 'critical')).toBe('1 Critical Blocker');
    expect(auditBadgeLabels(1, 'ar', 'critical')).toBe('1 عائق حرج');
  });

  it('uses plural Critical Blockers when the count is not 1', () => {
    expect(auditBadgeLabels(0, 'en', 'critical')).toBe('0 Critical Blockers');
    expect(auditBadgeLabels(2, 'en', 'critical')).toBe('2 Critical Blockers');
  });
});

describe('evaluateEvidence — single source of truth', () => {
  it('does not report 98 technical / 50 content with a single unrelated finding when HTML was not fetched', () => {
    const report = evaluateEvidence('https://blocked.example/', unreachableHtml, 'TEST01');

    expect(report.categoryScores.technicalSEO).not.toBe(98);
    expect(countFindings(report.checks)).toBeGreaterThan(1);
    expect(countPassed(report.checks)).toBe(report.evidenceLedger.filter((e) => e.status === 'pass').length);
    expect(report.categoryScores).toEqual(scoresFromChecks(report.checks));
    expect(() => assertAuditConsistency(report.checks, report.categoryScores)).not.toThrow();

    const contentFindings = report.checks.filter((c) => c.category === 'content' && c.outcome === 'fail');
    const entityFindings = report.checks.filter((c) => c.category === 'entity' && c.outcome === 'fail');
    expect(contentFindings.length).toBeGreaterThanOrEqual(1);
    expect(entityFindings.length).toBeGreaterThanOrEqual(1);
  });

  it('derives badge counts from the same check list', () => {
    const report = evaluateEvidence('https://blocked.example/', unreachableHtml, 'TEST02');
    expect(countCritical(report.checks)).toBe(
      report.checks.filter((c) => c.outcome === 'fail' && c.severity === 'critical').length
    );
    expect(countFindings(report.checks)).toBe(
      report.checks.filter((c) => c.outcome === 'fail').length
    );
  });

  it('keeps every sample profile internally consistent', () => {
    for (const [key, profile] of Object.entries(SAMPLE_PROFILES)) {
      const report = evaluateEvidence(profile.url, profile.raw, key.toUpperCase());
      expect(report.categoryScores, key).toEqual(scoresFromChecks(report.checks));
      expect(() => assertAuditConsistency(report.checks, report.categoryScores)).not.toThrow();
    }
  });
});
