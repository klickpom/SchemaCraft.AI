import type { Metadata } from 'next';
import Link from 'next/link';
import LlmsTxtBuilder from '@/components/tools/LlmsTxtBuilder';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { toolPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates, socialMeta } from '@/lib/seo/urls';

const PATH = '/ar/llms-txt-generator/';
const TITLE = 'مولد llms.txt من خريطة موقعك';
const DESCRIPTION = 'ابنِ ملف llms.txt: مسودة من خريطة الموقع، وصف للصفحات المهمة، ثم تنزيل. مع شرح صادق لما يفعله الملف اليوم.';
const FAQ = [
  { q: 'ما هو llms.txt؟', a: 'اقتراح معيار (llmstxt.org، 2024) لملف Markdown في جذر الموقع يخبر النماذج ما هو الموقع وأي الصفحات أهم، مع وصف من سطر لكل صفحة. هو خريطة مختارة، وليس ملف تحكم في الوصول مثل robots.txt.' },
  { q: 'هل يحسّن llms.txt السيو أو ترتيب البحث الذكي؟', a: 'لا يوجد دليل على ذلك اليوم. جوجل قال إنه لا يستخدم llms.txt في البحث، ولا محرك بحث ذكي كبير يوثّقه كإشارة ترتيب أو اقتباس. إضافته رخيصة ومفيدة لبعض أدوات البرمجة والوكلاء التي تقرأه. عامله كإضافة قليلة الجهد، لا كإصلاح للزحف أو المحتوى.' },
  { q: 'ما الفرق بين llms.txt وrobots.txt؟', a: 'robots.txt يقول للزاحف ما يجوز أن يجلبه. llms.txt يقول للنموذج ما يستحق القراءة وما موضوع كل صفحة. llms.txt لا يستطيع منع شيء.' },
  { q: 'ماذا يوضع في قسم Optional؟', a: 'صفحات يستطيع النموذج تخطيها عندما يكون السياق محدوداً: أرشيف المدونة، وسجل التغييرات، والصفحات القانونية. المعيار يحجز اسم القسم Optional لهذا الغرض.' },
  { q: 'كيف أضيف llms.txt لووردبريس أو شوبيفاي؟', a: 'في ووردبريس ارفع الملف إلى جذر الموقع عبر SFTP أو مدير الملفات. بعض إضافات السيو، ومنها Yoast، تستطيع توليد واحد. شوبيفاي لا يسمح بملفات في الجذر، فارفعه من Content ثم Files وأنشئ تحويلاً من /llms.txt إلى ذلك الملف.' },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/llms-txt-generator/', 'ar'),
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolPageGraph({ path: PATH, name: 'مولد llms.txt', description: DESCRIPTION, lang: 'ar', faq: FAQ, breadcrumb: 'مولد llms.txt' })) }} />
      <ContentShell lang="ar" crumb="مولد llms.txt" eyebrow="أداة مجانية · تتبع llmstxt.org" title="مولد llms.txt" lead={<p>أدخل نطاقك <strong>لتُنشأ مسودة من خريطة الموقع الحقيقية</strong>، ثم أبقِ الصفحات المهمة، وأضف وصفاً من سطر لكل واحدة، ونزّل ملفاً يتبع تنسيق <a href="https://llmstxt.org/" target="_blank" rel="noopener noreferrer">llmstxt.org</a>.</p>} updated="2026-10-20" tool={<LlmsTxtBuilder lang="ar" />} faq={FAQ} related={[RELATED.robots, RELATED.crawlerChecker, RELATED.geo]}>
        <h2>التنسيق في ثلاثين ثانية</h2>
        <pre dir="ltr"><code>{`# Acme Running

> Acme Running sells trail and road running shoes online and ships to the EU and US.

Prices are in EUR. All shoes have a 60-day return window.

## Products

- [Trail shoes](https://acme.example/trail/): Full trail range with sizes and prices

## Optional

- [Blog](https://acme.example/blog/): Training guides`}</code></pre>
        <ul>
          <li><strong>H1</strong> باسم الموقع أو المشروع. هذا العنصر الوحيد المطلوب.</li>
          <li><strong>اقتباس</strong> بجملة واحدة. اكتبها كما تريد أن يصفك نموذج.</li>
          <li><strong>نص حر</strong> للحقائق: الأسواق والأسعار والسياسات وما لا تفعله.</li>
          <li><strong>أقسام H2</strong> بروابط Markdown، ولكل رابط وصف اختياري بعد النقطتين.</li>
        </ul>
        <h2>ماذا يفعل الملف وماذا لا يفعل</h2>
        <p>كن واضحاً. اقترحه Jeremy Howard من Answer.AI في سبتمبر 2024 ليساعد النماذج على استخدام المواقع وقت الإجابة. بعض أدوات المطورين والوكلاء تقرأه، وكثير من مواقع التوثيق تنشره. لكن جوجل قال إنه لا يستخدمه في البحث، ولا منتج بحث ذكي كبير يوثّقه كإشارة اقتباس.</p>
        <p>ما يقرر إن كان ChatGPT أو Perplexity أو AI Overviews يستطيعون اقتباسك هو الأساسيات: زواحف مسموحة، ومحتوى في HTML، وصفحات تجيب بوضوح. افحص ذلك أولاً في <Link href="/ar/ai-crawler-checker/">فاحص الزواحف</Link> و<Link href="/ar/">الفحص الكامل</Link>.</p>
        <h2>كيف تكتب ملفاً جيداً</h2>
        <ul>
          <li>اجعله قصيراً: 10 إلى 30 صفحة تجيب عن أسئلة العملاء فعلاً.</li>
          <li>صف كل صفحة بالسؤال الذي تجيب عنه، لا بنص تسويقي.</li>
          <li>استخدم روابط مطلقة ترجع 200 وليست ممنوعة في robots.txt.</li>
          <li>ضع الأرشيف والصفحات الثانوية تحت <code dir="ltr">## Optional</code>.</li>
          <li>حدّثه عندما تضيف صفحة مهمة أو تزيلها.</li>
        </ul>
        <h2>النشر</h2>
        <p>ارفع الملف ليُخدم على <code dir="ltr">https://yoursite.com/llms.txt</code> بنوع <code>text/plain</code> أو <code>text/markdown</code> وحالة 200. الفحص يراجع الاثنين.</p>
      </ContentShell>
    </>
  );
}
