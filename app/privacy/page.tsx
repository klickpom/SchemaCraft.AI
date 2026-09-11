import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import { ArticlePage } from '@/components/ArticlePage';
import { SUPPORT_EMAIL, webPageGraph } from '@/lib/seo/jsonld';
import { canonicalUrl } from '@/lib/seo/urls';

const TITLE = 'Privacy Policy';
const DESCRIPTION =
  'SchemaCraft AI does not require an account. Payments go through PayPal. Audit fetches send the target URL to our server so the page can be retrieved.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl('/privacy/') },
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageGraph('/privacy/', TITLE, DESCRIPTION)),
        }}
      />
      <SiteChrome>
        <ArticlePage
          title={TITLE}
          lede="Last updated 11 September 2026. This policy describes what SchemaCraft AI collects when you use schemacraft-ai.site."
        >
          <h2>Who we are</h2>
          <p>
            SchemaCraft AI operates this website. Contact:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Audit URLs.</strong> When you run an audit, the URL you submit is sent to our server so
              we can fetch that page. We need the URL to retrieve HTML, headers, robots.txt, and JSON-LD. We
              do not ask you to create an account for this.
            </li>
            <li>
              <strong>Payments.</strong> If you buy the $9 pass, PayPal processes the payment. We do not store
              your full card number on this site.
            </li>
            <li>
              <strong>Unlock flag.</strong> A Pro unlock flag is stored in your browser localStorage so the
              tool remembers the purchase on that device.
            </li>
            <li>
              <strong>Hosting logs.</strong> The host (Hostinger) and CDN may log IP address, user-agent, and
              requested path as part of normal website operation.
            </li>
          </ul>
          <h2>What we do not do</h2>
          <p>
            We do not sell personal data. We do not require a login. JSON-LD validation runs in your browser
            and does not need to send the snippet to our server.
          </p>
          <h2>Cookies</h2>
          <p>
            This site does not use a marketing pixel or an analytics cookie of our own. Third parties such as
            PayPal may set cookies if you open checkout.
          </p>
          <h2>Retention</h2>
          <p>
            Server audit requests are processed to return a report. Hosting logs follow the host’s default
            retention. Emails you send to support are kept as long as needed to answer you and handle refunds.
          </p>
          <h2>Your choices</h2>
          <p>
            You can stop submitting URLs at any time. You can clear localStorage in your browser to remove the
            Pro flag. For a refund or a data request, email {SUPPORT_EMAIL}.
          </p>
        </ArticlePage>
      </SiteChrome>
    </>
  );
}
