import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell, RELATED } from '@/components/ContentShell';
import { ACTIVE_BOTS, DEPRECATED_BOTS, type BotPurpose } from '@/lib/bots/registry';
import { articleGraph } from '@/lib/seo/jsonld';
import { canonicalUrl } from '@/lib/seo/urls';

const PATH = '/ai-crawlers/';
const TITLE = 'AI Crawler List 2026: Every AI User-Agent and What It Does';
const DESCRIPTION =
  'GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and more: what each AI crawler does, whether it powers search or training, and how to control it.';
const UPDATED = '2026-10-19';

const PURPOSE_LABEL: Record<BotPurpose, string> = {
  'search-citation': 'Search & citations',
  'user-fetch': 'User-triggered fetch',
  training: 'Model training',
};

const FAQ = [
  {
    q: 'Which AI crawlers should I allow?',
    a: 'Allow the search crawlers of the products you want to be cited in — OAI-SearchBot for ChatGPT Search, PerplexityBot, Claude-SearchBot, and Googlebot and Bingbot for classic search and AI Overviews. Whether to allow training crawlers such as GPTBot, ClaudeBot and Google-Extended is a separate business decision.',
  },
  {
    q: 'What is the difference between GPTBot and OAI-SearchBot?',
    a: 'GPTBot collects data that may be used to train OpenAI’s models. OAI-SearchBot indexes pages so they can be shown and linked in ChatGPT Search. OpenAI documents them as independent settings.',
  },
  {
    q: 'Do user-triggered agents like ChatGPT-User follow robots.txt?',
    a: 'These agents fetch a page because a person asked for it, so vendors treat them differently from automated crawlers. Perplexity documents that Perplexity-User generally ignores robots.txt for that reason. If you must keep content away from them, use authentication rather than robots.txt.',
  },
  {
    q: 'How can I tell if a request really comes from an AI crawler?',
    a: 'User-agent strings are easy to fake. Google, Bing, OpenAI, Perplexity and others publish IP ranges or reverse-DNS methods for verification. Check the request IP against the vendor’s published list before trusting the user-agent.',
  },
  {
    q: 'Does blocking AI crawlers hurt my Google rankings?',
    a: 'No. Google Search uses Googlebot; blocking GPTBot, ClaudeBot or even Google-Extended has no effect on Google Search ranking. Blocking Googlebot itself removes you from Google Search, including AI Overviews.',
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonicalUrl(PATH), type: 'article' },
};

export default function AiCrawlersPage() {
  const groups: BotPurpose[] = ['search-citation', 'user-fetch', 'training'];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleGraph({ path: PATH, headline: TITLE, description: DESCRIPTION, datePublished: '2026-09-07', dateModified: UPDATED, breadcrumb: 'AI crawler list', faq: FAQ })),
        }}
      />
      <ContentShell
        crumb="AI crawler list"
        eyebrow="Guide · Linked to official vendor docs"
        title="AI crawler list: every AI user-agent and what it does"
        lead={
          <p>
            AI companies run <strong>three kinds of bots</strong>: search crawlers that decide whether you can be cited, user-triggered
            agents that fetch a page when someone asks about it, and training crawlers that collect data for future models. You can allow
            one kind and block another. Here is each user-agent, sorted by what it does.
          </p>
        }
        updated={UPDATED}
        faq={FAQ}
        related={[RELATED.crawlerChecker, RELATED.robots, RELATED.geo]}
      >
        {groups.map((purpose) => {
          const bots = ACTIVE_BOTS.filter((b) => b.purpose === purpose);
          return (
            <section key={purpose}>
              <h2 id={purpose}>{PURPOSE_LABEL[purpose]} crawlers</h2>
              <p>
                {purpose === 'search-citation' && 'Blocking these removes your pages from that product’s search results and AI answers. Most sites should allow them.'}
                {purpose === 'user-fetch' && 'These fetch a specific page because a user pasted a link or asked an assistant to read it. They are not bulk crawlers.'}
                {purpose === 'training' && 'These collect content that may be used to train models. Blocking them does not affect search visibility.'}
              </p>
              <table>
                <thead>
                  <tr><th>User-agent token</th><th>Vendor</th><th>What it does</th><th>Docs</th></tr>
                </thead>
                <tbody>
                  {bots.map((b) => (
                    <tr key={b.id}>
                      <td><code>{b.userAgent}</code></td>
                      <td>{b.vendor}</td>
                      <td>{b.purposeEn}</td>
                      <td><a href={b.docsUrl} target="_blank" rel="noopener noreferrer">Official</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}

        {DEPRECATED_BOTS.length > 0 && (
          <>
            <h2>Retired user-agents</h2>
            <p>Still seen in old robots.txt files. Rules for them do nothing for the current crawlers.</p>
            <ul>
              {DEPRECATED_BOTS.map((b) => (
                <li key={b.id}><code>{b.userAgent}</code> — {b.purposeEn}</li>
              ))}
            </ul>
          </>
        )}

        <h2>robots.txt recipes</h2>
        <h3>Be cited in AI search, opt out of training</h3>
        <pre><code>{`User-agent: *
Allow: /

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: meta-externalagent
Disallow: /`}</code></pre>
        <h3>Opt out of ChatGPT entirely</h3>
        <pre><code>{`User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
Disallow: /`}</code></pre>
        <p>
          Remember that a crawler named in its own group ignores your <code>User-agent: *</code> rules. Build a complete file with the{' '}
          <Link href="/robots-txt-generator/">robots.txt generator</Link>.
        </p>

        <h2>When robots.txt is not enough</h2>
        <p>
          Your CDN or firewall answers before robots.txt is read. Cloudflare has blocked known AI crawlers by default on new domains since
          July 2025, and many hosts rate-limit unfamiliar bots. If a crawler is allowed in robots.txt but your logs show 403 or 429 responses
          for it, change the CDN rule. The <Link href="/ai-crawler-checker/">AI crawler checker</Link> shows both layers side by side.
        </p>
      </ContentShell>
    </>
  );
}
