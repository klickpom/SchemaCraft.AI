'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  ChevronDown,
  Cpu,
  ExternalLink,
  Eye,
  FileCode2,
  Gauge,
  Globe,
  Printer,
  Search,
  Share2,
  ShieldAlert,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { BOT_REGISTRY } from '@/lib/bots/registry';
import type { AuditCheck, AuditReport, BotMatrixRow, Category } from '@/lib/audit/types';
import FixModal from './FixModal';
import { count, formatBytes, L, scoreTone, type Lang } from './i18n';
import { StatusIcon, StatusPill } from './StatusPill';

const CATEGORIES: { id: Category; key: keyof AuditReport['categoryScores']; en: string; ar: string; descEn: string; descAr: string }[] = [
  { id: 'ai_readiness', key: 'aiSearchReadiness', en: 'AI search readiness', ar: 'جاهزية البحث الذكي', descEn: 'Can ChatGPT, Perplexity and Claude reach, read and quote the page?', descAr: 'هل يستطيع ChatGPT وPerplexity وClaude الوصول للصفحة وقراءتها والاقتباس منها؟' },
  { id: 'technical', key: 'technicalSEO', en: 'Technical SEO', ar: 'السيو التقني', descEn: 'Indexability, canonical, titles, metadata, HTTPS.', descAr: 'قابلية الفهرسة، الرابط الأساسي، العناوين، الميتا، HTTPS.' },
  { id: 'crawlability', key: 'crawlability', en: 'Crawlability & speed', ar: 'الزحف والسرعة', descEn: 'robots.txt, sitemap, response time, page weight.', descAr: 'robots.txt، خريطة الموقع، زمن الاستجابة، حجم الصفحة.' },
  { id: 'content', key: 'contentAnswerability', en: 'Content answerability', ar: 'قابلية المحتوى للإجابة', descEn: 'Answer-first copy, structure, depth, freshness.', descAr: 'إجابة مباشرة، تنظيم، عمق، حداثة.' },
  { id: 'entity', key: 'entitySchema', en: 'Entity & structured data', ar: 'الكيان والبيانات المنظمة', descEn: 'JSON-LD validity, Organization identity, trust signals.', descAr: 'صحة JSON-LD، هوية المؤسسة، إشارات الثقة.' },
];

type Filter = 'issues' | 'all' | 'pass' | 'na';

function ScoreRing({ score }: { score: number }) {
  const tone = scoreTone(score);
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-36 w-36 flex items-center justify-center">
      <div className={`absolute inset-3 rounded-full blur-xl opacity-25 ${tone.glow}`} />
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" strokeLinecap="round" className={`transition-all duration-1000 ${tone.ring}`} strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      </svg>
      <span className={`relative text-5xl font-black font-mono tracking-tighter ${tone.text}`}>{score}</span>
    </div>
  );
}

function verdictLabel(score: number, lang: Lang) {
  if (score >= 90) return L(lang, 'Excellent', 'ممتاز');
  if (score >= 80) return L(lang, 'Good — a few fixes left', 'جيد — تبقى إصلاحات قليلة');
  if (score >= 50) return L(lang, 'Needs work', 'يحتاج تحسين');
  return L(lang, 'Critical problems', 'مشاكل حرجة');
}

function Stat({ label, value, tone = 'text-white' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="p-3 rounded-xl bg-black/40 border border-white/5 min-w-0">
      <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{label}</span>
      <span className={`block font-mono text-sm font-bold truncate ${tone}`} title={value}>{value}</span>
    </div>
  );
}

