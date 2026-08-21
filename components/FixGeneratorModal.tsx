'use client';

import React, { useState, useEffect } from 'react';
import { AuditIssue } from '@/lib/auditEngine';
import { generatePlatformFix, PlatformFix } from '@/lib/fixGenerator';
import { X, Copy, Check, Terminal, Globe, ShoppingBag, ArrowRight } from 'lucide-react';

interface FixGeneratorModalProps {
  issue: AuditIssue | null;
  targetUrl: string;
  siteType: string;
  lang: 'en' | 'ar';
  onClose: () => void;
}

export default function FixGeneratorModal({
  issue,
  targetUrl,
  siteType,
  lang,
  onClose,
}: FixGeneratorModalProps) {
  if (!issue) return null;

  const fixes = generatePlatformFix(issue, targetUrl, siteType);
  const [activePlatform, setActivePlatform] = useState<'wordpress' | 'nextjs' | 'shopify'>('wordpress');
  const [copied, setCopied] = useState(false);

  const currentFix = fixes.find((f) => f.platform === activePlatform) || fixes[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopy = () => {
    if (currentFix) {
      navigator.clipboard.writeText(currentFix.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#12121a] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-5 bg-[#161622]">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                issue.severity === 'critical'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : issue.severity === 'high'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
              }`}>
                {issue.severity.toUpperCase()}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">
                {lang === 'ar' ? issue.titleAr : issue.title}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400">
              {lang === 'ar' ? 'مولد الإصلاح البرمجي الفوري' : 'Interactive Multi-Platform Fix Generator'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Signal & Evidence Card */}
          <div className="rounded-xl border border-white/10 bg-[#0a0a0f] p-3.5 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'ar' ? 'الدليل المرصود في الموقع:' : 'Raw Evidence Detected:'}
            </div>
            <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] text-cyan-300 overflow-x-auto">
              {lang === 'ar' ? issue.evidenceAr : issue.evidence}
            </div>
            <div className="text-slate-300 text-[11px] leading-relaxed">
              <span className="font-bold text-slate-200">{lang === 'ar' ? 'لماذا يهم البحث؟ ' : 'Why it matters: '}</span>
              {lang === 'ar' ? issue.whyItMattersAr : issue.whyItMatters}
            </div>
          </div>

          {/* Platform Switcher Tabs */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              {lang === 'ar' ? 'اختر منصة موقعك لتوليد الكود:' : 'Select Your Platform for Ready Fix Code:'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActivePlatform('wordpress')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer ${
                  activePlatform === 'wordpress'
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>WordPress</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatform('nextjs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer ${
                  activePlatform === 'nextjs'
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next.js 15</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatform('shopify')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer ${
                  activePlatform === 'shopify'
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shopify</span>
              </button>
            </div>
          </div>

          {/* Generated Code & Instructions */}
          {currentFix && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 gap-2 flex-wrap">
                <span className="font-mono font-medium text-indigo-300 truncate max-w-[280px] sm:max-w-md">
                  📁 {lang === 'ar' ? currentFix.fileLocationAr : currentFix.fileLocation}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-indigo-600 text-white font-semibold transition cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الكود' : 'Copy Fix')}</span>
                </button>
              </div>

              <div className="relative rounded-xl border border-white/10 bg-[#08080c] overflow-hidden shadow-inner">
                <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 uppercase">{activePlatform}</span>
                </div>
                <div className="p-3.5 font-mono text-[11px] text-slate-200 overflow-x-auto max-h-56 leading-relaxed">
                  <pre>{currentFix.codeSnippet}</pre>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-200 leading-relaxed">
                <span className="font-bold text-cyan-300">{lang === 'ar' ? 'طريقة التركيب: ' : 'Installation Step: '}</span>
                {lang === 'ar' ? currentFix.installationInstructionsAr : currentFix.installationInstructions}
              </div>
            </div>
          )}

        </div>

        {/* Footer Action */}
        <div className="border-t border-white/10 px-5 py-3 bg-[#161622] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {lang === 'ar' ? 'كود جاهز للإنتاج بنسبة 100%' : '100% Production-Ready Code'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold transition cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
