'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Circle, RotateCcw, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useUiLang } from '@/components/UiLangProvider';
import { normalizeAuditUrl } from '@/lib/audit/client';
import type { AuditReport } from '@/lib/audit/types';
import { L, type Lang } from './i18n';

const REPORT_KEY = 'sc-last-audit';

function recallAudit(url: string): AuditReport | null {
  try {
    const raw = sessionStorage.getItem(REPORT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { url?: string; report?: AuditReport };
    if (parsed.url === url && parsed.report?.engineVersion) return parsed.report;
  } catch {
    /* ignore broken storage */
  }
  return null;
}

function rememberAudit(url: string, report: AuditReport) {
  try {
    sessionStorage.setItem(REPORT_KEY, JSON.stringify({ url, report }));
  } catch {
    /* quota or private mode */
  }
}

const AuditReportView = dynamic(() => import('./AuditReportView'));
const ShareSnapshotModal = dynamic(() => import('@/components/ShareSnapshotModal'));

const STEPS: [string, string][] = [
  ['Fetching the page from our server (no JavaScript, like a crawler)', 'جلب الصفحة من سيرفرنا (بدون جافاسكربت، مثل الزاحف)'],
  ['Reading robots.txt, sitemap and llms.txt', 'قراءة robots.txt وخريطة الموقع وllms.txt'],
  ['Requesting the page as Googlebot, OAI-SearchBot, PerplexityBot…', 'طلب الصفحة بوكيل Googlebot وOAI-SearchBot وPerplexityBot…'],
  ['Parsing HTML, headings and JSON-LD', 'تحليل HTML والعناوين وJSON-LD'],
  ['Scoring checks from the evidence', 'حساب الفحوص من الأدلة'],
];
const STEP_AT_MS = [0, 1500, 3500, 7000, 10000];

export interface AuditRunnerProps {
  lang: Lang;
  focus?: 'full' | 'ai';
  examples?: string[];
  autoRunFromQuery?: boolean;
  inputId?: string;
}

export default function AuditRunner({ lang: pageLang, focus = 'full', examples = [], autoRunFromQuery = true, inputId = 'audit-url' }: AuditRunnerProps) {
  const lang = useUiLang(pageLang);
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const started = useRef(false);

  const start = useCallback(async (raw: string) => {
    const url = normalizeAuditUrl(raw);
    if (!url) {
      setInputError(L(lang, 'Enter a full domain or URL, e.g. example.com', 'أدخل نطاقاً أو رابطاً كاملاً، مثل example.com'));
      return;
    }
    setInputError(null);
    setInput(url);
    setRunning(true);
    const kept = recallAudit(url);
    if (!kept) setReport(null);
    setStep(0);
    const began = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - began;
      setStep(STEP_AT_MS.filter((t) => elapsed >= t).length - 1);
    }, 250);
    try {
      const { runAudit } = await import('@/lib/audit/engine');
      const result = await runAudit(url);
      setReport(result);
      rememberAudit(url, result);
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        params.set('url', url);
        window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
      }
      if (!kept) setTimeout(() => document.getElementById('audit-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    } finally {
      clearInterval(timer);
      setRunning(false);
    }
  }, [lang]);

  useEffect(() => {
    if (!autoRunFromQuery || started.current || typeof window === 'undefined') return;
    const q = new URLSearchParams(window.location.search).get('url');
    if (q) {
      started.current = true;
      const url = normalizeAuditUrl(q);
      if (url) {
        setInput(url);
        const kept = recallAudit(url);
        if (kept) setReport(kept);
      }
      start(q);
    }
  }, [autoRunFromQuery, start]);

  const reset = () => {
    setReport(null);
    setInput('');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
      try { sessionStorage.removeItem(REPORT_KEY); } catch { /* ignore */ }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => (document.getElementById(inputId) as HTMLInputElement | null)?.focus(), 350);
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!running) start(input);
        }}
        className="max-w-2xl mx-auto"
        role="search"
      >
        <label htmlFor={inputId} className="sr-only">{L(lang, 'Website URL to audit', 'رابط الموقع المراد فحصه')}</label>
        <div className="relative flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-[#0c0c14]/90 border border-white/15 shadow-2xl glow-focus-box backdrop-blur-xl">
          <div className="relative flex items-center w-full ps-3">
            <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden />
            <input
              id={inputId}
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              dir="ltr"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="yourwebsite.com"
              className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
              disabled={running}
            />
          </div>
          <button type="submit" disabled={running} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 active:scale-95 transition shrink-0 disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap">
            {running ? <RotateCcw className="w-4 h-4 animate-spin" /> : null}
            {running ? L(lang, 'Auditing…', 'جاري الفحص…') : focus === 'ai' ? L(lang, 'Check AI access', 'افحص وصول الذكاء الاصطناعي') : L(lang, 'Run free audit', 'افحص مجاناً')}
          </button>
        </div>
        {inputError && <p className="text-xs text-rose-300 mt-2 text-center">{inputError}</p>}
        {examples.length > 0 && !running && (
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 mt-3 text-[11px]">
            <span className="text-slate-500 me-1">{L(lang, 'Try a real site:', 'جرّب موقعاً حقيقياً:')}</span>
            {examples.map((ex) => (
              <button key={ex} type="button" onClick={() => start(ex)} className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono" dir="ltr">
                {ex}
              </button>
            ))}
          </div>
        )}
      </form>

      {running && !report && (
        <section className="max-w-2xl mx-auto p-5 sm:p-6 rounded-2xl border border-indigo-500/40 bg-[#0d0d16] space-y-4 shadow-2xl" aria-live="polite">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-cyan-300 flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" /> {L(lang, 'Live audit in progress', 'الفحص الحي جارٍ')}
            </span>
            <span className="text-slate-400 font-mono normal-case" dir="ltr">{input.replace(/^https?:\/\//, '')}</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="animate-shimmer h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(92, 18 + step * 18)}%` }} />
          </div>
          <ol className="text-xs text-slate-300 space-y-1.5">
            {STEPS.map(([en, ar], i) => (
              <li key={en} className={`flex items-center gap-2 ${i < step ? 'text-emerald-300' : i === step ? 'text-white font-semibold' : 'text-slate-500'}`}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : i === step ? <RotateCcw className="w-3.5 h-3.5 shrink-0 animate-spin" /> : <Circle className="w-3.5 h-3.5 shrink-0" />}
                {L(lang, en, ar)}
              </li>
            ))}
          </ol>
          <p className="text-[10px] text-slate-500">{L(lang, 'Usually 5–20 seconds. Slow servers take longer.', 'عادةً 5–20 ثانية. السيرفرات البطيئة تأخذ وقتاً أطول.')}</p>
        </section>
      )}

      {report && (
        <div id="audit-results" className="scroll-mt-24 text-start">
          {running && <p className="text-center text-[11px] text-slate-400 mb-3">{L(lang, 'Refreshing this audit…', 'جاري تحديث نفس الفحص…')}</p>}
          <AuditReportView report={report} lang={lang} focus={focus} onNewAudit={reset} onShare={() => setSharing(true)} />
        </div>
      )}

      {sharing && report && <ShareSnapshotModal report={report} lang={lang} onClose={() => setSharing(false)} />}
    </div>
  );
}