function BotRow({ row, lang }: { row: BotMatrixRow; lang: Lang }) {
  const docs = BOT_REGISTRY.find((b) => b.id === row.id)?.docsUrl;
  const purpose = row.purpose === 'search-citation' ? L(lang, 'Search & citations', 'بحث واقتباس') : row.purpose === 'user-fetch' ? L(lang, 'User-triggered fetch', 'جلب بطلب المستخدم') : L(lang, 'Model training', 'تدريب النماذج');
  const robotsCls = row.robots === 'allowed' ? 'text-emerald-300' : row.robots === 'disallowed' ? (row.purpose === 'training' ? 'text-amber-300' : 'text-rose-300') : 'text-slate-400';
  const robotsText = row.robots === 'allowed' ? L(lang, 'Allowed', 'مسموح') : row.robots === 'disallowed' ? L(lang, 'Blocked', 'محظور') : L(lang, 'Unknown', 'غير معروف');
  const probe = row.probe;
  const probeText = !probe ? '—' : probe.error ? probe.error : probe.challenge ? `${probe.status} · ${probe.challenge}` : `HTTP ${probe.status}${probe.retried ? '*' : ''}`;
  const probeCls = !probe ? 'text-slate-500' : probe.status === 200 && !probe.challenge ? 'text-emerald-300' : 'text-amber-300';
  return (
    <tr className="border-t border-white/5 align-top">
      <td className="py-2.5 px-3">
        <div className="font-mono text-[12px] font-bold text-white flex items-center gap-1.5">
          {row.userAgent}
          {docs && (
            <a href={docs} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-300" aria-label={`${row.userAgent} documentation`}>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <div className="text-[10px] text-slate-500">{row.vendor}</div>
      </td>
      <td className="py-2.5 px-3 text-[11px] text-slate-300">{purpose}</td>
      <td className="py-2.5 px-3">
        <div className={`text-[12px] font-bold ${robotsCls}`}>{robotsText}</div>
        <div className="text-[10px] font-mono text-slate-500 break-all">{row.robotsRule || ''}</div>
      </td>
      <td className={`py-2.5 px-3 font-mono text-[11px] ${probeCls}`}>{probeText}</td>
    </tr>
  );
}

function CheckRow({ check, lang, onFix }: { check: AuditCheck; lang: Lang; onFix: (c: AuditCheck) => void }) {
  const [open, setOpen] = useState(false);
  const actionable = check.status === 'fail' || check.status === 'warn';
  return (
    <li className="rounded-xl border border-white/[0.07] bg-[#0b0b11]">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-start gap-3 p-3 text-start" aria-expanded={open}>
        <StatusIcon status={check.status} className="w-4 h-4 mt-0.5 shrink-0" />
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-white">{L(lang, check.title, check.titleAr)}</span>
            {check.weight > 0 && actionable && (
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border border-white/10 text-slate-400">{check.severity}</span>
            )}
          </span>
          <span className="block text-[12px] text-slate-400 leading-relaxed mt-0.5">{L(lang, check.detail, check.detailAr)}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 mt-0.5 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 ps-10 space-y-2.5 text-[12px]">
          <pre className="p-2.5 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-cyan-200 whitespace-pre-wrap break-words">{L(lang, check.evidence, check.evidenceAr)}</pre>
          <p className="text-slate-400 leading-relaxed">{L(lang, check.why, check.whyAr)}</p>
          {actionable && check.fix && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20">
              <p className="text-indigo-100 leading-relaxed">{L(lang, check.fix, check.fixAr)}</p>
              <button type="button" onClick={() => onFix(check)} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold">
                <Wrench className="w-3.5 h-3.5" />
                {check.fixSnippet ? L(lang, 'Get the code', 'خذ الكود') : L(lang, 'Fix details', 'تفاصيل الإصلاح')}
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function serpTitle(title: string | null, fallback: string) {
  const t = title || fallback;
  return t.length > 60 ? `${t.slice(0, 57).trim()}…` : t;
}

function serpDesc(desc: string | null) {
  if (!desc) return null;
  return desc.length > 158 ? `${desc.slice(0, 155).trim()}…` : desc;
}

export interface AuditReportViewProps {
  report: AuditReport;
  lang: Lang;
  onNewAudit?: () => void;
  onShare?: () => void;
  focus?: 'full' | 'ai';
}

export default function AuditReportView({ report, lang, onNewAudit, onShare, focus = 'full' }: AuditReportViewProps) {
  const [fixCheck, setFixCheck] = useState<AuditCheck | null>(null);
  const [filter, setFilter] = useState<Filter>('issues');
  const [showTraining, setShowTraining] = useState(false);

  const byCategory = useMemo(() => {
    const visible = report.checks.filter((c) => {
      if (filter === 'issues') return c.status === 'fail' || c.status === 'warn';
      if (filter === 'pass') return c.status === 'pass';
      if (filter === 'na') return c.status === 'not_assessed' || c.status === 'info';
      return true;
    });
    const order = { fail: 0, warn: 1, not_assessed: 2, info: 3, pass: 4 } as const;
    return CATEGORIES.map((cat) => ({
      ...cat,
      checks: visible.filter((c) => c.category === cat.id).sort((a, b) => order[a.status] - order[b.status] || b.weight - a.weight),
    }));
  }, [report.checks, filter]);

  const host = (() => {
    try {
      return new URL(report.finalUrl || report.url).host;
    } catch {
      return report.url;
    }
  })();

  const failed = report.failure;
  const { counts, summary } = report;
  const redirected = report.finalUrl && report.finalUrl !== report.url && summary.redirects.length > 0;
  const matrix = report.botMatrix.filter((b) => showTraining || b.purpose !== 'training');
  const trainingCount = report.botMatrix.filter((b) => b.purpose === 'training').length;

  const header = (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-5 gap-4">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
          <span className="uppercase font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-cyan-300">#{report.id}</span>
          <span className="text-slate-400">{report.engineVersion}</span>
          <span className="text-slate-500">{new Date(report.timestamp).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white break-all">{report.finalUrl || report.url}</h2>
        {redirected && (
          <p className="text-[11px] text-slate-400 break-all">
            {L(lang, 'Requested', 'المطلوب')}: {report.url} → {count(lang, summary.redirects.length, ['redirect', 'redirects'], ['تحويل واحد', 'تحويلان', 'تحويلات', 'تحويلاً'])}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap print:hidden">
        {onNewAudit && (
          <button type="button" onClick={onNewAudit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-bold text-cyan-300">
            <Search className="w-3.5 h-3.5" /> {L(lang, 'Audit another URL', 'افحص رابطاً آخر')}
          </button>
        )}
        {onShare && !failed && (
          <button type="button" onClick={onShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" /> {L(lang, 'Share', 'مشاركة')}
          </button>
        )}
        {!failed && (
          <button type="button" onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Printer className="w-3.5 h-3.5" /> {L(lang, 'Save as PDF', 'حفظ PDF')}
          </button>
        )}
      </div>
    </div>
  );

  if (failed) {
    const tips: Record<string, [string, string]> = {
      bot_protection: ['Your firewall/CDN blocked our server. If real crawlers are allow-listed this may be fine — but many sites block search and AI bots this way without knowing. Check Cloudflare/WAF bot settings, then try again.', 'الجدار الناري أو الـ CDN حجب سيرفرنا. إذا كانت الزواحف الحقيقية مسموحاً لها فقد يكون ذلك مقبولاً — لكن مواقع كثيرة تحجب بوتات البحث والذكاء الاصطناعي بهذه الطريقة دون أن تعرف. راجع إعدادات البوتات في Cloudflare أو الجدار الناري ثم أعد المحاولة.'],
      rate_limited: ['Wait a few minutes and try again.', 'انتظر بضع دقائق وحاول مرة أخرى.'],
      blocked_url: ['Enter a public URL such as https://example.com/.', 'أدخل رابطاً عاماً مثل https://example.com/.'],
    };
    const tip = tips[failed.code];
    return (
      <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#12121a] via-[#0c0c12] to-[#07070a] p-6 sm:p-8 shadow-2xl space-y-6">
        {header}
        <div className="p-6 rounded-2xl border border-amber-500/40 bg-amber-950/20 text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-amber-300 mx-auto" />
          <p className="text-base font-bold text-amber-100">{L(lang, 'The audit did not complete — no score is shown.', 'الفحص لم يكتمل — لا تظهر أي درجة.')}</p>
          <p className="text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto">{L(lang, failed.message, failed.messageAr)}</p>
          {tip && <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">{L(lang, tip[0], tip[1])}</p>}
          {summary.status !== null && <p className="text-[11px] font-mono text-slate-500">HTTP {summary.status}</p>}
        </div>
      </div>
    );
  }

  const overall = report.overallScore as number;
  const tone = scoreTone(overall);

  const aiSection = (
    <section className="rounded-3xl border border-indigo-500/25 bg-[#0b0b14] p-5 sm:p-7 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300">
            <Bot className="w-4 h-4" /> {L(lang, 'AI crawler access', 'وصول زواحف الذكاء الاصطناعي')}
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">{L(lang, 'Who can read this page?', 'من يستطيع قراءة هذه الصفحة؟')}</h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            {L(lang,
              'robots.txt verdicts follow RFC 9309 (most specific group, longest rule). The live column is a request we sent with each crawler\'s published user-agent — real crawler IPs can be treated differently.',
              'أحكام robots.txt تتبع RFC 9309 (المجموعة الأكثر تحديداً وأطول قاعدة). عمود الاختبار الحي طلب أرسلناه بوكيل كل زاحف المنشور — عناوين IP الحقيقية للزواحف قد تُعامل بشكل مختلف.')}
          </p>
        </div>
        {trainingCount > 0 && (
          <button type="button" onClick={() => setShowTraining(!showTraining)} className="text-[11px] font-semibold text-indigo-300 hover:text-white underline-offset-2 hover:underline shrink-0 print:hidden">
            {showTraining ? L(lang, 'Hide training crawlers', 'إخفاء زواحف التدريب') : L(lang, `Show training crawlers (${trainingCount})`, `عرض زواحف التدريب (${trainingCount})`)}
          </button>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left rtl:text-right min-w-[560px]">
          <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-2 px-3 font-semibold">{L(lang, 'Crawler', 'الزاحف')}</th>
              <th className="py-2 px-3 font-semibold">{L(lang, 'Purpose', 'الغرض')}</th>
              <th className="py-2 px-3 font-semibold">robots.txt</th>
              <th className="py-2 px-3 font-semibold">{L(lang, 'Live request', 'اختبار حي')}</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <BotRow key={row.id} row={row} lang={lang} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-500">
        {L(lang, 'Blocking training crawlers is a business choice and is not penalised. * = succeeded after one retry.', 'حظر زواحف التدريب قرار تجاري ولا يُخصم منه. * = نجح بعد إعادة محاولة واحدة.')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#08080d] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Eye className="w-4 h-4 text-cyan-400" /> {L(lang, 'What a non-JavaScript crawler reads first', 'ما يقرؤه الزاحف بدون جافاسكربت أولاً')}
          </div>
          {summary.aiVisibleText ? (
            <p dir="auto" className="text-[12px] text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line text-start">{summary.aiVisibleText}{summary.aiVisibleText.length >= 900 ? '…' : ''}</p>
          ) : (
            <p className="text-[12px] text-rose-300">{L(lang, 'No readable text in the server HTML.', 'لا يوجد نص مقروء في HTML السيرفر.')}</p>
          )}
          <p className="text-[10px] text-slate-500">{count(lang, summary.wordCount || 0, ['word', 'words'], ['كلمة واحدة', 'كلمتان', 'كلمات', 'كلمة'])} {L(lang, 'in the raw HTML', 'في HTML الخام')}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#08080d] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Globe className="w-4 h-4 text-indigo-400" /> {L(lang, 'Search result preview (from your tags)', 'معاينة نتيجة البحث (من وسومك)')}
          </div>
          <div className="p-3.5 rounded-xl bg-white text-left" dir="ltr">
            <div className="text-[12px] text-[#202124] truncate">{summary.siteName || host}</div>
            <div className="text-[11px] text-[#4d5156] truncate">{report.finalUrl || report.url}</div>
            <div className="text-[17px] leading-snug text-[#1a0dab] mt-1">{serpTitle(summary.title, host)}</div>
            <div className="text-[13px] text-[#4d5156] leading-snug mt-0.5">
              {serpDesc(summary.metaDescription) || <span className="italic text-[#9aa0a6]">{L(lang, 'No meta description — Google will pick text from the page.', 'لا يوجد وصف — سيختار جوجل نصاً من الصفحة.')}</span>}
            </div>
          </div>
          <p className="text-[10px] text-slate-500">{L(lang, 'Approximate: Google may rewrite titles and snippets.', 'تقريبي: جوجل قد يعيد كتابة العنوان والمقتطف.')}</p>
        </div>
      </div>
    </section>
  );

  const issues = report.allIssues;
  const topFixes = report.criticalBlockers;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#12121a] via-[#0c0c12] to-[#07070a] p-5 sm:p-8 shadow-2xl space-y-6">
        {header}

        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-mono font-bold">
          <span className="px-2.5 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300">{count(lang, counts.fail, ['failed check', 'failed checks'], ['فحص فاشل', 'فحصان فاشلان', 'فحوص فاشلة', 'فحصاً فاشلاً'])}</span>
          <span className="px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">{count(lang, counts.warn, ['warning', 'warnings'], ['تحذير واحد', 'تحذيران', 'تحذيرات', 'تحذيراً'])}</span>
          <span className="px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">{count(lang, counts.pass, ['check passed', 'checks passed'], ['فحص ناجح', 'فحصان ناجحان', 'فحوص ناجحة', 'فحصاً ناجحاً'])}</span>
          {counts.notAssessed > 0 && (
            <span className="px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-slate-300">{counts.notAssessed} {L(lang, 'not assessed', 'غير مُقيَّم')}</span>
          )}
          {counts.critical > 0 && (
            <span className="px-2.5 py-1 rounded-full border border-rose-500/50 bg-rose-600/20 text-rose-200">{count(lang, counts.critical, ['critical blocker', 'critical blockers'], ['عائق حرج', 'عائقان حرجان', 'عوائق حرجة', 'عائقاً حرجاً'])}</span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl border border-white/10 bg-[#09090e]/80 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{L(lang, 'Overall readiness', 'الجاهزية الكلية')}</span>
            <ScoreRing score={overall} />
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tone.chip}`}>{verdictLabel(overall, lang)}</span>
            {report.scoreCap && (
              <p className="text-[11px] text-amber-200 bg-amber-950/30 border border-amber-500/30 rounded-lg p-2 leading-relaxed">
                {L(lang, report.scoreCap.reason, report.scoreCap.reasonAr)} {L(lang, `Uncapped: ${report.uncappedScore}.`, `بدون الحد: ${report.uncappedScore}.`)}
              </p>
            )}
            <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs">
              {L(lang,
                'Measures on-page readiness from evidence we fetched. It does not measure backlinks, authority or rankings.',
                'يقيس جاهزية الصفحة من الأدلة التي جلبناها. لا يقيس الروابط الخلفية أو السلطة أو الترتيب.')}
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat, i) => {
              const score = report.categoryScores[cat.key];
              const t = scoreTone(score);
              return (
                <a key={cat.id} href={`#cat-${cat.id}`} onClick={() => setFilter('all')} className={`p-4 rounded-xl border space-y-2 transition hover:border-indigo-400/40 ${i === 0 ? 'sm:col-span-2 border-indigo-500/25 bg-indigo-950/20' : 'border-white/10 bg-[#0d0d14]'}`}>
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className={`font-bold flex items-center gap-1.5 ${i === 0 ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {i === 0 && <Cpu className="w-4 h-4 text-cyan-400" />}
                      {L(lang, cat.en, cat.ar)}
                    </span>
                    <span className={`font-mono font-bold ${t.text}`}>{score === null ? L(lang, 'Not assessed', 'غير مُقيَّم') : `${score}/100`}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className={`${t.bar} h-full rounded-full transition-all duration-700`} style={{ width: `${score ?? 0}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{L(lang, cat.descEn, cat.descAr)}</p>
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <Stat label={L(lang, 'HTTP status', 'حالة HTTP')} value={summary.status === null ? '—' : String(summary.status)} tone={summary.status === 200 ? 'text-emerald-300' : 'text-amber-300'} />
          <Stat label={L(lang, 'Server response (TTFB)', 'زمن الاستجابة')} value={summary.ttfbMs === null ? '—' : `${summary.ttfbMs} ms`} tone={summary.ttfbMs !== null && summary.ttfbMs <= 800 ? 'text-emerald-300' : 'text-amber-300'} />
          <Stat label={L(lang, 'HTML size', 'حجم HTML')} value={formatBytes(summary.htmlBytes)} />
          <Stat label={L(lang, 'Compression', 'الضغط')} value={summary.compression || L(lang, 'none', 'لا يوجد')} tone={summary.compression ? 'text-emerald-300' : 'text-amber-300'} />
          <Stat label={L(lang, 'Words in HTML', 'كلمات في HTML')} value={summary.wordCount === null ? '—' : String(summary.wordCount)} />
          <Stat label={L(lang, 'Platform', 'المنصة')} value={summary.platform.join(', ') || L(lang, 'not detected', 'غير محدد')} />
        </div>
        {summary.uaMode === 'browser-fallback' && (
          <p className="text-[11px] text-amber-200 bg-amber-950/20 border border-amber-500/30 rounded-lg p-2.5">
            {L(lang,
              'Note: the site refused our crawler user-agent and only answered a browser user-agent. Crawlers that identify themselves honestly may be blocked too.',
              'ملاحظة: الموقع رفض وكيل الزاحف الخاص بنا ولم يستجب إلا لوكيل متصفح. الزواحف التي تعرّف نفسها بصدق قد تُحجب أيضاً.')}
          </p>
        )}
      </div>

      {focus === 'ai' && aiSection}

      {topFixes.length > 0 && (
        <section className="space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
              <AlertTriangle className="w-4 h-4" /> {L(lang, 'Fix these first', 'أصلح هذه أولاً')}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">{L(lang, 'Highest-impact fixes', 'الإصلاحات الأعلى تأثيراً')}</h3>
            <p className="text-xs text-slate-400">{L(lang, 'Ranked by severity × status. Each one links to the exact evidence and a copy-paste fix.', 'مرتبة حسب الخطورة والحالة. كل واحدة مرتبطة بالدليل الدقيق وإصلاح جاهز للنسخ.')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topFixes.map((issue) => {
              const check = report.checks.find((c) => c.id === issue.id) as AuditCheck;
              return (
                <div key={issue.id} className={`rounded-2xl border p-5 space-y-3 flex flex-col justify-between ${issue.status === 'fail' ? 'border-rose-500/30 bg-[#0f0b12]' : 'border-amber-500/30 bg-[#0f0d0b]'}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <StatusPill status={issue.status} lang={lang} />
                      <span className="text-[10px] font-mono uppercase text-slate-400">{issue.severity}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug">{L(lang, issue.title, issue.titleAr)}</h4>
                    <p className="text-[12px] text-slate-300 leading-relaxed">{L(lang, issue.signalDetected, issue.signalDetectedAr)}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{L(lang, issue.whyItMatters, issue.whyItMattersAr)}</p>
                  </div>
                  <button type="button" onClick={() => setFixCheck(check)} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs print:hidden">
                    <Wrench className="w-3.5 h-3.5" /> {issue.fixSnippet ? L(lang, 'Show the fix code', 'اعرض كود الإصلاح') : L(lang, 'How to fix', 'طريقة الإصلاح')}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {focus !== 'ai' && aiSection}

      <section className="rounded-3xl border border-white/10 bg-[#0b0b12] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <FileCode2 className="w-4 h-4" /> {L(lang, 'Every check, with evidence', 'كل الفحوص مع الأدلة')}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {L(lang, `${report.checks.length} checks run on this page`, `${report.checks.length} فحصاً على هذه الصفحة`)}
            </h3>
            <p className="text-xs text-slate-400">{L(lang, '“Not assessed” and “Info” items carry no weight in the score.', 'عناصر "غير مُقيَّم" و"معلومة" لا تؤثر على الدرجة.')}</p>
          </div>
          <div className="flex items-center p-1 rounded-xl bg-[#14141e] border border-white/10 w-fit text-xs font-bold print:hidden" role="tablist">
            {([
              ['issues', L(lang, `Issues (${issues.length})`, `المشاكل (${issues.length})`)],
              ['all', L(lang, 'All', 'الكل')],
              ['pass', L(lang, `Passed (${counts.pass})`, `ناجح (${counts.pass})`)],
              ['na', L(lang, `Info / N/A (${counts.info + counts.notAssessed})`, `معلومات (${counts.info + counts.notAssessed})`)],
            ] as [Filter, string][]).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={filter === id} onClick={() => setFilter(id)} className={`px-3 py-1.5 rounded-lg transition ${filter === id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {byCategory.map((cat) => {
            const score = report.categoryScores[cat.key];
            return (
              <div key={cat.id} id={`cat-${cat.id}`} className="space-y-2 scroll-mt-24">
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5">
                  <h4 className="text-sm font-bold text-white">{L(lang, cat.en, cat.ar)}</h4>
                  <span className={`font-mono text-xs font-bold ${scoreTone(score).text}`}>{score === null ? L(lang, 'Not assessed', 'غير مُقيَّم') : `${score}/100`}</span>
                </div>
                {cat.checks.length === 0 ? (
                  <p className="text-[12px] text-slate-500 py-1">{filter === 'issues' ? L(lang, 'No issues in this category.', 'لا توجد مشاكل في هذا القسم.') : L(lang, 'Nothing to show for this filter.', 'لا شيء لعرضه بهذا الفلتر.')}</p>
                ) : (
                  <ul className="space-y-1.5">
                    {cat.checks.map((check) => (
                      <CheckRow key={check.id} check={check} lang={lang} onFix={setFixCheck} />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {report.aiOpportunities.length > 0 && (
        <section className="rounded-3xl border border-indigo-500/30 bg-[#0d0d16] p-5 sm:p-7 space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="w-4 h-4" /> {L(lang, 'Answer coverage', 'تغطية الإجابات')}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">{L(lang, 'Questions people ask AI about you', 'أسئلة يسألها الناس للذكاء الاصطناعي عنك')}</h3>
            <p className="text-xs text-slate-400">{L(lang, 'Judged only from the content and markup on this page.', 'تقييم مبني فقط على محتوى ووسوم هذه الصفحة.')}</p>
          </div>
          <div className="space-y-2">
            {report.aiOpportunities.map((opp) => (
              <div key={opp.query} className="p-3.5 rounded-xl border border-white/10 bg-[#08080d] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <span className="font-bold text-[13px] text-white block">“{L(lang, opp.query, opp.queryAr)}”</span>
                  <p className="text-[12px] text-slate-400">{L(lang, opp.reason, opp.reasonAr)}</p>
                </div>
                <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 w-fit ${
                  opp.status === 'covered' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : opp.status === 'partially_covered' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {opp.status === 'covered' ? L(lang, 'Covered', 'مغطى') : opp.status === 'partially_covered' ? L(lang, 'Partial', 'جزئي') : L(lang, 'Missing', 'غير مغطى')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-[11px] text-slate-500 flex items-start gap-1.5 leading-relaxed">
        <Gauge className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        {L(lang,
          'Scoring: each check is weighted by severity (critical 5, high 3, medium 2, low 1); pass = full credit, warning = half, fail = none. Categories are averaged (AI readiness 25%, technical, crawlability and content 20% each, entity 15%). Pages that are noindex or block Googlebot are capped at 40; pages with almost no server-rendered text are capped at 50.',
          'طريقة الحساب: كل فحص له وزن حسب خطورته (حرج 5، عالٍ 3، متوسط 2، منخفض 1)؛ الناجح يأخذ الوزن كاملاً، التحذير نصفه، الفشل صفر. الأقسام تُجمع بأوزان (جاهزية الذكاء الاصطناعي 25%، التقني والزحف والمحتوى 20% لكل منها، الكيان 15%). الصفحات بـ noindex أو التي تمنع Googlebot محدودة بـ 40، والصفحات شبه الخالية من النص في HTML محدودة بـ 50.')}
      </p>

      <FixModal check={fixCheck} lang={lang} onClose={() => setFixCheck(null)} />
    </div>
  );
}
