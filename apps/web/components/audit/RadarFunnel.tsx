'use client';

import { Download, MessageSquare } from 'lucide-react';
import { drawResultCard, radarBlock, radarDownloadLabel } from '@/lib/radarFunnel';

export default function RadarFunnel({ lang, url, score }: { lang: 'en' | 'ar'; url: string; score: number }) {
  function downloadCard() {
    const canvas = document.createElement('canvas');
    drawResultCard(canvas, { lang, score, url });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'schemacraft-result.png';
    link.click();
  }

  const download = (
    <button type="button" onClick={downloadCard} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-slate-100 print:hidden">
      <Download className="w-3.5 h-3.5" />
      {radarDownloadLabel(lang)}
    </button>
  );

  const block = radarBlock(lang, url, process.env.NEXT_PUBLIC_RADAR_APP_LIVE);
  if (!block) return download;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
      <div className="space-y-1 min-w-0">
        <p className="text-sm font-bold text-cyan-50">{block.title}</p>
        <p className="text-xs text-slate-300 leading-relaxed">{block.body}</p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <a href={block.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white">
          <MessageSquare className="w-3.5 h-3.5" />
          {block.linkLabel}
        </a>
        {download}
      </div>
    </div>
  );
}
