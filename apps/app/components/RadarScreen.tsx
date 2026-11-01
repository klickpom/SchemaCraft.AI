'use client';

import { useEffect, useMemo, useState } from 'react';
import { Globe, Plus, Trash2 } from 'lucide-react';
import { requestGoogleSignIn, requestMagicLink } from '@/lib/auth';
import { createEngines } from '@/lib/engines';
import { idFromEmail } from '@/lib/ids';
import { PLAN_LIMITS, RUNS_PER_PROMPT } from '@/lib/plans';
import { generateBuyerQuestions } from '@/lib/prompts';
import { hostOfCitedUrl, shareOfVoice, topCounts } from '@/lib/report';
import type { PromptRecord, SiteRecord, StoredCall } from '@/lib/repository';
import { runRadar } from '@/lib/runner';

type Lang = 'en' | 'ar';
interface User { id: string; email: string }
interface Snapshot { user: User | null; sites: SiteRecord[]; prompts: PromptRecord[]; calls: StoredCall[] }

const STORAGE_KEY = 'sc-radar-v1';
const emptySnapshot = (): Snapshot => ({ user: null, sites: [], prompts: [], calls: [] });

function t(lang: Lang, en: string, ar: string) {
  return lang === 'ar' ? ar : en;
}

function loadSnapshot(): Snapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptySnapshot(), ...JSON.parse(raw) } as Snapshot : emptySnapshot();
  } catch {
    return emptySnapshot();
  }
}

