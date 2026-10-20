import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { articleGraph } from '@/lib/seo/jsonld';
import { pageAlternates, socialMeta } from '@/lib/seo/urls';

const PATH = '/ar/geo-vs-aeo/';
const TITLE = 'الفرق بين GEO وAEO وSEO وما الذي يُنفَّذ فعلاً';
const DESCRIPTION = 'شرح تحسين المحركات التوليدية وتحسين محركات الإجابة والسيو من غير مبالغة: ماذا يعني كل مصطلح، وما الذي يختلف فعلاً، وقائمة عملية.';
const UPDATED = '2026-10-20';
const FAQ = [
  { q: 'ما هو GEO؟', a: 'هو جعل المحتوى قابلاً للاسترجاع والثقة والاقتباس داخل إجابات الذكاء الاصطناعي: بحث ChatGPT وPerplexity وAI Overviews وAI Mode وClaude وCopilot. المصطلح جاء من ورقة بحثية عام 2023 لباحثين من Princeton وGeorgia Tech.' },
  { q: 'ما هو AEO؟', a: 'هو ترتيب المحتوى حتى يستطيع نظام رفع جواب مباشر منه. بدأ مع المقتطفات المميزة والمساعدات الصوتية، ويمتد الآن إلى إجابات الذكاء الاصطناعي. عملياً: عناوين بصيغة سؤال، وجواب في أول جملة، وقوائم أو جداول للخطوات والمقارنات.' },
  { q: 'هل GEO يستبدل السيو؟', a: 'لا. منتجات البحث الذكي تجلب الصفحات بزواحف وفهارس بحث. الصفحة التي لا تُزحف ولا تُفهرس ولا يُوثق بها لن تُقتبس. GEO وAEO يضيفان متطلبات فوق السيو، ولا يستبدلانه.' },
  { q: 'كيف أقيس زيارات ChatGPT وPerplexity؟', a: 'في التحليلات راقب الإحالات من chatgpt.com وperplexity.ai وclaude.ai وgemini.google.com وcopilot.microsoft.com. ChatGPT يضيف utm_source=chatgpt.com لكثير من الروابط. زيارات AI Overviews وAI Mode داخل تقرير الأداء في Search Console تحت بحث الويب.' },
  { q: 'هل أحتاج سكيما خاصة بالذكاء الاصطناعي أو llms.txt؟', a: 'لا. لا يوجد نوع سكيما خاص بالذكاء الاصطناعي، ولا محرك بحث ذكي كبير يوثّق llms.txt كإشارة اقتباس. ترميز Schema.org المعتاد يساعد على فهم الكيانات، وllms.txt إضافة غير ضارة. الوصول للزاحف ووضوح المحتوى أهم بكثير.' },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/geo-vs-aeo/', 'ar'),
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH, type: 'article' }),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleGraph({ path: PATH, headline: TITLE, description: DESCRIPTION, datePublished: UPDATED, dateModified: UPDATED, breadcrumb: 'GEO وAEO وSEO', lang: 'ar', faq: FAQ })) }} />
      <ContentShell lang="ar" crumb="GEO وAEO وSEO" eyebrow="دليل" title="ما الفرق بين GEO وAEO وSEO؟" lead={<p><strong>السيو</strong> يجعل الصفحة تُزحف وتُفهرس وتُرتَّب. <strong>AEO</strong> يشكلها حتى يُرفع منها جواب مباشر. <strong>GEO</strong> يجعلها مرشحة للاسترجاع والاقتباس داخل إجابة مولَّدة. هي طبقات: إجابات الذكاء الاصطناعي تُبنى من صفحات اجتازت أساسيات السيو.</p>} updated={UPDATED} faq={FAQ} related={[RELATED.audit, RELATED.gptbot, RELATED.chatgpt, RELATED.crawlers]}>
        <h2>المصطلحات الثلاثة جنباً إلى جنب</h2>
        <table>
          <thead><tr><th></th><th>SEO</th><th>AEO</th><th>GEO</th></tr></thead>
          <tbody>
            <tr><td><strong>الهدف</strong></td><td>الترتيب في نتائج البحث</td><td>أن تكون الجواب المستخرج</td><td>أن تُقتبس في إجابات الذكاء الاصطناعي</td></tr>
            <tr><td><strong>أين</strong></td><td>جوجل وبينج</td><td>المقتطفات والصوت وإجابات الذكاء</td><td>ChatGPT وPerplexity وAI Overviews وClaude وCopilot</td></tr>
            <tr><td><strong>الوحدة</strong></td><td>الصفحة</td><td>فقرة الجواب</td><td>الفقرة وثقة المصدر</td></tr>
            <tr><td><strong>مقياس النجاح</strong></td><td>الترتيب والنقرات</td><td>امتلاك المقتطف</td><td>الاقتباسات وإحالات الذكاء الاصطناعي</td></tr>
          </tbody>
        </table>
        <h2>ما الذي يختلف فعلاً في البحث الذكي</h2>
        <h3>1. زواحف مختلفة وقواعد مختلفة</h3>
        <p>بحث ChatGPT يعتمد على OAI-SearchBot، وPerplexity على PerplexityBot، وClaude على Claude-SearchBot. كل واحد يقرأ مجموعته في robots.txt، وحماية البوتات في الـ CDN كثيراً ما تحجبهم وتمرر Googlebot. الموقع قد يتصدر جوجل ويغيب عن ChatGPT. انظر <Link href="/ar/should-i-block-gptbot/">هل تمنع GPTBot</Link> و<Link href="/ar/chatgpt-search/">كيف يجد بحث ChatGPT الصفحة</Link> و<Link href="/ar/ai-crawlers/">قائمة الزواحف</Link>.</p>
        <h3>2. رسم قليل للجافاسكربت أو معدوم</h3>
        <p>Googlebot يشغّل الجافاسكربت. زواحف OpenAI وAnthropic تُلاحظ وهي تجلب الصفحة من غير تنفيذ السكربت. النص الذي يظهر بعد السكربت غير مرئي لهم.</p>
        <h3>3. فقرات لا صفحات</h3>
        <p>إجابات الذكاء الاصطناعي تقتبس أو تعيد صياغة فقرات قصيرة. تعريف في جملة، أو قائمة خطوات، أو جدول مقارنة، أسهل استخداماً من الحقائق نفسها موزعة في فقرات تسويق.</p>
        <h3>4. الثقة تُقاس عبر الويب</h3>
        <p>الإجابات تميل لاقتباس مصادر تتفق مع مصادر أخرى ومعرَّفة بوضوح: مؤلف مسمى، منظمة بعنوان وحسابات حقيقية، وتواريخ ومراجع. العمل داخل الصفحة لا يغني عن أن تُذكر في مكان آخر.</p>
        <h2>قائمة عملية</h2>
        <ol>
          <li><strong>الوصول:</strong> اسمح لـ Googlebot وBingbot وOAI-SearchBot وPerplexityBot وClaude-SearchBot في robots.txt وفي الـ CDN.</li>
          <li><strong>الرسم:</strong> اجعل المحتوى الأساسي في HTML الذي يرجعه السيرفر.</li>
          <li><strong>القابلية للفهرسة:</strong> حالة 200، وcanonical يشير لنفسه، ومن غير noindex عارض، وخريطة XML.</li>
          <li><strong>الكتابة بالجواب أولاً:</strong> عناوين بصيغة سؤال وجواب مباشر في أول جملة.</li>
          <li><strong>البنية:</strong> قوائم للخطوات وجداول للمقارنة وفقرات قصيرة.</li>
          <li><strong>وضوح الكيان:</strong> سكيما Organization أو Person مع sameAs، واسم المؤلف، وتواريخ ظاهرة.</li>
          <li><strong>الدليل:</strong> أرقام محددة ومصادر وتفاصيل لا تملكها الصفحات الأخرى.</li>
          <li><strong>القياس:</strong> تتبّع إحالات الذكاء الاصطناعي في التحليلات، وزيارات AI Overviews في Search Console.</li>
        </ol>
        <p><Link href="/ar/">الفحص المجاني</Link> يراجع البنود من 1 إلى 6 ويعرض الدليل لكل بند.</p>
        <h2>ما الذي لا يعمل</h2>
        <ul>
          <li><strong>حشو كلمات للأوامر.</strong> الإجابات تُبنى من المعنى لا من تطابق حرفي.</li>
          <li><strong>نص مخفي أو سكيما لا تطابق الصفحة.</strong> هذا يخالف إرشادات البحث ويضعف الثقة.</li>
          <li><strong>صفحات مُنتَجة بالجملة.</strong> المحتوى شبه المكرر لا يضيف ما يقتبسه النموذج بدل الأصل.</li>
          <li><strong>معاملة llms.txt كعامل ترتيب.</strong> لا محرك كبير يوثّقه كذلك.</li>
        </ul>
      </ContentShell>
    </>
  );
}
