import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell, RELATED } from '@/components/ContentShell';
import { articleGraph } from '@/lib/seo/jsonld';
import { canonicalUrl } from '@/lib/seo/urls';

const PATH = '/geo-vs-aeo/';
const TITLE = 'GEO vs AEO vs SEO: What’s the Difference and What to Do';
const DESCRIPTION =
  'Generative Engine Optimization, Answer Engine Optimization and SEO explained without hype: what each means, what actually differs, and a practical checklist.';
const UPDATED = '2026-10-19';

const FAQ = [
  {
    q: 'What is GEO (Generative Engine Optimization)?',
    a: 'GEO is making your content likely to be retrieved, trusted and cited by generative AI answers — ChatGPT Search, Perplexity, Google AI Overviews and AI Mode, Claude and Copilot. The term comes from a 2023 research paper by Princeton and Georgia Tech researchers.',
  },
  {
    q: 'What is AEO (Answer Engine Optimization)?',
    a: 'AEO is structuring content so a system can lift a direct answer from it — originally featured snippets and voice assistants, now AI answers too. In practice it means question-shaped headings, a direct answer in the first sentence, and lists or tables for steps and comparisons.',
  },
  {
    q: 'Is GEO replacing SEO?',
    a: 'No. AI search products retrieve pages with search crawlers and search indexes, so a page that cannot be crawled, indexed or trusted for SEO will not be cited either. GEO and AEO add requirements on top of SEO; they do not replace it.',
  },
  {
    q: 'How do I measure traffic from ChatGPT and Perplexity?',
    a: 'In your analytics, look at referrals from chatgpt.com, perplexity.ai, claude.ai, gemini.google.com and copilot.microsoft.com. ChatGPT also adds utm_source=chatgpt.com to many links. Google AI Overviews and AI Mode traffic is included in Search Console’s Performance report under Web search.',
  },
  {
    q: 'Do I need special “AI schema” or llms.txt to appear in AI answers?',
    a: 'No. There is no AI-specific schema type, and no major AI search engine documents llms.txt as a citation signal. Standard Schema.org markup helps machines understand entities, and llms.txt is a harmless extra — but crawl access and clear content matter far more.',
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonicalUrl(PATH), type: 'article' },
};

export default function GeoVsAeoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleGraph({ path: PATH, headline: TITLE, description: DESCRIPTION, datePublished: UPDATED, dateModified: UPDATED, breadcrumb: 'GEO vs AEO vs SEO', faq: FAQ })),
        }}
      />
      <ContentShell
        crumb="GEO vs AEO vs SEO"
        eyebrow="Guide"
        title="GEO vs AEO vs SEO: what’s the difference?"
        lead={
          <p>
            <strong>SEO</strong> gets a page crawled, indexed and ranked. <strong>AEO</strong> shapes it so a system can lift a direct
            answer. <strong>GEO</strong> makes it likely to be retrieved and cited inside AI-generated answers. They stack: AI answers are
            built from pages that already pass SEO basics, so GEO and AEO only work on top of a crawlable, indexable site.
          </p>
        }
        updated={UPDATED}
        faq={FAQ}
        related={[RELATED.audit, RELATED.crawlerChecker, RELATED.crawlers]}
      >
        <h2>The three terms side by side</h2>
        <table>
          <thead>
            <tr><th></th><th>SEO</th><th>AEO</th><th>GEO</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Goal</strong></td><td>Rank in search results</td><td>Be the extracted answer</td><td>Be cited in AI answers</td></tr>
            <tr><td><strong>Where</strong></td><td>Google, Bing</td><td>Featured snippets, voice, AI answers</td><td>ChatGPT, Perplexity, AI Overviews, Claude, Copilot</td></tr>
            <tr><td><strong>Unit</strong></td><td>The page</td><td>The answer passage</td><td>The passage and the source’s trust</td></tr>
            <tr><td><strong>Success metric</strong></td><td>Rankings, clicks</td><td>Snippet ownership</td><td>Citations, AI referrals</td></tr>
          </tbody>
        </table>

        <h2>What is actually different for AI search</h2>
        <h3>1. Different crawlers, different rules</h3>
        <p>
          ChatGPT Search relies on OAI-SearchBot, Perplexity on PerplexityBot, Claude on Claude-SearchBot. Each reads its own robots.txt
          group, and CDN bot protection often blocks them while letting Googlebot through. A site can rank well on Google and still be
          missing from ChatGPT. See the <Link href="/ai-crawlers/">AI crawler list</Link>.
        </p>
        <h3>2. Little or no JavaScript rendering</h3>
        <p>
          Googlebot renders JavaScript; OpenAI’s and Anthropic’s crawlers have been observed fetching but not executing it. Text that only
          appears after scripts run is invisible to them.
        </p>
        <h3>3. Passages, not pages</h3>
        <p>
          AI answers quote or paraphrase short passages. A clear definition in one sentence, a numbered list of steps, or a comparison
          table is easier to use than the same facts spread across paragraphs of marketing copy.
        </p>
        <h3>4. Trust is judged across the web</h3>
        <p>
          Generative answers tend to cite sources that are consistent with other sources and clearly identified — named authors, an
          organization with a real address and profiles, dates, and references. On-page work can’t substitute for being mentioned elsewhere.
        </p>

        <h2>A practical checklist</h2>
        <ol>
          <li><strong>Access</strong>: allow Googlebot, Bingbot, OAI-SearchBot, PerplexityBot and Claude-SearchBot in robots.txt and in your CDN.</li>
          <li><strong>Rendering</strong>: make sure the main content is in the HTML the server returns.</li>
          <li><strong>Indexability</strong>: 200 status, self-referencing canonical, no stray <code>noindex</code>, an XML sitemap.</li>
          <li><strong>Answer-first writing</strong>: question-shaped headings and a direct answer in the first sentence below each.</li>
          <li><strong>Structure</strong>: lists for steps, tables for comparisons, short paragraphs.</li>
          <li><strong>Entity clarity</strong>: Organization or Person schema with <code>sameAs</code> links, author bylines, visible dates.</li>
          <li><strong>Evidence</strong>: specific numbers, sources and first-hand detail that other pages don’t have.</li>
          <li><strong>Measurement</strong>: track AI referrals in analytics and AI Overviews traffic in Search Console.</li>
        </ol>
        <p>
          The <Link href="/">free audit</Link> checks items 1–6 automatically and shows the evidence for each.
        </p>

        <h2>What doesn’t work</h2>
        <ul>
          <li><strong>Keyword stuffing for prompts.</strong> AI answers are generated from meaning, not exact-match phrases.</li>
          <li><strong>Hidden text or schema that doesn’t match the page.</strong> It violates search guidelines and erodes trust.</li>
          <li><strong>Mass-produced pages.</strong> Near-duplicate content adds nothing a model would cite over the original.</li>
          <li><strong>Treating llms.txt as a ranking factor.</strong> It isn’t documented as one by any major engine.</li>
        </ul>
      </ContentShell>
    </>
  );
}
