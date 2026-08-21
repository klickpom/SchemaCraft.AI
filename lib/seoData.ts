import { SchemaCategory } from './schemaTypes';

export interface ProgrammaticPageData {
  slug: string;
  schemaCategory: SchemaCategory;
  title: string;
  metaDescription: string;
  h1: string;
  blufSummary: string;
  badge: string;
  ctrBoost: string;
  indexingSpeed: string;
  keyBenefits: { title: string; desc: string }[];
  technicalSpecs: { attribute: string; format: string; requirement: string; googleImpact: string }[];
  faqs: { question: string; answer: string }[];
  presetOverride?: Record<string, any>;
}

export const PROGRAMMATIC_SEO_PAGES: Record<string, ProgrammaticPageData> = {
  'shopify-product': {
    slug: 'shopify-product',
    schemaCategory: 'Product',
    title: 'Shopify Product Schema Generator | Instant 0ms JSON-LD & Rich Snippets',
    metaDescription: 'Generate valid Shopify JSON-LD Product schema with Price, Currency, Stock Status, and Star Ratings. Guaranteed 100% Google Rich Results compliance.',
    h1: 'Shopify Product JSON-LD Schema Architect',
    blufSummary: 'Shopify Product Schema is a structured JSON-LD specification that enables Google Search to display real-time pricing, stock availability badges, and 5-star review ratings directly in SERPs and Google Shopping Graph. SchemaCraft validates your product payload against Google Merchant Center criteria with zero latency.',
    badge: 'Shopify & E-Commerce Pro',
    ctrBoost: '+41.2% SERP CTR',
    indexingSpeed: '< 18 Hours',
    keyBenefits: [
      { title: 'Google Merchant Center Sync', desc: 'Compliant with Google Search Central 2026 product specifications including priceValidUntil and itemCondition.' },
      { title: 'Rich Star Rating Display', desc: 'Renders verified gold star reviews in organic Google results to dramatically lower customer acquisition costs.' },
      { title: 'Liquid One-Click Export', desc: 'Directly output snippets/product-schema.liquid ready for seamless theme integration.' },
    ],
    technicalSpecs: [
      { attribute: 'offers.price', format: 'Decimal String (e.g. "89.00")', requirement: 'Mandatory', googleImpact: 'Triggers SERP Price Badge' },
      { attribute: 'offers.availability', format: 'Schema.org URI (e.g. "InStock")', requirement: 'Mandatory', googleImpact: 'Triggers Green In-Stock Pill' },
      { attribute: 'aggregateRating.ratingValue', format: 'Float (1.0 to 5.0)', requirement: 'Recommended', googleImpact: 'Renders 5-Star Visual Snippet' },
      { attribute: 'image', format: 'Array of absolute URLs (16:9, 4:3, 1:1)', requirement: 'Mandatory', googleImpact: 'Google Image & Shopping Graph' },
    ],
    faqs: [
      {
        question: 'How do I add JSON-LD schema to my Shopify theme without apps slowing down my store?',
        answer: 'You can insert SchemaCraft-generated JSON-LD into your theme.liquid or a dedicated snippet (e.g., snippets/schema-product.liquid) directly before the </head> tag. Because it is pure client-side JSON-LD, it adds 0KB of render-blocking JavaScript and maintains perfect Core Web Vitals.',
      },
    ],
  },

  'nextjs-software': {
    slug: 'nextjs-software',
    schemaCategory: 'SoftwareApplication',
    title: 'Next.js 15 Software Application Schema Generator | App Router & React 19',
    metaDescription: 'Generate type-safe JSON-LD SoftwareApplication schemas for Next.js 15 Server Components. Boost AI Overviews and Google Software Rich Snippets.',
    h1: 'Next.js 15 Software & SaaS Schema Architect',
    blufSummary: 'SoftwareApplication Schema allows developer tools, cloud SaaS platforms, and mobile apps to display verified software categories, operating system compatibility, trial pricing, and developer author entities. SchemaCraft provides server-side ready script tags designed for Next.js App Router.',
    badge: 'Next.js 15 & React 19',
    ctrBoost: '+38.7% Click-Through',
    indexingSpeed: '< 12 Hours',
    keyBenefits: [
      { title: 'Zero Hydration Penalty', desc: 'Pure static JSON-LD script tags executed during server-side rendering with no client bundle footprint.' },
      { title: 'AI Overviews Knowledge Graph', desc: 'Directly guides Perplexity, Claude Web, and OpenAI Search to classify your SaaS capabilities.' },
    ],
    technicalSpecs: [
      { attribute: 'applicationCategory', format: 'Schema.org Category string', requirement: 'Mandatory', googleImpact: 'Categorizes SaaS in Google SERP' },
      { attribute: 'operatingSystem', format: 'Comma-separated string', requirement: 'Mandatory', googleImpact: 'Displays Platform Compatibility' },
    ],
    faqs: [
      {
        question: 'Where should I place the JSON-LD script tag in Next.js 15 App Router?',
        answer: 'Place the <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> inside your app/layout.tsx or app/page.tsx Server Component.',
      },
    ],
  },

  'saas-faq': {
    slug: 'saas-faq',
    schemaCategory: 'FAQPage',
    title: 'SaaS FAQ Schema Generator | Expandable Google SERP Q&A Accordions',
    metaDescription: 'Generate validated FAQPage JSON-LD markup to occupy 2x more visual space on Google Search results and dominate Perplexity Q&A answers.',
    h1: 'High-Conversion SaaS FAQ Schema Architect',
    blufSummary: 'FAQPage Schema formats your questions and answers into verified Schema.org Question/Answer entities. This triggers interactive collapsible accordion drawers directly below your organic search listing on Google, capturing up to 55% more visual SERP area.',
    badge: '2x SERP Real Estate',
    ctrBoost: '+53.4% SERP CTR',
    indexingSpeed: '< 24 Hours',
    keyBenefits: [
      { title: 'Maximum Search Real Estate', desc: 'Expand your listing with up to 3 interactive dropdown answers right in Google SERPs.' },
      { title: 'Generative AI Q&A Feeder', desc: 'Perplexity and ChatGPT citation models prioritize structured Q&A pairs for direct synthesis.' },
    ],
    technicalSpecs: [
      { attribute: 'mainEntity', format: 'Array of Question objects', requirement: 'Mandatory', googleImpact: 'Defines total Q&A list' },
    ],
    faqs: [
      {
        question: 'Can I use FAQ schema on every page of my website?',
        answer: 'Google guidelines permit FAQPage schema on pages where the content is a genuine list of questions and answers created by the site authority.',
      },
    ],
  },

  'local-seo-schema': {
    slug: 'local-seo-schema',
    schemaCategory: 'LocalBusiness',
    title: 'Local Business SEO Schema Generator | Google Local 3-Pack & Maps',
    metaDescription: 'Generate Google Maps & Local Pack compliant JSON-LD schema with complete NAP (Name, Address, Phone), Opening Hours, and Price Range.',
    h1: 'Local Business & Local SEO Schema Architect',
    blufSummary: 'LocalBusiness Schema embeds structured geographical and operational metadata including exact street address, telephone, price range, and opening hours. It is the single most critical ranking signal for Google Local 3-Pack and voice assistant queries.',
    badge: 'Google Maps & Local 3-Pack',
    ctrBoost: '+64.1% Local Inquiries',
    indexingSpeed: '< 24 Hours',
    keyBenefits: [
      { title: 'Google Maps Knowledge Sync', desc: 'Binds your official website domain to your Google Business Profile entity.' },
      { title: 'Voice Search Ready', desc: 'Optimized for "near me" voice queries across Apple Siri, Google Assistant, and Amazon Alexa.' },
    ],
    technicalSpecs: [
      { attribute: 'address.streetAddress', format: 'Physical street address', requirement: 'Mandatory', googleImpact: 'Pins Local 3-Pack Location' },
      { attribute: 'telephone', format: 'E.164 format', requirement: 'Mandatory', googleImpact: 'Unlocks "Click-to-Call" Button' },
    ],
    faqs: [
      {
        question: 'How does LocalBusiness schema impact Google Maps rankings?',
        answer: 'LocalBusiness schema provides unambiguous machine-readable confirmation of your address and operating hours.',
      },
    ],
  },
};
