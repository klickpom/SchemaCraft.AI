/**
 * Audit pipeline: server payload → parsed facts → checks → scores.
 * Every number in the report is derived from `checks`; nothing is hardcoded.
 */
import { buildChecks, type CheckContext } from './checks';
import { fetchAuditPayload, normalizeAuditUrl } from './client';
import { openingDefinition, parsePage, type PageFacts } from './html';
import { parseRobots } from './robots';
import { analyzeSchema, SCHEMA_SETS, type SchemaAnalysis } from './schema';
import type {
  AIOpportunity,
  AuditCheck,
  AuditFailure,
  AuditIssue,
  AuditReport,
  Category,
  CategoryScores,
  PageType,
  ServerPayload,
} from './types';

export const ENGINE_VERSION = 'Audit Engine 2.0';

const CATEGORY_WEIGHTS: Record<Category, number> = {
  technical: 0.2,
  crawlability: 0.2,
  content: 0.2,
  entity: 0.15,
  ai_readiness: 0.25,
};

const CREDIT: Record<string, number> = { pass: 1, warn: 0.5, fail: 0 };

/** Gate checks that make a page invisible in search regardless of everything else. */
const GATES: Record<string, { en: string; ar: string }> = {
  indexability: { en: 'the page is set to noindex', ar: 'الصفحة مضبوطة على noindex' },
  'robots-googlebot': { en: 'robots.txt blocks Googlebot from this URL', ar: 'robots.txt يمنع Googlebot من هذا الرابط' },
};
const GATE_CAP = 40;
/** A page with almost no server-rendered text has nothing to rank or cite. */
const THIN_CAP = 50;

const CHALLENGE_MARKERS = /bm-verify=|\/_sec\/verify\?provider=interstitial|challenge-platform|<title>Just a moment|_Incapsula_Resource|px-captcha|sgcaptcha|captcha-delivery\.com/i;

function generateId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 6; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

function siteNameFrom(page: PageFacts, schema: SchemaAnalysis, url: string): string {
  if (page.og.site_name) return page.og.site_name;
  if (schema.identity?.name) return schema.identity.name;
  if (page.title) {
    const parts = page.title.split(/\s+[|–—·:]\s+|\s+-\s+/).map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      const last = parts[parts.length - 1];
      if (last.length <= 32) return last;
      if (parts[0].length <= 32) return parts[0];
    }
  }
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const label = host.split('.')[0];
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return 'Your brand';
  }
}

function detectPageType(page: PageFacts, schema: SchemaAnalysis, path: string): PageType {
  const types = schema.types.concat(schema.nodes.map((n) => n.types[0]));
  const has = (set: Set<string>) => types.some((t) => set.has(t));
  const ogType = (page.og.type || '').toLowerCase();
  if (path === '/' || path === '') return 'home';
  if (types.includes('Product') || ogType === 'product' || (page.priceSignals && page.cartSignals)) return 'product';
  if (has(SCHEMA_SETS.ARTICLE_TYPES) || ogType === 'article' || (page.hasArticleElement && (page.dates.published || page.dates.timeElements > 0))) return 'article';
  if (has(SCHEMA_SETS.LOCAL_TYPES) || (page.addressSignals && page.telLinks > 0)) return 'local';
  if (has(SCHEMA_SETS.SOFTWARE_TYPES)) return 'software';
  const head = `${page.title || ''} ${page.h1.join(' ')} ${page.text.slice(0, 4000)}`;
  const saasSignals = [/free trial|start for free|try (it )?free|get started free/i, /pricing|plans/i, /per month|\/mo\b|\/month|billed (annually|monthly)/i, /book a demo|request a demo|sign up|create (an )?account/i, /\bsaas\b|integrations?\b|dashboard/i];
  if (saasSignals.filter((re) => re.test(head)).length >= 3) return 'software';
  return 'general';
}

