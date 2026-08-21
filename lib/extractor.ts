import { SchemaCategory, SCHEMA_DEFINITIONS } from './schemaTypes';

export interface ExtractedResult {
  detectedType: SchemaCategory;
  parsedValues: Record<string, any>;
  rawConfidence: number; // 0 to 100
  extractedFrom: 'jsonld' | 'opengraph' | 'unstructured-text' | 'html-snippet';
  summary: string;
}

export const EXTRACTOR_PRESETS = [
  {
    name: 'Shopify / E-Commerce Product',
    type: 'Product' as SchemaCategory,
    snippet: `<!-- Shopify Product Meta Snippet -->
<meta property="og:title" content="AeroFlow Carbon Fiber Wireless Mouse" />
<meta property="og:description" content="Ultra-lightweight 49g ergonomic gaming mouse with 8K optical polling rate and 90-hour battery life." />
<meta property="og:image" content="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80" />
<meta property="product:price:amount" content="129.00" />
<meta property="product:price:currency" content="USD" />
<meta property="product:brand" content="Veloce Gear" />
<meta property="product:availability" content="in stock" />`,
  },
  {
    name: 'Next.js SaaS Landing Page',
    type: 'SoftwareApplication' as SchemaCategory,
    snippet: `{
  "title": "QueryFlow AI - PostgreSQL Query Optimizer",
  "category": "DeveloperApplication",
  "platform": "macOS, Linux, Cloud",
  "pricing": "29",
  "currency": "USD",
  "rating": 4.95,
  "reviews": 840,
  "description": "Autonomous database index optimizer and slow query diagnostic engine for modern high-scale engineering teams."
}`,
  },
  {
    name: 'Technical FAQ Page Data',
    type: 'FAQPage' as SchemaCategory,
    snippet: `Q: How does JSON-LD improve Generative AI search rankings?
A: AI Overviews in Google and Perplexity use JSON-LD to extract deterministic entity relationships, eliminating hallucination risks and dramatically increasing direct citation probability.

Q: Is SchemaCraft compatible with Next.js 15 App Router?
A: Yes, SchemaCraft outputs type-safe <script type="application/ld+json"> blocks designed for Server Components with zero hydration overhead.

Q: Does Google penalize invalid structured data?
A: While Google does not issue direct manual penalties for missing optional fields, invalid syntax causes immediate disqualification from rich snippet visual enhancements.`,
  },
  {
    name: 'Local Tech Hub & Café',
    type: 'LocalBusiness' as SchemaCategory,
    snippet: `Apex Labs & Artisan Espresso
Address: 742 Evergreen Terrace, Palo Alto, CA 94301
Phone: +1 650-555-0143
Hours: Mon-Fri 06:30 - 20:00, Sat-Sun 08:00 - 18:00
Price: $$
Description: Co-working incubator, gigabit fiber workspace, and single-origin specialty coffee bar in Silicon Valley.`,
  },
];

