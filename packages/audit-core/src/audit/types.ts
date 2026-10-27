export type CheckStatus = 'pass' | 'warn' | 'fail' | 'info' | 'not_assessed';
export type Category = 'technical' | 'crawlability' | 'content' | 'entity' | 'ai_readiness';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
export type FixCategory = 'robots' | 'schema' | 'meta' | 'content' | 'sitemap' | 'headers';

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 5,
  high: 3,
  medium: 2,
  low: 1,
  informational: 0,
};

export interface FixSnippet {
  language: 'html' | 'json' | 'text' | 'apache' | 'nginx' | 'markdown';
  code: string;
  label: string;
  labelAr: string;
}

export interface AuditCheck {
  id: string;
  category: Category;
  severity: Severity;
  weight: number;
  status: CheckStatus;
  title: string;
  titleAr: string;
  /** One-line result shown in the checks list. */
  detail: string;
  detailAr: string;
  evidence: string;
  evidenceAr: string;
  why: string;
  whyAr: string;
  fix: string;
  fixAr: string;
  fixCategory: FixCategory;
  fixSnippet?: FixSnippet;
  source?: string;
}

/** Response of public/api/audit.php (v2 adds fetch/probes; v1 fields remain). */
export interface ServerPayload {
  ok?: boolean;
  error?: string;
  version?: string;
  requestedUrl?: string;
  finalUrl?: string;
  status?: number | null;
  redirects?: { url: string; status: number | null }[];
  headers?: Record<string, string>;
  html?: string;
  htmlTruncated?: boolean;
  htmlBytes?: number;
  jsonLd?: unknown[];
  fetch?: {
    uaMode?: 'standard' | 'browser-fallback';
    firstStatus?: number | null;
    challenge?: string | null;
    ttfbMs?: number;
    totalMs?: number;
    connectMs?: number;
    tlsMs?: number;
    httpVersion?: string | null;
    certExpiry?: string | null;
  };
  robotsTxt?: string;
  robotsStatus?: number | null;
  robotsError?: string | null;
  sitemapXml?: string;
  sitemapUrl?: string;
  sitemapUrls?: string[];
  sitemapStatus?: number | null;
  sitemapTruncated?: boolean;
  llmsTxt?: string;
  llmsStatus?: number | null;
  llmsContentType?: string | null;
  probes?: {
    bots?: BotProbe[];
    httpVariant?: { url: string; status: number | null; error: string | null; location: string | null } | null;
    notFound?: { url: string; status: number | null; error: string | null; location: string | null; title: string | null; redirectedFrom?: number | null };
  };
  timingMs?: number;
}

export interface BotProbe {
  id: string;
  status: number | null;
  firstStatus?: number | null;
  retried?: boolean;
  error: string | null;
  bytes: number;
  ms: number | null;
  challenge: string | null;
  title: string | null;
  location: string | null;
}

export interface BotMatrixRow {
  id: string;
  userAgent: string;
  vendor: string;
  purpose: 'search-citation' | 'training' | 'user-fetch';
  purposeEn: string;
  purposeAr: string;
  robots: 'allowed' | 'disallowed' | 'unknown';
  robotsRule: string;
  matchedBy: 'token' | '*' | 'none' | 'unknown';
  probe: { status: number | null; challenge: string | null; retried: boolean; error: string | null } | null;
}

export interface AuditFailure {
  code: 'unreachable' | 'blocked_url' | 'http_status' | 'not_html' | 'bot_protection' | 'empty' | 'rate_limited' | 'dns' | 'timeout' | 'ssl' | 'connect' | 'too_many_redirects';
  message: string;
  messageAr: string;
}

export interface AuditIssue {
  id: string;
  category: Category;
  severity: Severity;
  weight: number;
  status: 'fail' | 'warn';
  title: string;
  titleAr: string;
  signalDetected: string;
  signalDetectedAr: string;
  evidence: string;
  evidenceAr: string;
  whyItMatters: string;
  whyItMattersAr: string;
  recommendedAction: string;
  recommendedActionAr: string;
  fixCategory: FixCategory;
  fixSnippet?: FixSnippet;
  isFreePreview?: boolean;
}

export interface AIOpportunity {
  query: string;
  queryAr: string;
  intent: 'commercial' | 'informational' | 'comparison' | 'local';
  status: 'covered' | 'partially_covered' | 'missing';
  reason: string;
  reasonAr: string;
}

export type PageType = 'home' | 'product' | 'article' | 'local' | 'software' | 'general';

export interface CategoryScores {
  technicalSEO: number | null;
  crawlability: number | null;
  contentAnswerability: number | null;
  entitySchema: number | null;
  aiSearchReadiness: number | null;
}

export interface AuditReport {
  id: string;
  url: string;
  finalUrl: string | null;
  timestamp: string;
  engineVersion: string;
  isDemo: boolean;
  failure: AuditFailure | null;
  overallScore: number | null;
  uncappedScore: number | null;
  scoreCap: { cap: number; reason: string; reasonAr: string } | null;
  categoryScores: CategoryScores;
  checks: AuditCheck[];
  counts: { pass: number; warn: number; fail: number; info: number; notAssessed: number; critical: number };
  criticalBlockers: AuditIssue[];
  allIssues: AuditIssue[];
  aiOpportunities: AIOpportunity[];
  botMatrix: BotMatrixRow[];
  pageType: PageType;
  detectedSiteType: 'saas' | 'ecommerce' | 'clinic' | 'agency' | 'general';
  summary: {
    status: number | null;
    redirects: { url: string; status: number | null }[];
    ttfbMs: number | null;
    htmlBytes: number | null;
    compression: string | null;
    httpVersion: string | null;
    uaMode: string | null;
    wordCount: number | null;
    schemaTypes: string[];
    title: string | null;
    metaDescription: string | null;
    h1: string | null;
    lang: string | null;
    platform: string[];
    leadParagraph: string | null;
    aiVisibleText: string;
    ogImage: string | null;
    siteName: string | null;
  };
}
