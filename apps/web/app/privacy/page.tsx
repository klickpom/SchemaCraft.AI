import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import { ArticlePage } from '@/components/ArticlePage';
import { SUPPORT_EMAIL, webPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates } from '@/lib/seo/urls';

const TITLE = 'Privacy Policy';
const DESCRIPTION =
  'SchemaCraft AI is free and needs no account. When you run an audit, the URL you submit is sent to our server so the page can be fetched. Nothing else is collected.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/privacy/', 'en'),
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
          lede="Last updated 20 October 2026. This policy describes what SchemaCraft AI collects when you use schemacraft-ai.site."
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
              <strong>Hosting logs.</strong> The host (Hostinger) and CDN may log IP address, user-agent, and
              requested path as part of normal website operation.
            </li>
          </ul>
          <h2>What we do not do</h2>
          <p>
            We do not sell personal data. We do not require a login. Pasted JSON-LD, robots.txt and llms.txt
            content is processed in your browser and is not sent to our server. Audit requests are rate-limited
            per IP address; the counter is stored temporarily on the server and is not linked to you.
          </p>
          <h2>Cookies</h2>
          <p>
            This site does not set cookies and does not use a marketing pixel or analytics cookie. Fonts are
            served from our own domain. If you choose Arabic or English, that choice is saved in this browser’s
            local storage so the next page opens in the same language. It is not sent to our server.
          </p>
          <h2>Retention</h2>
          <p>
            Server audit requests are processed to return a report. Hosting logs follow the host’s default
            retention. Emails you send to support are kept as long as needed to answer you.
          </p>
          <h2>Your choices</h2>
          <p>
            You can stop submitting URLs at any time. For a data request, email {SUPPORT_EMAIL}.
          </p>
        </ArticlePage>
      </SiteChrome>
    </>
  );
}
