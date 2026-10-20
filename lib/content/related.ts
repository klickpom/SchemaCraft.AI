export interface RelatedLink {
  href: string;
  title: string;
  desc: string;
  titleAr?: string;
  descAr?: string;
}

export const RELATED = {
  audit: { href: '/', title: 'Full AI search audit', desc: 'About 50 SEO, GEO and AEO checks on any URL, with evidence and fixes.', titleAr: 'فحص الظهور في البحث الذكي', descAr: 'حوالي 50 فحصاً لأي رابط، مع الدليل والإصلاح.' },
  crawlerChecker: { href: '/ai-crawler-checker/', title: 'AI crawler checker', desc: 'Which AI bots your robots.txt and firewall actually let in.', titleAr: 'فاحص زواحف الذكاء الاصطناعي', descAr: 'أي البوتات يسمح بها robots.txt والجدار الناري فعلاً.' },
  robots: { href: '/robots-txt-generator/', title: 'robots.txt generator', desc: 'Allow AI search crawlers, block training crawlers.', titleAr: 'مولد robots.txt', descAr: 'اسمح لزواحف البحث الذكي وامنع زواحف التدريب.' },
  llms: { href: '/llms-txt-generator/', title: 'llms.txt generator', desc: 'Build a valid llms.txt file from your key pages.', titleAr: 'مولد llms.txt', descAr: 'ابنِ ملف llms.txt من صفحاتك الأساسية.' },
  validator: { href: '/schema-validator/', title: 'Schema validator', desc: 'Check JSON-LD against Google’s required properties.', titleAr: 'مدقق السكيما', descAr: 'افحص JSON-LD مقابل الخصائص التي يطلبها جوجل.' },
  generators: { href: '/json-ld-generator/', title: 'JSON-LD generators', desc: 'Product, LocalBusiness, Article, FAQ and more.', titleAr: 'مولدات JSON-LD', descAr: 'منتج، نشاط محلي، مقال، أسئلة شائعة والمزيد.' },
  crawlers: { href: '/ai-crawlers/', title: 'AI crawler list', desc: 'Every AI user-agent, its purpose and official docs.', titleAr: 'قائمة زواحف الذكاء الاصطناعي', descAr: 'كل وكيل، وظيفته، ورابط التوثيق الرسمي.' },
  geo: { href: '/geo-vs-aeo/', title: 'GEO vs AEO vs SEO', desc: 'What each term means and what to actually do.', titleAr: 'GEO وAEO وSEO', descAr: 'معنى كل مصطلح وما الذي يُنفَّذ فعلاً.' },
  gptbot: { href: '/should-i-block-gptbot/', title: 'Should you block GPTBot?', desc: 'Block training without disappearing from ChatGPT Search.', titleAr: 'هل تمنع GPTBot؟', descAr: 'امنع التدريب من غير ما تختفي من بحث ChatGPT.' },
  chatgpt: { href: '/chatgpt-search/', title: 'Show up in ChatGPT Search', desc: 'What OAI-SearchBot needs, and why Perplexity may still miss you.', titleAr: 'الظهور في بحث ChatGPT', descAr: 'ماذا يحتاج OAI-SearchBot، ولماذا قد يفوتك Perplexity.' },
} satisfies Record<string, RelatedLink>;