function legacySiteType(pageType: PageType, page: PageFacts): AuditReport['detectedSiteType'] {
  const head = `${page.title || ''} ${page.h1.join(' ')} ${page.text.slice(0, 2000)}`.toLowerCase();
  if (pageType === 'product') return 'ecommerce';
  if (pageType === 'software') return 'saas';
  if (/clinic|dental|doctor|patient|medical|عيادة|طبيب|أسنان/.test(head)) return 'clinic';
  if (/agency|marketing|consult|وكالة|تسويق/.test(head)) return 'agency';
  if (/software|saas|platform|api|app\b/.test(head)) return 'saas';
  return 'general';
}

function jsDependence(page: PageFacts): CheckContext['jsDependent'] {
  const noscriptAsks = /enable javascript|javascript is (required|disabled)|تفعيل الجافا|يرجى تفعيل/i.test(page.noscriptText);
  if (page.wordCount < 120 && (page.spaRoot || page.scripts.total >= 3 || noscriptAsks)) return 'yes';
  if (page.wordCount < 300 && (page.spaRoot && (page.frameworkHints.includes('Vite SPA') || page.frameworkHints.includes('Angular')) || noscriptAsks)) return 'partial';
  return 'no';
}

function failure(code: AuditFailure['code'], en: string, ar: string): AuditFailure {
  return { code, message: en, messageAr: ar };
}

function failureFromPayload(payload: ServerPayload | null): AuditFailure | null {
  if (!payload) {
    return failure('unreachable', 'The SchemaCraft fetch service did not respond. Please try again in a moment.', 'خدمة الجلب في SchemaCraft لم تستجب. حاول مرة أخرى بعد قليل.');
  }
  if (payload.ok === false) {
    switch (payload.error) {
      case 'blocked_url':
        return failure('blocked_url', 'This URL cannot be audited. Use a public http(s) address (private, local and non-standard ports are blocked).', 'لا يمكن فحص هذا الرابط. استخدم عنوان http(s) عاماً (العناوين الخاصة والمحلية والمنافذ غير القياسية محظورة).');
      case 'rate_limited':
        return failure('rate_limited', 'Too many audits from your network in the last 10 minutes. Please wait a few minutes.', 'عدد كبير من الفحوصات من شبكتك خلال آخر 10 دقائق. انتظر بضع دقائق.');
      case 'dns':
        return failure('dns', 'The domain name does not resolve (DNS lookup failed). Check the spelling or your DNS records.', 'اسم النطاق لا يُترجم لعنوان (فشل DNS). راجع الكتابة أو سجلات DNS.');
      case 'timeout':
        return failure('timeout', 'The server did not respond within 15 seconds. Search crawlers may time out too.', 'السيرفر لم يستجب خلال 15 ثانية. زواحف البحث قد تفشل أيضاً.');
      case 'ssl':
        return failure('ssl', 'The TLS/SSL certificate could not be verified (expired, self-signed or wrong host). Browsers and crawlers will refuse it too.', 'تعذر التحقق من شهادة SSL (منتهية أو ذاتية التوقيع أو لنطاق آخر). المتصفحات والزواحف سترفضها أيضاً.');
      case 'connect':
      case 'connection_reset':
      case 'empty_reply':
        return failure('connect', 'The server refused or dropped the connection.', 'السيرفر رفض الاتصال أو قطعه.');
      case 'too_many_redirects':
        return failure('too_many_redirects', 'More than 6 redirects — likely a redirect loop.', 'أكثر من 6 تحويلات — غالباً حلقة تحويل لا تنتهي.');
      default:
        return failure('unreachable', 'The page could not be fetched from our server.', 'تعذر جلب الصفحة من سيرفرنا.');
    }
  }
  const status = payload.status ?? null;
  const html = payload.html || '';
  const contentType = (payload.headers?.['content-type'] || '').toLowerCase();
  if (status !== 200) {
    const challenged = (payload.probes?.bots || []).some((b) => b.challenge) || [401, 403, 406, 429, 503].includes(status || 0);
    if (challenged) {
      return failure('bot_protection', `The site answered HTTP ${status} to our server${(payload.probes?.bots || []).every((b) => (b.status || 0) >= 400) ? ' and to every crawler user-agent we tried' : ''}. A firewall or bot protection is blocking automated requests, so the page could not be inspected.`,
        `الموقع رد بـ HTTP ${status} على سيرفرنا${(payload.probes?.bots || []).every((b) => (b.status || 0) >= 400) ? ' وعلى كل وكلاء الزواحف التي جربناها' : ''}. جدار حماية أو نظام حماية من البوتات يمنع الطلبات الآلية، فلم نتمكن من فحص الصفحة.`);
    }
    return failure('http_status', `The URL returned HTTP ${status}. Search engines do not index pages that do not return 200.`, `الرابط رجع HTTP ${status}. محركات البحث لا تفهرس الصفحات التي لا ترجع 200.`);
  }
  if (contentType && !/html|xml/.test(contentType)) {
    return failure('not_html', `The URL returned ${contentType.split(';')[0]}, not an HTML page.`, `الرابط رجع ${contentType.split(';')[0]} وليس صفحة HTML.`);
  }
  if (html.trim().length < 50) {
    return failure('empty', 'The server returned an empty HTML document.', 'السيرفر رجع مستند HTML فارغاً.');
  }
  const challenge = payload.fetch?.challenge || (html.length < 60000 && CHALLENGE_MARKERS.test(html) ? 'interstitial' : null);
  if (challenge) {
    return failure('bot_protection', `The site served a bot-verification page (${challenge}) instead of its content, so the real page could not be inspected. Crawlers that are not allow-listed may see the same page.`,
      `الموقع قدّم صفحة تحقق من البوتات (${challenge}) بدلاً من المحتوى، فلم نتمكن من فحص الصفحة الحقيقية. الزواحف غير المسموح لها قد ترى نفس الصفحة.`);
  }
  return null;
}

