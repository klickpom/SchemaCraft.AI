import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { homepageGraph } from '@/lib/seo/jsonld';
import { canonicalUrl, ogImageUrl } from '@/lib/seo/urls';

const TITLE = 'Free SEO Audit & JSON-LD Schema Generator | SchemaCraft AI';
const DESCRIPTION =
  'Paste a URL. SchemaCraft fetches the page from our server, scores only what it inspected, and generates Schema.org JSON-LD. $9 lifetime. No invented scores.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: canonicalUrl('/'),
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonicalUrl('/'),
    siteName: 'SchemaCraft.AI',
    images: [
      {
        url: ogImageUrl(),
        width: 1200,
        height: 630,
        alt: 'SchemaCraft AI free SEO audit and JSON-LD generator',
      },
    ],
    locale: 'en_US',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageGraph()) }}
      />
      <HomeClient />
    </>
  );
}
