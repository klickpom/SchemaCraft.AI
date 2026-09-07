'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import { Bot, Copy, Check } from 'lucide-react';
import { ACTIVE_BOTS, DEPRECATED_BOTS } from '@/lib/bots/registry';
import { CLAIMS } from '@/lib/content/claims';
import { SITE_HOST } from '@/lib/seo/urls';

interface RobotsTxtGeneratorProps {
  lang: Language;
}

export default function RobotsTxtGenerator({ lang }: RobotsTxtGeneratorProps) {
  const allBots = [...ACTIVE_BOTS, ...DEPRECATED_BOTS];
  const [allowedBots, setAllowedBots] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    allBots.forEach((b) => {
      initial[b.id] = b.defaultAllowed;
    });
    return initial;
  });

  const [siteUrl, setSiteUrl] = useState(`https://${SITE_HOST}`);
  const [copied, setCopied] = useState(false);

  const toggleBot = (id: string) => {
    setAllowedBots((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generateRobotsTxt = (): string => {
    let output = `# Optimized robots.txt for search and AI crawlers\n`;
    output += `# Generated via SchemaCraft.AI (https://${SITE_HOST})\n\n`;

    output += `# Default for unspecified bots\n`;
    output += `User-agent: *\nAllow: /\n\n`;

    ACTIVE_BOTS.forEach((bot) => {
      const isAllowed = allowedBots[bot.id];
      output += `# ${bot.userAgent} — ${bot.purposeEn}\n`;
      output += `# Docs: ${bot.docsUrl}\n`;
      output += `User-agent: ${bot.userAgent}\n`;
      output += isAllowed ? `Allow: /\n\n` : `Disallow: /\n\n`;
    });

    output += `# Legacy / deprecated agents (kept for older user-agent strings)\n`;
    DEPRECATED_BOTS.forEach((bot) => {
      const isAllowed = allowedBots[bot.id];
      output += `# ${bot.userAgent} — ${bot.purposeEn}\n`;
      output += `# Docs: ${bot.docsUrl}\n`;
      output += `User-agent: ${bot.userAgent}\n`;
      output += isAllowed ? `Allow: /\n\n` : `Disallow: /\n\n`;
    });

    output += `# Authoritative sitemap\n`;
    output += `Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml\n`;

    return output;
  };

  const generatedCode = generateRobotsTxt();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  const purposeBadge = (purpose: string, isDeprecated?: boolean) => {
    if (isDeprecated) {
      return lang === 'ar' ? 'قديم / مهمل' : 'Legacy / deprecated';
    }
    if (purpose === 'search-citation') return lang === 'ar' ? 'بحث واقتباس' : 'Search citation';
    if (purpose === 'training') return lang === 'ar' ? 'تدريب' : 'Training';
    return lang === 'ar' ? 'جلب مستخدم' : 'User fetch';
  };

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#121222] via-[#0b0b14] to-[#07070b] p-6 sm:p-10 space-y-8 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-[10px] sm:text-xs font-bold text-cyan-300">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'مولد robots.txt لبوتات البحث والذكاء الاصطناعي' : 'AI crawler robots.txt generator'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'مولد ملف robots.txt لمحركات البحث والذكاء الاصطناعي'
              : 'Search & AI crawler robots.txt generator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'فعّل بوتات البحث والاقتباس، وتحكّم بشكل منفصل في زواحف التدريب. كل صف مربوط بتوثيق البائع الرسمي.'
              : 'Allow search-citation crawlers independently from training crawlers. Every row links to the vendor’s official documentation.'}
          </p>
          <p className="text-[11px] text-amber-200/90 leading-relaxed border border-amber-500/20 bg-amber-950/30 rounded-xl px-3 py-2">
            {CLAIMS.gptBotOnOurSite}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 border border-white/10 shrink-0">
          <span className="text-xs font-mono text-slate-500">https://</span>
          <input
            type="text"
            value={siteUrl.replace(/^https?:\/\//, '')}
            onChange={(e) => setSiteUrl(`https://${e.target.value}`)}
            placeholder="yourdomain.com"
            className="bg-transparent text-xs font-mono text-cyan-300 focus:outline-none w-44"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'ar' ? 'تخصيص تصاريح البوتات' : 'Configure bot directives'}
          </h3>

          {allBots.map((bot) => {
            const isAllowed = allowedBots[bot.id];
            return (
              <div
                key={bot.id}
                className={`w-full p-3.5 rounded-2xl border text-left rtl:text-right flex items-center justify-between ${
                  isAllowed
                    ? 'border-indigo-500/50 bg-indigo-950/30'
                    : 'border-white/10 bg-black/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleBot(bot.id)}
                  className="flex-1 text-left rtl:text-right cursor-pointer active:scale-[0.99] select-none"
                >
                  <div className="space-y-1 pr-3 rtl:pr-0 rtl:pl-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-white">{bot.userAgent}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                        {purposeBadge(bot.purpose, bot.deprecated)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {lang === 'ar' ? bot.purposeAr : bot.purposeEn}
                    </p>
                    <a
                      href={bot.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] text-cyan-400 hover:underline font-mono"
                    >
                      Official docs ↗
                    </a>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleBot(bot.id)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center shrink-0 cursor-pointer ${
                    isAllowed ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                  aria-pressed={isAllowed}
                  aria-label={`Toggle ${bot.userAgent}`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                </button>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-6 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300">
              {lang === 'ar' ? 'معاينة robots.txt:' : 'Live robots.txt preview:'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الملف' : 'Copy robots.txt')}</span>
            </button>
          </div>

          <div className="flex-1 min-h-[300px] rounded-2xl bg-black/80 border border-white/15 p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre shadow-inner">
            {generatedCode}
          </div>
        </div>
      </div>
    </section>
  );
}
