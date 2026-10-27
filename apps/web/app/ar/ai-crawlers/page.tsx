import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { ACTIVE_BOTS, DEPRECATED_BOTS, type BotPurpose } from '@schemacraft/audit-core/bots/registry';
import { articleGraph } from '@/lib/seo/jsonld';
import { pageAlternates, socialMeta } from '@/lib/seo/urls';

const PATH = '/ar/ai-crawlers/';
const TITLE = 'قائمة زواحف الذكاء الاصطناعي: كل وكيل وماذا يفعل';
const DESCRIPTION = 'GPTBot وOAI-SearchBot وClaudeBot وPerplexityBot وGoogle-Extended وغيرهم: ماذا يفعل كل زاحف، وهل يشغّل البحث أم التدريب، وكيف تتحكم فيه.';
const UPDATED = '2026-10-20';
const PURPOSE_LABEL: Record<BotPurpose, string> = {
  'search-citation': 'البحث والاقتباس',
  'user-fetch': 'الجلب بطلب المستخدم',
  training: 'تدريب النماذج',
};
const PURPOSE_NOTE: Record<BotPurpose, string> = {
  'search-citation': 'منع هؤلاء يزيل صفحاتك من نتائج ذلك المنتج ومن إجاباته. معظم المواقع ينبغي أن تسمح لهم.',
  'user-fetch': 'هؤلاء يجلبون صفحة محددة لأن مستخدماً لصق رابطاً أو طلب من المساعد قراءتها. ليسوا زواحف جمع بالجملة.',
  training: 'هؤلاء يجمعون محتوى قد يُستخدم لتدريب النماذج. منعهم لا يؤثر في ظهور البحث.',
};
const FAQ = [
  { q: 'أي زواحف الذكاء الاصطناعي أسمح لها؟', a: 'اسمح لزواحف البحث في المنتجات التي تريد أن تُقتبس فيها: OAI-SearchBot لبحث ChatGPT، وPerplexityBot، وClaude-SearchBot، وGooglebot وBingbot للبحث العادي وAI Overviews. السماح لزواحف التدريب مثل GPTBot وClaudeBot وGoogle-Extended قرار عمل منفصل.' },
  { q: 'ما الفرق بين GPTBot وOAI-SearchBot؟', a: 'GPTBot يجمع بيانات قد تُستخدم لتدريب نماذج OpenAI. OAI-SearchBot يفهرس الصفحات حتى تُعرض وتُربط في بحث ChatGPT. OpenAI يوثّقهما كإعدادين مستقلين.' },
  { q: 'هل الوكلاء بطلب المستخدم مثل ChatGPT-User يتبعون robots.txt؟', a: 'هؤلاء يجلبون صفحة لأن شخصاً طلبها، لذلك تعاملهم الشركات بشكل مختلف عن الزواحف الآلية. Perplexity يوثّق أن Perplexity-User يتجاهل robots.txt عادة لهذا السبب. إذا كان يجب إبعاد المحتوى عنهم، استخدم تسجيل الدخول لا robots.txt.' },
  { q: 'كيف أعرف أن الطلب جاء فعلاً من زاحف ذكاء اصطناعي؟', a: 'سلاسل الوكيل سهلة التزييف. جوجل وبينج وOpenAI وPerplexity وغيرهم ينشرون نطاقات IP أو طريقة reverse-DNS للتحقق. طابق عنوان الطلب مع قائمة الشركة قبل أن تثق بالوكيل.' },
  { q: 'هل منع زواحف الذكاء الاصطناعي يضر ترتيب جوجل؟', a: 'لا. بحث جوجل يستخدم Googlebot. منع GPTBot أو ClaudeBot أو حتى Google-Extended لا يؤثر في ترتيب بحث جوجل. منع Googlebot نفسه يزيلك من بحث جوجل، بما فيه AI Overviews.' },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/ai-crawlers/', 'ar'),
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH, type: 'article' }),
};

