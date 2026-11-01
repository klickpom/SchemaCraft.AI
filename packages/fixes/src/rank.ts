import {
  SEVERITY_WEIGHT,
  type AuditCheck,
  type AuditReport,
  type CheckStatus,
  type Severity,
} from '@schemacraft/audit-core/audit/types';

export type EvidencePriority = 'proven' | 'likely' | 'experimental';
export type Risk = 'high' | 'medium' | 'low';

export interface FixQuestion {
  id: string;
  prompt: string;
  promptAr: string;
}

export interface FixDraft {
  id: string;
  checkIds: string[];
  title: string;
  titleAr: string;
  why: string;
  whyAr: string;
  evidence: string;
  evidenceAr: string;
  artifact: string;
  risk: Risk;
  priority: EvidencePriority;
  impact: number;
  pages: number;
  /** 3 is a copy block, 2 needs an answer, 1 is work only the host can do. */
  ease: number;
  effort: 'low' | 'medium' | 'high';
  rankScore: number;
  questions: FixQuestion[];
  userMustApply: boolean;
  skipped?: boolean;
}

export interface IndexNowStep {
  optional: true;
  endpoint: string;
  body: string;
  note: string;
  noteAr: string;
}

export interface RankedFixes {
  top: FixDraft[];
  later: { id: string; title: string; titleAr: string }[];
  drafts: FixDraft[];
  indexNow: IndexNowStep | null;
}

export interface CheckChange {
  id: string;
  title: string;
  titleAr: string;
  before: CheckStatus;
  after: CheckStatus;
}

const PRIORITY_WEIGHT: Record<EvidencePriority, number> = { proven: 5, likely: 3, experimental: 1 };

const PROVEN = new Set([
  'https', 'http-to-https', 'redirect-chain', 'indexability', 'mixed-content', 'meta-refresh', 'tls-certificate',
  'robots-txt', 'robots-googlebot', 'robots-bingbot', 'ai-oai-searchbot', 'ai-perplexitybot', 'ai-claude-searchbot',
  'ai-user-fetchers', 'ai-firewall', 'ai-javascript', 'ai-snippet-controls',
]);

const EXPERIMENTAL = new Set([
  'social-cards', 'favicon', 'security-headers', 'ttfb', 'compression', 'html-weight', 'llms-txt',
  'ai-training-policy', 'ai-citable-facts', 'deprecated-schema', 'schema-review-stars', 'robots-syntax',
]);

const PHONE: FixQuestion = {
  id: 'phone',
  prompt: 'What phone number is printed for this business?',
  promptAr: 'ما رقم الهاتف المكتوب لهذا النشاط؟',
};
const LEGAL_NAME: FixQuestion = {
  id: 'legal-name',
  prompt: 'What legal name is shown to customers?',
  promptAr: 'ما الاسم القانوني الظاهر للعملاء؟',
};
const HOURS: FixQuestion = {
  id: 'hours',
  prompt: 'What opening hours are written on the page?',
  promptAr: 'ما ساعات العمل المكتوبة في الصفحة؟',
};
const SAME_AS: FixQuestion = {
  id: 'sameAs',
  prompt: 'Which official profile URLs should be listed? One URL per line.',
  promptAr: 'ما روابط الحسابات الرسمية؟ ضع كل رابط في سطر.',
};
const PRIVATE_PAGE: FixQuestion = {
  id: 'private',
  prompt: 'Is this page meant to stay private? Answer yes to skip the fix.',
  promptAr: 'هل هذه الصفحة مخصصة للبقاء خاصة؟ أجب بنعم لتخطي الإصلاح.',
};

const TOKEN_BY_CHECK: Record<string, string[]> = {
  'robots-googlebot': ['Googlebot'],
  'robots-bingbot': ['Bingbot'],
  'ai-oai-searchbot': ['OAI-SearchBot'],
  'ai-perplexitybot': ['PerplexityBot'],
  'ai-claude-searchbot': ['Claude-SearchBot'],
  'ai-user-fetchers': ['ChatGPT-User', 'Claude-User', 'Perplexity-User'],
};

function priorityOf(id: string): EvidencePriority {
  if (PROVEN.has(id)) return 'proven';
  if (EXPERIMENTAL.has(id)) return 'experimental';
  return 'likely';
}

function issuesOf(report: AuditReport): AuditCheck[] {
  return report.checks.filter((check) => check.status === 'fail' || check.status === 'warn');
}

function pageLocation(report: AuditReport): { host: string; origin: string; url: string } | null {
  try {
    const url = new URL(report.finalUrl || report.url);
    return { host: url.host, origin: url.origin, url: url.toString() };
  } catch {
    return null;
  }
}

