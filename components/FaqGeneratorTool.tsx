'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  HelpCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Code2,
  Eye,
} from 'lucide-react';

interface FaqGeneratorToolProps {
  lang: Language;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const PRESETS: Record<string, { nameEn: string; nameAr: string; faqs: FaqItem[] }> = {
  saas: {
    nameEn: 'SaaS / Software Product',
    nameAr: 'تطبيق برمجي أو ساس (SaaS)',
    faqs: [
      {
        id: '1',
        question: 'How fast does SchemaCraft AI index changes with search engines?',
        answer: 'SchemaCraft utilizes the IndexNow protocol and validated Schema.org microdata to notify Bing, Yandex, and AI crawlers in under 12 hours.',
      },
      {
        id: '2',
        question: 'Does this schema generator work with Next.js 15 and WordPress?',
        answer: 'Yes, SchemaCraft generates 0ms client-side JSON-LD formatted for Next.js App Router, WordPress headers, and Shopify Liquid themes.',
      },
      {
        id: '3',
        question: 'Is there a money-back guarantee for the Full Audit?',
        answer: 'Yes, every $9 lifetime audit purchase comes with an unconditional 30-day money-back guarantee.',
      },
    ],
  },
  ecom: {
    nameEn: 'E-Commerce / Shopify Store',
    nameAr: 'متجر تجارة إلكترونية (Shopify / WooCommerce)',
    faqs: [
      {
        id: '1',
        question: 'What is your standard shipping time and return policy?',
        answer: 'Orders are processed within 24 hours with 3-5 day express delivery. We offer 30-day hassle-free returns on all unopened items.',
      },
      {
        id: '2',
        question: 'Are international customs duties and taxes included?',
        answer: 'All customs fees and local VAT taxes are calculated and collected directly at checkout with zero unexpected delivery fees.',
      },
    ],
  },
  clinic: {
    nameEn: 'Medical Clinic / Healthcare',
    nameAr: 'عيادة طبية أو مركز صحي',
    faqs: [
      {
        id: '1',
        question: 'Which health insurance networks are accepted at the clinic?',
        answer: 'We accept all major insurance providers including Aetna, BlueCross BlueShield, Cigna, UnitedHealthcare, and Medicare.',
      },
      {
        id: '2',
        question: 'Can I book same-day emergency medical appointments?',
        answer: 'Yes, same-day urgent care appointments are available daily between 8:00 AM and 6:00 PM via our online portal.',
      },
    ],
  },
};

export default function FaqGeneratorTool({ lang }: FaqGeneratorToolProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>(PRESETS.saas.faqs);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [expandedPreview, setExpandedPreview] = useState<Record<string, boolean>>({
    '0': true,
  });

  const addFaq = () => {
    const newId = Date.now().toString();
    setFaqs((prev) => [
      ...prev,
      {
        id: newId,
        question: lang === 'ar' ? 'سؤال جديد يطرحه العملاء؟' : 'New frequently asked question?',
        answer: lang === 'ar' ? 'إجابة واضحة ودقيقة ومباشرة في حدود 40 إلى 60 كلمة.' : 'A direct, comprehensive answer written in 40-60 words to optimize for AI citation and SERP snippets.',
      },
    ]);
  };

  const removeFaq = (id: string) => {
    if (faqs.length <= 1) return;
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFaq = (id: string, field: 'question' | 'answer', val: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: val } : f))
    );
  };

  const loadPreset = (key: string) => {
    if (PRESETS[key]) {
      setFaqs(PRESETS[key].faqs);
    }
  };

  const generateJsonLd = () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    };
    return JSON.stringify(jsonLd, null, 2);
  };

  const handleCopy = async () => {
    try {
      const code = `<script type="application/ld+json">\n${generateJsonLd()}\n</script>`;
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10101c] via-[#090912] to-[#050508] p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/40 text-[10px] sm:text-xs font-bold text-purple-300">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'ar' ? 'مولد وموسع سكيما الأسئلة الشائعة' : 'Instant FAQPage Schema & SERP Expander'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'ضاعف مساحة ظهور موقعك بنسبة 200% في نتائج بحث جوجل'
              : 'Expand Your Google SERP Real Estate by 200% with FAQPage Schema'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'أضف الأسئلة الشائعة لموقعك لتظهر كقوائم منسدلة داخل نتائج بحث جوجل ويتم اقتباسها كمصادر في بحث الذكاء الاصطناعي.'
              : 'Construct valid FAQPage JSON-LD structured microdata to trigger rich accordion drop-down cards in organic search results.'}
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {Object.keys(PRESETS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => loadPreset(key)}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-black/50 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition font-medium cursor-pointer"
            >
              {lang === 'ar' ? PRESETS[key].nameAr : PRESETS[key].nameEn}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Q&A Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'ar' ? 'الأسئلة والأجوبة الدلالية:' : 'Semantic Q&A Pairs:'}
            </h3>
            <button
              type="button"
              onClick={addFaq}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة سؤال' : 'Add Question'}</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {faqs.map((faq, idx) => (
              <div
                key={faq.id}
                className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-3 relative group focus-within:border-purple-500/50 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-purple-400 font-bold">
                    #{idx + 1}
                  </span>
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFaq(faq.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Remove question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    {lang === 'ar' ? 'السؤال (H3 / Question):' : 'Question (H3):'}
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    {lang === 'ar' ? 'الإجابة المباشرة (Answer):' : 'Direct Answer (BLUF):'}
                  </label>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live SERP Dropdown & Code Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            {/* View Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google SERP Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>JSON-LD Code</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود JSON-LD' : 'Copy JSON-LD')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-3 font-sans shadow-xl text-left">
              <div className="text-[11px] text-[#bdc1c6] font-mono leading-none truncate">
                https://schemacraft-ai.site/faq
              </div>
              <h3 className="text-base text-[#8ab4f8] font-medium hover:underline cursor-pointer">
                Frequently Asked Questions &amp; Technical Answers
              </h3>
              <p className="text-xs text-[#bdc1c6] leading-relaxed">
                Explore expert verified solutions, technical documentation, and comprehensive architectural FAQs.
              </p>

              {/* SERP Accordion Items */}
              <div className="pt-2 border-t border-white/10 divide-y divide-white/10">
                {faqs.map((faq, idx) => {
                  const isExpanded = !!expandedPreview[String(idx)];
                  return (
                    <div key={faq.id} className="py-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedPreview((prev) => ({
                            ...prev,
                            [String(idx)]: !prev[String(idx)],
                          }))
                        }
                        className="w-full flex items-center justify-between text-xs font-medium text-[#e8eaed] hover:text-[#8ab4f8] transition cursor-pointer text-left"
                      >
                        <span>{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <p className="text-[11px] text-[#bdc1c6] mt-2 pl-2 border-l border-purple-500/40 leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <pre className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-inner max-h-[380px]">
              {`<script type="application/ld+json">\n${generateJsonLd()}\n</script>`}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
