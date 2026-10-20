import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import { ArticlePage } from '@/components/ArticlePage';
import { SUPPORT_EMAIL, webPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates } from '@/lib/seo/urls';

const TITLE = 'About SchemaCraft AI';
const DESCRIPTION =
  'SchemaCraft AI is a free audit for SEO and AI search visibility. It fetches pages from its own server, scores only what it can verify, and shows the evidence for every point.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/about/', 'en'),
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
            SchemaCraft AI answers one question: can search engines and AI assistants reach, read and quote a
            page? The audit runs about 50 checks across technical SEO, crawlability, content, entity schema and
            AI readiness. Alongside it are free generators and validators for robots.txt, llms.txt and
            JSON-LD. Everything is free, with no account and no paywall.
          </p>
          <h2>How the audit is computed</h2>
          <p>
            The page is fetched from SchemaCraft servers at <code>/api/audit</code>. The response includes the
            final HTTP status, redirect chain, response headers, raw HTML, robots.txt, and extracted JSON-LD
            blocks. Scores are calculated only from that evidence. If HTML cannot be retrieved, the report
            shows that the audit did not complete. Checks without evidence are labeled Not assessed and are
            excluded from the score.
          </p>
          <h2 id="scoring">How the score is calculated</h2>
          <ul>
            <li>
              Every check has a severity weight: critical 5, high 3, medium 2, low 1. Informational checks carry no
              weight.
            </li>
            <li>A pass earns full credit, a warning half, a fail none. Not-assessed checks are left out entirely.</li>
            <li>
              Each of the five categories is the weighted average of its checks. The overall score weights them:
              technical SEO 20%, crawlability 20%, content and answerability 20%, entity and schema 15%, AI search
              readiness 25%.
            </li>
            <li>
              Hard caps stop a good-looking average from hiding a blocker: a page that is noindexed or blocked for
              Googlebot is capped at 40, and a page whose content needs JavaScript or has under 80 words is capped
              at 50. The report always says when a cap applied and why.
            </li>
            <li>
              Blocking AI training crawlers (GPTBot, ClaudeBot, Google-Extended and similar) is a policy choice and
              does not lower the score. Blocking AI search crawlers does.
            </li>
          </ul>
          <h2>What the score does not measure</h2>
          <p>
            Backlinks, domain authority, search demand and competition. A page can score 95 and still rank poorly
            if other sites are more trusted for the topic. The score tells you whether anything on the page is
            stopping search engines and AI assistants from using it.
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