function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

function firstSentence(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  const cut = clean.search(/[.!?؟](\s|$)/);
  return cut === -1 ? clean : clean.slice(0, cut + 1);
}

function visibleText(report: AuditReport): string {
  return [report.summary.title, report.summary.h1, report.summary.metaDescription, report.summary.leadParagraph, report.summary.aiVisibleText]
    .filter(Boolean)
    .join('\n');
}

function hasPhone(text: string): boolean {
  return /tel:/i.test(text) || /(?:\+\d[\d\s().-]{7,}\d)|(?:\d[\s().-]*){8,}/.test(text);
}

function visibleName(report: AuditReport): string | null {
  const candidate = report.summary.h1 || report.summary.title || report.summary.siteName;
  if (!candidate) return null;
  if (candidate === 'Your brand') return null;
  return candidate.trim();
}

function profileUrls(text: string): string[] {
  const found = text.match(/https?:\/\/[^\s"'<>]+/g) || [];
  return [...new Set(found.filter((url) => /facebook|instagram|linkedin|twitter|x\.com|youtube|tiktok|wa\.me|whatsapp/i.test(url)))];
}

function evidenceOf(checks: AuditCheck[]): { evidence: string; evidenceAr: string } {
  const evidence = checks.map((check) => check.evidence).filter(Boolean).slice(0, 2).join('\n');
  const evidenceAr = checks.map((check) => check.evidenceAr).filter(Boolean).slice(0, 2).join('\n');
  return {
    evidence: clip(evidence || checks[0]?.detail || '', 500),
    evidenceAr: clip(evidenceAr || checks[0]?.detailAr || '', 500),
  };
}

function finish(input: {
  id: string;
  checks: AuditCheck[];
  title: string;
  titleAr: string;
  why: string;
  whyAr: string;
  artifact: string;
  risk: Risk;
  priority: EvidencePriority;
  questions: FixQuestion[];
  userMustApply: boolean;
  pages: number;
}): FixDraft {
  const severity = input.checks.reduce((max, check) => Math.max(max, SEVERITY_WEIGHT[check.severity as Severity] || 0), 0);
  const impact = PRIORITY_WEIGHT[input.priority] * Math.max(severity, 1);
  const ease = input.userMustApply ? 1 : input.questions.length > 0 ? 2 : 3;
  const quoted = evidenceOf(input.checks);
  return {
    id: input.id,
    checkIds: input.checks.map((check) => check.id),
    title: input.title,
    titleAr: input.titleAr,
    why: firstSentence(input.why),
    whyAr: firstSentence(input.whyAr),
    evidence: quoted.evidence,
    evidenceAr: quoted.evidenceAr,
    artifact: input.artifact,
    risk: input.risk,
    priority: input.priority,
    impact,
    pages: input.pages,
    ease,
    effort: ease === 3 ? 'low' : ease === 2 ? 'medium' : 'high',
    rankScore: impact * input.pages * ease,
    questions: input.questions,
    userMustApply: input.userMustApply,
  };
}

function robotsArtifact(report: AuditReport, checks: AuditCheck[]): string {
  const place = pageLocation(report);
  const host = place?.host || 'this-host';
  const origin = place?.origin || '';
  const fromMatrix = report.botMatrix
    .filter((row) => row.robots === 'disallowed' && row.purpose !== 'training')
    .map((row) => row.userAgent);
  const fromChecks = checks.flatMap((check) => TOKEN_BY_CHECK[check.id] || []);
  const tokens = [...new Set(fromMatrix.length > 0 ? fromMatrix : fromChecks)];
  const lines = [`# Allow these crawlers on ${host}`];
  if (origin) lines.push(`# ${origin}`);
  tokens.forEach((token) => {
    lines.push('', `User-agent: ${token}`, 'Allow: /');
  });
  if (origin) lines.push('', `Sitemap: ${origin}/sitemap.xml`);
  return `${lines.join('\n')}\n`;
}

function jsonLd(report: AuditReport, checks: AuditCheck[]): { artifact: string; questions: FixQuestion[] } {
  const text = visibleText(report);
  const questions: FixQuestion[] = [];
  const name = visibleName(report);
  if (!name) questions.push(LEGAL_NAME);
  if (!hasPhone(text)) questions.push(PHONE);
  if (report.pageType === 'local' && !/hours|open|ساعات|مفتوح/i.test(text)) questions.push(HOURS);
  const profiles = profileUrls(`${text}\n${checks.map((check) => check.evidence).join('\n')}`);
  if (profiles.length === 0) questions.push(SAME_AS);
  const type = report.pageType === 'local' ? 'LocalBusiness' : report.pageType === 'product' ? 'Product' : report.pageType === 'article' ? 'Article' : 'Organization';
  const graph: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    url: report.finalUrl || report.url,
  };
  if (name) graph.name = name;
  if (report.summary.metaDescription) graph.description = report.summary.metaDescription;
  if (report.summary.ogImage) graph.image = report.summary.ogImage;
  if (profiles.length > 0) graph.sameAs = profiles;
  return {
    artifact: `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>\n`,
    questions,
  };
}

function scriptJson(artifact: string): { graph: Record<string, unknown>; wrap: (graph: Record<string, unknown>) => string } | null {
  const match = artifact.match(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/);
  if (!match) return null;
  return {
    graph: JSON.parse(match[1]) as Record<string, unknown>,
    wrap: (graph) => `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>\n`,
  };
}

export function fillAnswers(draft: FixDraft, answers: Record<string, string>, skip = false): FixDraft {
  if (skip) return { ...draft, skipped: true, artifact: '' };
  if (draft.id !== 'json-ld' && draft.id !== 'indexability') return draft;
  if (draft.id === 'indexability') {
    const answer = (answers.private || '').trim().toLowerCase();
    if (answer === 'yes' || answer === 'نعم') return { ...draft, skipped: true, artifact: '' };
    return draft;
  }
  const parsed = scriptJson(draft.artifact);
  if (!parsed) return draft;
  const graph = parsed.graph;
  const phone = answers.phone?.trim();
  const legal = answers['legal-name']?.trim();
  const hours = answers.hours?.trim();
  const same = answers.sameAs?.trim();
  if (phone) graph.telephone = phone;
  if (legal) graph.name = legal;
  if (hours) graph.openingHours = hours;
  if (same) {
    const urls = same.split(/\s+/).filter((url) => /^https?:\/\//i.test(url));
    if (urls.length > 0) graph.sameAs = urls;
  }
  return { ...draft, artifact: parsed.wrap(graph) };
}

export function indexNowBody(host: string, urls: string[], key = 'YOUR_INDEXNOW_KEY') {
  return {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  };
}

function indexNowStep(report: AuditReport): IndexNowStep | null {
  const place = pageLocation(report);
  if (!place) return null;
  const body = indexNowBody(place.host, [place.url]);
  return {
    optional: true,
    endpoint: 'https://api.indexnow.org/indexnow',
    body: JSON.stringify(body, null, 2),
    note: 'Optional. Send this only after the fix is on the site. IndexNow notifies Bing and Yandex. Google does not participate.',
    noteAr: 'اختياري. أرسل هذا فقط بعد أن يصبح الإصلاح على الموقع. IndexNow يخبر Bing وYandex. جوجل لا يشارك.',
  };
}

function take(pool: Map<string, AuditCheck>, ids: string[]): AuditCheck[] {
  return ids.flatMap((id) => {
    const check = pool.get(id);
    if (!check) return [];
    pool.delete(id);
    return [check];
  });
}

export function rankFixes(report: AuditReport, pages = 1): RankedFixes {
  const pool = new Map(issuesOf(report).map((check) => [check.id, check]));
  const drafts: FixDraft[] = [];
  const place = pageLocation(report);
  const host = place?.host || '';

  const robots = take(pool, Object.keys(TOKEN_BY_CHECK));
  if (robots.length > 0) {
    drafts.push(finish({
      id: 'robots-allow',
      checks: robots,
      title: 'Allow AI and Google crawlers',
      titleAr: 'اسمح لزواحف جوجل والذكاء الاصطناعي',
      why: 'Answer engines skip a page when their crawler is told not to fetch it.',
      whyAr: 'محركات الإجابات تتجاوز الصفحة إذا مُنع زاحفها من جلبها.',
      artifact: robotsArtifact(report, robots),
      risk: 'high',
      priority: 'proven',
      questions: [],
      userMustApply: false,
      pages,
    }));
  }

  const training = take(pool, ['ai-training-policy']);
  if (training.length > 0) {
    drafts.push(finish({
      id: 'training-policy',
      checks: training,
      title: 'Choose a training-bot policy',
      titleAr: 'اختر سياسة زواحف التدريب',
      why: 'Blocking a training crawler does not decide whether ChatGPT Search can cite the page.',
      whyAr: 'منع زاحف التدريب لا يقرر إن كان بحث ChatGPT يستطيع اقتباس الصفحة.',
      artifact: `# Training crawlers are a business choice for ${host || 'this host'}.\n# Uncomment one group. Do not silently block a search crawler.\n# User-agent: GPTBot\n# Disallow: /\n`,
      risk: 'medium',
      priority: 'experimental',
      questions: [{
        id: 'training',
        prompt: 'Block training crawlers, or leave them allowed?',
        promptAr: 'هل نمنع زواحف التدريب أم نتركها مسموحة؟',
      }],
      userMustApply: false,
      pages,
    }));
  }

  const firewall = take(pool, ['ai-firewall']);
  if (firewall.length > 0) {
    drafts.push(finish({
      id: 'firewall',
      checks: firewall,
      title: 'Ask the host to allow the crawler',
      titleAr: 'اطلب من المستضيف السماح للزاحف',
      why: 'A firewall can block a crawler even when robots.txt allows it.',
      whyAr: 'الجدار الناري قد يمنع الزاحف حتى لو سمح robots.txt.',
      artifact: `# Host checklist for ${host}\n# Allow the published crawler user-agents in the CDN or firewall.\n# SchemaCraft cannot change this panel for you.\n`,
      risk: 'high',
      priority: 'proven',
      questions: [],
      userMustApply: true,
      pages,
    }));
  }

  const indexability = take(pool, ['indexability', 'ai-snippet-controls']);
  if (indexability.length > 0) {
    drafts.push(finish({
      id: 'indexability',
      checks: indexability,
      title: 'Let the page be quoted',
      titleAr: 'اسمح باقتباس الصفحة',
      why: 'noindex or nosnippet keeps the page out of search results and AI Overviews.',
      whyAr: 'noindex أو nosnippet يبقي الصفحة خارج نتائج البحث وAI Overviews.',
      artifact: '<meta name="robots" content="index, follow">\n',
      risk: 'high',
      priority: 'proven',
      questions: [PRIVATE_PAGE],
      userMustApply: false,
      pages,
    }));
  }

  const canonical = take(pool, ['canonical']);
  if (canonical.length > 0 && place) {
    drafts.push(finish({
      id: 'canonical',
      checks: canonical,
      title: 'Set one preferred URL',
      titleAr: 'حدّد رابطاً مفضلاً واحداً',
      why: 'A canonical tells Google which URL is the one to keep.',
      whyAr: 'الرابط الأساسي يخبر جوجل أي عنوان يُحتفظ به.',
      artifact: `<link rel="canonical" href="${place.url}">\n`,
      risk: 'high',
      priority: 'proven',
      questions: [],
      userMustApply: false,
      pages,
    }));
  }

  const titles = take(pool, ['title', 'meta-description', 'h1']);
  if (titles.length > 0) {
    const h1 = report.summary.h1 || report.summary.title || '';
    const description = report.summary.leadParagraph || report.summary.metaDescription || '';
    const questions: FixQuestion[] = [];
    if (!h1 && !description) {
      questions.push({
        id: 'page-text',
        prompt: 'Paste the sentence this page should lead with. It has no usable text yet.',
        promptAr: 'الصق الجملة التي يجب أن تبدأ بها الصفحة. لا يوجد نص صالح بعد.',
      });
    }
    const lines = [
      h1 ? `<title>${clip(h1, 60)}</title>` : '',
      description ? `<meta name="description" content="${clip(description, 158)}">` : '',
      h1 ? `<h1>${clip(h1, 120)}</h1>` : '',
    ].filter(Boolean);
    drafts.push(finish({
      id: 'titles',
      checks: titles,
      title: 'Match the title to the page text',
      titleAr: 'طابق العنوان مع نص الصفحة',
      why: 'A title that repeats the visible heading is easier to quote.',
      whyAr: 'العنوان الذي يكرر العنوان الظاهر أسهل للاقتباس.',
      artifact: lines.length > 0 ? `${lines.join('\n')}\n` : '',
      risk: 'medium',
      priority: 'likely',
      questions,
      userMustApply: false,
      pages,
    }));
  }

  const schema = take(pool, ['structured-data', 'jsonld-syntax', 'schema-properties', 'entity-identity', 'entity-sameas', 'page-type-schema']);
  if (schema.length > 0) {
    const built = jsonLd(report, schema);
    drafts.push(finish({
      id: 'json-ld',
      checks: schema,
      title: 'Add JSON-LD from facts on the page',
      titleAr: 'أضف JSON-LD من حقائق الصفحة',
      why: 'Structured data can only repeat facts a visitor can already see.',
      whyAr: 'البيانات المنظمة تكرر فقط حقائق يراها الزائر.',
      artifact: built.artifact,
      risk: 'medium',
      priority: 'likely',
      questions: built.questions,
      userMustApply: false,
      pages,
    }));
  }

  const javascript = take(pool, ['ai-javascript']);
  if (javascript.length > 0) {
    drafts.push(finish({
      id: 'javascript',
      checks: javascript,
      title: 'Put the answer in the server HTML',
      titleAr: 'ضع الإجابة في HTML السيرفر',
      why: 'AI crawlers do not run JavaScript, so client-only text is invisible.',
      whyAr: 'زواحف الذكاء الاصطناعي لا تشغّل جافاسكربت، فالنص الموجود في المتصفح فقط غير مرئي.',
      artifact: report.summary.aiVisibleText
        ? `<!-- Move this text into the server HTML -->\n${clip(report.summary.aiVisibleText, 400)}\n`
        : '<!-- The rendered page has text that is missing from the raw HTML. Move that block into the server response. -->\n',
      risk: 'high',
      priority: 'proven',
      questions: [],
      userMustApply: false,
      pages,
    }));
  }

  const hostChecks = take(pool, ['https', 'http-to-https', 'redirect-chain', 'mixed-content', 'meta-refresh', 'tls-certificate']);
  if (hostChecks.length > 0) {
    drafts.push(finish({
      id: 'https-host',
      checks: hostChecks,
      title: 'Fix HTTPS on the host',
      titleAr: 'أصلح HTTPS عند المستضيف',
      why: 'Crawlers drop a page that is not served once, over HTTPS.',
      whyAr: 'الزواحف تترك الصفحة إذا لم تُخدم مرة واحدة عبر HTTPS.',
      artifact: `# Host checklist for ${host}\n# One HTTPS hop, a current certificate, and no http:// assets.\n# SchemaCraft cannot change the host for you.\n`,
      risk: 'high',
      priority: 'proven',
      questions: [],
      userMustApply: true,
      pages,
    }));
  }

  const perf = take(pool, ['ttfb', 'compression', 'html-weight', 'security-headers']);
  if (perf.length > 0) {
    drafts.push(finish({
      id: 'performance',
      checks: perf,
      title: 'Host performance notes',
      titleAr: 'ملاحظات أداء المستضيف',
      why: 'These numbers help Google crawl more pages. They are not a citation factor.',
      whyAr: 'هذه الأرقام تساعد جوجل على زحف صفحات أكثر. ليست عامل اقتباس.',
      artifact: `# Host checklist for ${host}\n# Turn on compression, cache HTML, and send the usual security headers.\n`,
      risk: 'low',
      priority: 'experimental',
      questions: [],
      userMustApply: true,
      pages,
    }));
  }

  for (const check of [...pool.values()]) {
    pool.delete(check.id);
    drafts.push(finish({
      id: check.id,
      checks: [check],
      title: check.title,
      titleAr: check.titleAr,
      why: check.why,
      whyAr: check.whyAr,
      artifact: check.fixSnippet?.code || `${check.fix}\n`,
      risk: check.severity === 'critical' || check.severity === 'high' ? 'medium' : 'low',
      priority: priorityOf(check.id),
      questions: [],
      userMustApply: check.fixCategory === 'headers',
      pages,
    }));
  }

  drafts.sort((a, b) => b.rankScore - a.rankScore || a.id.localeCompare(b.id));
  return {
    top: drafts.slice(0, 3),
    later: drafts.slice(3).map((draft) => ({ id: draft.id, title: draft.title, titleAr: draft.titleAr })),
    drafts,
    indexNow: indexNowStep(report),
  };
}

export function compareAudits(before: AuditReport, after: AuditReport): CheckChange[] {
  const previous = new Map(before.checks.map((check) => [check.id, check]));
  const next = new Map(after.checks.map((check) => [check.id, check]));
  const ids = new Set([...previous.keys(), ...next.keys()]);
  const changes: CheckChange[] = [];
  for (const id of ids) {
    const left = previous.get(id);
    const right = next.get(id);
    const beforeStatus = left?.status ?? 'not_assessed';
    const afterStatus = right?.status ?? 'not_assessed';
    if (beforeStatus === afterStatus && (left?.evidence ?? '') === (right?.evidence ?? '')) continue;
    changes.push({
      id,
      title: right?.title || left?.title || id,
      titleAr: right?.titleAr || left?.titleAr || id,
      before: beforeStatus,
      after: afterStatus,
    });
  }
  return changes.sort((a, b) => a.id.localeCompare(b.id));
}
