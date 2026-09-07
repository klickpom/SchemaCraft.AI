import type { RawEvidence } from '@/lib/auditEngine';
import {
  type AuditCheck,
  type IssueCategory,
  penaltyOf,
} from '@/lib/audit/scoring';

function row(
  partial: Omit<AuditCheck, 'penalty' | 'ledgerName' | 'ledgerNameAr' | 'ledgerDetail' | 'ledgerDetailAr'> & {
    penalty?: number;
    ledgerName?: string;
    ledgerNameAr?: string;
    ledgerDetail?: string;
    ledgerDetailAr?: string;
  }
): AuditCheck {
  const penalty = partial.outcome === 'fail' ? (partial.penalty ?? penaltyOf(partial)) : 0;
  return {
    ...partial,
    penalty,
    ledgerName: partial.ledgerName ?? partial.title,
    ledgerNameAr: partial.ledgerNameAr ?? partial.titleAr,
    ledgerDetail: partial.ledgerDetail ?? partial.evidence,
    ledgerDetailAr: partial.ledgerDetailAr ?? partial.evidenceAr,
  };
}

function skipped(
  id: string,
  category: IssueCategory,
  title: string,
  titleAr: string,
  reason: string,
  reasonAr: string
): AuditCheck {
  return row({
    id,
    category,
    outcome: 'skipped',
    severity: 'informational',
    weight: 0,
    title,
    titleAr,
    signalDetected: reason,
    signalDetectedAr: reasonAr,
    evidence: reason,
    evidenceAr: reasonAr,
    whyItMatters: 'This check did not run, so it cannot contribute a pass or a numeric score.',
    whyItMattersAr: 'هذا الفحص لم يُنفَّذ، لذلك لا يُحسب نجاحاً ولا درجة رقمية.',
    recommendedAction: 'Re-run after the page HTML is retrievable.',
    recommendedActionAr: 'أعد الفحص بعد أن يصبح HTML قابلاً للجلب.',
    fixCategory: 'headers',
  });
}

const HTML_SKIP = 'Live HTML was not retrieved, so this HTML-dependent check did not run.';
const HTML_SKIP_AR = 'لم يُجلب HTML الحي، لذلك لم يُنفَّذ هذا الفحص.';

