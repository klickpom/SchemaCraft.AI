import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { articleGraph } from '@/lib/seo/jsonld';
import { canonicalUrl, socialMeta } from '@/lib/seo/urls';

const PATH = '/should-i-block-gptbot/';
const TITLE = 'Should You Block GPTBot? Keep ChatGPT Search, Stop Training';
const DESCRIPTION =
  'GPTBot trains OpenAI models. OAI-SearchBot powers ChatGPT Search. Block one without losing the other, with a robots.txt that follows RFC 9309.';
const UPDATED = '2026-10-19';

const FAQ = [
  {
    q: 'Does blocking GPTBot remove my site from ChatGPT?',
    a: 'No. OpenAI documents GPTBot and OAI-SearchBot as separate crawlers. ChatGPT Search uses OAI-SearchBot to find pages to cite, and ChatGPT-User when a person asks about a specific URL. Blocking only GPTBot leaves both of those allowed.',
  },
  {
    q: 'Does blocking GPTBot affect Google rankings?',
    a: 'No. Google Search and AI Overviews use Googlebot. GPTBot is an OpenAI crawler. Blocking Google-Extended is also separate from Googlebot: Google documents Google-Extended as a control for Gemini and Vertex AI grounding, not for Google Search.',
  },
  {
    q: 'Should I block every AI crawler?',
    a: 'Only if you do not want to be cited in AI answers. Blocking OAI-SearchBot, PerplexityBot or Claude-SearchBot removes you from those products. Blocking Googlebot removes you from Google. Training crawlers are the group you can block without that effect.',
  },
  {
    q: 'Do ChatGPT-User and Perplexity-User obey robots.txt?',
    a: 'Not reliably. They fetch a page because a person asked. Perplexity documents that Perplexity-User may ignore robots.txt. If a page must stay private, require a login. robots.txt is a crawler policy, not access control.',
  },
  {
    q: 'Will a CDN bot rule still block ChatGPT after I allow OAI-SearchBot?',
    a: 'Yes, that happens often. robots.txt can say allow while a firewall returns 403 or a challenge to that user-agent. Check the live request, not only the file. User-agent strings are also easy to spoof, so vendors publish IP ranges for real verification.',
  },
];

const ROBOTS = `User-agent: *
Allow: /

# AI training crawlers (does not affect AI search or Google Search)
User-agent: Google-Extended
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: meta-externalagent
Disallow: /

Sitemap: https://example.com/sitemap.xml
`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl(PATH) },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH, type: 'article' }),
};

