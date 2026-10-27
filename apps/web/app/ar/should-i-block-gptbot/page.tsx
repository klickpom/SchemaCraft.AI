import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { articleGraph } from '@/lib/seo/jsonld';
import { pageAlternates, socialMeta } from '@/lib/seo/urls';

const PATH = '/ar/should-i-block-gptbot/';
const TITLE = 'هل تمنع GPTBot؟ أبقِ بحث ChatGPT وأوقف التدريب';
const DESCRIPTION = 'GPTBot يدرّب نماذج OpenAI. OAI-SearchBot يشغّل بحث ChatGPT. امنع أحدهما من غير أن تخسر الآخر، بملف robots.txt يتبع RFC 9309.';
const UPDATED = '2026-10-20';
const ROBOTS = `User-agent: *
Allow: /

# زواحف التدريب. هذا لا يؤثر في البحث الذكي ولا في بحث جوجل
User-agent: Google-Extended
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: meta-externalagent
Disallow: /

Sitemap: https://example.com/sitemap.xml
`;

const FAQ = [
  { q: 'هل منع GPTBot يحذف موقعي من ChatGPT؟', a: 'لا. OpenAI يوثّق GPTBot وOAI-SearchBot كزاحفين منفصلين. بحث ChatGPT يستخدم OAI-SearchBot للعثور على صفحات يقتبسها، وChatGPT-User عندما يسأل شخص عن رابط محدد. منع GPTBot وحده يترك الاثنين مسموحين.' },
  { q: 'هل منع GPTBot يؤثر في ترتيب جوجل؟', a: 'لا. بحث جوجل وAI Overviews يستخدمان Googlebot. GPTBot زاحف OpenAI. منع Google-Extended منفصل أيضاً عن Googlebot: جوجل يوثّقه كتحكم في تأريض Gemini وVertex AI، لا في بحث جوجل.' },
  { q: 'هل أمنع كل زواحف الذكاء الاصطناعي؟', a: 'فقط إذا كنت لا تريد أن تُقتبس في الإجابات. منع OAI-SearchBot أو PerplexityBot أو Claude-SearchBot يزيلك من تلك المنتجات. منع Googlebot يزيلك من جوجل. زواحف التدريب هي المجموعة التي يمكن منعها من غير هذا الأثر.' },
  { q: 'هل ChatGPT-User وPerplexity-User يطيعان robots.txt؟', a: 'ليس بشكل موثوق. هما يجلبان صفحة لأن شخصاً سأل. Perplexity يوثّق أن Perplexity-User قد يتجاهل robots.txt. إذا كان يجب أن تبقى الصفحة خاصة، اطلب تسجيل دخول. robots.txt سياسة زحف، وليس تحكم وصول.' },
  { q: 'هل قاعدة البوت في الـ CDN تظل تحجب ChatGPT بعد السماح لـ OAI-SearchBot؟', a: 'نعم، وهذا شائع. robots.txt قد يقول اسمح بينما الجدار يرجع 403 أو تحدياً لهذا الوكيل. افحص الطلب الحي، لا الملف فقط. سلاسل الوكيل سهلة التزييف، لذلك تنشر الشركات نطاقات IP للتحقق الحقيقي.' },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/should-i-block-gptbot/', 'ar'),
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH, type: 'article' }),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleGraph({ path: PATH, headline: TITLE, description: DESCRIPTION, datePublished: '2026-10-19', dateModified: UPDATED, breadcrumb: 'منع GPTBot', lang: 'ar', faq: FAQ })) }} />
      <ContentShell lang="ar" crumb="منع GPTBot" eyebrow="دليل · المصادر مذكورة" title="هل تمنع GPTBot؟" lead={<p><strong>نعم إذا كنت لا تريد استخدام صفحاتك لتدريب النماذج — وهذا لا يزيلك من بحث ChatGPT.</strong> GPTBot زاحف التدريب لدى OpenAI. بحث ChatGPT يستخدم زاحفاً آخر هو OAI-SearchBot. امنع GPTBot في مجموعته واترك OAI-SearchBot وGooglebot وBingbot مسموحين.</p>} updated={UPDATED} faq={FAQ} related={[RELATED.robots, RELATED.chatgpt, RELATED.crawlers, RELATED.crawlerChecker]}>
        <h2>زاحف البحث وزاحف التدريب منتجان مختلفان</h2>
        <p>كل شركة تنشر وكيلين أو ثلاثة. واحد يجلب الصفحات حتى تُقتبس في إجابة. وآخر يجمع النص للتدريب. وثالث يجلب صفحة فقط عندما يلصق شخص رابطاً. OpenAI وجوجل وAnthropic وآبل يوثّقون هذا الفصل. الإعدادات مستقلة.</p>
        <table dir="ltr">
          <thead><tr><th>الشركة</th><th>أبقِه للاقتباس</th><th>يمكن منعه (تدريب)</th><th>التوثيق</th></tr></thead>
          <tbody>
            <tr><td>OpenAI</td><td>OAI-SearchBot, ChatGPT-User</td><td>GPTBot</td><td><a href="https://developers.openai.com/api/docs/bots">OpenAI bots</a></td></tr>
            <tr><td>Google</td><td>Googlebot</td><td>Google-Extended</td><td><a href="https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers">Google crawlers</a></td></tr>
            <tr><td>Anthropic</td><td>Claude-SearchBot, Claude-User</td><td>ClaudeBot</td><td><a href="https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler">Anthropic</a></td></tr>
            <tr><td>Apple</td><td>Applebot</td><td>Applebot-Extended</td><td><a href="https://support.apple.com/en-us/119829">Applebot</a></td></tr>
            <tr><td>Perplexity</td><td>PerplexityBot, Perplexity-User</td><td>لا يوجد بوت تدريب منفصل</td><td><a href="https://docs.perplexity.ai/guides/bots">Perplexity bots</a></td></tr>
          </tbody>
        </table>
        <p>Perplexity لا ينشر زاحف تدريب يمكن منعه مع البقاء في إجاباته. منع PerplexityBot يخرجك من فهرسه. القائمة الكاملة، بما فيها Common Crawl وMeta، في <Link href="/ar/ai-crawlers/">قائمة الزواحف</Link>.</p>
        <h2>ملف robots.txt يمنع التدريب ويبقي البحث</h2>
        <p>حسب <a href="https://www.rfc-editor.org/rfc/rfc9309">RFC 9309</a>، الزاحف يستخدم المجموعة التي تحمل اسمه إن وُجدت، ويتجاهل مجموعة <code>*</code>. لذلك بوتات التدريب في مجموعة واحدة، وهذه المجموعة هي المكان الوحيد الذي يظهر فيه <code dir="ltr">Disallow: /</code>. OAI-SearchBot ليست له مجموعة، فيتبع <code>*</code> ويبقى مسموحاً.</p>
        <pre dir="ltr"><code>{ROBOTS}</code></pre>
        <p>بدّل رابط خريطة الموقع. الملف نفسه هو ما يبنيه <Link href="/ar/robots-txt-generator/">مولد robots.txt</Link> في وضع «اسمح للبحث وامنع التدريب». لا تضف لاحقاً مجموعة <code>User-agent: GPTBot</code> بقاعدة مختلفة: المجموعة الأخص تطابقًا تفوز، ومجموعة ثانية تستبدل هذه لهذا البوت.</p>
        <h2>ما الذي لا يفعله المنع</h2>
        <ul>
          <li><strong>لا يحذف صفحات تدرّب عليها نموذج صدر فعلاً.</strong> robots.txt يوقف الجلب القادم. لا يعدّل نموذجاً منشوراً.</li>
          <li><strong>لا يخفي صفحة عن شخص يستخدم ChatGPT.</strong> ChatGPT-User يجلب رابطاً سأل عنه أحد. المحتوى الخاص يحتاج تسجيل دخول.</li>
          <li><strong>لا يصلح حجب الـ CDN.</strong> إذا كان الجدار يتحدى كل وكيل غير المتصفح، فـ OAI-SearchBot لن يرى الصفحة حتى لو سمح robots.txt.</li>
          <li><strong>ليس رفعاً للترتيب.</strong> السماح لـ GPTBot ليس عامل ترتيب موثّقاً لجوجل ولا لبحث ChatGPT.</li>
        </ul>
        <h2>كيف تتحقق من النتيجة</h2>
        <ol>
          <li>انشر الملف على <code dir="ltr">/robots.txt</code> لنفس المضيف الذي يخدم الصفحات.</li>
          <li>تأكد أن GPTBot ممنوع، وأن OAI-SearchBot وPerplexityBot وClaude-SearchBot وGooglebot مسموحون للرابط الذي يهمك.</li>
          <li>اطلب الرابط بهذه الوكلاء. 403 أو تحدٍ جافاسكربت يعني أن الحاجز هو الجدار الناري لا الملف.</li>
        </ol>
        <p><Link href="/ar/">الفحص المجاني</Link> يفعل الاثنين: يحلّل robots.txt حسب RFC 9309 ويعرض السطر المطابق، ويرسل طلباً حياً بكل زاحف. الطلب الحي من سيرفر الفحص إشارة فقط، لأن الزواحف الحقيقية تأتي من نطاقات IP منشورة. معظم الفحوص تنتهي خلال 20 ثانية، بحد 20 فحصاً كل 10 دقائق. جوجل يتوقف عن قراءة robots.txt بعد 500 كيلوبايت.</p>
      </ContentShell>
    </>
  );
}