export function runCatalog(raw: RawEvidence): AuditCheck[] {
  const checks: AuditCheck[] = [];
  const html = raw.htmlFetched;
  const header = (raw.responseHeaders || {}) as Record<string, string>;
  const xRobots = raw.xRobotsTag || header['x-robots-tag'] || null;

  // HTTP status — only a real status counts
  if (raw.httpStatus === null) {
    checks.push(skipped(
      'http-status',
      'technical',
      'HTTP status was not observed',
      'رمز HTTP لم يُرصد',
      'No HTTP status was returned by the fetch layer.',
      'طبقة الجلب لم تُرجع رمز HTTP.'
    ));
  } else if (raw.httpStatus !== 200) {
    checks.push(row({
      id: 'http-status',
      category: 'technical',
      outcome: 'fail',
      severity: 'critical',
      weight: 5,
      title: `HTTP ${raw.httpStatus} returned`,
      titleAr: `الخادم أرجع HTTP ${raw.httpStatus}`,
      signalDetected: `Final status ${raw.httpStatus}`,
      signalDetectedAr: `رمز الاستجابة النهائي ${raw.httpStatus}`,
      evidence: `HTTP ${raw.httpStatus} at ${raw.finalUrl || raw.canonicalUrl || 'unknown URL'}`,
      evidenceAr: `HTTP ${raw.httpStatus}`,
      whyItMatters: 'Non-200 responses are not reliably indexed.',
      whyItMattersAr: 'الاستجابات غير 200 لا تُفهرس بشكل موثوق.',
      recommendedAction: 'Serve HTTP 200 for the public canonical URL.',
      recommendedActionAr: 'أرجع HTTP 200 لرابط الصفحة العام.',
      fixCategory: 'headers',
      isFreePreview: true,
    }));
  } else {
    checks.push(row({
      id: 'http-status',
      category: 'technical',
      outcome: 'pass',
      severity: 'informational',
      weight: 0,
      title: 'HTTP 200 OK',
      titleAr: 'HTTP 200 OK',
      signalDetected: 'Server returned 200',
      signalDetectedAr: 'الخادم أرجع 200',
      evidence: `HTTP 200 at ${raw.finalUrl || 'fetched URL'}`,
      evidenceAr: 'HTTP 200',
      whyItMatters: 'A 200 response is the baseline for indexing.',
      whyItMattersAr: 'استجابة 200 هي الأساس للفهرسة.',
      recommendedAction: 'Keep the canonical URL returning 200.',
      recommendedActionAr: 'حافظ على إرجاع 200 للرابط الأساسي.',
      fixCategory: 'headers',
    }));
  }

  const noindex = Boolean(
    (raw.metaRobots && raw.metaRobots.toLowerCase().includes('noindex')) ||
    (xRobots && xRobots.toLowerCase().includes('noindex'))
  );
  if (!html && !xRobots) {
    checks.push(skipped('indexability', 'technical', 'Indexability not verified', 'الفهرسة لم تُتحقق', HTML_SKIP, HTML_SKIP_AR));
  } else if (noindex) {
    checks.push(row({
      id: 'indexability',
      category: 'technical',
      outcome: 'fail',
      severity: 'critical',
      weight: 5,
      title: 'noindex directive present',
      titleAr: 'تعليمة noindex موجودة',
      signalDetected: 'noindex in meta robots or X-Robots-Tag',
      signalDetectedAr: 'noindex في meta أو X-Robots-Tag',
      evidence: String(raw.metaRobots || xRobots),
      evidenceAr: String(raw.metaRobots || xRobots),
      whyItMatters: 'Search engines drop noindex URLs from results.',
      whyItMattersAr: 'محركات البحث تستبعد صفحات noindex.',
      recommendedAction: 'Remove noindex on URLs you want indexed.',
      recommendedActionAr: 'أزل noindex عن الصفحات المراد فهرستها.',
      fixCategory: 'meta',
      isFreePreview: true,
    }));
  } else {
    checks.push(row({
      id: 'indexability',
      category: 'technical',
      outcome: 'pass',
      severity: 'informational',
      weight: 0,
      title: 'Page is indexable',
      titleAr: 'الصفحة قابلة للفهرسة',
      signalDetected: raw.metaRobots ? `robots: ${raw.metaRobots}` : (xRobots ? `X-Robots-Tag: ${xRobots}` : 'No noindex observed'),
      signalDetectedAr: 'لا يوجد noindex',
      evidence: raw.metaRobots || xRobots || 'no noindex header/meta',
      evidenceAr: raw.metaRobots || xRobots || 'لا noindex',
      whyItMatters: 'Indexable pages can be selected for search.',
      whyItMattersAr: 'الصفحات القابلة للفهرسة يمكن أن تظهر في البحث.',
      recommendedAction: 'Keep index,follow on public URLs.',
      recommendedActionAr: 'أبقِ index,follow على الصفحات العامة.',
      fixCategory: 'meta',
    }));
  }

  if (html) {
    if (!raw.title) {
      checks.push(row({
        id: 'title',
        category: 'technical',
        outcome: 'fail',
        severity: 'critical',
        weight: 5,
        title: 'Missing <title>',
        titleAr: 'وسم <title> مفقود',
        signalDetected: 'No title element',
        signalDetectedAr: 'لا يوجد title',
        evidence: '<title> not found',
        evidenceAr: 'title غير موجود',
        whyItMatters: 'Title is the primary SERP label.',
        whyItMattersAr: 'العنوان هو تسمية النتيجة الأساسية.',
        recommendedAction: 'Add a unique title of about 30–60 characters.',
        recommendedActionAr: 'أضف عنواناً فريداً حوالي 30–60 حرفاً.',
        fixCategory: 'meta',
        isFreePreview: true,
      }));
    } else {
      checks.push(row({
        id: 'title',
        category: 'technical',
        outcome: 'pass',
        severity: 'informational',
        weight: 0,
        title: 'Title present',
        titleAr: 'العنوان موجود',
        signalDetected: `Title length ${raw.title.length}`,
        signalDetectedAr: `طول العنوان ${raw.title.length}`,
        evidence: raw.title,
        evidenceAr: raw.title,
        whyItMatters: 'A title gives crawlers a document name.',
        whyItMattersAr: 'العنوان يعطي الزاحف اسماً للمستند.',
        recommendedAction: 'Keep titles unique per URL.',
        recommendedActionAr: 'اجعل كل عنوان فريداً لكل رابط.',
        fixCategory: 'meta',
      }));
    }

    if (!raw.metaDescription) {
      checks.push(row({
        id: 'meta-description',
        category: 'technical',
        outcome: 'fail',
        severity: 'high',
        weight: 3,
        title: 'Missing meta description',
        titleAr: 'الوصف التعريفي مفقود',
        signalDetected: 'No meta description',
        signalDetectedAr: 'لا meta description',
        evidence: '<meta name="description"> not found',
        evidenceAr: 'الوصف غير موجود',
        whyItMatters: 'Missing descriptions yield auto snippets.',
        whyItMattersAr: 'غياب الوصف يجعل المقتطف آلياً.',
        recommendedAction: 'Add a 120–160 character description.',
        recommendedActionAr: 'أضف وصفاً 120–160 حرفاً.',
        fixCategory: 'meta',
      }));
    } else {
      checks.push(row({
        id: 'meta-description',
        category: 'technical',
        outcome: 'pass',
        severity: 'informational',
        weight: 0,
        title: 'Meta description present',
        titleAr: 'الوصف التعريفي موجود',
        signalDetected: `${raw.metaDescription.length} characters`,
        signalDetectedAr: `${raw.metaDescription.length} حرفاً`,
        evidence: raw.metaDescription.slice(0, 180),
        evidenceAr: raw.metaDescription.slice(0, 180),
        whyItMatters: 'Descriptions can be used as snippets.',
        whyItMattersAr: 'الوصف قد يُستخدم كمقتطف.',
        recommendedAction: 'Keep descriptions specific to the page.',
        recommendedActionAr: 'اجعل الوصف خاصاً بالصفحة.',
        fixCategory: 'meta',
      }));
    }

    if (raw.h1Tags.length === 0) {
      checks.push(row({
        id: 'h1',
        category: 'technical',
        outcome: 'fail',
        severity: 'high',
        weight: 3,
        title: 'Missing H1',
        titleAr: 'H1 مفقود',
        signalDetected: 'Zero h1 elements',
        signalDetectedAr: 'لا يوجد H1',
        evidence: '<h1> not found',
        evidenceAr: 'H1 غير موجود',
        whyItMatters: 'H1 states the page topic for parsers.',
        whyItMattersAr: 'H1 يحدد موضوع الصفحة.',
        recommendedAction: 'Add exactly one descriptive H1.',
        recommendedActionAr: 'أضف H1 واحداً واضحاً.',
        fixCategory: 'content',
      }));
    } else if (raw.h1Tags.length > 1) {
      checks.push(row({
        id: 'h1',
        category: 'technical',
        outcome: 'fail',
        severity: 'low',
        weight: 1,
        title: `Multiple H1s (${raw.h1Tags.length})`,
        titleAr: `تعدد H1 (${raw.h1Tags.length})`,
        signalDetected: `${raw.h1Tags.length} h1 tags`,
        signalDetectedAr: `${raw.h1Tags.length} وسوم H1`,
        evidence: raw.h1Tags.slice(0, 4).join(' | '),
        evidenceAr: raw.h1Tags.slice(0, 4).join(' | '),
        whyItMatters: 'Multiple H1s blur the primary topic.',
        whyItMattersAr: 'تعدد H1 يُضعف وضوح الموضوع.',
        recommendedAction: 'Keep a single H1.',
        recommendedActionAr: 'أبقِ H1 واحداً.',
        fixCategory: 'content',
      }));
    } else {
      checks.push(row({
        id: 'h1',
        category: 'technical',
        outcome: 'pass',
        severity: 'informational',
        weight: 0,
        title: 'Single H1 present',
        titleAr: 'H1 واحد موجود',
        signalDetected: 'One h1',
        signalDetectedAr: 'H1 واحد',
        evidence: raw.h1Tags[0],
        evidenceAr: raw.h1Tags[0],
        whyItMatters: 'A single H1 names the document.',
        whyItMattersAr: 'H1 واحد يسمي المستند.',
        recommendedAction: 'Keep the H1 aligned with the title.',
        recommendedActionAr: 'اجعل H1 متوافقاً مع العنوان.',
        fixCategory: 'content',
      }));
    }

    if (!raw.canonicalUrl) {
      checks.push(row({
        id: 'canonical',
        category: 'technical',
        outcome: 'fail',
        severity: 'medium',
        weight: 2,
        title: 'Missing canonical',
        titleAr: 'canonical مفقود',
        signalDetected: 'No rel=canonical',
        signalDetectedAr: 'لا rel=canonical',
        evidence: 'link rel=canonical not found',
        evidenceAr: 'canonical غير موجود',
        whyItMatters: 'Canonicals consolidate duplicate URLs.',
        whyItMattersAr: 'الكانوني يوحّد النسخ المكررة.',
        recommendedAction: 'Add a self-referential HTTPS canonical.',
        recommendedActionAr: 'أضف canonical ذاتي المرجع بـ HTTPS.',
        fixCategory: 'meta',
      }));
    } else {
      checks.push(row({
        id: 'canonical',
        category: 'technical',
        outcome: 'pass',
        severity: 'informational',
        weight: 0,
        title: 'Canonical present',
        titleAr: 'canonical موجود',
        signalDetected: raw.canonicalUrl,
        signalDetectedAr: raw.canonicalUrl,
        evidence: raw.canonicalUrl,
        evidenceAr: raw.canonicalUrl,
        whyItMatters: 'A canonical declares the preferred URL.',
        whyItMattersAr: 'الكانوني يعلن الرابط المفضّل.',
        recommendedAction: 'Keep it self-referential on this URL.',
        recommendedActionAr: 'اجعله يشير لنفس هذه الصفحة.',
        fixCategory: 'meta',
      }));
    }

    if (raw.htmlLang) {
      checks.push(row({
        id: 'html-lang',
        category: 'technical',
        outcome: 'pass',
        severity: 'informational',
        weight: 0,
        title: `html lang=${raw.htmlLang}`,
        titleAr: `html lang=${raw.htmlLang}`,
        signalDetected: `lang="${raw.htmlLang}"`,
        signalDetectedAr: `lang="${raw.htmlLang}"`,
        evidence: `html[lang=${raw.htmlLang}]`,
        evidenceAr: `html[lang=${raw.htmlLang}]`,
        whyItMatters: 'Language helps indexing and accessibility.',
        whyItMattersAr: 'اللغة تساعد الفهرسة وإمكانية الوصول.',
        recommendedAction: 'Keep lang accurate for the page.',
        recommendedActionAr: 'اجعل lang مطابقاً للصفحة.',
        fixCategory: 'meta',
      }));
    } else {
      checks.push(row({
        id: 'html-lang',
        category: 'technical',
        outcome: 'fail',
        severity: 'low',
        weight: 1,
        title: 'Missing html lang',
        titleAr: 'html lang مفقود',
        signalDetected: 'No lang attribute on <html>',
        signalDetectedAr: 'لا lang على html',
        evidence: '<html> without lang',
        evidenceAr: 'html بدون lang',
        whyItMatters: 'Language is a documented HTML requirement for AT and indexing hints.',
        whyItMattersAr: 'اللغة متطلب HTML موثّق.',
        recommendedAction: 'Set html lang to the page language (e.g. ar or en).',
        recommendedActionAr: 'ضع html lang للغة الصفحة.',
        fixCategory: 'meta',
      }));
    }
  } else {
    for (const id of ['title', 'meta-description', 'h1', 'canonical', 'html-lang'] as const) {
      checks.push(skipped(id, 'technical', `${id} not inspected`, `${id} لم يُفحص`, HTML_SKIP, HTML_SKIP_AR));
    }
  }

  // Crawlability
  if (raw.robotsFetched) {
    const bots: Array<{ id: string; ua: string; dir: RawEvidence['googlebotDirective']; label: string }> = [
      { id: 'googlebot', ua: 'Googlebot', dir: raw.googlebotDirective, label: 'Googlebot' },
      { id: 'oai-searchbot', ua: 'OAI-SearchBot', dir: raw.oaiSearchBotDirective, label: 'OAI-SearchBot' },
      { id: 'perplexitybot', ua: 'PerplexityBot', dir: raw.perplexityBotDirective, label: 'PerplexityBot' },
    ];
    for (const bot of bots) {
      if (bot.dir === 'disallowed') {
        checks.push(row({
          id: `robots-${bot.id}`,
          category: 'crawlability',
          outcome: 'fail',
          severity: bot.id === 'googlebot' ? 'critical' : 'high',
          weight: bot.id === 'googlebot' ? 5 : 3,
          title: `${bot.label} is disallowed`,
          titleAr: `${bot.label} محظور`,
          signalDetected: `robots.txt Disallow for ${bot.ua}`,
          signalDetectedAr: `حظر ${bot.ua} في robots.txt`,
          evidence: `User-agent: ${bot.ua} → disallowed`,
          evidenceAr: `User-agent: ${bot.ua} → محظور`,
          whyItMatters: `${bot.label} cannot fetch the site when disallowed.`,
          whyItMattersAr: `${bot.label} لا يجلب الموقع عند الحظر.`,
          recommendedAction: `Allow ${bot.ua} if you want that crawler to read the site.`,
          recommendedActionAr: `اسمح لـ ${bot.ua} إن أردت أن يقرأ الموقع.`,
          fixCategory: 'robots',
          isFreePreview: true,
        }));
      } else {
        checks.push(row({
          id: `robots-${bot.id}`,
          category: 'crawlability',
          outcome: 'pass',
          severity: 'informational',
          weight: 0,
          title: `${bot.label} is not blocked`,
          titleAr: `${bot.label} غير محظور`,
          signalDetected: `${bot.ua}: ${bot.dir}`,
          signalDetectedAr: `${bot.ua}: ${bot.dir}`,
          evidence: `${bot.ua} → ${bot.dir}`,
          evidenceAr: `${bot.ua} → ${bot.dir}`,
          whyItMatters: 'Allowed crawlers can retrieve the URL.',
          whyItMattersAr: 'الزواحف المسموحة تستطيع جلب الرابط.',
          recommendedAction: 'Keep Allow unless you intend to block training or ads bots separately.',
          recommendedActionAr: 'أبقِ السماح إلا إذا كنت تقصد حظر بوت التدريب أو الإعلانات.',
          fixCategory: 'robots',
        }));
      }
    }
  } else {
    checks.push(skipped('robots-googlebot', 'crawlability', 'robots.txt not fetched', 'robots.txt لم يُجلب', 'Could not retrieve robots.txt.', 'تعذر جلب robots.txt.'));
    checks.push(skipped('robots-oai-searchbot', 'crawlability', 'OAI-SearchBot directive unknown', 'تعليمة OAI-SearchBot غير معروفة', 'robots.txt missing.', 'robots.txt غير متاح.'));
    checks.push(skipped('robots-perplexitybot', 'crawlability', 'PerplexityBot directive unknown', 'تعليمة PerplexityBot غير معروفة', 'robots.txt missing.', 'robots.txt غير متاح.'));
  }

  if (raw.sitemapFound === true) {
    checks.push(row({
      id: 'sitemap',
      category: 'crawlability',
      outcome: 'pass',
      severity: 'informational',
      weight: 0,
      title: 'Sitemap discovered',
      titleAr: 'Sitemap مكتشف',
      signalDetected: raw.sitemapUrl || 'sitemap found',
      signalDetectedAr: raw.sitemapUrl || 'sitemap موجود',
      evidence: raw.sitemapUrl || 'sitemap.xml',
      evidenceAr: raw.sitemapUrl || 'sitemap.xml',
      whyItMatters: 'Sitemaps help discovery; they do not guarantee indexing.',
      whyItMattersAr: 'الخريطة تساعد الاكتشاف ولا تضمن الفهرسة.',
      recommendedAction: 'Keep sitemap URLs in canonical form.',
      recommendedActionAr: 'أبقِ روابط الخريطة بالشكل الكانوني.',
      fixCategory: 'sitemap',
    }));
  } else if (raw.sitemapFound === false) {
    checks.push(row({
      id: 'sitemap',
      category: 'crawlability',
      outcome: 'fail',
      severity: 'high',
      weight: 3,
      title: 'Sitemap not found',
      titleAr: 'Sitemap غير موجود',
      signalDetected: 'No sitemap in robots.txt and /sitemap.xml missing',
      signalDetectedAr: 'لا sitemap في robots ولا في المسار الافتراضي',
      evidence: 'sitemap.xml not discovered',
      evidenceAr: 'sitemap.xml غير مكتشف',
      whyItMatters: 'Without a sitemap, deep URLs are slower to discover.',
      whyItMattersAr: 'بدون خريطة تُكتشف الصفحات الداخلية أبطأ.',
      recommendedAction: 'Publish XML sitemap and declare it in robots.txt.',
      recommendedActionAr: 'انشر خريطة XML وأعلنها في robots.txt.',
      fixCategory: 'sitemap',
    }));
  } else {
    checks.push(skipped('sitemap', 'crawlability', 'Sitemap not verified', 'Sitemap لم يُتحقق', 'Could not probe sitemap.xml.', 'تعذر فحص sitemap.xml.'));
  }

  if (raw.llmsTxtFound === true && raw.llmsTxtLooksLikeHtml) {
    checks.push(row({
      id: 'llms-txt',
      category: 'crawlability',
      outcome: 'fail',
      severity: 'medium',
      weight: 2,
      title: '/llms.txt returned HTML, not plain text',
      titleAr: '/llms.txt أرجع HTML وليس نصاً',
      signalDetected: `content-type ${raw.llmsTxtContentType || 'unknown'}`,
      signalDetectedAr: `نوع المحتوى ${raw.llmsTxtContentType || 'غير معروف'}`,
      evidence: (raw.llmsTxtContent || '').slice(0, 180),
      evidenceAr: (raw.llmsTxtContent || '').slice(0, 180),
      whyItMatters: 'llms.txt is only useful as text/plain for retrieval crawlers.',
      whyItMattersAr: 'llms.txt مفيد فقط كـ text/plain لزواحف الاسترجاع.',
      recommendedAction: 'Serve a real text/plain llms.txt at the site root.',
      recommendedActionAr: 'قدّم ملف llms.txt حقيقي text/plain في الجذر.',
      fixCategory: 'headers',
    }));
  } else if (raw.llmsTxtFound === true) {
    checks.push(row({
      id: 'llms-txt',
      category: 'crawlability',
      outcome: 'pass',
      severity: 'informational',
      weight: 0,
      title: 'llms.txt present',
      titleAr: 'llms.txt موجود',
      signalDetected: raw.llmsTxtContentType || 'text body fetched',
      signalDetectedAr: raw.llmsTxtContentType || 'تم جلب النص',
      evidence: (raw.llmsTxtContent || '').slice(0, 180),
      evidenceAr: (raw.llmsTxtContent || '').slice(0, 180),
      whyItMatters: 'A plain-text llms.txt is an AI-retrieval hint, not a ranking factor.',
      whyItMattersAr: 'llms.txt تلميح استرجاع وليس عامل ترتيب.',
      recommendedAction: 'Keep the file short, current, and linked from the footer.',
      recommendedActionAr: 'أبقِ الملف قصيراً ومحدَّثاً.',
      fixCategory: 'headers',
    }));
  } else if (raw.llmsTxtFound === false) {
    checks.push(row({
      id: 'llms-txt',
      category: 'crawlability',
      outcome: 'fail',
      severity: 'low',
      weight: 1,
      title: 'No llms.txt',
      titleAr: 'لا يوجد llms.txt',
      signalDetected: '/llms.txt not found or not text',
      signalDetectedAr: '/llms.txt غير موجود',
      evidence: 'llms.txt missing',
      evidenceAr: 'llms.txt مفقود',
      whyItMatters: 'Optional retrieval file; absence is not a Google penalty.',
      whyItMattersAr: 'ملف اختياري؛ غيابه ليس عقوبة من جوجل.',
      recommendedAction: 'Publish /llms.txt if you want a dedicated AI summary.',
      recommendedActionAr: 'انشر /llms.txt إن أردت ملخصاً للذكاء الاصطناعي.',
      fixCategory: 'headers',
    }));
  } else {
    checks.push(skipped('llms-txt', 'crawlability', 'llms.txt not probed', 'llms.txt لم يُفحص', 'Fetch layer did not probe /llms.txt.', 'طبقة الجلب لم تفحص /llms.txt.'));
  }

  if (raw.potentialBotBarrier && !html) {
    checks.push(row({
      id: 'fetch-barrier',
      category: 'crawlability',
      outcome: 'fail',
      severity: 'high',
      weight: 3,
      title: 'HTML fetch failed (CORS, WAF, or timeout)',
      titleAr: 'فشل جلب HTML (CORS أو WAF أو مهلة)',
      signalDetected: raw.fetchError || `fetchMode=${raw.fetchMode || 'failed'}`,
      signalDetectedAr: raw.fetchError || 'فشل الجلب',
      evidence: raw.fetchError || 'htmlFetched=false',
      evidenceAr: raw.fetchError || 'htmlFetched=false',
      whyItMatters: 'If our server cannot fetch the document, evidence-based HTML checks cannot run. This is a fetch failure, not a 50/100 content grade.',
      whyItMattersAr: 'إذا تعذر جلب المستند، فحوصات HTML لا تعمل. هذا فشل جلب وليس درجة محتوى 50/100.',
      recommendedAction: 'Allow HTTPS fetches from datacenter IPs, or confirm the URL is public.',
      recommendedActionAr: 'اسمح بالجلب عبر HTTPS أو تأكد أن الرابط عام.',
      fixCategory: 'headers',
      isFreePreview: true,
    }));
  }

  // Content
  if (html) {
    if (!raw.leadParagraph || raw.leadParagraph.length < 30) {
      checks.push(row({
        id: 'bluf',
        category: 'content',
        outcome: 'fail',
        severity: 'high',
        weight: 3,
        title: 'Lead paragraph is not a direct answer (BLUF)',
        titleAr: 'المقدمة ليست إجابة مباشرة (BLUF)',
        signalDetected: raw.leadParagraph ? `Lead ${raw.leadParagraph.length} chars` : 'No lead paragraph',
        signalDetectedAr: raw.leadParagraph ? `المقدمة ${raw.leadParagraph.length} حرفاً` : 'لا مقدمة',
        evidence: raw.leadParagraph || 'none',
        evidenceAr: raw.leadParagraph || 'لا يوجد',
        whyItMatters: 'Answer engines extract early declarative text.',
        whyItMattersAr: 'محركات الإجابة تقتبس النص التصريحي الأول.',
        recommendedAction: 'Put a 40–60 word factual summary under the H1.',
        recommendedActionAr: 'ضع ملخصاً وقائعياً 40–60 كلمة تحت H1.',
        fixCategory: 'content',
        isFreePreview: true,
      }));
    } else {
      checks.push(row({
        id: 'bluf',
        category: 'content',
        outcome: 'pass',
        severity: 'informational',
        weight: 0,
        title: 'Lead paragraph present',
        titleAr: 'المقدمة موجودة',
        signalDetected: `${raw.leadParagraph.length} characters`,
        signalDetectedAr: `${raw.leadParagraph.length} حرفاً`,
        evidence: raw.leadParagraph.slice(0, 180),
        evidenceAr: raw.leadParagraph.slice(0, 180),
        whyItMatters: 'A clear lead is extractable.',
        whyItMattersAr: 'مقدمة واضحة قابلة للاقتباس.',
        recommendedAction: 'Keep the first paragraph factual.',
        recommendedActionAr: 'أبقِ الفقرة الأولى وقائعية.',
        fixCategory: 'content',
      }));
    }

    if (raw.h2Tags.length > 0 && !raw.hasQuestionHeadings) {
      checks.push(row({
        id: 'question-headings',
        category: 'content',
        outcome: 'fail',
        severity: 'medium',
        weight: 2,
        title: 'No question-style subheadings',
        titleAr: 'لا عناوين فرعية بصيغة سؤال',
        signalDetected: `H2s: ${raw.h2Tags.slice(0, 4).join(', ')}`,
        signalDetectedAr: `H2: ${raw.h2Tags.slice(0, 4).join(', ')}`,
        evidence: raw.h2Tags.slice(0, 6).join(' | '),
        evidenceAr: raw.h2Tags.slice(0, 6).join(' | '),
        whyItMatters: 'Question H2s match retrieval queries; they are not a Google rich-result.',
        whyItMattersAr: 'عناوين الأسئلة تطابق استعلامات الاسترجاع وليست نتيجة غنية من جوجل.',
        recommendedAction: 'Use some H2s as natural questions the page answers.',
        recommendedActionAr: 'صيغ بعض H2 كأسئلة تجيب عنها الصفحة.',
        fixCategory: 'content',
      }));
    } else if (raw.hasQuestionHeadings) {
      checks.push(row({
        id: 'question-headings',
        category: 'content',
        outcome: 'pass',
        severity: 'informational',
        weight: 0,
        title: 'Question-style headings present',
        titleAr: 'عناوين بصيغة سؤال موجودة',
        signalDetected: 'H2/H3 include questions',
        signalDetectedAr: 'العناوين تتضمن أسئلة',
        evidence: raw.h2Tags.filter((t) => t.includes('?') || t.includes('؟')).slice(0, 3).join(' | ') || raw.h2Tags[0],
        evidenceAr: raw.h2Tags[0] || '',
        whyItMatters: 'Question headings help extraction, not Google FAQ rich results (retired May 2026).',
        whyItMattersAr: 'عناوين الأسئلة تساعد الاستخراج، وليست نتيجة FAQ من جوجل (أُوقفت مايو 2026).',
        recommendedAction: 'Keep answers immediately under those headings.',
        recommendedActionAr: 'ضع الإجابة مباشرة تحت العنوان.',
        fixCategory: 'content',
      }));
    } else {
      checks.push(skipped('question-headings', 'content', 'No H2s to evaluate', 'لا H2 للتقييم', 'No H2 headings in the HTML.', 'لا عناوين H2 في HTML.'));
    }
  } else {
    checks.push(skipped('bluf', 'content', 'BLUF not inspected', 'BLUF لم يُفحص', HTML_SKIP, HTML_SKIP_AR));
    checks.push(skipped('question-headings', 'content', 'Headings not inspected', 'العناوين لم تُفحص', HTML_SKIP, HTML_SKIP_AR));
  }

  // Entity / schema
  if (html) {
    if (raw.schemaTypesDetected.length === 0) {
      checks.push(row({
        id: 'jsonld',
        category: 'entity',
        outcome: 'fail',
        severity: 'critical',
        weight: 5,
        title: 'No JSON-LD structured data',
        titleAr: 'لا بيانات منظمة JSON-LD',
        signalDetected: 'Zero ld+json blocks with @type',
        signalDetectedAr: 'لا كتل JSON-LD بـ @type',
        evidence: '<script type="application/ld+json"> not producing types',
        evidenceAr: 'لا أنواع Schema.org',
        whyItMatters: 'Without JSON-LD, engines infer entities from text only.',
        whyItMattersAr: 'بدون JSON-LD تُستنتج الكيانات من النص فقط.',
        recommendedAction: 'Add JSON-LD that matches visible page content.',
        recommendedActionAr: 'أضف JSON-LD يطابق المحتوى الظاهر.',
        fixCategory: 'schema',
        isFreePreview: true,
      }));
    } else {
      checks.push(row({
        id: 'jsonld',
        category: 'entity',
        outcome: 'pass',
        severity: 'informational',
        weight: 0,
        title: `JSON-LD types: ${raw.schemaTypesDetected.join(', ')}`,
        titleAr: `أنواع JSON-LD: ${raw.schemaTypesDetected.join(', ')}`,
        signalDetected: raw.schemaTypesDetected.join(', '),
        signalDetectedAr: raw.schemaTypesDetected.join(', '),
        evidence: JSON.stringify(raw.schemaTypesDetected),
        evidenceAr: JSON.stringify(raw.schemaTypesDetected),
        whyItMatters: 'Typed entities are machine-readable. Valid markup does not guarantee a Google rich result.',
        whyItMattersAr: 'الكيانات ذات النوع قابلة للقراءة آلياً. الوسم الصحيح لا يضمن نتيجة غنية من جوجل.',
        recommendedAction: 'Keep @id stable and describe only visible content.',
        recommendedActionAr: 'ثبّت @id وصِف المحتوى الظاهر فقط.',
        fixCategory: 'schema',
      }));
    }

    if (raw.ogTitle) {
      checks.push(row({
        id: 'og-title',
        category: 'entity',
        outcome: 'pass',
        severity: 'informational',
        weight: 0,
        title: 'og:title present',
        titleAr: 'og:title موجود',
        signalDetected: raw.ogTitle,
        signalDetectedAr: raw.ogTitle,
        evidence: raw.ogTitle,
        evidenceAr: raw.ogTitle,
        whyItMatters: 'Open Graph is for sharing, not Google ranking.',
        whyItMattersAr: 'Open Graph للمشاركة وليس لترتيب جوجل.',
        recommendedAction: 'Keep og:title aligned with the visible title.',
        recommendedActionAr: 'اجعل og:title مطابقاً للعنوان الظاهر.',
        fixCategory: 'meta',
      }));
    } else {
      checks.push(row({
        id: 'og-title',
        category: 'entity',
        outcome: 'fail',
        severity: 'low',
        weight: 1,
        title: 'Missing og:title',
        titleAr: 'og:title مفقود',
        signalDetected: 'No og:title meta',
        signalDetectedAr: 'لا og:title',
        evidence: 'meta property=og:title not found',
        evidenceAr: 'og:title غير موجود',
        whyItMatters: 'Shares fall back to generic titles.',
        whyItMattersAr: 'المشاركات تسقط إلى عناوين عامة.',
        recommendedAction: 'Add og:title matching the page.',
        recommendedActionAr: 'أضف og:title مطابقاً للصفحة.',
        fixCategory: 'meta',
      }));
    }
  } else {
    checks.push(skipped('jsonld', 'entity', 'JSON-LD not inspected', 'JSON-LD لم يُفحص', HTML_SKIP, HTML_SKIP_AR));
    checks.push(skipped('og-title', 'entity', 'Open Graph not inspected', 'Open Graph لم يُفحص', HTML_SKIP, HTML_SKIP_AR));
  }

  return checks;
}