export function scoreChecks(checks: AuditCheck[]): CategoryScores & { overall: number | null } {
  const cat = (category: Category): number | null => {
    const scored = checks.filter((c) => c.category === category && c.weight > 0);
    if (scored.length === 0) return null;
    const total = scored.reduce((s, c) => s + c.weight, 0);
    const earned = scored.reduce((s, c) => s + c.weight * (CREDIT[c.status] ?? 0), 0);
    return Math.round((100 * earned) / total);
  };
  const scores: Record<Category, number | null> = {
    technical: cat('technical'),
    crawlability: cat('crawlability'),
    content: cat('content'),
    entity: cat('entity'),
    ai_readiness: cat('ai_readiness'),
  };
  const parts = (Object.keys(scores) as Category[]).filter((k) => scores[k] !== null);
  const weight = parts.reduce((s, k) => s + CATEGORY_WEIGHTS[k], 0);
  const overall = weight > 0 ? Math.round(parts.reduce((s, k) => s + (scores[k] as number) * CATEGORY_WEIGHTS[k], 0) / weight) : null;
  return {
    technicalSEO: scores.technical,
    crawlability: scores.crawlability,
    contentAnswerability: scores.content,
    entitySchema: scores.entity,
    aiSearchReadiness: scores.ai_readiness,
    overall,
  };
}

function toIssue(check: AuditCheck, index: number): AuditIssue {
  return {
    id: check.id,
    category: check.category,
    severity: check.severity,
    weight: check.weight,
    status: check.status as 'fail' | 'warn',
    title: check.title,
    titleAr: check.titleAr,
    signalDetected: check.detail,
    signalDetectedAr: check.detailAr,
    evidence: check.evidence,
    evidenceAr: check.evidenceAr,
    whyItMatters: check.why,
    whyItMattersAr: check.whyAr,
    recommendedAction: check.fix,
    recommendedActionAr: check.fixAr,
    fixCategory: check.fixCategory,
    fixSnippet: check.fixSnippet,
    isFreePreview: index < 3,
  };
}

function priority(check: AuditCheck): number {
  return check.weight * (check.status === 'fail' ? 2 : 1);
}

