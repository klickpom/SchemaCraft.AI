import type { Metadata } from 'next';
import Link from 'next/link';
import RobotsTxtBuilder from '@/components/tools/RobotsTxtBuilder';
import { ContentShell, RELATED } from '@/components/ContentShell';
import { toolPageGraph } from '@/lib/seo/jsonld';
import { canonicalUrl } from '@/lib/seo/urls';

const PATH = '/robots-txt-generator/';
const TITLE = 'AI robots.txt Generator: Allow AI Search, Block Training';
const DESCRIPTION =
  'Generate a correct robots.txt for 2026: keep ChatGPT Search, Perplexity and Google AI Overviews, block GPTBot, ClaudeBot and other training crawlers. Free.';

const FAQ = [
  {
    q: 'How do I block AI training but stay in AI search results?',
    a: 'Block the training user-agents (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent) and leave the search agents (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot) allowed. The “AI search yes, training no” preset does exactly that.',
  },
  {
    q: 'Do I need to list every crawler I want to allow?',
    a: 'No. A crawler without its own group follows the User-agent: * group. Naming a crawler you want to allow is only useful if it needs different rules — and then you must repeat your private-path disallows inside that group, because a named crawler ignores the * group entirely.',
  },
  {
    q: 'Can robots.txt remove a page from Google?',
    a: 'No. A disallowed URL can still be indexed (without its content) if other pages link to it. To keep a page out of search results, allow crawling and add a noindex meta tag or X-Robots-Tag header. Google does not support noindex inside robots.txt.',
  },
  {
    q: 'Will blocking GPTBot stop my content from appearing in ChatGPT?',
    a: 'It stops OpenAI from using your pages for future model training. ChatGPT Search answers come from OAI-SearchBot, so blocking GPTBot alone does not remove you from ChatGPT Search.',
  },
  {
    q: 'Where do I upload robots.txt?',
    a: 'At the root of each host: https://yoursite.com/robots.txt. A robots.txt on www.yoursite.com does not apply to shop.yoursite.com. On WordPress most SEO plugins have a robots.txt editor; on Shopify edit the robots.txt.liquid theme template; on Wix and Squarespace use the SEO settings.',
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonicalUrl(PATH), type: 'website' },
};

export default function RobotsTxtGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolPageGraph({ path: PATH, name: 'AI robots.txt Generator', description: DESCRIPTION, faq: FAQ, breadcrumb: 'robots.txt generator' })) }}
      />
      <ContentShell
        crumb="robots.txt generator"
        eyebrow="Free tool · Runs in your browser"
        title="robots.txt generator for AI crawlers"
        lead={
          <p>
            Pick a policy, add your private paths, and copy a robots.txt that <strong>keeps you in ChatGPT Search, Perplexity and Google AI
            Overviews while opting out of model training</strong>. Every crawler links to its vendor’s documentation.
          </p>
        }
        updated="2026-10-19"
        tool={<RobotsTxtBuilder lang="en" />}
        faq={FAQ}
        related={[RELATED.crawlerChecker, RELATED.crawlers, RELATED.llms]}
      >
        <h2>How the generated file works</h2>
        <p>
          The output uses two groups. <code>User-agent: *</code> holds the rules for everyone, including your private paths. Crawlers you
          block share a second group that ends in <code>Disallow: /</code> — several <code>User-agent</code> lines in one group is valid
          under <a href="https://www.rfc-editor.org/rfc/rfc9309" target="_blank" rel="noopener noreferrer">RFC 9309</a>, the robots.txt
          standard Google documents its crawlers against.
        </p>
        <p>
          Allowed crawlers are deliberately <em>not</em> listed. If they were, each would need its own copy of your private-path rules,
          because a crawler that finds a group with its name ignores the <code>*</code> group. Leaving them out is shorter and safer.
        </p>

        <h2>Which preset should you use?</h2>
        <ul>
          <li>
            <strong>AI search yes, training no</strong> — for businesses, publishers and stores that want to be cited and clicked from AI
            answers but don’t want to supply training data. Most sites.
          </li>
          <li>
            <strong>Allow everything</strong> — for documentation, open-source projects and anyone who wants maximum reach, including
            being part of future model knowledge.
          </li>
          <li>
            <strong>Block all AI</strong> — keeps classic Google, Bing and Apple search but removes you from ChatGPT, Claude and
            Perplexity answers. Note that Google AI Overviews still use Googlebot.
          </li>
        </ul>

        <h2>Mistakes this generator avoids</h2>
        <ul>
          <li><strong>Blocking Google-Extended to leave AI Overviews.</strong> It doesn’t; AI Overviews follow Googlebot rules.</li>
          <li><strong>An empty <code>Disallow:</code> line.</strong> It means “allow everything”, not “block everything”.</li>
          <li><strong>Blocking CSS and JavaScript.</strong> Google needs them to render the page; never disallow your asset folders.</li>
          <li><strong>Wrong case in paths.</strong> Paths are case-sensitive: <code>/Admin/</code> does not block <code>/admin/</code>.</li>
          <li><strong>Using robots.txt for secrets.</strong> The file is public. Protect private areas with authentication.</li>
        </ul>

        <h2>Test it after uploading</h2>
        <p>
          Run the <Link href="/ai-crawler-checker/">AI crawler checker</Link> on any page of your site. It reports, for each crawler, which
          rule matched and whether a CDN or firewall answered the request differently. In Google Search Console, the robots.txt report
          shows the version Google last fetched.
        </p>
      </ContentShell>
    </>
  );
}
