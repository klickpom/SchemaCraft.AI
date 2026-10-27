import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import { ArticlePage } from '@/components/ArticlePage';
import { SUPPORT_EMAIL, webPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates } from '@/lib/seo/urls';

const PATH = '/ar/about/';
const TITLE = 'عن SchemaCraft AI';
const DESCRIPTION = 'SchemaCraft AI فحص مجاني للسيو وظهور البحث الذكي. يجلب الصفحات من سيرفره، ويحسب الدرجة مما يستطيع التحقق منه، ويعرض الدليل لكل نقطة.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/about/', 'ar'),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageGraph(PATH, TITLE, DESCRIPTION, 'ar')) }} />
      <SiteChrome lang="ar">
        <ArticlePage lang="ar" title={TITLE} lede={DESCRIPTION}>
          <h2>ماذا يفعل المنتج</h2>
          <p>SchemaCraft AI يجيب عن سؤال واحد: هل تستطيع محركات البحث ومساعدات الذكاء الاصطناعي الوصول إلى الصفحة وقراءتها واقتباسها؟ الفحص يجري حوالي 50 فحصاً عبر السيو التقني وقابلية الزحف والمحتوى وسكيما الكيان وجاهزية الذكاء الاصطناعي. وبجانبه مولدات ومدققات مجانية لـ robots.txt وllms.txt وJSON-LD. كل شيء مجاني، من غير حساب ومن غير جدار دفع.</p>
          <h2>كيف يُحسب الفحص</h2>
          <p>الصفحة تُجلب من سيرفرات SchemaCraft عبر <code dir="ltr">/api/audit</code>. الرد يتضمن حالة HTTP النهائية وسلسلة التحويل وترويسات الرد وHTML الخام وrobots.txt وكتل JSON-LD المستخرجة. الدرجات تُحسب من هذا الدليل فقط. إذا تعذر جلب HTML، يظهر أن الفحص لم يكتمل. الفحوص من غير دليل تُعلَّم «غير مُقيَّم» وتُستبعد من الدرجة.</p>
          <h2 id="scoring">كيف تُحسب الدرجة</h2>
          <ul>
            <li>لكل فحص وزن خطورة: حرج 5، وعالٍ 3، ومتوسط 2، ومنخفض 1. الفحوص المعلوماتية بلا وزن.</li>
            <li>النجاح يأخذ الرصيد كاملاً، والتحذير نصفه، والفشل لا شيء. «غير مُقيَّم» يُترك خارج الحساب.</li>
            <li>كل فئة من الخمس هي المتوسط الموزون لفحوصها. الدرجة الكلية توزّعها: سيو تقني 20٪، وقابلية الزحف 20٪، والمحتوى وقابلية الإجابة 20٪، والكيان والسكيما 15٪، وجاهزية البحث الذكي 25٪.</li>
            <li>سقوف تمنع متوسطاً جميلاً من إخفاء حاجز: الصفحة التي عليها noindex أو Googlebot محجوب تُسقَف عند 40، والصفحة التي يحتاج محتواها جافاسكربت أو فيها أقل من 80 كلمة تُسقَف عند 50. التقرير يقول دائماً متى طُبِّق السقف ولماذا.</li>
            <li>منع زواحف تدريب الذكاء الاصطناعي (GPTBot وClaudeBot وGoogle-Extended وأشباهها) خيار سياسة ولا يخفض الدرجة. منع زواحف البحث الذكي يخفضها.</li>
          </ul>
          <h2>ما الذي لا تقيسه الدرجة</h2>
          <p>الروابط الخلفية وسلطة النطاق وحجم البحث والمنافسة. الصفحة قد تسجّل 95 وتظل ضعيفة الترتيب إذا كانت مواقع أخرى أوثق في الموضوع. الدرجة تقول إن كان شيء في الصفحة يمنع محركات البحث ومساعدات الذكاء الاصطناعي من استخدامها.</p>
          <h2>لمن هو</h2>
          <p>لوكالات السيو والمستشارين المستقلين والمؤسسين التقنيين الذين يحتاجون تشخيصاً سريعاً يمكن تفتيشه، لا درجة صندوق أسود. ليس ضمان ترتيب، ولا منتج شريك لجوجل، ولا بديلاً عن Search Console.</p>
          <h2>التواصل</h2>
          <p>
            البريد <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. التحديثات:{' '}
            <a href="https://x.com/SchemaCraftAI" rel="noopener noreferrer" target="_blank">@SchemaCraftAI</a>. المصدر:{' '}
            <a href="https://github.com/klickpom/SchemaCraft.AI" rel="noopener noreferrer" target="_blank">github.com/klickpom/SchemaCraft.AI</a>.
          </p>
        </ArticlePage>
      </SiteChrome>
    </>
  );
}