function opportunities(page: PageFacts, schema: SchemaAnalysis, pageType: PageType, brand: string, checks: AuditCheck[]): AIOpportunity[] {
  const status = (id: string) => checks.find((c) => c.id === id)?.status;
  const headingText = page.headings.map((h) => h.text).join(' \n ').toLowerCase();
  const textHead = page.text.slice(0, 15000).toLowerCase();
  const types = schema.nodes.flatMap((n) => n.types);
  const out: AIOpportunity[] = [];

  const definition = status('answer-first') === 'pass';
  const definedLater = openingDefinition(page.openingParagraphs || []);
  const buried = definedLater && definedLater.index > 0;
  out.push({
    query: `What is ${brand}?`,
    queryAr: `ما هو ${brand}؟`,
    intent: 'informational',
    status: definition && schema.identity ? 'covered' : (buried || page.leadParagraph) ? 'partially_covered' : 'missing',
    reason: definition && schema.identity
      ? 'Clear definition paragraph plus an Organization entity — easy to quote and attribute.'
      : buried
        ? `A definition is in paragraph ${definedLater.index + 1}, so an assistant that quotes the opening will miss it.`
        : page.leadParagraph
          ? 'There is an opening paragraph, but it either lacks a direct definition or an entity in schema to attribute it to.'
          : 'No definition-style paragraph in the server HTML.',
    reasonAr: definition && schema.identity
      ? 'فقرة تعريف واضحة مع كيان Organization — سهلة الاقتباس والنسب.'
      : buried
        ? `التعريف في الفقرة ${definedLater.index + 1}، فالمساعد الذي يقتبس الافتتاح لن يراه.`
        : page.leadParagraph
          ? 'توجد فقرة افتتاحية لكنها تفتقد تعريفاً مباشراً أو كياناً في السكيما يُنسب إليه.'
          : 'لا توجد فقرة تعريفية في HTML السيرفر.',
  });

  if (pageType === 'product') {
    const offers = types.includes('Offer') || types.includes('AggregateOffer');
    const name = page.h1[0] || brand;
    out.push({
      query: `${name} price and reviews`,
      queryAr: `سعر وتقييمات ${name}`,
      intent: 'commercial',
      status: offers && page.priceSignals ? (types.includes('AggregateRating') ? 'covered' : 'partially_covered') : page.priceSignals ? 'partially_covered' : 'missing',
      reason: offers ? (types.includes('AggregateRating') ? 'Price and rating are marked up.' : 'Price is marked up; no AggregateRating from real reviews.') : page.priceSignals ? 'A price is visible but not in Product/Offer schema.' : 'No visible price.',
      reasonAr: offers ? (types.includes('AggregateRating') ? 'السعر والتقييم موجودان في السكيما.' : 'السعر في السكيما؛ لا يوجد AggregateRating من تقييمات حقيقية.') : page.priceSignals ? 'السعر ظاهر لكنه ليس في سكيما Product/Offer.' : 'لا يوجد سعر ظاهر.',
    });
  } else if (pageType === 'local') {
    const local = types.some((t) => SCHEMA_SETS.LOCAL_TYPES.has(t));
    const service = page.h1[0] || brand;
    out.push({
      query: `${service} near me`,
      queryAr: `${service} بالقرب مني`,
      intent: 'local',
      status: local ? 'covered' : page.addressSignals || page.telLinks ? 'partially_covered' : 'missing',
      reason: local ? 'LocalBusiness markup present — verify address, hours and geo match your Google Business Profile.' : page.addressSignals || page.telLinks ? 'Address/phone visible but not marked up as LocalBusiness.' : 'No address or phone in the HTML.',
      reasonAr: local ? 'سكيما LocalBusiness موجودة — تأكد من تطابق العنوان والمواعيد والإحداثيات مع ملفك في Google.' : page.addressSignals || page.telLinks ? 'العنوان/الهاتف ظاهر لكنه ليس في سكيما LocalBusiness.' : 'لا يوجد عنوان أو هاتف في HTML.',
    });
  } else {
    const pricing = /pricing|price|plans|\$\s?\d|€\s?\d|الأسعار|السعر|الباقات/.test(headingText) || /\/pricing/.test(page.links.internalSamples.map((l) => l.href).join(' '));
    out.push({
      query: `${brand} pricing`,
      queryAr: `أسعار ${brand}`,
      intent: 'commercial',
      status: pricing && (types.includes('Offer') || types.includes('AggregateOffer')) ? 'covered' : pricing ? 'partially_covered' : 'missing',
      reason: pricing ? (types.includes('Offer') ? 'Pricing content and Offer markup found.' : 'Pricing is mentioned, but without Offer markup engines must parse it from text.') : 'No pricing section or link detected on this page.',
      reasonAr: pricing ? (types.includes('Offer') ? 'محتوى الأسعار وسكيما Offer موجودان.' : 'الأسعار مذكورة لكن بدون سكيما Offer فتضطر المحركات لاستخراجها من النص.') : 'لا يوجد قسم أو رابط أسعار في هذه الصفحة.',
    });
  }

  const steps = /how (it|does|to)|step|كيف|خطوات|طريقة/.test(headingText);
  out.push({
    query: `How does ${brand} work?`,
    queryAr: `كيف يعمل ${brand}؟`,
    intent: 'informational',
    status: steps && page.listCount > 0 ? 'covered' : steps || page.listCount > 0 ? 'partially_covered' : 'missing',
    reason: steps && page.listCount > 0 ? 'A how-it-works section with a list is present.' : steps ? 'A how-it-works heading exists, but steps are not in a list.' : page.listCount > 0 ? 'Lists exist but no explicit how-it-works section.' : 'No process/steps content.',
    reasonAr: steps && page.listCount > 0 ? 'قسم "كيف يعمل" مع قائمة موجود.' : steps ? 'يوجد عنوان "كيف يعمل" لكن الخطوات ليست في قائمة.' : page.listCount > 0 ? 'توجد قوائم لكن بدون قسم واضح لطريقة العمل.' : 'لا يوجد محتوى خطوات أو طريقة عمل.',
  });

  const comparison = /\bvs\.?\b|versus|compare|comparison|alternative|مقارنة|بديل|مقابل/.test(headingText);
  out.push({
    query: `${brand} vs alternatives`,
    queryAr: `${brand} مقارنة بالبدائل`,
    intent: 'comparison',
    status: comparison && page.tableCount > 0 ? 'covered' : comparison || page.tableCount > 0 ? 'partially_covered' : 'missing',
    reason: comparison && page.tableCount > 0 ? 'Comparison heading and a table — the format engines reuse for "X vs Y" answers.' : comparison ? 'Comparison is discussed but not in a table.' : page.tableCount > 0 ? 'A table exists but is not framed as a comparison.' : 'No comparison content; engines will cite third-party comparisons instead.',
    reasonAr: comparison && page.tableCount > 0 ? 'عنوان مقارنة وجدول — الصيغة التي تعيد المحركات استخدامها في إجابات "س مقابل ص".' : comparison ? 'المقارنة مذكورة لكن ليست في جدول.' : page.tableCount > 0 ? 'يوجد جدول لكنه غير مصاغ كمقارنة.' : 'لا يوجد محتوى مقارنة؛ ستقتبس المحركات مقارنات من مواقع أخرى.',
  });

  const reviews = types.includes('AggregateRating') || types.includes('Review') || /review|testimonial|rating|تقييم|آراء العملاء/.test(headingText) || /trustpilot|g2\.com|capterra/.test(textHead);
  out.push({
    query: `Is ${brand} legit? Reviews`,
    queryAr: `هل ${brand} موثوق؟ التقييمات`,
    intent: 'commercial',
    status: reviews && page.links.trust.contact ? 'covered' : reviews || page.links.trust.about ? 'partially_covered' : 'missing',
    reason: reviews ? 'Reviews or testimonials are present on the page.' : page.links.trust.about ? 'About page linked, but no reviews or testimonials on this page.' : 'No reviews, testimonials or trust pages detected.',
    reasonAr: reviews ? 'التقييمات أو آراء العملاء موجودة في الصفحة.' : page.links.trust.about ? 'صفحة من نحن مرتبطة لكن لا توجد تقييمات أو آراء عملاء.' : 'لا توجد تقييمات أو آراء أو صفحات ثقة.',
  });

  return out;
}

