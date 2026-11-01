export const PROMPT_LOCALES = ['en', 'ar-eg', 'ar-gulf', 'ar'] as const;
export type PromptLocale = (typeof PROMPT_LOCALES)[number];

export interface PromptDraft {
  locale: PromptLocale;
  body: string;
}

const TEMPLATES: Record<PromptLocale, string[]> = {
  en: [
    'Who is the best {niche} in {city}?',
    'Which {niche} in {city} do customers recommend?',
    'How much does a {niche} in {city} cost?',
    'What should I ask a {niche} in {city} before I buy?',
    'Which {niche} in {city} can I visit this week?',
    'What do recent customers say about {niche} in {city}?',
    'How do I compare {niche} options in {city}?',
    'Which {niche} in {city} explains the work before charging?',
    'Where can I find a {niche} in {city} that mentions {phrase}?',
  ],
  'ar-eg': [
    'فين أحسن {niche} في {city}؟',
    'مين الناس بترشحه كـ {niche} في {city}؟',
    'أسعار {niche} في {city} كام؟',
    'أسأل {niche} في {city} على إيه قبل ما أتعاقد؟',
    'في {niche} كويس في {city} أقدر أزوره الأسبوع ده؟',
    'إيه رأي الناس اللي جربت {niche} في {city}؟',
    'لو بدور على {phrase}، أروح لـ {niche} في {city} فين؟',
  ],
  'ar-gulf': [
    'وين أفضل {niche} في {city}؟',
    'أي {niche} في {city} تنصحون فيه؟',
    'كم يكلف {niche} في {city}؟',
    'وش أسأل {niche} في {city} قبل ما أتعاقد؟',
    'أبي {niche} في {city} أقدر أزوره هالأسبوع',
    'وش تجارب الناس مع {niche} في {city}؟',
    'لو أدور {phrase}، وين ألاقي {niche} في {city}؟',
  ],
  ar: [
    'ما أفضل {niche} في {city}؟',
    'أي {niche} يُنصح به في {city}؟',
    'كم تبلغ تكلفة {niche} في {city}؟',
    'ماذا أسأل مزود {niche} في {city} قبل الشراء؟',
    'أين أجد {niche} يمكن زيارته هذا الأسبوع في {city}؟',
    'ماذا يقول العملاء عن {niche} في {city}؟',
    'أين أجد {niche} في {city} يذكر {phrase}؟',
  ],
};

const STOP = new Set(['this', 'that', 'with', 'from', 'your', 'have', 'about', 'في', 'من', 'على', 'هذا', 'هذه']);

export function distinctivePhrase(homepageText: string, niche: string): string | null {
  const words = homepageText.split(/[^\p{L}\p{N}]+/u).map((word) => word.trim()).filter((word) => word.length >= 4);
  const nicheWords = new Set(niche.toLowerCase().split(/\s+/));
  const candidates = words.filter((word) => !STOP.has(word.toLowerCase()) && !nicheWords.has(word.toLowerCase()));
  candidates.sort((a, b) => b.length - a.length);
  return candidates[0] ?? null;
}

function fill(template: string, niche: string, city: string, phrase: string): string {
  return template.replaceAll('{niche}', niche).replaceAll('{city}', city).replaceAll('{phrase}', phrase);
}

export function generateBuyerQuestions(input: { homepageText: string; niche: string; city: string; language: string }): PromptDraft[] {
  const niche = input.niche.trim();
  const city = input.city.trim();
  const phrase = distinctivePhrase(input.homepageText, niche) ?? niche;
  const order: PromptLocale[] = input.language.toLowerCase().startsWith('ar')
    ? ['ar', 'ar-eg', 'ar-gulf', 'en']
    : ['en', 'ar-eg', 'ar-gulf', 'ar'];
  const drafts: PromptDraft[] = [];
  for (const locale of order) {
    for (const template of TEMPLATES[locale]) {
      drafts.push({ locale, body: fill(template, niche, city, phrase) });
    }
  }
  if (drafts.length !== 30) {
    throw new Error(`Expected 30 buyer questions, got ${drafts.length}`);
  }
  return drafts;
}
