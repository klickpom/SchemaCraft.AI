import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import { ArticlePage } from '@/components/ArticlePage';
import { SUPPORT_EMAIL, webPageGraph } from '@/lib/seo/jsonld';
import { canonicalUrl } from '@/lib/seo/urls';

const TITLE = 'About SchemaCraft AI';
const DESCRIPTION =
  'SchemaCraft AI is a $9 website audit and JSON-LD generator. It fetches pages from its own servers and never invents a score for HTML it did not see.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl('/about/') },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageGraph('/about/', TITLE, DESCRIPTION)),
        }}
      />
      <SiteChrome>
        <ArticlePage title={TITLE} lede={DESCRIPTION}>
          <h2>What this product does</h2>
          <p>
            SchemaCraft AI is a browser tool for two jobs: audit a public URL, and generate Schema.org JSON-LD
            for a page type you choose. The free audit does not require an account. Full issue lists and
            copy-paste fixes are a one-time $9 USD pass, refundable within 30 days.
          </p>
          <h2>How the audit is computed</h2>
          <p>
            The page is fetched from SchemaCraft servers at <code>/api/audit</code>. The response includes the
            final HTTP status, redirect chain, response headers, raw HTML, robots.txt, and extracted JSON-LD
            blocks. Scores are calculated only from that evidence. If HTML cannot be retrieved, the report
            shows that the audit did not complete. Checks without evidence are labeled Not assessed and are
            excluded from the score.
          </p>
          <h2>Who it is for</h2>
          <p>
            SEO agencies, independent consultants, and technical founders who need a fast, inspectable
            diagnosis instead of a black-box grade. It is not a ranking guarantee, a Google partner product,
            or a substitute for Search Console.
          </p>
          <h2>Contact</h2>
          <p>
            Email{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Product updates:{' '}
            <a href="https://x.com/SchemaCraftAI" rel="noopener noreferrer" target="_blank">
              @SchemaCraftAI
            </a>
            . Source:{' '}
            <a href="https://github.com/klickpom/SchemaCraft.AI" rel="noopener noreferrer" target="_blank">
              github.com/klickpom/SchemaCraft.AI
            </a>
            .
          </p>
        </ArticlePage>
      </SiteChrome>
    </>
  );
}
