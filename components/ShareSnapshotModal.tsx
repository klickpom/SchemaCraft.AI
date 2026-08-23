'use client';

import React, { useState, useEffect } from 'react';
import { AuditReport } from '@/lib/auditEngine';
import { Language, translations } from '@/lib/translations';
import { X, Copy, Check, Share2, Globe, MessageSquare } from 'lucide-react';

interface ShareSnapshotModalProps {
  report: AuditReport | null;
  lang: Language;
  onClose: () => void;
}

export default function ShareSnapshotModal({
  report,
  lang,
  onClose,
}: ShareSnapshotModalProps) {
  if (!report) return null;

  const t = translations[lang].shareModal;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?url=${encodeURIComponent(report.url)}`
    : `https://schemacraft-ai.site/?url=${encodeURIComponent(report.url)}`;

  const shareText = lang === 'ar'
    ? `تقرير فحص ظهور وسيو الذكاء الاصطناعي لموقع ${report.url} (النتيجة: ${report.overallScore}/100) عبر @SchemaCraftAI`
    : `AI Search & SEO audit for ${report.url} (Score: ${report.overallScore}/100) on @SchemaCraftAI`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (err) {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer,width=600,height=450');
  };

  const handleShareLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(liUrl, '_blank', 'noopener,noreferrer,width=600,height=550');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} — ${shareUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SchemaCraft AI Audit: ${report.url}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#101018] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-8 rtl:pr-0 rtl:pl-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-300">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {t.title}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* URL Copy Box */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/50 border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent px-2 text-xs font-mono text-cyan-300 focus:outline-none truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copiedBtn : t.copyBtn}</span>
            </button>
          </div>
        </div>

        {/* 1-Click Social Share Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Share on X */}
          <button
            type="button"
            onClick={handleShareX}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-xs font-semibold text-white transition active:scale-95 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>X / Twitter</span>
          </button>

          {/* Share on LinkedIn */}
          <button
            type="button"
            onClick={handleShareLinkedIn}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-semibold text-blue-300 transition active:scale-95 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>LinkedIn</span>
          </button>

          {/* Share on WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-300 transition active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Native Mobile Share Sheet if supported */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-bold text-cyan-300 transition cursor-pointer active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.nativeShare}</span>
          </button>
        )}

      </div>
    </div>
  );
}
