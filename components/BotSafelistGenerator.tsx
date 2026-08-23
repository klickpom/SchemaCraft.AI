'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import { ShieldCheck, Copy, Check, Terminal, Cpu, Server, Globe } from 'lucide-react';

interface BotSafelistGeneratorProps {
  lang: Language;
}

type WafPlatform = 'cloudflare' | 'nginx' | 'apache' | 'nextjs';

export default function BotSafelistGenerator({ lang }: BotSafelistGeneratorProps) {
  const [platform, setPlatform] = useState<WafPlatform>('cloudflare');
  const [copied, setCopied] = useState(false);

  const configs: Record<WafPlatform, { name: string; icon: any; code: string; descEn: string; descAr: string }> = {
    cloudflare: {
      name: 'Cloudflare WAF',
      icon: Globe,
      descEn: 'Paste into Cloudflare > Security > WAF > Custom Rules (Action: Skip / Allow).',
      descAr: 'انسخ هذا التعبير في Cloudflare > Security > WAF > Custom Rules (الإجراء: Skip / Allow).',
      code: `(http.user_agent contains "OAI-SearchBot") or
(http.user_agent contains "PerplexityBot") or
(http.user_agent contains "Claude-Web") or
(http.user_agent contains "Google-Extended")`,
    },
    nginx: {
      name: 'Nginx Server',
      icon: Server,
      descEn: 'Add to your /etc/nginx/sites-available/ default server block.',
      descAr: 'أضف هذا المقطع داخل إعدادات خادم Nginx في ملف الموقع.',
      code: `# Allow and pass-through AI Search Crawlers without rate-limiting
if ($http_user_agent ~* (OAI-SearchBot|PerplexityBot|Claude-Web|Google-Extended)) {
    set $ai_bot_allowed 1;
}`,
    },
    apache: {
      name: 'Apache .htaccess',
      icon: Terminal,
      descEn: 'Place in your root public_html/.htaccess file.',
      descAr: 'أضف هذا الكود في ملف .htaccess الرئيسي بموقعك.',
      code: `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTP_USER_AGENT} (OAI-SearchBot|PerplexityBot|Claude-Web) [NC]
    RewriteRule .* - [E=AI_BOT_ALLOW:1]
</IfModule>`,
    },
    nextjs: {
      name: 'Next.js 15 Middleware',
      icon: Cpu,
      descEn: 'Add to your root middleware.ts to bypass auth/rate-limits for AI bots.',
      descAr: 'أضف هذا الكود في ملف middleware.ts لتجاوز أي حظر لبوتات الذكاء الاصطناعي.',
      code: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isAiSearchBot = /OAI-SearchBot|PerplexityBot|Claude-Web|Google-Extended/i.test(userAgent);

  if (isAiSearchBot) {
    const response = NextResponse.next();
    response.headers.set('X-AI-Bot-Status', 'Allowed-For-Indexing');
    return response;
  }
}`,
    },
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(configs[platform].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10101c] via-[#090912] to-[#050508] p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[10px] sm:text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'أداة حماية وتصريح بوتات الـ AI' : 'Official 2026 AI Bot Safelist Generator'}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            {lang === 'ar' ? 'مولد قواعد جدران الحماية (WAF) لبوتات الذكاء الاصطناعي' : 'WAF & CDN AI Bot Pass-Through Generator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'تأكد من عدم حظر جدار الحماية (Cloudflare أو Nginx) لبوتات ChatGPT و Perplexity للحفاظ على اقتباس موقعك.'
              : 'Generate 1-click firewall safelist rules to ensure Cloudflare, Nginx, and Apache never block ChatGPT Search or Perplexity bots.'}
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10">
          {(Object.keys(configs) as WafPlatform[]).map((key) => {
            const item = configs[key];
            const Icon = item.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPlatform(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  platform === key
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Display Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-cyan-300">
            {lang === 'ar' ? configs[platform].descAr : configs[platform].descEn}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الكود' : 'Copy Rule')}</span>
          </button>
        </div>

        <div className="relative rounded-2xl bg-black/80 border border-white/10 p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
          <pre>{configs[platform].code}</pre>
        </div>
      </div>
    </section>
  );
}
