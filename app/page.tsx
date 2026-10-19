import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { homepageGraph } from '@/lib/seo/jsonld';
import { canonicalUrl, ogImageUrl } from '@/lib/seo/urls';

const TITLE = 'Free AI SEO Audit & AI Visibility Checker | SchemaCraft';
const DESCRIPTION =
  'Check if ChatGPT, Google, Perplexity and Claude can crawl and cite your page. About 50 SEO, GEO & AEO checks with evidence and exact fixes. Free.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: canonicalUrl('/'),
    languages: { en: canonicalUrl('/'), ar: canonicalUrl('/ar/'), 'x-default': canonicalUrl('/') },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonicalUrl('/'),
    siteName: 'SchemaCraft AI',
    images: [{ url: ogImageUrl(), width: 1200, height: 630, alt: 'SchemaCraft AI — free AI search visibility audit' }],
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl()],
    creator: '@SchemaCraftAI',
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageGraph('en')) }} />
      <HomeClient lang="en" />
    </>
  );
}
