import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteChrome } from '@/components/SiteChrome';
import SchemaDirectoryHub from '@/components/SchemaDirectoryHub';
import { jsonLdGeneratorGraph } from '@/lib/seo/jsonld';
import { PROGRAMMATIC_SEO_PAGES } from '@/lib/seoData';
import { arabicSchema } from '@/lib/seo/schemaAr';
import { pageAlternates, schemaPath } from '@/lib/seo/urls';
import { withLang } from '@/lib/i18n/path';
import { CLAIMS } from '@/lib/content/claims';

const TITLE = 'مولد سكيما JSON-LD مجاني | SchemaCraft AI';
const DESCRIPTION = 'أنشئ JSON-LD من Schema.org في المتصفح للمنتج والنشاط المحلي والأسئلة والمقال وغيرها. الترميز الصحيح لا يضمن نتيجة منسّقة في جوجل.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/json-ld-generator/', 'ar'),
};

export default function Page() {
  const pages = Object.values(PROGRAMMATIC_SEO_PAGES).map((page) => arabicSchema(page));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGeneratorGraph('ar')) }} />
      <SiteChrome lang="ar">
        <main dir="rtl" lang="ar" className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-12 sm:py-16 space-y-12">
          <header className="max-w-3xl space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">أداة مجانية في المتصفح</p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">مولد سكيما JSON-LD</h1>
            <p className="text-base sm:text-lg text-slate-300 leading-8">
              JSON-LD وسم سكربت يصف الصفحة بمفردات Schema.org. محركات البحث تقرأه من غير تخمين من HTML. اختر النوع، واملأ الحقول الموجودة فعلاً في الصفحة، وانسخ السكربت إلى القالب.
            </p>
          </header>
          <section className="space-y-4 max-w-3xl text-sm sm:text-[15px] text-slate-300 leading-8">
            <h2 className="text-xl font-bold text-white">ماذا تضع في الترميز</h2>
            <p>فقط الخصائص الصحيحة على الصفحة الحية. إذا كانت الصفحة لا تعرض مراجعات، لا تضف AggregateRating. إذا كان المنتج غير معروض للبيع، لا تخترع Offer. سياسات جوجل تعامل التقييمات المزيّفة كمخاطرة ترتيب، لا كاختصار.</p>
            <p>{CLAIMS.richResultsDisclaimerAr ?? CLAIMS.richResultsDisclaimer}</p>
            <h2 className="text-xl font-bold text-white pt-4">أين تلصقه</h2>
            <ul className="list-disc ps-5 space-y-2">
              <li><strong className="text-white">Next.js App Router:</strong> وسم <code className="text-cyan-200" dir="ltr">script type=&quot;application/ld+json&quot;</code> داخل Server Component الخاص بالمسار.</li>
              <li><strong className="text-white">ووردبريس:</strong> خطاف صغير على <code dir="ltr">wp_head</code>، لا نسخة ثانية من الكيان نفسه في كل صفحة.</li>
              <li><strong className="text-white">شوبيفاي:</strong> مقتطف في <code dir="ltr">theme.liquid</code> أو قالب المنتج، وLiquid للسعر والتوفر الحيّين.</li>
            </ul>
            <p>
              تحتاج تشخيص الموقع أولاً؟ <Link href="/ar/" className="text-cyan-300 underline">شغّل الفحص المجاني</Link>. الفحص يجلب HTML من سيرفرنا ويحسب الدرجة من الفحوص التي تمت فعلاً.
            </p>
          </section>
          <nav aria-label="أنواع مولد JSON-LD" className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <h2 className="text-sm font-bold text-white mb-3">كل المولدات</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link href={withLang(schemaPath(page.slug), 'ar')} className="text-cyan-300 hover:underline">{page.badge}</Link>
                  <span className="text-slate-500" dir="ltr"> — {page.schemaCategory}</span>
                </li>
              ))}
            </ul>
          </nav>
          <SchemaDirectoryHub lang="ar" />
        </main>
      </SiteChrome>
    </>
  );
}
