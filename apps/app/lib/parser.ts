export type Sentiment = 'positive' | 'neutral' | 'negative' | 'not_assessed';

export interface MentionParse {
  brandMentioned: boolean;
  domainMentioned: boolean;
  position: number | null;
  sentiment: Sentiment;
  competitors: string[];
  citedUrls: string[];
}

const POSITIVE = ['best', 'recommended', 'excellent', 'trusted', 'great', 'leading', 'الأفضل', 'موصى', 'ممتاز', 'موثوق', 'أنصح', 'رائع'];
const NEGATIVE = ['avoid', 'poor', 'worst', 'complaint', 'scam', 'unreliable', 'تجنب', 'سيئ', 'الأسوأ', 'احتيال', 'غير موثوق'];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function containsPhrase(text: string, phrase: string): boolean {
  const trimmed = phrase.trim();
  if (!trimmed) return false;
  if (/[A-Za-z]/.test(trimmed)) {
    const pattern = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRegExp(trimmed)}(?:$|[^\\p{L}\\p{N}])`, 'iu');
    return pattern.test(text);
  }
  return text.includes(trimmed);
}

export function hostOf(domainOrUrl: string): string {
  const trimmed = domainOrUrl.trim().toLowerCase();
  if (!trimmed) return '';
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return trimmed.replace(/^www\./, '').split('/')[0];
  }
}

function citedUrls(text: string): string[] {
  const found = text.match(/https?:\/\/[^\s)>\]]+/gi) ?? [];
  const cleaned = found.map((url) => url.replace(/[.,;:!?؟]+$/, ''));
  return [...new Set(cleaned)];
}

function sentimentOf(snippet: string): Sentiment {
  const haystack = snippet.toLowerCase();
  const positive = POSITIVE.reduce((count, word) => count + (haystack.includes(word.toLowerCase()) ? 1 : 0), 0);
  const negative = NEGATIVE.reduce((count, word) => count + (haystack.includes(word.toLowerCase()) ? 1 : 0), 0);
  if (positive === 0 && negative === 0) return 'neutral';
  if (positive > negative) return 'positive';
  if (negative > positive) return 'negative';
  return 'neutral';
}

function listItems(answer: string): { rank: number; text: string }[] {
  return answer.split('\n').flatMap((line) => {
    const match = /^\s*(\d+)[.)]\s+(.+)$/.exec(line);
    return match ? [{ rank: Number(match[1]), text: match[2] }] : [];
  });
}

export function parseMention(answer: string, brand: string, domain: string): MentionParse {
  const host = hostOf(domain);
  const urls = citedUrls(answer);
  const domainMentioned = host.length > 0 && (containsPhrase(answer, host) || urls.some((url) => hostOf(url) === host));
  const brandMentioned = containsPhrase(answer, brand);
  const items = listItems(answer);
  const hit = items.find((item) => containsPhrase(item.text, brand) || (host.length > 0 && containsPhrase(item.text, host)));

  let position: number | null = null;
  let snippet = '';
  if (hit) {
    position = hit.rank;
    snippet = hit.text;
  } else if (brandMentioned || domainMentioned) {
    const sentences = answer.split(/(?<=[.!?؟])\s+|\n+/).map((part) => part.trim()).filter(Boolean);
    const index = sentences.findIndex((sentence) => containsPhrase(sentence, brand) || (host.length > 0 && (containsPhrase(sentence, host) || sentence.toLowerCase().includes(host))));
    position = index >= 0 ? index + 1 : 1;
    snippet = index >= 0 ? sentences[index] : answer;
  }

  const competitors = new Set<string>();
  for (const item of items) {
    if (containsPhrase(item.text, brand) || (host && containsPhrase(item.text, host))) continue;
    const name = item.text.replace(/https?:\/\/\S+/g, '').trim();
    if (name.length >= 2 && name.length <= 80) competitors.add(name);
  }
  for (const url of urls) {
    const cited = hostOf(url);
    if (cited && cited !== host) competitors.add(cited);
  }

  return {
    brandMentioned,
    domainMentioned,
    position: brandMentioned || domainMentioned ? position : null,
    sentiment: brandMentioned || domainMentioned ? sentimentOf(snippet) : 'not_assessed',
    competitors: [...competitors],
    citedUrls: urls,
  };
}
