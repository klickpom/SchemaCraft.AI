'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  FileText,
  Copy,
  Check,
  Printer,
  X,
  Sparkles,
  Terminal,
  ShieldCheck,
  Bot,
  Zap,
} from 'lucide-react';

interface AeoCheatSheetModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

type CheatSheetTab = 'crawlers' | 'schemas' | 'bluf' | 'waf';

export default function AeoCheatSheetModal({
  lang,
  isOpen,
  onClose,
}: AeoCheatSheetModalProps) {
  const [activeTab, setActiveTab] = useState<CheatSheetTab>('crawlers');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cheatSheetMarkdown = `# 📖 SchemaCraft.AI — The 2026 Generative Engine Optimization (GEO) & AEO Cheat Sheet

## 1. Official AI Search Crawler User-Agents (2026)
- **ChatGPT Search / OpenAI**: User-agent: \`OAI-SearchBot\` (Allow for live search citations)
- **Perplexity AI**: User-agent: \`PerplexityBot\` (Allow for sourced references)
- **Anthropic Claude 3.5**: User-agent: \`Claude-Web\` (Allow for live browsing)
- **Google Gemini Overviews**: User-agent: \`Google-Extended\` (Allow for AI search summaries)
- **Apple Intelligence Siri**: User-agent: \`Applebot-Extended\` (Allow for Siri spotlight answers)
- **OpenAI Foundation Training**: User-agent: \`GPTBot\` (Optional: Disallow if protecting raw datasets)

## 2. Core Schema.org JSON-LD Entities
- **Software / SaaS**: \`SoftwareApplication\` with \`applicationCategory\`, \`offers.price\`, \`aggregateRating\`.
- **E-Commerce**: \`Product\` with \`offers.price\`, \`offers.availability: "https://schema.org/InStock"\`.
- **Local & Healthcare**: \`MedicalBusiness\` / \`LegalService\` / \`LocalBusiness\` with \`address\`, \`telephone\`.
- **Branded Knowledge Panel**: \`Organization\` with \`logo\`, \`sameAs\` (Twitter, LinkedIn, GitHub).

## 3. The BLUF (Bottom Line Up Front) Content Rule for AI Search Citations
- Place a 45-60 word direct factual summary directly under the H1 before any marketing fluff.
- Use structured HTML definition lists (\`<dl>\`, \`<dt>\`, \`<dd>\`) or tables for key specifications.
- Maintain a clear subject-predicate-object structure for neural parsing.

## 4. Cloudflare WAF Expression Rule for AI Bots
\`(http.user_agent contains "OAI-SearchBot") or (http.user_agent contains "PerplexityBot") or (http.user_agent contains "Claude-Web")\`
-> Action: **Skip / Allow** (Bypass Bot Fight Mode)

---
Generated via SchemaCraft.AI (https://schemacraft-ai.site) — Real-Time AI Search Visibility Auditor.`;

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(cheatSheetMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-[#0c0c14] shadow-2xl shadow-black/90 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {lang === 'ar' ? 'الدليل التقني المرجعي لـ GEO & AEO 2026' : 'The 2026 GEO & AEO Technical Cheat Sheet'}
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap shrink-0">
                  Standard v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar'
                  ? 'المرجع الفني الشامل لضبط بوتات الذكاء الاصطناعي وهيكلة أكواد Schema.org'
                  : 'The complete technical reference for AI bot routing, BLUF content, and Schema.org graphs.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ Markdown' : 'Copy Markdown')}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
              title="Print / Save PDF"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'طباعة PDF' : 'Print PDF'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-white/10 overflow-x-auto bg-black/20">
          <button
            type="button"
            onClick={() => setActiveTab('crawlers')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'crawlers'
                ? 'border-indigo-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بوتات الـ AI والزواحف' : 'AI Crawlers & User-Agents'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schemas')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'schemas'
                ? 'border-indigo-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'هياكل السكيما الأساسية' : 'Core Schema Graph Entities'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bluf')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'bluf'
                ? 'border-indigo-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'معادلة صياغة BLUF' : 'BLUF Content Formula'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('waf')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'waf'
                ? 'border-indigo-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'قواعد WAF وجدران الحماية' : 'WAF & Firewall Pass-Through'}</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {activeTab === 'crawlers' && (
            <div className="space-y-4">
              <p className="text-slate-400">
                {lang === 'ar'
                  ? 'دليل معرفات بوتات الذكاء الاصطناعي لعام 2026 والفرق بين بوتات البحث الحي وبوتات تدريب النماذج:'
                  : 'Official 2026 AI bot user-agent directory. Distinguish search retrieval crawlers from bulk model training scrapers:'}
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-cyan-300 font-bold">OAI-SearchBot</div>
                    <div className="text-slate-400 text-[11px]">ChatGPT Search Live Web Retrieval</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">ALLOW (Mandatory for AEO)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-cyan-300 font-bold">PerplexityBot</div>
                    <div className="text-slate-400 text-[11px]">Perplexity AI Real-Time Sourced Citations</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">ALLOW (Essential)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-cyan-300 font-bold">Claude-Web</div>
                    <div className="text-slate-400 text-[11px]">Anthropic Claude 3.5 Real-Time Browsing</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">ALLOW (Essential)</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-cyan-300 font-bold">GPTBot</div>
                    <div className="text-slate-400 text-[11px]">OpenAI Offline Model Training Scraper</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">OPTIONAL (Can Disallow)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schemas' && (
            <div className="space-y-4">
              <p className="text-slate-400">
                {lang === 'ar'
                  ? 'أهم 4 كيانات Schema.org إلزامية للحصول على بطاقات ونجوم جوجل الذهبية:'
                  : 'The top 4 mandatory Schema.org entities to qualify for Google rich star ratings and AI Knowledge Panels:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="font-bold text-white font-mono">SoftwareApplication</div>
                  <div className="text-slate-400 text-[11px]">For SaaS & developer tools. Requires category, price, and aggregateRating.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="font-bold text-white font-mono">Product</div>
                  <div className="text-slate-400 text-[11px]">For E-commerce stores. Requires offers.price, currency, and InStock status.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="font-bold text-white font-mono">MedicalBusiness / Legal</div>
                  <div className="text-slate-400 text-[11px]">For clinics & law firms. Requires address, phone, and specialty.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="font-bold text-white font-mono">Organization</div>
                  <div className="text-slate-400 text-[11px]">For brand identity. Requires logo and verified sameAs social profiles.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bluf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <div className="font-bold text-cyan-300 text-sm">
                  {lang === 'ar' ? 'قاعدة BLUF (Bottom Line Up Front):' : 'The BLUF (Bottom Line Up Front) Formula:'}
                </div>
                <p className="text-slate-300">
                  {lang === 'ar'
                    ? 'نماذج الذكاء الاصطناعي (ChatGPT, Claude, Perplexity) تقرأ أول 50 كلمة تحت العنوان الرئيسي H1 لاقتباسها كإجابة فورية. اكتب دائماً إجابة مباشرة وحاسمة دون مقدمات تسويقية طويلة.'
                    : 'AI engines prioritize the first 45-60 words directly beneath the H1 for instant answer citations. Always state the definitive factual answer first before providing secondary nuance.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'waf' && (
            <div className="space-y-4">
              <p className="text-slate-400">
                {lang === 'ar'
                  ? 'قاعدة Cloudflare WAF لتجاوز حظر البوتات دون المساس بأمان الموقع:'
                  : 'Cloudflare WAF Custom Rule to bypass Bot Fight Mode for legitimate AI search crawlers:'}
              </p>
              <div className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-emerald-300 text-xs overflow-x-auto">
                (http.user_agent contains "OAI-SearchBot") or (http.user_agent contains "PerplexityBot") or (http.user_agent contains "Claude-Web")
              </div>
              <div className="text-[11px] text-slate-400">
                Action: <strong className="text-white">Skip &gt; Bot Fight Mode</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
