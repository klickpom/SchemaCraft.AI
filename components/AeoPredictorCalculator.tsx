'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  TrendingUp,
  ShieldCheck,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface AeoPredictorCalculatorProps {
  lang: Language;
}

interface Criterion {
  id: string;
  labelEn: string;
  labelAr: string;
  weight: number;
  descEn: string;
  descAr: string;
}

const CRITERIA: Criterion[] = [
  {
    id: 'schema',
    labelEn: 'Validated Schema.org JSON-LD (Product / SaaS / Org)',
    labelAr: 'كود Schema.org JSON-LD معتمد (للمنتج أو التطبيق أو المؤسسة)',
    weight: 25,
    descEn: 'Feeds structured attributes directly into AI neural entity index.',
    descAr: 'يغذي محركات الذكاء الاصطناعي بالبيانات الهيكلية المباشرة.',
  },
  {
    id: 'bluf',
    labelEn: 'BLUF 45-Word Direct Answer under Primary H1',
    labelAr: 'إجابة مباشرة (BLUF) تحت العنوان الرئيسي H1 في 50 كلمة',
    weight: 20,
    descEn: 'Required for LLM chunk extractors to quote your site as the primary source.',
    descAr: 'ضروري لنماذج الذكاء الاصطناعي لاقتباس موقعك كمصدر الإجابة الأول.',
  },
  {
    id: 'robots',
    labelEn: 'OAI-SearchBot & PerplexityBot Allowed in robots.txt',
    labelAr: 'التصريح لـ OAI-SearchBot و PerplexityBot في ملف robots.txt',
    weight: 20,
    descEn: 'Guarantees live search crawlers can fetch your pages in real-time.',
    descAr: 'يضمن وصول زواحف البحث الحي لموقعك في أجزاء من الثانية.',
  },
  {
    id: 'waf',
    labelEn: 'Cloudflare / WAF AI Pass-Through Configured',
    labelAr: 'استثناء بوتات الذكاء الاصطناعي من جدران الحماية WAF',
    weight: 15,
    descEn: 'Prevents Cloudflare Bot Fight Mode from dropping AI requests.',
    descAr: 'يمنع جدار الحماية من حظر استفسارات شات جي بي تي تلقائياً.',
  },
  {
    id: 'entity',
    labelEn: 'Brand Entity Grounding & Verified Social sameAs',
    labelAr: 'توثيق العلامة التجارية وروابط شبكات التواصل sameAs',
    weight: 10,
    descEn: 'Validates corporate legitimacy in the Google Knowledge Graph.',
    descAr: 'يوثق الكيان الرسمي للموقع في لوحة المعرفة الرقمية.',
  },
  {
    id: 'semantic',
    labelEn: 'Semantic HTML Tables & Definition Lists (<dl>)',
    labelAr: 'جداول HTML دلالية وقوائم تعريفية (<dl>)',
    weight: 10,
    descEn: 'Enables deterministic parsing of technical specs and pricing.',
    descAr: 'يسهل على نماذج اللغة قراءة المواصفات والأسعار بدقة 100%.',
  },
];

