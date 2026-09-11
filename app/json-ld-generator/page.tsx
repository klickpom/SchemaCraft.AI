import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteChrome } from '@/components/SiteChrome';
import SchemaDirectoryHub from '@/components/SchemaDirectoryHub';
import { jsonLdGeneratorGraph } from '@/lib/seo/jsonld';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import { canonicalUrl, schemaPath } from '@/lib/seo/urls';
import { CLAIMS } from '@/lib/content/claims';

const TITLE = 'JSON-LD Schema Generator (Free) | SchemaCraft AI';
const DESCRIPTION =
  'Generate Schema.org JSON-LD in your browser for Product, LocalBusiness, FAQPage, Article, and more. Valid markup does not guarantee a Google rich result.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl('/json-ld-generator/') },
  keywords: [
    'JSON-LD generator',
    'schema markup generator',
    'Schema.org JSON-LD',
    'free schema generator',
    'Product schema generator',
    'LocalBusiness JSON-LD',
  ],
};

export default function JsonLdGeneratorPage() {
  const pages = Object.values(PROGRAMMATIC_SEO_PAGES);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGeneratorGraph()) }}
      />
      <SiteChrome>
        <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-12 sm:py-16 space-y-12">
          <header className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Free in-browser tool</p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              JSON-LD schema generator
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              JSON-LD is a script tag that describes a page in Schema.org terms. Search engines can read it
              without guessing from HTML. Pick a type below, fill the fields you actually have on the page,
              and copy the script into your theme or layout.
            </p>
          </header>

          <section className="space-y-4 max-w-3xl text-sm sm:text-[15px] text-slate-300 leading-relaxed">
            <h2 className="text-xl font-bold text-white">What you should put in the markup</h2>
            <p>
              Only properties that are true on the live page. If the page does not show reviews, do not add
              AggregateRating. If the product is not for sale, do not invent an Offer. Google spam policies
              treat fake ratings as a ranking risk, not a shortcut.
            </p>
            <p>{CLAIMS.richResultsDisclaimer}</p>
            <h2 className="text-xl font-bold text-white pt-4">Where to paste it</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Next.js App Router:</strong> a{' '}
                <code className="text-cyan-200">script type=&quot;application/ld+json&quot;</code> in the
                Server Component for that route.
              </li>
              <li>
                <strong className="text-white">WordPress:</strong> a small hook on <code>wp_head</code>, or
                your theme’s header — not a second copy of the same entity on every page.
              </li>
              <li>
                <strong className="text-white">Shopify:</strong> a snippet included in{' '}
                <code>theme.liquid</code> or the product template, using Liquid for live price and
                availability.
              </li>
            </ul>
            <p>
              Need a full-site diagnosis first?{' '}
              <Link href="/" className="text-cyan-300 underline">
                Run the free SEO audit
              </Link>
              . The audit fetches HTML from our server and scores only inspected checks.
            </p>
          </section>

          <nav aria-label="JSON-LD generator types" className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <h2 className="text-sm font-bold text-white mb-3">All generators</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link href={schemaPath(page.slug)} className="text-cyan-300 hover:underline">
                    {page.badge}
                  </Link>
                  <span className="text-slate-500"> — {page.schemaCategory}</span>
                </li>
              ))}
            </ul>
          </nav>

          <SchemaDirectoryHub lang="en" />
        </main>
      </SiteChrome>
    </>
  );
}
