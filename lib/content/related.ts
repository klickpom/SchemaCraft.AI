export interface RelatedLink {
  href: string;
  title: string;
  desc: string;
}

export const RELATED = {
  audit: { href: '/', title: 'Full AI search audit', desc: 'About 50 SEO, GEO and AEO checks on any URL, with evidence and fixes.' },
  crawlerChecker: { href: '/ai-crawler-checker/', title: 'AI crawler checker', desc: 'Which AI bots your robots.txt and firewall actually let in.' },
  robots: { href: '/robots-txt-generator/', title: 'robots.txt generator', desc: 'Allow AI search crawlers, block training crawlers.' },
  llms: { href: '/llms-txt-generator/', title: 'llms.txt generator', desc: 'Build a valid llms.txt file from your key pages.' },
  validator: { href: '/schema-validator/', title: 'Schema validator', desc: 'Check JSON-LD against Google’s required properties.' },
  generators: { href: '/json-ld-generator/', title: 'JSON-LD generators', desc: 'Product, LocalBusiness, Article, FAQ and more.' },
  crawlers: { href: '/ai-crawlers/', title: 'AI crawler list', desc: 'Every AI user-agent, its purpose and official docs.' },
  geo: { href: '/geo-vs-aeo/', title: 'GEO vs AEO vs SEO', desc: 'What each term means and what to actually do.' },
  gptbot: { href: '/should-i-block-gptbot/', title: 'Should you block GPTBot?', desc: 'Block training without disappearing from ChatGPT Search.' },
  chatgpt: { href: '/chatgpt-search/', title: 'Show up in ChatGPT Search', desc: 'What OAI-SearchBot needs, and why Perplexity may still miss you.' },
} satisfies Record<string, RelatedLink>;
