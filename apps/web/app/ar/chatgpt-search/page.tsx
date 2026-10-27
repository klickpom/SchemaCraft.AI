import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/ContentShell';
import { RELATED } from '@/lib/content/related';
import { articleGraph } from '@/lib/seo/jsonld';
import { pageAlternates, socialMeta } from '@/lib/seo/urls';

const PATH = '/ar/chatgpt-search/';
const TITLE = 'كيف تظهر في بحث ChatGPT (ولماذا قد يفوتك Perplexity)';
const DESCRIPTION = 'بحث ChatGPT يقتبس الصفحات التي يستطيع OAI-SearchBot جلبها كـ HTML. Perplexity يستخدم PerplexityBot. ترتيب جوجل لا يضمن أياً منهما.';
const UPDATED = '2026-10-20';

const FAQ = [
  {
    q: 'كيف تدخل صفحة إلى بحث ChatGPT؟',
    a: 'لازم OAI-SearchBot يكون مسموحاً في robots.txt، والسيرفر أو الـ CDN يرجع الصفحة لهذا الزاحف (مش 403 ولا تحدٍ)، والجواب يكون موجوداً في HTML. ChatGPT-User يجلب الصفحة لما حد يسأل عن الرابط نفسه. منع GPTBot لا يمنع هذا المسار.',
  },
  {
    q: 'لماذا يقتبس Perplexity المنافسين ولا يقتبس موقعي؟',
    a: 'السبب المعتاد هو Disallow لـ PerplexityBot في robots.txt، أو قاعدة CDN تحجب وكيله، أو نص يظهر فقط بعد تشغيل الجافاسكربت. PerplexityBot لا يشغّل الجافاسكربت. الصفحة قد تترتب في جوجل، لأن جوجل يشغّل الجافاسكربت، وتظل غير مرئية لـ Perplexity.',
  },
  {
    q: 'هل ملف llms.txt يجعل الصفحة تُقتبس؟',
    a: 'لا يوجد منتج بحث ذكي كبير يوثّق llms.txt كإشارة اقتباس. هو خريطة Markdown اختيارية للصفحات المهمة. لا يغني عن السماح للزاحف ولا عن جواب واضح في الصفحة.',
  },
  {
    q: 'هل أقدر أقيس الزيارات من ChatGPT وPerplexity؟',
    a: 'في التحليلات، راقب الإحالات من chatgpt.com وperplexity.ai وclaude.ai وcopilot.microsoft.com. ChatGPT يضيف utm_source=chatgpt.com على كثير من الروابط الخارجة. زيارات AI Overviews تبقى داخل تقرير الأداء في Search Console، وليست إحالة منفصلة.',
  },
  {
    q: 'لو درجة الفحص عالية، هل سأُقتبس؟',
    a: 'لا. الدرجة تقول هل الزاحف يقدر يوصل للصفحة وهل الصفحة تذكر حقائق واضحة. الاختيار كمصدر يعتمد أيضاً على صفحات أخرى تقول الشيء نفسه، وعلى الروابط والذكر، وعلى مطابقة الفقرة للسؤال. الدرجة العالية تزيل العوائق. لا تصنع سلطة.',
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates('/chatgpt-search/', 'ar'),
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: PATH, type: 'article' }),
};