export function RadarScreen() {
  const [lang, setLang] = useState<Lang>('en');
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot);
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState<'sent' | 'dry-run' | 'google-off' | 'google-on' | 'templates' | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ domain: '', country: '', city: '', language: 'en', niche: '', brand: '', homepageText: '' });
  const [busy, setBusy] = useState(false);
  const [stopped, setStopped] = useState<'budget' | 'done' | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('sc-app-lang');
    if (savedLang === 'ar' || savedLang === 'en') setLang(savedLang);
    const data = loadSnapshot();
    setSnapshot(data);
    const ownSites = data.sites.filter((item) => item.userId === data.user?.id);
    if (ownSites.length === 1) setSiteId(ownSites[0].id);
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    if (url) {
      try {
        setDraft((current) => ({ ...current, domain: new URL(url).hostname.replace(/^www\./, '') }));
      } catch {
        setDraft((current) => ({ ...current, domain: url }));
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('sc-app-lang', lang);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [ready, lang, snapshot]);

  const user = snapshot.user;
  const sites = snapshot.sites.filter((site) => site.userId === user?.id);
  const site = sites.find((item) => item.id === siteId) ?? null;
  const prompts = snapshot.prompts.filter((prompt) => prompt.userId === user?.id && prompt.siteId === site?.id).sort((a, b) => a.position - b.position);
  const calls = snapshot.calls.filter((call) => call.userId === user?.id && call.siteId === site?.id);
  const report = useMemo(() => shareOfVoice(calls.map((call) => ({
    engine: call.engine,
    runIndex: call.runIndex,
    mentioned: call.brandMentioned || call.domainMentioned,
    competitors: call.competitors,
    citedUrls: call.citedUrls,
  }))), [calls]);
  const spent = calls.reduce((sum, call) => sum + call.costUsd, 0);
  const competitors = topCounts(calls.flatMap((call) => call.competitors));
  const domains = topCounts(calls.flatMap((call) => call.citedUrls.map(hostOfCitedUrl)).filter(Boolean));

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    const mode = await requestMagicLink(email);
    if (mode === 'sent') {
      setNotice('sent');
      return;
    }
    setSnapshot((current) => ({ ...current, user: { id: idFromEmail(email), email: email.trim().toLowerCase() } }));
    setNotice('dry-run');
  }

  async function google() {
    const mode = await requestGoogleSignIn();
    setNotice(mode === 'unconfigured' ? 'google-off' : 'google-on');
  }

  function saveSite(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    const next: SiteRecord = { id: crypto.randomUUID(), userId: user.id, ...draft };
    setSnapshot((current) => ({ ...current, sites: [...current.sites, next] }));
    setSiteId(next.id);
    setDraft({ domain: '', country: '', city: '', language: 'en', niche: '', brand: '', homepageText: '' });
  }

  function generate() {
    if (!user || !site) return;
    const drafts = generateBuyerQuestions(site).map((item, index) => ({
      id: crypto.randomUUID(),
      userId: user.id,
      siteId: site.id,
      body: item.body,
      locale: item.locale,
      position: index,
    }));
    setSnapshot((current) => ({ ...current, prompts: [...current.prompts.filter((prompt) => prompt.siteId !== site.id || prompt.userId !== user.id), ...drafts] }));
    setNotice('templates');
  }

  function updatePrompt(id: string, body: string) {
    setSnapshot((current) => ({ ...current, prompts: current.prompts.map((prompt) => prompt.id === id ? { ...prompt, body } : prompt) }));
  }

  function deletePrompt(id: string) {
    setSnapshot((current) => ({ ...current, prompts: current.prompts.filter((prompt) => prompt.id !== id).map((prompt, index) => prompt.siteId === site?.id ? { ...prompt, position: index } : prompt) }));
  }

  function addPrompt() {
    if (!user || !site) return;
    setSnapshot((current) => ({
      ...current,
      prompts: [...current.prompts, { id: crypto.randomUUID(), userId: user.id, siteId: site.id, body: '', locale: 'en', position: prompts.length }],
    }));
  }

  async function run() {
    if (!user || !site) return;
    setBusy(true);
    try {
      const result = await runRadar({
        prompts: prompts.map((prompt) => ({ id: prompt.id, body: prompt.body })),
        engines: createEngines(),
        maxPrompts: PLAN_LIMITS.free.maxPrompts,
        runsPerPrompt: RUNS_PER_PROMPT,
        budgetUsd: PLAN_LIMITS.free.monthlyBudgetUsd,
        spentUsd: calls.reduce((sum, call) => sum + call.costUsd, 0),
        brand: site.brand,
        domain: site.domain,
      });
      const stored: StoredCall[] = result.calls.map((call) => ({
        id: crypto.randomUUID(),
        userId: user.id,
        siteId: site.id,
        promptId: call.promptId,
        engine: call.engine,
        runIndex: call.runIndex,
        rawAnswer: call.rawAnswer,
        source: call.source,
        brandMentioned: call.mention.brandMentioned,
        domainMentioned: call.mention.domainMentioned,
        position: call.mention.position,
        sentiment: call.mention.sentiment,
        competitors: call.mention.competitors,
        citedUrls: call.mention.citedUrls,
        inputTokens: call.inputTokens,
        outputTokens: call.outputTokens,
        costUsd: call.costUsd,
      }));
      setSnapshot((current) => ({ ...current, calls: [...current.calls, ...stored] }));
      setStopped(result.stopped);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">SchemaCraft</p>
          <h1 className="text-2xl font-black text-white">{t(lang, 'AI answer radar', 'رادار الظهور في إجابات الذكاء الاصطناعي')}</h1>
        </div>
        <button type="button" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-bold text-slate-200">
          <Globe className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
          {lang === 'ar' ? 'EN' : 'عربي'}
        </button>
      </header>

      <p className="text-sm leading-relaxed text-slate-400">
        {t(lang, 'Without API keys, answers are recorded fixtures. They are not live ChatGPT or Perplexity replies, and they do not promise a mention or a ranking.', 'بدون مفاتيح API الإجابات عيّنات مسجّلة. ليست ردوداً حية من ChatGPT أو Perplexity، ولا تعد بذكر أو ترتيب.')}
      </p>
      {notice === 'sent' && <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{t(lang, 'Check your email for the sign-in link.', 'تفقد بريدك لفتح رابط الدخول.')}</p>}
      {notice === 'dry-run' && <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{t(lang, 'Dry-run: no email was sent. This sign-in stays in this browser only.', 'تشغيل تجريبي: لم يُرسل بريد. هذا الدخول يبقى في هذا المتصفح فقط.')}</p>}
      {notice === 'google-off' && <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{t(lang, 'Google sign-in is not assessed until Supabase is configured.', 'تسجيل Google غير مُقيَّم حتى يتم ربط Supabase.')}</p>}
      {notice === 'google-on' && <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{t(lang, 'Redirecting to Google.', 'جارٍ التحويل إلى Google.')}</p>}
      {notice === 'templates' && <p className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{t(lang, 'These 30 questions are templates filled from your niche, city, and homepage text. They are not model output.', 'هذه الأسئلة الثلاثون قوالب مُلئت من تخصصك ومدينتك ونص الصفحة. ليست ناتجة عن نموذج.')}</p>}

      {!user && (
        <form onSubmit={signIn} className="luxury-card space-y-3 rounded-3xl p-6">
          <label className="block text-sm font-semibold text-slate-200">
            {t(lang, 'Email', 'البريد')}
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">{t(lang, 'Email me a sign-in link', 'أرسل لي رابط الدخول')}</button>
            <button type="button" onClick={google} className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold">{t(lang, 'Continue with Google', 'المتابعة بحساب Google')}</button>
          </div>
        </form>
      )}

      {user && !site && (
        <form onSubmit={saveSite} className="luxury-card grid gap-3 rounded-3xl p-6 sm:grid-cols-2">
          <p className="sm:col-span-2 text-sm text-slate-300">{t(lang, `Signed in as ${user.email}`, `تم الدخول باسم ${user.email}`)}</p>
          {sites.length > 0 && (
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {sites.map((item) => (
                <button type="button" key={item.id} onClick={() => setSiteId(item.id)} className="rounded-lg border border-white/10 px-3 py-1 text-xs">{item.domain}</button>
              ))}
            </div>
          )}
          {([
            ['domain', 'Domain', 'النطاق'],
            ['country', 'Country', 'الدولة'],
            ['city', 'City', 'المدينة'],
            ['niche', 'Niche', 'التخصص'],
            ['brand', 'Brand', 'العلامة'],
          ] as const).map(([field, en, ar]) => (
            <label key={field} className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              {t(lang, en, ar)}
              <input required value={draft[field]} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm normal-case text-white" />
            </label>
          ))}
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t(lang, 'Language', 'اللغة')}
            <select value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value })} className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm normal-case text-white">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </label>
          <label className="sm:col-span-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t(lang, 'Homepage text', 'نص الصفحة الرئيسية')}
            <textarea required value={draft.homepageText} onChange={(event) => setDraft({ ...draft, homepageText: event.target.value })} rows={4} className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm normal-case text-white" />
          </label>
          <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">{t(lang, 'Save site', 'احفظ الموقع')}</button>
        </form>
      )}

      {user && site && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-white">{site.brand} · {site.city}</h2>
            <button type="button" onClick={() => setSiteId(null)} className="text-xs text-slate-400 underline">{t(lang, 'All sites', 'كل المواقع')}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={generate} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">{t(lang, 'Generate 30 buyer questions', 'ولّد 30 سؤال مشتري')}</button>
            <button type="button" onClick={addPrompt} className="inline-flex items-center gap-1 rounded-xl border border-white/15 px-4 py-2 text-sm"><Plus className="h-4 w-4" />{t(lang, 'Add', 'أضف')}</button>
            <button type="button" disabled={busy || prompts.length === 0} onClick={run} className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-100 disabled:opacity-50">
              {busy ? t(lang, 'Running…', 'جارٍ التشغيل…') : t(lang, 'Run the free radar (first 3)', 'شغّل الرادار المجاني (أول 3)')}
            </button>
          </div>
          <p className="text-xs text-slate-500">{t(lang, 'Free plan: 3 questions, OpenAI web search and Perplexity Sonar, 3 runs each. The run stops when the monthly budget is spent.', 'الخطة المجانية: 3 أسئلة، بحث OpenAI وPerplexity Sonar، 3 مرات لكل سؤال. يتوقف التشغيل عند استهلاك الميزانية الشهرية.')}</p>
          {prompts.map((prompt) => (
            <div key={prompt.id} className="luxury-card flex gap-2 rounded-2xl p-3">
              <div className="flex-1 space-y-1">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">{prompt.locale}</p>
                <textarea value={prompt.body} onChange={(event) => updatePrompt(prompt.id, event.target.value)} rows={2} className="w-full rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-sm" />
              </div>
              <button type="button" onClick={() => deletePrompt(prompt.id)} aria-label={t(lang, 'Delete question', 'احذف السؤال')} className="text-slate-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {stopped === 'budget' && <p className="text-sm text-amber-200">{t(lang, 'Stopped: the monthly budget was reached. No further engine calls were made.', 'توقف التشغيل: بلغت الميزانية الشهرية. لم تُرسل طلبات إضافية.')}</p>}
          {report.length > 0 && (
            <div className="luxury-card space-y-3 rounded-3xl p-6">
              <h3 className="font-black text-white">{t(lang, 'Share of voice', 'حصة الظهور')}</h3>
              {report.map((row) => (
                <p key={row.engine} className="text-sm text-slate-200">
                  <span dir="ltr">{row.engine}: {row.shareOfVoice === null ? t(lang, 'not assessed', 'غير مُقيَّم') : `${row.shareOfVoice}%`}</span>
                  {row.min !== null && row.max !== null ? ` (${t(lang, 'range', 'المدى')} ${row.min}–${row.max}%)` : ''}
                </p>
              ))}
              <p className="text-xs text-slate-400">
                {t(
                  lang,
                  `Estimated spend $${spent.toFixed(2)} of $${PLAN_LIMITS.free.monthlyBudgetUsd.toFixed(2)}. Dry-run uses a fixture price. This is not an invoice.`,
                  `إنفاق تقديري $${spent.toFixed(2)} من $${PLAN_LIMITS.free.monthlyBudgetUsd.toFixed(2)}. التشغيل التجريبي يستخدم سعر عيّنة. هذا ليس فاتورة.`,
                )}
              </p>
              <h3 className="font-black text-white">{t(lang, 'Top competitors', 'أبرز المنافسين')}</h3>
              <ul className="text-sm text-slate-300">{competitors.map((item) => <li key={item.name}>{item.name} · {item.count}</li>)}</ul>
              <h3 className="font-black text-white">{t(lang, 'Top cited domains', 'أكثر النطاقات ذكراً')}</h3>
              <ul className="text-sm text-slate-300">{domains.map((item) => <li key={item.name}>{item.name} · {item.count}</li>)}</ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
