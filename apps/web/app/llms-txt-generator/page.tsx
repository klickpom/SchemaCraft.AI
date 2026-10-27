import type { Metadata } from 'next';
import Link from 'next/link';
import LlmsTxtBuilder from '@/components/tools/LlmsTxtBuilder';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { toolPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates, socialMeta } from '@/lib/seo/urls';

const PATH = '/llms-txt-generator/';
const TITLE = 'llms.txt Generator: Create an llms.txt File From Your Sitemap';
const DESCRIPTION =
  'Build a valid llms.txt file in minutes: draft it from your sitemap, describe your key pages, and download. Includes an honest look at what llms.txt does today.';

const FAQ = [
  {
    q: 'What is llms.txt?',
    a: 'llms.txt is a proposed standard (llmstxt.org, 2024) for a Markdown file at the root of a site that tells language models what the site is and which pages matter most, with a one-line description of each. It is a curated map, not an access-control file like robots.txt.',
  },
  {
    q: 'Does llms.txt improve SEO or AI search rankings?',
    a: 'There is no evidence that it does today. Google has said it does not use llms.txt for Search, and no major AI search engine documents it as a ranking or citation signal. It is cheap to add and useful for AI coding assistants and agents that do read it, so treat it as a low-effort extra — not a fix for crawlability or content problems.',
  },
  {
    q: 'What is the difference between llms.txt and robots.txt?',
    a: 'robots.txt tells crawlers what they may fetch. llms.txt tells models what is worth reading and what each page is about. llms.txt cannot block anything.',
  },
  {
    q: 'What should go in the Optional section?',
    a: 'Pages a model can skip when its context is limited — blog archives, changelogs, legal pages. The spec reserves the section name “Optional” for exactly this.',
  },
  {
    q: 'How do I add llms.txt to WordPress or Shopify?',
    a: 'On WordPress, upload the file to your site root over SFTP or your host’s file manager; some SEO plugins, including Yoast SEO, can generate one. Shopify does not allow files at the root, so upload it under Content → Files and create a URL redirect from /llms.txt to that file.',
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates(PATH, 'en'),
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

export default function LlmsTxtGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolPageGraph({ path: PATH, name: 'llms.txt Generator', description: DESCRIPTION, faq: FAQ, breadcrumb: 'llms.txt generator' })) }}
      />
      <ContentShell
        crumb="llms.txt generator"
        eyebrow="Free tool · Follows llmstxt.org"
        title="llms.txt generator"
        lead={
          <p>
            Enter your domain to <strong>draft an llms.txt from your real sitemap</strong>, then keep the pages that matter, add a one-line
            description to each, and download a file that follows the <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">llmstxt.org</a> format.
          </p>
        }
        updated="2026-10-19"
        tool={<LlmsTxtBuilder lang="en" />}
        faq={FAQ}
        related={[RELATED.robots, RELATED.crawlerChecker, RELATED.geo]}
      >
        <h2>The llms.txt format in 30 seconds</h2>
        <pre><code>{`# Acme Running

> Acme Running sells trail and road running shoes online and ships to the EU and US.

Prices are in EUR. All shoes have a 60-day return window.

## Products

- [Trail shoes](https://acme.example/trail/): Full trail range with sizes and prices

## Optional

- [Blog](https://acme.example/blog/): Training guides`}</code></pre>
        <ul>
          <li><strong>H1</strong> with the site or project name — the only required element.</li>
          <li><strong>Blockquote</strong> with a one-sentence summary. Write it the way you’d want an AI to describe you.</li>
          <li><strong>Free text</strong> for key facts: markets, prices, policies, what you don’t do.</li>
          <li><strong>H2 sections</strong> of Markdown links, each with an optional <code>: description</code>.</li>
        </ul>

        <h2>What llms.txt does — and doesn’t — do</h2>
        <p>
          Be clear-eyed about it. llms.txt was proposed by Jeremy Howard of Answer.AI in September 2024 to help models use websites at
          inference time. Developer tools and some AI agents read it, and many documentation sites publish one. But Google has said it
          does not use llms.txt in Search, and none of the major AI search products document it as a signal for citations.
        </p>
        <p>
          What actually decides whether ChatGPT, Perplexity or AI Overviews can cite you is the basics: crawlers allowed, content in the
          HTML, and pages that answer questions clearly. Check those first with the <Link href="/ai-crawler-checker/">AI crawler checker</Link>{' '}
          and the <Link href="/">full audit</Link>.
        </p>

        <h2>How to write a good llms.txt</h2>
        <ul>
          <li>Keep it short: the 10–30 pages that answer the questions customers actually ask.</li>
          <li>Describe each page by the question it answers, not by marketing copy.</li>
          <li>Use absolute URLs that return 200 and are not blocked in robots.txt.</li>
          <li>Put archives and secondary pages under <code>## Optional</code>.</li>
          <li>Update it when you add or retire important pages.</li>
        </ul>

        <h2>Publishing it</h2>
        <p>
          Upload the file so it is served at <code>https://yoursite.com/llms.txt</code> with a <code>text/plain</code> or{' '}
          <code>text/markdown</code> content type and a 200 status. The audit checks both.
        </p>
      </ContentShell>
    </>
  );
}