export default function ArabicChatgptSearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleGraph({ path: PATH, headline: TITLE, description: DESCRIPTION, datePublished: '2026-10-19', dateModified: UPDATED, breadcrumb: 'بحث ChatGPT', lang: 'ar', faq: FAQ })),
        }}
      />
      <ContentShell
        lang="ar"
        crumb="بحث ChatGPT"
        eyebrow="دليل · المصادر مذكورة"
        title="كيف تظهر في بحث ChatGPT"
        lead={
          <p>
            <strong>بحث ChatGPT يقتبس الصفحة لما OAI-SearchBot يقدر يجيبها والجواب يكون في HTML.</strong> ترتيب عالٍ في جوجل لا يكفي: Googlebot يشغّل الجافاسكربت وله قواعده في robots.txt. Perplexity يفوّت المواقع نفسها لما PerplexityBot يكون محجوباً أو النص يظهر بعد السكربتات فقط. ثلاثة فحوص تحسم الأمر: robots.txt، والجدار الناري، وHTML الخام.
          </p>
        }
        updated={UPDATED}
        faq={FAQ}
        related={[RELATED.audit, RELATED.crawlerChecker, RELATED.gptbot, RELATED.crawlers]}
      >
        <h2>الفحوص الثلاثة، بالترتيب</h2>
        <h3>1. robots.txt يسمح لزاحف البحث</h3>
        <p>
          بحث ChatGPT يستخدم <strong>OAI-SearchBot</strong>. Perplexity يستخدم <strong>PerplexityBot</strong>. بحث Claude يستخدم <strong>Claude-SearchBot</strong>. مراجعات جوجل بالذكاء الاصطناعي تستخدم <strong>Googlebot</strong>. كل واحد يقرأ مجموعته فقط في robots.txt، أو مجموعة <code>*</code> إذا لم تكن له مجموعة (<a href="https://www.rfc-editor.org/rfc/rfc9309">RFC 9309</a>).
        </p>
        <p>
          GPTBot ليس في هذه القائمة. هو يجمع النص للتدريب. منعه لا يحذف الصفحة من بحث ChatGPT، والسماح له لا يضعها هناك. الفصل موثّق عند <a href="https://developers.openai.com/api/docs/bots">OpenAI</a>، والنمط نفسه موجود بين Google-Extended وGooglebot، وبين ClaudeBot وClaude-SearchBot. التفاصيل في <Link href="/ar/should-i-block-gptbot/">هل تمنع GPTBot؟</Link>
        </p>
        <h3>2. الـ CDN يرجع الصفحة، لا صفحة تحدٍ</h3>
        <p>
          منتجات حماية البوتات غالباً تسمح لـ Googlebot (لأنها تتحقق من عناوينه) وتتحدى الباقي. عندها OAI-SearchBot وPerplexityBot يستلمان 403 أو صفحة وسيطة، فلا يوجد ما يُقتبس. robots.txt سيظل يقول «مسموح». الطريقة الوحيدة لرؤية ذلك هي طلب الرابط بهذا الوكيل.
        </p>
        <p>
          اعتبر النتيجة إشارة. سلاسل الوكيل سهلة التزييف، والـ CDN قد يسمح لنطاقات IP الحقيقية للشركة ويحجب سيرفر فحص ينسخ الوكيل فقط. OpenAI وجوجل وبينج وPerplexity ينشرون طريقة التحقق من زواحفهم. استخدمها قبل أن تستنتج أن البوت الحقيقي محجوب.
        </p>
        <h3>3. الجواب موجود في HTML الذي يرسله السيرفر</h3>
        <p>
          OAI-SearchBot وPerplexityBot وClaudeBot يجلبون HTML ولا يشغّلون جافاسكربت الصفحة. شبكة منتجات أو سعر أو فقرة تظهر بعد hydration في React صفحة فارغة تقريباً بالنسبة لهم. Googlebot هو الاستثناء: هو يرسم الصفحة. لهذا قد يترتّب رابط في جوجل ولا يظهر أبداً في ChatGPT أو Perplexity.
        </p>

        <h2>شكل الفقرة التي تُقتبس</h2>
        <p>بعد أن يستطيع الزاحف قراءة الصفحة، ما زال يحتاج فقرة يرفعها. الفقرات التي يُعاد استخدامها لها شكل:</p>
        <ul>
          <li>الفقرة الأولى تعرّف الشيء في جملة أو اثنتين: ما هو، لمن، وما الحقيقة المحددة.</li>
          <li>العناوين هي أسئلة الناس، وأول جملة تحت كل عنوان تجيب.</li>
          <li>الخطوات قائمة مرقمة. المقارنات جدول. الاثنان يصمدان عند الاقتباس أكثر من فقرة صفات.</li>
          <li>الأرقام لها وحدة ومصدر. «أسرع» لا يُقتبس. «معظم الفحوص تنتهي خلال 20 ثانية» يُقتبس.</li>
          <li>اسم المنظمة موجود في النص وفي JSON-LD، مع روابط <code dir="ltr">sameAs</code> لحسابات موجودة فعلاً.</li>
        </ul>
        <p>
          لا توجد «سكيما خاصة بالذكاء الاصطناعي». ترميز FAQ وArticle وOrganization يساعد الآلة على ربط الأسماء بالأشياء. الترميز الذي يصف مراجعات أو أسعاراً أو مؤلفين لا تعرضهم الصفحة مخالفة للإرشادات، حتى لو سكت المدقق.
        </p>

        <h2>لماذا يختلف Perplexity وChatGPT</h2>
        <p>
          ليس لهما فهرس واحد. الموقع قد يكون في أحدهما وغائباً عن الآخر لسبب عادي: بوت مسموح والآخر ممنوع. افحص الصفين منفصلين. Perplexity-User وChatGPT-User حالة ثالثة: يجلبان رابطاً لأن شخصاً سأل، وPerplexity يوثّق أن Perplexity-User قد يتجاهل robots.txt. هما ليسا طريقة الدخول إلى الفهرس الدائم.
        </p>
        <table dir="ltr">
          <thead>
            <tr><th></th><th>ChatGPT Search</th><th>Perplexity</th><th>Google AI Overviews</th></tr>
          </thead>
          <tbody>
            <tr><td>زاحف الفهرس</td><td>OAI-SearchBot</td><td>PerplexityBot</td><td>Googlebot</td></tr>
            <tr><td>جلب عند الطلب</td><td>ChatGPT-User</td><td>Perplexity-User</td><td>Googlebot</td></tr>
            <tr><td>التحكم في التدريب</td><td>GPTBot</td><td>لا يوجد منفصل</td><td>Google-Extended</td></tr>
            <tr><td>يشغّل الجافاسكربت</td><td>لا</td><td>لا</td><td>نعم</td></tr>
          </tbody>
        </table>

        <h2>ماذا تفعل هذا الأسبوع</h2>
        <ol>
          <li>اسمح لـ OAI-SearchBot وPerplexityBot وClaude-SearchBot وGooglebot وBingbot. امنع زواحف التدريب فقط إذا كانت هذه سياستك — انظر <Link href="/ar/robots-txt-generator/">مولد robots.txt</Link>.</li>
          <li>اسمح لنفس الوكلاء في الـ CDN، أو أوقف التحدي عنهم.</li>
          <li>اعرض الصفحة والجافاسكربت متوقف. إذا اختفى الجواب، ارسمه على السيرفر.</li>
          <li>أعد كتابة الفقرة الافتتاحية كتعريف، وضع فيها رقماً له مصدر.</li>
          <li>أضف Organization JSON-LD بشعار حقيقي وروابط <code dir="ltr">sameAs</code> حقيقية.</li>
          <li>في التحليلات، افصل إحالات chatgpt.com وperplexity.ai لترى إن كان التغيير فعل شيئاً. الترتيب والاقتباس يعتمدان أيضاً على ذكر مواقع أخرى لك، وهذا لا يُختلق بتعديل داخل الصفحة.</li>
        </ol>
        <p>
          مرّر الرابط على <Link href="/ar/">الفحص</Link> أو <Link href="/ar/ai-crawler-checker/">فاحص الزواحف</Link>. كل فحص فاشل يعرض الدليل (سطر robots.txt أو حالة HTTP أو الفقرة الناقصة) وإصلاحاً يمكن لصقه. معظم الفحوص تنتهي خلال 20 ثانية، بحد 20 فحصاً كل 10 دقائق. جوجل يتوقف عن قراءة robots.txt بعد 500 كيلوبايت، فقائمة السماح القصيرة بعيدة عن هذا الحد.
        </p>
      </ContentShell>
    </>
  );
}
