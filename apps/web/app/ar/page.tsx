import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { homepageGraph } from '@/lib/seo/jsonld';
import { canonicalUrl, ogImageUrl } from '@/lib/seo/urls';

const TITLE = 'فحص سيو مجاني: هل يقرأ ChatGPT موقعك؟';
const DESCRIPTION =
  'افحص مجاناً هل يستطيع ChatGPT وجوجل وPerplexity وClaude الزحف لموقعك وفهمه والاقتباس منه. حوالي 50 فحصاً للسيو وGEO وAEO مع الدليل والإصلاح.';

export const metadata: Metadata = {
  title: `${TITLE} | SchemaCraft`,
  description: DESCRIPTION,
  alternates: {
    canonical: canonicalUrl('/ar/'),
    languages: { en: canonicalUrl('/'), ar: canonicalUrl('/ar/'), 'x-default': canonicalUrl('/') },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonicalUrl('/ar/'),
    siteName: 'SchemaCraft AI',
    images: [{ url: ogImageUrl(), width: 1200, height: 630, alt: 'SchemaCraft AI — فحص مجاني لظهور موقعك في البحث الذكي' }],
    locale: 'ar_EG',
    alternateLocale: ['en_US'],
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

export default function ArabicHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageGraph('ar')) }} />
      <HomeClient lang="ar" />
    </>
  );
}
