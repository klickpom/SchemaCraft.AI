import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import { canonicalUrl, schemaUrl, SITE_ORIGIN } from '@/lib/seo/urls';

export const SUPPORT_EMAIL = 'support@schemacraft-ai.site';

const HOME = canonicalUrl('/');
const ORG_ID = `${HOME}#organization`;
const WEBSITE_ID = `${HOME}#website`;

export function sitewideGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'SchemaCraft AI',
        url: HOME,
        email: SUPPORT_EMAIL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_ORIGIN}/icon.png`,
        },
        sameAs: [
          'https://x.com/SchemaCraftAI',
          'https://github.com/klickpom/SchemaCraft.AI',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: SUPPORT_EMAIL,
          contactType: 'customer support',
          availableLanguage: ['en', 'ar'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: HOME,
        name: 'SchemaCraft AI',
        description:
          'Free SEO audit and JSON-LD schema generator. Scores are computed only from HTML the server actually retrieved.',
        publisher: { '@id': ORG_ID },
        inLanguage: 'en',
      },
    ],
  };
}

export function homepageGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${HOME}#software`,
        name: 'SchemaCraft AI',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: HOME,
        description:
          'Server-side website audit and in-browser Schema.org JSON-LD generator. Unretrieved pages are marked Not assessed and are not scored.',
        offers: {
          '@type': 'Offer',
          price: '9.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        author: { '@id': ORG_ID },
      },
      {
        '@type': 'HowTo',
        '@id': `${HOME}#howto-audit`,
        name: 'How to run a SchemaCraft website audit',
        description:
          'Fetch a page from SchemaCraft servers, review only inspected checks, then copy JSON-LD if the HTML was retrieved.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Paste a public URL',
            text: 'Enter a publicly reachable https URL. SchemaCraft fetches the page from its server, not from your browser.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Read only inspected results',
            text: 'If HTML cannot be retrieved, no overall score is shown. Checks without evidence are labeled Not assessed.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Copy JSON-LD when you need markup',
            text: 'Use a schema generator for your page type. Valid markup does not guarantee a Google rich result.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${HOME}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the difference between SEO, GEO, and AEO?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SEO targets classic search rankings. GEO structures entities so generative engines can ground a brand. AEO structures concise answers and JSON-LD so answer engines can cite a page when they choose to.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does SchemaCraft fetch the page it audits?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The audit endpoint fetches the URL from SchemaCraft servers and returns status, redirects, headers, HTML, robots.txt, and JSON-LD blocks. The browser does not scrape the target site through CORS proxies.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does valid Schema.org JSON-LD guarantee Google rich results or a CTR increase?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Valid markup is an eligibility signal. Google decides whether to show a rich result. SchemaCraft does not claim a guaranteed click-through-rate lift.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does SchemaCraft AI cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A free audit runs without an account. Full audit access is a $9 USD one-time pass with a 30-day money-back guarantee via support@schemacraft-ai.site.',
            },
          },
        ],
      },
    ],
  };
}

export function webPageGraph(path: string, name: string, description: string) {
  const url = canonicalUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
  };
}

export function jsonLdGeneratorGraph() {
  const url = canonicalUrl('/json-ld-generator/');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: 'JSON-LD Schema Generator',
        url,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        isPartOf: { '@id': WEBSITE_ID },
        publisher: { '@id': ORG_ID },
        description:
          'Free in-browser JSON-LD generators for Product, LocalBusiness, FAQPage, Article, and other Schema.org types.',
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#generators`,
        name: 'Schema.org JSON-LD generators',
        numberOfItems: Object.keys(PROGRAMMATIC_SEO_PAGES).length,
        itemListElement: Object.values(PROGRAMMATIC_SEO_PAGES).map((page, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: page.h1,
          url: schemaUrl(page.slug),
        })),
      },
    ],
  };
}
