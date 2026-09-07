export type BotPurpose = 'search-citation' | 'training' | 'user-fetch';

export interface BotRegistryEntry {
  id: string;
  userAgent: string;
  vendor: string;
  purpose: BotPurpose;
  docsUrl: string;
  verifiedAt: string;
  deprecated?: boolean;
  defaultAllowed: boolean;
  purposeEn: string;
  purposeAr: string;
}

const VERIFIED_AT = '2026-09-07';

/**
 * Official crawler registry. Every entry must have a vendor docsUrl.
 * Bots without an official documentation URL are not listed.
 */
export const BOT_REGISTRY: BotRegistryEntry[] = [
  {
    id: 'googlebot',
    userAgent: 'Googlebot',
    vendor: 'Google',
    purpose: 'search-citation',
    docsUrl: 'https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'Google Search crawler',
    purposeAr: 'زاحف بحث جوجل',
  },
  {
    id: 'google-extended',
    userAgent: 'Google-Extended',
    vendor: 'Google',
    purpose: 'training',
    docsUrl: 'https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'Gemini / Google AI training and grounding control',
    purposeAr: 'التحكم في تدريب وتأريض Gemini وذكاء جوجل',
  },
  {
    id: 'google-cloud-vertex',
    userAgent: 'Google-CloudVertexBot',
    vendor: 'Google',
    purpose: 'user-fetch',
    docsUrl: 'https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'Vertex AI user-triggered site fetch',
    purposeAr: 'جلب الصفحات بطلب مستخدم عبر Vertex AI',
  },
  {
    id: 'bingbot',
    userAgent: 'Bingbot',
    vendor: 'Microsoft',
    purpose: 'search-citation',
    docsUrl: 'https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'Bing Search crawler',
    purposeAr: 'زاحف بحث Bing',
  },
  {
    id: 'oai-search',
    userAgent: 'OAI-SearchBot',
    vendor: 'OpenAI',
    purpose: 'search-citation',
    docsUrl: 'https://developers.openai.com/api/docs/bots',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'ChatGPT Search indexing and citations',
    purposeAr: 'فهرسة واقتباسات بحث ChatGPT',
  },
  {
    id: 'chatgpt-user',
    userAgent: 'ChatGPT-User',
    vendor: 'OpenAI',
    purpose: 'user-fetch',
    docsUrl: 'https://developers.openai.com/api/docs/bots',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'User-initiated fetches from ChatGPT',
    purposeAr: 'جلب الصفحات بطلب مستخدم من ChatGPT',
  },
  {
    id: 'gptbot',
    userAgent: 'GPTBot',
    vendor: 'OpenAI',
    purpose: 'training',
    docsUrl: 'https://developers.openai.com/api/docs/bots',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: false,
    purposeEn: 'OpenAI foundation-model training crawler (not search)',
    purposeAr: 'زاحف تدريب نماذج OpenAI (ليس للبحث)',
  },
  {
    id: 'perplexity',
    userAgent: 'PerplexityBot',
    vendor: 'Perplexity',
    purpose: 'search-citation',
    docsUrl: 'https://docs.perplexity.ai/guides/bots',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'Perplexity Search indexing and sourced answers',
    purposeAr: 'فهرسة بحث Perplexity والإجابات الموثقة',
  },
  {
    id: 'perplexity-user',
    userAgent: 'Perplexity-User',
    vendor: 'Perplexity',
    purpose: 'user-fetch',
    docsUrl: 'https://docs.perplexity.ai/guides/bots',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'User-initiated fetches from Perplexity',
    purposeAr: 'جلب الصفحات بطلب مستخدم من Perplexity',
  },
  {
    id: 'claudebot',
    userAgent: 'ClaudeBot',
    vendor: 'Anthropic',
    purpose: 'training',
    docsUrl:
      'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: false,
    purposeEn: 'Anthropic crawler for model training',
    purposeAr: 'زاحف Anthropic لتدريب النماذج',
  },
  {
    id: 'claude-user',
    userAgent: 'Claude-User',
    vendor: 'Anthropic',
    purpose: 'user-fetch',
    docsUrl:
      'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'User-initiated fetches from Claude',
    purposeAr: 'جلب الصفحات بطلب مستخدم من Claude',
  },
  {
    id: 'claude-search',
    userAgent: 'Claude-SearchBot',
    vendor: 'Anthropic',
    purpose: 'search-citation',
    docsUrl:
      'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'Claude search indexing',
    purposeAr: 'فهرسة بحث Claude',
  },
  {
    id: 'claude-web',
    userAgent: 'Claude-Web',
    vendor: 'Anthropic',
    purpose: 'user-fetch',
    docsUrl:
      'https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
    verifiedAt: VERIFIED_AT,
    deprecated: true,
    defaultAllowed: false,
    purposeEn: 'Legacy Anthropic agent — superseded by Claude-User / Claude-SearchBot',
    purposeAr: 'وكيل Anthropic قديم — استُبدل بـ Claude-User و Claude-SearchBot',
  },
  {
    id: 'applebot',
    userAgent: 'Applebot',
    vendor: 'Apple',
    purpose: 'search-citation',
    docsUrl: 'https://support.apple.com/en-us/119829',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'Apple Search / Spotlight crawler',
    purposeAr: 'زاحف بحث آبل وSpotlight',
  },
  {
    id: 'applebot-extended',
    userAgent: 'Applebot-Extended',
    vendor: 'Apple',
    purpose: 'training',
    docsUrl: 'https://support.apple.com/en-us/119829',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'Apple Intelligence training and grounding control',
    purposeAr: 'التحكم في تدريب وتأريض Apple Intelligence',
  },
  {
    id: 'amazonbot',
    userAgent: 'Amazonbot',
    vendor: 'Amazon',
    purpose: 'search-citation',
    docsUrl: 'https://developer.amazon.com/amazonbot',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: true,
    purposeEn: 'Amazon product and site crawler',
    purposeAr: 'زاحف أمازون للمنتجات والمواقع',
  },
  {
    id: 'ccbot',
    userAgent: 'CCBot',
    vendor: 'Common Crawl',
    purpose: 'training',
    docsUrl: 'https://commoncrawl.org/faq',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: false,
    purposeEn: 'Common Crawl open web crawl (often used for training corpora)',
    purposeAr: 'زاحف Common Crawl المفتوح (يُستخدم غالبًا في بيانات التدريب)',
  },
  {
    id: 'meta-externalagent',
    userAgent: 'meta-externalagent',
    vendor: 'Meta',
    purpose: 'training',
    docsUrl: 'https://developers.facebook.com/docs/sharing/webmasters/web-crawlers',
    verifiedAt: VERIFIED_AT,
    defaultAllowed: false,
    purposeEn: 'Meta AI training crawler',
    purposeAr: 'زاحف تدريب ذكاء Meta',
  },
];

export const ACTIVE_BOTS = BOT_REGISTRY.filter((bot) => !bot.deprecated);
export const DEPRECATED_BOTS = BOT_REGISTRY.filter((bot) => bot.deprecated);

export function wafSearchCitationAgents(): string[] {
  return ACTIVE_BOTS.filter((bot) => bot.purpose === 'search-citation').map((bot) => bot.userAgent);
}

export function findBotByUserAgent(token: string): BotRegistryEntry | undefined {
  const lower = token.toLowerCase();
  return BOT_REGISTRY.find((bot) => bot.userAgent.toLowerCase() === lower);
}
