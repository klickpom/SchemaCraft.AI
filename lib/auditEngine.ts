/**
 * SchemaCraft AI - Deterministic Audit Engine v1.0
 * Evaluates website technical, crawlability, content, and entity readiness for Google Search and AI-powered engines.
 * Strict Evidence-Based Model: Signal -> Evidence -> Why It Matters -> Recommended Fix.
 *
 * INTEGRITY RULE: Never fabricate data. If a signal cannot be fetched, report it as 'not_fetched' with transparent reasoning.
 */

import { BOT_REGISTRY } from '@/lib/bots/registry';
import {
  type AuditCheck,
  assertAuditConsistency,
  findingsFromChecks,
  ledgerFromChecks,
  overallScoreFromCategories,
  scoresFromChecks,
} from '@/lib/audit/scoring';
import { runCatalog } from '@/lib/audit/catalog';
import { assertPublicHttpUrl } from '@/lib/audit/urlGuard';
import { looksLikeHtml, parsePageHtml } from '@/lib/audit/parsePage';

export interface RawEvidence {
  httpStatus: number | null;
  robotsTxtFound: boolean;
  robotsTxtContent: string;
  sitemapFound: boolean | null;
  sitemapUrl: string;
  canonicalUrl: string | null;
  metaRobots: string | null;
  xRobotsTag: string | null;
  title: string | null;
  metaDescription: string | null;
  h1Tags: string[];
  h2Tags: string[];
  leadParagraph: string | null;
  hasQuestionHeadings: boolean;
  hasDefinitionPatterns: boolean;
  schemaTypesDetected: string[];
  rawJsonLd: any[];
  oaiSearchBotDirective: 'allowed' | 'disallowed' | 'not_specified';
  oaiAdsBotDirective: 'allowed' | 'disallowed' | 'not_specified';
  googleExtendedDirective: 'allowed' | 'disallowed' | 'not_specified';
  googlebotDirective: 'allowed' | 'disallowed' | 'not_specified';
  perplexityBotDirective: 'allowed' | 'disallowed' | 'not_specified';
  potentialBotBarrier: boolean;
  detectedSiteType: 'saas' | 'ecommerce' | 'clinic' | 'agency' | 'general';
  htmlFetched: boolean;
  robotsFetched: boolean;
  botDirectives?: Record<string, 'allowed' | 'disallowed' | 'not_specified'>;
  fetchMode?: 'server' | 'proxy' | 'same-origin' | 'failed';
  finalUrl?: string | null;
  redirectChain?: { url: string; status: number }[];
  responseHeaders?: Record<string, string>;
  llmsTxtFound?: boolean | null;
  llmsTxtContent?: string;
  llmsTxtContentType?: string | null;
  llmsTxtLooksLikeHtml?: boolean;
  htmlLang?: string | null;
  ogTitle?: string | null;
  ogUrl?: string | null;
  twitterCard?: string | null;
  hreflangTags?: { lang: string; href: string }[];
  fetchError?: string | null;
}

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export interface AuditIssue {
  id: string;
  category: 'technical' | 'crawlability' | 'content' | 'entity' | 'ai_readiness';
  severity: Severity;
  weight: number; // 5x critical, 3x high, 2x med, 1x low, 0x info
  penalty?: number; // explicit point deduction; defaults to weight * 7.5
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
  fixCategory: 'robots' | 'schema' | 'meta' | 'content' | 'sitemap' | 'headers';
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

export interface AuditReport {
  id: string;
  url: string;
  timestamp: string;
  engineVersion: string;
  overallScore: number | null;
  categoryScores: {
    technicalSEO: number | null;
    crawlability: number | null;
    contentAnswerability: number | null;
    entitySchema: number | null;
    aiSearchReadiness: number | null;
  };
  evidenceLedger: {
    name: string;
    nameAr: string;
    status: 'pass' | 'fail' | 'warning' | 'info' | 'skipped';
    detail: string;
    detailAr: string;
  }[];
  checks: AuditCheck[];
  criticalBlockers: AuditIssue[];
  lockedIssues: AuditIssue[];
  allIssues: AuditIssue[];
  aiOpportunities: AIOpportunity[];
  detectedSiteType: string;
  evidence: RawEvidence;
}

export const AUDIT_ENGINE_VERSION = 'Audit Engine v1.0 (Aug 2026 Criteria)';

/**
 * Deterministic Sample Profiles for Fast Instant Demo Testing
 * These are REALISTIC pre-built profiles for demo purposes only.
 */
export const SAMPLE_PROFILES: Record<string, { name: string; nameAr: string; url: string; raw: RawEvidence }> = {
  saas: {
    name: "Modern SaaS App (Next.js)",
    nameAr: "تطبيق ساس حديث (Next.js)",
    url: "https://saasmetrics-app.io",
    raw: {
      httpStatus: 200,
      robotsTxtFound: true,
      robotsTxtContent: "User-agent: *\nAllow: /\nUser-agent: GPTBot\nDisallow: /\nUser-agent: Google-Extended\nDisallow: /",
      sitemapFound: true,
      sitemapUrl: "https://saasmetrics-app.io/sitemap.xml",
      canonicalUrl: "https://saasmetrics-app.io",
      metaRobots: "index, follow",
      xRobotsTag: null,
      title: "SaaSMetrics - Real-Time Revenue Analytics",
      metaDescription: "All-in-one financial intelligence for B2B subscription companies.",
      h1Tags: ["Transform Your Subscription Revenue Intelligence"],
      h2Tags: ["Features", "Pricing Overview", "How It Works", "Testimonials"],
      leadParagraph: "We help modern teams understand their business with dashboards and charts.",
      hasQuestionHeadings: false,
      hasDefinitionPatterns: false,
      schemaTypesDetected: [],
      rawJsonLd: [],
      oaiSearchBotDirective: 'not_specified',
      oaiAdsBotDirective: 'not_specified',
      googleExtendedDirective: 'disallowed',
      googlebotDirective: 'allowed',
      perplexityBotDirective: 'not_specified',
      potentialBotBarrier: false,
      detectedSiteType: 'saas',
      htmlFetched: true,
      robotsFetched: true,
    }
  },
  ecommerce: {
    name: "Shopify E-Commerce Store",
    nameAr: "متجر شوبيفاي تجاري",
    url: "https://nordic-leather-goods.com",
    raw: {
      httpStatus: 200,
      robotsTxtFound: true,
      robotsTxtContent: "User-agent: *\nDisallow: /checkout\nDisallow: /cart\nUser-agent: OAI-SearchBot\nAllow: /",
      sitemapFound: true,
      sitemapUrl: "https://nordic-leather-goods.com/sitemap.xml",
      canonicalUrl: "https://nordic-leather-goods.com/products/leather-bag?variant=12",
      metaRobots: "index, follow",
      xRobotsTag: null,
      title: "Handcrafted Leather Travel Duffel Bag - Nordic Goods",
      metaDescription: "Premium full-grain leather duffel bag designed for weekend trips.",
      h1Tags: ["Nordic Travel Duffel Bag (Cognac)"],
      h2Tags: ["Product Specifications", "Customer Reviews", "Shipping Information"],
      leadParagraph: "Handcrafted using vegetable-tanned full grain leather with solid brass zippers.",
      hasQuestionHeadings: false,
      hasDefinitionPatterns: true,
      schemaTypesDetected: ["Product"],
      rawJsonLd: [{ "@type": "Product", name: "Nordic Travel Duffel Bag" }],
      oaiSearchBotDirective: 'allowed',
      oaiAdsBotDirective: 'allowed',
      googleExtendedDirective: 'allowed',
      googlebotDirective: 'allowed',
      perplexityBotDirective: 'allowed',
      potentialBotBarrier: false,
      detectedSiteType: 'ecommerce',
      htmlFetched: true,
      robotsFetched: true,
    }
  },
  clinic: {
    name: "Medical / Dental Clinic",
    nameAr: "عيادة طبية وأسنان",
    url: "https://cairo-dental-implants.com",
    raw: {
      httpStatus: 200,
      robotsTxtFound: true,
      robotsTxtContent: "User-agent: *\nAllow: /\nUser-agent: OAI-SearchBot\nDisallow: /\nUser-agent: PerplexityBot\nDisallow: /",
      sitemapFound: false,
      sitemapUrl: "",
      canonicalUrl: null,
      metaRobots: "index, follow",
      xRobotsTag: null,
      title: "Best Dental Implants Clinic | Painless Teeth Replacement",
      metaDescription: "Experienced dental implant surgeons providing permanent tooth replacement.",
      h1Tags: ["Welcome to Cairo Dental Specialists"],
      h2Tags: ["Our Services", "Doctors", "Book Appointment", "Contact Us"],
      leadParagraph: "We have over 15 years of dental excellence restoring smiles.",
      hasQuestionHeadings: false,
      hasDefinitionPatterns: false,
      schemaTypesDetected: [],
      rawJsonLd: [],
      oaiSearchBotDirective: 'disallowed',
      oaiAdsBotDirective: 'not_specified',
      googleExtendedDirective: 'not_specified',
      googlebotDirective: 'allowed',
      perplexityBotDirective: 'disallowed',
      potentialBotBarrier: true,
      detectedSiteType: 'clinic',
      htmlFetched: true,
      robotsFetched: true,
    }
  },
  agency: {
    name: "B2B Marketing Agency",
    nameAr: "وكالة تسويق رقمي B2B",
    url: "https://apex-growth-partners.com",
    raw: {
      httpStatus: 200,
      robotsTxtFound: true,
      robotsTxtContent: "User-agent: *\nAllow: /\nUser-agent: OAI-SearchBot\nAllow: /",
      sitemapFound: true,
      sitemapUrl: "https://apex-growth-partners.com/sitemap.xml",
      canonicalUrl: "https://apex-growth-partners.com",
      metaRobots: "index, follow",
      xRobotsTag: null,
      title: "Apex Growth | B2B Demand Generation Agency",
      metaDescription: "We scale enterprise software companies through organic pipeline generation and GEO.",
      h1Tags: ["Predictable Pipeline for Enterprise SaaS"],
      h2Tags: ["What is Demand Generation?", "How Our Growth Engine Works", "Case Studies", "FAQ"],
      leadParagraph: "Demand generation is a systematic marketing methodology focused on creating targeted awareness and high-intent inbound pipeline for B2B tech.",
      hasQuestionHeadings: true,
      hasDefinitionPatterns: true,
      schemaTypesDetected: ["Organization"],
      rawJsonLd: [{ "@type": "Organization", name: "Apex Growth Partners" }],
      oaiSearchBotDirective: 'allowed',
      oaiAdsBotDirective: 'allowed',
      googleExtendedDirective: 'allowed',
      googlebotDirective: 'allowed',
      perplexityBotDirective: 'allowed',
      potentialBotBarrier: false,
      detectedSiteType: 'agency',
      htmlFetched: true,
      robotsFetched: true,
    }
  }
};

/**
 * Generate a deterministic audit report from raw evidence
 */
export function evaluateEvidence(url: string, raw: RawEvidence, customId?: string): AuditReport {
  const checks = runCatalog(raw);
  const categoryScores = scoresFromChecks(checks);
  const overallScore = overallScoreFromCategories(categoryScores);
  assertAuditConsistency(checks, categoryScores);

  const failFindings = checks.filter((c) => c.outcome === 'fail');
  const criticalBlockers = failFindings.slice(0, 3);
  const lockedIssues = failFindings.slice(3);
  const allIssues = findingsFromChecks(checks);
  const aiOpportunities: AIOpportunity[] = generateAIOpportunities(raw.detectedSiteType, raw);
  const reportId = customId || generateAuditId();

  return {
    id: reportId,
    url,
    timestamp: new Date().toISOString(),
    engineVersion: AUDIT_ENGINE_VERSION,
    overallScore,
    categoryScores,
    evidenceLedger: ledgerFromChecks(checks),
    checks,
    criticalBlockers,
    lockedIssues,
    allIssues,
    aiOpportunities,
    detectedSiteType: raw.detectedSiteType,
    evidence: raw,
  };
}

function generateAuditId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate AI opportunities based on REAL evidence, not hardcoded assumptions.
 */
function generateAIOpportunities(siteType: string, raw: RawEvidence): AIOpportunity[] {
  const opportunities: AIOpportunity[] = [];
  const hasSchema = raw.schemaTypesDetected.length > 0;
  const hasBluf = raw.leadParagraph && raw.leadParagraph.length >= 40;
  const hasQuestions = raw.hasQuestionHeadings;
  const title = (raw.title || '').toLowerCase();
  const desc = (raw.metaDescription || '').toLowerCase();
  const combined = `${title} ${desc} ${raw.h1Tags.join(' ')} ${raw.h2Tags.join(' ')}`.toLowerCase();

  if (siteType === 'saas') {
    opportunities.push({
      query: `What is ${raw.title?.split('-')[0]?.split('|')[0]?.trim() || 'this tool'} and what does it do?`,
      queryAr: `ما هي أداة ${raw.title?.split('-')[0]?.split('|')[0]?.trim() || 'هذه الأداة'} وماذا تفعل؟`,
      intent: 'informational',
      status: hasBluf && hasSchema ? 'covered' : hasBluf || raw.metaDescription ? 'partially_covered' : 'missing',
      reason: hasBluf ? 'Strong BLUF lead paragraph detected for direct extraction.' : 'No clear BLUF summary for AI extraction — lead text is vague or too short.',
      reasonAr: hasBluf ? 'مقدمة BLUF قوية مكتشفة وجاهزة للاقتباس.' : 'لا يوجد ملخص BLUF واضح — المقدمة غامضة أو قصيرة.',
    });

    opportunities.push({
      query: combined.includes('pric') ? `${raw.title?.split('-')[0]?.trim() || 'Tool'} pricing plans comparison` : 'Best tools in this category — pricing comparison',
      queryAr: combined.includes('pric') ? `مقارنة أسعار وباقات ${raw.title?.split('-')[0]?.trim() || 'الأداة'}` : 'مقارنة أفضل الأدوات والأسعار في هذا المجال',
      intent: 'commercial',
      status: combined.includes('pric') || combined.includes('plan') ? 'partially_covered' : 'missing',
      reason: combined.includes('pric') ? 'Pricing section referenced in headings — but needs Offer schema markup for rich snippets.' : 'No pricing or comparison content detected on landing page.',
      reasonAr: combined.includes('pric') ? 'قسم الأسعار مذكور في العناوين — لكن يحتاج سكيما Offer لنتائج غنية.' : 'لا يوجد محتوى أسعار أو مقارنة في الصفحة.',
    });
  } else if (siteType === 'clinic') {
    opportunities.push({
      query: `Best ${combined.includes('dental') ? 'dental' : 'medical'} ${combined.includes('implant') ? 'implant' : 'clinic'} near me`,
      queryAr: `أفضل ${combined.includes('dental') ? 'عيادة أسنان' : 'عيادة طبية'} بالقرب مني`,
      intent: 'local',
      status: hasSchema && raw.schemaTypesDetected.some(t => t.includes('Business')) ? 'covered' : 'partially_covered',
      reason: hasSchema ? 'LocalBusiness schema detected — verify geo coordinates and opening hours.' : 'Missing LocalBusiness/MedicalBusiness schema for local pack results.',
      reasonAr: hasSchema ? 'سكيما LocalBusiness مكتشفة — تحقق من الإحداثيات وساعات العمل.' : 'غياب سكيما المنشأة المحلية المطلوبة لنتائج الخرائط.',
    });

    opportunities.push({
      query: `How much does ${combined.includes('implant') ? 'a dental implant' : 'treatment'} cost?`,
      queryAr: `كم تكلفة ${combined.includes('implant') ? 'زراعة الأسنان' : 'العلاج'}؟`,
      intent: 'commercial',
      status: combined.includes('cost') || combined.includes('price') || combined.includes('تكلفة') ? 'partially_covered' : 'missing',
      reason: combined.includes('cost') || combined.includes('price') ? 'Pricing content exists but needs structured FAQ markup.' : 'No pricing or cost information found on the page.',
      reasonAr: combined.includes('cost') || combined.includes('price') ? 'محتوى الأسعار موجود لكن يحتاج سكيما FAQ.' : 'لا يوجد معلومات عن التكلفة في الصفحة.',
    });
  } else if (siteType === 'ecommerce') {
    opportunities.push({
      query: `${raw.h1Tags[0] || 'Product'} review and specifications`,
      queryAr: `مراجعة ومواصفات ${raw.h1Tags[0] || 'المنتج'}`,
      intent: 'commercial',
      status: raw.schemaTypesDetected.includes('Product') ? 'covered' : 'missing',
      reason: raw.schemaTypesDetected.includes('Product') ? 'Product schema detected — ensures rich snippets in Google Shopping.' : 'Missing Product schema — no rich snippet eligibility.',
      reasonAr: raw.schemaTypesDetected.includes('Product') ? 'سكيما المنتج مكتشفة — تضمن نتائج غنية في Google Shopping.' : 'غياب سكيما المنتج — لا أهلية للنتائج الغنية.',
    });

    opportunities.push({
      query: `Is ${raw.title?.split('-')[0]?.trim() || 'this product'} worth buying?`,
      queryAr: `هل ${raw.title?.split('-')[0]?.trim() || 'هذا المنتج'} يستحق الشراء؟`,
      intent: 'informational',
      status: hasQuestions ? 'covered' : raw.h2Tags.some(h => h.toLowerCase().includes('review')) ? 'partially_covered' : 'missing',
      reason: hasQuestions ? 'FAQ-style content detected for direct answer extraction.' : 'No question-based content or reviews section detected.',
      reasonAr: hasQuestions ? 'محتوى بصيغة أسئلة وإجابات مكتشف وجاهز للاقتباس.' : 'لا يوجد محتوى مراجعات أو أسئلة وإجابات.',
    });
  } else {
    opportunities.push({
      query: `What does ${raw.title?.split('-')[0]?.split('|')[0]?.trim() || 'this company'} do?`,
      queryAr: `ماذا تقدم ${raw.title?.split('-')[0]?.split('|')[0]?.trim() || 'هذه الشركة'}؟`,
      intent: 'informational',
      status: hasBluf ? 'covered' : raw.metaDescription ? 'partially_covered' : 'missing',
      reason: hasBluf ? 'Strong lead paragraph detected.' : 'Lead content is vague or missing for AI extraction.',
      reasonAr: hasBluf ? 'مقدمة قوية مكتشفة.' : 'المقدمة غامضة أو مفقودة للاقتباس.',
    });

    opportunities.push({
      query: 'How does this service work step by step?',
      queryAr: 'كيف تعمل هذه الخدمة خطوة بخطوة؟',
      intent: 'informational',
      status: hasQuestions ? 'covered' : raw.h2Tags.some(h => /how|step|work/i.test(h)) ? 'partially_covered' : 'missing',
      reason: hasQuestions ? 'Question-based headings detected.' : 'No step-by-step or how-to content structure found.',
      reasonAr: hasQuestions ? 'عناوين بصيغة أسئلة مكتشفة.' : 'لا يوجد هيكل محتوى خطوة بخطوة.',
    });
  }

  return opportunities;
}

/**
 * Helper to fetch with strict timeout
 */
async function fetchWithTimeout(url: string, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'text/html,text/plain,application/json,*/*' },
      redirect: 'follow',
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Try fetching from a single proxy, return HTML string or throw
 */
async function tryProxy(proxyUrl: string, timeoutMs = 5000): Promise<string> {
  const res = await fetchWithTimeout(proxyUrl, timeoutMs);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (!text || text.length < 50) throw new Error('Empty response');
  return text;
}

/**
 * allorigins returns JSON wrapper { contents: "..." } - unwrap it
 */
async function tryAlloriginsJson(targetUrl: string, timeoutMs = 5000): Promise<string> {
  const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
  const res = await fetchWithTimeout(apiUrl, timeoutMs);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json && json.contents && json.contents.length > 50) {
    return json.contents;
  }
  throw new Error('Empty contents');
}

