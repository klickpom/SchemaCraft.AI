import React from 'react';
import { AlertTriangle, CheckCircle2, CircleDashed, Info, XCircle } from 'lucide-react';
import type { CheckStatus } from '@schemacraft/audit-core/audit/types';
import { L, type Lang } from './i18n';

const STYLE: Record<CheckStatus, { cls: string; en: string; ar: string; Icon: typeof CheckCircle2 }> = {
  pass: { cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', en: 'Pass', ar: 'ناجح', Icon: CheckCircle2 },
  warn: { cls: 'bg-amber-500/10 text-amber-300 border-amber-500/30', en: 'Warning', ar: 'تحذير', Icon: AlertTriangle },
  fail: { cls: 'bg-rose-500/10 text-rose-300 border-rose-500/30', en: 'Fail', ar: 'فشل', Icon: XCircle },
  info: { cls: 'bg-indigo-500/10 text-indigo-200 border-indigo-500/30', en: 'Info', ar: 'معلومة', Icon: Info },
  not_assessed: { cls: 'bg-white/5 text-slate-300 border-white/15', en: 'Not assessed', ar: 'غير مُقيَّم', Icon: CircleDashed },
};

export function StatusIcon({ status, className = 'w-4 h-4' }: { status: CheckStatus; className?: string }) {
  const { Icon, cls } = STYLE[status];
  return <Icon className={`${className} ${cls.split(' ').find((c) => c.startsWith('text-'))}`} aria-hidden />;
}

export function StatusPill({ status, lang }: { status: CheckStatus; lang: Lang }) {
  const s = STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${s.cls}`}>
      <s.Icon className="w-3 h-3" aria-hidden />
      {L(lang, s.en, s.ar)}
    </span>
  );
}
