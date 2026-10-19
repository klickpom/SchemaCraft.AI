import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell, RELATED } from '@/components/ContentShell';
import { articleGraph } from '@/lib/seo/jsonld';
import { canonicalUrl, socialMeta } from '@/lib/seo/urls';

const PATH = '/chatgpt-search/';
const TITLE = 'How to Show Up in ChatGPT Search (and Why Perplexity Misses You)';
const DESCRIPTION =
  'ChatGPT Search cites pages OAI-SearchBot can fetch as HTML. Perplexity uses PerplexityBot. A Google ranking does not guarantee either.';
const UPDATED = '2026-10-19';

const FAQ = [
  {
    q: 'How does a page get into ChatGPT Search?',
    a: 'OpenAI’s OAI-SearchBot has to be allowed in robots.txt, the server or CDN has to return the page to that crawler (not a 403 or a challenge), and the answer has to be in the HTML. ChatGPT-User then fetches a page when someone asks about that URL. Blocking GPTBot does not block this.',
  },
  {
    q: 'Why does Perplexity cite competitors but not my site?',
    a: 'The usual causes are a robots.txt Disallow for PerplexityBot, a CDN rule that blocks its user-agent, or content that only appears after JavaScript runs. PerplexityBot does not render JavaScript. A page can rank on Google, which does render JavaScript, and still be invisible to Perplexity.',
  },
  {
    q: 'Does llms.txt get a page cited?',
    a: 'No major AI search product documents llms.txt as a citation signal. It is an optional Markdown map of key pages. It does not replace crawler access or a clear answer on the page.',
  },
  {
    q: 'Can I measure traffic from ChatGPT and Perplexity?',
    a: 'In analytics, look at referrals from chatgpt.com, perplexity.ai, claude.ai and copilot.microsoft.com. ChatGPT adds utm_source=chatgpt.com on many outbound links. Google AI Overviews traffic stays inside the Search Console Performance report; it is not a separate referral.',
  },
  {
    q: 'If my audit score is high, will I be cited?',
    a: 'No. The score says whether a crawler can reach the page and whether the page states clear facts. Being chosen as the source also depends on other pages saying the same thing, on links and mentions, and on how well the passage matches the question. A high score removes obstacles. It does not create authority.',
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl(PATH) },
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH, type: 'article' }),
};

