import { HOME_FAQ } from '@/lib/content/home';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import { canonicalUrl, ogImageUrl, schemaUrl, SITE_ORIGIN } from '@/lib/seo/urls';

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
          'Free AI search visibility audit and SEO tools: check whether Google, ChatGPT, Perplexity and Claude can crawl, understand and cite a page.',
        publisher: { '@id': ORG_ID },
        inLanguage: ['en', 'ar'],
      },
    ],
  };
}

export function homepageGraph(lang: 'en' | 'ar' = 'en') {
  const url = canonicalUrl(lang === 'ar' ? '/ar/' : '/');
  const faq = HOME_FAQ[lang];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: lang === 'ar' ? 'فحص مجاني لظهور موقعك في البحث الذكي وجوجل' : 'Free AI Search Visibility Audit',
        inLanguage: lang,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': `${HOME}#app` },
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'WebApplication',
        '@id': `${HOME}#app`,
        name: 'SchemaCraft AI Search Visibility Audit',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'SEO tool',
        operatingSystem: 'Any (web browser)',
        url: HOME,
        inLanguage: ['en', 'ar'],
        isAccessibleForFree: true,
        description:
          'Free audit that fetches a page the way crawlers do and runs about 50 SEO, GEO and AEO checks: AI crawler access (OAI-SearchBot, PerplexityBot, Claude), robots.txt, JavaScript dependence, structured data and answer-ready content. Every result shows its evidence and fix.',
        featureList: [
          'AI crawler access matrix from robots.txt (RFC 9309)',
          'Live requests with Googlebot, OAI-SearchBot, PerplexityBot and ClaudeBot user-agents',
          'JavaScript dependence check for non-rendering AI crawlers',
          'JSON-LD validation against Google required properties',
          'Copy-paste fixes for robots.txt, meta tags and JSON-LD',
        ],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: lang,
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };
}

export function toolPageGraph(opts: { path: string; name: string; description: string; faq?: { q: string; a: string }[]; breadcrumb: string }) {
  const url = canonicalUrl(opts.path);
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebApplication',
      '@id': `${url}#app`,
      name: opts.name,
      url,
      description: opts.description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'SchemaCraft AI', item: HOME },
        { '@type': 'ListItem', position: 2, name: opts.breadcrumb, item: url },
      ],
    },
  ];
  if (opts.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: opts.faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function articleGraph(opts: { path: string; headline: string; description: string; datePublished: string; dateModified: string; breadcrumb: string; faq?: { q: string; a: string }[] }) {
  const url = canonicalUrl(opts.path);
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'TechArticle',
      '@id': `${url}#article`,
      headline: opts.headline,
      description: opts.description,
      url,
      mainEntityOfPage: url,
      datePublished: opts.datePublished,
      dateModified: opts.dateModified,
      inLanguage: 'en',
      image: ogImageUrl(),
      author: { '@type': 'Organization', '@id': ORG_ID, name: 'SchemaCraft AI' },
      publisher: { '@id': ORG_ID },
      isPartOf: { '@id': WEBSITE_ID },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'SchemaCraft AI', item: HOME },
        { '@type': 'ListItem', position: 2, name: opts.breadcrumb, item: url },
      ],
    },
  ];
  if (opts.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: opts.faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
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
