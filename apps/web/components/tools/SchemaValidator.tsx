'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Globe, Info, Loader2, XCircle } from 'lucide-react';
import { validateJsonLd, type LintIssue } from '@schemacraft/audit-core/tools/jsonldValidator';
import { useUiLang } from '@/components/UiLangProvider';
import { fetchAuditPayload, normalizeAuditUrl } from '@schemacraft/audit-core/audit/client';

const SAMPLES: Record<string, string> = {
  Product: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Trail Running Shoe',
    image: 'https://shop.test/images/trail-shoe.jpg',
    description: 'Lightweight trail running shoe with a grippy outsole.',
    brand: { '@type': 'Brand', name: 'Acme' },
    sku: 'TRS-01',
    offers: { '@type': 'Offer', price: '89.00', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
  }, null, 2),
  'With errors': JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', name: 'Your Company', url: '/about' },
      { '@type': 'Article', headline: 'Spring sale', datePublished: '19/10/2026' },
      { '@type': 'Product', name: 'Shoe', offers: { '@type': 'Offer', price: '$1,299' } },
    ],
  }, null, 2),
};

const LEVEL = {
  error: { icon: XCircle, cls: 'text-rose-300 border-rose-500/30 bg-rose-950/20', en: 'Error', ar: 'خطأ' },
  warning: { icon: AlertTriangle, cls: 'text-amber-300 border-amber-500/30 bg-amber-950/20', en: 'Warning', ar: 'تحذير' },
  note: { icon: Info, cls: 'text-sky-300 border-sky-500/30 bg-sky-950/20', en: 'Note', ar: 'ملاحظة' },
} as const;

