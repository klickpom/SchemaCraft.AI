'use client';

import React, { useMemo, useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import type { AuditReport } from '@schemacraft/audit-core/audit/types';
import { compareAudits, fillAnswers, rankFixes, type FixDraft } from '@schemacraft/fixes/rank';
import { L, type Lang } from './i18n';

export default function TopFixes({
  report,
  lang,
  previous,
  onRecheck,
  recheckUsed,
}: {
  report: AuditReport;
  lang: Lang;
  previous?: AuditReport | null;
  onRecheck?: () => void;
  recheckUsed?: boolean;
}) {
  const ranked = useMemo(() => rankFixes(report), [report]);
  const changes = useMemo(() => (previous && previous.timestamp !== report.timestamp ? compareAudits(previous, report) : []), [previous, report]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState<string[]>([]);

  function copy(text: string) {
    if (navigator.clipboard) void navigator.clipboard.writeText(text);
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-white">{L(lang, 'Do these three first', 'ابدأ بهذه الثلاثة')}</h3>
        <p className="text-xs text-slate-400">
          {L(lang, 'Ranked by impact, this page, and how easy the copy is. This is not a ranking promise.', 'مرتبة حسب الأثر وهذه الصفحة وسهولة النسخ. هذا ليس وعداً بترتيب.')}
        </p>
      </div>
      {ranked.top.length === 0 ? (
        <p className="text-sm text-slate-300">{L(lang, 'No failed checks to copy on this page.', 'لا توجد فحوص فاشلة لنسخها في هذه الصفحة.')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ranked.top.map((draft) => (
            <FixCard
              key={draft.id}
              draft={fillAnswers(draft, answers, skipped.includes(draft.id))}
              lang={lang}
              answers={answers}
              onAnswer={(id, value) => setAnswers((current) => ({ ...current, [id]: value }))}
              onSkip={() => setSkipped((current) => (current.includes(draft.id) ? current : [...current, draft.id]))}
              onCopy={copy}
            />
          ))}
        </div>
      )}
      {ranked.later.length > 0 && (
        <p className="text-[12px] text-slate-400 leading-relaxed">
          {L(lang, 'Later', 'لاحقاً')}: {ranked.later.map((item) => L(lang, item.title, item.titleAr)).join(lang === 'ar' ? '، ' : ', ')}
        </p>
      )}
      {changes.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0b0b12] p-4 space-y-2">
          <p className="text-sm font-bold text-white">{L(lang, 'What changed on the re-fetch', 'ما الذي تغيّر عند إعادة الجلب')}</p>
          <ul className="space-y-1 text-[12px] text-slate-300">
            {changes.map((change) => (
              <li key={change.id}>
                {L(lang, change.title, change.titleAr)}: {change.before} → {change.after === 'not_assessed' ? L(lang, 'not assessed', 'غير مُقيَّم') : change.after}
              </li>
            ))}
          </ul>
        </div>
      )}
      {previous && previous.timestamp !== report.timestamp && changes.length === 0 && (
        <p className="text-[12px] text-slate-400">{L(lang, 'No checked evidence changed.', 'لم يتغيّر دليل أي فحص.')}</p>
      )}
      {onRecheck && (
        <button
          type="button"
          onClick={onRecheck}
          disabled={recheckUsed}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold print:hidden"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {recheckUsed
            ? L(lang, 'The free audit includes one comparison.', 'الفحص المجاني يتضمن مقارنة واحدة.')
            : L(lang, 'Check again', 'أعد الفحص')}
        </button>
      )}
      {ranked.indexNow && (
        <div className="rounded-2xl border border-white/10 bg-[#0b0b12] p-4 space-y-2 print:hidden">
          <p className="text-sm font-bold text-white">{L(lang, 'Optional: tell IndexNow', 'اختياري: أخبر IndexNow')}</p>
          <p className="text-[12px] text-slate-400 leading-relaxed">{L(lang, ranked.indexNow.note, ranked.indexNow.noteAr)}</p>
          <pre dir="ltr" className="p-3 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-cyan-100 whitespace-pre-wrap break-words">{ranked.indexNow.body}</pre>
          <button type="button" onClick={() => copy(ranked.indexNow!.body)} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
            <Copy className="w-3.5 h-3.5" /> {L(lang, 'Copy IndexNow body', 'انسخ نص IndexNow')}
          </button>
        </div>
      )}
    </section>
  );
}

function FixCard({
  draft,
  lang,
  answers,
  onAnswer,
  onSkip,
  onCopy,
}: {
  draft: FixDraft;
  lang: Lang;
  answers: Record<string, string>;
  onAnswer: (id: string, value: string) => void;
  onSkip: () => void;
  onCopy: (text: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0f0f16] p-4 space-y-3 flex flex-col">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-white">{L(lang, draft.title, draft.titleAr)}</h4>
          {draft.risk === 'high' && <span className="text-[10px] font-bold uppercase text-rose-300">{L(lang, 'high risk', 'خطر عالٍ')}</span>}
        </div>
        <p className="text-[12px] text-slate-200 leading-relaxed">{L(lang, draft.why, draft.whyAr)}</p>
      </div>
      {draft.evidence && (
        <pre dir="auto" className="p-2.5 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-cyan-100 whitespace-pre-wrap break-words">{L(lang, draft.evidence, draft.evidenceAr)}</pre>
      )}
      {draft.questions.length > 0 && !draft.skipped && (
        <div className="space-y-2">
          {draft.questions.map((question) => (
            <label key={question.id} className="block text-[11px] text-slate-300 space-y-1">
              <span>{L(lang, question.prompt, question.promptAr)}</span>
              <input
                value={answers[question.id] || ''}
                onChange={(event) => onAnswer(question.id, event.target.value)}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-2 py-1.5 text-[12px] text-white"
              />
            </label>
          ))}
          <button type="button" onClick={onSkip} className="text-[11px] font-bold text-slate-400 hover:text-white">
            {L(lang, 'Skip this fix', 'تخطَّ هذا الإصلاح')}
          </button>
        </div>
      )}
      {draft.skipped ? (
        <p className="text-[12px] text-slate-400">{L(lang, 'Skipped. The page does not contain this fact.', 'تم التخطي. الصفحة لا تحتوي هذه المعلومة.')}</p>
      ) : draft.userMustApply ? (
        <pre dir="ltr" className="p-2.5 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-slate-200 whitespace-pre-wrap">{draft.artifact}</pre>
      ) : draft.artifact ? (
        <div className="space-y-2">
          <pre dir="ltr" className="p-2.5 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-emerald-100 whitespace-pre-wrap break-words">{draft.artifact}</pre>
          <button type="button" onClick={() => onCopy(draft.artifact)} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 print:hidden">
            <Copy className="w-3.5 h-3.5" /> {L(lang, 'Copy', 'انسخ')}
          </button>
        </div>
      ) : null}
    </article>
  );
}
