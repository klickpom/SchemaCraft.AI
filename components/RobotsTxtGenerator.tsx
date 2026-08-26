'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import { Bot, ShieldCheck, Copy, Check, Terminal, Sparkles } from 'lucide-react';

interface RobotsTxtGeneratorProps {
  lang: Language;
}

interface BotConfig {
  id: string;
  name: string;
  userAgent: string;
  purposeEn: string;
  purposeAr: string;
  defaultAllowed: boolean;
  isSearch: boolean;
}

const AI_BOTS: BotConfig[] = [
  {
    id: 'oai-search',
    name: 'OAI-SearchBot',
    userAgent: 'OAI-SearchBot',
    purposeEn: 'ChatGPT Search & Live Web Retrieval (Essential for AI Citations)',
    purposeAr: 'محرك بحث شات جي بي تي والاقتباسات الحية (ضروري للظهور في AI)',
    defaultAllowed: true,
    isSearch: true,
  },
  {
    id: 'perplexity',
    name: 'PerplexityBot',
    userAgent: 'PerplexityBot',
    purposeEn: 'Perplexity AI Real-Time Search & Sourced References',
    purposeAr: 'محرك Perplexity للبحث الحي والمصادر الموثقة',
    defaultAllowed: true,
    isSearch: true,
  },
  {
    id: 'claude-web',
    name: 'Claude-Web',
    userAgent: 'Claude-Web',
    purposeEn: 'Anthropic Claude 3.5 Real-Time Web Browsing',
    purposeAr: 'تصفح الويب الحي لنموذج Claude 3.5 من أنثروبيك',
    defaultAllowed: true,
    isSearch: true,
  },
  {
    id: 'google-extended',
    name: 'Google-Extended',
    userAgent: 'Google-Extended',
    purposeEn: 'Google Gemini AI Overviews & Search Summaries',
    purposeAr: 'ملخصات الذكاء الاصطناعي في بحث جوجل (Google Gemini)',
    defaultAllowed: true,
    isSearch: true,
  },
  {
    id: 'applebot-extended',
    name: 'Applebot-Extended',
    userAgent: 'Applebot-Extended',
    purposeEn: 'Apple Intelligence Siri & Spotlight AI Answers',
    purposeAr: 'ذكاء آبل (Apple Intelligence) وإجابات سيري الذكية',
    defaultAllowed: true,
    isSearch: true,
  },
  {
    id: 'gptbot',
    name: 'GPTBot (Training)',
    userAgent: 'GPTBot',
    purposeEn: 'OpenAI Foundation Model Training Scraper (Non-Search)',
    purposeAr: 'زاحف جمع بيانات تدريب نماذج OpenAI (غير مخصص للبحث)',
    defaultAllowed: false,
    isSearch: false,
  },
];

export default function RobotsTxtGenerator({ lang }: RobotsTxtGeneratorProps) {
  const [allowedBots, setAllowedBots] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    AI_BOTS.forEach((b) => {
      initial[b.id] = b.defaultAllowed;
    });
    return initial;
  });

  const [siteUrl, setSiteUrl] = useState('https://schemacraft-ai.site');
  const [copied, setCopied] = useState(false);

  const toggleBot = (id: string) => {
    setAllowedBots((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generateRobotsTxt = (): string => {
    let output = `# ========================================================\n`;
    output += `# Optimized 2026 robots.txt for AI Search & AEO Indexing\n`;
    output += `# Generated via SchemaCraft.AI (https://schemacraft-ai.site)\n`;
    output += `# ========================================================\n\n`;

    output += `# Standard Search Engine Crawlers\n`;
    output += `User-agent: Googlebot\nAllow: /\n\n`;
    output += `User-agent: Bingbot\nAllow: /\n\n`;

    output += `# AI Search Engine & Retrieval Bots\n`;
    AI_BOTS.forEach((bot) => {
      const isAllowed = allowedBots[bot.id];
      output += `# ${bot.name} - ${bot.purposeEn}\n`;
      output += `User-agent: ${bot.userAgent}\n`;
      output += isAllowed ? `Allow: /\n\n` : `Disallow: /\n\n`;
    });

    output += `# Default Directive for Unspecified Bots\n`;
    output += `User-agent: *\nAllow: /\n\n`;

    output += `# Authoritative Sitemap Index\n`;
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

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#121222] via-[#0b0b14] to-[#07070b] p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-[10px] sm:text-xs font-bold text-cyan-300">
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'أداة ضبط روبوتس الذكاء الاصطناعي 2026' : '2026 AI Bot robots.txt Architect'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'مولد ملف robots.txt المعتمد لمحركات بحث AI'
              : 'Enterprise AI Search robots.txt Generator & Validator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'حدد البوتات المصرح لها باقتباس موقعك في إجابات ChatGPT و Perplexity و Gemini دون تسريب بياناتك للتدريب غير المرغوب.'
              : 'Safelist AI search engines for instant citation while keeping complete control over foundation model training scrapers.'}
          </p>
        </div>

        {/* Domain input */}
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
        {/* Left: Toggles */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'ar' ? 'تخصيص تصاريح روبوتات الذكاء الاصطناعي' : 'Configure AI Bot Directives'}
          </h3>

          {AI_BOTS.map((bot) => {
            const isAllowed = allowedBots[bot.id];
            return (
              <div
                key={bot.id}
                onClick={() => toggleBot(bot.id)}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer select-none ${
                  isAllowed
                    ? 'border-indigo-500/40 bg-indigo-950/20 hover:bg-indigo-950/30'
                    : 'border-white/10 bg-black/30 hover:bg-white/[0.03]'
                }`}
              >
                <div className="space-y-1 pr-3 rtl:pr-0 rtl:pl-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{bot.name}</span>
                    {bot.isSearch && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                        {lang === 'ar' ? 'بحث واقتباس' : 'Search Citation'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {lang === 'ar' ? bot.purposeAr : bot.purposeEn}
                  </p>
                </div>

                {/* Toggle switch button */}
                <div
                  className={`w-11 h-6 rounded-full p-1 transition flex items-center shrink-0 ${
                    isAllowed ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Live Preview Box */}
        <div className="lg:col-span-6 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300">
              {lang === 'ar' ? 'معاينة ملف public/robots.txt الحية:' : 'Live public/robots.txt Preview:'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
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