function emptyScores(): CategoryScores {
  return { technicalSEO: null, crawlability: null, contentAnswerability: null, entitySchema: null, aiSearchReadiness: null };
}

export interface BuildOptions {
  Parser?: new () => { parseFromString(html: string, type: string): Document };
  isDemo?: boolean;
  id?: string;
  now?: Date;
}

export function buildReport(requestedUrl: string, payload: ServerPayload | null, options: BuildOptions = {}): AuditReport {
  const id = options.id || generateId();
  const timestamp = (options.now || new Date()).toISOString();
  const fail = failureFromPayload(payload);
  const finalUrl = payload?.finalUrl || null;

  const base: AuditReport = {
    id,
    url: requestedUrl,
    finalUrl,
    timestamp,
    engineVersion: ENGINE_VERSION,
    isDemo: !!options.isDemo,
    failure: fail,
    overallScore: null,
    uncappedScore: null,
    scoreCap: null,
    categoryScores: emptyScores(),
    checks: [],
    counts: { pass: 0, warn: 0, fail: 0, info: 0, notAssessed: 0, critical: 0 },
    criticalBlockers: [],
    allIssues: [],
    aiOpportunities: [],
    botMatrix: [],
    pageType: 'general',
    detectedSiteType: 'general',
    summary: {
      status: payload?.status ?? null,
      redirects: payload?.redirects || [],
      ttfbMs: payload?.fetch?.ttfbMs ?? null,
      htmlBytes: payload?.htmlBytes ?? (payload?.html ? payload.html.length : null),
      compression: payload?.headers?.['content-encoding'] || null,
      httpVersion: payload?.fetch?.httpVersion || null,
      uaMode: payload?.fetch?.uaMode || null,
      wordCount: null,
      schemaTypes: [],
      title: null,
      metaDescription: null,
      h1: null,
      lang: null,
      platform: [],
      leadParagraph: null,
      aiVisibleText: '',
      ogImage: null,
      siteName: null,
    },
  };
  if (fail || !payload) return base;

  const url = payload.finalUrl || requestedUrl;
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { ...base, failure: failure('blocked_url', 'Invalid URL.', 'رابط غير صالح.') };
  }
  const origin = parsedUrl.origin;
  const path = `${parsedUrl.pathname || '/'}${parsedUrl.search}`;

  const page = parsePage(payload.html || '', url, options.Parser);
  const schema = analyzeSchema(page.jsonLd);

  const robotsStatus = payload.robotsStatus ?? null;
  let robotsState: CheckContext['robotsState'];
  if (robotsStatus === 200) robotsState = 'ok';
  else if (robotsStatus !== null && robotsStatus >= 400 && robotsStatus < 500 && robotsStatus !== 429) robotsState = 'missing';
  else if (robotsStatus !== null && (robotsStatus >= 500 || robotsStatus === 429)) robotsState = 'server_error';
  else robotsState = 'unreachable';
  const robots = robotsState === 'ok' ? parseRobots(payload.robotsTxt || '') : null;

  const headers: Record<string, string> = {};
  Object.entries(payload.headers || {}).forEach(([k, v]) => {
    headers[k.toLowerCase()] = String(v);
  });

  const siteName = siteNameFrom(page, schema, url);
  const pageType = detectPageType(page, schema, parsedUrl.pathname || '/');
  const ctx: CheckContext = {
    url,
    origin,
    path,
    payload,
    headers,
    page,
    schema,
    robots,
    robotsState,
    pageType,
    siteName,
    jsDependent: jsDependence(page),
  };

  const { checks, matrix } = buildChecks(ctx);
  const scores = scoreChecks(checks);

  const failedGates = checks.filter((c) => GATES[c.id] && c.status === 'fail');
  const thin = checks.some((c) => c.id === 'content-depth' && c.status === 'fail');
  let overall = scores.overall;
  let scoreCap: AuditReport['scoreCap'] = null;
  if (failedGates.length > 0 && overall !== null && overall > GATE_CAP) {
    scoreCap = {
      cap: GATE_CAP,
      reason: `Capped at ${GATE_CAP} because ${failedGates.map((c) => GATES[c.id].en).join(' and ')}.`,
      reasonAr: `الدرجة محدودة بـ ${GATE_CAP} لأن ${failedGates.map((c) => GATES[c.id].ar).join(' و')}.`,
    };
    overall = GATE_CAP;
  } else if (ctx.jsDependent === 'yes' && overall !== null && overall > THIN_CAP) {
    scoreCap = {
      cap: THIN_CAP,
      reason: `Capped at ${THIN_CAP} because the server HTML has only ${page.wordCount} words. ChatGPT, Perplexity and Claude do not run JavaScript, so they see an almost empty page. Google does run JavaScript and can still index and rank this page — this cap is not a traffic or ranking score.`,
      reasonAr: `الدرجة محدودة بـ ${THIN_CAP} لأن HTML السيرفر فيه ${page.wordCount} كلمة فقط. ChatGPT وPerplexity وClaude لا يشغّلون الجافاسكربت فيرون صفحة شبه فارغة. جوجل يشغّل الجافاسكربت وقد يفهرس الصفحة ويرتبها — هذا السقف ليس عدد زيارات ولا ترتيب بحث.`,
    };
    overall = THIN_CAP;
  } else if (thin && overall !== null && overall > THIN_CAP) {
    scoreCap = {
      cap: THIN_CAP,
      reason: `Capped at ${THIN_CAP} because the page has only ${page.wordCount} words of text — too little to rank or be quoted, however clean the technical setup is.`,
      reasonAr: `الدرجة محدودة بـ ${THIN_CAP} لأن الصفحة فيها ${page.wordCount} كلمة فقط — أقل من أن تتصدر أو يُقتبس منها مهما كان الإعداد التقني سليماً.`,
    };
    overall = THIN_CAP;
  }

  const issues = checks
    .filter((c) => c.status === 'fail' || c.status === 'warn')
    .sort((a, b) => priority(b) - priority(a))
    .map(toIssue);

  return {
    ...base,
    url: requestedUrl,
    finalUrl: url,
    overallScore: overall,
    uncappedScore: scores.overall,
    scoreCap,
    categoryScores: {
      technicalSEO: scores.technicalSEO,
      crawlability: scores.crawlability,
      contentAnswerability: scores.contentAnswerability,
      entitySchema: scores.entitySchema,
      aiSearchReadiness: scores.aiSearchReadiness,
    },
    checks,
    counts: {
      pass: checks.filter((c) => c.status === 'pass').length,
      warn: checks.filter((c) => c.status === 'warn').length,
      fail: checks.filter((c) => c.status === 'fail').length,
      info: checks.filter((c) => c.status === 'info').length,
      notAssessed: checks.filter((c) => c.status === 'not_assessed').length,
      critical: checks.filter((c) => c.status === 'fail' && c.severity === 'critical').length,
    },
    criticalBlockers: issues.slice(0, 3),
    allIssues: issues,
    aiOpportunities: opportunities(page, schema, pageType, siteName, checks),
    botMatrix: matrix,
    pageType,
    detectedSiteType: legacySiteType(pageType, page),
    summary: {
      ...base.summary,
      wordCount: page.wordCount,
      schemaTypes: schema.types,
      title: page.title,
      metaDescription: page.metaDescription,
      h1: page.h1[0] || null,
      lang: page.lang,
      platform: page.frameworkHints,
      leadParagraph: page.leadParagraph,
      aiVisibleText: page.text.slice(0, 900),
      ogImage: page.og.image || null,
      siteName,
    },
  };
}

export { fetchAuditPayload, normalizeAuditUrl };

export async function runAudit(input: string): Promise<AuditReport> {
  const url = normalizeAuditUrl(input);
  if (!url) {
    return buildReport(input, { ok: false, error: 'blocked_url' });
  }
  const payload = await fetchAuditPayload(url);
  return buildReport(url, payload);
}
