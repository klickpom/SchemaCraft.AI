export type SchemaCategory =
  | 'SoftwareApplication'
  | 'Product'
  | 'FAQPage'
  | 'LocalBusiness'
  | 'MedicalBusiness'
  | 'LegalService'
  | 'Article'
  | 'HowTo'
  | 'Organization'
  | 'Review'
  | 'Course'
  | 'Event'
  | 'Recipe'
  | 'VideoObject';

export interface SchemaFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'array-faq' | 'array-howto' | 'array-reviews';
  placeholder?: string;
  help?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface SchemaTypeDefinition {
  id: SchemaCategory;
  name: string;
  icon: string;
  badge: string;
  description: string;
  googleRichResultType: string;
  fields: SchemaFieldConfig[];
  defaultValues: Record<string, any>;
  generateJsonLd: (values: Record<string, any>) => object;
}

export const SCHEMA_DEFINITIONS: Record<SchemaCategory, SchemaTypeDefinition> = {
  SoftwareApplication: {
    id: 'SoftwareApplication',
    name: 'Software / SaaS App',
    icon: 'Terminal',
    badge: 'AI & SERP Star Ratings',
    description: 'Optimize SaaS apps, developer tools, and cloud platforms for Google Rich Snippets and Perplexity citations.',
    googleRichResultType: 'Software Application',
    fields: [
      { id: 'name', label: 'Application Name', type: 'text', placeholder: 'SchemaCraft AI', required: true, defaultValue: 'SchemaCraft AI' },
      { id: 'applicationCategory', label: 'Category', type: 'select', options: ['DeveloperApplication', 'BusinessApplication', 'DesignApplication', 'UtilitiesApplication', 'MarketingApplication'], required: true, defaultValue: 'DeveloperApplication' },
      { id: 'operatingSystem', label: 'Operating System', type: 'text', placeholder: 'Web, macOS, Windows, Linux', required: true, defaultValue: 'Web, macOS, Windows, Linux' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Ultra-fast real-time JSON-LD schema builder and AEO optimizer.', required: true, defaultValue: 'Ultra-fast real-time JSON-LD schema builder and AEO optimizer with 0ms client-side AST validation and live SERP preview.' },
      { id: 'url', label: 'Application URL', type: 'text', placeholder: 'https://schemacraft.ai', required: true, defaultValue: 'https://schemacraft.ai' },
      { id: 'price', label: 'Price', type: 'text', placeholder: '0', required: true, defaultValue: '0' },
      { id: 'priceCurrency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED', 'SAR'], required: true, defaultValue: 'USD' },
      { id: 'ratingValue', label: 'Rating (0-5)', type: 'number', placeholder: '4.9', defaultValue: '4.9' },
      { id: 'ratingCount', label: 'Rating Count', type: 'number', placeholder: '328', defaultValue: '328' },
      { id: 'authorName', label: 'Developer / Company Name', type: 'text', placeholder: 'SchemaCraft Inc.', defaultValue: 'SchemaCraft Data Systems' },
    ],
    defaultValues: {
      name: 'SchemaCraft AI',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web, macOS, Windows, Linux',
      description: 'Ultra-fast real-time JSON-LD schema builder and AEO optimizer with 0ms client-side AST validation and live SERP preview.',
      url: 'https://schemacraft.ai',
      price: '0',
      priceCurrency: 'USD',
      ratingValue: '4.9',
      ratingCount: '328',
      authorName: 'SchemaCraft Data Systems',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: val.name || 'Application',
      applicationCategory: val.applicationCategory || 'DeveloperApplication',
      operatingSystem: val.operatingSystem || 'All',
      description: val.description || '',
      url: val.url || 'https://example.com',
      offers: {
        '@type': 'Offer',
        price: val.price || '0',
        priceCurrency: val.priceCurrency || 'USD',
      },
      aggregateRating: val.ratingValue ? {
        '@type': 'AggregateRating',
        ratingValue: String(val.ratingValue || '5.0'),
        reviewCount: String(val.ratingCount || '100'),
        bestRating: '5',
        worstRating: '1',
      } : undefined,
      author: {
        '@type': 'Organization',
        name: val.authorName || 'Company',
      },
    }),
  },

  Product: {
    id: 'Product',
    name: 'E-commerce Product',
    icon: 'ShoppingBag',
    badge: 'Price & Stock Badges',
    description: 'Get rich product listings with instant price, stock status, ratings, and merchant badges.',
    googleRichResultType: 'Product Snippet & Merchant Listing',
    fields: [
      { id: 'name', label: 'Product Name', type: 'text', placeholder: 'Ergonomic Titanium Mechanical Keyboard', required: true, defaultValue: 'Ultra-Pro Cloud Mechanical Keyboard' },
      { id: 'description', label: 'Product Description', type: 'textarea', placeholder: 'Aircraft-grade aluminum chassis with hot-swappable tactile switches.', required: true, defaultValue: 'Aircraft-grade wireless mechanical keyboard with ultra-low latency and custom sound dampening.' },
      { id: 'image', label: 'Image URL', type: 'text', placeholder: 'https://example.com/images/product.jpg', required: true, defaultValue: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
      { id: 'brand', label: 'Brand Name', type: 'text', placeholder: 'AcroTech', required: true, defaultValue: 'ApexKey Studio' },
      { id: 'sku', label: 'SKU / Model Number', type: 'text', placeholder: 'KB-TITAN-01', required: true, defaultValue: 'APEX-PRO-98' },
      { id: 'price', label: 'Price', type: 'text', placeholder: '149.00', required: true, defaultValue: '149.00' },
      { id: 'priceCurrency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED', 'SAR'], required: true, defaultValue: 'USD' },
      { id: 'availability', label: 'Availability', type: 'select', options: ['InStock', 'OutOfStock', 'PreOrder'], required: true, defaultValue: 'InStock' },
      { id: 'ratingValue', label: 'Average Rating', type: 'number', placeholder: '4.9', defaultValue: '4.9' },
      { id: 'reviewCount', label: 'Total Reviews', type: 'number', placeholder: '540', defaultValue: '540' },
    ],
    defaultValues: {
      name: 'Ultra-Pro Cloud Mechanical Keyboard',
      description: 'Aircraft-grade wireless mechanical keyboard with ultra-low latency and custom sound dampening.',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      brand: 'ApexKey Studio',
      sku: 'APEX-PRO-98',
      price: '149.00',
      priceCurrency: 'USD',
      availability: 'InStock',
      ratingValue: '4.9',
      reviewCount: '540',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: val.name,
      image: [val.image || 'https://example.com/product.jpg'],
      description: val.description,
      sku: val.sku || 'SKU-001',
      brand: {
        '@type': 'Brand',
        name: val.brand || 'Brand',
      },
      offers: {
        '@type': 'Offer',
        url: 'https://example.com/product',
        priceCurrency: val.priceCurrency || 'USD',
        price: val.price || '99.00',
        availability: `https://schema.org/${val.availability || 'InStock'}`,
        itemCondition: 'https://schema.org/NewCondition',
      },
      aggregateRating: val.ratingValue ? {
        '@type': 'AggregateRating',
        ratingValue: String(val.ratingValue),
        reviewCount: String(val.reviewCount || '10'),
      } : undefined,
    }),
  },

  FAQPage: {
    id: 'FAQPage',
    name: 'FAQ Page / Accordion',
    icon: 'HelpCircle',
    badge: 'SERP Dropdown Expanders',
    description: 'Double your search real estate by rendering interactive Q&A dropdowns directly inside Google Search and AEO.',
    googleRichResultType: 'FAQ Rich Result',
    fields: [
      { id: 'faqs', label: 'FAQ Items (Question & Answer)', type: 'array-faq', required: true },
    ],
    defaultValues: {
      faqs: [
        {
          question: 'What is JSON-LD structured data and why does it matter for SEO?',
          answer: 'JSON-LD (JavaScript Object Notation for Linked Data) is the schema format recommended by Google and Bing. It provides explicit semantic cues about page content, enabling rich snippet badges and direct citations in Perplexity and Google AI Overviews.',
        },
        {
          question: 'How quickly does Google update Rich Snippets after adding schema?',
          answer: 'Google typically discovers updated JSON-LD markup within 48 to 72 hours upon re-crawling. Using Google Search Console URL Inspection can accelerate indexing to under 12 hours.',
        },
        {
          question: 'Does SchemaCraft validate against Schema.org and Google Search Console specs?',
          answer: 'Yes! SchemaCraft runs instant 0ms client-side AST validation against official Google Search Central guidelines and Schema.org v26.0 standards.',
        },
      ],
    },
    generateJsonLd: (val) => {
      const items = (val.faqs || []).map((faq: any) => ({
        '@type': 'Question',
        name: faq.question || 'Untitled Question',
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer || 'Answer text',
        },
      }));
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items,
      };
    },
  },

  LocalBusiness: {
    id: 'LocalBusiness',
    name: 'Local Business & Store',
    icon: 'MapPin',
    badge: 'Google Maps & Local Pack',
    description: 'Dominate Google Local 3-Pack, Apple Maps, and local search queries with structured address, phone, and opening hours.',
    googleRichResultType: 'Local Business Rich Snippet',
    fields: [
      { id: 'name', label: 'Business Name', type: 'text', placeholder: 'Kona Coffee Roasters & Tech Hub', required: true, defaultValue: 'Kona Coffee Roasters & Tech Hub' },
      { id: 'image', label: 'Storefront Image URL', type: 'text', placeholder: 'https://example.com/store.jpg', defaultValue: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80' },
      { id: 'telephone', label: 'Phone Number', type: 'text', placeholder: '+1 (415) 555-0199', required: true, defaultValue: '+1 (415) 555-0199' },
      { id: 'streetAddress', label: 'Street Address', type: 'text', placeholder: '500 Howard Street, Suite 400', required: true, defaultValue: '500 Howard Street, Suite 400' },
      { id: 'addressLocality', label: 'City', type: 'text', placeholder: 'San Francisco', required: true, defaultValue: 'San Francisco' },
      { id: 'addressRegion', label: 'State / Province', type: 'text', placeholder: 'CA', required: true, defaultValue: 'CA' },
      { id: 'postalCode', label: 'Postal / ZIP Code', type: 'text', placeholder: '94105', required: true, defaultValue: '94105' },
      { id: 'addressCountry', label: 'Country', type: 'text', placeholder: 'US', defaultValue: 'US' },
      { id: 'priceRange', label: 'Price Range (e.g. $$)', type: 'text', placeholder: '$$', defaultValue: '$$' },
      { id: 'openingHours', label: 'Opening Hours', type: 'text', placeholder: 'Mo-Fr 07:00-18:00, Sa 08:00-16:00', defaultValue: 'Mo-Fr 07:00-18:00, Sa 08:00-16:00' },
    ],
    defaultValues: {
      name: 'Kona Coffee Roasters & Tech Hub',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      telephone: '+1 (415) 555-0199',
      streetAddress: '500 Howard Street, Suite 400',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US',
      priceRange: '$$',
      openingHours: 'Mo-Fr 07:00-18:00, Sa 08:00-16:00',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: val.name,
      image: val.image,
      telephone: val.telephone,
      priceRange: val.priceRange || '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: val.streetAddress,
        addressLocality: val.addressLocality,
        addressRegion: val.addressRegion,
        postalCode: val.postalCode,
        addressCountry: val.addressCountry || 'US',
      },
      openingHours: val.openingHours ? [val.openingHours] : ['Mo-Su 08:00-20:00'],
    }),
  },

  Article: {
    id: 'Article',
    name: 'Article / Blog Post',
    icon: 'FileText',
    badge: 'Google Discover & News',
    description: 'Boost inclusion into Google Discover, Top Stories, and AI knowledge graph citations with validated journalistic schema.',
    googleRichResultType: 'Article & Top Stories',
    fields: [
      { id: 'headline', label: 'Headline / Title', type: 'text', placeholder: 'How Generative AI Search is Changing Modern Technical SEO', required: true, defaultValue: 'The 2026 Guide to Schema Architecture & Generative AI Overviews' },
      { id: 'description', label: 'Article Summary', type: 'textarea', placeholder: 'A deep architectural dive into structured data engineering...', defaultValue: 'An authoritative technical guide explaining how JSON-LD micro-data directly influences LLM knowledge graphs, Perplexity discovery, and zero-click SERP carousels.' },
      { id: 'image', label: 'Cover Image URL', type: 'text', placeholder: 'https://example.com/cover.jpg', defaultValue: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
      { id: 'authorName', label: 'Author Name', type: 'text', placeholder: 'Dr. Sarah Jenkins', required: true, defaultValue: 'Dr. Evelyn Vance' },
      { id: 'publisherName', label: 'Publisher / Publication', type: 'text', placeholder: 'DataArchitect Quarterly', defaultValue: 'DataArchitect Quarterly' },
      { id: 'datePublished', label: 'Date Published (YYYY-MM-DD)', type: 'text', placeholder: '2026-04-15', defaultValue: '2026-04-15' },
      { id: 'dateModified', label: 'Date Modified (YYYY-MM-DD)', type: 'text', placeholder: '2026-05-01', defaultValue: '2026-05-01' },
    ],
    defaultValues: {
      headline: 'The 2026 Guide to Schema Architecture & Generative AI Overviews',
      description: 'An authoritative technical guide explaining how JSON-LD micro-data directly influences LLM knowledge graphs, Perplexity discovery, and zero-click SERP carousels.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      authorName: 'Dr. Evelyn Vance',
      publisherName: 'DataArchitect Quarterly',
      datePublished: '2026-04-15',
      dateModified: '2026-05-01',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: val.headline,
      description: val.description,
      image: [val.image || 'https://example.com/cover.jpg'],
      datePublished: val.datePublished ? `${val.datePublished}T08:00:00+00:00` : new Date().toISOString(),
      dateModified: val.dateModified ? `${val.dateModified}T08:00:00+00:00` : new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: val.authorName || 'Author',
      },
      publisher: {
        '@type': 'Organization',
        name: val.publisherName || 'Publisher',
      },
    }),
  },

  HowTo: {
    id: 'HowTo',
    name: 'How-To Guide',
    icon: 'Layers',
    badge: 'Step-by-Step Rich Cards',
    description: 'Format multi-step tutorials with supplies, estimated time, and individual step images for Google visual search.',
    googleRichResultType: 'How-To Rich Carousel',
    fields: [
      { id: 'name', label: 'Guide Title', type: 'text', placeholder: 'How to Implement Next.js 15 Structured Data in 5 Minutes', required: true, defaultValue: 'How to Implement Valid JSON-LD Structured Data in Next.js 15' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Step-by-step tutorial for high-performance schema injection.', defaultValue: 'A zero-friction guide to integrating type-safe JSON-LD schemas into modern Next.js 15 server components.' },
      { id: 'totalTime', label: 'Total Time (ISO 8601, e.g. PT5M)', type: 'text', placeholder: 'PT5M', defaultValue: 'PT5M' },
      { id: 'steps', label: 'Steps (Name & Text)', type: 'array-howto', required: true },
    ],
    defaultValues: {
      name: 'How to Implement Valid JSON-LD Structured Data in Next.js 15',
      description: 'A zero-friction guide to integrating type-safe JSON-LD schemas into modern Next.js 15 server components.',
      totalTime: 'PT5M',
      steps: [
        { name: 'Generate Valid Schema', text: 'Select your schema type in SchemaCraft and configure required entity properties.' },
        { name: 'Copy Type-Safe Script', text: 'Copy the formatted <script type="application/ld+json"> tag into your App Router page.tsx.' },
        { name: 'Validate in Rich Results Test', text: 'Test with Google Search Console Rich Results Tool for 100% zero-error compliance.' },
      ],
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: val.name,
      description: val.description,
      totalTime: val.totalTime || 'PT5M',
      step: (val.steps || []).map((step: any, i: number) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: step.name || `Step ${i + 1}`,
        text: step.text || '',
      })),
    }),
  },

  Organization: {
    id: 'Organization',
    name: 'Organization / Brand Knowledge Graph',
    icon: 'Building2',
    badge: 'Knowledge Graph Panel',
    description: 'Claim your Google Knowledge Graph sidebar panel, official logo, verified social links, and executive contacts.',
    googleRichResultType: 'Knowledge Graph & Logo',
    fields: [
      { id: 'name', label: 'Organization Name', type: 'text', placeholder: 'SchemaCraft Global Technologies', required: true, defaultValue: 'SchemaCraft Global Technologies' },
      { id: 'url', label: 'Website URL', type: 'text', placeholder: 'https://schemacraft.ai', required: true, defaultValue: 'https://schemacraft.ai' },
      { id: 'logo', label: 'Logo URL', type: 'text', placeholder: 'https://schemacraft.ai/logo.png', required: true, defaultValue: 'https://schemacraft.ai/logo.png' },
      { id: 'description', label: 'Corporate Bio', type: 'textarea', placeholder: 'Enterprise data architecture and automated schema generation platform.', defaultValue: 'Enterprise data architecture and automated schema generation platform providing 0ms latency AEO intelligence.' },
      { id: 'sameAs', label: 'Social Profiles (comma separated)', type: 'text', placeholder: 'https://twitter.com/schemacraft, https://github.com/schemacraft', defaultValue: 'https://twitter.com/schemacraft, https://github.com/schemacraft, https://linkedin.com/company/schemacraft' },
    ],
    defaultValues: {
      name: 'SchemaCraft Global Technologies',
      url: 'https://schemacraft.ai',
      logo: 'https://schemacraft.ai/logo.png',
      description: 'Enterprise data architecture and automated schema generation platform providing 0ms latency AEO intelligence.',
      sameAs: 'https://twitter.com/schemacraft, https://github.com/schemacraft, https://linkedin.com/company/schemacraft',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: val.name,
      url: val.url,
      logo: val.logo,
      description: val.description,
      sameAs: typeof val.sameAs === 'string'
        ? val.sameAs.split(',').map((s: string) => s.trim()).filter(Boolean)
        : val.sameAs || [],
    }),
  },

  Review: {
    id: 'Review',
    name: 'Review & Aggregate Rating',
    icon: 'Star',
    badge: 'Direct Gold Star Rating',
    description: 'Embed authentic customer ratings to trigger verified 5-star badges in Google Organic & Merchant listings.',
    googleRichResultType: 'Review Snippet',
    fields: [
      { id: 'itemName', label: 'Item / Service Reviewed', type: 'text', placeholder: 'SchemaCraft Pro Suite', required: true, defaultValue: 'SchemaCraft Pro Suite' },
      { id: 'reviewBody', label: 'Review Testimonial', type: 'textarea', placeholder: 'Cut our technical SEO indexing time from 2 weeks to 4 hours.', defaultValue: 'SchemaCraft simplified our Next.js structured data workflow overnight. Our rich snippet CTR surged by 42% within 7 days.' },
      { id: 'authorName', label: 'Reviewer Name', type: 'text', placeholder: 'Marcus Vance, VP of Growth', required: true, defaultValue: 'Marcus Vance, Head of SEO at Veloce' },
      { id: 'ratingValue', label: 'Rating (1-5)', type: 'number', placeholder: '5', required: true, defaultValue: '5' },
      { id: 'bestRating', label: 'Max Rating (Default 5)', type: 'number', placeholder: '5', defaultValue: '5' },
    ],
    defaultValues: {
      itemName: 'SchemaCraft Pro Suite',
      reviewBody: 'SchemaCraft simplified our Next.js structured data workflow overnight. Our rich snippet CTR surged by 42% within 7 days.',
      authorName: 'Marcus Vance, Head of SEO at Veloce',
      ratingValue: '5',
      bestRating: '5',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Thing',
        name: val.itemName || 'Product or Service',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(val.ratingValue || '5'),
        bestRating: String(val.bestRating || '5'),
      },
      author: {
        '@type': 'Person',
        name: val.authorName || 'Verified Reviewer',
      },
      reviewBody: val.reviewBody || '',
    }),
  },

  Course: {
    id: 'Course',
    name: 'Online Course & Curriculum',
    icon: 'GraduationCap',
    badge: 'Google Courses Carousel',
    description: 'Format educational courses, bootcamps, and degree modules for Google Course carousels and AEO synthesis.',
    googleRichResultType: 'Course Rich Result',
    fields: [
      { id: 'courseTitle', label: 'Course Title', type: 'text', placeholder: 'Generative Engine Optimization Mastery', required: true, defaultValue: 'Mastering Generative Engine Optimization (GEO 2026)' },
      { id: 'courseDescription', label: 'Course Overview', type: 'textarea', placeholder: 'Comprehensive guide to deterministic knowledge graph structures.', defaultValue: 'Advanced architectural masterclass on feeding validated JSON-LD schema graphs directly to Perplexity and ChatGPT Search.' },
      { id: 'courseProvider', label: 'Academy / Issuer', type: 'text', placeholder: 'SchemaCraft Academy', required: true, defaultValue: 'SchemaCraft Academy Global' },
      { id: 'price', label: 'Price', type: 'text', placeholder: '199.00', defaultValue: '199.00' },
      { id: 'priceCurrency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'SAR', 'AED'], defaultValue: 'USD' },
    ],
    defaultValues: {
      courseTitle: 'Mastering Generative Engine Optimization (GEO 2026)',
      courseDescription: 'Advanced architectural masterclass on feeding validated JSON-LD schema graphs directly to Perplexity and ChatGPT Search.',
      courseProvider: 'SchemaCraft Academy Global',
      price: '199.00',
      priceCurrency: 'USD',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: val.courseTitle || 'Online Course',
      description: val.courseDescription || '',
      provider: {
        '@type': 'Organization',
        name: val.courseProvider || 'Academy',
      },
      offers: {
        '@type': 'Offer',
        price: val.price || '0',
        priceCurrency: val.priceCurrency || 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
  },

  Event: {
    id: 'Event',
    name: 'Live Event & Webinar',
    icon: 'Calendar',
    badge: 'Google Events Listing',
    description: 'Structure virtual conferences, webinars, and developer summits with dates, venue links, and ticket offers.',
    googleRichResultType: 'Event Rich Result',
    fields: [
      { id: 'eventName', label: 'Event Title', type: 'text', placeholder: 'Global GEO Summit 2026', required: true, defaultValue: 'Global Generative Engine Optimization Summit 2026' },
      { id: 'eventDate', label: 'Start Date (YYYY-MM-DD)', type: 'text', placeholder: '2026-11-15', required: true, defaultValue: '2026-11-15' },
      { id: 'eventLocation', label: 'Virtual URL or Venue', type: 'text', placeholder: 'https://schemacraft-ai.site/summit', required: true, defaultValue: 'https://schemacraft-ai.site/summit-live' },
      { id: 'price', label: 'Ticket Price', type: 'text', placeholder: '99.00', defaultValue: '99.00' },
      { id: 'priceCurrency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'SAR', 'AED'], defaultValue: 'USD' },
    ],
    defaultValues: {
      eventName: 'Global Generative Engine Optimization Summit 2026',
      eventDate: '2026-11-15',
      eventLocation: 'https://schemacraft-ai.site/summit-live',
      price: '99.00',
      priceCurrency: 'USD',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: val.eventName || 'Virtual Tech Event',
      startDate: val.eventDate || '2026-11-15',
      location: {
        '@type': 'VirtualLocation',
        url: val.eventLocation || 'https://example.com/event',
      },
      offers: {
        '@type': 'Offer',
        price: val.price || '0',
        priceCurrency: val.priceCurrency || 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
  },

  MedicalBusiness: {
    id: 'MedicalBusiness',
    name: 'Medical Clinic / Doctor / Dental',
    icon: 'ShieldCheck',
    badge: 'Google Health & Maps Pack',
    description: 'Optimize medical practices, dental clinics, and healthcare providers for Google Maps Local 3-Pack and voice search.',
    googleRichResultType: 'Medical Clinic Rich Snippet',
    fields: [
      { id: 'name', label: 'Clinic / Practice Name', type: 'text', placeholder: 'Apex Dental & Orthodontic Specialists', required: true, defaultValue: 'Apex Dental & Medical Center' },
      { id: 'medicalSpecialty', label: 'Medical Specialty', type: 'text', placeholder: 'Dentistry, Dermatology, Cardiology', required: true, defaultValue: 'Dentistry, General Practice' },
      { id: 'telephone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 234-5678', required: true, defaultValue: '+1 (555) 234-5678' },
      { id: 'streetAddress', label: 'Street Address', type: 'text', placeholder: '742 Evergreen Terrace, Suite 100', required: true, defaultValue: '742 Medical Park Drive, Suite 100' },
      { id: 'addressLocality', label: 'City', type: 'text', placeholder: 'New York', required: true, defaultValue: 'New York' },
      { id: 'addressRegion', label: 'State / Region', type: 'text', placeholder: 'NY', required: true, defaultValue: 'NY' },
      { id: 'postalCode', label: 'Postal Code', type: 'text', placeholder: '10001', required: true, defaultValue: '10001' },
      { id: 'priceRange', label: 'Price Range', type: 'text', placeholder: '$$$', defaultValue: '$$' },
    ],
    defaultValues: {
      name: 'Apex Dental & Medical Center',
      medicalSpecialty: 'Dentistry, General Practice',
      telephone: '+1 (555) 234-5678',
      streetAddress: '742 Medical Park Drive, Suite 100',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      priceRange: '$$',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      name: val.name,
      medicalSpecialty: val.medicalSpecialty,
      telephone: val.telephone,
      priceRange: val.priceRange || '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: val.streetAddress,
        addressLocality: val.addressLocality,
        addressRegion: val.addressRegion,
        postalCode: val.postalCode,
        addressCountry: 'US',
      },
    }),
  },

  LegalService: {
    id: 'LegalService',
    name: 'Law Firm / Attorney / Legal',
    icon: 'ShieldCheck',
    badge: 'Google Legal 3-Pack',
    description: 'High-converting Schema.org markup for law firms, trial attorneys, and corporate legal practices.',
    googleRichResultType: 'Legal Service Rich Snippet',
    fields: [
      { id: 'name', label: 'Law Firm Name', type: 'text', placeholder: 'Sterling & Associates Law Firm', required: true, defaultValue: 'Sterling & Associates Law Firm' },
      { id: 'telephone', label: 'Phone Number', type: 'text', placeholder: '+1 (800) 555-0199', required: true, defaultValue: '+1 (800) 555-0199' },
      { id: 'streetAddress', label: 'Street Address', type: 'text', placeholder: '100 Wall Street, 15th Floor', required: true, defaultValue: '100 Wall Street, 15th Floor' },
      { id: 'addressLocality', label: 'City', type: 'text', placeholder: 'New York', required: true, defaultValue: 'New York' },
      { id: 'addressRegion', label: 'State', type: 'text', placeholder: 'NY', required: true, defaultValue: 'NY' },
      { id: 'postalCode', label: 'Postal Code', type: 'text', placeholder: '10005', required: true, defaultValue: '10005' },
    ],
    defaultValues: {
      name: 'Sterling & Associates Law Firm',
      telephone: '+1 (800) 555-0199',
      streetAddress: '100 Wall Street, 15th Floor',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10005',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      name: val.name,
      telephone: val.telephone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: val.streetAddress,
        addressLocality: val.addressLocality,
        addressRegion: val.addressRegion,
        postalCode: val.postalCode,
        addressCountry: 'US',
      },
    }),
  },

  Recipe: {
    id: 'Recipe',
    name: 'Recipe / Culinary Food',
    icon: 'ShoppingBag',
    badge: 'Google Recipe Carousel',
    description: 'Format cooking recipes with cook time, ingredients, calories, and star ratings for Google Visual Search.',
    googleRichResultType: 'Recipe Rich Carousel',
    fields: [
      { id: 'name', label: 'Recipe Name', type: 'text', placeholder: 'Authentic Artisan Sourdough Bread', required: true, defaultValue: 'Authentic Artisan Sourdough Bread' },
      { id: 'cookTime', label: 'Cook Time (ISO 8601, e.g. PT45M)', type: 'text', placeholder: 'PT45M', required: true, defaultValue: 'PT45M' },
      { id: 'prepTime', label: 'Prep Time (ISO 8601, e.g. PT20M)', type: 'text', placeholder: 'PT20M', required: true, defaultValue: 'PT20M' },
      { id: 'recipeYield', label: 'Yield / Servings', type: 'text', placeholder: '1 loaf (8 servings)', defaultValue: '1 loaf (8 servings)' },
      { id: 'calories', label: 'Calories', type: 'text', placeholder: '180 calories', defaultValue: '180 calories' },
    ],
    defaultValues: {
      name: 'Authentic Artisan Sourdough Bread',
      cookTime: 'PT45M',
      prepTime: 'PT20M',
      recipeYield: '1 loaf (8 servings)',
      calories: '180 calories',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: val.name,
      cookTime: val.cookTime || 'PT45M',
      prepTime: val.prepTime || 'PT20M',
      recipeYield: val.recipeYield || '4 servings',
      nutrition: {
        '@type': 'NutritionInformation',
        calories: val.calories || '250 calories',
      },
    }),
  },

  VideoObject: {
    id: 'VideoObject',
    name: 'Video / YouTube Embed',
    icon: 'Layers',
    badge: 'Google Video Rich Snippets',
    description: 'Format video content with thumbnail, duration, and upload date for Google Video Carousels.',
    googleRichResultType: 'Video Search Carousel',
    fields: [
      { id: 'name', label: 'Video Title', type: 'text', placeholder: 'Complete Technical SEO & AEO Masterclass 2026', required: true, defaultValue: 'Complete Technical SEO & AEO Masterclass 2026' },
      { id: 'description', label: 'Video Description', type: 'textarea', placeholder: 'In-depth tutorial on structured data and AI search optimization.', required: true, defaultValue: 'In-depth tutorial on structured data and AI search optimization.' },
      { id: 'thumbnailUrl', label: 'Thumbnail URL', type: 'text', placeholder: 'https://example.com/thumb.jpg', required: true, defaultValue: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
      { id: 'uploadDate', label: 'Upload Date (YYYY-MM-DD)', type: 'text', placeholder: '2026-06-01', required: true, defaultValue: '2026-06-01' },
    ],
    defaultValues: {
      name: 'Complete Technical SEO & AEO Masterclass 2026',
      description: 'In-depth tutorial on structured data and AI search optimization.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      uploadDate: '2026-06-01',
    },
    generateJsonLd: (val) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: val.name,
      description: val.description,
      thumbnailUrl: [val.thumbnailUrl || 'https://example.com/thumb.jpg'],
      uploadDate: `${val.uploadDate || '2026-06-01'}T08:00:00+00:00`,
    }),
  },
};

export type CodeExportFormat = 'html-script' | 'nextjs-json' | 'shopify-liquid' | 'wordpress-php';

export function formatCodeForOutput(jsonObj: object, format: CodeExportFormat, minified = false): string {
  const jsonString = minified ? JSON.stringify(jsonObj) : JSON.stringify(jsonObj, null, 2);

  switch (format) {
    case 'html-script':
      return `<script type="application/ld+json">\n${jsonString}\n</script>`;

    case 'nextjs-json':
      return `// app/layout.tsx or page.tsx (Next.js 15 App Router)
export default function Page() {
  const jsonLd = ${jsonString};

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}`;

    case 'shopify-liquid':
      return `{% comment %} Paste in snippets/schemacraft-seo.liquid {% endcomment %}
<script type="application/ld+json">
${jsonString}
</script>`;

    case 'wordpress-php':
      return `<?php
/**
 * SchemaCraft AI - Validated JSON-LD Injector
 * Add to functions.php or child theme header hook
 */
add_action('wp_head', function() {
    ?>
    <script type="application/ld+json">
    ${jsonString}
    </script>
    <?php
});`;

    default:
      return jsonString;
  }
}
