/**
 * Check catalog. Every check reads only evidence that was actually retrieved;
 * if the evidence is missing the check is `not_assessed` and carries no weight.
 */
import { BOT_REGISTRY } from '@/lib/bots/registry';
import { openingDefinition, quantifiedSamples, type PageFacts } from './html';
import { describeRule, evaluateRobots, type ParsedRobots } from './robots';
import type { SchemaAnalysis } from './schema';
import { SCHEMA_SETS } from './schema';
import {
  SEVERITY_WEIGHT,
  type AuditCheck,
  type BotMatrixRow,
  type Category,
  type CheckStatus,
  type FixCategory,
  type FixSnippet,
  type PageType,
  type ServerPayload,
  type Severity,
} from './types';

interface Bi {
  en: string;
  ar: string;
}
const bi = (en: string, ar: string): Bi => ({ en, ar });

interface Def {
  id: string;
  category: Category;
  severity: Severity;
  fixCategory: FixCategory;
  title: Bi;
  why: Bi;
  source?: string;
}

export interface CheckContext {
  url: string;
  origin: string;
  path: string;
  payload: ServerPayload;
  headers: Record<string, string>;
  page: PageFacts;
  schema: SchemaAnalysis;
  robots: ParsedRobots | null;
  robotsState: 'ok' | 'missing' | 'server_error' | 'unreachable';
  pageType: PageType;
  siteName: string;
  jsDependent: 'yes' | 'partial' | 'no';
}

function make(
  def: Def,
  status: CheckStatus,
  detail: Bi,
  evidence: Bi = detail,
  fix: Bi = bi('', ''),
  opts: { severity?: Severity; snippet?: FixSnippet } = {},
): AuditCheck {
  const severity = opts.severity || def.severity;
  const scored = status === 'pass' || status === 'warn' || status === 'fail';
  return {
    id: def.id,
    category: def.category,
    severity,
    weight: scored ? SEVERITY_WEIGHT[severity] : 0,
    status,
    title: def.title.en,
    titleAr: def.title.ar,
    detail: detail.en,
    detailAr: detail.ar,
    evidence: evidence.en,
    evidenceAr: evidence.ar,
    why: def.why.en,
    whyAr: def.why.ar,
    fix: fix.en,
    fixAr: fix.ar,
    fixCategory: def.fixCategory,
    fixSnippet: opts.snippet,
    source: def.source,
  };
}

const notAssessed = (def: Def, reason: Bi) => make(def, 'not_assessed', reason);

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function sameUrl(a: string, b: string): boolean {
  try {
    const x = new URL(a);
    const y = new URL(b);
    const norm = (u: URL) =>
      `${u.protocol}//${u.host.toLowerCase().replace(/:(80|443)$/, '')}${(u.pathname.replace(/\/+$/, '') || '/')}${u.search}`;
    return norm(x) === norm(y);
  } catch {
    return false;
  }
}

