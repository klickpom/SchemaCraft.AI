import type { Metadata } from 'next';
import Link from 'next/link';
import RobotsTxtBuilder from '@/components/tools/RobotsTxtBuilder';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { toolPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates, socialMeta } from '@/lib/seo/urls';

const PATH = '/ar/robots-txt-generator/';
const TITLE = 'مولد robots.txt: اسمح للبحث الذكي وامنع التدريب';
const DESCRIPTION = 'أنشئ robots.txt صحيحاً: أبقِ بحث ChatGPT وPerplexity وAI Overviews، وامنع GPTBot وClaudeBot وبقية زواحف التدريب. مجاني.';
const FAQ = [
  { q: 'كيف أمنع تدريب الذكاء الاصطناعي وأبقى في نتائج البحث الذكي؟', a: 'امنع وكلاء التدريب (GPTBot وClaudeBot وGoogle-Extended وApplebot-Extended وCCBot وmeta-externalagent) واترك وكلاء البحث (OAI-SearchBot وClaude-SearchBot وPerplexityBot وGooglebot وBingbot) مسموحين. وضع «بحث نعم، تدريب لا» يفعل ذلك.' },
  { q: 'هل يجب أن أذكر كل زاحف أريد السماح له؟', a: 'لا. الزاحف الذي ليست له مجموعة يتبع User-agent: *. تسميته مفيدة فقط إذا احتاج قواعد مختلفة، وعندها يجب تكرار منع المسارات الخاصة داخل مجموعته، لأنه يتجاهل مجموعة * بالكامل.' },
  { q: 'هل يستطيع robots.txt إزالة صفحة من جوجل؟', a: 'لا. الرابط الممنوع قد يُفهرس من غير محتواه إذا أشارت إليه صفحات أخرى. لإخراج صفحة من النتائج اسمح بالزحف وأضف noindex في meta أو ترويسة X-Robots-Tag. جوجل لا يدعم noindex داخل robots.txt.' },
  { q: 'هل منع GPTBot يوقف ظهوري في ChatGPT؟', a: 'يوقف استخدام OpenAI لصفحاتك في تدريب لاحق. إجابات بحث ChatGPT تأتي من OAI-SearchBot، فمنع GPTBot وحده لا يزيلك من بحث ChatGPT.' },
  { q: 'أين أرفع robots.txt؟', a: 'في جذر كل مضيف: https://yoursite.com/robots.txt. الملف على www لا ينطبق على shop. في ووردبريس أغلب إضافات السيو فيها محرر. في شوبيفاي عدّل قالب robots.txt.liquid. في Wix وSquarespace من إعدادات السيو.' },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/robots-txt-generator/', 'ar'),
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolPageGraph({ path: PATH, name: 'مولد robots.txt', description: DESCRIPTION, lang: 'ar', faq: FAQ, breadcrumb: 'مولد robots.txt' })) }} />
      <ContentShell lang="ar" crumb="مولد robots.txt" eyebrow="أداة مجانية · تعمل في المتصفح" title="مولد robots.txt لزواحف الذكاء الاصطناعي" lead={<p>اختر سياسة، أضف المسارات الخاصة، وانسخ ملف robots.txt <strong>يبقيك في بحث ChatGPT وPerplexity وAI Overviews ويخرجك من تدريب النماذج</strong>. كل زاحف مربوط بتوثيق شركته.</p>} updated="2026-10-20" tool={<RobotsTxtBuilder lang="ar" />} faq={FAQ} related={[RELATED.crawlerChecker, RELATED.gptbot, RELATED.crawlers, RELATED.llms]}>
        <h2>كيف يعمل الملف الناتج</h2>
        <p>المخرجات مجموعتان. <code>User-agent: *</code> تحمل قواعد الجميع، بما فيها مساراتك الخاصة. الزواحف التي تمنعها تشترك في مجموعة ثانية تنتهي بـ <code dir="ltr">Disallow: /</code>. عدة أسطر <code>User-agent</code> في مجموعة واحدة صحيحة حسب <a href="https://www.rfc-editor.org/rfc/rfc9309" target="_blank" rel="noopener noreferrer">RFC 9309</a>.</p>
        <p>الزواحف المسموحة <em>لا تُذكر عمداً</em>. لو ذُكرت لاحتاج كل منها نسخة من قواعد المسارات الخاصة، لأن الزاحف الذي يجد مجموعة باسمه يتجاهل مجموعة <code>*</code>. تركها خارج الملف أقصر وأأمن.</p>
        <h2>أي وضع تختار؟</h2>
        <ul>
          <li><strong>بحث ذكي نعم، تدريب لا</strong> — للشركات والناشرين والمتاجر التي تريد الاقتباس والنقر من إجابات الذكاء ولا تريد تقديم بيانات تدريب. هذا أغلب المواقع.</li>
          <li><strong>اسمح للكل</strong> — للتوثيق والمشاريع المفتوحة ولمن يريد أقصى وصول، بما فيه الدخول في معرفة النماذج اللاحقة.</li>
          <li><strong>امنع كل الذكاء الاصطناعي</strong> — يبقي بحث جوجل وبينج وآبل ويزيلك من إجابات ChatGPT وClaude وPerplexity. AI Overviews ما زالت تتبع Googlebot.</li>
        </ul>
        <h2>أخطاء يتجنبها المولد</h2>
        <ul>
          <li><strong>منع Google-Extended للخروج من AI Overviews.</strong> لا يفعل ذلك. AI Overviews تتبع قواعد Googlebot.</li>
          <li><strong>سطر <code>Disallow:</code> فارغ.</strong> معناه اسمح للكل، لا امنع الكل.</li>
          <li><strong>منع CSS والجافاسكربت.</strong> جوجل يحتاجهما لرسم الصفحة. لا تمنع مجلدات الملفات.</li>
          <li><strong>حالة أحرف المسار.</strong> المسارات حساسة لحالة الأحرف: <code>/Admin/</code> لا يمنع <code>/admin/</code>.</li>
          <li><strong>استخدام robots.txt للأسرار.</strong> الملف علني. احمِ المناطق الخاصة بتسجيل الدخول.</li>
        </ul>
        <h2>اختبره بعد الرفع</h2>
        <p>شغّل <Link href="/ar/ai-crawler-checker/">فاحص الزواحف</Link> على أي صفحة. يعرض لكل زاحف أي قاعدة طابقت، وهل رد الـ CDN أو الجدار بشكل مختلف. في Search Console، تقرير robots.txt يعرض النسخة التي جلبها جوجل آخر مرة.</p>
      </ContentShell>
    </>
  );
}