export default function ChatgptSearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleGraph({ path: PATH, headline: TITLE, description: DESCRIPTION, datePublished: UPDATED, dateModified: UPDATED, breadcrumb: 'ChatGPT Search', faq: FAQ })),
        }}
      />
      <ContentShell
        crumb="ChatGPT Search"
        eyebrow="Guide · Sources linked"
        title="How to show up in ChatGPT Search"
        lead={
          <p>
            <strong>ChatGPT Search cites a page when OAI-SearchBot can fetch it and the answer is in the HTML.</strong> A high Google ranking
            is not enough: Googlebot renders JavaScript and uses its own robots.txt rules. Perplexity misses the same sites when PerplexityBot
            is blocked or the text only exists after scripts run. Three checks decide it — robots.txt, the firewall, and the raw HTML.
          </p>
        }
        updated={UPDATED}
        faq={FAQ}
        related={[RELATED.audit, RELATED.crawlerChecker, RELATED.gptbot, RELATED.crawlers]}
      >
        <h2>The three checks, in order</h2>
        <h3>1. robots.txt allows the search crawler</h3>
        <p>
          ChatGPT Search uses <strong>OAI-SearchBot</strong>. Perplexity uses <strong>PerplexityBot</strong>. Claude’s search uses{' '}
          <strong>Claude-SearchBot</strong>. Google AI Overviews use <strong>Googlebot</strong>. Each one reads only its own group in
          robots.txt, or the <code>*</code> group if it has none (<a href="https://www.rfc-editor.org/rfc/rfc9309">RFC 9309</a>).
        </p>
        <p>
          GPTBot is not in that list. It collects text for training. Blocking it does not remove a page from ChatGPT Search, and allowing it
          does not put a page there. The split is documented by{' '}
          <a href="https://developers.openai.com/api/docs/bots">OpenAI</a>, and the same pattern exists for Google-Extended vs Googlebot and
          ClaudeBot vs Claude-SearchBot. Details: <Link href="/should-i-block-gptbot/">should you block GPTBot?</Link>
        </p>
        <h3>2. The CDN returns the page, not a challenge</h3>
        <p>
          Bot-protection products often allow Googlebot (they can verify its IPs) and challenge everyone else. OAI-SearchBot and PerplexityBot
          then receive a 403 or an interstitial, so there is nothing to cite. robots.txt will still say “allowed”. The only way to see this
          is to request the URL with that user-agent.
        </p>
        <p>
          Treat the result as a hint. User-agent strings are trivial to fake, and a CDN may allow the vendor’s real IP ranges while blocking
          an audit server that only copies the user-agent. OpenAI, Google, Bing and Perplexity publish how to verify their crawlers; use that
          before you conclude a real bot is blocked.
        </p>
        <h3>3. The answer is in the HTML the server sends</h3>
        <p>
          OAI-SearchBot, PerplexityBot and ClaudeBot fetch HTML and do not run the page’s JavaScript. A product grid, a price, or a paragraph
          that appears only after React hydrates is an empty page to them. Googlebot is the exception: it renders. That is why a URL can rank
          in Google and never appear in ChatGPT or Perplexity.
        </p>

        <h2>What a citable passage looks like</h2>
        <p>
          Once the crawler can read the page, it still has to lift a passage. The passages that get reused have a shape:
        </p>
        <ul>
          <li>The first paragraph defines the thing in one or two sentences: what it is, who it is for, and the concrete fact.</li>
          <li>Headings are the questions people ask, and the first sentence under each heading answers it.</li>
          <li>Steps are a numbered list. Comparisons are a table. Both survive quotation better than a paragraph of adjectives.</li>
          <li>Numbers have units and a source. “Faster” is not citable. “Most audits finish within 20 seconds” is.</li>
          <li>The organization is named in the text and in JSON-LD, with <code>sameAs</code> links to profiles that actually exist.</li>
        </ul>
        <p>
          There is no special “AI schema”. FAQ, Article and Organization markup help machines connect names to things. Markup that describes
          reviews, prices or authors the page does not show is a guideline violation, and it is a bad idea even when a validator stays quiet.
        </p>

        <h2>Why Perplexity and ChatGPT disagree</h2>
        <p>
          They do not share an index. A site can be in one and absent from the other for a boring reason: one bot is allowed and the other is
          not. Check the two rows separately. Perplexity-User and ChatGPT-User are a third case — they fetch a URL because a person asked, and
          Perplexity documents that Perplexity-User may ignore robots.txt. They are not how you get into the standing index.
        </p>
        <table>
          <thead>
            <tr><th></th><th>ChatGPT Search</th><th>Perplexity</th><th>Google AI Overviews</th></tr>
          </thead>
          <tbody>
            <tr><td>Index crawler</td><td>OAI-SearchBot</td><td>PerplexityBot</td><td>Googlebot</td></tr>
            <tr><td>On-demand fetch</td><td>ChatGPT-User</td><td>Perplexity-User</td><td>Googlebot</td></tr>
            <tr><td>Training control</td><td>GPTBot</td><td>None separate</td><td>Google-Extended</td></tr>
            <tr><td>Renders JavaScript</td><td>No</td><td>No</td><td>Yes</td></tr>
          </tbody>
        </table>

        <h2>What to do this week</h2>
        <ol>
          <li>Allow OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot and Bingbot. Block training crawlers only if that is the policy you want — see the <Link href="/robots-txt-generator/">robots.txt generator</Link>.</li>
          <li>Allow those same user-agents in the CDN, or turn the challenge off for them.</li>
          <li>View the page with JavaScript disabled. If the answer is gone, render it on the server.</li>
          <li>Rewrite the opening paragraph as a definition, and put one sourced number in it.</li>
          <li>Add Organization JSON-LD with a real logo and real <code>sameAs</code> URLs.</li>
          <li>In analytics, segment referrals from chatgpt.com and perplexity.ai so you can see whether the change did anything. Rankings and citations also depend on other sites mentioning you, which no on-page edit can fake.</li>
        </ol>
        <p>
          Run the URL through the <Link href="/">audit</Link> or the <Link href="/ai-crawler-checker/">AI crawler checker</Link>. Every failed
          check shows the evidence (the robots.txt line, the HTTP status, or the missing paragraph) and a fix you can paste. Most audits
          finish within 20 seconds, with a limit of 20 audits per 10 minutes. Google stops reading robots.txt after 500 KiB, so a short
          allow-list is nowhere near that cutoff.
        </p>
      </ContentShell>
    </>
  );
}
