'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  ListOrdered,
  Clock,
  DollarSign,
  Wrench,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  CheckCircle2,
  Code2,
  Eye,
  ChevronRight,
} from 'lucide-react';

interface HowToSchemaToolProps {
  lang: Language;
}

interface HowToStep {
  id: string;
  name: string;
  text: string;
  imageUrl: string;
}

export default function HowToSchemaTool({ lang }: HowToSchemaToolProps) {
  const [name, setName] = useState('How to Configure Cloudflare WAF for AI Search Indexing');
  const [description, setDescription] = useState(
    'A comprehensive technical guide on safelisting OAI-SearchBot and PerplexityBot through Cloudflare WAF Custom Rules.'
  );
  const [totalTimeMinutes, setTotalTimeMinutes] = useState('10');
  const [estimatedCost, setEstimatedCost] = useState('0');
  const [currency, setCurrency] = useState('USD');
  const [toolsNeeded, setToolsNeeded] = useState('Cloudflare Dashboard, DNS Access, SchemaCraft Validator');
  const [steps, setSteps] = useState<HowToStep[]>([
    {
      id: '1',
      name: 'Navigate to Security WAF Rules',
      text: 'Log into your Cloudflare account, select your domain, and open the Security > WAF > Custom Rules tab.',
      imageUrl: 'https://schemacraft-ai.site/og-image.png',
    },
    {
      id: '2',
      name: 'Create AI Bot Bypass Filter',
      text: 'Add a new Skip rule matching User-Agent string contains "OAI-SearchBot" or "PerplexityBot".',
      imageUrl: 'https://schemacraft-ai.site/og-image.png',
    },
    {
      id: '3',
      name: 'Deploy and Verify with SchemaCraft',
      text: 'Save and deploy the rule, then run SchemaCraft live crawler to verify 200 OK pass-through status.',
      imageUrl: 'https://schemacraft-ai.site/og-image.png',
    },
  ]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const addStep = () => {
    const newId = Date.now().toString();
    setSteps((prev) => [
      ...prev,
      {
        id: newId,
        name: `Step ${prev.length + 1}: Action Title`,
        text: 'Detailed step execution instructions and parameters.',
        imageUrl: 'https://schemacraft-ai.site/og-image.png',
      },
    ]);
  };

  const removeStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStep = (id: string, field: 'name' | 'text' | 'imageUrl', val: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const generateJsonLdObj = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: name,
      description: description,
      totalTime: `PT${totalTimeMinutes}M`,
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: currency,
        value: estimatedCost,
      },
      tool: toolsNeeded
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => ({
          '@type': 'HowToTool',
          name: t,
        })),
      step: steps.map((s, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: s.name,
        text: s.text,
        image: s.imageUrl,
        url: `https://schemacraft-ai.site/guides/waf-setup#step-${idx + 1}`,
      })),
    };
  };

  const getJsonLdString = () => {
    return JSON.stringify(generateJsonLdObj(), null, 2);
  };

  const handleCopy = async () => {
    try {
      const code = `<script type="application/ld+json">\n${getJsonLdString()}\n</script>`;
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[10px] sm:text-xs font-bold text-emerald-300">
            <ListOrdered className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'مولد سكيما الشروحات والخطوات الإرشادية' : 'Google HowTo Step-by-Step Rich Snippet Architect'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'تفعيل شرائح الخطوات التفاعلية (HowTo Steps) في نتائج بحث جوجل'
              : 'Unlock Google HowTo Multi-Step Rich Results'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولد كود HowTo معتمد يتضمن الخطوات المرقمة والمدة الإجمالية والأدوات المطلوبة للظهور كبطاقة إرشادية بارزة في جوجل.'
              : 'Construct structured HowTo JSON-LD with numbered steps, execution duration, and tool requirements to capture step-by-step SERP cards.'}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-emerald-300 shrink-0">
          Schema.org/HowTo
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'معايير الدليل الإرشادي:' : 'Guide Parameters & Timeline:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'عنوان الدليل (How to...):' : 'Guide Title (How to...):'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'المدة الإجمالية (دقائق):' : 'Total Duration (Minutes):'}
              </label>
              <input
                type="number"
                value={totalTimeMinutes}
                onChange={(e) => setTotalTimeMinutes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'التكلفة المقدرة ($):' : 'Estimated Cost ($):'}
              </label>
              <input
                type="text"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'الأدوات والمستلزمات (مفصولة بفاصلة):' : 'Tools & Requirements (comma-separated):'}
              </label>
              <input
                type="text"
                value={toolsNeeded}
                onChange={(e) => setToolsNeeded(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-300 uppercase">
                {lang === 'ar' ? 'الخطوات التنفيذية (Steps):' : 'Execution Steps:'}
              </span>
              <button
                type="button"
                onClick={addStep}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2 relative group focus-within:border-emerald-500/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      Step #{idx + 1}
                    </span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                    placeholder="Step Title"
                    className="w-full px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                  />

                  <textarea
                    rows={2}
                    value={step.text}
                    onChange={(e) => updateStep(step.id, 'text', e.target.value)}
                    placeholder="Step execution details"
                    className="w-full px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Google HowTo SERP Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google HowTo Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود الشرح' : 'Copy HowTo Schema')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-3 font-sans shadow-xl text-left">
              <div className="text-[11px] text-[#bdc1c6] font-mono leading-none truncate">
                https://schemacraft-ai.site/guides/waf-setup
              </div>
              <h3 className="text-base text-[#8ab4f8] font-bold hover:underline cursor-pointer">
                {name}
              </h3>

              {/* Meta Pills */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {totalTimeMinutes} mins
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  Cost: ${estimatedCost} {currency}
                </span>
              </div>

              {/* Step Accordion List */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step.name}</span>
                    </div>
                    <p className="text-[11px] text-[#bdc1c6] pl-7 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <pre className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-inner max-h-[360px]">
              {`<script type="application/ld+json">\n${getJsonLdString()}\n</script>`}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
