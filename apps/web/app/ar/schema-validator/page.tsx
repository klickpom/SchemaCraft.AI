import type { Metadata } from 'next';
import Link from 'next/link';
import SchemaValidator from '@/components/tools/SchemaValidator';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { toolPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates, socialMeta } from '@/lib/seo/urls';

const PATH = '/ar/schema-validator/';
const TITLE = 'مدقق السكيما: افحص JSON-LD للنتائج المنسّقة';
const DESCRIPTION = 'الصق JSON-LD أو أدخل رابطاً لمعرفة الخصائص المطلوبة الناقصة والتواريخ والأسعار غير الصالحة والقيم الوهمية والأنواع المتوقفة. يتعامل مع @graph. مجاني.';
const FAQ = [
  { q: 'كيف أختبر ترميز السكيما؟', a: 'الصق JSON-LD أو وسم script كاملاً أو مصدر الصفحة أعلاه، أو بدّل إلى جلب رابط. يُفحص كل عنصر، بما فيه العناصر المتداخلة وكل ما داخل @graph.' },
  { q: 'ما الفرق بين الخطأ والتحذير؟', a: 'الخطأ خاصية يدرجها جوجل كمطلوبة لنوع النتيجة، أو قيمة لا يستطيع تحليلها (مثل سعر فيه رمز عملة أو تاريخ ليس ISO 8601). الأخطاء تجعل العنصر غير مؤهل. التحذيرات خصائص مُستحسنة تغني النتيجة وليست مطلوبة.' },
  { q: 'السكيما صحيحة. لماذا لا أحصل على نتيجة منسّقة؟', a: 'الترميز الصحيح يجعل الصفحة مؤهلة، لا مضمونة. جوجل ينظر أيضاً إلى جودة الموقع، وهل يطابق الترميز المحتوى الظاهر، وإلى سياساته. بعض الأنواع قُيّدت: نتائج الأسئلة الشائعة لمعظم المواقع أُوقفت، ونتائج HowTo أُزيلت عام 2023.' },
  { q: 'كيف يختلف هذا عن اختبار النتائج المنسّقة من جوجل؟', a: 'اختبار جوجل هو المرجع لأهلية جوجل وهو يرسم الجافاسكربت. هذا المدقق أسرع، ويعمل على مقتطف ملصوق، ويشرح كل مشكلة بلغة واضحة، ويضيف فحوص جودة مثل النص الوهمي والروابط النسبية. استخدمه أثناء التحرير، ثم أكّد في اختبار جوجل قبل النشر.' },
  { q: 'هل وضع الرابط يرى السكيما التي يضيفها الجافاسكربت؟', a: 'لا. يقرأ HTML الذي يرجعه سيرفرك، وهو ما يراه معظم زواحف الذكاء الاصطناعي. إذا كانت السكيما تظهر بعد الجافاسكربت فقط، جوجل قد يقرأها وكثير غيرهم لا يستطيع. JSON-LD على السيرفر أأمن.' },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/schema-validator/', 'ar'),
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolPageGraph({ path: PATH, name: 'مدقق السكيما', description: DESCRIPTION, lang: 'ar', faq: FAQ, breadcrumb: 'مدقق السكيما' })) }} />
      <ContentShell lang="ar" crumb="مدقق السكيما" eyebrow="أداة مجانية · الصق الكود أو الرابط" title="مدقق ترميز السكيما" lead={<p>افحص JSON-LD مقابل <strong>الخصائص المطلوبة والمُستحسنة لدى جوجل</strong> للمنتج والنشاط المحلي والمقال والفعالية والوصفة والفيديو والوظيفة والدورة ومسار التنقل والأسئلة والمنظمة، والتقط أخطاء القيم التي تُسقط النتيجة بصمت.</p>} updated="2026-10-20" tool={<SchemaValidator lang="ar" />} faq={FAQ} related={[RELATED.generators, RELATED.audit, RELATED.crawlerChecker]}>
        <h2>ماذا يفحص</h2>
        <ul>
          <li><strong>صيغة JSON</strong> لكل كتلة، مع رسالة المحلّل.</li>
          <li><strong><code>@context</code></strong> — من غيره لا تُقرأ الكتلة كـ Schema.org أصلاً.</li>
          <li><strong>الخصائص المطلوبة</strong> لكل نوع، حسب توثيق البيانات المنظمة في Google Search Central.</li>
          <li><strong>الخصائص المُستحسنة</strong> في العناصر العليا. المراجع المتداخلة لا تُعلَّم.</li>
          <li><strong>القيم:</strong> تواريخ ISO 8601، وأسعار رقمية، ورموز عملة ISO 4217، ونطاقات تقييم، وروابط مطلقة.</li>
          <li><strong>قيم وهمية</strong> بقيت من القالب، مثل <code>example.com</code> أو «اسم الشركة».</li>
          <li><strong>ميزات متوقفة</strong> مثل HowTo، وحدود نتائج الأسئلة الحالية.</li>
        </ul>
        <h2>خمسة أخطاء نراها كثيراً</h2>
        <ol>
          <li><strong>سعر فيه رمز:</strong> <code dir="ltr">&quot;price&quot;: &quot;$1,299&quot;</code> يجب أن يكون <code dir="ltr">&quot;1299.00&quot;</code> مع <code dir="ltr">&quot;priceCurrency&quot;: &quot;USD&quot;</code>.</li>
          <li><strong>تاريخ محلي:</strong> <code dir="ltr">19/10/2026</code> يجب أن يكون <code dir="ltr">2026-10-19</code>.</li>
          <li><strong>صورة نسبية:</strong> <code dir="ltr">/img/shoe.jpg</code> يجب أن يكون عنوان <code>https://</code> كاملاً.</li>
          <li><strong>تقييم من غير عدد:</strong> <code>AggregateRating</code> يحتاج <code>ratingCount</code> أو <code>reviewCount</code>.</li>
          <li><strong>ترميز لا يطابق الصفحة:</strong> أسعار أو تقييمات أو أسئلة في JSON-LD لا يراها الزائر تخالف إرشادات جوجل.</li>
        </ol>
        <h2>تحتاج كتابة الترميز أولاً؟</h2>
        <p>استخدم <Link href="/ar/json-ld-generator/">مولدات JSON-LD</Link> لبناء المنتج والنشاط المحلي والمقال وغيرها من نموذج، ثم الصق النتيجة هنا.</p>
      </ContentShell>
    </>
  );
}
