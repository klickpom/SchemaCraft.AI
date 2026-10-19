import type { Metadata } from 'next';
import Link from 'next/link';
import AuditRunner from '@/components/audit/AuditRunner';
import { ContentShell, RELATED } from '@/components/ContentShell';
import { toolPageGraph } from '@/lib/seo/jsonld';
import { canonicalUrl, socialMeta } from '@/lib/seo/urls';

const PATH = '/ai-crawler-checker/';
const TITLE = 'Free AI Crawler Checker: Is ChatGPT Blocked on Your Site?';
const DESCRIPTION =
  'Test whether GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended can crawl your page. Reads robots.txt exactly like the crawlers do. Free.';

const FAQ = [
  {
    q: 'How do I check if my site blocks ChatGPT?',
    a: 'Enter your URL above. The checker reads your robots.txt and evaluates the rules for OAI-SearchBot (ChatGPT Search), ChatGPT-User (links users open from ChatGPT) and GPTBot (training) separately, using the same matching rules the crawlers use. It also fetches the page and reports whether the content is in the raw HTML, because ChatGPT’s crawlers do not run JavaScript.',
  },
  {
    q: 'Does blocking GPTBot remove my site from ChatGPT search?',
    a: 'No. GPTBot collects training data. ChatGPT Search uses OAI-SearchBot, and OpenAI documents the two as independent controls. You can block GPTBot and still appear in ChatGPT Search as long as OAI-SearchBot is allowed.',
  },
  {
    q: 'Does blocking Google-Extended remove me from AI Overviews?',
    a: 'No. Google-Extended only controls whether your content is used for Gemini model training and grounding outside Search. AI Overviews and AI Mode are part of Google Search and use Googlebot, so they follow your Googlebot rules.',
  },
  {
    q: 'robots.txt allows the bot but it still cannot reach my site. Why?',
    a: 'robots.txt is only a request. CDNs and firewalls can block crawlers before robots.txt is ever read — Cloudflare, for example, blocks known AI crawlers by default on new domains since July 2025. Check your CDN’s bot settings and your server logs for 403 or 429 responses to the crawler’s user-agent.',
  },
  {
    q: 'Why does the report say the live bot test is “not verifiable”?',
    a: 'We can send a request with a crawler’s user-agent, but we cannot send it from that vendor’s IP addresses. Firewalls that verify crawler IPs correctly block impostors, so a blocked test request does not prove the real crawler is blocked — and an allowed one does not prove it is allowed. The robots.txt verdict is exact; the live test is a hint.',
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl(PATH) },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

export default function AiCrawlerCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolPageGraph({ path: PATH, name: 'AI Crawler Checker', description: DESCRIPTION, faq: FAQ, breadcrumb: 'AI crawler checker' })) }}
      />
      <ContentShell
        crumb="AI crawler checker"
        eyebrow="Free tool · No sign-up"
        title="AI crawler checker"
        lead={
          <p>
            Find out in one run whether <strong>ChatGPT, Claude, Perplexity, Gemini and Google</strong> are allowed to crawl a page — per
            crawler, with the exact robots.txt line that decides it — and whether the content is readable without JavaScript.
          </p>
        }
        updated="2026-10-19"
        tool={<AuditRunner lang="en" focus="ai" examples={['bbc.com/news', 'stripe.com', 'react.dev']} inputId="crawler-url" />}
        faq={FAQ}
        related={[RELATED.robots, RELATED.crawlers, RELATED.llms, RELATED.audit]}
      >
        <h2>What the checker tests</h2>
        <ul>
          <li>
            <strong>robots.txt, per crawler.</strong> Rules are evaluated the way crawlers apply them under{' '}
            <a href="https://www.rfc-editor.org/rfc/rfc9309" target="_blank" rel="noopener noreferrer">RFC 9309</a>: the most specific
            user-agent group wins, the longest matching path wins, and <code>Allow</code> wins a tie. A crawler with its own group ignores
            the <code>User-agent: *</code> group completely.
          </li>
          <li>
            <strong>Page-level blocks.</strong> <code>noindex</code> in meta robots or the <code>X-Robots-Tag</code> header, and
            non-200 responses.
          </li>
          <li>
            <strong>JavaScript dependence.</strong> OpenAI’s and Anthropic’s crawlers download HTML but do not execute JavaScript, so a
            page that renders its text in the browser is close to empty for them. We show exactly what a non-JavaScript crawler reads.
          </li>
          <li>
            <strong>Live requests.</strong> The page is requested again with each major crawler’s user-agent so you can see CDN or firewall
            responses — reported as a hint, for the reason in the FAQ below.
          </li>
          <li>
            <strong>llms.txt and sitemap.</strong> Whether they exist, are served as text, and are referenced correctly.
          </li>
        </ul>

        <h2>Search crawlers and training crawlers are different bots</h2>
        <p>
          Every major AI company now runs separate user-agents for search and for model training. Blocking training is a business decision;
          blocking search crawlers removes you from that product’s answers. The audit does not penalize blocked training crawlers.
        </p>
        <table>
          <thead>
            <tr><th>Vendor</th><th>Search / answers</th><th>User-triggered</th><th>Training</th></tr>
          </thead>
          <tbody>
            <tr><td>OpenAI</td><td><code>OAI-SearchBot</code></td><td><code>ChatGPT-User</code></td><td><code>GPTBot</code></td></tr>
            <tr><td>Anthropic</td><td><code>Claude-SearchBot</code></td><td><code>Claude-User</code></td><td><code>ClaudeBot</code></td></tr>
            <tr><td>Perplexity</td><td><code>PerplexityBot</code></td><td><code>Perplexity-User</code></td><td>—</td></tr>
            <tr><td>Google</td><td><code>Googlebot</code> (incl. AI Overviews)</td><td><code>Google-CloudVertexBot</code></td><td><code>Google-Extended</code></td></tr>
            <tr><td>Apple</td><td><code>Applebot</code></td><td>—</td><td><code>Applebot-Extended</code></td></tr>
          </tbody>
        </table>
        <p>
          The full list with official documentation links is in the <Link href="/ai-crawlers/">AI crawler list</Link>.
        </p>

        <h2>The most common reasons AI crawlers are blocked</h2>
        <h3>1. A bot-specific group that forgets the defaults</h3>
        <p>
          Adding <code>User-agent: GPTBot</code> with <code>Allow: /</code> means GPTBot no longer reads your <code>*</code> group — your
          private-path disallows stop applying to it. Repeat the disallows inside every named group, or don’t name crawlers you simply
          want to allow.
        </p>
        <h3>2. A CDN or firewall rule</h3>
        <p>
          Cloudflare’s AI crawler blocking, “bot fight” modes and hosting-level rate limits often return 403 or 429 to AI crawlers while
          Googlebot gets through. If robots.txt allows a crawler but your logs show errors for it, the fix is in your CDN settings, not in
          robots.txt.
        </p>
        <h3>3. Content that only exists after JavaScript runs</h3>
        <p>
          Single-page apps that ship an empty <code>&lt;div id=&quot;root&quot;&gt;</code> are readable by Googlebot (which renders) but
          not by most AI crawlers. Server-side rendering or static generation fixes this.
        </p>

        <h2>Allow AI search, block training</h2>
        <p>This is the setup most publishers and businesses choose. Paste it into your robots.txt and keep your existing rules above it:</p>
        <pre><code>{`User-agent: *
Allow: /

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: meta-externalagent
Disallow: /`}</code></pre>
        <p>
          Or build your own with the <Link href="/robots-txt-generator/">robots.txt generator</Link>.
        </p>
      </ContentShell>
    </>
  );
}
