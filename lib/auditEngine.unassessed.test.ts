import { describe, expect, it } from 'vitest';
import { evaluateEvidence, type RawEvidence } from '@/lib/auditEngine';

const unreachable: RawEvidence = {
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

const inspectedClean: RawEvidence = {
  httpStatus: 200,
  robotsTxtFound: true,
  robotsTxtContent: 'User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml',
  sitemapFound: true,
  sitemapUrl: 'https://example.com/sitemap.xml',
  canonicalUrl: 'https://example.com/',
  metaRobots: 'index, follow',
  xRobotsTag: null,
  title: 'Example Company — Product and service overview',
  metaDescription: 'Example Company provides inspected product documentation and support for search and AI crawlers worldwide.',
  h1Tags: ['Example Company product documentation'],
  h2Tags: ['What does Example Company offer?', 'How does the product work?'],
  leadParagraph: 'Example Company is a product documentation platform that publishes machine-readable answers for customers, search engines, and AI crawlers.',
  hasQuestionHeadings: true,
  hasDefinitionPatterns: true,
  schemaTypesDetected: ['Organization'],
  rawJsonLd: [{ '@type': 'Organization', name: 'Example Company' }],
  oaiSearchBotDirective: 'allowed',
  oaiAdsBotDirective: 'allowed',
  googleExtendedDirective: 'allowed',
  googlebotDirective: 'allowed',
  perplexityBotDirective: 'allowed',
  potentialBotBarrier: false,
  detectedSiteType: 'general',
  htmlFetched: true,
  robotsFetched: true,
};

describe('evaluateEvidence — no invented scores', () => {
  it('returns no numeric scores when HTML was not fetched', () => {
    const report = evaluateEvidence('https://example.com/', unreachable, 'NOHTML');
    expect(report.overallScore).toBeNull();
    expect(report.categoryScores.technicalSEO).toBeNull();
    expect(report.categoryScores.crawlability).toBeNull();
    expect(report.categoryScores.contentAnswerability).toBeNull();
    expect(report.categoryScores.entitySchema).toBeNull();
    expect(report.categoryScores.aiSearchReadiness).toBeNull();
    expect(report.allIssues).toHaveLength(0);
  });

  it('does not emit the CORS-failure fingerprint 98/85/50/50/62', () => {
    const report = evaluateEvidence('https://example.com/', unreachable, 'FINGER');
    expect(report.categoryScores).not.toEqual({
      technicalSEO: 98,
      crawlability: 85,
      contentAnswerability: 50,
      entitySchema: 50,
      aiSearchReadiness: 62,
    });
    expect(report.overallScore).not.toBe(70);
  });

  it('scores an inspected page from evidence instead of hardcoded floors', () => {
    const report = evaluateEvidence('https://example.com/', inspectedClean, 'CLEAN');
    expect(report.overallScore).not.toBeNull();
    expect(report.categoryScores.contentAnswerability).not.toBe(50);
    expect(report.categoryScores.technicalSEO).not.toBe(98);
    expect(report.categoryScores.technicalSEO).toBe(100);
  });
});