export default function SchemaValidator({ lang: pageLang = 'en' }: { lang?: 'en' | 'ar' }) {
  const lang = useUiLang(pageLang);
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  const [mode, setMode] = useState<'code' | 'url'>('code');
  const [code, setCode] = useState(SAMPLES.Product);
  const [url, setUrl] = useState('');
  const [fetched, setFetched] = useState<{ url: string; html: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const source = mode === 'url' ? fetched?.html ?? '' : code;
  const result = useMemo(() => validateJsonLd(source), [source]);
  const ready = mode === 'code' ? code.trim().length > 0 : fetched !== null;

  const runUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = normalizeAuditUrl(url);
    if (!target) {
      setFetchError(t('Enter a valid public URL, e.g. https://example.com/page', 'أدخل رابطاً عاماً صحيحاً مثل https://example.com/page'));
      return;
    }
    setLoading(true);
    setFetchError(null);
    setFetched(null);
    const payload = await fetchAuditPayload(target);
    setLoading(false);
    if (!payload || payload.ok === false || !payload.html) {
      setFetchError(
        payload?.error === 'rate_limited'
          ? t('Too many requests. Try again in a few minutes.', 'طلبات كثيرة. حاول بعد دقائق.')
          : t(`Could not fetch the page${payload?.status ? ` (HTTP ${payload.status})` : ''}. Paste the page source instead.`, `تعذّر جلب الصفحة${payload?.status ? ` (HTTP ${payload.status})` : ''}. الصق كود الصفحة بدلاً من ذلك.`),
      );
      return;
    }
    setFetched({ url: payload.finalUrl || target, html: payload.html });
  };

  const grouped = (['error', 'warning', 'note'] as const).map((level) => ({ level, items: result.issues.filter((i) => i.level === level) }));

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b0b12] p-4 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex p-1 rounded-xl bg-black/50 border border-white/10" role="tablist">
          {(['code', 'url'] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${mode === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {m === 'code' ? t('Paste code', 'لصق الكود') : t('Fetch a URL', 'جلب رابط')}
            </button>
          ))}
        </div>
        {mode === 'code' && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {t('Samples:', 'أمثلة:')}
            {Object.keys(SAMPLES).map((k) => (
              <button key={k} type="button" onClick={() => setCode(SAMPLES[k])} className="px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200">{k}</button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          {mode === 'code' ? (
            <>
              <label htmlFor="jsonld-input" className="text-xs font-semibold text-slate-300">
                {t('JSON-LD, <script> tags or full page HTML', 'كود JSON-LD أو وسوم <script> أو HTML الصفحة كاملة')}
              </label>
              <textarea id="jsonld-input" dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} rows={18}
                className="w-full min-h-[360px] p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-100 focus:outline-none focus:border-indigo-500/60 resize-y leading-relaxed" />
            </>
          ) : (
            <form onSubmit={runUrl} className="space-y-3">
              <label htmlFor="validator-url" className="text-xs font-semibold text-slate-300">{t('Page URL', 'رابط الصفحة')}</label>
              <div className="flex gap-2" dir="ltr">
                <input id="validator-url" type="text" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yoursite.com/product/..."
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500/60" />
                <button type="submit" disabled={loading} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-sm font-bold text-white inline-flex items-center gap-1.5">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  {t('Validate', 'افحص')}
                </button>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                {t('We read the raw HTML the server returns — the same thing non-JavaScript crawlers see. Schema injected only by JavaScript will not appear here.', 'نقرأ HTML الخام الذي يرجعه السيرفر — نفس ما تراه الزواحف التي لا تشغّل الجافاسكربت. السكيما التي تُحقن بالجافاسكربت فقط لن تظهر هنا.')}
              </p>
              {fetchError && <p className="text-sm text-rose-300">{fetchError}</p>}
              {fetched && <p className="text-xs text-emerald-300 break-all">{t('Fetched', 'تم الجلب')}: {fetched.url}</p>}
            </form>
          )}
        </div>

        <div className="space-y-3" aria-live="polite">
          {!ready ? (
            <p className="text-sm text-slate-400 p-4 rounded-2xl border border-white/10 bg-black/30">{t('Results appear here.', 'النتائج تظهر هنا.')}</p>
          ) : result.blocks === 0 ? (
            <p className="text-sm text-amber-200 p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20">
              {t('No JSON-LD found. Paste the JSON object or the <script type="application/ld+json"> tag.', 'لم نجد JSON-LD. الصق كائن JSON أو وسم <script type="application/ld+json">.')}
            </p>
          ) : (
            <>
              <div className={`p-4 rounded-2xl border ${result.counts.error > 0 ? 'border-rose-500/30 bg-rose-950/20' : 'border-emerald-500/30 bg-emerald-950/20'}`}>
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  {result.counts.error > 0 ? <XCircle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {result.counts.error > 0
                    ? t(`${result.counts.error} error${result.counts.error === 1 ? '' : 's'} to fix`, `${result.counts.error} ${result.counts.error === 1 ? 'خطأ' : 'أخطاء'} يجب إصلاحها`)
                    : t('No errors — valid for the checked types', 'لا أخطاء — صالح للأنواع التي تم فحصها')}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {t(`${result.blocks} block${result.blocks === 1 ? '' : 's'} · ${result.nodes.length} item${result.nodes.length === 1 ? '' : 's'} · ${result.counts.warning} warning${result.counts.warning === 1 ? '' : 's'}`,
                    `${result.blocks} كتلة · ${result.nodes.length} عنصر · ${result.counts.warning} تحذير`)}
                </p>
                {result.types.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5" dir="ltr">
                    {result.types.map((type) => <span key={type} className="px-2 py-0.5 rounded-md bg-white/10 text-[11px] font-mono text-cyan-200">{type}</span>)}
                  </div>
                )}
              </div>

              {result.parseErrors.map((err, i) => (
                <Issue key={`p${i}`} issue={{ level: 'error', type: 'JSON', property: t('syntax', 'الصياغة'), message: err }} lang={lang} />
              ))}
              {grouped.map(({ level, items }) => items.map((issue, i) => <Issue key={`${level}${i}`} issue={issue} lang={lang} />))}

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('Checked against Google’s documented required and recommended properties. Valid markup is eligible for rich results but Google does not guarantee them. Confirm with the ', 'مفحوص مقابل الخصائص المطلوبة والموصى بها في توثيق جوجل. الكود الصحيح مؤهل للنتائج الغنية لكن جوجل لا يضمن ظهورها. للتأكيد استخدم ')}
                <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Rich Results Test</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Issue({ issue, lang }: { issue: LintIssue; lang: 'en' | 'ar' }) {
  const meta = LEVEL[issue.level];
  const Icon = meta.icon;
  return (
    <div className={`p-3 rounded-xl border ${meta.cls}`}>
      <p className="flex items-center gap-2 text-xs font-bold">
        <Icon className="w-4 h-4 shrink-0" />
        <span>{lang === 'ar' ? meta.ar : meta.en}</span>
        <span className="font-mono text-slate-200" dir="ltr">{issue.type} → {issue.property}</span>
      </p>
      <p className="mt-1 text-[13px] text-slate-300 leading-relaxed" dir="ltr">{issue.message}</p>
    </div>
  );
}
