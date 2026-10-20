import type { Metadata } from 'next';
import Link from 'next/link';
import AuditRunner from '@/components/audit/AuditRunner';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { toolPageGraph } from '@/lib/seo/jsonld';
import { pageAlternates, socialMeta } from '@/lib/seo/urls';

const PATH = '/ar/ai-crawler-checker/';
const TITLE = 'فاحص زواحف الذكاء الاصطناعي: هل ChatGPT محجوب عن موقعك؟';
const DESCRIPTION = 'اختبر هل يستطيع GPTBot وOAI-SearchBot وClaudeBot وPerplexityBot وGoogle-Extended زحف صفحتك. يقرأ robots.txt بنفس قواعد الزواحف. مجاني.';
const FAQ = [
  { q: 'كيف أعرف إن كان موقعي يحجب ChatGPT؟', a: 'أدخل الرابط أعلاه. الفاحص يقرأ robots.txt ويقيّم القواعد لـ OAI-SearchBot (بحث ChatGPT) وChatGPT-User (الروابط التي يفتحها المستخدم من ChatGPT) وGPTBot (التدريب) كل على حدة، بنفس قواعد المطابقة التي يستخدمها الزاحف. ويجلب الصفحة ويبيّن إن كان المحتوى في HTML الخام، لأن زواحف ChatGPT لا تشغّل الجافاسكربت.' },
  { q: 'هل منع GPTBot يزيل موقعي من بحث ChatGPT؟', a: 'لا. GPTBot يجمع بيانات التدريب. بحث ChatGPT يستخدم OAI-SearchBot، وOpenAI يوثّق الاثنين كتحكمين مستقلين. يمكنك منع GPTBot والظهور في بحث ChatGPT ما دام OAI-SearchBot مسموحاً.' },
  { q: 'هل منع Google-Extended يزيلني من AI Overviews؟', a: 'لا. Google-Extended يتحكم فقط في استخدام المحتوى لتدريب Gemini والتأريض خارج البحث. AI Overviews وAI Mode جزء من بحث جوجل ويستخدمان Googlebot، فيتبعان قواعد Googlebot.' },
  { q: 'robots.txt يسمح للبوت وهو لا يصل. لماذا؟', a: 'robots.txt طلب فقط. الـ CDN والجدار الناري قد يحجبان الزاحف قبل قراءة الملف. Cloudflare مثلاً يحجب زواحف الذكاء الاصطناعي المعروفة افتراضياً على النطاقات الجديدة منذ يوليو 2025. راجع إعدادات البوت في الـ CDN وسجلات 403 أو 429 لوكيل الزاحف.' },
  { q: 'لماذا يقول التقرير إن اختبار البوت الحي «غير قابل للتحقق»؟', a: 'نستطيع إرسال طلب بوكيل الزاحف، ولا نستطيع إرساله من عناوين IP الخاصة بالشركة. الجدران التي تتحقق من عناوين الزاحف تحجب المنتحلين بشكل صحيح، فطلب محجوب لا يثبت أن الزاحف الحقيقي محجوب، وطلب مسموح لا يثبت أنه مسموح. حكم robots.txt دقيق. الاختبار الحي إشارة.' },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/ai-crawler-checker/', 'ar'),
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH }),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolPageGraph({ path: PATH, name: 'فاحص زواحف الذكاء الاصطناعي', description: DESCRIPTION, lang: 'ar', faq: FAQ, breadcrumb: 'فاحص الزواحف' })) }} />
      <ContentShell lang="ar" crumb="فاحص الزواحف" eyebrow="أداة مجانية · من غير تسجيل" title="فاحص زواحف الذكاء الاصطناعي" lead={<p>اعرف في تشغيل واحد هل <strong>ChatGPT وClaude وPerplexity وGemini وجوجل</strong> مسموح لهم بزحف الصفحة — لكل زاحف، مع سطر robots.txt الذي يحسم الأمر — وهل المحتوى مقروء من غير جافاسكربت.</p>} updated="2026-10-20" tool={<AuditRunner lang="ar" focus="ai" examples={['bbc.com/news', 'stripe.com', 'react.dev']} inputId="crawler-url" />} faq={FAQ} related={[RELATED.robots, RELATED.crawlers, RELATED.llms, RELATED.audit]}>
        <h2>ماذا يختبر الفاحص</h2>
        <ul>
          <li><strong>robots.txt لكل زاحف.</strong> تُقيَّم القواعد كما يطبّقها الزاحف حسب <a href="https://www.rfc-editor.org/rfc/rfc9309" target="_blank" rel="noopener noreferrer">RFC 9309</a>: المجموعة الأخص تطابقًا تفوز، وأطول مسار مطابق يفوز، و<code>Allow</code> يفوز عند التعادل. الزاحف الذي له مجموعته يتجاهل <code>User-agent: *</code> بالكامل.</li>
          <li><strong>حجب الصفحة.</strong> <code>noindex</code> في meta robots أو ترويسة <code>X-Robots-Tag</code>، والردود غير 200.</li>
          <li><strong>الاعتماد على الجافاسكربت.</strong> زواحف OpenAI وAnthropic تنزّل HTML ولا تنفّذ الجافاسكربت، فالصفحة التي ترسم نصها في المتصفح شبه فارغة لهم. نعرض ما يقرأه زاحف لا يشغّل الجافاسكربت.</li>
          <li><strong>طلبات حية.</strong> تُطلب الصفحة مرة أخرى بوكيل كل زاحف كبير لترى رد الـ CDN أو الجدار، وتُعرض كإشارة للسبب المذكور في الأسئلة.</li>
          <li><strong>llms.txt وخريطة الموقع.</strong> هل موجودان، وهل يُخدمان كنص، وهل الإشارة إليهما صحيحة.</li>
        </ul>
        <h2>زواحف البحث وزواحف التدريب بوتات مختلفة</h2>
        <p>كل شركة كبرى تشغّل الآن وكلاء منفصلين للبحث ولتدريب النموذج. منع التدريب قرار عمل. منع زواحف البحث يزيلك من إجابات ذلك المنتج. الفحص لا يخصم نقاطاً بسبب منع زواحف التدريب.</p>
        <table dir="ltr">
          <thead><tr><th>الشركة</th><th>البحث والإجابات</th><th>بطلب المستخدم</th><th>التدريب</th></tr></thead>
          <tbody>
            <tr><td>OpenAI</td><td><code>OAI-SearchBot</code></td><td><code>ChatGPT-User</code></td><td><code>GPTBot</code></td></tr>
            <tr><td>Anthropic</td><td><code>Claude-SearchBot</code></td><td><code>Claude-User</code></td><td><code>ClaudeBot</code></td></tr>
            <tr><td>Perplexity</td><td><code>PerplexityBot</code></td><td><code>Perplexity-User</code></td><td>—</td></tr>
            <tr><td>Google</td><td><code>Googlebot</code></td><td><code>Google-CloudVertexBot</code></td><td><code>Google-Extended</code></td></tr>
            <tr><td>Apple</td><td><code>Applebot</code></td><td>—</td><td><code>Applebot-Extended</code></td></tr>
          </tbody>
        </table>
        <p>القائمة الكاملة مع روابط التوثيق في <Link href="/ar/ai-crawlers/">قائمة الزواحف</Link>.</p>
        <h2>أكثر أسباب الحجب</h2>
        <h3>1. مجموعة خاصة تنسى القواعد العامة</h3>
        <p>إضافة <code>User-agent: GPTBot</code> مع <code>Allow: /</code> تعني أن GPTBot لم يعد يقرأ مجموعة <code>*</code>، فيتوقف تطبيق منع المسارات الخاصة عليه. كرّر المنع داخل كل مجموعة مسماة، أو لا تسمِّ زاحفاً تريد السماح له فقط.</p>
        <h3>2. قاعدة CDN أو جدار ناري</h3>
        <p>حجب زواحف الذكاء الاصطناعي في Cloudflare، وأوضاع محاربة البوت، وحدود الاستضافة، كثيراً ما ترجع 403 أو 429 لزواحف الذكاء بينما يمر Googlebot. إذا كان الملف يسمح والزاحف يظهر بخطأ في السجلات، الإصلاح في إعدادات الـ CDN لا في الملف.</p>
        <h3>3. محتوى يوجد فقط بعد الجافاسكربت</h3>
        <p>تطبيقات الصفحة الواحدة التي ترسل <code dir="ltr">&lt;div id=&quot;root&quot;&gt;</code> فارغاً يقرأها Googlebot لأنه يرسم، ولا يقرأها معظم زواحف الذكاء الاصطناعي. الرسم على السيرفر أو التوليد الثابت يصلح هذا.</p>
        <h2>اسمح للبحث الذكي وامنع التدريب</h2>
        <p>هذا الإعداد الذي يختاره معظم الناشرين. الصقه في robots.txt وأبقِ قواعدك الحالية فوقه:</p>
        <pre dir="ltr"><code>{`User-agent: *
Allow: /

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: meta-externalagent
Disallow: /`}</code></pre>
        <p>أو ابنِ ملفك في <Link href="/ar/robots-txt-generator/">مولد robots.txt</Link>.</p>
      </ContentShell>
    </>
  );
}
