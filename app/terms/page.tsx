import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import { ArticlePage } from '@/components/ArticlePage';
import { SUPPORT_EMAIL, webPageGraph } from '@/lib/seo/jsonld';
import { canonicalUrl } from '@/lib/seo/urls';

const TITLE = 'Terms of Use';
const DESCRIPTION =
  'SchemaCraft AI is sold as-is. Audits and JSON-LD do not guarantee rankings, rich results, or traffic. $9 one-time pass with a 30-day refund.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl('/terms/') },
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageGraph('/terms/', TITLE, DESCRIPTION)),
        }}
      />
      <SiteChrome>
        <ArticlePage
          title={TITLE}
          lede="Last updated 11 September 2026. By using schemacraft-ai.site you agree to these terms."
        >
          <h2>The service</h2>
          <p>
            SchemaCraft AI provides a website audit fetched from our servers and in-browser Schema.org JSON-LD
            generators. A free audit is available without an account. Paid features are unlocked with a $9 USD
            one-time pass.
          </p>
          <h2>No ranking or rich-result promise</h2>
          <p>
            Valid JSON-LD, a high audit score, or copy-paste fixes do not guarantee Google rankings, AI
            citations, rich results, or more clicks. Google and other crawlers apply their own policies. If
            we cannot retrieve a page, we do not invent a score.
          </p>
          <h2>Acceptable use</h2>
          <p>
            Submit only URLs you are allowed to inspect. Do not use the audit endpoint to attack, flood, or
            scan systems you do not own or have permission to test. We may rate-limit or block abusive
            traffic.
          </p>
          <h2>Refunds</h2>
          <p>
            If you bought the $9 pass and want a refund within 30 days, email{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the PayPal account used for the
            purchase.
          </p>
          <h2>Limitation of liability</h2>
          <p>
            The tool is provided as-is. To the extent permitted by law, SchemaCraft AI is not liable for lost
            profits, lost rankings, or damages arising from generated markup or audit advice. You remain
            responsible for what you publish on your own site.
          </p>
          <h2>Contact</h2>
          <p>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </ArticlePage>
      </SiteChrome>
    </>
  );
}