/**
 * Accurate per-bot robots.txt parser.
 * Correctly resolves which Disallow applies to which User-agent block.
 */
function parseRobotsTxt(content: string): Record<string, 'allowed' | 'disallowed'> {
  const result: Record<string, 'allowed' | 'disallowed'> = {};
  if (!content) return result;

  const lines = content.split('\n').map(l => l.trim());
  let currentAgents: string[] = [];
  let lastLineWasDirective = false;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith('#') || lower === '') {
      if (lower === '' && currentAgents.length > 0) {
        currentAgents = [];
        lastLineWasDirective = false;
      }
      continue;
    }

    if (lower.startsWith('user-agent:')) {
      // If previous line was a directive (Allow/Disallow), this starts a NEW block
      if (lastLineWasDirective) {
        currentAgents = [];
      }
      const agent = lower.replace('user-agent:', '').trim();
      currentAgents.push(agent);
      lastLineWasDirective = false;
    } else if (lower.startsWith('disallow:')) {
      const path = lower.replace('disallow:', '').trim();
      if (path === '/' || path === '/*') {
        for (const agent of currentAgents) {
          result[agent] = 'disallowed';
        }
      }
      lastLineWasDirective = true;
    } else if (lower.startsWith('allow:')) {
      const path = lower.replace('allow:', '').trim();
      if (path === '/' || path === '/*') {
        for (const agent of currentAgents) {
          result[agent] = 'allowed';
        }
      }
      lastLineWasDirective = true;
    } else {
      lastLineWasDirective = true; // sitemap: or other directives
    }
  }

  return result;
}

