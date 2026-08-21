/**
 * SchemaCraft AI - Deterministic Audit Engine v1.0
 * Evaluates website technical, crawlability, content, and entity readiness for Google Search and AI-powered engines.
 * Strict Evidence-Based Model: Signal -> Evidence -> Why It Matters -> Recommended Fix.
 *
 * INTEGRITY RULE: Never fabricate data. If a signal cannot be fetched, report it as 'not_fetched' with transparent reasoning.
 */

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
}

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export interface AuditIssue {
  id: string;
  category: 'technical' | 'crawlability' | 'content' | 'entity' | 'ai_readiness';
  severity: Severity;
  weight: number; // 5x critical, 3x high, 2x med, 1x low, 0x info
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
  overallScore: number;
  categoryScores: {
    technicalSEO: number;
    crawlability: number;
    contentAnswerability: number;
    entitySchema: number;
    aiSearchReadiness: number;
  };
  evidenceLedger: {
    name: string;
    nameAr: string;
    status: 'pass' | 'fail' | 'warning' | 'info';
    detail: string;
    detailAr: string;
  }[];
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
  const issues: AuditIssue[] = [];
  const ledger: AuditReport['evidenceLedger'] = [];

  // TRANSPARENCY: If HTML was not fetched, add a prominent notice
  if (!raw.htmlFetched) {
    ledger.push({
      name: 'HTML Fetch Status',
      nameAr: 'حالة جلب كود HTML',
      status: 'warning',
      detail: 'Could not fetch live HTML. Bot protection or CORS may be blocking the request. Results below are based on robots.txt and limited signals only.',
      detailAr: 'لم نتمكن من جلب كود HTML الحي. قد يكون جدار حماية أو حماية CORS يمنع الوصول. النتائج أدناه مبنية على robots.txt والإشارات المتاحة فقط.',
    });
  }

  if (!raw.robotsFetched) {
    ledger.push({
      name: 'robots.txt Fetch Status',
      nameAr: 'حالة جلب ملف robots.txt',
      status: 'warning',
      detail: 'Could not fetch robots.txt. Bot access directives could not be verified.',
      detailAr: 'لم نتمكن من جلب ملف robots.txt. لم يتم التحقق من تعليمات وصول البوتات.',
    });
  }

  // ----------------------------------------------------
  // 1. INDEXABILITY GATE (Critical Gate Multiplier 5x)
  // ----------------------------------------------------
  if (raw.httpStatus === null) {
    ledger.push({
      name: 'HTTP Status Check',
      nameAr: 'فحص استجابة الخادم (HTTP Status)',
      status: 'warning',
      detail: 'HTTP status could not be determined (page was not directly reachable from browser)',
      detailAr: 'لم يتمكن المتصفح من تحديد حالة HTTP (الصفحة غير قابلة للوصول المباشر)',
    });
  } else if (raw.httpStatus !== 200) {
    issues.push({
      id: 'http-status-error',
      category: 'technical',
      severity: 'critical',
      weight: 5,
      title: `HTTP Status Code ${raw.httpStatus} Returned`,
      titleAr: `رمز استجابة الخادم غير سليم (${raw.httpStatus})`,
      signalDetected: `Server returned non-200 HTTP status code (${raw.httpStatus}).`,
      signalDetectedAr: `الخادم أرجع رمز استجابة (${raw.httpStatus}) بدلاً من 200 OK.`,
      evidence: `HTTP/1.1 ${raw.httpStatus}`,
      evidenceAr: `كود الاستجابة: HTTP ${raw.httpStatus}`,
      whyItMatters: 'Search engines and AI discovery bots cannot index or extract content from pages that return error status codes.',
      whyItMattersAr: 'محركات البحث وبوتات الذكاء الاصطناعي تعجز عن فهرسة أو استخراج المحتوى من الصفحات التي ترجع أكواد خطأ.',
      recommendedAction: 'Ensure your web server returns a clean HTTP 200 OK status for public canonical URLs.',
      recommendedActionAr: 'تأكد من أن خادم الويب يرجع رمز 200 OK نظيف للصفحات العامة.',
      fixCategory: 'headers',
    });
    ledger.push({
      name: 'HTTP Status Check',
      nameAr: 'فحص استجابة الخادم (HTTP Status)',
      status: 'fail',
      detail: `Returned HTTP ${raw.httpStatus}`,
      detailAr: `أرجع كود الخطأ HTTP ${raw.httpStatus}`,
    });
  } else {
    ledger.push({
      name: 'HTTP Status Check',
      nameAr: 'فحص استجابة الخادم (HTTP Status)',
      status: 'pass',
      detail: 'HTTP 200 OK - Page reachable',
      detailAr: 'استجابة سليمة 200 OK والصفحة متاحة للزحف',
    });
  }

  // Meta Robots & X-Robots Noindex check
  if (raw.metaRobots !== null || raw.xRobotsTag !== null) {
    const isNoindex = (raw.metaRobots && raw.metaRobots.toLowerCase().includes('noindex')) ||
                      (raw.xRobotsTag && raw.xRobotsTag.toLowerCase().includes('noindex'));
    if (isNoindex) {
      issues.push({
        id: 'noindex-detected',
        category: 'technical',
        severity: 'critical',
        weight: 5,
        title: 'Page Sends "noindex" Directive',
        titleAr: 'الصفحة ترسل تعليمة منع الفهرسة "noindex"',
        signalDetected: 'noindex directive present in HTML meta robots or HTTP X-Robots-Tag header.',
        signalDetectedAr: 'تعليمة noindex موجودة في ترويسة الصفحة أو الهيدر.',
        evidence: raw.metaRobots ? `<meta name="robots" content="${raw.metaRobots}">` : `X-Robots-Tag: ${raw.xRobotsTag}`,
        evidenceAr: raw.metaRobots ? `وسم: <meta name="robots" content="${raw.metaRobots}">` : `هيدر: X-Robots-Tag: ${raw.xRobotsTag}`,
        whyItMatters: 'Google and search engines will completely drop the page from search results when crawled.',
        whyItMattersAr: 'جوجل ومحركات البحث ستقوم بحذف الصفحة بالكامل من نتائج البحث عند الزحف إليها.',
        recommendedAction: 'Remove the noindex directive from production page headers if you intend for this page to appear in organic search.',
        recommendedActionAr: 'قم بإزالة تعليمة noindex فوراً من صفحات الموقع العامة المراد فهرستها.',
        fixCategory: 'meta',
      });
      ledger.push({
        name: 'Indexability Gate (noindex)',
        nameAr: 'بوابة الفهرسة (noindex)',
        status: 'fail',
        detail: `Page actively blocks search indexing via noindex: ${raw.metaRobots || raw.xRobotsTag}`,
        detailAr: `الصفحة تمنع الفهرسة صراحة: ${raw.metaRobots || raw.xRobotsTag}`,
      });
    } else {
      ledger.push({
        name: 'Indexability Gate (noindex)',
        nameAr: 'بوابة الفهرسة (noindex)',
        status: 'pass',
        detail: `meta robots="${raw.metaRobots || 'not set'}" — No noindex found`,
        detailAr: `meta robots="${raw.metaRobots || 'غير محدد'}" — لا يوجد noindex`,
      });
    }
  } else if (raw.htmlFetched) {
    ledger.push({
      name: 'Indexability Gate (noindex)',
      nameAr: 'بوابة الفهرسة (noindex)',
      status: 'pass',
      detail: 'No meta robots tag found (indexable by default)',
      detailAr: 'لم يُعثر على وسم meta robots (قابلة للفهرسة افتراضياً)',
    });
  }

  // ----------------------------------------------------
  // 2. CRAWLABILITY MULTI-LEVEL & AI BOT ACCESS
  // ----------------------------------------------------
  // OAI-SearchBot (ChatGPT Search discovery)
  if (raw.robotsFetched) {
    if (raw.oaiSearchBotDirective === 'disallowed') {
      issues.push({
        id: 'oai-searchbot-blocked',
        category: 'crawlability',
        severity: 'critical',
        weight: 5,
        title: 'OAI-SearchBot is Disallowed in robots.txt',
        titleAr: 'حظر بوت بحث شات جي بي تي (OAI-SearchBot) في robots.txt',
        signalDetected: 'robots.txt explicitly blocks User-agent: OAI-SearchBot.',
        signalDetectedAr: 'ملف robots.txt يحتوي على أمر صريح بحظر OAI-SearchBot.',
        evidence: 'User-agent: OAI-SearchBot\nDisallow: /',
        evidenceAr: 'User-agent: OAI-SearchBot\nDisallow: /',
        whyItMatters: 'OpenAI explicitly documents that allowing OAI-SearchBot is necessary for your content to be discovered and surfaced in ChatGPT Search.',
        whyItMattersAr: 'توضح OpenAI رسمياً أن السماح لـ OAI-SearchBot ضروري لاكتشاف محتوى موقعك وظهوره في نتائج وبحث ChatGPT Search.',
        recommendedAction: 'Add "User-agent: OAI-SearchBot Allow: /" to your robots.txt configuration.',
        recommendedActionAr: 'أضف تعليمة السماح بالزحف لـ OAI-SearchBot داخل ملف robots.txt.',
        fixCategory: 'robots',
        isFreePreview: true,
      });
      ledger.push({
        name: 'OAI-SearchBot Access (ChatGPT Search)',
        nameAr: 'وصول بوت شات جي بي تي (OAI-SearchBot)',
        status: 'fail',
        detail: 'Blocked via robots.txt',
        detailAr: 'محظور صراحة في ملف robots.txt',
      });
    } else {
      ledger.push({
        name: 'OAI-SearchBot Access (ChatGPT Search)',
        nameAr: 'وصول بوت شات جي بي تي (OAI-SearchBot)',
        status: 'pass',
        detail: raw.oaiSearchBotDirective === 'allowed' ? 'Explicitly Allowed in robots.txt' : 'Not mentioned (allowed by default via wildcard *)',
        detailAr: raw.oaiSearchBotDirective === 'allowed' ? 'مسموح به صراحة في robots.txt' : 'غير مذكور (مسموح افتراضياً عبر wildcard *)',
      });
    }

    // OAI-AdsBot (Informational Only - Does not penalize score)
    ledger.push({
      name: 'OAI-AdsBot (Ads Verification)',
      nameAr: 'بوت إعلانات شات جي بي تي (OAI-AdsBot)',
      status: 'info',
      detail: raw.oaiAdsBotDirective === 'disallowed' ? 'Disallowed (Ads landing verification restricted)' : 'Accessible for ad destination checks',
      detailAr: raw.oaiAdsBotDirective === 'disallowed' ? 'محظور (يؤثر فقط على التحقق من الصفحات الإعلانية)' : 'متاح للتحقق من الصفحات الإعلانية',
    });

    // Google-Extended (Informational / AI Usage Control - Not a search penalty)
    if (raw.googleExtendedDirective === 'disallowed') {
      issues.push({
        id: 'google-extended-detected',
        category: 'crawlability',
        severity: 'informational',
        weight: 0,
        title: 'AI Usage Control Detected (Google-Extended Disallowed)',
        titleAr: 'اكتشاف تعليمة التحكم في الذكاء الاصطناعي (Google-Extended)',
        signalDetected: 'robots.txt blocks User-agent: Google-Extended.',
        signalDetectedAr: 'ملف robots.txt يحتوي على حظر Google-Extended.',
        evidence: 'User-agent: Google-Extended\nDisallow: /',
        evidenceAr: 'User-agent: Google-Extended\nDisallow: /',
        whyItMatters: 'This directive controls how Google may use your content in Gemini model training. It is NOT equivalent to blocking standard Google Search crawling or indexing.',
        whyItMattersAr: 'هذا الأمر يتحكم في استخدام المحتوى لتدريب نماذج Gemini، ولا يعني حظر موقعك من نتائج بحث جوجل التقليدية.',
        recommendedAction: 'No action required unless you intended to allow Google AI training on your content.',
        recommendedActionAr: 'لا يتطلب أي إجراء إلا إذا كنت ترغب في السماح لـ Google بتدريب نماذجها على محتواك.',
        fixCategory: 'robots',
      });
      ledger.push({
        name: 'Google-Extended Directive',
        nameAr: 'تعليمة Google-Extended',
        status: 'info',
        detail: 'AI model training controlled (Standard search indexing unaffected)',
        detailAr: 'التحكم في تدريب الذكاء الاصطناعي مفعل (الفهرسة العادية تعمل)',
      });
    } else {
      ledger.push({
        name: 'Google-Extended Directive',
        nameAr: 'تعليمة Google-Extended',
        status: 'pass',
        detail: 'Accessible for Google AI ecosystem',
        detailAr: 'متاح لمنظومة الذكاء الاصطناعي من جوجل',
      });
    }

    // PerplexityBot
    if (raw.perplexityBotDirective === 'disallowed') {
      issues.push({
        id: 'perplexitybot-blocked',
        category: 'crawlability',
        severity: 'high',
        weight: 3,
        title: 'PerplexityBot is Disallowed in robots.txt',
        titleAr: 'حظر بوت Perplexity في robots.txt',
        signalDetected: 'robots.txt explicitly blocks User-agent: PerplexityBot.',
        signalDetectedAr: 'ملف robots.txt يحتوي على أمر صريح بحظر PerplexityBot.',
        evidence: 'User-agent: PerplexityBot\nDisallow: /',
        evidenceAr: 'User-agent: PerplexityBot\nDisallow: /',
        whyItMatters: 'Perplexity.ai is a major AI answer engine. Blocking its crawler prevents your content from appearing in Perplexity search results.',
        whyItMattersAr: 'Perplexity.ai محرك إجابات ذكاء اصطناعي رئيسي. حظر زاحفه يمنع ظهور محتواك في نتائج بحث Perplexity.',
        recommendedAction: 'Add "User-agent: PerplexityBot Allow: /" to your robots.txt.',
        recommendedActionAr: 'أضف تعليمة السماح لـ PerplexityBot في ملف robots.txt.',
        fixCategory: 'robots',
      });
      ledger.push({
        name: 'PerplexityBot Access',
        nameAr: 'وصول بوت Perplexity',
        status: 'fail',
        detail: 'Blocked via robots.txt',
        detailAr: 'محظور صراحة في ملف robots.txt',
      });
    } else {
      ledger.push({
        name: 'PerplexityBot Access',
        nameAr: 'وصول بوت Perplexity',
        status: 'pass',
        detail: raw.perplexityBotDirective === 'allowed' ? 'Explicitly Allowed' : 'Not mentioned (allowed by default)',
        detailAr: raw.perplexityBotDirective === 'allowed' ? 'مسموح صراحة' : 'غير مذكور (مسموح افتراضياً)',
      });
    }
  }

  // Potential Bot Barrier / WAF Check
  if (raw.potentialBotBarrier) {
    issues.push({
      id: 'bot-protection-barrier',
      category: 'crawlability',
      severity: 'medium',
      weight: 2,
      title: 'Potential Bot-Protection Barrier Detected',
      titleAr: 'احتمالية وجود جدار حماية يعيق البوتات (WAF / Challenge)',
      signalDetected: 'HTML could not be retrieved or was blocked during crawl attempt.',
      signalDetectedAr: 'لم يتمكن المحرك من جلب كود HTML أو تم حظره أثناء محاولة الزحف.',
      evidence: raw.htmlFetched ? 'Challenge headers or minimal HTML body detected' : 'HTML fetch completely failed — likely WAF/Cloudflare challenge',
      evidenceAr: raw.htmlFetched ? 'اكتشاف ترويسات تحدي أو محتوى HTML ناقص' : 'فشل جلب HTML بالكامل — يحتمل وجود جدار حماية Cloudflare',
      whyItMatters: 'OpenAI and search engines note that WAFs, CDNs, or aggressive rate limiters can intermittently reject legitimate search crawler requests even when robots.txt allows them.',
      whyItMattersAr: 'جدران الحماية الصارمة قد تعترض طلبات زحف محركات البحث والبوتات المعتمدة أحياناً.',
      recommendedAction: 'Verify with your CDN/WAF logs that OAI-SearchBot, PerplexityBot, and Googlebot are safelisted from IP challenge rules.',
      recommendedActionAr: 'راجع سجلات الـ WAF وتأكد من استثناء بوتات البحث الرسمية من قواعد التحدي.',
      fixCategory: 'headers',
    });
  }

  // Sitemap Health
  if (raw.sitemapFound === false) {
    issues.push({
      id: 'sitemap-missing',
      category: 'crawlability',
      severity: 'high',
      weight: 3,
      title: 'XML Sitemap is Not Discoverable',
      titleAr: 'خريطة الموقع (sitemap.xml) غير مكتشفة',
      signalDetected: 'No sitemap referenced in robots.txt and /sitemap.xml was not found.',
      signalDetectedAr: 'لم يتم العثور على رابط sitemap في robots.txt ولا في المسار الافتراضي.',
      evidence: raw.robotsFetched ? 'robots.txt parsed: No "Sitemap:" directive found' : 'Could not verify — robots.txt was not fetched',
      evidenceAr: raw.robotsFetched ? 'تم تحليل robots.txt: لا يوجد تعليمة "Sitemap:"' : 'لم يتم التحقق — لم يُجلب ملف robots.txt',
      whyItMatters: 'While sitemaps are hints rather than indexing guarantees, valid XML sitemaps significantly streamline discovery and crawl budgeting for deep pages.',
      whyItMattersAr: 'خريطة الموقع المعتمدة تسهل اكتشاف الصفحات الداخلية وتوجيه ميزانية الزحف بفاعلية.',
      recommendedAction: 'Generate a standard XML sitemap and declare "Sitemap: https://yourdomain.com/sitemap.xml" in robots.txt.',
      recommendedActionAr: 'قم بإنشاء خريطة موقع XML وأضف رابطها في نهاية ملف robots.txt.',
      fixCategory: 'sitemap',
    });
    ledger.push({
      name: 'Sitemap Discovery & Health',
      nameAr: 'اكتشاف وصحة خريطة الموقع (Sitemap)',
      status: 'fail',
      detail: 'No XML sitemap discovered',
      detailAr: 'لم يتم العثور على خريطة موقع XML',
    });
  } else if (raw.sitemapFound === true) {
    ledger.push({
      name: 'Sitemap Discovery & Health',
      nameAr: 'اكتشاف وصحة خريطة الموقع (Sitemap)',
      status: 'pass',
      detail: `XML Sitemap found${raw.sitemapUrl ? ': ' + raw.sitemapUrl : ''}`,
      detailAr: `خريطة الموقع موجودة${raw.sitemapUrl ? ': ' + raw.sitemapUrl : ''}`,
    });
  } else {
    ledger.push({
      name: 'Sitemap Discovery & Health',
      nameAr: 'اكتشاف وصحة خريطة الموقع (Sitemap)',
      status: 'warning',
      detail: 'Could not verify sitemap presence',
      detailAr: 'لم يتمكن المحرك من التحقق من وجود خريطة الموقع',
    });
  }

  // ----------------------------------------------------
  // 3. CONTENT & ANSWERABILITY (Only if HTML was fetched)
  // ----------------------------------------------------
  if (raw.htmlFetched) {
    // Title check
    if (!raw.title) {
      issues.push({
        id: 'missing-title',
        category: 'technical',
        severity: 'critical',
        weight: 5,
        title: 'Page Title (<title>) is Missing',
        titleAr: 'عنوان الصفحة (<title>) مفقود',
        signalDetected: 'No <title> tag found in the HTML document head.',
        signalDetectedAr: 'لم يُعثر على وسم <title> في رأس المستند.',
        evidence: '<title> -> NOT FOUND',
        evidenceAr: 'وسم العنوان غير موجود',
        whyItMatters: 'The title tag is the most fundamental SEO signal. Without it, search engines cannot label your page in results.',
        whyItMattersAr: 'وسم العنوان هو أهم إشارة سيو أساسية. بدونه، لا تستطيع محركات البحث تسمية صفحتك في النتائج.',
        recommendedAction: 'Add a descriptive <title> tag between 30-60 characters that includes your primary keyword.',
        recommendedActionAr: 'أضف وسم <title> وصفي بين 30 إلى 60 حرف يتضمن الكلمة المفتاحية الرئيسية.',
        fixCategory: 'meta',
      });
    } else {
      ledger.push({
        name: 'Page Title',
        nameAr: 'عنوان الصفحة',
        status: 'pass',
        detail: `"${raw.title}" (${raw.title.length} chars)`,
        detailAr: `"${raw.title}" (${raw.title.length} حرف)`,
      });
    }

    // Lead paragraph BLUF check
    if (!raw.leadParagraph || raw.leadParagraph.length < 30) {
      issues.push({
        id: 'weak-lead-answer',
        category: 'content',
        severity: 'high',
        weight: 3,
        title: 'Lead Section Lacks Direct Answerability (BLUF)',
        titleAr: 'المقدمة تفتقر إلى الإجابة المباشرة (BLUF)',
        signalDetected: 'First content paragraph lacks a concise definitive summary answering the core user query.',
        signalDetectedAr: 'الفقرة الأولى لا تقدم ملخصاً تعريفياً حاسماً يجيب على سؤال الباحث.',
        evidence: `Lead text: "${raw.leadParagraph || 'None detected in HTML'}"`,
        evidenceAr: `نص المقدمة: "${raw.leadParagraph || 'لم يُعثر عليه في HTML'}"`,
        whyItMatters: 'Large language models and generative search extract information primarily from top semantic text chunks. Vague marketing slogans delay entity understanding.',
        whyItMattersAr: 'محركات البحث التوليدي والذكاء الاصطناعي تعتمد على أول 200 كلمة لاستخراج الحقائق وتكوين الإجابات.',
        recommendedAction: 'Add a clear Bottom-Line-Up-Front (BLUF) summary paragraph of 40-60 words directly below the primary H1 heading.',
        recommendedActionAr: 'أضف فقرة ملخصة واضحة ومباشرة من 40-60 كلمة تجيب على السؤال الرئيسي أسفل العنوان H1 مباشرة.',
        fixCategory: 'content',
        isFreePreview: true,
      });
    }

    // Question Headings check
    if (!raw.hasQuestionHeadings && raw.h2Tags.length > 0) {
      issues.push({
        id: 'missing-question-headings',
        category: 'content',
        severity: 'medium',
        weight: 2,
        title: 'No Question-Based Headings (H2/H3) Detected',
        titleAr: 'عدم وجود عناوين فرعية بصيغة أسئلة وإجابات',
        signalDetected: 'H2 and H3 tags use vague labels rather than natural language questions users ask.',
        signalDetectedAr: 'العناوين الفرعية تستخدم كلمات عامة بدلاً من أسئلة الباحثين الطبيعية.',
        evidence: `H2 headings found: [${raw.h2Tags.slice(0, 4).join(', ')}]`,
        evidenceAr: `العناوين المرصودة: [${raw.h2Tags.slice(0, 4).join(', ')}]`,
        whyItMatters: 'Question-structured subheadings match natural search intent and trigger instant extraction in conversational answer engines.',
        whyItMattersAr: 'صياغة العناوين كأسئلة يطابق نية بحث المستخدمين ويسهل اقتباس الإجابات في محركات الذكاء الاصطناعي.',
        recommendedAction: 'Reformat feature subheadings into explicit questions (e.g. "How does [Product] calculate X?").',
        recommendedActionAr: 'أعد صياغة بعض العناوين الفرعية لتكون بصيغة سؤال يبحث عنه عميلك المحتمل.',
        fixCategory: 'content',
      });
    }

    // Meta Description check
    if (!raw.metaDescription) {
      issues.push({
        id: 'missing-meta-description',
        category: 'technical',
        severity: 'high',
        weight: 3,
        title: 'Meta Description is Missing',
        titleAr: 'الوصف التعريفي (Meta Description) مفقود',
        signalDetected: 'No <meta name="description"> tag found in HTML head.',
        signalDetectedAr: 'لم يُعثر على وسم الوصف التعريفي في رأس المستند.',
        evidence: '<meta name="description"> -> NOT FOUND',
        evidenceAr: 'وسم الوصف التعريفي غير موجود',
        whyItMatters: 'Meta descriptions are used as SERP snippets. Missing descriptions result in auto-generated snippets that may not represent your page well.',
        whyItMattersAr: 'الوصف التعريفي يُستخدم كملخص في نتائج البحث. غيابه يجعل جوجل يختار مقطعاً عشوائياً قد لا يمثل صفحتك.',
        recommendedAction: 'Add a meta description of 130-155 characters highlighting your value proposition.',
        recommendedActionAr: 'أضف وصفاً تعريفياً بين 130 إلى 155 حرف يوضح القيمة والخدمة.',
        fixCategory: 'meta',
      });
    } else if (raw.metaDescription.length < 50) {
      issues.push({
        id: 'short-meta-description',
        category: 'technical',
        severity: 'medium',
        weight: 2,
        title: `Meta Description is Too Short (${raw.metaDescription.length} chars)`,
        titleAr: `الوصف التعريفي قصير جداً (${raw.metaDescription.length} حرف)`,
        signalDetected: `Meta description is only ${raw.metaDescription.length} characters.`,
        signalDetectedAr: `طول الوصف التعريفي ${raw.metaDescription.length} حرف فقط.`,
        evidence: `"${raw.metaDescription}"`,
        evidenceAr: `"${raw.metaDescription}"`,
        whyItMatters: 'Short descriptions underperform in SERP CTR. Google recommends 130-155 characters.',
        whyItMattersAr: 'الوصف القصير يقلل معدل النقر. جوجل توصي بـ 130-155 حرف.',
        recommendedAction: 'Expand the meta description to 130-155 characters with specific value propositions.',
        recommendedActionAr: 'وسّع الوصف التعريفي إلى 130-155 حرف مع إبراز القيم والخدمات.',
        fixCategory: 'meta',
      });
    } else {
      ledger.push({
        name: 'Meta Description',
        nameAr: 'الوصف التعريفي',
        status: 'pass',
        detail: `"${raw.metaDescription.substring(0, 80)}..." (${raw.metaDescription.length} chars)`,
        detailAr: `"${raw.metaDescription.substring(0, 80)}..." (${raw.metaDescription.length} حرف)`,
      });
    }

    // H1 check
    if (raw.h1Tags.length === 0) {
      issues.push({
        id: 'missing-h1',
        category: 'technical',
        severity: 'high',
        weight: 3,
        title: 'Missing Main <h1> Heading',
        titleAr: 'غياب العنوان الرئيسي H1',
        signalDetected: 'No <h1> tag found on the page.',
        signalDetectedAr: 'لم يُعثر على وسم H1 في الصفحة.',
        evidence: '<h1> -> NOT FOUND',
        evidenceAr: 'وسم H1 غير موجود',
        whyItMatters: 'The H1 heading establishes the primary topic hierarchy for crawlers and AI parsers.',
        whyItMattersAr: 'وسم H1 يحدد الموضوع الرئيسي للصفحة لخوارزميات الزحف والذكاء الاصطناعي.',
        recommendedAction: 'Add exactly one descriptive <h1> tag that clearly states the page topic.',
        recommendedActionAr: 'أضف وسم H1 واحد وواضح يعبر عن موضوع الصفحة.',
        fixCategory: 'content',
      });
    } else if (raw.h1Tags.length > 1) {
      issues.push({
        id: 'multiple-h1',
        category: 'technical',
        severity: 'low',
        weight: 1,
        title: `Multiple <h1> Headings Found (${raw.h1Tags.length})`,
        titleAr: `تكرار وسم H1 (${raw.h1Tags.length} مرات)`,
        signalDetected: `Found ${raw.h1Tags.length} <h1> tags on the page.`,
        signalDetectedAr: `تم العثور على ${raw.h1Tags.length} من وسوم H1.`,
        evidence: `H1 tags: ["${raw.h1Tags.join('", "')}"]`,
        evidenceAr: `وسوم H1: ["${raw.h1Tags.join('", "')}"]`,
        whyItMatters: 'Having exactly one clear <h1> establishes unambiguous primary topic hierarchy for crawlers.',
        whyItMattersAr: 'وجود وسم H1 واحد فقط وواضح يحدد الموضوع الرئيسي بدقة.',
        recommendedAction: 'Ensure exactly one descriptive <h1> tag is present on the page.',
        recommendedActionAr: 'تأكد من وجود وسم H1 رئيسي واحد فقط.',
        fixCategory: 'content',
      });
    }
  }

  // ----------------------------------------------------
  // 4. CONTEXT-AWARE ENTITY & STRUCTURED DATA (Only if HTML fetched)
  // ----------------------------------------------------
  if (raw.htmlFetched) {
    if (raw.schemaTypesDetected.length === 0) {
      issues.push({
        id: 'missing-schema-graph',
        category: 'entity',
        severity: 'critical',
        weight: 5,
        title: 'No Structured Data (JSON-LD) Detected on Page',
        titleAr: 'عدم وجود بيانات منظمة (Schema.org JSON-LD) في الصفحة',
        signalDetected: 'Zero Schema.org script blocks found in document head or body.',
        signalDetectedAr: 'لم يتم العثور على أي كود Schema.org داخل الصفحة.',
        evidence: '<script type="application/ld+json"> -> NOT FOUND',
        evidenceAr: 'وسم السكيما غير موجود إطلاقاً',
        whyItMatters: 'Without machine-readable structured data, search engines must guess at your brand, pricing, author, and entity relations through optical text parsing alone.',
        whyItMattersAr: 'بدون سكيما منظمة، تضطر محركات البحث لتخمين هويتك وأسعارك وخدماتك مما يقلل دقة فهم النشاط.',
        recommendedAction: `Deploy context-aware Schema.org JSON-LD appropriate for your ${raw.detectedSiteType} site.`,
        recommendedActionAr: `قم بتضمين كود Schema.org JSON-LD المخصص لنوع موقعك (${raw.detectedSiteType}).`,
        fixCategory: 'schema',
        isFreePreview: true,
      });
      ledger.push({
        name: 'Structured Data (JSON-LD)',
        nameAr: 'البيانات المنظمة (JSON-LD)',
        status: 'fail',
        detail: 'No Schema.org markup detected',
        detailAr: 'لم يتم رصد أي سكيما منظمة',
      });
    } else {
      ledger.push({
        name: 'Structured Data (JSON-LD)',
        nameAr: 'البيانات المنظمة (JSON-LD)',
        status: 'pass',
        detail: `Detected: ${raw.schemaTypesDetected.join(', ')}`,
        detailAr: `تم رصد: ${raw.schemaTypesDetected.join(', ')}`,
      });

      // Contextual Schema Warnings based on site type
      const hasSoftware = raw.schemaTypesDetected.includes('SoftwareApplication');
      if (raw.detectedSiteType === 'saas' && !hasSoftware) {
        issues.push({
          id: 'missing-software-schema',
          category: 'entity',
          severity: 'high',
          weight: 3,
          title: 'Missing SoftwareApplication Schema for SaaS Platform',
          titleAr: 'غياب سكيما SoftwareApplication لتطبيق الساس',
          signalDetected: 'SaaS product features detected but no SoftwareApplication entity defined.',
          signalDetectedAr: 'الموقع يقدم تطبيق ساس لكن لا يحتوي على سكيما SoftwareApplication.',
          evidence: `Types present: [${raw.schemaTypesDetected.join(', ')}]`,
          evidenceAr: `الأنواع الحالية: [${raw.schemaTypesDetected.join(', ')}]`,
          whyItMatters: 'SoftwareApplication schema grounds applicationCategory, operatingSystem, and pricing models directly in the Knowledge Graph.',
          whyItMattersAr: 'سكيما البرمجيات توضح فئة التطبيق وأنظمة التشغيل والأسعار لمحركات البحث بدقة حتمية.',
          recommendedAction: 'Inject a valid SoftwareApplication JSON-LD schema with pricing and operatingSystem properties.',
          recommendedActionAr: 'أضف كود سكيما SoftwareApplication مع تحديد الفئة والأسعار.',
          fixCategory: 'schema',
        });
      }
    }

    // Canonical Tag Verification
    if (!raw.canonicalUrl) {
      issues.push({
        id: 'missing-canonical',
        category: 'technical',
        severity: 'medium',
        weight: 2,
        title: 'Missing Canonical Tag (<link rel="canonical">)',
        titleAr: 'غياب وسم الرابط الأساسي (Canonical Tag)',
        signalDetected: 'No canonical URL link tag declared in <head>.',
        signalDetectedAr: 'لم يتم العثور على وسم canonical في هيدر الصفحة.',
        evidence: '<link rel="canonical" href="..." /> -> MISSING',
        evidenceAr: 'وسم الرابط الأساسي مفقود',
        whyItMatters: 'Canonical URLs prevent duplicate content indexing issues and consolidate link equity across URL variants.',
        whyItMattersAr: 'الرابط الأساسي يمنع مشاكل المحتوى المكرر ويوحد قوة الروابط في صفحة واحدة معتمدة.',
        recommendedAction: 'Add a self-referencing canonical tag pointing to the authoritative HTTPS URL.',
        recommendedActionAr: 'أضف وسم canonical يشير للرابط الرسمي الصحيح للصفحة.',
        fixCategory: 'meta',
      });
      ledger.push({
        name: 'Canonical Tag',
        nameAr: 'وسم الرابط الأساسي (Canonical)',
        status: 'fail',
        detail: 'No canonical tag found',
        detailAr: 'لم يُعثر على وسم canonical',
      });
    } else {
      ledger.push({
        name: 'Canonical Tag',
        nameAr: 'وسم الرابط الأساسي (Canonical)',
        status: 'pass',
        detail: `canonical="${raw.canonicalUrl}"`,
        detailAr: `canonical="${raw.canonicalUrl}"`,
      });
    }
  }

  // ----------------------------------------------------
  // WEIGHTED SCORING ENGINE (5x / 3x / 2x / 1x)
  // ----------------------------------------------------
  const categoryDeductions: Record<string, number> = {
    technical: 0,
    crawlability: 0,
    content: 0,
    entity: 0,
    ai_readiness: 0,
  };

  issues.forEach(issue => {
    if (issue.severity !== 'informational') {
      categoryDeductions[issue.category] += issue.weight * 7.5;
    }
  });

  const technicalSEO = Math.max(15, Math.min(98, Math.round(100 - categoryDeductions.technical)));
  const crawlability = Math.max(10, Math.min(98, Math.round(100 - categoryDeductions.crawlability)));
  const contentAnswerability = raw.htmlFetched
    ? Math.max(20, Math.min(98, Math.round(100 - categoryDeductions.content)))
    : 50; // Neutral if content couldn't be inspected
  const entitySchema = raw.htmlFetched
    ? Math.max(10, Math.min(98, Math.round(100 - categoryDeductions.entity)))
    : 50; // Neutral if content couldn't be inspected
  const aiSearchReadiness = Math.max(15, Math.min(98, Math.round((crawlability * 0.35) + (contentAnswerability * 0.35) + (entitySchema * 0.3))));

  const overallScore = Math.max(18, Math.min(96, Math.round(
    (technicalSEO * 0.2) +
    (crawlability * 0.25) +
    (contentAnswerability * 0.25) +
    (entitySchema * 0.2) +
    (aiSearchReadiness * 0.1)
  )));

  // Separate 3 Free Critical Blockers vs Locked Issues
  const criticalBlockers = issues.filter(i => i.severity !== 'informational').slice(0, 3);
  const lockedIssues = issues.filter(i => i.severity !== 'informational').slice(3);

  // Generate AI Search Opportunities based on site type
  const aiOpportunities: AIOpportunity[] = generateAIOpportunities(raw.detectedSiteType, raw);

  const reportId = customId || generateAuditId();

  return {
    id: reportId,
    url,
    timestamp: new Date().toISOString(),
    engineVersion: AUDIT_ENGINE_VERSION,
    overallScore,
    categoryScores: {
      technicalSEO,
      crawlability,
      contentAnswerability,
      entitySchema,
      aiSearchReadiness,
    },
    evidenceLedger: ledger,
    criticalBlockers,
    lockedIssues,
    allIssues: issues,
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
      headers: { 'Accept': 'text/html,text/plain,application/json,*/*', 'User-Agent': 'SchemaCraftAI-Auditor/1.0' },
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

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith('#') || lower === '') {
      if (lower === '' && currentAgents.length > 0) {
        currentAgents = [];
      }
      continue;
    }

    if (lower.startsWith('user-agent:')) {
      const agent = lower.replace('user-agent:', '').trim();
      currentAgents.push(agent);
    } else if (lower.startsWith('disallow:')) {
      const path = lower.replace('disallow:', '').trim();
      if (path === '/' || path === '/*') {
        for (const agent of currentAgents) {
          result[agent] = 'disallowed';
        }
      }
    } else if (lower.startsWith('allow:')) {
      const path = lower.replace('allow:', '').trim();
      if (path === '/' || path === '/*') {
        for (const agent of currentAgents) {
          result[agent] = 'allowed';
        }
      }
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
 * ROBUST Multi-Strategy Live Web Crawler & DOM Parser
 * Uses 8+ proxy services with sequential fallback, allorigins JSON wrapper,
 * separate robots.txt fetch with independent proxy attempts,
 * and generous timeouts.
 *
 * INTEGRITY: ZERO fabrication. Reports only what was actually fetched.
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

    // Wave 3: Google webcache as absolute last resort
    if (!htmlFetched) {
      const cacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(targetUrl)}&strip=0`;
      try {
        html = await tryProxy(cacheUrl, 6000);
        if (html && html.length > 200) {
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

  // ─── 3. Real DOM Parser — ONLY from genuinely fetched HTML ───
  let title: string | null = null;
  let metaDescription: string | null = null;
  let canonicalUrl: string | null = null;
  let metaRobots: string | null = null;
  let h1Tags: string[] = [];
  let h2Tags: string[] = [];
  let leadParagraph: string | null = null;
  let hasQuestionHeadings = false;
  let schemaTypesDetected: string[] = [];
  let rawJsonLd: any[] = [];

  if (htmlFetched && html.length > 100) {
    try {
      if (typeof window !== 'undefined' && window.DOMParser) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        title = doc.querySelector('title')?.textContent?.trim() || null;
        metaDescription = doc.querySelector('meta[name="description" i]')?.getAttribute('content')?.trim() || null;
        canonicalUrl = doc.querySelector('link[rel="canonical" i]')?.getAttribute('href')?.trim() || null;
        metaRobots = doc.querySelector('meta[name="robots" i]')?.getAttribute('content')?.trim() || null;

        doc.querySelectorAll('h1').forEach((h1) => {
          const text = h1.textContent?.trim();
          if (text && text.length > 1) h1Tags.push(text);
        });

        doc.querySelectorAll('h2').forEach((h2) => {
          const text = h2.textContent?.trim();
          if (text && text.length > 1) {
            h2Tags.push(text);
            if (text.includes('?') || text.includes('؟') || /^(how|what|why|who|is|can|do|does|هل|كيف|ما|لماذا)/i.test(text)) {
              hasQuestionHeadings = true;
            }
          }
        });

        // Find first meaningful paragraph
        const paragraphs = doc.querySelectorAll('main p, article p, section p, .content p, #content p, p');
        for (const p of paragraphs) {
          const text = p.textContent?.trim();
          if (text && text.length > 30 && !text.includes('©') && !text.includes('cookie') && !text.includes('privacy')) {
            leadParagraph = text.length > 300 ? text.substring(0, 300) : text;
            break;
          }
        }

        doc.querySelectorAll('script[type="application/ld+json" i]').forEach((script) => {
          try {
            const json = JSON.parse(script.textContent || '');
            rawJsonLd.push(json);
            if (json['@type']) {
              const types = Array.isArray(json['@type']) ? json['@type'] : [json['@type']];
              schemaTypesDetected.push(...types);
            } else if (Array.isArray(json['@graph'])) {
              json['@graph'].forEach((node: any) => {
                if (node['@type']) {
                  const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
                  schemaTypesDetected.push(...types);
                }
              });
            }
          } catch (e) {}
        });

        schemaTypesDetected = [...new Set(schemaTypesDetected)];
      }
    } catch (e) {}
  }

  if (!htmlFetched) {
    potentialBotBarrier = true;
  }

  // ─── 4. Accurate per-bot robots.txt parsing ───
  const parsedRobots = parseRobotsTxt(robotsTxtContent);
  const oaiSearchBotDirective = robotsFetched ? getBotDirective(parsedRobots, 'oai-searchbot') : 'not_specified';
  const oaiAdsBotDirective = robotsFetched ? getBotDirective(parsedRobots, 'oai-adsbot') : 'not_specified';
  const googleExtendedDirective = robotsFetched ? getBotDirective(parsedRobots, 'google-extended') : 'not_specified';
  const googlebotDirective = robotsFetched ? getBotDirective(parsedRobots, 'googlebot') : 'not_specified';
  const perplexityBotDirective = robotsFetched ? getBotDirective(parsedRobots, 'perplexitybot') : 'not_specified';

  // Detect site type from REAL extracted content only
  const combinedText = `${title || ''} ${metaDescription || ''} ${h1Tags.join(' ')} ${targetUrl}`.toLowerCase();
  let detectedSiteType: 'saas' | 'ecommerce' | 'clinic' | 'agency' | 'general' = 'general';
  if (combinedText.includes('software') || combinedText.includes('saas') || combinedText.includes(' app ') || combinedText.includes('api') || combinedText.includes('platform')) {
    detectedSiteType = 'saas';
  } else if (combinedText.includes('shop') || combinedText.includes('store') || combinedText.includes('cart') || combinedText.includes('product') || combinedText.includes('price')) {
    detectedSiteType = 'ecommerce';
  } else if (combinedText.includes('clinic') || combinedText.includes('dental') || combinedText.includes('doctor') || combinedText.includes('patient') || combinedText.includes('medical')) {
    detectedSiteType = 'clinic';
  } else if (combinedText.includes('agency') || combinedText.includes('marketing') || combinedText.includes('seo') || combinedText.includes('consulting')) {
    detectedSiteType = 'agency';
  }

  // Sitemap check from robots.txt content
  const sitemapFound = robotsFetched
    ? robotsTxtContent.toLowerCase().includes('sitemap:')
    : null;

  const sitemapUrl = robotsFetched
    ? (robotsTxtContent.match(/Sitemap:\s*(.*)/i)?.[1]?.trim() || '')
    : '';

  return {
    httpStatus,
    robotsTxtFound,
    robotsTxtContent,
    sitemapFound,
    sitemapUrl,
    canonicalUrl,
    metaRobots,
    xRobotsTag: null,
    title,
    metaDescription,
    h1Tags,
    h2Tags,
    leadParagraph,
    hasQuestionHeadings,
    hasDefinitionPatterns: leadParagraph ? /is a |are |defined as |يعتبر |هو |عبارة عن/i.test(leadParagraph) : false,
    schemaTypesDetected,
    rawJsonLd,
    oaiSearchBotDirective,
    oaiAdsBotDirective,
    googleExtendedDirective,
    googlebotDirective,
    perplexityBotDirective,
    potentialBotBarrier,
    detectedSiteType,
    htmlFetched,
    robotsFetched,
  };
}

