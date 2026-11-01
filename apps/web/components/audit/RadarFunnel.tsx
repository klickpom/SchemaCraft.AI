'use client';

import { Download, MessageSquare } from 'lucide-react';
import { drawResultCard, radarAppUrl } from '@/lib/radarFunnel';

function L(lang: 'en' | 'ar', en: string, ar: string) {
  return lang === 'ar' ? ar : en;
}

export default function RadarFunnel({ lang, url, score }: { lang: 'en' | 'ar'; url: string; score: number }) {
  function downloadCard() {
    const canvas = document.createElement('canvas');
    drawResultCard(canvas, { lang, score, url });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'schemacraft-result.png';
    link.click();
  }

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
      <div className="space-y-1 min-w-0">
        <p className="text-sm font-bold text-cyan-50">{L(lang, 'See whether AI answers mention this site', 'انظر هل تذكر إجابات الذكاء الاصطناعي هذا الموقع')}</p>
        <p className="text-xs text-slate-300 leading-relaxed">
          {L(lang, 'The button opens the radar. The first 3 questions run after you sign in. This audit score is not what ChatGPT says.', 'الزر يفتح الرادار. أول 3 أسئلة تعمل بعد تسجيل الدخول. درجة هذا الفحص ليست ما يقوله ChatGPT.')}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <a href={radarAppUrl(url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white">
          <MessageSquare className="w-3.5 h-3.5" />
          {L(lang, 'Check what ChatGPT says about you', 'اعرف ماذا يقول ChatGPT عنك')}
        </a>
        <button type="button" onClick={downloadCard} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-slate-100">
          <Download className="w-3.5 h-3.5" />
          {L(lang, 'Download result card', 'نزّل بطاقة النتيجة')}
        </button>
      </div>
    </div>
  );
}