export default function AeoPredictorCalculator({ lang }: AeoPredictorCalculatorProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({
    schema: true,
    robots: true,
    waf: false,
    bluf: true,
    entity: false,
    semantic: false,
  });

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalScore = CRITERIA.reduce((acc, curr) => {
    return acc + (selectedItems[curr.id] ? curr.weight : 0);
  }, 0);

  const getVerdict = (score: number) => {
    if (score >= 85) {
      return {
        labelEn: 'Dominant AI Citation Authority (Top 2% of Web)',
        labelAr: 'سلطة اقتباس ذكاء اصطناعي كاسحة (أفضل 2% من المواقع)',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        descEn: 'ChatGPT Search, Perplexity, and Google Gemini are highly likely to quote your content as a verified primary source.',
        descAr: 'فرصة شبه مؤكدة لاقتباس موقعك كمصدر رسمي وموثوق في إجابات ChatGPT و Perplexity و Gemini.',
      };
    }
    if (score >= 60) {
      return {
        labelEn: 'Moderate AI Indexability (Requires WAF & Schema Hardening)',
        labelAr: 'ظهور متوسط (يحتاج ضبط جدار الحماية وهيكلة السكيما)',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        descEn: 'AI bots may crawl your pages but struggle with neural chunking and entity verification. Complete remaining items to lock in citations.',
        descAr: 'روبوتات الذكاء الاصطناعي تصل للموقع ولكنها قد تتجاهله لصالح المنافسين بسبب غياب بعض المعايير.',
      };
    }
    return {
      labelEn: 'Critical AI Invisibility Risk (High Exclusion Probability)',
      labelAr: 'خطر الاختفاء التام عن محركات بحث الذكاء الاصطناعي',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30',
      descEn: 'Your site is currently at high risk of being blocked by WAF or ignored by ChatGPT Search in favor of properly structured competitors.',
      descAr: 'موقعك مهدد بالحظر التلقائي من جدران الحماية أو التجاهل التام من إجابات شات جي بي تي.',
    };
  };

  const verdict = getVerdict(totalScore);

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#121222] via-[#0b0b14] to-[#07070b] p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[10px] sm:text-xs font-bold text-emerald-300">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'حاسبة احتمالية الظهور في بحث AI' : 'Interactive AEO Citation Probability Engine'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'احسب احتمالية اقتباس موقعك في ChatGPT و Perplexity'
              : 'Calculate Your 2026 AI Search Citation Probability'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'حدد المعايير الفنية المفعلة في موقعك لمعرفة نسبة احتمالية استشهاد الذكاء الاصطناعي بمحتواك.'
              : 'Toggle your active technical assets to compute your exact mathematical citation probability across ChatGPT Search and Perplexity.'}
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3 shrink-0">
          <Bot className="w-5 h-5 text-cyan-300" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">AEO Benchmark</div>
            <div className="text-sm font-mono font-black text-cyan-300">2026 Neural Retrieval</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Checklist */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {lang === 'ar' ? 'العوامل الفنية الستة المؤثرة على بحث AI' : 'The 6 Core Technical AEO Ranking Factors'}
          </div>

          {CRITERIA.map((item) => {
            const isChecked = selectedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer select-none group ${
                  isChecked
                    ? 'border-indigo-500/40 bg-indigo-950/20 hover:bg-indigo-950/30'
                    : 'border-white/10 bg-black/30 hover:bg-white/[0.03]'
                }`}
              >
                <div className="space-y-1 pr-3 rtl:pr-0 rtl:pl-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                      {lang === 'ar' ? item.labelAr : item.labelEn}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-cyan-300">
                      (+{item.weight}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {lang === 'ar' ? item.descAr : item.descEn}
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition ${
                    isChecked
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'border-white/20 bg-white/5 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Score Gauge Card */}
        <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl border border-white/15 bg-black/70 shadow-2xl flex flex-col items-center text-center">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              {lang === 'ar' ? 'احتمالية الاستشهاد الذكي' : 'Calculated Citation Probability'}
            </span>
            <div className="text-5xl sm:text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 pt-2">
              {totalScore}%
            </div>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                totalScore >= 80
                  ? 'from-indigo-500 to-emerald-400'
                  : totalScore >= 50
                  ? 'from-amber-500 to-indigo-500'
                  : 'from-rose-500 to-amber-500'
              }`}
              style={{ width: `${totalScore}%` }}
            ></div>
          </div>

          {/* Verdict Box */}
          <div className={`w-full p-4 rounded-2xl border text-left rtl:text-right space-y-1.5 ${verdict.bg}`}>
            <div className={`text-xs font-bold ${verdict.color}`}>
              {lang === 'ar' ? verdict.labelAr : verdict.labelEn}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {lang === 'ar' ? verdict.descAr : verdict.descEn}
            </p>
          </div>

          <div className="pt-2 w-full">
            <a
              href="#audit-engine"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>{lang === 'ar' ? 'افحص موقعك فوراً بالماسح الضوئي' : 'Run Full Live Website Audit'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
