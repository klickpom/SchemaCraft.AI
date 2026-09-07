'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items?: FaqItem[];
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'How do I generate valid JSON-LD schema without coding?',
    answer: 'Select your schema category inside the SchemaCraft Visual Builder. Enter the attributes that are actually visible on the page. The builder generates a JSON-LD script tag in your browser, ready to copy into HTML.',
  },
  {
    question: 'What is the best schema markup for Google AI Overviews and Perplexity citations?',
    answer: 'Google AI Overviews and Perplexity prefer structured JSON-LD over unformatted HTML. Combining SoftwareApplication or Product markup with Organization (and FAQPage for retrieval, not Google FAQ rich results) gives crawlers explicit facts such as pricing, author, and OS compatibility.',
  },
  {
    question: 'How does Schema.org JSON-LD impact organic search click-through rates (CTR)?',
    answer: 'Valid rich-result markup can change how a listing looks when Google chooses to show it. There is no guaranteed CTR lift. Google retired FAQ rich results in 2026, so FAQPage should not be marketed as a SERP expander.',
  },
  {
    question: 'How do I integrate SchemaCraft JSON-LD into Next.js 15 App Router?',
    answer: 'In Next.js 15 App Router Server Components, place the generated JSON-LD object inside a <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> tag within your app/layout.tsx or app/page.tsx. It renders in the initial SSR payload with zero client-side JavaScript hydration overhead.',
  },
  {
    question: 'Is SchemaCraft completely free to use?',
    answer: 'Yes! SchemaCraft provides unlimited, free live generation, real-time AST syntax validation, SERP previews, and one-click copying for single schemas without any mandatory signup or email barriers. Pro upgrades are available for bulk batch multi-page exports and automated dynamic CMS variables.',
  },
  {
    question: 'How do I test my JSON-LD with Google Rich Results Test?',
    answer: 'You can click the "Google Rich Results Test" button directly within the SchemaCraft code preview panel, or copy the generated script and paste it into Google Search Console Rich Results Testing Tool for official Google bot verification.',
  },
];

export function FaqAccordion({ items = DEFAULT_FAQS }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>High-Intent Technical Schema FAQ</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Frequently Asked Questions on JSON-LD Structured Data & AEO
        </h2>
        <p className="text-xs text-zinc-400 max-w-2xl">
          Everything technical architects, SEO engineers, and founders need to know about Schema.org implementation, AI search optimization, and Core Web Vitals.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-md overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-white hover:text-cyan-300 transition-colors gap-4"
              >
                <span className="text-sm font-semibold">{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-white/[0.04]">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