export function extractSchemaFromInput(input: string): ExtractedResult {
  const trimmed = input.trim();

  // 1. Try parsing direct JSON-LD
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      const target = Array.isArray(parsed) ? parsed[0] : parsed;
      const type = target['@type'] as SchemaCategory;

      if (type && SCHEMA_DEFINITIONS[type]) {
        return {
          detectedType: type,
          parsedValues: { ...SCHEMA_DEFINITIONS[type].defaultValues, ...target },
          rawConfidence: 99,
          extractedFrom: 'jsonld',
          summary: `Successfully parsed direct ${type} JSON-LD AST.`,
        };
      }

      // Check if it's a generic JSON with recognizable fields
      if (parsed.rating || parsed.platform || parsed.category) {
        return {
          detectedType: 'SoftwareApplication',
          parsedValues: {
            name: parsed.title || parsed.name || 'Software App',
            applicationCategory: parsed.category || 'DeveloperApplication',
            operatingSystem: parsed.platform || 'Web, macOS, Windows',
            description: parsed.description || '',
            price: String(parsed.pricing || parsed.price || '0'),
            priceCurrency: parsed.currency || 'USD',
            ratingValue: parsed.rating || '4.9',
            ratingCount: parsed.reviews || '100',
            authorName: parsed.author || 'Company Inc.',
          },
          rawConfidence: 94,
          extractedFrom: 'jsonld',
          summary: 'Inferred SoftwareApplication attributes from JSON payload.',
        };
      }
    } catch {
      // Continue to regex parsers
    }
  }

  // 2. Try parsing FAQ / Q&A text patterns
  const faqRegex = /(?:Q:|Question:|\d+\.)\s*(.+?)\s*(?:A:|Answer:)\s*([\s\S]+?)(?=(?:Q:|Question:|\d+\.)|$)/gi;
  const faqMatches = [...trimmed.matchAll(faqRegex)];
  if (faqMatches.length >= 2) {
    const faqs = faqMatches.map((m) => ({
      question: m[1].trim(),
      answer: m[2].trim(),
    }));
    return {
      detectedType: 'FAQPage',
      parsedValues: { faqs },
      rawConfidence: 95,
      extractedFrom: 'unstructured-text',
      summary: `Extracted ${faqs.length} high-intent Question & Answer pairs.`,
    };
  }

  // 3. Try parsing HTML Meta / OpenGraph tags
  if (trimmed.includes('<meta') || trimmed.includes('og:')) {
    const titleMatch = trimmed.match(/property="og:title"\s+content="([^"]+)"/i) || trimmed.match(/content="([^"]+)"\s+property="og:title"/i);
    const descMatch = trimmed.match(/property="og:description"\s+content="([^"]+)"/i);
    const imgMatch = trimmed.match(/property="og:image"\s+content="([^"]+)"/i);
    const priceMatch = trimmed.match(/property="product:price:amount"\s+content="([^"]+)"/i);
    const brandMatch = trimmed.match(/property="product:brand"\s+content="([^"]+)"/i);

    if (priceMatch || brandMatch) {
      return {
        detectedType: 'Product',
        parsedValues: {
          name: titleMatch ? titleMatch[1] : 'E-Commerce Product',
          description: descMatch ? descMatch[1] : '',
          image: imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
          brand: brandMatch ? brandMatch[1] : 'Brand Store',
          price: priceMatch ? priceMatch[1] : '99.00',
          priceCurrency: 'USD',
          availability: 'InStock',
          sku: 'SKU-EXTRACTED',
          ratingValue: '4.8',
          reviewCount: '142',
        },
        rawConfidence: 92,
        extractedFrom: 'opengraph',
        summary: 'Extracted OpenGraph e-commerce product schema elements.',
      };
    }
  }

  // 4. Try parsing Local Business text (Address / Phone)
  const phoneMatch = trimmed.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const addressMatch = trimmed.match(/(?:Address:\s*|located at\s*)([^\n]+)/i);
  if (phoneMatch && (addressMatch || trimmed.toLowerCase().includes('hours:'))) {
    const lines = trimmed.split('\n');
    const businessName = lines[0]?.replace(/[#*]/g, '').trim() || 'Local Business';
    return {
      detectedType: 'LocalBusiness',
      parsedValues: {
        name: businessName,
        telephone: phoneMatch[0],
        streetAddress: addressMatch ? addressMatch[1] : '100 Main Street',
        addressLocality: 'San Francisco',
        addressRegion: 'CA',
        postalCode: '94105',
        addressCountry: 'US',
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        openingHours: 'Mo-Fr 08:00-18:00',
      },
      rawConfidence: 88,
      extractedFrom: 'unstructured-text',
      summary: 'Extracted Local Business NAP (Name, Address, Phone) structured footprint.',
    };
  }

  // 5. Default Fallback - Intelligent General Article or Software
  return {
    detectedType: 'Article',
    parsedValues: {
      headline: trimmed.slice(0, 80) || 'Authoritative Technical Guide',
      description: trimmed.slice(0, 200) || 'Comprehensive technical documentation and structured data overview.',
      authorName: 'Data Architect',
      publisherName: 'SchemaCraft',
      datePublished: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    },
    rawConfidence: 75,
    extractedFrom: 'unstructured-text',
    summary: 'Synthesized structured Article markup from raw content input.',
  };
}
