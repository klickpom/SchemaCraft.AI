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

  'course-education-schema': {
    slug: 'course-education-schema',
    schemaCategory: 'Course' as any,
    title: 'Online Course & Education Schema Generator | Google Course Rich Results',
    metaDescription: 'Generate Schema.org Course JSON-LD markup to display educational curriculum, certificate provider, and pricing directly in Google Courses search carousel.',
    h1: 'Online Course & Academy Schema Architect',
    blufSummary: 'Course Schema formats educational programs, bootcamps, and certifications into structured entities. Google uses this markup to power the dedicated Course Carousel at the top of education search queries.',
    badge: 'Google Education Carousel',
    ctrBoost: '+48.6% Student Enrollment',
    indexingSpeed: '< 24 Hours',
    keyBenefits: [
      { title: 'Google Course Carousel Display', desc: 'Qualify for prominent card carousels showcasing provider name, syllabus, and course pricing.' },
      { title: 'Knowledge Graph Accreditation', desc: 'Grounds your educational organization as a verified authority in AI training datasets.' },
    ],
    technicalSpecs: [
      { attribute: 'name', format: 'Course Title String', requirement: 'Mandatory', googleImpact: 'Displays Main Course Header' },
      { attribute: 'provider', format: 'Organization Entity', requirement: 'Mandatory', googleImpact: 'Attaches Official Academy Badge' },
    ],
    faqs: [
      {
        question: 'Does Course schema work for individual webinar workshops?',
        answer: 'For individual live events, Event schema is recommended, while for structured self-paced or cohort-based educational curriculums, Course schema is optimal.',
      },
    ],
  },

  'article-google-discover-schema': {
    slug: 'article-google-discover-schema',
    schemaCategory: 'Article',
    title: 'Google Discover & Editorial Article Schema Generator | Top Stories Feed',
    metaDescription: 'Generate valid Schema.org Article JSON-LD markup. Optimize technical blogs and editorial publications for Google Discover and Top Stories inclusion.',
    h1: 'Article & Google Discover Schema Architect',
    blufSummary: 'Article Schema provides critical editorial signals including headline, datePublished, dateModified, author entity, and high-resolution publisher logo. It is essential for Google Discover feeds and Top Stories carousel indexing.',
    badge: 'Google Discover & Top Stories',
    ctrBoost: '+59.3% Feed Impressions',
    indexingSpeed: '< 6 Hours',
    keyBenefits: [
      { title: 'Google Discover Feed Optimization', desc: 'Accelerates algorithmic selection for the personalized Google Discover mobile feed.' },
      { title: 'Instant Freshness Signals', desc: 'Communicates real-time dateModified metadata so crawlers prioritize updated technical content.' },
    ],
    technicalSpecs: [
      { attribute: 'headline', format: 'Up to 110 characters', requirement: 'Mandatory', googleImpact: 'Featured in Top Stories Carousel' },
      { attribute: 'dateModified', format: 'ISO 8601 Timestamp', requirement: 'Mandatory', googleImpact: 'Freshness Indicator in SERP' },
    ],
    faqs: [
      {
        question: 'Why is dateModified so important for Article schema?',
        answer: 'Search engines use dateModified to understand content freshness. Articles with valid dateModified markup often get re-crawled faster and rank higher for timely queries.',
      },
    ],
  },

  'woocommerce-product-schema': {
    slug: 'woocommerce-product-schema',
    schemaCategory: 'Product',
    title: 'WooCommerce Product Schema Generator | WordPress Google Shopping Rich Snippets',
    metaDescription: 'Generate valid WooCommerce Schema.org Product JSON-LD markup with Prices, Stock Availability, and Aggregate Reviews for WordPress.',
    h1: 'WooCommerce Product Schema Architect for WordPress',
    blufSummary: 'WooCommerce Product Schema is structured JSON-LD data designed for WordPress e-commerce stores to trigger rich product badges, in-stock pills, pricing, and 5-star ratings directly in Google organic search and Google Shopping Graph.',
    badge: 'WooCommerce & WordPress E-Com',
    ctrBoost: '+44.5% E-Commerce CTR',
    indexingSpeed: '< 18 Hours',
    keyBenefits: [
      { title: 'Google Shopping Graph Ready', desc: 'Syncs prices, availability, and variations directly with Google search crawlers.' },
      { title: 'Zero Bloat WordPress Hook', desc: 'Replaces heavy, slow WordPress plugins with clean, lightweight JSON-LD script tags.' },
    ],
    technicalSpecs: [
      { attribute: 'offers.price', format: 'Decimal String', requirement: 'Mandatory', googleImpact: 'Displays Live Currency & Price' },
      { attribute: 'offers.availability', format: 'Schema.org Enum', requirement: 'Mandatory', googleImpact: 'Triggers In-Stock Status' },
    ],
    faqs: [
      {
        question: 'How do I add this schema to WooCommerce without conflicting plugins?',
        answer: 'You can hook the generated JSON-LD script directly into wp_head via your child theme functions.php or SchemaCraft snippet generator.',
      },
    ],
  },

  'howto-step-by-step-schema': {
    slug: 'howto-step-by-step-schema',
    schemaCategory: 'HowTo',
    title: 'How-To Step-by-Step Schema Generator | Google Visual Rich Cards',
    metaDescription: 'Generate Schema.org HowTo JSON-LD markup. Display structured step-by-step guides with duration, tools, and images in Google search carousels.',
    h1: 'How-To Step-by-Step Schema Architect',
    blufSummary: 'HowTo Schema organizes instructional and tutorial content into sequential step-by-step entities with time estimates and supply lists, unlocking interactive visual tutorial cards in Google Search.',
    badge: 'Google How-To Carousel',
    ctrBoost: '+52.1% Tutorial Clicks',
    indexingSpeed: '< 12 Hours',
    keyBenefits: [
      { title: 'Step-by-Step Search Cards', desc: 'Presents each tutorial step in a distinct visual card directly on Google results page.' },
      { title: 'Voice Search Step Dictation', desc: 'Allows Google Assistant and smart speakers to read your instructions step-by-step.' },
    ],
    technicalSpecs: [
      { attribute: 'step', format: 'Array of HowToStep objects', requirement: 'Mandatory', googleImpact: 'Renders Numbered Tutorial Steps' },
      { attribute: 'totalTime', format: 'ISO 8601 Duration', requirement: 'Recommended', googleImpact: 'Shows Total Completion Time' },
    ],
    faqs: [
      {
        question: 'What types of pages qualify for HowTo schema?',
        answer: 'Pages that provide a clear sequence of instructions to accomplish a specific task qualify for HowTo schema markup.',
      },
    ],
  },

  'organization-brand-schema': {
    slug: 'organization-brand-schema',
    schemaCategory: 'Organization',
    title: 'Organization & Brand Schema Generator | Google Knowledge Panel & AI Graph',
    metaDescription: 'Generate authoritative Organization Schema.org JSON-LD data with verified logo, corporate bio, social profiles, and executive entity graph.',
    h1: 'Organization & Brand Knowledge Graph Architect',
    blufSummary: 'Organization Schema establishes your corporate identity, official logo, verified social channels, and customer support contact points, claiming your entity within Google Knowledge Graph and AI training datasets.',
    badge: 'Google Knowledge Panel',
    ctrBoost: '+36.8% Brand Authority',
    indexingSpeed: '< 24 Hours',
    keyBenefits: [
      { title: 'Google Knowledge Panel Sidebar', desc: 'Enhances eligibility for official branded sidebar panels on desktop and mobile search.' },
      { title: 'AI Entity Grounding', desc: 'Directly informs ChatGPT Search, Perplexity, and Claude of your official brand identity.' },
    ],
    technicalSpecs: [
      { attribute: 'logo', format: 'High-res image URL', requirement: 'Mandatory', googleImpact: 'Official Knowledge Panel Logo' },
      { attribute: 'sameAs', format: 'Array of verified URLs', requirement: 'Mandatory', googleImpact: 'Connects Official Social Profiles' },
    ],
    faqs: [
      {
        question: 'Where should Organization schema be placed on a website?',
        answer: 'Organization schema is best placed on the homepage or About Us page to declare the authoritative entity of the entire domain.',
      },
    ],
  },

  'event-ticket-schema': {
    slug: 'event-ticket-schema',
    schemaCategory: 'Event',
    title: 'Event & Conference Schema Generator | Google Events Search Cards',
    metaDescription: 'Generate valid Schema.org Event JSON-LD markup for webinars, workshops, concerts, and conferences with live dates and ticketing links.',
    h1: 'Event & Conference Schema Architect',
    blufSummary: 'Event Schema formats conferences, webinars, workshops, and concerts into structured calendar entities. Google displays these directly in the dedicated Google Events search grid with dates, venue location, and booking links.',
    badge: 'Google Events Search Grid',
    ctrBoost: '+61.4% Ticket Reservations',
    indexingSpeed: '< 12 Hours',
    keyBenefits: [
      { title: 'Google Events Grid Placement', desc: 'Appears in interactive event listings with calendar filters and ticket action buttons.' },
      { title: 'Hybrid & Virtual Support', desc: 'Supports both in-person venue locations and online virtual webinar broadcast links.' },
    ],
    technicalSpecs: [
      { attribute: 'startDate', format: 'ISO 8601 Timestamp', requirement: 'Mandatory', googleImpact: 'Displays Event Date & Time Pill' },
      { attribute: 'location', format: 'Place or VirtualLocation', requirement: 'Mandatory', googleImpact: 'Shows Maps Pin or Stream Link' },
    ],
    faqs: [
      {
        question: 'Can I use Event schema for recurring weekly webinars?',
        answer: 'Yes, by defining individual Event instances for each scheduled broadcast date with its respective startDate and endDate.',
      },
    ],
  },
};
