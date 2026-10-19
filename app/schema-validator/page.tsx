import type { Metadata } from 'next';
import Link from 'next/link';
import SchemaValidator from '@/components/tools/SchemaValidator';
import { ContentShell, RELATED } from '@/components/ContentShell';
import { toolPageGraph } from '@/lib/seo/jsonld';
import { canonicalUrl, socialMeta } from '@/lib/seo/urls';

const PATH = '/schema-validator/';
const TITLE = 'Schema Markup Validator: Test JSON-LD for Rich Results';
const DESCRIPTION =
  'Paste JSON-LD or enter a URL to find missing required properties, invalid dates and prices, placeholder values and deprecated types. Handles @graph. Free.';

const FAQ = [
  {
    q: 'How do I test my schema markup?',
    a: 'Paste the JSON-LD, the full <script type="application/ld+json"> tag or the whole page source above — or switch to “Fetch a URL”. Every item is checked, including nested items and everything inside @graph.',
  },
  {
    q: 'What is the difference between an error and a warning?',
    a: 'An error is a property Google lists as required for that rich result type, or a value Google cannot parse (for example a price with a currency symbol or a date that is not ISO 8601). Errors make the item ineligible. Warnings are recommended properties that make the result richer but are not required.',
  },
  {
    q: 'My schema is valid. Why don’t I get rich results?',
    a: 'Valid markup makes a page eligible, not guaranteed. Google also considers site quality, whether the markup matches visible content, and its own policies. Some types have been restricted: FAQ rich results are shown only for well-known government and health sites, and HowTo rich results were retired in 2023.',
  },
  {
    q: 'How is this different from Google’s Rich Results Test?',
    a: 'Google’s test is the authority for Google eligibility and renders JavaScript. This validator is faster, works on pasted snippets, explains each problem in plain language and adds data-quality checks such as placeholder text and relative URLs. Use this while editing, then confirm in Google’s test before publishing.',
  },
  {
    q: 'Does the URL mode see schema added by JavaScript?',
    a: 'No. It reads the HTML your server returns — the same thing most AI crawlers see. If your schema only appears after JavaScript runs, Google can still read it, but many other consumers cannot; server-rendered JSON-LD is safer.',
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl(PATH) },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

export default function SchemaValidatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolPageGraph({ path: PATH, name: 'Schema Markup Validator', description: DESCRIPTION, faq: FAQ, breadcrumb: 'Schema validator' })) }}
      />
      <ContentShell
        crumb="Schema validator"
        eyebrow="Free tool · Paste code or a URL"
        title="Schema markup validator"
        lead={
          <p>
            Check JSON-LD against <strong>Google’s required and recommended properties</strong> for Product, LocalBusiness, Article,
            Event, Recipe, Video, JobPosting, Course, Breadcrumb, FAQ and Organization — and catch the value errors that silently cost
            you rich results.
          </p>
        }
        updated="2026-10-19"
        tool={<SchemaValidator lang="en" />}
        faq={FAQ}
        related={[RELATED.generators, RELATED.audit, RELATED.crawlerChecker]}
      >
        <h2>What it checks</h2>
        <ul>
          <li><strong>JSON syntax</strong> for every block, with the parser’s error message.</li>
          <li><strong><code>@context</code></strong> — without it, the block isn’t read as Schema.org at all.</li>
          <li><strong>Required properties</strong> per type, following Google Search Central’s structured data documentation.</li>
          <li><strong>Recommended properties</strong> on top-level items. Nested references (like a variant link) are not flagged.</li>
          <li><strong>Values</strong>: ISO 8601 dates, numeric prices, ISO 4217 currency codes, rating ranges, absolute URLs.</li>
          <li><strong>Placeholders</strong> left over from templates, such as <code>example.com</code> or “Your Company”.</li>
          <li><strong>Retired features</strong> like HowTo, and the current limits on FAQ rich results.</li>
        </ul>

        <h2>The five JSON-LD mistakes we see most</h2>
        <ol>
          <li><strong>Prices with symbols</strong>: <code>&quot;price&quot;: &quot;$1,299&quot;</code> must be <code>&quot;1299.00&quot;</code> with <code>&quot;priceCurrency&quot;: &quot;USD&quot;</code>.</li>
          <li><strong>Local date formats</strong>: <code>19/10/2026</code> must be <code>2026-10-19</code>.</li>
          <li><strong>Relative image URLs</strong>: <code>/img/shoe.jpg</code> should be the full <code>https://</code> address.</li>
          <li><strong>Ratings without counts</strong>: <code>AggregateRating</code> needs <code>ratingCount</code> or <code>reviewCount</code>.</li>
          <li><strong>Markup that doesn’t match the page</strong>: prices, ratings or FAQs in JSON-LD that visitors can’t see violate Google’s guidelines.</li>
        </ol>

        <h2>Need to write the markup first?</h2>
        <p>
          Use the <Link href="/json-ld-generator/">JSON-LD generators</Link> to build Product, LocalBusiness, Article and other types from a
          form, then paste the result here.
        </p>
      </ContentShell>
    </>
  );
}