export default function BlockGptbotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleGraph({ path: PATH, headline: TITLE, description: DESCRIPTION, datePublished: UPDATED, dateModified: UPDATED, breadcrumb: 'Block GPTBot?', faq: FAQ })),
        }}
      />
      <ContentShell
        crumb="Block GPTBot?"
        eyebrow="Guide · Sources linked"
        title="Should you block GPTBot?"
        lead={
          <p>
            <strong>Yes, if you don’t want your pages used to train models — and no, that does not remove you from ChatGPT Search.</strong>{' '}
            GPTBot is OpenAI’s training crawler. ChatGPT Search uses a different crawler, OAI-SearchBot. Block GPTBot in its own robots.txt
            group and leave OAI-SearchBot, Googlebot and Bingbot allowed.
          </p>
        }
        updated={UPDATED}
        faq={FAQ}
        related={[RELATED.robots, RELATED.chatgpt, RELATED.crawlers, RELATED.crawlerChecker]}
      >
        <h2>Search crawler and training crawler are different products</h2>
        <p>
          Each vendor publishes two (sometimes three) user-agents. One fetches pages so an answer can cite them. Another collects text for
          training. A third fetches a page only when a person pastes a link or asks about it. OpenAI, Google, Anthropic and Apple document
          the split. The settings are independent.
        </p>
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Keep for citations</th>
              <th>Optional to block (training)</th>
              <th>Official docs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OpenAI</td>
              <td>OAI-SearchBot, ChatGPT-User</td>
              <td>GPTBot</td>
              <td><a href="https://developers.openai.com/api/docs/bots">OpenAI bots</a></td>
            </tr>
            <tr>
              <td>Google</td>
              <td>Googlebot</td>
              <td>Google-Extended</td>
              <td><a href="https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers">Google crawlers</a></td>
            </tr>
            <tr>
              <td>Anthropic</td>
              <td>Claude-SearchBot, Claude-User</td>
              <td>ClaudeBot</td>
              <td><a href="https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler">Anthropic crawler</a></td>
            </tr>
            <tr>
              <td>Apple</td>
              <td>Applebot</td>
              <td>Applebot-Extended</td>
              <td><a href="https://support.apple.com/en-us/119829">About Applebot</a></td>
            </tr>
            <tr>
              <td>Perplexity</td>
              <td>PerplexityBot, Perplexity-User</td>
              <td>No separate training bot</td>
              <td><a href="https://docs.perplexity.ai/guides/bots">Perplexity bots</a></td>
            </tr>
          </tbody>
        </table>
        <p>
          Perplexity does not publish a training crawler you can block while staying in Perplexity answers. Blocking PerplexityBot opts you
          out of Perplexity’s index. The full list, including Common Crawl and Meta, is on the <Link href="/ai-crawlers/">AI crawler list</Link>.
        </p>

        <h2>A robots.txt that blocks training and keeps search</h2>
        <p>
          Under <a href="https://www.rfc-editor.org/rfc/rfc9309">RFC 9309</a>, a crawler uses the group with its own user-agent if one exists,
          and ignores the <code>User-agent: *</code> group. So every training bot belongs in one group, and that group is the only place{' '}
          <code>Disallow: /</code> appears. OAI-SearchBot has no group of its own, so it follows <code>*</code> and is allowed.
        </p>
        <pre><code>{ROBOTS}</code></pre>
        <p>
          Replace the sitemap URL. The same file is what the <Link href="/robots-txt-generator/">robots.txt generator</Link> builds on the
          “allow search, block training” preset. Do not add a separate <code>User-agent: GPTBot</code> block later in the file with a
          different rule — the most specific matching group wins, and a second group replaces this one for that bot.
        </p>

        <h2>What blocking does not do</h2>
        <ul>
          <li><strong>It does not delete pages a model already trained on.</strong> robots.txt stops future fetches. It does not edit a shipped model.</li>
          <li><strong>It does not hide a page from a person using ChatGPT.</strong> ChatGPT-User fetches a URL someone asked about. Treat private content with authentication.</li>
          <li><strong>It does not fix a CDN block.</strong> If your firewall challenges every non-browser user-agent, OAI-SearchBot never sees the page even when robots.txt allows it.</li>
          <li><strong>It is not a ranking boost.</strong> Allowing GPTBot is not a documented ranking factor for Google or for ChatGPT Search.</li>
        </ul>

        <h2>How to check the result</h2>
        <ol>
          <li>Publish the file at <code>/robots.txt</code> on the same host as the pages (a CDN hostname needs its own file).</li>
          <li>Confirm GPTBot is disallowed and OAI-SearchBot, PerplexityBot, Claude-SearchBot and Googlebot are allowed for the URL you care about.</li>
          <li>Request the URL with those user-agents. A 403 or a JavaScript challenge means the firewall, not robots.txt, is the block.</li>
        </ol>
        <p>
          The <Link href="/">free audit</Link> does both: it parses robots.txt per RFC 9309 (and shows the line that matched) and sends a live
          request as each crawler. A live request from an audit server is a hint — real crawlers come from published IP ranges, and a CDN can
          treat those differently. Most audits finish within 20 seconds, with a limit of 20 audits per 10 minutes. Google stops reading a
          robots.txt file after 500 KiB; the block above is a few hundred bytes.
        </p>
      </ContentShell>
    </>
  );
}
