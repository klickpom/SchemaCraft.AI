'use client';

import React, { useState } from 'react';
import { SchemaCategory } from '@/lib/schemaTypes';
import { Monitor, Smartphone, Bot, ExternalLink, ChevronDown, ChevronUp, Star, ShieldCheck, Sparkles } from 'lucide-react';

interface SerpPreviewProps {
  category: SchemaCategory;
  values: Record<string, any>;
  schemaObj: any;
}

export function SerpPreview({ category, values, schemaObj }: SerpPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [mode, setMode] = useState<'serp' | 'ai-overview'>('serp');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Derived display attributes
  const title =
    values.name ||
    values.headline ||
    values.itemName ||
    'SchemaCraft AI - Automated JSON-LD Architecture';

  const description =
    values.description ||
    values.reviewBody ||
    'Ultra-fast real-time JSON-LD schema builder and AEO optimizer with 0ms client-side AST validation and live SERP preview.';

  const url = values.url || 'https://schemacraft.ai';
  const displayHost = 'schemacraft.ai';
  const ratingValue = parseFloat(values.ratingValue || '4.9');
  const ratingCount = values.ratingCount || values.reviewCount || '328';
  const price = values.price || '0';
  const currency = values.priceCurrency || 'USD';
  const availability = values.availability || 'InStock';

  return (
    <div className="rounded-xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 bg-zinc-900/50">
        <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-black/40 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setMode('serp')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mode === 'serp'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Google Rich Result
          </button>
          <button
            type="button"
            onClick={() => setMode('ai-overview')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              mode === 'ai-overview'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bot className="h-3.5 w-3.5 text-cyan-300" />
            AI Overview / Perplexity
          </button>
        </div>

        {mode === 'serp' && (
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md transition-all ${
                device === 'desktop' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Desktop SERP"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md transition-all ${
                device === 'mobile' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Mobile SERP"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Preview Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-start overflow-y-auto">
        {mode === 'serp' ? (
          /* Google SERP Snippet Simulation */
          <div
            className={`rounded-xl border border-zinc-800 bg-[#202124] text-[#bdc1c6] p-4 font-sans transition-all duration-200 ${
              device === 'mobile' ? 'max-w-xs mx-auto text-xs' : 'w-full text-sm'
            }`}
          >
            {/* Site Header / Breadcrumbs */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                SC
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] text-[#e8eaed] font-medium truncate">
                  {values.brand || values.authorName || 'SchemaCraft AI'}
                </span>
                <span className="text-[11px] text-[#9aa0a6] truncate">
                  https://{displayHost} › {category.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Clickable Title */}
            <h3 className="text-[#8ab4f8] text-[16px] font-medium leading-snug hover:underline cursor-pointer mb-1.5">
              {title}
            </h3>

            {/* Rich Badges (Ratings, Price, Stock) */}
            {(values.ratingValue || category === 'Product' || category === 'SoftwareApplication') && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#9aa0a6] mb-1.5">
                {values.ratingValue && (
                  <div className="flex items-center gap-1 text-[#fbbc04]">
                    <span className="font-semibold text-[#e8eaed]">{ratingValue.toFixed(1)}</span>
                    <div className="flex text-[#fbbc04]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(ratingValue)
                              ? 'fill-[#fbbc04] text-[#fbbc04]'
                              : 'text-zinc-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[#9aa0a6]">({ratingCount})</span>
                  </div>
                )}

                {category === 'Product' && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="font-semibold text-[#e8eaed]">
                      {currency === 'USD' ? '$' : currency} {price}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald-400 font-medium">
                      {availability === 'InStock' ? 'In stock' : 'Pre-order'}
                    </span>
                  </>
                )}

                {category === 'LocalBusiness' && values.priceRange && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[#e8eaed] font-medium">{values.priceRange}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald-400">{values.openingHours ? 'Open now' : 'Local store'}</span>
                  </>
                )}
              </div>
            )}

            {/* Snippet Description */}
            <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-3 mb-2">
              {description}
            </p>

            {/* Rich FAQ Accordion Expander (if FAQPage or faqs provided) */}
            {category === 'FAQPage' && values.faqs && values.faqs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-zinc-700/60 space-y-2">
                <span className="text-[11px] font-semibold text-[#8ab4f8] tracking-wide uppercase">
                  People also ask about this
                </span>
                <div className="space-y-1.5">
                  {values.faqs.slice(0, 3).map((faq: any, idx: number) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded border border-zinc-700/40 bg-zinc-800/30 overflow-hidden text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-2 text-left font-medium text-[#e8eaed] hover:text-[#8ab4f8] transition-colors"
                        >
                          <span>{faq.question || 'FAQ Question'}</span>
                          {isOpen ? (
                            <ChevronUp className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-2.5 pb-2 text-[11px] text-[#bdc1c6] leading-relaxed border-t border-zinc-700/30 pt-1.5">
                            {faq.answer || 'Answer description...'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* HowTo Step Carousel Simulation */}
            {category === 'HowTo' && values.steps && values.steps.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-zinc-700/60">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Suggested Steps ({values.totalTime || '5 mins'})
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {values.steps.map((step: any, i: number) => (
                    <div
                      key={i}
                      className="min-w-[140px] rounded-lg bg-zinc-800/50 border border-zinc-700/50 p-2 text-[11px]"
                    >
                      <span className="font-bold text-cyan-400 block mb-0.5">Step {i + 1}</span>
                      <p className="text-[#e8eaed] line-clamp-2">{step.name || step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Perplexity & ChatGPT Generative Search Citation Card */
          <div className="rounded-xl border border-cyan-500/20 bg-zinc-900/90 p-4 space-y-3.5 text-xs">
            {/* AI Citation Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs">
                    Perplexity & ChatGPT Search Citation
                  </h4>
                  <span className="text-[10px] text-zinc-400">
                    Deterministic Entity Grounding
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300 ring-1 ring-cyan-500/30">
                <ShieldCheck className="h-3 w-3" /> High Grounding Score
              </span>
            </div>

            {/* Synthesized Answer Box */}
            <div className="space-y-2 text-zinc-300 leading-relaxed">
              <p>
                According to the verified structured JSON-LD specification for{' '}
                <strong className="text-white">{title}</strong>:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-zinc-300">
                <li>
                  <strong className="text-zinc-100">Primary Entity:</strong> Schema.org/{category}
                </li>
                <li>
                  <strong className="text-zinc-100">Verified Specification:</strong> {description.slice(0, 120)}...
                </li>
                {values.price && (
                  <li>
                    <strong className="text-zinc-100">Price Point:</strong> {currency} {price} ({availability})
                  </li>
                )}
                {values.ratingValue && (
                  <li>
                    <strong className="text-zinc-100">Verified User Rating:</strong> {values.ratingValue} / 5.0 across {ratingCount} audited reviews.
                  </li>
                )}
              </ul>
            </div>

            {/* Citation source pill */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">Source:</span>
                <span className="rounded bg-black/60 border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                  [{displayHost}]
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">100% LLM Parseable AST</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