function getBotDirective(parsed: Record<string, 'allowed' | 'disallowed'>, botName: string): 'allowed' | 'disallowed' | 'not_specified' {
  const botLower = botName.toLowerCase();
  if (parsed[botLower] !== undefined) {
    return parsed[botLower];
  }
  if (parsed['*'] !== undefined) {
    return parsed['*'];
  }
  return 'not_specified';
}

/**
 * Same-origin Hostinger PHP fetch. Bypasses browser CORS.
 * Falls back to client proxies when PHP is not available (local next dev).
 */
interface ServerAuditPayload {
  ok: boolean;
  requestedUrl?: string;
  finalUrl?: string;
  status?: number;
  redirects?: { url: string; status: number }[];
  headers?: Record<string, string>;
  html?: string;
  robotsTxt?: string;
  robotsStatus?: number | null;
  sitemapXml?: string;
  sitemapUrl?: string;
  sitemapStatus?: number | null;
  llmsTxt?: string;
  llmsStatus?: number | null;
  llmsContentType?: string | null;
}

async function tryServerAudit(targetUrl: string): Promise<ServerAuditPayload | null> {
  if (typeof window === 'undefined') return null;
  for (const endpoint of ['/api/audit.php', '/api/audit']) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as ServerAuditPayload;
      if (data && data.ok === true && typeof data.html === 'string') return data;
    } catch {
      // try next endpoint
    }
  }
  return null;
}

