import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import { ArticlePage } from '@/components/ArticlePage';
import { SUPPORT_EMAIL, webPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates } from '@/lib/seo/urls';

const PATH = '/ar/privacy/';
const TITLE = 'سياسة الخصوصية';
const DESCRIPTION = 'SchemaCraft AI مجاني ولا يحتاج حساباً. عند تشغيل فحص، يُرسل الرابط الذي تدخله إلى سيرفرنا حتى تُجلب الصفحة. لا يُجمع غير ذلك.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/privacy/', 'ar'),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageGraph(PATH, TITLE, DESCRIPTION, 'ar')) }} />
      <SiteChrome lang="ar">
        <ArticlePage lang="ar" title={TITLE} lede="آخر تحديث 20 أكتوبر 2026. هذه السياسة تصف ما يجمعه SchemaCraft AI عند استخدام schemacraft-ai.site.">
          <h2>من نحن</h2>
          <p>SchemaCraft AI يشغّل هذا الموقع. التواصل: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
          <h2>ماذا نجمع</h2>
          <ul>
            <li><strong>روابط الفحص.</strong> عند تشغيل فحص، يُرسل الرابط إلى سيرفرنا حتى نجلب تلك الصفحة. نحتاج الرابط للحصول على HTML والترويسات وrobots.txt وJSON-LD. لا نطلب إنشاء حساب لهذا.</li>
            <li><strong>سجلات الاستضافة.</strong> المستضيف (Hostinger) والـ CDN قد يسجلان عنوان IP ووكيل المستخدم والمسار المطلوب ضمن تشغيل الموقع العادي.</li>
          </ul>
          <h2>ما الذي لا نفعله</h2>
          <p>لا نبيع بيانات شخصية. لا نطلب تسجيل دخول. محتوى JSON-LD وrobots.txt وllms.txt الذي تلصقه يُعالَج في متصفحك ولا يُرسل إلى سيرفرنا. طلبات الفحص محدودة المعدل لكل عنوان IP. العداد يُحفظ مؤقتاً على السيرفر ولا يُربط بك.</p>
          <h2>ملفات تعريف الارتباط</h2>
          <p>هذا الموقع لا يضع كوكيز ولا يستخدم بكسل تسويق ولا كوكي تحليلات. الخطوط تُخدم من نطاقنا. إذا اخترت العربية أو الإنجليزية، يُحفظ الاختيار في التخزين المحلي لهذا المتصفح حتى تفتح الصفحة التالية بنفس اللغة. لا يُرسل إلى سيرفرنا.</p>
          <h2>الاحتفاظ</h2>
          <p>طلبات الفحص تُعالَج لإرجاع التقرير. سجلات الاستضافة تتبع مدة المستضيف الافتراضية. الرسائل التي ترسلها للدعم تُحفظ طالما لزم الرد عليك.</p>
          <h2>خياراتك</h2>
          <p>يمكنك التوقف عن إرسال الروابط في أي وقت. لطلب متعلق بالبيانات راسل {SUPPORT_EMAIL}.</p>
        </ArticlePage>
      </SiteChrome>
    </>
  );
}
