'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import { ShieldCheck, Copy, Check, Terminal, Cpu, Server, Globe } from 'lucide-react';
import { CLAIMS } from '@/lib/content/claims';
import { wafSearchCitationAgents } from '@/lib/bots/registry';

interface BotSafelistGeneratorProps {
  lang: Language;
}

type WafPlatform = 'cloudflare' | 'nginx' | 'apache' | 'nextjs';

export default function BotSafelistGenerator({ lang }: BotSafelistGeneratorProps) {
  const [platform, setPlatform] = useState<WafPlatform>('cloudflare');
  const [copied, setCopied] = useState(false);
  const agents = wafSearchCitationAgents();
  const uaPattern = agents.join('|');

  const configs: Record<WafPlatform, { name: string; icon: any; code: string; descEn: string; descAr: string }> = {
    cloudflare: {
      name: 'Cloudflare WAF',
      icon: Globe,
      descEn: 'Paste into Cloudflare > Security > WAF > Custom Rules (Action: Skip / Allow). Pair with vendor IP lists.',
      descAr: 'انسخ هذا التعبير في Cloudflare > Security > WAF > Custom Rules. اربطه بقوائم IP الرسمية للبائع.',
      code: agents.map((agent) => `(http.user_agent contains "${agent}")`).join(' or\n'),
    },
    nginx: {
      name: 'Nginx Server',
      icon: Server,
      descEn: 'Add to your server block. This is a user-agent hint, not identity verification.',
      descAr: 'أضف هذا المقطع داخل إعدادات خادم Nginx. هذا تلميح User-Agent وليس تحقق هوية.',
      code: `# Search-citation crawlers (user-agent hint only — verify vendor IPs in production)
if ($http_user_agent ~* (${uaPattern})) {
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
    RewriteCond %{HTTP_USER_AGENT} (${uaPattern}) [NC]
    RewriteRule .* - [E=AI_BOT_ALLOW:1]
</IfModule>`,
    },
    nextjs: {
      name: 'Next.js 15 Middleware',
      icon: Cpu,
      descEn: 'Add to middleware.ts. Still verify crawler IPs — user-agent matching is spoofable.',
      descAr: 'أضف هذا الكود في middleware.ts. تحقق من IP الزاحف — سلسلة User-Agent قابلة للتزييف.',
      code: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SEARCH_CITATION_AGENTS = /${uaPattern}/i;

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isSearchCitationBot = SEARCH_CITATION_AGENTS.test(userAgent);

  if (isSearchCitationBot) {
    const response = NextResponse.next();
    response.headers.set('X-AI-Bot-Status', 'ua-match-unverified');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[10px] sm:text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مولد قواعد WAF لبوتات البحث' : 'WAF search-crawler safelist generator'}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            {lang === 'ar' ? 'مولد قواعد جدران الحماية لبوتات الاقتباس' : 'WAF & CDN search-crawler pass-through'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولّد قاعدة User-Agent أولية. للإنتاج استخدم نطاقات IP أو reverse-DNS المنشورة من البائع.'
              : 'Generate a starting user-agent rule. In production, verify crawlers with each vendor’s published IP ranges or reverse-DNS.'}
          </p>
        </div>

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

      <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-xs text-amber-100 leading-relaxed">
        {CLAIMS.wafSpoofWarning}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 gap-3">
          <span className="font-mono text-cyan-300">
            {lang === 'ar' ? configs[platform].descAr : configs[platform].descEn}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
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