function emptyEvidence(partial: Partial<RawEvidence> & { fetchMode: RawEvidence['fetchMode']; fetchError?: string }): RawEvidence {
  return {
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
    fetchError: null,
    ...partial,
  };
}

function evidenceFromServerPayload(server: ServerAuditPayload, requested: string): RawEvidence {
  const html = server.html || '';
  const htmlFetched = html.length > 100;
  const robotsTxtContent = server.robotsTxt || '';
  const robotsFetched = Boolean(robotsTxtContent && robotsTxtContent.toLowerCase().includes('user-agent'));
  const headers = server.headers || {};
  const parsedRobots = parseRobotsTxt(robotsTxtContent);
  const sitemapXml = server.sitemapXml || '';
  const sitemapFound = sitemapXml.includes('<urlset') || sitemapXml.includes('<sitemapindex') || sitemapXml.includes('<?xml')
    ? true
    : server.sitemapStatus === 404
      ? false
      : robotsFetched && /sitemap:/i.test(robotsTxtContent)
        ? true
        : server.sitemapStatus
          ? false
          : null;
  const llmsBody = server.llmsTxt || '';
  const llmsLooksHtml = looksLikeHtml(llmsBody);
  const llmsTxtFound = server.llmsStatus === 200 && llmsBody.length > 0
    ? true
    : server.llmsStatus === 404
      ? false
      : null;

  const ev: RawEvidence = emptyEvidence({
    fetchMode: 'server',
    httpStatus: server.status ?? null,
    finalUrl: server.finalUrl || requested,
    redirectChain: server.redirects || [],
    responseHeaders: headers,
    xRobotsTag: headers['x-robots-tag'] || null,
    robotsTxtContent,
    robotsTxtFound: robotsFetched,
    robotsFetched,
    htmlFetched,
    potentialBotBarrier: !htmlFetched,
    sitemapFound,
    sitemapUrl: server.sitemapUrl || '',
    llmsTxtFound,
    llmsTxtContent: llmsBody.slice(0, 4000),
    llmsTxtContentType: server.llmsContentType || undefined,
    llmsTxtLooksLikeHtml: llmsLooksHtml,
    fetchError: htmlFetched ? undefined : 'Server fetch did not return HTML',
  });

  if (htmlFetched) applyParsedHtml(html, ev);
  ev.oaiSearchBotDirective = robotsFetched ? getBotDirective(parsedRobots, 'oai-searchbot') : 'not_specified';
  ev.oaiAdsBotDirective = robotsFetched ? getBotDirective(parsedRobots, 'oai-adsbot') : 'not_specified';
  ev.googleExtendedDirective = robotsFetched ? getBotDirective(parsedRobots, 'google-extended') : 'not_specified';
  ev.googlebotDirective = robotsFetched ? getBotDirective(parsedRobots, 'googlebot') : 'not_specified';
  ev.perplexityBotDirective = robotsFetched ? getBotDirective(parsedRobots, 'perplexitybot') : 'not_specified';
  const botDirectives: Record<string, 'allowed' | 'disallowed' | 'not_specified'> = {};
  for (const bot of BOT_REGISTRY) {
    botDirectives[bot.userAgent] = robotsFetched ? getBotDirective(parsedRobots, bot.userAgent) : 'not_specified';
  }
  ev.botDirectives = botDirectives;
  ev.detectedSiteType = detectSiteType(`${ev.title || ''} ${ev.metaDescription || ''} ${ev.h1Tags.join(' ')}`, requested);
  return ev;
}