function hostKey(url: string): string {
  try {
    return new URL(url).host.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function guessLang(text: string): string {
  const sample = text.slice(0, 3000);
  const arabic = (sample.match(/[\u0600-\u06ff]/g) || []).length;
  const latin = (sample.match(/[a-z]/gi) || []).length;
  return arabic > latin ? 'ar' : 'en';
}

// ---------------------------------------------------------------------------
// Technical SEO
// ---------------------------------------------------------------------------

const D = {
  https: {
    id: 'https', category: 'technical', severity: 'high', fixCategory: 'headers',
    title: bi('HTTPS', 'بروتوكول HTTPS'),
    why: bi('HTTPS is a Google ranking signal and browsers flag plain-HTTP pages as "Not secure".', 'HTTPS إشارة ترتيب لدى جوجل، والمتصفحات تُظهر صفحات HTTP كـ "غير آمنة".'),
  },
  httpRedirect: {
    id: 'http-to-https', category: 'technical', severity: 'medium', fixCategory: 'headers',
    title: bi('HTTP → HTTPS redirect', 'تحويل HTTP إلى HTTPS'),
    why: bi('Without a permanent redirect, the HTTP and HTTPS versions compete as duplicates and links to the HTTP version lose value.', 'بدون تحويل دائم تتنافس نسختا HTTP وHTTPS كمحتوى مكرر وتضيع قيمة الروابط.'),
  },
  redirects: {
    id: 'redirect-chain', category: 'technical', severity: 'medium', fixCategory: 'headers',
    title: bi('Redirect chain', 'سلسلة التحويلات'),
    why: bi('Every extra hop adds latency and crawl cost; Google follows up to 10 hops but recommends linking directly to the final URL.', 'كل تحويل إضافي يزيد زمن التحميل وتكلفة الزحف؛ جوجل توصي بالربط المباشر بالرابط النهائي.'),
  },
  noindex: {
    id: 'indexability', category: 'technical', severity: 'critical', fixCategory: 'meta',
    title: bi('Indexability (noindex)', 'قابلية الفهرسة (noindex)'),
    why: bi('A noindex directive in a robots meta tag or X-Robots-Tag header removes the page from Google and Bing results.', 'تعليمة noindex في وسم robots أو هيدر X-Robots-Tag تحذف الصفحة من نتائج جوجل وبينج.'),
    source: 'https://developers.google.com/search/docs/crawling-indexing/block-indexing',
  },
  canonical: {
    id: 'canonical', category: 'technical', severity: 'medium', fixCategory: 'meta',
    title: bi('Canonical URL', 'الرابط الأساسي (Canonical)'),
    why: bi('A self-referencing canonical consolidates duplicate URLs (tracking parameters, trailing slashes, http/https) into one indexed URL.', 'الرابط الأساسي المرجعي يوحّد النسخ المكررة للرابط (بارامترات التتبع، الشرطة الأخيرة، http/https) في رابط واحد مفهرس.'),
    source: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
  },
  title: {
    id: 'title', category: 'technical', severity: 'high', fixCategory: 'meta',
    title: bi('Title tag', 'وسم العنوان (Title)'),
    why: bi('The title is the main headline in search results and the strongest on-page relevance signal. Google typically shows about 50–60 characters.', 'العنوان هو السطر الرئيسي في نتائج البحث وأقوى إشارة صلة داخل الصفحة. جوجل يعرض عادة 50–60 حرفاً.'),
    source: 'https://developers.google.com/search/docs/appearance/title-link',
  },
  description: {
    id: 'meta-description', category: 'technical', severity: 'medium', fixCategory: 'meta',
    title: bi('Meta description', 'الوصف التعريفي (Meta description)'),
    why: bi('Search engines often use it as the snippet under your title; a specific description improves click-through. Aim for roughly 120–160 characters.', 'محركات البحث تستخدمه غالباً كمقتطف تحت العنوان؛ الوصف الدقيق يرفع معدل النقر. الأفضل 120–160 حرفاً تقريباً.'),
    source: 'https://developers.google.com/search/docs/appearance/snippet',
  },
  h1: {
    id: 'h1', category: 'technical', severity: 'high', fixCategory: 'content',
    title: bi('Main heading (H1)', 'العنوان الرئيسي (H1)'),
    why: bi('The H1 tells crawlers and AI parsers what the page is about and anchors the heading outline.', 'وسم H1 يخبر الزواحف ومحللات الذكاء الاصطناعي بموضوع الصفحة ويؤسس هيكل العناوين.'),
  },
  headingOrder: {
    id: 'heading-hierarchy', category: 'technical', severity: 'low', fixCategory: 'content',
    title: bi('Heading hierarchy', 'تسلسل العناوين'),
    why: bi('A logical H1 → H2 → H3 outline helps assistive tech and lets answer engines map sections to questions.', 'تسلسل منطقي H1 ← H2 ← H3 يساعد قارئات الشاشة ويمكّن محركات الإجابة من ربط الأقسام بالأسئلة.'),
  },
  lang: {
    id: 'html-lang', category: 'technical', severity: 'medium', fixCategory: 'meta',
    title: bi('Language declaration (lang)', 'إعلان اللغة (lang)'),
    why: bi('The lang attribute declares the content language for screen readers, translation, and language-aware crawlers.', 'خاصية lang تعلن لغة المحتوى لقارئات الشاشة والترجمة والزواحف الحساسة للغة.'),
  },
  viewport: {
    id: 'viewport', category: 'technical', severity: 'high', fixCategory: 'meta',
    title: bi('Mobile viewport', 'إعداد العرض للجوال (Viewport)'),
    why: bi('Google indexes the mobile version of pages. Without a viewport tag mobile browsers render a zoomed-out desktop layout.', 'جوجل يفهرس نسخة الجوال. بدون وسم viewport تعرض متصفحات الجوال تخطيط سطح المكتب مصغراً.'),
    source: 'https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing',
  },
  charset: {
    id: 'charset', category: 'technical', severity: 'low', fixCategory: 'meta',
    title: bi('Character encoding', 'ترميز الحروف'),
    why: bi('Declaring UTF-8 prevents garbled characters, especially for Arabic and other non-Latin text.', 'إعلان UTF-8 يمنع تشوّه الحروف، خصوصاً العربية واللغات غير اللاتينية.'),
  },
  social: {
    id: 'social-cards', category: 'technical', severity: 'medium', fixCategory: 'meta',
    title: bi('Open Graph & social cards', 'بطاقات المشاركة (Open Graph)'),
    why: bi('og:title, og:description and og:image control link previews in LinkedIn, X, WhatsApp, Slack and many AI chat interfaces.', 'وسوم og:title وog:description وog:image تتحكم في معاينة الرابط في لينكدإن وX وواتساب وسلاك وواجهات الذكاء الاصطناعي.'),
    source: 'https://ogp.me/',
  },
  hreflang: {
    id: 'hreflang', category: 'technical', severity: 'medium', fixCategory: 'meta',
    title: bi('hreflang alternates', 'روابط hreflang للغات'),
    why: bi('Valid hreflang tells Google which language/region version to show and prevents translated pages from competing.', 'وسوم hreflang الصحيحة تخبر جوجل أي نسخة لغوية يعرض وتمنع تنافس الصفحات المترجمة.'),
    source: 'https://developers.google.com/search/docs/specialty/international/localized-versions',
  },
  images: {
    id: 'image-alt', category: 'technical', severity: 'medium', fixCategory: 'content',
    title: bi('Image alt text', 'النص البديل للصور (alt)'),
    why: bi('Alt text is how search engines, AI models and screen readers understand images; it also makes images eligible for image search.', 'النص البديل هو طريقة فهم محركات البحث والذكاء الاصطناعي وقارئات الشاشة للصور، ويؤهلها للظهور في بحث الصور.'),
  },
  mixed: {
    id: 'mixed-content', category: 'technical', severity: 'medium', fixCategory: 'headers',
    title: bi('Mixed content', 'محتوى مختلط (HTTP داخل HTTPS)'),
    why: bi('HTTP resources on an HTTPS page are blocked or flagged by browsers, breaking images/scripts and the security indicator.', 'موارد HTTP داخل صفحة HTTPS تحجبها المتصفحات أو تحذّر منها فتتعطل الصور والسكربتات.'),
  },
  refresh: {
    id: 'meta-refresh', category: 'technical', severity: 'medium', fixCategory: 'headers',
    title: bi('Meta refresh redirect', 'تحويل meta refresh'),
    why: bi('Meta refresh redirects are slower and less reliable than server-side 301 redirects.', 'التحويل عبر meta refresh أبطأ وأقل موثوقية من تحويل 301 من السيرفر.'),
  },
  soft404: {
    id: 'soft-404', category: 'technical', severity: 'medium', fixCategory: 'headers',
    title: bi('404 handling', 'التعامل مع الصفحات غير الموجودة (404)'),
    why: bi('Returning 200 for missing URLs creates "soft 404s": crawlers waste budget on junk URLs and may index error pages.', 'إرجاع 200 لروابط غير موجودة يخلق "soft 404": الزواحف تهدر الزحف على روابط وهمية وقد تفهرس صفحات الخطأ.'),
    source: 'https://developers.google.com/search/docs/crawling-indexing/http-network-errors',
  },
  favicon: {
    id: 'favicon', category: 'technical', severity: 'low', fixCategory: 'meta',
    title: bi('Favicon', 'أيقونة الموقع (Favicon)'),
    why: bi('Google shows the favicon next to your result on mobile and desktop; missing icons look untrustworthy.', 'جوجل يعرض الأيقونة بجوار نتيجتك؛ غيابها يقلل الثقة.'),
    source: 'https://developers.google.com/search/docs/appearance/favicon-in-search',
  },
  security: {
    id: 'security-headers', category: 'technical', severity: 'low', fixCategory: 'headers',
    title: bi('Security headers', 'هيدرات الأمان'),
    why: bi('HSTS and X-Content-Type-Options are baseline trust signals that protect visitors from downgrade and MIME-sniffing attacks.', 'HSTS وX-Content-Type-Options إشارات ثقة أساسية تحمي الزوار من هجمات خفض البروتوكول وتخمين نوع الملف.'),
  },
  cert: {
    id: 'tls-certificate', category: 'technical', severity: 'high', fixCategory: 'headers',
    title: bi('TLS certificate validity', 'صلاحية شهادة SSL'),
    why: bi('An expired certificate makes browsers and crawlers refuse the connection.', 'انتهاء الشهادة يجعل المتصفحات والزواحف ترفض الاتصال.'),
  },
} satisfies Record<string, Def>;

function technicalChecks(ctx: CheckContext): AuditCheck[] {
  const out: AuditCheck[] = [];
  const { page, payload, headers, url } = ctx;
  const snippetHead = (code: string, en: string, ar: string): FixSnippet => ({ language: 'html', code, label: en, labelAr: ar });

  // HTTPS
  if (url.startsWith('https://')) {
    out.push(make(D.https, 'pass', bi('Final URL is served over HTTPS.', 'الرابط النهائي يعمل عبر HTTPS.'), bi(url, url)));
  } else {
    out.push(make(D.https, 'fail', bi('Final URL is plain HTTP.', 'الرابط النهائي يعمل عبر HTTP غير المشفر.'), bi(url, url),
      bi('Install a TLS certificate (free via Let\'s Encrypt or your host) and 301-redirect every HTTP URL to HTTPS.', 'ثبّت شهادة SSL (مجانية عبر Let\'s Encrypt أو الاستضافة) وحوّل كل روابط HTTP إلى HTTPS بتحويل 301.')));
  }

  // HTTP → HTTPS
  const hv = payload.probes?.httpVariant;
  if (!url.startsWith('https://')) {
    // covered by the HTTPS check
  } else if (!payload.probes) {
    out.push(notAssessed(D.httpRedirect, bi('Probe not available for this audit.', 'الاختبار غير متاح لهذا الفحص.')));
  } else if (!hv || hv.error) {
    out.push(make(D.httpRedirect, 'pass', bi('Port 80 does not serve the page (no duplicate HTTP version).', 'المنفذ 80 لا يخدم الصفحة (لا توجد نسخة HTTP مكررة).'),
      bi(`http:// request: ${hv?.error || 'no response'}`, `طلب http://: ${hv?.error || 'لا استجابة'}`)));
  } else if ((hv.status === 301 || hv.status === 308) && (hv.location || '').startsWith('https://')) {
    out.push(make(D.httpRedirect, 'pass', bi(`HTTP permanently redirects to HTTPS (${hv.status}).`, `HTTP يتحول نهائياً إلى HTTPS (${hv.status}).`),
      bi(`${hv.url} → ${hv.status} → ${hv.location}`, `${hv.url} ← ${hv.status} ← ${hv.location}`)));
  } else if (hv.status && hv.status >= 300 && hv.status < 400) {
    out.push(make(D.httpRedirect, 'warn', bi(`HTTP redirects with a temporary ${hv.status}.`, `HTTP يتحول بتحويل مؤقت ${hv.status}.`),
      bi(`${hv.url} → ${hv.status} → ${hv.location || '?'}`, `${hv.url} ← ${hv.status} ← ${hv.location || '?'}`),
      bi('Use a permanent 301 (or 308) redirect from HTTP to HTTPS.', 'استخدم تحويلاً دائماً 301 (أو 308) من HTTP إلى HTTPS.'), { severity: 'low' }));
  } else {
    out.push(make(D.httpRedirect, 'fail', bi(`The HTTP version answers ${hv.status} instead of redirecting.`, `نسخة HTTP ترد بـ ${hv.status} بدل التحويل.`),
      bi(`${hv.url} → HTTP ${hv.status}`, `${hv.url} ← HTTP ${hv.status}`),
      bi('Add a server-level 301 redirect from http:// to https://.', 'أضف تحويل 301 على مستوى السيرفر من http:// إلى https://.'),
      { snippet: { language: 'apache', label: '.htaccess (Apache / Hostinger / cPanel)', labelAr: 'ملف .htaccess (Apache / Hostinger / cPanel)', code: 'RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]' } }));
  }

  // Redirect chain
  const hops = Math.max(0, (payload.redirects?.length || 1) - 1);
  const chainText = (payload.redirects || []).map((r) => `${r.status ?? '—'} ${r.url}`).join('\n');
  const temp = (payload.redirects || []).slice(0, -1).some((r) => r.status === 302 || r.status === 307);
  if (hops === 0) {
    out.push(make(D.redirects, 'pass', bi('No redirects — the requested URL answers directly.', 'لا توجد تحويلات — الرابط يستجيب مباشرة.'), bi(chainText, chainText)));
  } else if (hops === 1 && !temp) {
    out.push(make(D.redirects, 'pass', bi('One permanent redirect to the final URL.', 'تحويل دائم واحد إلى الرابط النهائي.'), bi(chainText, chainText)));
  } else if (hops <= 2) {
    out.push(make(D.redirects, 'warn', bi(`${hops} redirect hop(s)${temp ? ', including a temporary 302/307' : ''}.`, `${hops} تحويل${temp ? '، منها تحويل مؤقت 302/307' : ''}.`), bi(chainText, chainText),
      bi('Link to the final URL directly and make site-wide redirects permanent (301/308).', 'اربط بالرابط النهائي مباشرة واجعل التحويلات العامة دائمة (301/308).'), { severity: 'low' }));
  } else {
    out.push(make(D.redirects, 'fail', bi(`${hops} redirect hops before the page loads.`, `${hops} تحويلات قبل تحميل الصفحة.`), bi(chainText, chainText),
      bi('Collapse the chain into a single 301 from the original URL to the final URL.', 'اختصر السلسلة إلى تحويل 301 واحد من الرابط الأصلي إلى النهائي.')));
  }

  // noindex
  const robotsMeta = page.metaRobots.join(', ').toLowerCase();
  const xRobots = (headers['x-robots-tag'] || '').toLowerCase();
  const noindexSource = /noindex|none/.test(robotsMeta) ? `<meta name="robots" content="${page.metaRobots.join(', ')}">` : /noindex|none/.test(xRobots) ? `X-Robots-Tag: ${headers['x-robots-tag']}` : null;
  if (noindexSource) {
    out.push(make(D.noindex, 'fail', bi('The page tells search engines not to index it.', 'الصفحة تطلب من محركات البحث عدم فهرستها.'), bi(noindexSource, noindexSource),
      bi('Remove "noindex" from the robots meta tag / X-Robots-Tag header on pages that should rank. Check SEO plugin settings (e.g. "Discourage search engines" in WordPress).', 'احذف "noindex" من وسم robots أو هيدر X-Robots-Tag في الصفحات المطلوب ظهورها. راجع إعدادات إضافات السيو (مثل "منع محركات البحث" في ووردبريس).')));
  } else {
    const ev = page.metaRobots.length ? `<meta name="robots" content="${page.metaRobots.join(', ')}">` : 'No robots meta tag and no X-Robots-Tag noindex';
    out.push(make(D.noindex, 'pass', bi('Indexable — no noindex directive found.', 'قابلة للفهرسة — لا توجد تعليمة noindex.'), bi(ev, page.metaRobots.length ? ev : 'لا يوجد وسم robots ولا هيدر X-Robots-Tag بـ noindex')));
  }

  // Canonical
  const canonicalSnippet = snippetHead(`<link rel="canonical" href="${esc(url)}" />`, 'Add inside <head>', 'أضفه داخل <head>');
  const uniqueCanonicals = [...new Set(page.canonicals)];
  if (uniqueCanonicals.length === 0) {
    out.push(make(D.canonical, 'warn', bi('No canonical tag declared.', 'لا يوجد وسم canonical.'), bi('<link rel="canonical"> not found in HTML', 'لم يُعثر على <link rel="canonical"> في HTML'),
      bi('Add a self-referencing absolute canonical URL to every indexable page.', 'أضف رابطاً أساسياً مطلقاً يشير للصفحة نفسها في كل صفحة قابلة للفهرسة.'), { snippet: canonicalSnippet }));
  } else if (uniqueCanonicals.length > 1) {
    out.push(make(D.canonical, 'fail', bi(`${uniqueCanonicals.length} different canonical URLs declared — Google may ignore all of them.`, `${uniqueCanonicals.length} روابط canonical مختلفة — جوجل قد يتجاهلها كلها.`),
      bi(uniqueCanonicals.join('\n'), uniqueCanonicals.join('\n')), bi('Keep exactly one canonical tag per page (often a theme and an SEO plugin both add one).', 'أبقِ وسم canonical واحداً فقط (غالباً القالب وإضافة السيو يضيفان وسمين).'), { severity: 'high', snippet: canonicalSnippet }));
  } else {
    const raw = uniqueCanonicals[0];
    let absolute = raw;
    try {
      absolute = new URL(raw, url).href;
    } catch {
      absolute = raw;
    }
    if (!/^https?:\/\//i.test(raw)) {
      out.push(make(D.canonical, 'warn', bi('Canonical is a relative URL.', 'الرابط الأساسي نسبي وليس مطلقاً.'), bi(`href="${raw}"`, `href="${raw}"`),
        bi('Use an absolute URL including https:// and the host.', 'استخدم رابطاً مطلقاً يتضمن https:// واسم النطاق.'), { severity: 'low', snippet: canonicalSnippet }));
    } else if (sameUrl(absolute, url)) {
      out.push(make(D.canonical, 'pass', bi('Self-referencing canonical matches the final URL.', 'الرابط الأساسي يشير للصفحة نفسها ويطابق الرابط النهائي.'), bi(raw, raw)));
    } else if (hostKey(absolute) !== hostKey(url)) {
      out.push(make(D.canonical, 'fail', bi('Canonical points to a different domain — this page asks to be dropped in favour of another site.', 'الرابط الأساسي يشير لنطاق آخر — الصفحة تطلب استبعادها لصالح موقع آخر.'),
        bi(`Page: ${url}\nCanonical: ${raw}`, `الصفحة: ${url}\nالأساسي: ${raw}`), bi('Point the canonical to this page unless the content is intentionally syndicated.', 'اجعل الرابط الأساسي يشير لهذه الصفحة إلا لو كان المحتوى منقولاً عن قصد.'), { severity: 'high', snippet: canonicalSnippet }));
    } else {
      out.push(make(D.canonical, 'warn', bi('Canonical points to a different URL on this site, so this URL will not be indexed itself.', 'الرابط الأساسي يشير لرابط آخر في الموقع، فلن تُفهرس هذه الصفحة بذاتها.'),
        bi(`Page: ${url}\nCanonical: ${raw}`, `الصفحة: ${url}\nالأساسي: ${raw}`), bi('Confirm this is intended (e.g. parameter or pagination variants). Otherwise make the canonical self-referencing.', 'تأكد أن هذا مقصود (مثل نسخ البارامترات أو الترقيم). وإلا اجعله يشير للصفحة نفسها.'), { severity: 'medium', snippet: canonicalSnippet }));
    }
  }

  // Title
  const suggestedTitle = truncate(`${page.h1[0] || ctx.siteName}${page.h1[0] && ctx.siteName && !page.h1[0].includes(ctx.siteName) ? ` | ${ctx.siteName}` : ''}`, 60);
  const titleSnippet = snippetHead(`<title>${esc(suggestedTitle)}</title>`, 'Suggested title (edit wording)', 'عنوان مقترح (عدّل الصياغة)');
  if (!page.title) {
    out.push(make(D.title, 'fail', bi('No <title> tag found.', 'لا يوجد وسم <title>.'), bi('<title> not found in <head>', 'لم يُعثر على <title> في <head>'),
      bi('Add a unique, descriptive title of about 50–60 characters with the primary topic first.', 'أضف عنواناً فريداً وصفياً من 50–60 حرفاً تقريباً يبدأ بالموضوع الرئيسي.'), { snippet: titleSnippet }));
  } else {
    const len = [...page.title].length;
    const ev = bi(`"${page.title}" (${len} chars)`, `"${page.title}" (${len} حرف)`);
    if (page.titles.length > 1) {
      out.push(make(D.title, 'warn', bi(`${page.titles.length} <title> tags found — browsers and crawlers use only the first.`, `${page.titles.length} وسوم <title> — تُستخدم الأولى فقط.`), ev,
        bi('Keep a single <title> in <head>.', 'أبقِ وسم <title> واحداً في <head>.'), { severity: 'low' }));
    } else if (len < 15) {
      out.push(make(D.title, 'warn', bi(`Title is very short (${len} characters).`, `العنوان قصير جداً (${len} حرف).`), ev,
        bi('Expand it to describe the page topic and brand in about 50–60 characters.', 'وسّعه ليصف موضوع الصفحة والعلامة في 50–60 حرفاً تقريباً.'), { severity: 'medium', snippet: titleSnippet }));
    } else if (len > 65) {
      out.push(make(D.title, 'warn', bi(`Title is ${len} characters and will likely be truncated in results.`, `العنوان ${len} حرفاً وسيُقتطع غالباً في النتائج.`), ev,
        bi('Move the key phrase to the front and trim to about 60 characters.', 'قدّم العبارة الأساسية واختصر العنوان إلى 60 حرفاً تقريباً.'), { severity: 'low', snippet: titleSnippet }));
    } else {
      out.push(make(D.title, 'pass', bi(`Title length is good (${len} characters).`, `طول العنوان مناسب (${len} حرف).`), ev));
    }
  }

  // Meta description
  const descSource = page.leadParagraph || page.og.description || '';
  const descSnippet = descSource
    ? snippetHead(`<meta name="description" content="${esc(truncate(descSource, 155))}" />`, 'Draft from your lead paragraph (edit)', 'مسودة من فقرتك الأولى (عدّلها)')
    : undefined;
  if (!page.metaDescription) {
    out.push(make(D.description, 'fail', bi('No meta description.', 'لا يوجد وصف تعريفي.'), bi('<meta name="description"> not found', 'لم يُعثر على <meta name="description">'),
      bi('Write a specific 120–160 character summary that states what the page offers and for whom.', 'اكتب ملخصاً محدداً من 120–160 حرفاً يوضح ما تقدمه الصفحة ولمن.'), { snippet: descSnippet }));
  } else {
    const len = [...page.metaDescription].length;
    const ev = bi(`"${truncate(page.metaDescription, 200)}" (${len} chars)`, `"${truncate(page.metaDescription, 200)}" (${len} حرف)`);
    if (page.metaDescriptions.length > 1) {
      out.push(make(D.description, 'warn', bi(`${page.metaDescriptions.length} meta descriptions found.`, `${page.metaDescriptions.length} أوصاف تعريفية في الصفحة.`), ev,
        bi('Keep exactly one meta description.', 'أبقِ وصفاً تعريفياً واحداً فقط.'), { severity: 'low' }));
    } else if (len < 70) {
      out.push(make(D.description, 'warn', bi(`Meta description is short (${len} characters).`, `الوصف التعريفي قصير (${len} حرف).`), ev,
        bi('Expand to about 120–160 characters with the concrete benefit.', 'وسّعه إلى 120–160 حرفاً تقريباً مع الفائدة الملموسة.'), { severity: 'low', snippet: descSnippet }));
    } else if (len > 170) {
      out.push(make(D.description, 'warn', bi(`Meta description is long (${len} characters) and will be cut off.`, `الوصف التعريفي طويل (${len} حرف) وسيُقتطع.`), ev,
        bi('Trim to about 155 characters, keeping the key message first.', 'اختصره إلى 155 حرفاً تقريباً مع تقديم الرسالة الأساسية.'), { severity: 'low', snippet: descSnippet }));
    } else {
      out.push(make(D.description, 'pass', bi(`Meta description length is good (${len} characters).`, `طول الوصف التعريفي مناسب (${len} حرف).`), ev));
    }
  }

  // H1
  const emptyH1 = page.h1.filter((h) => !h).length;
  if (page.h1.length === 0) {
    out.push(make(D.h1, 'fail', bi('No <h1> in the HTML.', 'لا يوجد وسم <h1> في HTML.'), bi(ctx.jsDependent === 'yes' ? '<h1> not present in server HTML (likely rendered by JavaScript)' : '<h1> not found', ctx.jsDependent === 'yes' ? '<h1> غير موجود في HTML السيرفر (غالباً يُرسم بالجافاسكربت)' : 'لم يُعثر على <h1>'),
      bi('Add one H1 that states the page topic in plain words.', 'أضف وسم H1 واحداً يذكر موضوع الصفحة بكلمات واضحة.'), { snippet: snippetHead(`<h1>${esc(page.title?.split(/\s[|–—-]\s/)[0] || ctx.siteName)}</h1>`, 'Suggested H1', 'H1 مقترح') }));
  } else if (emptyH1 === page.h1.length) {
    out.push(make(D.h1, 'fail', bi('The H1 exists but has no text.', 'وسم H1 موجود لكنه فارغ.'), bi('<h1></h1>', '<h1></h1>'), bi('Put a descriptive text heading inside the H1 (not only an image).', 'ضع نصاً وصفياً داخل H1 (وليس صورة فقط).')));
  } else if (page.h1.length > 1) {
    out.push(make(D.h1, 'warn', bi(`${page.h1.length} H1 headings — the main topic is ambiguous.`, `${page.h1.length} عناوين H1 — الموضوع الرئيسي غير واضح.`), bi(page.h1.slice(0, 4).map((h) => `• ${h}`).join('\n'), page.h1.slice(0, 4).map((h) => `• ${h}`).join('\n')),
      bi('Keep one H1 for the page topic and demote the others to H2.', 'أبقِ H1 واحداً لموضوع الصفحة وحوّل الباقي إلى H2.'), { severity: 'low' }));
  } else {
    out.push(make(D.h1, 'pass', bi('Exactly one H1.', 'وسم H1 واحد.'), bi(`"${page.h1[0]}"`, `"${page.h1[0]}"`)));
  }

  // Heading hierarchy
  if (page.headings.length >= 2) {
    const skips: string[] = [];
    for (let i = 1; i < page.headings.length; i++) {
      const prev = page.headings[i - 1].level;
      const cur = page.headings[i].level;
      if (cur > prev + 1) skips.push(`H${prev} → H${cur}: "${truncate(page.headings[i].text, 60)}"`);
    }
    if (skips.length === 0) {
      out.push(make(D.headingOrder, 'pass', bi(`${page.headings.length} headings in a logical order.`, `${page.headings.length} عنواناً بترتيب منطقي.`)));
    } else {
      out.push(make(D.headingOrder, 'warn', bi(`${skips.length} skipped heading level(s).`, `${skips.length} قفزة في مستويات العناوين.`), bi(skips.slice(0, 4).join('\n'), skips.slice(0, 4).join('\n')),
        bi('Use headings in order (H2 under H1, H3 under H2). Style with CSS instead of picking a level for its size.', 'استخدم العناوين بالترتيب (H2 تحت H1 وH3 تحت H2) واضبط الحجم بالـ CSS.')));
    }
  } else {
    out.push(notAssessed(D.headingOrder, bi('Fewer than two headings in the HTML.', 'أقل من عنوانين في HTML.')));
  }

  // lang
  if (page.lang) {
    out.push(make(D.lang, 'pass', bi(`lang="${page.lang}" declared.`, `lang="${page.lang}" معلن.`), bi(`<html lang="${page.lang}">`, `<html lang="${page.lang}">`)));
  } else {
    const guess = guessLang(page.text);
    out.push(make(D.lang, 'warn', bi('No lang attribute on <html>.', 'لا توجد خاصية lang في وسم <html>.'), bi('<html> without lang', '<html> بدون lang'),
      bi(`Declare the page language${guess === 'ar' ? ' and direction' : ''}.`, `أعلن لغة الصفحة${guess === 'ar' ? ' واتجاهها' : ''}.`),
      { snippet: snippetHead(guess === 'ar' ? '<html lang="ar" dir="rtl">' : '<html lang="en">', 'Root element', 'العنصر الجذري') }));
  }

  // viewport
  if (page.viewport && /width\s*=\s*device-width/i.test(page.viewport)) {
    out.push(make(D.viewport, 'pass', bi('Responsive viewport declared.', 'إعداد عرض متجاوب معلن.'), bi(`<meta name="viewport" content="${page.viewport}">`, `<meta name="viewport" content="${page.viewport}">`)));
  } else {
    out.push(make(D.viewport, page.viewport ? 'warn' : 'fail', bi(page.viewport ? 'Viewport does not use width=device-width.' : 'No viewport meta tag.', page.viewport ? 'إعداد العرض لا يستخدم width=device-width.' : 'لا يوجد وسم viewport.'),
      bi(page.viewport ? `content="${page.viewport}"` : '<meta name="viewport"> not found', page.viewport ? `content="${page.viewport}"` : 'لم يُعثر على <meta name="viewport">'),
      bi('Add the standard responsive viewport tag.', 'أضف وسم العرض المتجاوب القياسي.'),
      { snippet: snippetHead('<meta name="viewport" content="width=device-width, initial-scale=1" />', 'Add inside <head>', 'أضفه داخل <head>') }));
  }

  // charset
  const headerCharset = /charset=/i.test(headers['content-type'] || '');
  if (page.charset || headerCharset) {
    out.push(make(D.charset, 'pass', bi(`Encoding declared (${page.charset || (headers['content-type'] || '').split('charset=')[1]}).`, `الترميز معلن (${page.charset || (headers['content-type'] || '').split('charset=')[1]}).`)));
  } else {
    out.push(make(D.charset, 'warn', bi('No charset in HTML or Content-Type header.', 'لا يوجد charset في HTML ولا في هيدر Content-Type.'), undefined,
      bi('Declare UTF-8 as the first element in <head>.', 'أعلن UTF-8 كأول عنصر في <head>.'), { snippet: snippetHead('<meta charset="utf-8" />', 'First line of <head>', 'أول سطر في <head>') }));
  }

  // Social cards
  const ogMissing = ['title', 'description', 'image'].filter((k) => !page.og[k]);
  const ogSnippet = snippetHead(
    [
      `<meta property="og:type" content="${ctx.pageType === 'article' ? 'article' : 'website'}" />`,
      `<meta property="og:url" content="${esc(url)}" />`,
      `<meta property="og:title" content="${esc(page.og.title || page.title || ctx.siteName)}" />`,
      `<meta property="og:description" content="${esc(truncate(page.og.description || page.metaDescription || page.leadParagraph || '', 200))}" />`,
      `<meta property="og:image" content="${esc(page.og.image || `${ctx.origin}/og-image.png`)}" />`,
      `<meta property="og:site_name" content="${esc(ctx.siteName)}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
    ].join('\n'),
    'Prefilled from your page — use a real 1200×630 image',
    'معبأة من صفحتك — استخدم صورة حقيقية 1200×630',
  );
  if (ogMissing.length === 0) {
    out.push(make(D.social, page.twitter.card ? 'pass' : 'pass', bi(`Open Graph title, description and image present${page.twitter.card ? ` (twitter:card=${page.twitter.card})` : ''}.`, `عنوان ووصف وصورة Open Graph موجودة${page.twitter.card ? ` (twitter:card=${page.twitter.card})` : ''}.`),
      bi(`og:image = ${page.og.image}`, `og:image = ${page.og.image}`)));
  } else if (ogMissing.length === 3) {
    out.push(make(D.social, 'fail', bi('No Open Graph tags — shared links show a generic or empty preview.', 'لا توجد وسوم Open Graph — الروابط المشاركة تظهر بمعاينة فارغة أو عامة.'), bi('og:title, og:description, og:image missing', 'og:title وog:description وog:image مفقودة'),
      bi('Add Open Graph and Twitter card tags.', 'أضف وسوم Open Graph وبطاقة تويتر.'), { snippet: ogSnippet }));
  } else {
    out.push(make(D.social, 'warn', bi(`Missing: ${ogMissing.map((k) => `og:${k}`).join(', ')}.`, `مفقود: ${ogMissing.map((k) => `og:${k}`).join('، ')}.`), undefined,
      bi('Complete the Open Graph set so previews show a title, summary and image.', 'أكمل وسوم Open Graph لتظهر المعاينة بعنوان وملخص وصورة.'), { snippet: ogSnippet, severity: ogMissing.includes('image') ? 'medium' : 'low' }));
  }

  // hreflang
  if (page.hreflang.length === 0) {
    out.push(make(D.hreflang, 'info', bi('No hreflang tags (fine for single-language sites).', 'لا توجد وسوم hreflang (طبيعي للمواقع أحادية اللغة).')));
  } else {
    const invalid = page.hreflang.filter((h) => !/^(x-default|[a-z]{2,3}(-[a-z0-9]{2,4})?)$/i.test(h.lang));
    const selfRef = page.hreflang.some((h) => {
      try {
        return sameUrl(new URL(h.href, url).href, url);
      } catch {
        return false;
      }
    });
    const list = page.hreflang.slice(0, 6).map((h) => `${h.lang} → ${h.href}`).join('\n');
    if (invalid.length > 0) {
      out.push(make(D.hreflang, 'fail', bi(`${invalid.length} invalid hreflang code(s).`, `${invalid.length} كود hreflang غير صالح.`), bi(list, list),
        bi('Use ISO 639-1 language codes with optional ISO 3166-1 region (e.g. en, ar-EG, x-default).', 'استخدم أكواد ISO 639-1 للغة مع منطقة اختيارية (مثل en وar-EG وx-default).')));
    } else if (!selfRef) {
      out.push(make(D.hreflang, 'warn', bi('hreflang set does not include this page itself.', 'مجموعة hreflang لا تتضمن الصفحة نفسها.'), bi(list, list),
        bi('Each language version must list itself and all alternates (return links).', 'كل نسخة لغوية يجب أن تذكر نفسها وكل البدائل (روابط متبادلة).')));
    } else {
      out.push(make(D.hreflang, 'pass', bi(`${page.hreflang.length} valid hreflang alternates including self-reference.`, `${page.hreflang.length} بدائل hreflang صالحة تتضمن الصفحة نفسها.`), bi(list, list)));
    }
  }

  // Images alt
  if (page.images.total === 0) {
    out.push(make(D.images, 'info', bi('No <img> elements in the HTML.', 'لا توجد عناصر <img> في HTML.')));
  } else {
    const ratio = page.images.missingAlt / page.images.total;
    const ev = bi(
      `${page.images.missingAlt} of ${page.images.total} images have no alt attribute${page.images.samplesMissingAlt.length ? `\n${page.images.samplesMissingAlt.join('\n')}` : ''}`,
      `${page.images.missingAlt} من ${page.images.total} صورة بدون alt${page.images.samplesMissingAlt.length ? `\n${page.images.samplesMissingAlt.join('\n')}` : ''}`,
    );
    const altSnippet = page.images.samplesMissingAlt[0]
      ? snippetHead(`<img src="${esc(page.images.samplesMissingAlt[0])}" alt="Describe what the image shows" />\n<!-- Decorative images: alt="" -->`, 'Pattern', 'النمط')
      : undefined;
    if (page.images.missingAlt === 0) {
      out.push(make(D.images, 'pass', bi(`All ${page.images.total} images have an alt attribute.`, `كل الصور (${page.images.total}) لها خاصية alt.`)));
    } else if (ratio <= 0.2) {
      out.push(make(D.images, 'warn', bi(`${page.images.missingAlt} image(s) missing alt.`, `${page.images.missingAlt} صورة بدون alt.`), ev,
        bi('Add descriptive alt text to content images and alt="" to decorative ones.', 'أضف نصاً بديلاً وصفياً لصور المحتوى وalt="" للصور الزخرفية.'), { severity: 'low', snippet: altSnippet }));
    } else {
      out.push(make(D.images, ratio > 0.5 ? 'fail' : 'warn', bi(`${Math.round(ratio * 100)}% of images are missing alt text.`, `${Math.round(ratio * 100)}٪ من الصور بدون نص بديل.`), ev,
        bi('Add descriptive alt text to content images and alt="" to decorative ones.', 'أضف نصاً بديلاً وصفياً لصور المحتوى وalt="" للصور الزخرفية.'), { snippet: altSnippet }));
    }
  }

  // Mixed content
  if (url.startsWith('https://')) {
    if (page.mixedContent.length === 0) {
      out.push(make(D.mixed, 'pass', bi('No HTTP resources referenced on this HTTPS page.', 'لا توجد موارد HTTP داخل صفحة HTTPS.')));
    } else {
      out.push(make(D.mixed, 'fail', bi(`${page.mixedContent.length}+ resource(s) loaded over HTTP.`, `${page.mixedContent.length}+ مورد يُحمّل عبر HTTP.`), bi(page.mixedContent.join('\n'), page.mixedContent.join('\n')),
        bi('Change these URLs to https:// (or protocol-relative from the same host).', 'غيّر هذه الروابط إلى https://.')));
    }
  }

  // Meta refresh
  if (page.metaRefresh && /url=/i.test(page.metaRefresh)) {
    out.push(make(D.refresh, 'warn', bi('Page redirects with <meta http-equiv="refresh">.', 'الصفحة تتحول عبر <meta http-equiv="refresh">.'), bi(`content="${page.metaRefresh}"`, `content="${page.metaRefresh}"`),
      bi('Replace it with a server-side 301 redirect.', 'استبدله بتحويل 301 من السيرفر.')));
  }

  // Soft 404
  const nf = payload.probes?.notFound;
  if (!payload.probes || !nf) {
    out.push(notAssessed(D.soft404, bi('404 probe not available for this audit.', 'اختبار 404 غير متاح لهذا الفحص.')));
  } else if (nf.error) {
    out.push(notAssessed(D.soft404, bi(`404 probe failed (${nf.error}).`, `فشل اختبار 404 (${nf.error}).`)));
  } else if (nf.status === 404 || nf.status === 410) {
    out.push(make(D.soft404, 'pass', bi(`Unknown URLs return ${nf.status}.`, `الروابط غير الموجودة ترجع ${nf.status}.`), bi(`${nf.url} → ${nf.redirectedFrom ? `${nf.redirectedFrom} → ` : ''}${nf.status}`, `${nf.url} ← ${nf.redirectedFrom ? `${nf.redirectedFrom} ← ` : ''}${nf.status}`)));
  } else if (nf.status === 200) {
    out.push(make(D.soft404, 'fail', bi(`A made-up URL returns 200 OK${nf.redirectedFrom ? ' after a redirect' : ''} (soft 404).`, `رابط وهمي يرجع 200 OK${nf.redirectedFrom ? ' بعد تحويل' : ''} (soft 404).`),
      bi(`${nf.url} → ${nf.redirectedFrom ? `${nf.redirectedFrom} → ` : ''}200${nf.title ? `\n<title>${nf.title}</title>` : ''}`, `${nf.url} ← ${nf.redirectedFrom ? `${nf.redirectedFrom} ← ` : ''}200${nf.title ? `\n<title>${nf.title}</title>` : ''}`),
      bi('Return a real 404 status for URLs that do not exist (in SPAs, render a not-found route that sets the status server-side).', 'أرجع حالة 404 حقيقية للروابط غير الموجودة (في تطبيقات SPA اعرض صفحة "غير موجود" بحالة 404 من السيرفر).'),
      { snippet: { language: 'apache', label: '.htaccess (static hosting)', labelAr: 'ملف .htaccess (استضافة ستاتيك)', code: 'ErrorDocument 404 /404.html' } }));
  } else {
    out.push(make(D.soft404, 'warn', bi(`A made-up URL returns ${nf.status} instead of 404.`, `رابط وهمي يرجع ${nf.status} بدل 404.`), bi(`${nf.url} → ${nf.status}${nf.location ? ` → ${nf.location}` : ''}`, `${nf.url} ← ${nf.status}${nf.location ? ` ← ${nf.location}` : ''}`),
      bi('Serve 404 (or 410) for missing pages instead of redirecting everything to the homepage.', 'أرجع 404 (أو 410) للصفحات غير الموجودة بدل تحويل كل شيء للرئيسية.'), { severity: 'low' }));
  }

  // Favicon
  out.push(page.hasFavicon
    ? make(D.favicon, 'pass', bi('Favicon declared.', 'أيقونة الموقع معلنة.'))
    : make(D.favicon, 'warn', bi('No <link rel="icon"> declared.', 'لا يوجد <link rel="icon">.'), undefined,
      bi('Add a square favicon (at least 48×48) and reference it in <head>.', 'أضف أيقونة مربعة (48×48 على الأقل) واربطها في <head>.'),
      { snippet: snippetHead('<link rel="icon" href="/favicon.ico" sizes="any" />\n<link rel="icon" href="/icon.svg" type="image/svg+xml" />\n<link rel="apple-touch-icon" href="/apple-touch-icon.png" />', 'Add inside <head>', 'أضفه داخل <head>') }));

  // Security headers
  if (url.startsWith('https://')) {
    const hsts = !!headers['strict-transport-security'];
    const nosniff = /nosniff/i.test(headers['x-content-type-options'] || '');
    const present = [hsts && 'Strict-Transport-Security', nosniff && 'X-Content-Type-Options', headers['content-security-policy'] && 'Content-Security-Policy', headers['referrer-policy'] && 'Referrer-Policy'].filter(Boolean) as string[];
    const snippet: FixSnippet = {
      language: 'apache',
      label: '.htaccess (Apache / Hostinger / cPanel)',
      labelAr: 'ملف .htaccess (Apache / Hostinger / cPanel)',
      code: '<IfModule mod_headers.c>\n  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"\n  Header always set X-Content-Type-Options "nosniff"\n  Header always set Referrer-Policy "strict-origin-when-cross-origin"\n</IfModule>',
    };
    if (hsts && nosniff) {
      out.push(make(D.security, 'pass', bi(`Present: ${present.join(', ')}.`, `موجود: ${present.join('، ')}.`)));
    } else {
      const missing = [!hsts && 'Strict-Transport-Security', !nosniff && 'X-Content-Type-Options'].filter(Boolean).join(', ');
      out.push(make(D.security, 'warn', bi(`Missing: ${missing}.`, `مفقود: ${missing}.`), bi(present.length ? `Present: ${present.join(', ')}` : 'No security headers found', present.length ? `موجود: ${present.join('، ')}` : 'لا توجد هيدرات أمان'),
        bi('Send HSTS and nosniff headers from the server or CDN.', 'أرسل هيدرات HSTS وnosniff من السيرفر أو الـ CDN.'), { snippet }));
    }
  }

  // Certificate
  const expiry = payload.fetch?.certExpiry;
  if (url.startsWith('https://')) {
    if (!expiry) {
      out.push(notAssessed(D.cert, bi('Certificate details were not returned.', 'لم تُرجع تفاصيل الشهادة.')));
    } else {
      const days = Math.floor((new Date(expiry).getTime() - Date.now()) / 86400000);
      const date = expiry.slice(0, 10);
      if (days < 0) out.push(make(D.cert, 'fail', bi(`Certificate expired on ${date}.`, `الشهادة انتهت في ${date}.`), undefined, bi('Renew the certificate now.', 'جدّد الشهادة فوراً.'), { severity: 'critical' }));
      else if (days < 14) out.push(make(D.cert, 'fail', bi(`Certificate expires in ${days} days (${date}).`, `الشهادة تنتهي خلال ${days} يوم (${date}).`), undefined, bi('Renew now and enable auto-renewal.', 'جدّدها الآن وفعّل التجديد التلقائي.')));
      else if (days < 30) out.push(make(D.cert, 'warn', bi(`Certificate expires in ${days} days (${date}).`, `الشهادة تنتهي خلال ${days} يوم (${date}).`), undefined, bi('Confirm auto-renewal is enabled.', 'تأكد من تفعيل التجديد التلقائي.'), { severity: 'medium' }));
      else out.push(make(D.cert, 'pass', bi(`Valid for ${days} more days (until ${date}).`, `صالحة ${days} يوماً أخرى (حتى ${date}).`)));
    }
  }

  return out;
}

// ---------------------------------------------------------------------------
// Crawlability & performance
// ---------------------------------------------------------------------------

const C = {
  robotsFile: {
    id: 'robots-txt', category: 'crawlability', severity: 'high', fixCategory: 'robots',
    title: bi('robots.txt availability', 'توفر ملف robots.txt'),
    why: bi('Crawlers read robots.txt first. Google treats a 5xx/unreachable robots.txt as "disallow everything" until it recovers.', 'الزواحف تقرأ robots.txt أولاً. جوجل يعتبر ملف robots.txt المعطّل (5xx) كأنه "امنع كل شيء" حتى يعود.'),
    source: 'https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt',
  },
  robotsSyntax: {
    id: 'robots-syntax', category: 'crawlability', severity: 'low', fixCategory: 'robots',
    title: bi('robots.txt syntax', 'صياغة robots.txt'),
    why: bi('Lines crawlers cannot parse are silently ignored, so intended rules may not apply. Google reads only the first 500 KiB.', 'الأسطر غير المفهومة تُتجاهل بصمت فقد لا تُطبق القواعد المقصودة. جوجل يقرأ أول 500 كيلوبايت فقط.'),
  },
  googlebot: {
    id: 'robots-googlebot', category: 'crawlability', severity: 'critical', fixCategory: 'robots',
    title: bi('Googlebot access to this URL', 'سماح Googlebot بهذا الرابط'),
    why: bi('If robots.txt disallows this path for Googlebot, Google cannot crawl the page (and Gemini/AI Overviews cannot ground on it).', 'لو robots.txt يمنع هذا المسار عن Googlebot لن يزحف جوجل للصفحة (ولن تعتمد عليها AI Overviews).'),
  },
  bingbot: {
    id: 'robots-bingbot', category: 'crawlability', severity: 'high', fixCategory: 'robots',
    title: bi('Bingbot access to this URL', 'سماح Bingbot بهذا الرابط'),
    why: bi('Bing\'s index powers Bing, Copilot, DuckDuckGo and other engines that ground AI answers on web results.', 'فهرس Bing يغذي Bing وCopilot وDuckDuckGo ومحركات أخرى تبني إجاباتها على نتائج الويب.'),
  },
  sitemap: {
    id: 'xml-sitemap', category: 'crawlability', severity: 'medium', fixCategory: 'sitemap',
    title: bi('XML sitemap', 'خريطة الموقع XML'),
    why: bi('A sitemap declared in robots.txt helps every crawler discover new and deep URLs quickly.', 'خريطة الموقع المعلنة في robots.txt تساعد كل الزواحف على اكتشاف الروابط الجديدة والعميقة بسرعة.'),
    source: 'https://www.sitemaps.org/protocol.html',
  },
  ttfb: {
    id: 'ttfb', category: 'crawlability', severity: 'medium', fixCategory: 'headers',
    title: bi('Server response time (TTFB)', 'زمن استجابة السيرفر (TTFB)'),
    why: bi('Slow first bytes delay every render and reduce how many pages crawlers fetch per visit. web.dev rates ≤ 0.8 s as good.', 'بطء أول بايت يؤخر كل عرض ويقلل عدد الصفحات التي تزحف لها البوتات. web.dev يعتبر ≤ 0.8 ثانية جيداً.'),
    source: 'https://web.dev/articles/ttfb',
  },
  compression: {
    id: 'compression', category: 'crawlability', severity: 'medium', fixCategory: 'headers',
    title: bi('Text compression', 'ضغط النصوص'),
    why: bi('gzip/Brotli typically shrinks HTML by 70–90%, cutting transfer time for users and crawlers.', 'ضغط gzip/Brotli يقلل حجم HTML بنسبة 70–90٪ تقريباً فيسرّع النقل للزوار والزواحف.'),
  },
  weight: {
    id: 'html-weight', category: 'crawlability', severity: 'low', fixCategory: 'content',
    title: bi('HTML document size', 'حجم مستند HTML'),
    why: bi('Very large HTML slows parsing; some AI crawlers truncate long documents, so key content near the end can be missed.', 'HTML الضخم يبطئ التحليل؛ بعض زواحف الذكاء الاصطناعي تقتطع المستندات الطويلة فيضيع المحتوى المتأخر.'),
  },
  internalLinks: {
    id: 'internal-links', category: 'crawlability', severity: 'high', fixCategory: 'content',
    title: bi('Crawlable internal links', 'روابط داخلية قابلة للزحف'),
    why: bi('Crawlers discover pages through <a href> links in HTML. Click handlers and JS-only menus are invisible to most bots.', 'الزواحف تكتشف الصفحات عبر روابط <a href> في HTML. القوائم المعتمدة على الجافاسكربت فقط غير مرئية لمعظم البوتات.'),
    source: 'https://developers.google.com/search/docs/crawling-indexing/links-crawlable',
  },
} satisfies Record<string, Def>;

function robotsVerdictCheck(def: Def, ctx: CheckContext, token: string, label: string): AuditCheck {
  if (ctx.robotsState === 'missing') {
    return make(def, 'pass', bi(`No robots.txt (404) — ${label} may crawl everything.`, `لا يوجد robots.txt (404) — ${label} مسموح له بكل شيء.`));
  }
  if (ctx.robotsState !== 'ok' || !ctx.robots) {
    return notAssessed(def, bi('robots.txt could not be read reliably.', 'تعذر قراءة robots.txt بشكل موثوق.'));
  }
  const verdict = evaluateRobots(ctx.robots, token, ctx.path);
  const via = verdict.matchedBy === 'token' ? `User-agent: ${token}` : verdict.matchedBy === '*' ? 'User-agent: *' : 'no matching group';
  const ev = bi(`${via} → ${describeRule(verdict.rule)} → path ${ctx.path}`, `${via} ← ${describeRule(verdict.rule)} ← المسار ${ctx.path}`);
  if (verdict.allowed) return make(def, 'pass', bi(`${label} is allowed to crawl this URL.`, `${label} مسموح له بالزحف لهذا الرابط.`), ev);
  return make(def, 'fail', bi(`robots.txt blocks ${label} from this URL.`, `robots.txt يمنع ${label} من هذا الرابط.`), ev,
    bi(`Remove or narrow the Disallow rule that matches ${ctx.path} for ${token}.`, `احذف أو ضيّق قاعدة Disallow التي تطابق ${ctx.path} لـ ${token}.`),
    { snippet: { language: 'text', label: 'robots.txt — add an explicit group', labelAr: 'robots.txt — أضف مجموعة صريحة', code: `User-agent: ${token}\nAllow: /` } });
}

function crawlChecks(ctx: CheckContext): AuditCheck[] {
  const out: AuditCheck[] = [];
  const { payload, headers, page } = ctx;
  const status = payload.robotsStatus;

  if (ctx.robotsState === 'ok') {
    out.push(make(C.robotsFile, 'pass', bi('robots.txt returned 200 and was parsed.', 'ملف robots.txt رجع 200 وتم تحليله.'), bi(`${ctx.origin}/robots.txt → 200 (${ctx.robots?.groups.length || 0} groups, ${ctx.robots?.sitemaps.length || 0} sitemap lines)`, `${ctx.origin}/robots.txt ← 200 (${ctx.robots?.groups.length || 0} مجموعة، ${ctx.robots?.sitemaps.length || 0} سطر sitemap)`)));
  } else if (ctx.robotsState === 'missing') {
    out.push(make(C.robotsFile, 'warn', bi(`robots.txt returns ${status} — crawlers assume no restrictions.`, `robots.txt يرجع ${status} — الزواحف تفترض عدم وجود قيود.`), bi(`${ctx.origin}/robots.txt → ${status}`, `${ctx.origin}/robots.txt ← ${status}`),
      bi('Publish a robots.txt that allows search/AI crawlers and declares your sitemap.', 'انشر ملف robots.txt يسمح لزواحف البحث والذكاء الاصطناعي ويعلن خريطة الموقع.'),
      { severity: 'low', snippet: { language: 'text', label: 'Minimal robots.txt', labelAr: 'ملف robots.txt أساسي', code: `User-agent: *\nAllow: /\n\nSitemap: ${ctx.origin}/sitemap.xml` } }));
  } else if (ctx.robotsState === 'server_error') {
    out.push(make(C.robotsFile, 'fail', bi(`robots.txt returns ${status} — Google pauses crawling while it cannot read the file.`, `robots.txt يرجع ${status} — جوجل يوقف الزحف طالما لا يستطيع قراءته.`), bi(`${ctx.origin}/robots.txt → ${status}`, `${ctx.origin}/robots.txt ← ${status}`),
      bi('Make /robots.txt return 200 (or a clean 404). Check firewall rules that block it.', 'اجعل /robots.txt يرجع 200 (أو 404 صريح). راجع قواعد الجدار الناري التي تحجبه.')));
  } else {
    out.push(notAssessed(C.robotsFile, bi(`robots.txt request failed (${payload.robotsError || 'no response'}).`, `فشل طلب robots.txt (${payload.robotsError || 'لا استجابة'}).`)));
  }

  if (ctx.robotsState === 'ok' && ctx.robots) {
    const big = ctx.robots.byteLength > 512000;
    const invalid = ctx.robots.invalidLines;
    if (invalid.length === 0 && !big) {
      out.push(make(C.robotsSyntax, 'pass', bi('Every line is a recognised directive.', 'كل الأسطر تعليمات معروفة.')));
    } else {
      const ev = invalid.slice(0, 5).map((l) => `line ${l.line}: ${l.text}`).join('\n');
      out.push(make(C.robotsSyntax, 'warn', bi(big ? `robots.txt is ${Math.round(ctx.robots.byteLength / 1024)} KiB — Google ignores content past 500 KiB.` : `${invalid.length} unrecognised line(s).`, big ? `حجم robots.txt ${Math.round(ctx.robots.byteLength / 1024)} كيلوبايت — جوجل يتجاهل ما بعد 500 كيلوبايت.` : `${invalid.length} سطر غير معروف.`),
        bi(ev || 'File too large', ev || 'الملف كبير جداً'), bi('Fix or remove lines that are not User-agent / Allow / Disallow / Sitemap.', 'صحّح أو احذف الأسطر التي ليست User-agent / Allow / Disallow / Sitemap.'), { severity: big ? 'medium' : 'low' }));
    }
  }

  out.push(robotsVerdictCheck(C.googlebot, ctx, 'Googlebot', 'Googlebot'));
  out.push(robotsVerdictCheck(C.bingbot, ctx, 'Bingbot', 'Bingbot'));

  // Sitemap
  const sitemapXml = payload.sitemapXml || '';
  const declared = (ctx.robots?.sitemaps.length || 0) > 0;
  const isUrlset = /<urlset[\s>]/i.test(sitemapXml);
  const isIndex = /<sitemapindex[\s>]/i.test(sitemapXml);
  const locCount = (sitemapXml.match(/<loc>/gi) || []).length;
  const sitemapRef = payload.sitemapUrl || `${ctx.origin}/sitemap.xml`;
  if (isUrlset || isIndex) {
    const listed = isUrlset && !payload.sitemapTruncated
      ? (sitemapXml.match(/<loc>\s*([^<]+?)\s*<\/loc>/gi) || []).some((m) => sameUrl(m.replace(/<\/?loc>/gi, '').trim(), ctx.url))
      : null;
    const kind = isIndex ? `sitemap index with ${locCount} child sitemaps` : `${locCount} URLs${payload.sitemapTruncated ? '+' : ''}`;
    const kindAr = isIndex ? `فهرس خرائط يضم ${locCount} خريطة فرعية` : `${locCount}${payload.sitemapTruncated ? '+' : ''} رابط`;
    if (!declared) {
      out.push(make(C.sitemap, 'warn', bi(`Sitemap found at the default path (${kind}) but not declared in robots.txt.`, `خريطة الموقع موجودة في المسار الافتراضي (${kindAr}) لكنها غير معلنة في robots.txt.`), bi(sitemapRef, sitemapRef),
        bi('Add a Sitemap: line to robots.txt so every crawler finds it without Search Console.', 'أضف سطر Sitemap: في robots.txt لتجده كل الزواحف دون Search Console.'),
        { severity: 'low', snippet: { language: 'text', label: 'Append to robots.txt', labelAr: 'أضفه لنهاية robots.txt', code: `Sitemap: ${sitemapRef}` } }));
    } else if (listed === false && ctx.path !== '/') {
      out.push(make(C.sitemap, 'warn', bi(`Sitemap OK (${kind}) but this URL is not listed in it.`, `خريطة الموقع سليمة (${kindAr}) لكن هذا الرابط غير مدرج فيها.`), bi(sitemapRef, sitemapRef),
        bi('Include every canonical, indexable URL in the sitemap.', 'أدرج كل رابط أساسي قابل للفهرسة في خريطة الموقع.'), { severity: 'low' }));
    } else {
      out.push(make(C.sitemap, 'pass', bi(`Declared in robots.txt and valid (${kind}).`, `معلنة في robots.txt وصالحة (${kindAr}).`), bi(sitemapRef, sitemapRef)));
    }
  } else if (payload.sitemapStatus === 200) {
    out.push(make(C.sitemap, 'fail', bi('Sitemap URL returns 200 but is not valid sitemap XML.', 'رابط خريطة الموقع يرجع 200 لكنه ليس XML صالحاً.'), bi(sitemapRef, sitemapRef),
      bi('Serve a <urlset> or <sitemapindex> document per sitemaps.org.', 'قدّم مستند <urlset> أو <sitemapindex> حسب sitemaps.org.')));
  } else if (payload.sitemapStatus === null || payload.sitemapStatus === undefined) {
    out.push(notAssessed(C.sitemap, bi('Sitemap request did not complete.', 'طلب خريطة الموقع لم يكتمل.')));
  } else {
    out.push(make(C.sitemap, 'fail', bi(declared ? `Sitemap declared in robots.txt returns ${payload.sitemapStatus}.` : `No sitemap declared and /sitemap.xml returns ${payload.sitemapStatus}.`, declared ? `خريطة الموقع المعلنة ترجع ${payload.sitemapStatus}.` : `لا توجد خريطة معلنة و/sitemap.xml يرجع ${payload.sitemapStatus}.`),
      bi(sitemapRef, sitemapRef), bi('Generate an XML sitemap of canonical URLs and reference it in robots.txt.', 'أنشئ خريطة XML للروابط الأساسية وأعلنها في robots.txt.'),
      { snippet: { language: 'text', label: 'robots.txt line', labelAr: 'سطر في robots.txt', code: `Sitemap: ${ctx.origin}/sitemap.xml` } }));
  }

  // TTFB
  const ttfb = payload.fetch?.ttfbMs;
  if (typeof ttfb !== 'number' || ttfb <= 0) {
    out.push(notAssessed(C.ttfb, bi('Timing not available.', 'التوقيت غير متاح.')));
  } else {
    const ev = bi(`TTFB ${ttfb} ms (measured from SchemaCraft servers in Europe; connect ${payload.fetch?.connectMs ?? '—'} ms, TLS ${payload.fetch?.tlsMs ?? '—'} ms)`, `TTFB ${ttfb} مللي ثانية (مقاس من سيرفرات SchemaCraft في أوروبا؛ اتصال ${payload.fetch?.connectMs ?? '—'} مللي، TLS ${payload.fetch?.tlsMs ?? '—'} مللي)`);
    if (ttfb <= 800) out.push(make(C.ttfb, 'pass', bi(`${ttfb} ms — good.`, `${ttfb} مللي ثانية — جيد.`), ev));
    else if (ttfb <= 1800) out.push(make(C.ttfb, 'warn', bi(`${ttfb} ms — needs improvement.`, `${ttfb} مللي ثانية — يحتاج تحسين.`), ev, bi('Enable full-page caching or a CDN, and reduce server-side work per request.', 'فعّل التخزين المؤقت للصفحات أو CDN وقلل المعالجة على السيرفر لكل طلب.')));
    else out.push(make(C.ttfb, 'fail', bi(`${ttfb} ms — slow.`, `${ttfb} مللي ثانية — بطيء.`), ev, bi('Add page caching/CDN, upgrade hosting, and profile slow database queries or plugins.', 'أضف تخزيناً مؤقتاً/CDN وطوّر الاستضافة وافحص الاستعلامات أو الإضافات البطيئة.')));
  }

  // Compression
  const encoding = (headers['content-encoding'] || '').toLowerCase();
  const bytes = payload.htmlBytes || (payload.html || '').length;
  if (/br|gzip|zstd|deflate/.test(encoding)) {
    out.push(make(C.compression, 'pass', bi(`HTML served with ${encoding} compression.`, `HTML يُرسل مضغوطاً بـ ${encoding}.`), bi(`Content-Encoding: ${encoding}`, `Content-Encoding: ${encoding}`)));
  } else if (bytes < 10000) {
    out.push(make(C.compression, 'info', bi('No compression header, but the document is tiny.', 'لا يوجد ضغط لكن المستند صغير جداً.')));
  } else {
    out.push(make(C.compression, 'fail', bi(`${Math.round(bytes / 1024)} KB of HTML sent uncompressed.`, `${Math.round(bytes / 1024)} كيلوبايت HTML تُرسل بدون ضغط.`), bi('No Content-Encoding header on the HTML response', 'لا يوجد هيدر Content-Encoding في استجابة HTML'),
      bi('Enable gzip or Brotli on the server/CDN.', 'فعّل gzip أو Brotli على السيرفر أو الـ CDN.'),
      { snippet: { language: 'apache', label: '.htaccess (Apache)', labelAr: 'ملف .htaccess (Apache)', code: '<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/plain text/css text/xml application/javascript application/json application/xml image/svg+xml\n</IfModule>' } }));
  }

  // HTML weight
  const kb = Math.round(bytes / 1024);
  if (payload.htmlTruncated) {
    out.push(make(C.weight, 'fail', bi('HTML is larger than 2 MB; we analysed only the first 2 MB.', 'حجم HTML أكبر من 2 ميجابايت؛ حللنا أول 2 ميجابايت فقط.'), bi(`> 2048 KB`, `> 2048 كيلوبايت`),
      bi('Move inline data, SVG sprites and serialized state out of the HTML.', 'انقل البيانات المضمنة وأيقونات SVG والحالة المسلسلة خارج HTML.'), { severity: 'medium' }));
  } else if (kb > 1024) {
    out.push(make(C.weight, 'warn', bi(`HTML is ${kb} KB.`, `حجم HTML ${kb} كيلوبايت.`), bi(`${kb} KB (inline scripts ≈ ${Math.round(page.scripts.inlineBytes / 1024)} KB)`, `${kb} كيلوبايت (السكربتات المضمنة ≈ ${Math.round(page.scripts.inlineBytes / 1024)} كيلوبايت)`),
      bi('Trim inline JSON/state and repeated markup; keep the main content early in the document.', 'قلّل البيانات المضمنة والتكرار وضع المحتوى الأساسي في بداية المستند.')));
  } else {
    out.push(make(C.weight, 'pass', bi(`HTML is ${kb} KB.`, `حجم HTML ${kb} كيلوبايت.`)));
  }

  // Internal links
  const il = page.links.internal;
  if (il === 0) {
    out.push(make(C.internalLinks, 'fail', bi(`No crawlable internal <a href> links in the HTML${page.links.jsOnly ? ` (${page.links.jsOnly} JavaScript-only links)` : ''}.`, `لا توجد روابط داخلية <a href> قابلة للزحف${page.links.jsOnly ? ` (${page.links.jsOnly} رابط يعمل بالجافاسكربت فقط)` : ''}.`), undefined,
      bi('Render navigation as real <a href="/path"> links in the server HTML.', 'اعرض القوائم كروابط حقيقية <a href="/path"> في HTML السيرفر.')));
  } else if (il < 5) {
    out.push(make(C.internalLinks, 'warn', bi(`Only ${il} internal link(s) in the HTML.`, `${il} رابط داخلي فقط في HTML.`), undefined,
      bi('Link to your key pages (products, services, guides, about, contact) from this page.', 'اربط بصفحاتك الأساسية (المنتجات، الخدمات، الأدلة، من نحن، التواصل) من هذه الصفحة.'), { severity: 'medium' }));
  } else {
    out.push(make(C.internalLinks, 'pass', bi(`${il} internal and ${page.links.external} external links in the HTML.`, `${il} رابط داخلي و${page.links.external} رابط خارجي في HTML.`)));
  }

  return out;
}

// ---------------------------------------------------------------------------
// Content & answerability
// ---------------------------------------------------------------------------

const K = {
  depth: {
    id: 'content-depth', category: 'content', severity: 'high', fixCategory: 'content',
    title: bi('Indexable text content', 'المحتوى النصي القابل للفهرسة'),
    why: bi('Engines can only rank and quote text that is in the HTML. Thin pages rarely earn rankings or citations.', 'المحركات لا ترتّب ولا تقتبس إلا النص الموجود في HTML. الصفحات الضعيفة نادراً ما تحصل على ترتيب أو اقتباس.'),
  },
  bluf: {
    id: 'answer-first', category: 'content', severity: 'medium', fixCategory: 'content',
    title: bi('Answer-first summary (BLUF)', 'ملخص يجيب مباشرة (BLUF)'),
    why: bi('Answer engines lift self-contained 40–80-word passages that define the topic. A clear opening paragraph is the easiest passage to quote.', 'محركات الإجابة تقتبس فقرات مستقلة من 40–80 كلمة تعرّف الموضوع. الفقرة الافتتاحية الواضحة هي الأسهل في الاقتباس.'),
  },
  questions: {
    id: 'question-headings', category: 'content', severity: 'low', fixCategory: 'content',
    title: bi('Question-style headings', 'عناوين بصيغة أسئلة'),
    why: bi('Headings phrased like real queries map directly to the questions people ask search and AI assistants.', 'العناوين المصاغة كأسئلة حقيقية تطابق مباشرة ما يسأله الناس لمحركات البحث والمساعدات الذكية.'),
  },
  structure: {
    id: 'extractable-structure', category: 'content', severity: 'low', fixCategory: 'content',
    title: bi('Lists and tables', 'قوائم وجداول'),
    why: bi('Lists, steps and comparison tables are the formats answer engines extract most reliably.', 'القوائم والخطوات وجداول المقارنة هي أكثر الصيغ التي تستخرجها محركات الإجابة بدقة.'),
  },
  freshness: {
    id: 'freshness', category: 'content', severity: 'low', fixCategory: 'schema',
    title: bi('Published / updated dates', 'تواريخ النشر والتحديث'),
    why: bi('Visible and machine-readable dates let engines judge freshness — important for news, guides, pricing and comparisons.', 'التواريخ الظاهرة والمقروءة آلياً تسمح للمحركات بتقييم حداثة المحتوى، وهو مهم للأخبار والأدلة والأسعار والمقارنات.'),
  },
  author: {
    id: 'author-byline', category: 'content', severity: 'medium', fixCategory: 'schema',
    title: bi('Author / byline (E-E-A-T)', 'الكاتب والمصداقية (E-E-A-T)'),
    why: bi('Named, linkable authors are part of Google\'s guidance on helpful content and help AI engines judge expertise.', 'ذكر كاتب معروف وقابل للتحقق جزء من إرشادات جوجل للمحتوى المفيد ويساعد محركات الذكاء الاصطناعي على تقييم الخبرة.'),
    source: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
  },
  sections: {
    id: 'section-structure', category: 'content', severity: 'low', fixCategory: 'content',
    title: bi('Section structure', 'تقسيم المحتوى لأقسام'),
    why: bi('Long text without H2 sections is hard to scan and hard for engines to split into answerable passages.', 'النص الطويل بدون أقسام H2 صعب التصفح وصعب على المحركات تقسيمه لفقرات قابلة للاقتباس.'),
  },
} satisfies Record<string, Def>;

function contentChecks(ctx: CheckContext): AuditCheck[] {
  const out: AuditCheck[] = [];
  const { page } = ctx;
  const js = ctx.jsDependent === 'yes';

  if (js) {
    out.push(make(K.depth, 'info', bi(`Only ${page.wordCount} words in the server HTML — scored under "JavaScript-dependent content".`, `${page.wordCount} كلمة فقط في HTML السيرفر — محسوبة ضمن "محتوى يعتمد على الجافاسكربت".`)));
  } else if (page.wordCount < 80) {
    out.push(make(K.depth, 'fail', bi(`Only ${page.wordCount} words of visible text.`, `${page.wordCount} كلمة فقط من النص الظاهر.`), undefined,
      bi('Add substantive copy that explains what the page offers, for whom, and why.', 'أضف نصاً حقيقياً يشرح ما تقدمه الصفحة ولمن ولماذا.')));
  } else if (page.wordCount < 250) {
    out.push(make(K.depth, 'warn', bi(`${page.wordCount} words — thin for most queries.`, `${page.wordCount} كلمة — قليل لمعظم عمليات البحث.`), undefined,
      bi('Expand with specifics: features, pricing, process, FAQs, proof (data, examples, reviews).', 'وسّع المحتوى بتفاصيل: المزايا، الأسعار، طريقة العمل، الأسئلة الشائعة، الأدلة (أرقام، أمثلة، تقييمات).'), { severity: 'medium' }));
  } else {
    out.push(make(K.depth, 'pass', bi(`${page.wordCount} words of crawlable text.`, `${page.wordCount} كلمة نصية قابلة للزحف.`)));
  }

  const opening = page.openingParagraphs.length > 0 ? page.openingParagraphs : (page.leadParagraph ? [page.leadParagraph] : []);
  const lead = opening[0] ?? null;
  const leadWords = lead ? lead.split(/\s+/).length : 0;
  const defined = openingDefinition(opening);
  const blufTemplate: FixSnippet = {
    language: 'html',
    label: 'Pattern for the first paragraph under the H1',
    labelAr: 'نمط الفقرة الأولى تحت H1',
    code: `<p>${esc(ctx.siteName)} is a [category] that helps [audience] [achieve outcome] by [how it works]. [One concrete fact: price, location, number, or result].</p>`,
  };
  if (js) {
    out.push(make(K.bluf, 'info', bi('Not scored separately — the server HTML has almost no text.', 'غير محسوب منفصلاً — HTML السيرفر شبه خالٍ من النص.')));
  } else if (!lead) {
    out.push(make(K.bluf, 'fail', bi('No substantial opening paragraph found.', 'لا توجد فقرة افتتاحية واضحة.'), bi('No <p> with 60+ characters in the main content', 'لا توجد <p> بها 60 حرفاً أو أكثر في المحتوى الرئيسي'),
      bi('Open with a 40–80-word paragraph that states what this is, who it is for and the key fact.', 'ابدأ بفقرة من 40–80 كلمة تقول ما هذا ولمن وما الحقيقة الأساسية.'), { snippet: blufTemplate }));
  } else if (defined && defined.index === 0 && leadWords >= 20) {
    out.push(make(K.bluf, 'pass', bi(`Clear opening paragraph (${leadWords} words).`, `فقرة افتتاحية واضحة (${leadWords} كلمة).`), bi(`"${truncate(lead, 220)}"`, `"${truncate(lead, 220)}"`)));
  } else if (defined && defined.index > 0) {
    const n = defined.index + 1;
    out.push(make(K.bluf, 'warn', bi(`A definition exists, but it is paragraph ${n}, not the opening.`, `يوجد تعريف، لكنه في الفقرة ${n} وليس في الفقرة الافتتاحية.`),
      bi(`Opening:\n"${truncate(lead, 180)}"\n\nDefinition:\n"${truncate(defined.text, 220)}"`, `الافتتاح:\n"${truncate(lead, 180)}"\n\nالتعريف:\n"${truncate(defined.text, 220)}"`),
      bi('Move that definition into the first paragraph under the H1. Leave the product list after it.', 'انقل هذا التعريف إلى الفقرة الأولى تحت H1، واترك قائمة المنتجات بعدها.'),
      { severity: 'low', snippet: blufTemplate }));
  } else if (leadWords < 20) {
    out.push(make(K.bluf, 'warn', bi(`Opening paragraph is short (${leadWords} words).`, `الفقرة الافتتاحية قصيرة (${leadWords} كلمة).`),
      bi(`"${truncate(lead, 220)}"`, `"${truncate(lead, 220)}"`), bi('Rewrite it as a self-contained definition an assistant could quote verbatim.', 'أعد صياغتها كتعريف مستقل يمكن للمساعد الذكي اقتباسه كما هو.'), { snippet: blufTemplate }));
  } else {
    out.push(make(K.bluf, 'warn', bi('Opening paragraph does not define the topic directly.', 'الفقرة الافتتاحية لا تعرّف الموضوع مباشرة.'),
      bi(`"${truncate(lead, 220)}"`, `"${truncate(lead, 220)}"`), bi('Rewrite it as a self-contained definition an assistant could quote verbatim.', 'أعد صياغتها كتعريف مستقل يمكن للمساعد الذكي اقتباسه كما هو.'), { snippet: blufTemplate }));
  }

  const qh = page.questionHeadings.length;
  if (js) {
    out.push(make(K.questions, 'info', bi('Not scored separately — headings are not in the server HTML.', 'غير محسوب منفصلاً — العناوين ليست في HTML السيرفر.')));
  } else if (qh >= 2) {
    out.push(make(K.questions, 'pass', bi(`${qh} question-style headings.`, `${qh} عناوين بصيغة أسئلة.`), bi(page.questionHeadings.slice(0, 4).map((q) => `• ${q}`).join('\n'), page.questionHeadings.slice(0, 4).map((q) => `• ${q}`).join('\n'))));
  } else {
    out.push(make(K.questions, 'warn', bi(qh === 1 ? 'Only one question-style heading.' : 'No headings phrased as questions.', qh === 1 ? 'عنوان واحد فقط بصيغة سؤال.' : 'لا توجد عناوين بصيغة أسئلة.'),
      bi(page.headings.filter((h) => h.level === 2).slice(0, 4).map((h) => `H2: ${h.text}`).join('\n') || 'No H2 headings', page.headings.filter((h) => h.level === 2).slice(0, 4).map((h) => `H2: ${h.text}`).join('\n') || 'لا توجد عناوين H2'),
      bi('Turn 2–4 section headings into the real questions customers ask, answered in the first sentence below each.', 'حوّل 2–4 عناوين لأسئلة حقيقية يسألها العملاء، وأجب عليها في أول جملة تحت كل عنوان.')));
  }

  const structures = page.listCount + page.tableCount;
  if (js) {
    out.push(make(K.structure, 'info', bi('Not scored separately (JavaScript-rendered page).', 'غير محسوب منفصلاً (صفحة تُرسم بالجافاسكربت).')));
  } else if (structures > 0) {
    out.push(make(K.structure, 'pass', bi(`${page.listCount} list(s) and ${page.tableCount} table(s) in the content.`, `${page.listCount} قائمة و${page.tableCount} جدول في المحتوى.`)));
  } else if (page.wordCount >= 300) {
    out.push(make(K.structure, 'warn', bi('No lists or tables in the main content.', 'لا توجد قوائم أو جداول في المحتوى الرئيسي.'), undefined,
      bi('Present steps, features, specs or comparisons as <ol>/<ul> lists or a <table>.', 'اعرض الخطوات أو المزايا أو المواصفات أو المقارنات كقوائم <ol>/<ul> أو جدول <table>.')));
  } else {
    out.push(make(K.structure, 'info', bi('Short page — lists/tables not expected.', 'صفحة قصيرة — القوائم والجداول غير متوقعة.')));
  }

  const published = ctx.schema.dates.published || page.dates.published;
  const modified = ctx.schema.dates.modified || page.dates.modified;
  const dateExpected = ctx.pageType === 'article';
  if (js) {
    out.push(make(K.freshness, 'info', bi('Not scored separately — the page text is not in the server HTML.', 'غير محسوب منفصلاً — نص الصفحة ليس في HTML السيرفر.')));
  } else if (published || modified || page.dates.timeElements > 0) {
    out.push(make(K.freshness, 'pass', bi(`Dates found${modified ? ` (updated ${String(modified).slice(0, 10)})` : published ? ` (published ${String(published).slice(0, 10)})` : ''}.`, `تواريخ موجودة${modified ? ` (تحديث ${String(modified).slice(0, 10)})` : published ? ` (نشر ${String(published).slice(0, 10)})` : ''}.`)));
  } else if (dateExpected) {
    out.push(make(K.freshness, 'warn', bi('Article without machine-readable dates.', 'مقال بدون تواريخ مقروءة آلياً.'), undefined,
      bi('Add datePublished/dateModified in Article JSON-LD and show the date on the page.', 'أضف datePublished وdateModified في سكيما Article واعرض التاريخ في الصفحة.'), { severity: 'medium' }));
  } else {
    out.push(make(K.freshness, 'info', bi('No dates found (optional for this page type).', 'لا توجد تواريخ (اختياري لهذا النوع من الصفحات).')));
  }

  if (ctx.pageType === 'article') {
    const author = ctx.schema.author || page.author;
    out.push(author
      ? make(K.author, 'pass', bi(`Author: ${author}.`, `الكاتب: ${author}.`))
      : make(K.author, 'warn', bi('Article has no identifiable author.', 'المقال بدون كاتب واضح.'), undefined,
        bi('Show a byline linking to an author page and add author (Person with name + url) to the Article schema.', 'اعرض اسم الكاتب مع رابط لصفحته وأضف author (Person باسم ورابط) في سكيما Article.')));
  }

  if (!js && page.wordCount >= 600) {
    const h2 = page.headings.filter((h) => h.level === 2).length;
    out.push(h2 >= 2
      ? make(K.sections, 'pass', bi(`${h2} H2 sections.`, `${h2} قسم H2.`))
      : make(K.sections, 'warn', bi(`${page.wordCount} words but only ${h2} H2 section(s).`, `${page.wordCount} كلمة لكن ${h2} قسم H2 فقط.`), undefined,
        bi('Break the copy into H2 sections of roughly 150–300 words each.', 'قسّم النص إلى أقسام H2 بطول 150–300 كلمة تقريباً.')));
  }

  return out;
}

// ---------------------------------------------------------------------------
// Entity & structured data
// ---------------------------------------------------------------------------

const E = {
  present: {
    id: 'structured-data', category: 'entity', severity: 'high', fixCategory: 'schema',
    title: bi('Structured data (JSON-LD)', 'البيانات المنظمة (JSON-LD)'),
    why: bi('Schema.org JSON-LD states facts (who you are, what you sell, prices, ratings) in machine-readable form for search and AI engines.', 'سكيما JSON-LD تعلن الحقائق (من أنت، ماذا تبيع، الأسعار، التقييمات) بصيغة يقرأها البحث والذكاء الاصطناعي آلياً.'),
    source: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
  },
  syntax: {
    id: 'jsonld-syntax', category: 'entity', severity: 'high', fixCategory: 'schema',
    title: bi('JSON-LD syntax', 'صحة صياغة JSON-LD'),
    why: bi('A single syntax error makes the whole block unreadable — engines silently ignore it.', 'خطأ صياغة واحد يجعل البلوك كله غير مقروء — والمحركات تتجاهله بصمت.'),
  },
  validity: {
    id: 'schema-properties', category: 'entity', severity: 'medium', fixCategory: 'schema',
    title: bi('Rich-result properties', 'خصائص النتائج الغنية'),
    why: bi('Google only considers rich results when required properties are present; recommended ones improve completeness.', 'جوجل لا يعرض نتائج غنية إلا عند وجود الخصائص المطلوبة؛ والخصائص الموصى بها تحسن الاكتمال.'),
    source: 'https://developers.google.com/search/docs/appearance/structured-data/search-gallery',
  },
  identity: {
    id: 'entity-identity', category: 'entity', severity: 'medium', fixCategory: 'schema',
    title: bi('Organization / brand entity', 'كيان المنشأة أو العلامة'),
    why: bi('An Organization (or Person/LocalBusiness) node with name, url and logo is how engines connect your site to one real-world entity (GEO).', 'كيان Organization (أو Person/LocalBusiness) بالاسم والرابط والشعار هو ما يربط موقعك بكيان حقيقي واحد لدى المحركات (GEO).'),
    source: 'https://developers.google.com/search/docs/appearance/structured-data/organization',
  },
  sameAs: {
    id: 'entity-sameas', category: 'entity', severity: 'medium', fixCategory: 'schema',
    title: bi('Entity grounding (sameAs)', 'تأكيد الكيان (sameAs)'),
    why: bi('sameAs links to official profiles (LinkedIn, X, Wikipedia, Crunchbase…) let knowledge graphs and LLMs confirm which entity you are.', 'روابط sameAs لحساباتك الرسمية (لينكدإن، X، ويكيبيديا، Crunchbase…) تسمح لقواعد المعرفة والنماذج اللغوية بتأكيد هويتك.'),
  },
  pageSchema: {
    id: 'page-type-schema', category: 'entity', severity: 'medium', fixCategory: 'schema',
    title: bi('Schema matches page type', 'السكيما تناسب نوع الصفحة'),
    why: bi('The most valuable markup describes the page\'s main thing: Product for product pages, Article for posts, LocalBusiness for local sites.', 'أهم سكيما هي التي تصف موضوع الصفحة: Product لصفحات المنتجات، Article للمقالات، LocalBusiness للأنشطة المحلية.'),
  },
  trust: {
    id: 'trust-pages', category: 'entity', severity: 'low', fixCategory: 'content',
    title: bi('Trust pages linked', 'صفحات الثقة مرتبطة'),
    why: bi('Links to About, Contact and Privacy pages are basic trust signals in Google\'s quality guidelines and for AI source selection.', 'روابط صفحات من نحن والتواصل والخصوصية إشارات ثقة أساسية في إرشادات جودة جوجل وعند اختيار المصادر في الذكاء الاصطناعي.'),
  },
  deprecated: {
    id: 'deprecated-schema', category: 'entity', severity: 'informational', fixCategory: 'schema',
    title: bi('Retired rich-result types', 'أنواع نتائج غنية متوقفة'),
    why: bi('Google retired HowTo rich results (2023) and several others (2025); FAQ rich results are limited to authoritative government and health sites.', 'جوجل أوقف نتائج HowTo الغنية (2023) وأنواعاً أخرى (2025)، ونتائج FAQ الغنية مقصورة على المواقع الحكومية والصحية الموثوقة.'),
    source: 'https://developers.google.com/search/blog/2023/08/howto-faq-changes',
  },
  reviews: {
    id: 'schema-review-stars', category: 'entity', severity: 'informational', fixCategory: 'schema',
    title: bi('Review stars', 'نجوم التقييم'),
    why: bi('Google shows star rich results only from real reviews. A missing rating is not a defect, and an invented one violates Google’s guidelines.', 'جوجل يعرض النجوم فقط من تقييمات حقيقية. غياب التقييم ليس عيباً، واختلاقه يخالف إرشادات جوجل.'),
    source: 'https://developers.google.com/search/docs/appearance/structured-data/review-snippet',
  },
} satisfies Record<string, Def>;

function organizationSnippet(ctx: CheckContext): FixSnippet {
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${ctx.origin}/#organization`,
        name: ctx.siteName,
        url: `${ctx.origin}/`,
        logo: ctx.page.og.image || `${ctx.origin}/logo.png`,
        ...(ctx.page.links.social.length ? { sameAs: ctx.page.links.social } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${ctx.origin}/#website`,
        url: `${ctx.origin}/`,
        name: ctx.siteName,
        publisher: { '@id': `${ctx.origin}/#organization` },
        ...(ctx.page.lang ? { inLanguage: ctx.page.lang } : {}),
      },
    ],
  };
  return {
    language: 'json',
    label: ctx.page.links.social.length ? 'Prefilled with the profiles linked on your page' : 'No sameAs — add a profile only if it exists',
    labelAr: ctx.page.links.social.length ? 'معبأة بالحسابات المرتبطة في صفحتك' : 'بدون sameAs — أضف حساباً فقط إذا كان موجوداً',
    code: `<script type="application/ld+json">\n${JSON.stringify(node, null, 2)}\n</script>`,
  };
}

function entityChecks(ctx: CheckContext): AuditCheck[] {
  const out: AuditCheck[] = [];
  const { schema, page } = ctx;
  const types = schema.types;

  if (schema.blocks === 0) {
    if (page.microdataItems > 0 || page.rdfaItems > 0) {
      out.push(make(E.present, 'warn', bi(`No JSON-LD, but ${page.microdataItems || page.rdfaItems} microdata/RDFa items found.`, `لا يوجد JSON-LD لكن يوجد ${page.microdataItems || page.rdfaItems} عنصر microdata/RDFa.`), undefined,
        bi('Google recommends JSON-LD: easier to maintain and less likely to break with template changes.', 'جوجل توصي بـ JSON-LD: أسهل في الصيانة وأقل عرضة للتعطل مع تغييرات القالب.'), { severity: 'low' }));
    } else {
      out.push(make(E.present, 'fail', bi('No structured data on the page.', 'لا توجد بيانات منظمة في الصفحة.'), bi('No <script type="application/ld+json">, microdata or RDFa found', 'لا يوجد <script type="application/ld+json"> ولا microdata ولا RDFa'),
        bi('Add JSON-LD for your organization and the page\'s main entity.', 'أضف JSON-LD للمنشأة وللكيان الرئيسي في الصفحة.'), { snippet: organizationSnippet(ctx) }));
    }
  } else {
    out.push(make(E.present, 'pass', bi(`${schema.blocks} JSON-LD block(s): ${types.slice(0, 8).join(', ') || 'no @type'}.`, `${schema.blocks} بلوك JSON-LD: ${types.slice(0, 8).join('، ') || 'بدون @type'}.`)));
  }

  if (schema.blocks > 0) {
    if (schema.parseErrors.length > 0) {
      out.push(make(E.syntax, 'fail', bi(`${schema.parseErrors.length} of ${schema.blocks} JSON-LD block(s) are invalid JSON and ignored.`, `${schema.parseErrors.length} من ${schema.blocks} بلوك JSON-LD غير صالح ويتم تجاهله.`), bi(schema.parseErrors.slice(0, 3).join('\n'), schema.parseErrors.slice(0, 3).join('\n')),
        bi('Validate the block (trailing commas, unescaped quotes, HTML entities are typical causes) and fix the template that outputs it.', 'تحقق من البلوك (الفواصل الزائدة، علامات التنصيص غير المهربة، رموز HTML أسباب شائعة) وأصلح القالب الذي يولده.')));
    } else if (!schema.hasContext) {
      out.push(make(E.syntax, 'warn', bi('JSON-LD has no schema.org @context.', 'JSON-LD بدون @context لـ schema.org.'), undefined,
        bi('Add "@context": "https://schema.org" to each top-level block.', 'أضف "@context": "https://schema.org" لكل بلوك رئيسي.')));
    } else {
      out.push(make(E.syntax, 'pass', bi('All JSON-LD blocks parse and use the schema.org context.', 'كل بلوكات JSON-LD سليمة وتستخدم سياق schema.org.')));
    }

    const isInventedReviewAdvice = (property: string) => /aggregateRating or review/.test(property);
    // sameAs has its own check. Counting it here as well scored one gap twice.
    const required = schema.problems.filter((p) => p.level === 'required');
    const recommended = schema.problems.filter((p) => p.level === 'recommended' && p.property !== 'sameAs' && !isInventedReviewAdvice(p.property));
    const reviewNotes = schema.problems.filter((p) => p.level === 'recommended' && isInventedReviewAdvice(p.property));
    const list = (items: typeof schema.problems) => items.slice(0, 6).map((p) => `${p.type}: ${p.property}`).join('\n');
    if (schema.nodes.length === 0) {
      out.push(notAssessed(E.validity, bi('No typed nodes to validate.', 'لا توجد عناصر لها @type للتحقق.')));
    } else if (required.length > 0) {
      out.push(make(E.validity, 'fail', bi(`${required.length} required propert${required.length === 1 ? 'y' : 'ies'} missing — not eligible for those rich results.`, `${required.length} خاصية مطلوبة مفقودة — غير مؤهلة لتلك النتائج الغنية.`), bi(list(required), list(required)),
        bi('Add the missing properties only with facts that are visible on the page (never invent ratings or prices).', 'أضف الخصائص المفقودة فقط بحقائق ظاهرة في الصفحة (لا تختلق تقييمات أو أسعاراً).')));
    } else if (recommended.length > 0) {
      out.push(make(E.validity, 'warn', bi(`Required properties present; ${recommended.length} recommended missing.`, `الخصائص المطلوبة موجودة؛ ${recommended.length} خاصية موصى بها مفقودة.`), bi(list(recommended), list(recommended)),
        bi('Fill the recommended properties where the information exists on the page.', 'أكمل الخصائص الموصى بها حيث تتوفر المعلومة في الصفحة.'), { severity: 'low' }));
    } else {
      out.push(make(E.validity, 'pass', bi('Required and recommended properties present for detected types.', 'الخصائص المطلوبة والموصى بها موجودة للأنواع المكتشفة.')));
    }

    if (reviewNotes.length > 0) {
      out.push(make(E.reviews, 'info',
        bi('No review markup, so star rich results are not available. That is not scored — only add a rating you can show on the page.', 'لا توجد سكيما تقييمات، لذا النجوم غير متاحة. هذا لا يُحسب في الدرجة — أضف تقييماً فقط إذا كان ظاهراً في الصفحة.'),
        bi(list(reviewNotes), list(reviewNotes)),
        bi('Add aggregateRating only when the same ratingValue and ratingCount (or reviewCount) are visible to visitors. Never invent them.', 'أضف aggregateRating فقط عندما يكون ratingValue وratingCount (أو reviewCount) ظاهرين للزائر. لا تخترعهما.')));
    }
  }

  const id = schema.identity;
  if (!id) {
    out.push(make(E.identity, ctx.pageType === 'home' ? 'fail' : 'warn', bi('No Organization, LocalBusiness or Person entity.', 'لا يوجد كيان Organization أو LocalBusiness أو Person.'), undefined,
      bi('Publish an Organization + WebSite graph (at least on the homepage) with name, url, logo and sameAs.', 'انشر سكيما Organization + WebSite (على الرئيسية على الأقل) بالاسم والرابط والشعار وsameAs.'), { snippet: organizationSnippet(ctx) }));
  } else {
    const missing = [!id.name && 'name', !id.hasUrl && 'url', !id.hasLogo && 'logo'].filter(Boolean) as string[];
    if (missing.length === 0) {
      out.push(make(E.identity, 'pass', bi(`${id.type} "${id.name}" with url and logo.`, `${id.type} "${id.name}" مع الرابط والشعار.`)));
    } else {
      out.push(make(E.identity, 'warn', bi(`${id.type} found but missing: ${missing.join(', ')}.`, `${id.type} موجود لكن ينقصه: ${missing.join('، ')}.`), undefined,
        bi('Complete the entity with name, url and logo.', 'أكمل الكيان بالاسم والرابط والشعار.'), { snippet: organizationSnippet(ctx), severity: 'low' }));
    }
  }

  if (id) {
    const count = id.sameAs.length;
    if (count >= 2) {
      out.push(make(E.sameAs, 'pass', bi(`${count} sameAs profile links.`, `${count} رابط sameAs للحسابات.`), bi(id.sameAs.slice(0, 6).join('\n'), id.sameAs.slice(0, 6).join('\n'))));
    } else if (count === 0 && page.links.social.length === 0) {
      out.push(make(E.sameAs, 'warn', bi('No official profiles on the page or in the schema.', 'لا توجد حسابات رسمية في الصفحة ولا في السكيما.'),
        bi('No sameAs, and no profile links in the HTML', 'لا يوجد sameAs ولا روابط حسابات في HTML'),
        bi('Add sameAs only for profiles that actually exist (Facebook, Instagram, WhatsApp, LinkedIn, X). Do not invent them.', 'أضف sameAs فقط لحسابات موجودة فعلاً (فيسبوك، إنستغرام، واتساب، لينكدإن، X). لا تخترعها.'),
        { severity: 'low', snippet: organizationSnippet(ctx) }));
    } else {
      out.push(make(E.sameAs, 'warn', bi(count === 1 ? 'Only one sameAs link.' : 'Profiles are on the page but missing from sameAs.', count === 1 ? 'رابط sameAs واحد فقط.' : 'الحسابات موجودة في الصفحة وناقصة من sameAs.'),
        bi(page.links.social.length ? `Profiles linked on the page but not in schema:\n${page.links.social.join('\n')}` : 'No official profiles referenced', page.links.social.length ? `حسابات مرتبطة في الصفحة وغير موجودة في السكيما:\n${page.links.social.join('\n')}` : 'لا توجد حسابات رسمية مذكورة'),
        bi('Copy the profile URLs that are already on the page into sameAs.', 'انسخ روابط الحسابات الموجودة في الصفحة إلى sameAs.'), { snippet: organizationSnippet(ctx) }));
    }
  } else {
    out.push(make(E.sameAs, 'fail', bi('No entity to attach sameAs profiles to.', 'لا يوجد كيان لربط حسابات sameAs به.'), undefined,
      bi('Create the Organization entity first, then list official profiles in sameAs.', 'أنشئ كيان Organization أولاً ثم اذكر الحسابات الرسمية في sameAs.'), { snippet: organizationSnippet(ctx) }));
  }

  const has = (set: Set<string>) => types.some((t) => set.has(t));
  const pt = ctx.pageType;
  const expectation: Record<PageType, { ok: boolean; need: string } | null> = {
    product: { ok: types.includes('Product') || types.includes('ProductGroup'), need: 'Product (with offers)' },
    article: { ok: has(SCHEMA_SETS.ARTICLE_TYPES), need: 'Article / BlogPosting' },
    local: { ok: has(SCHEMA_SETS.LOCAL_TYPES), need: 'LocalBusiness (or a specific subtype)' },
    software: { ok: has(SCHEMA_SETS.SOFTWARE_TYPES) || has(SCHEMA_SETS.ORG_TYPES), need: 'SoftwareApplication or Organization' },
    home: { ok: has(SCHEMA_SETS.ORG_TYPES) || types.includes('Person') || has(SCHEMA_SETS.LOCAL_TYPES), need: 'Organization + WebSite' },
    general: null,
  };
  const exp = expectation[pt];
  const ptLabel: Record<PageType, Bi> = {
    product: bi('product page', 'صفحة منتج'), article: bi('article', 'مقال'), local: bi('local business page', 'صفحة نشاط محلي'),
    software: bi('software/SaaS page', 'صفحة برنامج/SaaS'), home: bi('homepage', 'صفحة رئيسية'), general: bi('page', 'صفحة'),
  };
  if (!exp) {
    out.push(make(E.pageSchema, 'info', bi('Page type is generic — no specific schema expected beyond WebPage/BreadcrumbList.', 'نوع الصفحة عام — لا يُتوقع سكيما محددة غير WebPage/BreadcrumbList.')));
  } else if (exp.ok) {
    out.push(make(E.pageSchema, 'pass', bi(`Detected ${ptLabel[pt].en}; matching schema present.`, `تم اكتشاف ${ptLabel[pt].ar}؛ والسكيما المناسبة موجودة.`)));
  } else {
    out.push(make(E.pageSchema, 'fail', bi(`Detected ${ptLabel[pt].en} but no ${exp.need} markup.`, `تم اكتشاف ${ptLabel[pt].ar} لكن لا توجد سكيما ${exp.need}.`), undefined,
      bi(`Add ${exp.need} JSON-LD using facts shown on the page. SchemaCraft's generators below produce valid templates.`, `أضف سكيما ${exp.need} بحقائق ظاهرة في الصفحة. مولدات SchemaCraft بالأسفل تنتج قوالب صالحة.`),
      { snippet: pt === 'home' ? organizationSnippet(ctx) : undefined }));
  }

  const t = page.links.trust;
  const found = (Object.keys(t) as Array<keyof typeof t>).filter((k) => t[k]);
  if ((t.about || t.contact) && (t.privacy || t.terms)) {
    out.push(make(E.trust, 'pass', bi(`Linked: ${found.join(', ')}.`, `مرتبطة: ${found.join('، ')}.`)));
  } else {
    const missing = ['about', 'contact', 'privacy'].filter((k) => !t[k as keyof typeof t]);
    out.push(make(E.trust, 'warn', bi(`No link found to: ${missing.join(', ')}.`, `لا يوجد رابط لـ: ${missing.join('، ')}.`), undefined,
      bi('Link About, Contact and Privacy pages from the header or footer of every page.', 'اربط صفحات من نحن والتواصل والخصوصية من الهيدر أو الفوتر في كل صفحة.'), { severity: found.length === 0 ? 'medium' : 'low' }));
  }

  const retired = [...schema.deprecatedTypes, ...(types.includes('FAQPage') ? ['FAQPage'] : [])];
  if (retired.length > 0) {
    out.push(make(E.deprecated, 'info', bi(`${retired.join(', ')}: still valid Schema.org (useful for AI parsing) but Google no longer shows these rich results for most sites.`, `${retired.join('، ')}: سكيما صالحة (مفيدة لفهم الذكاء الاصطناعي) لكن جوجل لم يعد يعرض نتائجها الغنية لمعظم المواقع.`)));
  }

  return out;
}

// ---------------------------------------------------------------------------
// AI search readiness (GEO / AEO)
// ---------------------------------------------------------------------------

const A = {
  oai: {
    id: 'ai-oai-searchbot', category: 'ai_readiness', severity: 'critical', fixCategory: 'robots',
    title: bi('ChatGPT Search (OAI-SearchBot)', 'بحث ChatGPT (OAI-SearchBot)'),
    why: bi('OpenAI documents that sites must allow OAI-SearchBot to appear in ChatGPT search answers and citations.', 'توضح OpenAI أن السماح لـ OAI-SearchBot شرط للظهور في إجابات واقتباسات بحث ChatGPT.'),
    source: 'https://platform.openai.com/docs/bots',
  },
  perplexity: {
    id: 'ai-perplexitybot', category: 'ai_readiness', severity: 'high', fixCategory: 'robots',
    title: bi('Perplexity (PerplexityBot)', 'بيربلكسيتي (PerplexityBot)'),
    why: bi('PerplexityBot builds the index Perplexity uses to cite sources.', 'PerplexityBot يبني الفهرس الذي تستخدمه Perplexity لاقتباس المصادر.'),
    source: 'https://docs.perplexity.ai/guides/bots',
  },
  claude: {
    id: 'ai-claude-searchbot', category: 'ai_readiness', severity: 'medium', fixCategory: 'robots',
    title: bi('Claude search (Claude-SearchBot)', 'بحث Claude (Claude-SearchBot)'),
    why: bi('Anthropic uses Claude-SearchBot to index pages for Claude\'s search results.', 'Anthropic تستخدم Claude-SearchBot لفهرسة الصفحات لنتائج بحث Claude.'),
    source: 'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  },
  userAgents: {
    id: 'ai-user-fetchers', category: 'ai_readiness', severity: 'medium', fixCategory: 'robots',
    title: bi('AI assistants opening your links', 'فتح المساعدات الذكية لروابطك'),
    why: bi('ChatGPT-User, Claude-User and Perplexity-User fetch a page when a user asks about it or pastes the link.', 'ChatGPT-User وClaude-User وPerplexity-User تجلب الصفحة عندما يسأل المستخدم عنها أو يلصق رابطها.'),
  },
  training: {
    id: 'ai-training-policy', category: 'ai_readiness', severity: 'informational', fixCategory: 'robots',
    title: bi('AI training crawlers (policy)', 'زواحف تدريب الذكاء الاصطناعي (سياسة)'),
    why: bi('Blocking training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot…) is a business choice and does not remove you from AI search results.', 'منع زواحف التدريب (GPTBot وClaudeBot وGoogle-Extended وCCBot…) قرار تجاري ولا يحذفك من نتائج البحث الذكي.'),
  },
  waf: {
    id: 'ai-firewall', category: 'ai_readiness', severity: 'high', fixCategory: 'headers',
    title: bi('Firewall / CDN reality check', 'اختبار الجدار الناري / CDN الفعلي'),
    why: bi('robots.txt can say "allow" while a WAF or CDN rule returns 403 or a challenge to crawler user-agents — the bot never sees the page.', 'قد يسمح robots.txt بينما قاعدة في الجدار الناري أو الـ CDN ترجع 403 أو تحدّياً لزواحف البحث — فلا يرى البوت الصفحة أبداً.'),
  },
  js: {
    id: 'ai-javascript', category: 'ai_readiness', severity: 'critical', fixCategory: 'content',
    title: bi('Content visible without JavaScript', 'المحتوى ظاهر بدون جافاسكربت'),
    why: bi('GPTBot, ClaudeBot and PerplexityBot fetch HTML but do not run JavaScript. Content rendered client-side is invisible to them.', 'GPTBot وClaudeBot وPerplexityBot تجلب HTML لكنها لا تشغّل الجافاسكربت. المحتوى المرسوم في المتصفح غير مرئي لها.'),
  },
  snippet: {
    id: 'ai-snippet-controls', category: 'ai_readiness', severity: 'high', fixCategory: 'meta',
    title: bi('Snippet / quoting permissions', 'صلاحيات الاقتباس والمقتطفات'),
    why: bi('nosnippet or max-snippet:0 prevents Google from showing text from the page in results and AI Overviews.', 'nosnippet أو max-snippet:0 يمنع جوجل من عرض نص الصفحة في النتائج وفي AI Overviews.'),
    source: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag',
  },
  llms: {
    id: 'llms-txt', category: 'ai_readiness', severity: 'low', fixCategory: 'content',
    title: bi('llms.txt', 'ملف llms.txt'),
    why: bi('llms.txt is an emerging, optional proposal (llmstxt.org) that gives AI tools a Markdown map of your key pages. No major engine has confirmed ranking use yet.', 'llms.txt مقترح ناشئ واختياري (llmstxt.org) يمنح أدوات الذكاء الاصطناعي خريطة Markdown لصفحاتك الأساسية. لم يؤكد أي محرك كبير استخدامه في الترتيب بعد.'),
    source: 'https://llmstxt.org/',
  },
  facts: {
    id: 'ai-citable-facts', category: 'ai_readiness', severity: 'low', fixCategory: 'content',
    title: bi('Citable facts', 'حقائق قابلة للاقتباس'),
    why: bi('Generative engines favour passages with concrete numbers, names and dates that can be attributed to a source.', 'المحركات التوليدية تفضل الفقرات التي بها أرقام وأسماء وتواريخ محددة يمكن نسبها لمصدر.'),
  },
} satisfies Record<string, Def>;

function botByToken(token: string) {
  return BOT_REGISTRY.find((b) => b.userAgent.toLowerCase() === token.toLowerCase());
}

export function buildBotMatrix(ctx: CheckContext): BotMatrixRow[] {
  const probes = ctx.payload.probes?.bots || [];
  return BOT_REGISTRY.filter((b) => !b.deprecated).map((bot) => {
    let robots: BotMatrixRow['robots'] = 'unknown';
    let robotsRule = '';
    let matchedBy: BotMatrixRow['matchedBy'] = 'unknown';
    if (ctx.robotsState === 'missing') {
      robots = 'allowed';
      robotsRule = 'robots.txt not found';
      matchedBy = 'none';
    } else if (ctx.robotsState === 'ok' && ctx.robots) {
      const verdict = evaluateRobots(ctx.robots, bot.userAgent, ctx.path);
      robots = verdict.allowed ? 'allowed' : 'disallowed';
      robotsRule = describeRule(verdict.rule);
      matchedBy = verdict.matchedBy;
    }
    const probe = probes.find((p) => p.id === bot.userAgent.toLowerCase());
    return {
      id: bot.id,
      userAgent: bot.userAgent,
      vendor: bot.vendor,
      purpose: bot.purpose,
      purposeEn: bot.purposeEn,
      purposeAr: bot.purposeAr,
      robots,
      robotsRule,
      matchedBy,
      probe: probe ? { status: probe.status, challenge: probe.challenge, retried: !!probe.retried, error: probe.error } : null,
    };
  });
}

function aiChecks(ctx: CheckContext, matrix: BotMatrixRow[]): AuditCheck[] {
  const out: AuditCheck[] = [];
  const { page, payload, headers } = ctx;

  const verdictCheck = (def: Def, token: string, label: Bi) => {
    const row = matrix.find((r) => r.userAgent.toLowerCase() === token.toLowerCase());
    if (!row || row.robots === 'unknown') return notAssessed(def, bi('robots.txt could not be read reliably.', 'تعذر قراءة robots.txt بشكل موثوق.'));
    const via = row.matchedBy === 'token' ? `User-agent: ${token}` : row.matchedBy === '*' ? 'User-agent: *' : 'no group';
    const ev = bi(`${via} → ${row.robotsRule}`, `${via} ← ${row.robotsRule}`);
    if (row.robots === 'allowed') {
      return make(def, 'pass', bi(`${label.en} may crawl this URL${row.matchedBy === 'token' ? ' (explicit group)' : ''}.`, `${label.ar} مسموح له بهذا الرابط${row.matchedBy === 'token' ? ' (مجموعة صريحة)' : ''}.`), ev);
    }
    return make(def, 'fail', bi(`robots.txt blocks ${label.en}.`, `robots.txt يمنع ${label.ar}.`), ev,
      bi(row.matchedBy === 'token' ? `Delete the "User-agent: ${token}" Disallow rule.` : `Add an explicit allow group for ${token} (a specific group overrides "User-agent: *").`, row.matchedBy === 'token' ? `احذف قاعدة Disallow الخاصة بـ "User-agent: ${token}".` : `أضف مجموعة سماح صريحة لـ ${token} (المجموعة المحددة تتجاوز "User-agent: *").`),
      { snippet: { language: 'text', label: 'robots.txt', labelAr: 'ملف robots.txt', code: `User-agent: ${token}\nAllow: /` } });
  };

  out.push(verdictCheck(A.oai, 'OAI-SearchBot', bi('OAI-SearchBot', 'OAI-SearchBot')));
  out.push(verdictCheck(A.perplexity, 'PerplexityBot', bi('PerplexityBot', 'PerplexityBot')));
  out.push(verdictCheck(A.claude, 'Claude-SearchBot', bi('Claude-SearchBot', 'Claude-SearchBot')));

  const userRows = matrix.filter((r) => r.purpose === 'user-fetch' && ['ChatGPT-User', 'Claude-User', 'Perplexity-User'].includes(r.userAgent));
  if (userRows.every((r) => r.robots === 'unknown')) {
    out.push(notAssessed(A.userAgents, bi('robots.txt could not be read reliably.', 'تعذر قراءة robots.txt بشكل موثوق.')));
  } else {
    const blocked = userRows.filter((r) => r.robots === 'disallowed').map((r) => r.userAgent);
    out.push(blocked.length === 0
      ? make(A.userAgents, 'pass', bi('ChatGPT-User, Claude-User and Perplexity-User are allowed.', 'ChatGPT-User وClaude-User وPerplexity-User مسموح لها.'))
      : make(A.userAgents, 'warn', bi(`Blocked: ${blocked.join(', ')}.`, `محظور: ${blocked.join('، ')}.`), undefined,
        bi('Allow user-triggered fetchers so assistants can read your page when a user asks about it.', 'اسمح لزواحف الطلب المباشر ليقرأ المساعد صفحتك عندما يسأل المستخدم عنها.'),
        { snippet: { language: 'text', label: 'robots.txt', labelAr: 'ملف robots.txt', code: blocked.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n') } }));
  }

  const trainingRows = matrix.filter((r) => r.purpose === 'training');
  const trainingBlocked = trainingRows.filter((r) => r.robots === 'disallowed').map((r) => r.userAgent);
  out.push(make(A.training, 'info', bi(
    trainingRows.every((r) => r.robots === 'unknown') ? 'Not determined (robots.txt unreadable).' : trainingBlocked.length ? `Blocked for training: ${trainingBlocked.join(', ')}. Not scored — your choice.` : 'Training crawlers are allowed. Not scored — your choice.',
    trainingRows.every((r) => r.robots === 'unknown') ? 'غير محدد (robots.txt غير مقروء).' : trainingBlocked.length ? `محظور للتدريب: ${trainingBlocked.join('، ')}. غير محسوب — قرارك.` : 'زواحف التدريب مسموح لها. غير محسوب — قرارك.',
  )));

  // WAF reality check
  const probes = payload.probes?.bots || [];
  if (probes.length === 0) {
    out.push(notAssessed(A.waf, bi('Live user-agent probes not available for this audit.', 'اختبارات الوكيل الحية غير متاحة لهذا الفحص.')));
  } else {
    const searchIds = ['googlebot', 'bingbot', 'oai-searchbot', 'chatgpt-user', 'perplexitybot'];
    const label = (p: (typeof probes)[number]) => `${p.id}: ${p.error ? p.error : `HTTP ${p.status}`}${p.challenge ? ` (${p.challenge} challenge)` : ''}${p.retried ? ' after retry' : ''}`;
    const evidence = probes.map(label).join('\n');
    const caveat = bi('\nSimulated from SchemaCraft servers with each crawler\'s published user-agent; real crawler IPs can be treated differently.', '\nمحاكاة من سيرفرات SchemaCraft بوكيل كل زاحف المنشور؛ عناوين IP الحقيقية للزواحف قد تُعامل بشكل مختلف.');
    const hard = probes.filter((p) => searchIds.includes(p.id) && (p.challenge || [401, 403, 406, 451].includes(p.status || 0)));
    const soft = probes.filter((p) => searchIds.includes(p.id) && !hard.includes(p) && (p.error || [429, 500, 502, 503, 504].includes(p.status || 0)));
    const training = probes.filter((p) => !searchIds.includes(p.id) && (p.challenge || (p.status || 0) >= 400 || p.error));
    const fix = bi('In your CDN/WAF (Cloudflare, Sucuri, Hostinger, Wordfence…), allow verified search and AI crawlers instead of challenging them, and check "Block AI bots" toggles.',
      'في الـ CDN أو الجدار الناري (Cloudflare أو Sucuri أو Hostinger أو Wordfence…) اسمح لزواحف البحث والذكاء الاصطناعي الموثقة بدل تحديها، وراجع خيارات "حظر بوتات الذكاء الاصطناعي".');
    const unverifiable = bi(' Not scored: firewalls that verify crawler IPs (Cloudflare verified bots, Akamai, Wikipedia) block impostors on purpose, so a refusal here does not prove the real crawler is blocked — confirm in your CDN/WAF logs.',
      ' غير محسوب: الجدران النارية التي تتحقق من عناوين الزواحف (Cloudflare وAkamai وويكيبيديا) تحجب المنتحلين عمداً، لذا الرفض هنا لا يثبت أن الزاحف الحقيقي محجوب — تأكد من سجلات الـ CDN/WAF.');
    if (hard.length > 0) {
      out.push(make(A.waf, 'info', bi(`Refused or challenged from our server: ${hard.map((p) => p.id).join(', ')}.${unverifiable.en}`, `مرفوض أو عليه تحدٍّ من سيرفرنا: ${hard.map((p) => p.id).join('، ')}.${unverifiable.ar}`),
        bi(evidence + caveat.en, evidence + caveat.ar), fix, { severity: 'informational' }));
    } else if (soft.length > 0) {
      out.push(make(A.waf, 'info', bi(`Rate-limited or server error for: ${soft.map((p) => p.id).join(', ')}.${unverifiable.en}`, `تقييد معدل أو خطأ سيرفر لـ: ${soft.map((p) => p.id).join('، ')}.${unverifiable.ar}`),
        bi(evidence + caveat.en, evidence + caveat.ar), fix, { severity: 'informational' }));
    } else {
      out.push(make(A.waf, 'info', bi(`Search & AI crawler user-agents got the page (${probes.filter((p) => searchIds.includes(p.id)).length}/${searchIds.length} OK)${training.length ? `; training bots limited: ${training.map((p) => p.id).join(', ')}` : ''}.`, `وكلاء زواحف البحث والذكاء الاصطناعي حصلوا على الصفحة (${probes.filter((p) => searchIds.includes(p.id)).length}/${searchIds.length})${training.length ? `؛ بوتات التدريب مقيدة: ${training.map((p) => p.id).join('، ')}` : ''}.`),
        bi(evidence + caveat.en, evidence + caveat.ar), undefined, { severity: 'informational' }));
    }
  }

  // JavaScript dependence
  const shell = page.spaRoot ? `Empty app container ${page.spaRoot}` : 'Very little server-rendered text';
  if (ctx.jsDependent === 'yes') {
    out.push(make(A.js, 'fail', bi(`Only ${page.wordCount} words in the HTML — the content is rendered by JavaScript.`, `${page.wordCount} كلمة فقط في HTML — المحتوى يُرسم بالجافاسكربت.`),
      bi(`${shell}; ${page.scripts.total} scripts; frameworks: ${page.frameworkHints.join(', ') || 'unknown'}${page.noscriptText ? `\n<noscript>: ${truncate(page.noscriptText, 120)}` : ''}`, `${page.spaRoot ? `حاوية تطبيق فارغة ${page.spaRoot}` : 'نص قليل جداً من السيرفر'}؛ ${page.scripts.total} سكربت؛ الإطارات: ${page.frameworkHints.join('، ') || 'غير معروف'}`),
      bi('Server-render or pre-render the main content (Next.js/Nuxt SSR or static export, Astro, prerendering) so the text is in the initial HTML.', 'اعرض المحتوى الأساسي من السيرفر أو مسبقاً (SSR أو تصدير ثابت في Next.js/Nuxt أو Astro أو prerender) ليكون النص في HTML الأولي.')));
  } else if (ctx.jsDependent === 'partial') {
    out.push(make(A.js, 'warn', bi(`${page.wordCount} words in the HTML; the app shell suggests part of the content loads with JavaScript.`, `${page.wordCount} كلمة في HTML؛ هيكل التطبيق يشير إلى أن جزءاً من المحتوى يُحمّل بالجافاسكربت.`),
      bi(`${shell}; frameworks: ${page.frameworkHints.join(', ') || 'unknown'}`, `الإطارات: ${page.frameworkHints.join('، ') || 'غير معروف'}`),
      bi('Make sure the key copy, prices and FAQs are in the server HTML, not fetched after load.', 'تأكد أن النصوص الأساسية والأسعار والأسئلة الشائعة موجودة في HTML السيرفر وليست تُجلب بعد التحميل.'), { severity: 'high' }));
  } else {
    out.push(make(A.js, 'pass', bi(`${page.wordCount} words are present in the raw HTML.`, `${page.wordCount} كلمة موجودة في HTML الخام.`)));
  }

  // Snippet controls
  const directives = `${page.metaRobots.join(', ')} ${headers['x-robots-tag'] || ''}`.toLowerCase();
  const maxSnippet = directives.match(/max-snippet\s*:\s*(-?\d+)/);
  if (/nosnippet/.test(directives) || (maxSnippet && Number(maxSnippet[1]) === 0)) {
    out.push(make(A.snippet, 'fail', bi('nosnippet / max-snippet:0 — Google cannot quote this page.', 'nosnippet أو max-snippet:0 — جوجل لا يستطيع اقتباس الصفحة.'), bi(directives.trim(), directives.trim()),
      bi('Remove nosnippet (use data-nosnippet on specific elements instead) or set max-snippet:-1.', 'احذف nosnippet (استخدم data-nosnippet لعناصر محددة) أو اضبط max-snippet:-1.')));
  } else if (maxSnippet && Number(maxSnippet[1]) > 0 && Number(maxSnippet[1]) < 100) {
    out.push(make(A.snippet, 'warn', bi(`max-snippet:${maxSnippet[1]} limits quoted text.`, `max-snippet:${maxSnippet[1]} يحد من النص المقتبس.`), bi(directives.trim(), directives.trim()),
      bi('Use max-snippet:-1 to allow full snippets.', 'استخدم max-snippet:-1 للسماح بمقتطفات كاملة.'), { severity: 'medium' }));
  } else {
    out.push(make(A.snippet, 'pass', bi(`Snippets allowed${page.dataNosnippetCount ? ` (${page.dataNosnippetCount} data-nosnippet sections)` : ''}.`, `المقتطفات مسموحة${page.dataNosnippetCount ? ` (${page.dataNosnippetCount} قسم data-nosnippet)` : ''}.`)));
  }

  // llms.txt
  const llms = payload.llmsTxt || '';
  const llmsType = (payload.llmsContentType || '').toLowerCase();
  const llmsTemplate: FixSnippet = {
    language: 'markdown',
    label: 'Draft /llms.txt from your page (edit descriptions)',
    labelAr: 'مسودة /llms.txt من صفحتك (عدّل الأوصاف)',
    code: [
      `# ${ctx.siteName}`,
      '',
      `> ${truncate(page.metaDescription || page.leadParagraph || `${ctx.siteName} official website.`, 220)}`,
      '',
      '## Key pages',
      ...(page.links.internalSamples.length
        ? page.links.internalSamples.slice(0, 8).map((l) => `- [${l.text}](${l.href})`)
        : [`- [Home](${ctx.origin}/)`]),
    ].join('\n'),
  };
  if (payload.llmsStatus === 200 && llms.trim()) {
    const looksHtml = /^\s*<(!doctype|html|head|body)/i.test(llms) || llmsType.includes('text/html');
    if (looksHtml) {
      out.push(make(A.llms, 'warn', bi('/llms.txt returns an HTML page (likely a catch-all route), not Markdown.', '/llms.txt يرجع صفحة HTML (غالباً مسار عام) وليس Markdown.'), bi(`Content-Type: ${llmsType || 'unknown'}`, `Content-Type: ${llmsType || 'غير معروف'}`),
        bi('Serve a plain-text Markdown file at /llms.txt.', 'قدّم ملف Markdown نصياً على /llms.txt.'), { snippet: llmsTemplate }));
    } else if (!/^\s*#\s+\S/.test(llms)) {
      out.push(make(A.llms, 'warn', bi('/llms.txt exists but does not start with an H1 title ("# Name").', '/llms.txt موجود لكنه لا يبدأ بعنوان H1 ("# الاسم").'), bi(truncate(llms.trim(), 160), truncate(llms.trim(), 160)),
        bi('Follow the llmstxt.org format: H1 name, > summary, then ## sections of links.', 'اتبع صيغة llmstxt.org: عنوان H1 ثم > ملخص ثم أقسام ## للروابط.'), { snippet: llmsTemplate }));
    } else {
      const linkCount = (llms.match(/\]\(https?:\/\//g) || []).length;
      out.push(make(A.llms, 'pass', bi(`/llms.txt present (${linkCount} links).`, `/llms.txt موجود (${linkCount} رابط).`), bi(truncate(llms.trim().split('\n')[0], 120), truncate(llms.trim().split('\n')[0], 120))));
    }
  } else if (payload.llmsStatus === null || payload.llmsStatus === undefined) {
    out.push(notAssessed(A.llms, bi('/llms.txt request did not complete.', 'طلب /llms.txt لم يكتمل.')));
  } else {
    out.push(make(A.llms, 'warn', bi(`/llms.txt not found (${payload.llmsStatus}).`, `/llms.txt غير موجود (${payload.llmsStatus}).`), undefined,
      bi('Optional: publish /llms.txt summarising your key pages for AI tools.', 'اختياري: انشر /llms.txt يلخص صفحاتك الأساسية لأدوات الذكاء الاصطناعي.'), { snippet: llmsTemplate }));
  }

  // Citable facts
  const factSamples = quantifiedSamples(page.text.slice(0, 20000));
  const factEvidence = factSamples.length
    ? bi(factSamples.map((s) => `"${s}"`).join('\n'), factSamples.map((s) => `"${s}"`).join('\n'))
    : bi(`Scanned ${page.wordCount} words of visible text. No number sits next to a unit, percent, duration or price.`, `فُحص ${page.wordCount} كلمة من النص الظاهر. لا يوجد رقم بجانب وحدة أو نسبة أو مدة أو سعر.`);
  if (ctx.jsDependent === 'yes') {
    out.push(make(A.facts, 'info', bi('Not scored separately (JavaScript-rendered page).', 'غير محسوب منفصلاً (صفحة تُرسم بالجافاسكربت).')));
  } else if (page.numbersInText >= 3) {
    out.push(make(A.facts, 'pass', bi(`${page.numbersInText} quantified statements (a number with a unit, percent, duration or price).`, `${page.numbersInText} عبارة بها رقم مع وحدة أو نسبة أو مدة أو سعر.`), factEvidence));
  } else {
    const n = page.numbersInText;
    out.push(make(A.facts, 'warn', n === 0
      ? bi('No quantified statements (a number next to a unit, percent, duration or price).', 'لا توجد عبارات رقمية (رقم بجانب وحدة أو نسبة أو مدة أو سعر).')
      : n === 1
        ? bi('Only 1 quantified statement.', 'عبارة رقمية واحدة فقط.')
        : bi(`Only ${n} quantified statements.`, `${n} عبارات رقمية فقط.`),
    factEvidence,
      bi('Add verifiable specifics: prices, weights, years in business, customers served, delivery times — only facts that are true.', 'أضف تفاصيل قابلة للتحقق: الأسعار، الأوزان، سنوات العمل، عدد العملاء، مدة التوصيل — حقائق صحيحة فقط.')));
  }

  return out;
}

export function buildChecks(ctx: CheckContext): { checks: AuditCheck[]; matrix: BotMatrixRow[] } {
  const matrix = buildBotMatrix(ctx);
  const checks = [
    ...technicalChecks(ctx),
    ...crawlChecks(ctx),
    ...contentChecks(ctx),
    ...entityChecks(ctx),
    ...aiChecks(ctx, matrix),
  ];
  return { checks, matrix };
}

export { botByToken };
