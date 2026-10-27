'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, Check, Copy, Download, Loader2, Plus, Trash2, Wand2 } from 'lucide-react';
import { buildLlmsTxt, draftSections, lintLlms, pageMeta, sitemapLocs, type LlmsDoc, type LlmsSection } from '@schemacraft/audit-core/tools/llmsBuilder';
import { useUiLang } from '@/components/UiLangProvider';
import { fetchAuditPayload, normalizeAuditUrl } from '@schemacraft/audit-core/audit/client';

const START: LlmsDoc = {
  name: 'Acme Running',
  summary: 'Acme Running sells trail and road running shoes online and ships to the EU and US.',
  details: 'Prices are in EUR. All shoes have a 60-day return window.',
  sections: [
    { name: 'Products', links: [{ title: 'Trail shoes', url: 'https://acme.example/trail/', note: 'Full trail range with sizes and prices' }] },
    { name: 'Help', links: [{ title: 'Shipping and returns', url: 'https://acme.example/shipping/', note: '' }] },
    { name: 'Optional', links: [{ title: 'Blog', url: 'https://acme.example/blog/', note: 'Training guides' }] },
  ],
};

const input = 'w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500/60';

export default function LlmsTxtBuilder({ lang: pageLang = 'en' }: { lang?: 'en' | 'ar' }) {
  const lang = useUiLang(pageLang);
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);
  const [doc, setDoc] = useState<LlmsDoc>(START);
  const [site, setSite] = useState('');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => buildLlmsTxt(doc), [doc]);
  const issues = useMemo(() => lintLlms(doc), [doc]);

  const setSection = (i: number, next: LlmsSection) => setDoc((d) => ({ ...d, sections: d.sections.map((s, k) => (k === i ? next : s)) }));

  const draft = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = normalizeAuditUrl(site);
    if (!url) {
      setNote(t('Enter your homepage URL.', 'أدخل رابط الصفحة الرئيسية.'));
      return;
    }
    setLoading(true);
    setNote(null);
    const payload = await fetchAuditPayload(new URL(url).origin + '/');
    setLoading(false);
    if (!payload || payload.ok === false || !payload.html) {
      setNote(payload?.error === 'rate_limited' ? t('Too many requests — try again in a few minutes.', 'طلبات كثيرة — حاول بعد دقائق.') : t('Could not fetch that site. Fill the fields manually.', 'تعذّر جلب الموقع. املأ الحقول يدوياً.'));
      return;
    }
    const meta = pageMeta(payload.html);
    const sitemap = payload.sitemapStatus === 200 && payload.sitemapXml ? sitemapLocs(payload.sitemapXml) : { isIndex: false, urls: [] };
    const urls = sitemap.isIndex ? [] : sitemap.urls;
    const sections = urls.length > 0 ? draftSections(urls) : [];
    setDoc({
      name: meta.siteName || meta.title?.split(/[|\-–—]/)[0].trim() || new URL(url).hostname,
      summary: meta.description || '',
      details: '',
      sections: sections.length > 0 ? sections : [{ name: 'Pages', links: [{ title: 'Home', url: new URL(url).origin + '/', note: '' }] }],
    });
    setNote(urls.length > 0
      ? t(`Draft built from ${Math.min(urls.length, 30)} sitemap URLs. Keep only pages that answer real questions, and add a short note to each.`, `تم بناء مسودة من ${Math.min(urls.length, 30)} رابط في خريطة الموقع. أبقِ فقط الصفحات التي تجيب عن أسئلة حقيقية وأضف وصفاً قصيراً لكل منها.`)
      : sitemap.isIndex
        ? t('Your sitemap is an index of other sitemaps — add your key pages manually.', 'خريطة موقعك فهرس لخرائط أخرى — أضف صفحاتك الأساسية يدوياً.')
        : t('No sitemap found — add your key pages manually.', 'لم نجد خريطة موقع — أضف صفحاتك الأساسية يدوياً.'));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([output], { type: 'text/markdown;charset=utf-8' }));
    a.download = 'llms.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b0b12] p-4 sm:p-6 space-y-6">
      <form onSubmit={draft} className="flex flex-col sm:flex-row gap-2" dir="ltr">
        <input value={site} onChange={(e) => setSite(e.target.value)} placeholder="yoursite.com" aria-label={t('Your site', 'موقعك')} className={`${input} flex-1`} />
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-sm font-bold text-white inline-flex items-center justify-center gap-1.5">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          {t('Draft from my sitemap', 'مسودة من خريطة موقعي')}
        </button>
      </form>
      {note && <p className="text-[13px] text-cyan-200 -mt-3">{note}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
            <span>{t('Site or project name (H1)', 'اسم الموقع أو المشروع (H1)')}</span>
            <input value={doc.name} onChange={(e) => setDoc({ ...doc, name: e.target.value })} className={input} />
          </label>
          <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
            <span>{t('One-sentence summary (blockquote)', 'ملخص في جملة واحدة (اقتباس)')}</span>
            <textarea value={doc.summary} onChange={(e) => setDoc({ ...doc, summary: e.target.value })} rows={2} className={`${input} resize-y`} />
          </label>
          <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
            <span>{t('Key facts (optional)', 'حقائق أساسية (اختياري)')}</span>
            <textarea value={doc.details} onChange={(e) => setDoc({ ...doc, details: e.target.value })} rows={2} className={`${input} resize-y`} />
          </label>

          {doc.sections.map((section, i) => (
            <fieldset key={i} className="p-3 rounded-2xl border border-white/10 bg-black/25 space-y-2">
              <div className="flex items-center gap-2">
                <input value={section.name} onChange={(e) => setSection(i, { ...section, name: e.target.value })} aria-label={t('Section name', 'اسم القسم')} className={`${input} font-bold`} />
                <button type="button" onClick={() => setDoc({ ...doc, sections: doc.sections.filter((_, k) => k !== i) })} aria-label={t('Remove section', 'حذف القسم')} className="p-2 rounded-lg text-slate-400 hover:text-rose-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {section.links.map((link, j) => {
                const setLink = (patch: Partial<typeof link>) => setSection(i, { ...section, links: section.links.map((l, k) => (k === j ? { ...l, ...patch } : l)) });
                return (
                  <div key={j} className="grid grid-cols-1 sm:grid-cols-[1fr_1.3fr_auto] gap-1.5" dir="ltr">
                    <input value={link.title} onChange={(e) => setLink({ title: e.target.value })} placeholder={t('Title', 'العنوان')} className={input} />
                    <input value={link.url} onChange={(e) => setLink({ url: e.target.value })} placeholder="https://" className={`${input} font-mono text-xs`} />
                    <button type="button" onClick={() => setSection(i, { ...section, links: section.links.filter((_, k) => k !== j) })} aria-label={t('Remove link', 'حذف الرابط')} className="p-2 rounded-lg text-slate-500 hover:text-rose-300 justify-self-end">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input value={link.note} onChange={(e) => setLink({ note: e.target.value })} placeholder={t('What this page answers (optional)', 'ما الذي تجيب عنه الصفحة (اختياري)')} className={`${input} sm:col-span-3 text-xs`} />
                  </div>
                );
              })}
              <button type="button" onClick={() => setSection(i, { ...section, links: [...section.links, { title: '', url: '', note: '' }] })} className="text-xs font-semibold text-cyan-300 inline-flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> {t('Add link', 'أضف رابطاً')}
              </button>
            </fieldset>
          ))}
          <button type="button" onClick={() => setDoc({ ...doc, sections: [...doc.sections, { name: 'Section', links: [{ title: '', url: '', note: '' }] }] })} className="text-xs font-semibold text-cyan-300 inline-flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> {t('Add section (name one “Optional” for skippable pages)', 'أضف قسماً (سمّ أحدها "Optional" للصفحات الثانوية)')}
          </button>
        </div>

        <div className="space-y-3 lg:sticky lg:top-24 self-start">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">llms.txt</h3>
            <div className="flex gap-2">
              <button type="button" onClick={download} className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> {t('Download', 'تنزيل')}
              </button>
              <button type="button" onClick={copy} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white inline-flex items-center gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? t('Copied', 'تم النسخ') : t('Copy', 'نسخ')}
              </button>
            </div>
          </div>
          <pre dir="ltr" className="min-h-[260px] max-h-[560px] p-4 rounded-2xl bg-black/70 border border-white/10 text-[12.5px] font-mono text-emerald-200 overflow-auto leading-relaxed whitespace-pre-wrap">{output}</pre>
          {issues.length > 0 && (
            <ul className="space-y-1 text-[12px] text-amber-200">
              {issues.map((issue) => (
                <li key={issue} className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {issue === 'name' ? t('Add a name — the H1 is the only required element.', 'أضف اسماً — عنوان H1 هو العنصر الإلزامي الوحيد.')
                    : issue === 'summary' ? t('Add a one-sentence summary; it is what models read first.', 'أضف ملخصاً في جملة؛ هو أول ما تقرؤه النماذج.')
                    : issue === 'links' ? t('Add at least one page link.', 'أضف رابط صفحة واحداً على الأقل.')
                    : t(`Use an absolute URL: ${issue.slice(9)}`, `استخدم رابطاً كاملاً: ${issue.slice(9)}`)}
                </li>
              ))}
            </ul>
          )}
          <p className="text-[12px] text-slate-400 leading-relaxed">
            {t('Upload to https://yoursite.com/llms.txt and serve it as text/plain or text/markdown.', 'ارفعه على https://yoursite.com/llms.txt وقدّمه بنوع text/plain أو text/markdown.')}
          </p>
        </div>
      </div>
    </div>
  );
}
