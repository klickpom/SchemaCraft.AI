import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import { SCHEMA_DEFINITIONS } from '@/lib/schemaTypes';
import SchemaPageShell from '@/components/SchemaPageShell';

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(PROGRAMMATIC_SEO_PAGES).map((slug) => ({
    type: slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const pageData = PROGRAMMATIC_SEO_PAGES[type];

  if (!pageData) {
    return {
      title: 'Schema Not Found | SchemaCraft AI',
    };
  }

  return {
    title: pageData.title,
    description: pageData.metaDescription,
    keywords: [
      `${pageData.schemaCategory} schema generator`,
      `JSON-LD ${pageData.schemaCategory}`,
      'Google rich snippet builder',
      'Schema.org validated data',
      'AEO search optimization',
    ],
    openGraph: {
      title: pageData.title,
      description: pageData.metaDescription,
      url: `https://schemacraft-ai.site/schema/${type}`,
      type: 'article',
      siteName: 'SchemaCraft AI',
      images: [
        {
          url: 'https://schemacraft-ai.site/og-image.png',
          width: 1200,
          height: 630,
          alt: pageData.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title,
      description: pageData.metaDescription,
      images: ['https://schemacraft-ai.site/og-image.png'],
    },
  };
}

export default async function ProgrammaticSchemaPage({ params }: PageProps) {
  const { type } = await params;
  const pageData = PROGRAMMATIC_SEO_PAGES[type];

  if (!pageData) {
    notFound();
  }

  const categoryDef = SCHEMA_DEFINITIONS[pageData.schemaCategory];

  // Specific Page Enhanced Graph: TechArticle + BreadcrumbList + FAQPage
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `https://schemacraft-ai.site/schema/${type}/#article`,
        headline: pageData.h1,
        description: pageData.blufSummary,
        author: {
          '@type': 'Organization',
          name: 'SchemaCraft AI Global',
          url: 'https://schemacraft-ai.site',
        },
        about: {
          '@type': 'Thing',
          name: `Schema.org ${pageData.schemaCategory}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://schemacraft-ai.site/schema/${type}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://schemacraft-ai.site',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Schema Generators',
            item: `https://schemacraft-ai.site/schema/${type}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: pageData.badge,
            item: `https://schemacraft-ai.site/schema/${type}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `https://schemacraft-ai.site/schema/${type}/#faq`,
        mainEntity: pageData.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      {/* Dynamic Page JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <SchemaPageShell
        pageData={pageData}
      />
    </>
  );
}
