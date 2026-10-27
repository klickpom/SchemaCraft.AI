import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import { ArticlePage } from '@/components/ArticlePage';
import { SUPPORT_EMAIL, webPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates } from '@/lib/seo/urls';

const PATH = '/ar/terms/';
const TITLE = 'شروط الاستخدام';
const DESCRIPTION = 'SchemaCraft AI مجاني ويُقدَّم كما هو. الفحوص وملفات robots.txt وllms.txt وJSON-LD المولَّدة لا تضمن ترتيباً ولا نتائج منسّقة ولا اقتباسات ولا زيارات.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/terms/', 'ar'),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageGraph(PATH, TITLE, DESCRIPTION, 'ar')) }} />
      <SiteChrome lang="ar">
        <ArticlePage lang="ar" title={TITLE} lede="آخر تحديث 20 أكتوبر 2026. باستخدام schemacraft-ai.site أنت توافق على هذه الشروط.">
          <h2>الخدمة</h2>
          <p>SchemaCraft AI يقدّم فحص موقع يُجلب من سيرفراتنا، ومولدات ومدققات في المتصفح لـ robots.txt وllms.txt وJSON-LD من Schema.org. كل الميزات مجانية ولا تحتاج حساباً. الفحوص محدودة بـ 20 لكل عنوان IP كل 10 دقائق.</p>
          <h2>لا وعد بترتيب أو نتيجة منسّقة</h2>
          <p>JSON-LD الصحيح، أو درجة فحص عالية، أو إصلاح جاهز للنسخ، لا يضمن ترتيب جوجل ولا اقتباس ذكاء اصطناعي ولا نتيجة منسّقة ولا نقرات أكثر. جوجل وبقية الزواحف يطبّقون سياساتهم. إذا تعذر جلب الصفحة لا نخترع درجة.</p>
          <h2>الاستخدام المقبول</h2>
          <p>أدخل فقط روابط يُسمح لك بفحصها. لا تستخدم نقطة الفحص للهجوم أو الإغراق أو مسح أنظمة لا تملكها أو ليس لديك إذن باختبارها. قد نحد المعدل أو نحجب الحركة المسيئة.</p>
          <h2>مشتريات سابقة</h2>
          <p>إذا دفعت مقابل التصريح السابق بسعر 9 دولارات، راسل <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> من حساب PayPal الذي استُخدم وسنعيد المبلغ.</p>
          <h2>حد المسؤولية</h2>
          <p>الأداة تُقدَّم كما هي. بالقدر الذي يسمح به القانون، SchemaCraft AI غير مسؤول عن أرباح فائتة أو ترتيب فائت أو أضرار ناشئة عن ترميز مولَّد أو نصيحة فحص. تبقى مسؤولاً عما تنشره على موقعك.</p>
          <h2>التواصل</h2>
          <p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
        </ArticlePage>
      </SiteChrome>
    </>
  );
}
