'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  DollarSign,
  Building,
  Sparkles,
  Copy,
  Check,
  Code2,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface CourseSchemaToolProps {
  lang: Language;
}

const DIFFICULTY_LEVELS = [
  { id: 'Beginner', nameEn: 'Beginner / Introductory', nameAr: 'مبتدئ / تمهيدي' },
  { id: 'Intermediate', nameEn: 'Intermediate / Practitioner', nameAr: 'متوسط / ممارس' },
  { id: 'Advanced', nameEn: 'Advanced / Professional', nameAr: 'متقدم / خبير مهني' },
];

export default function CourseSchemaTool({ lang }: CourseSchemaToolProps) {
  const [name, setName] = useState('Enterprise AEO & Knowledge Graph Engineering');
  const [description, setDescription] = useState(
    'Master semantic triples, JSON-LD schema synthesis, and neural retrieval optimization for ChatGPT Search and Google Gemini.'
  );
  const [providerName, setProviderName] = useState('SchemaCraft AI Institute');
  const [providerUrl, setProviderUrl] = useState('https://schemacraft-ai.site');
  const [difficulty, setDifficulty] = useState('Advanced');
  const [duration, setDuration] = useState('4 Weeks (12 Hours)');
  const [credential, setCredential] = useState('Certified AI Search Specialist (CAISS)');
  const [price, setPrice] = useState('299.00');
  const [currency, setCurrency] = useState('USD');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const generateJsonLdObj = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: name,
      description: description,
      educationalLevel: difficulty,
      educationalCredentialAwarded: credential,
      provider: {
        '@type': 'Organization',
        name: providerName,
        sameAs: providerUrl,
      },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        courseWorkload: duration,
        offers: {
          '@type': 'Offer',
          price: price,
          priceCurrency: currency,
          category: 'Paid',
          availability: 'https://schema.org/InStock',
        },
      },
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-[10px] sm:text-xs font-bold text-violet-300">
            <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
            <span>{lang === 'ar' ? 'سكيما الدورات والشهادات التعليمية' : 'Google Course & Certification Architect'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'تفعيل بطاقات الدورات والشهادات المعتمدة في نتائج بحث جوجل'
              : 'Unlock Google Course Listing Cards & Educational Snippets'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولد كود Course معتمد للأكاديميات والدورات التدريبية والشهادات المهنية مع توثيق السعر وساعات الدراسة والجهة المانحة.'
              : 'Construct verified Course structured data with difficulty tiers, credential certificates, and workload metrics to capture Google educational carousels.'}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-violet-300 shrink-0">
          Schema.org/Course
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'معايير الدورة والشهادة الأكاديمية:' : 'Course & Accreditation Parameters:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'عنوان الدورة التدريبية:' : 'Course Title:'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'المؤسسة التعليمية / الأكاديمية:' : 'Provider Academy:'}
              </label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'المستوى التعليمي (Level):' : 'Difficulty Tier:'}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-violet-300 font-bold focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                {DIFFICULTY_LEVELS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#0e0e18] text-white">
                    {lang === 'ar' ? d.nameAr : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'مدة الدراسة والعبء التدريبي:' : 'Workload / Duration:'}
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'الرسوم والعملة ($):' : 'Tuition Price & Currency:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-2/3 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-emerald-400 focus:outline-none focus:border-violet-500 font-bold font-mono"
                />
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-1/3 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500 font-bold font-mono"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'الشهادة الممنوحة (Credential Awarded):' : 'Credential Awarded:'}
              </label>
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-amber-300 focus:outline-none focus:border-violet-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Google Course SERP Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google Course Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود الدورة' : 'Copy Course Schema')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-4 font-sans shadow-xl text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono">
                      {providerName}
                    </span>
                    <span className="text-[11px] text-slate-400">• Online</span>
                  </div>
                  <h3 className="text-base text-white font-bold">{name}</h3>
                </div>

                <div className="p-2.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              {/* Course Meta Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div className="p-2 rounded-xl bg-white/[0.04] space-y-0.5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Workload</div>
                  <div className="text-white font-mono">{duration}</div>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.04] space-y-0.5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Level</div>
                  <div className="text-cyan-300 font-semibold">{difficulty}</div>
                </div>

                <div className="col-span-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5 text-amber-300 flex items-center gap-2">
                  <Award className="w-4 h-4 shrink-0" />
                  <span className="font-medium truncate">{credential}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-black text-emerald-400 font-mono">
                  ${price} {currency}
                </span>

                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  View Course
                </button>
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
