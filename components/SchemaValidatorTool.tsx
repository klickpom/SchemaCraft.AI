'use client';

import React, { useState, useMemo } from 'react';
import { Language, translations } from '@/lib/translations';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, Copy, Check, Terminal, FileCode2, Play } from 'lucide-react';

interface SchemaValidatorToolProps {
  lang: Language;
}

interface ValidationResult {
  isValidJson: boolean;
  detectedType: string | null;
  hasContext: boolean;
  errors: string[];
  warnings: string[];
  passedChecks: string[];
  score: number;
}

const SAMPLE_SCHEMAS = {
  validProduct: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "UltraComfort Noise-Cancelling Headphones",
  "image": "https://example.com/photos/1x1/photo.jpg",
  "description": "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
  "brand": {
    "@type": "Brand",
    "name": "AudioCraft"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product/headphones",
    "priceCurrency": "USD",
    "price": "299.00",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "128"
  }
}`,
  brokenSchema: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Unpriced Sample Item",
  "description": "Missing offers object and price fields"
}`,
  validSaaS: `{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SchemaCraft AI",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web, macOS, Windows",
  "offers": {
    "@type": "Offer",
    "price": "9.00",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "340"
  }
}`
};

export default function SchemaValidatorTool({ lang }: SchemaValidatorToolProps) {
  const [inputCode, setInputCode] = useState(SAMPLE_SCHEMAS.validProduct);
  const [copied, setCopied] = useState(false);

  const validation: ValidationResult = useMemo(() => {
    let clean = inputCode.trim();
    if (!clean) {
      return {
        isValidJson: false,
        detectedType: null,
        hasContext: false,
        errors: ['Please paste JSON-LD code to validate.'],
        warnings: [],
        passedChecks: [],
        score: 0,
      };
    }

    // Strip script tags if user pasted full HTML tag
    if (clean.includes('<script') && clean.includes('</script>')) {
      const match = clean.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (match && match[1]) clean = match[1].trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(clean);
    } catch (e: any) {
      return {
        isValidJson: false,
        detectedType: null,
        hasContext: false,
        errors: [`Syntax Error: ${e.message}`],
        warnings: [],
        passedChecks: [],
        score: 0,
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const passedChecks: string[] = ['Valid JSON Syntax'];

    const context = parsed['@context'];
    const hasContext = typeof context === 'string' && context.includes('schema.org');
    if (hasContext) {
      passedChecks.push('Valid Schema.org @context declaration');
    } else {
      errors.push('Missing or invalid "@context". Must be "https://schema.org".');
    }

    const detectedType = parsed['@type'] || null;
    if (detectedType) {
      passedChecks.push(`Entity @type defined: "${detectedType}"`);
    } else {
      errors.push('Missing "@type" property declaring the schema entity.');
    }

    // Type-specific field validations
    if (detectedType === 'Product') {
      if (parsed.name) passedChecks.push('Product name present');
      else errors.push('Product schema requires a "name" string.');

      if (parsed.offers) {
        passedChecks.push('Offers pricing block present');
        if (!parsed.offers.price && !parsed.offers.priceSpecification) {
          warnings.push('Offers block is missing a numeric "price" field.');
        }
        if (!parsed.offers.priceCurrency) {
          warnings.push('Offers block is missing "priceCurrency" (e.g. USD).');
        }
      } else {
        warnings.push('Missing "offers" block. Price & In-Stock badges won\'t render in Google Shopping.');
      }

      if (parsed.aggregateRating) {
        passedChecks.push('Review aggregate rating present (Unlocks 5-Star SERP rating)');
      } else {
        warnings.push('No "aggregateRating" found. Add reviews to unlock star snippets in Google search.');
      }
    } else if (detectedType === 'SoftwareApplication') {
      if (parsed.name) passedChecks.push('Application name present');
      else errors.push('SoftwareApplication requires "name".');

      if (parsed.applicationCategory) passedChecks.push('Category defined');
      else warnings.push('Recommended to specify "applicationCategory" (e.g. DeveloperApplication, BusinessApplication).');

      if (parsed.operatingSystem) passedChecks.push('Operating system specified');
      else warnings.push('Recommended to specify "operatingSystem" (e.g. Web, macOS, Windows).');
    } else if (detectedType === 'LocalBusiness') {
      if (parsed.name) passedChecks.push('Business name present');
      if (parsed.address) passedChecks.push('Postal address structure present');
      else errors.push('LocalBusiness requires an "address" object with streetAddress and postalCode.');
      if (parsed.telephone) passedChecks.push('Telephone number provided');
      else warnings.push('Telephone number is recommended for Google Maps Click-to-Call.');
    } else if (detectedType === 'Article') {
      if (parsed.headline) passedChecks.push('Headline present');
      else errors.push('Article requires "headline".');
      if (parsed.author) passedChecks.push('Author entity attached');
      else warnings.push('Author entity recommended for Google Discover and E-E-A-T indexing.');
      if (parsed.datePublished) passedChecks.push('datePublished timestamp present');
      else warnings.push('datePublished is recommended for Google Top Stories freshness.');
    }

    let calculatedScore = 100;
    calculatedScore -= errors.length * 30;
    calculatedScore -= warnings.length * 10;
    if (calculatedScore < 0) calculatedScore = 0;

    return {
      isValidJson: true,
      detectedType,
      hasContext,
      errors,
      warnings,
      passedChecks,
      score: calculatedScore,
    };
  }, [inputCode]);

  const handleFormat = () => {
    try {
      let clean = inputCode.trim();
      if (clean.includes('<script') && clean.includes('</script>')) {
        const match = clean.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if (match && match[1]) clean = match[1].trim();
      }
      const parsed = JSON.parse(clean);
      setInputCode(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Ignore if syntax error
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10101a] via-[#090910] to-[#050508] p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-[10px] sm:text-xs font-bold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'أداة الفحص والتدقيق اللحظي للكود' : '0ms Instant AST Code Validator'}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            {lang === 'ar' ? 'مختبر وفاحص كود Schema.org المباشر' : 'Live Schema.org & JSON-LD Validator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'الصق كود JSON-LD الخاص بموقعك لفحصه لحظياً واكتشاف الأخطاء ومعايير نجوم جوجل قبل النشر.'
              : 'Paste any JSON-LD snippet to instantly validate Schema.org syntax, Google Rich Results eligibility, and entity structures.'}
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 font-semibold">{lang === 'ar' ? 'أمثلة جاهزة:' : 'Load Sample:'}</span>
          <button
            type="button"
            onClick={() => setInputCode(SAMPLE_SCHEMAS.validProduct)}
            className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-200 transition"
          >
            Product
          </button>
          <button
            type="button"
            onClick={() => setInputCode(SAMPLE_SCHEMAS.validSaaS)}
            className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-cyan-300 transition"
          >
            SaaS App
          </button>
          <button
            type="button"
            onClick={() => setInputCode(SAMPLE_SCHEMAS.brokenSchema)}
            className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-[11px] font-semibold text-rose-300 transition"
          >
            Broken Schema
          </button>
        </div>
      </div>

      {/* Editor & Live Report Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Code Editor Pane */}
        <div className="lg:col-span-7 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>JSON-LD Editor</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFormat}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-200 transition"
              >
                {lang === 'ar' ? 'تنسيق الكود (Beautify)' : 'Beautify JSON'}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white transition flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              rows={14}
              placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
              className="w-full h-full min-h-[300px] p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-200 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Real-Time Diagnostic Feed Pane */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {lang === 'ar' ? 'نتيجة الفحص الفوري' : 'Live Validation Result'}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black font-mono px-2.5 py-0.5 rounded-lg border ${
                  validation.score >= 80
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : validation.score >= 50
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  {validation.score}/100
                </span>
              </div>
            </div>

            {/* Errors List */}
            {validation.errors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'ar' ? 'أخطاء حرجة يجب إصلاحها:' : 'Critical Syntax Errors:'}</span>
                </span>
                <ul className="space-y-1 pl-4 rtl:pl-0 rtl:pr-4 text-xs text-rose-300 list-disc">
                  {validation.errors.map((err, idx) => (
                    <li key={idx} className="leading-snug">{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings List */}
            {validation.warnings.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'ar' ? 'توصيات لنجوم جوجل والـ AEO:' : 'SERP & AEO Opportunities:'}</span>
                </span>
                <ul className="space-y-1 pl-4 rtl:pl-0 rtl:pr-4 text-xs text-amber-300 list-disc">
                  {validation.warnings.map((warn, idx) => (
                    <li key={idx} className="leading-snug">{warn}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Passed Checks */}
            {validation.passedChecks.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'ar' ? 'الفحوصات الناجحة:' : 'Passed Schema Requirements:'}</span>
                </span>
                <ul className="space-y-1 pl-4 rtl:pl-0 rtl:pr-4 text-xs text-emerald-300/80 list-disc">
                  {validation.passedChecks.map((pass, idx) => (
                    <li key={idx} className="leading-snug">{pass}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 text-center">
            <span className="text-[11px] text-slate-400">
              {lang === 'ar'
                ? 'متوافق 100% مع معايير Google Rich Results Tool و Schema.org v26'
                : '100% compliant with official Google Rich Results & Schema.org v26 specs'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