function applyParsedHtml(html: string, target: Partial<RawEvidence>): void {
  const parsed = parsePageHtml(html);
  target.title = parsed.title;
  target.metaDescription = parsed.metaDescription;
  target.canonicalUrl = parsed.canonicalUrl;
  target.metaRobots = parsed.metaRobots;
  target.htmlLang = parsed.htmlLang;
  target.ogTitle = parsed.ogTitle;
  target.ogUrl = parsed.ogUrl;
  target.twitterCard = parsed.twitterCard;
  target.h1Tags = parsed.h1Tags;
  target.h2Tags = parsed.h2Tags;
  target.leadParagraph = parsed.leadParagraph;
  target.hasQuestionHeadings = parsed.hasQuestionHeadings;
  target.hasDefinitionPatterns = parsed.hasDefinitionPatterns;
  target.schemaTypesDetected = parsed.schemaTypesDetected;
  target.rawJsonLd = parsed.rawJsonLd;
  target.hreflangTags = parsed.hreflangTags;
}

function detectSiteType(text: string, url: string): RawEvidence['detectedSiteType'] {
  const combinedText = `${text} ${url}`.toLowerCase();
  if (combinedText.includes('software') || combinedText.includes('saas') || combinedText.includes(' app ') || combinedText.includes('api') || combinedText.includes('platform')) return 'saas';
  if (combinedText.includes('shop') || combinedText.includes('store') || combinedText.includes('cart') || combinedText.includes('product') || combinedText.includes('price')) return 'ecommerce';
  if (combinedText.includes('clinic') || combinedText.includes('dental') || combinedText.includes('doctor') || combinedText.includes('patient') || combinedText.includes('medical')) return 'clinic';
  if (combinedText.includes('agency') || combinedText.includes('marketing') || combinedText.includes('seo') || combinedText.includes('consulting')) return 'agency';
  return 'general';
}