export default function Page() {
  const groups: BotPurpose[] = ['search-citation', 'user-fetch', 'training'];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleGraph({ path: PATH, headline: TITLE, description: DESCRIPTION, datePublished: '2026-09-07', dateModified: UPDATED, breadcrumb: 'قائمة الزواحف', lang: 'ar', faq: FAQ })) }} />
      <ContentShell lang="ar" crumb="قائمة الزواحف" eyebrow="دليل · روابط توثيق الشركات" title="قائمة زواحف الذكاء الاصطناعي: كل وكيل وماذا يفعل" lead={<p>شركات الذكاء الاصطناعي تشغّل <strong>ثلاثة أنواع من البوتات</strong>: زواحف بحث تقرر إن كان يمكن اقتباسك، ووكلاء بطلب المستخدم يجلبون صفحة عندما يسأل أحد عنها، وزواحف تدريب تجمع بيانات لنماذج لاحقة. يمكنك السماح لنوع ومنع آخر. هذه كل الوكلاء، مرتبة حسب ما تفعله.</p>} updated={UPDATED} faq={FAQ} related={[RELATED.crawlerChecker, RELATED.gptbot, RELATED.chatgpt, RELATED.robots]}>
        {groups.map((purpose) => (
          <section key={purpose}>
            <h2 id={purpose}>زواحف {PURPOSE_LABEL[purpose]}</h2>
            <p>{PURPOSE_NOTE[purpose]}</p>
            <table dir="ltr">
              <thead><tr><th>الوكيل</th><th>الشركة</th><th>ماذا يفعل</th><th>التوثيق</th></tr></thead>
              <tbody>
                {ACTIVE_BOTS.filter((b) => b.purpose === purpose).map((b) => (
                  <tr key={b.id}>
                    <td><code>{b.userAgent}</code></td>
                    <td>{b.vendor}</td>
                    <td dir="rtl">{b.purposeAr}</td>
                    <td><a href={b.docsUrl} target="_blank" rel="noopener noreferrer">رسمي</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
        {DEPRECATED_BOTS.length > 0 && (
          <>
            <h2>وكلاء متقاعدون</h2>
            <p>ما زالوا يظهرون في ملفات robots.txt قديمة. القواعد الخاصة بهم لا تفعل شيئاً للزواحف الحالية.</p>
            <ul>
              {DEPRECATED_BOTS.map((b) => (
                <li key={b.id}><code dir="ltr">{b.userAgent}</code> — {b.purposeAr}</li>
              ))}
            </ul>
          </>
        )}
        <h2>وصفات robots.txt</h2>
        <h3>تُقتبس في البحث الذكي وتخرج من التدريب</h3>
        <pre dir="ltr"><code>{`User-agent: *
Allow: /

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: meta-externalagent
Disallow: /`}</code></pre>
        <h3>الخروج من ChatGPT بالكامل</h3>
        <pre dir="ltr"><code>{`User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
Disallow: /`}</code></pre>
        <p>تذكّر أن الزاحف المذكور في مجموعته يتجاهل قواعد <code>User-agent: *</code>. ابنِ ملفاً كاملاً في <Link href="/ar/robots-txt-generator/">مولد robots.txt</Link>.</p>
        <h2>عندما لا يكفي robots.txt</h2>
        <p>الـ CDN أو الجدار الناري يرد قبل قراءة robots.txt. Cloudflare يحجب زواحف الذكاء الاصطناعي المعروفة افتراضياً على النطاقات الجديدة منذ يوليو 2025، وكثير من الاستضافات تحدّ معدل البوتات غير المألوفة. إذا كان الزاحف مسموحاً في الملف وسجلاتك تعرض 403 أو 429، غيّر قاعدة الـ CDN. <Link href="/ar/ai-crawler-checker/">فاحص الزواحف</Link> يعرض الطبقتين معاً.</p>
      </ContentShell>
    </>
  );
}
