import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import { arabicSchema } from '@/lib/seo/schemaAr';
import SchemaPageShell from '@/components/SchemaPageShell';
import { canonicalUrl, ogImageUrl, pageAlternates } from '@/lib/seo/urls';
import { withLang } from '@/lib/i18n/path';

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PROGRAMMATIC_SEO_PAGES).map((slug) => ({ type: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const source = PROGRAMMATIC_SEO_PAGES[type];
  if (!source) return { title: 'الصفحة غير موجودة | SchemaCraft AI' };
  const pageData = arabicSchema(source);
  const path = withLang(`/schema/${type}/`, 'ar');
  return {
    title: pageData.title,
    description: pageData.metaDescription,
    alternates: pageAlternates(`/schema/${type}/`, 'ar'),
    openGraph: {
      title: pageData.title,
      description: pageData.metaDescription,
      url: canonicalUrl(path),
      type: 'article',
      siteName: 'SchemaCraft AI',
      locale: 'ar',
      images: [{ url: ogImageUrl(), width: 1200, height: 630, alt: pageData.title }],
    },
  };
}

export default async function ArabicSchemaPage({ params }: PageProps) {
  const { type } = await params;
  const source = PROGRAMMATIC_SEO_PAGES[type];
  if (!source) notFound();
  const pageData = arabicSchema(source);
  const pageUrl = canonicalUrl(withLang(`/schema/${type}/`, 'ar'));
  const homeUrl = canonicalUrl('/ar/');
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${pageUrl}#article`,
        headline: pageData.h1,
        description: pageData.blufSummary,
        inLanguage: 'ar',
        author: { '@type': 'Organization', name: 'SchemaCraft AI', url: canonicalUrl('/') },
        about: { '@type': 'Thing', name: `Schema.org ${pageData.schemaCategory}` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: homeUrl },
          { '@type': 'ListItem', position: 2, name: pageData.badge, item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage: 'ar',
        mainEntity: pageData.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <SchemaPageShell pageData={pageData} lang="ar" />
    </>
  );
}