/**
 * Same-origin Hostinger PHP fetch. Bypasses browser CORS.
 */
export async function fetchLiveEvidence(targetUrl: string): Promise<RawEvidence> {
  let html = '';
  let httpStatus: number | null = null;
  let potentialBotBarrier = false;
  let robotsTxtContent = '';
  let robotsTxtFound = false;
  let htmlFetched = false;
  let robotsFetched = false;

  let origin = '';
  try {
    const parsedUrl = new URL(targetUrl);
    origin = parsedUrl.origin;
  } catch (e) {
    origin = targetUrl;
  }

  const guarded = assertPublicHttpUrl(/^https?:\/\//i.test(targetUrl) ? targetUrl : `https://${targetUrl}`);
  if (!guarded.ok) {
    return emptyEvidence({ fetchMode: 'failed', fetchError: guarded.reason });
  }

  const server = await tryServerAudit(guarded.href);
  if (server) {
    return evidenceFromServerPayload(server, guarded.href);
  }

  const isSameOrigin = typeof window !== 'undefined' && (
    window.location.origin === origin ||
    targetUrl.includes(window.location.hostname) ||
    window.location.hostname === 'localhost'
  );

  // ─── Strategy 1: Same-origin direct fetch (zero proxy needed) ───
  if (isSameOrigin) {
    try {
      const res = await fetch(targetUrl);
      httpStatus = res.status;
      if (res.ok) {
        html = await res.text();
        if (html.length > 100) htmlFetched = true;
      }
    } catch (e) {}

    try {
      const resRobots = await fetch('/robots.txt');
      if (resRobots.ok) {
        robotsTxtContent = await resRobots.text();
        if (robotsTxtContent && robotsTxtContent.toLowerCase().includes('user-agent')) {
          robotsTxtFound = true;
          robotsFetched = true;
        }
      }
    } catch (e) {}
  }

  // ─── Strategy 2: Multi-proxy racing with generous timeouts ───
  if (!htmlFetched) {
    const encoded = encodeURIComponent(targetUrl);

    // Wave 1: Race the 3 fastest proxies simultaneously (5s timeout)
    const wave1 = [
      () => tryAlloriginsJson(targetUrl, 6000),
      () => tryProxy(`https://corsproxy.io/?url=${encoded}`, 5000),
      () => tryProxy(`https://api.codetabs.com/v1/proxy?quest=${encoded}`, 5000),
    ];

    try {
      html = await Promise.any(wave1.map(fn => fn()));
      if (html && html.length > 100) {
        htmlFetched = true;
        httpStatus = 200;
      }
    } catch (e) {}

    // Wave 2: If wave 1 failed, try alternative proxies sequentially (each 6s)
    if (!htmlFetched) {
      const wave2 = [
        `https://api.allorigins.win/raw?url=${encoded}`,
        `https://thingproxy.freeboard.io/fetch/${targetUrl}`,
        `https://cors-proxy.htmldriven.com/?url=${encoded}`,
        `https://corsproxy.org/?url=${encoded}`,
        `https://proxy.cors.sh/${targetUrl}`,
      ];

      for (const proxyUrl of wave2) {
        if (htmlFetched) break;
        try {
          html = await tryProxy(proxyUrl, 6000);
          if (html && html.length > 100) {
            htmlFetched = true;
            httpStatus = 200;
          }
        } catch (e) {
          // Try next proxy
        }
      }
    }

    // Wave 3: Instead of deprecated Google WebCache, try one more batch
    if (!htmlFetched) {
      // Last attempt with longer timeout
      try {
        html = await tryAlloriginsJson(targetUrl, 8000);
        if (html && html.length > 100) {
          htmlFetched = true;
          httpStatus = 200;
        }
      } catch (e) {}
    }

    if (!htmlFetched) {
      potentialBotBarrier = true;
    }
  }

  // ─── Robots.txt: Independent multi-proxy fetch (separate from HTML) ───
  if (!robotsFetched) {
    const robotsUrl = `${origin}/robots.txt`;
    const robotsEncoded = encodeURIComponent(robotsUrl);

    const robotsStrategies = [
      () => tryAlloriginsJson(robotsUrl, 5000),
      () => tryProxy(`https://corsproxy.io/?url=${robotsEncoded}`, 4000),
      () => tryProxy(`https://api.allorigins.win/raw?url=${robotsEncoded}`, 4000),
      () => tryProxy(`https://api.codetabs.com/v1/proxy?quest=${robotsEncoded}`, 4000),
      () => tryProxy(`https://thingproxy.freeboard.io/fetch/${robotsUrl}`, 4000),
      () => tryProxy(`https://corsproxy.org/?url=${robotsEncoded}`, 4000),
    ];

    // Race first 3
    try {
      const robotsResult = await Promise.any(robotsStrategies.slice(0, 3).map(fn => fn()));
      if (robotsResult && robotsResult.toLowerCase().includes('user-agent')) {
        robotsTxtContent = robotsResult;
        robotsTxtFound = true;
        robotsFetched = true;
      }
    } catch (e) {}

    // Sequential fallback for remaining
    if (!robotsFetched) {
      for (const strategy of robotsStrategies.slice(3)) {
        if (robotsFetched) break;
        try {
          const robotsResult = await strategy();
          if (robotsResult && robotsResult.toLowerCase().includes('user-agent')) {
            robotsTxtContent = robotsResult;
            robotsTxtFound = true;
            robotsFetched = true;
          }
        } catch (e) {}
      }
    }
  }

  // Parse HTML with the shared parser (DOM in browser, regex in Node tests)
  const parsedFields: Partial<RawEvidence> = {};
  if (htmlFetched && html.length > 100) {
    applyParsedHtml(html, parsedFields);
  }

  if (!htmlFetched) {
    potentialBotBarrier = true;
  }

  const parsedRobots = parseRobotsTxt(robotsTxtContent);
  const oaiSearchBotDirective = robotsFetched ? getBotDirective(parsedRobots, 'oai-searchbot') : 'not_specified';
  const oaiAdsBotDirective = robotsFetched ? getBotDirective(parsedRobots, 'oai-adsbot') : 'not_specified';
  const googleExtendedDirective = robotsFetched ? getBotDirective(parsedRobots, 'google-extended') : 'not_specified';
  const googlebotDirective = robotsFetched ? getBotDirective(parsedRobots, 'googlebot') : 'not_specified';
  const perplexityBotDirective = robotsFetched ? getBotDirective(parsedRobots, 'perplexitybot') : 'not_specified';

  const botDirectives: Record<string, 'allowed' | 'disallowed' | 'not_specified'> = {};
  for (const bot of BOT_REGISTRY) {
    botDirectives[bot.userAgent] = robotsFetched
      ? getBotDirective(parsedRobots, bot.userAgent)
      : 'not_specified';
  }

  const detectedSiteType = detectSiteType(
    `${parsedFields.title || ''} ${parsedFields.metaDescription || ''} ${(parsedFields.h1Tags || []).join(' ')}`,
    targetUrl
  );

  let sitemapFound: boolean | null = null;
  let sitemapUrl = '';

  if (robotsFetched && robotsTxtContent.toLowerCase().includes('sitemap:')) {
    sitemapFound = true;
    sitemapUrl = robotsTxtContent.match(/Sitemap:\s*(.*)/i)?.[1]?.trim() || `${origin}/sitemap.xml`;
  } else {
    const sitemapProbeUrl = `${origin}/sitemap.xml`;
    const sitemapEncoded = encodeURIComponent(sitemapProbeUrl);
    try {
      const sitemapRes = await Promise.any([
        tryProxy(`https://corsproxy.io/?url=${sitemapEncoded}`, 3000),
        tryProxy(`https://api.allorigins.win/raw?url=${sitemapEncoded}`, 3000),
      ]);
      if (sitemapRes && (sitemapRes.includes('<urlset') || sitemapRes.includes('<sitemapindex') || sitemapRes.includes('<?xml'))) {
        sitemapFound = true;
        sitemapUrl = sitemapProbeUrl;
      } else {
        sitemapFound = false;
      }
    } catch (e) {
      sitemapFound = robotsFetched ? false : null;
    }
  }

  return {
    httpStatus,
    robotsTxtFound,
    robotsTxtContent,
    sitemapFound,
    sitemapUrl,
    canonicalUrl: parsedFields.canonicalUrl ?? null,
    metaRobots: parsedFields.metaRobots ?? null,
    xRobotsTag: null,
    title: parsedFields.title ?? null,
    metaDescription: parsedFields.metaDescription ?? null,
    h1Tags: parsedFields.h1Tags ?? [],
    h2Tags: parsedFields.h2Tags ?? [],
    leadParagraph: parsedFields.leadParagraph ?? null,
    hasQuestionHeadings: parsedFields.hasQuestionHeadings ?? false,
    hasDefinitionPatterns: parsedFields.hasDefinitionPatterns ?? false,
    schemaTypesDetected: parsedFields.schemaTypesDetected ?? [],
    rawJsonLd: parsedFields.rawJsonLd ?? [],
    oaiSearchBotDirective,
    oaiAdsBotDirective,
    googleExtendedDirective,
    googlebotDirective,
    perplexityBotDirective,
    potentialBotBarrier,
    detectedSiteType,
    htmlFetched,
    robotsFetched,
    botDirectives,
    fetchMode: htmlFetched ? (isSameOrigin ? 'same-origin' : 'proxy') : 'failed',
    htmlLang: parsedFields.htmlLang ?? null,
    ogTitle: parsedFields.ogTitle ?? null,
    ogUrl: parsedFields.ogUrl ?? null,
    twitterCard: parsedFields.twitterCard ?? null,
    hreflangTags: parsedFields.hreflangTags ?? [],
    fetchError: htmlFetched ? null : 'Client proxy fetch did not return HTML',
  };
}

