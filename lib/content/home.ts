export interface FaqEntry {
  q: string;
  a: string;
}

export const HOME_FAQ: Record<'en' | 'ar', FaqEntry[]> = {
  en: [
    {
      q: 'What does the SchemaCraft audit check?',
      a: 'Around 50 checks (the exact number depends on the page type) across five areas: technical SEO (indexability, canonical, titles, HTTPS, redirects, soft 404s), crawlability (robots.txt parsed per RFC 9309, XML sitemap, server response time, compression), content answerability (answer-first summary, headings, lists, dates, authorship), entity and structured data (JSON-LD syntax, required properties, Organization identity, sameAs) and AI search readiness (OAI-SearchBot, PerplexityBot and Claude access, JavaScript dependence, snippet controls, llms.txt). Every result shows the evidence it is based on.',
    },
    {
      q: 'Is the audit free?',
      a: 'Yes. The full report — every check, every fix and the AI crawler matrix — is free with no sign-up. To keep the service fast there is a limit of 20 audits per 10 minutes per network.',
    },
    {
      q: 'How do I check if ChatGPT can crawl my website?',
      a: 'ChatGPT Search uses the OAI-SearchBot crawler, and ChatGPT-User when a person asks about a specific page. Your robots.txt must not disallow them, your firewall or CDN must not block them, and the content must be in the HTML because these crawlers do not run JavaScript. The AI crawler checker tests all three in one run.',
    },
    {
      q: 'Should I block GPTBot?',
      a: 'GPTBot collects data for training OpenAI models; it is not the crawler behind ChatGPT Search results. You can block GPTBot and still appear in ChatGPT Search as long as OAI-SearchBot is allowed. The same split exists for Google-Extended vs Googlebot and ClaudeBot vs Claude-SearchBot.',
    },
    {
      q: 'What is the difference between SEO, GEO and AEO?',
      a: 'SEO makes pages rank in classic search results. AEO (answer engine optimization) makes content easy to lift as a direct answer — clear definitions, question headings, lists. GEO (generative engine optimization) makes a brand and its facts easy for AI systems like ChatGPT, Perplexity and Google AI Overviews to retrieve, trust and cite. All three start with the same foundation: crawlable, indexable, well-structured pages.',
    },
    {
      q: 'Does llms.txt help AI visibility?',
      a: 'llms.txt is an optional proposal that gives AI tools a Markdown map of your key pages. It is cheap to add, but no major AI search engine has confirmed using it for ranking, so the audit treats it as a low-weight check.',
    },
    {
      q: 'Why does the audit say it could not complete?',
      a: 'Usually because a firewall, CDN or bot-protection service blocked our server, the domain did not resolve, or the server timed out. No score is shown in that case because nothing was inspected. If your security setup blocks all automated requests, check that search and AI crawlers are allow-listed.',
    },
    {
      q: 'My score is high but I still do not rank. Why?',
      a: 'The score measures on-page readiness: whether crawlers can reach, read and understand the page. Rankings also depend on things a single-page audit cannot see — backlinks, brand authority, competition and how well the content matches search intent. A high score removes technical obstacles; it does not guarantee traffic.',
    },
    {
      q: 'Does valid Schema.org markup guarantee rich results?',
      a: 'No. Valid JSON-LD makes a page eligible; Google decides whether to show a rich result. Several types such as HowTo and most FAQ rich results are no longer shown, and markup must describe content that is visible on the page.',
    },
  ],
  ar: [
    {
      q: 'ماذا يفحص SchemaCraft؟',
      a: 'حوالي 50 فحصاً (العدد الدقيق يعتمد على نوع الصفحة) في خمسة محاور: السيو التقني (قابلية الفهرسة، الرابط الأساسي، العناوين، HTTPS، التحويلات، صفحات 404 الوهمية)، الزحف (robots.txt وفق RFC 9309، خريطة XML، زمن استجابة السيرفر، الضغط)، قابلية المحتوى للإجابة (ملخص مباشر، عناوين، قوائم، تواريخ، الكاتب)، الكيان والبيانات المنظمة (صحة JSON-LD، الخصائص المطلوبة، هوية المؤسسة، sameAs) وجاهزية البحث الذكي (وصول OAI-SearchBot وPerplexityBot وClaude، الاعتماد على الجافاسكربت، صلاحيات الاقتباس، llms.txt). كل نتيجة تعرض الدليل الذي بُنيت عليه.',
    },
    {
      q: 'هل الفحص مجاني؟',
      a: 'نعم. التقرير الكامل — كل الفحوص وكل الإصلاحات ومصفوفة زواحف الذكاء الاصطناعي — مجاني وبدون تسجيل. للحفاظ على سرعة الخدمة يوجد حد 20 فحصاً كل 10 دقائق لكل شبكة.',
    },
    {
      q: 'كيف أعرف إذا كان ChatGPT يستطيع الزحف لموقعي؟',
      a: 'بحث ChatGPT يستخدم الزاحف OAI-SearchBot، ويستخدم ChatGPT-User عندما يسأل شخص عن صفحة محددة. يجب ألا يمنعهما robots.txt، وألا يحجبهما الجدار الناري أو الـ CDN، وأن يكون المحتوى موجوداً في HTML لأن هذه الزواحف لا تشغّل الجافاسكربت. فاحص زواحف الذكاء الاصطناعي يختبر الثلاثة في مرة واحدة.',
    },
    {
      q: 'هل أمنع GPTBot؟',
      a: 'GPTBot يجمع بيانات لتدريب نماذج OpenAI وليس هو زاحف نتائج بحث ChatGPT. يمكنك منع GPTBot وتظل تظهر في بحث ChatGPT طالما OAI-SearchBot مسموح له. نفس التقسيم موجود بين Google-Extended وGooglebot، وبين ClaudeBot وClaude-SearchBot.',
    },
    {
      q: 'ما الفرق بين SEO وGEO وAEO؟',
      a: 'الـ SEO يجعل الصفحات تتصدر نتائج البحث التقليدية. الـ AEO (تحسين محركات الإجابة) يجعل المحتوى سهل الاقتباس كإجابة مباشرة — تعريفات واضحة وعناوين بصيغة أسئلة وقوائم. الـ GEO (تحسين المحركات التوليدية) يجعل علامتك وحقائقها سهلة الاسترجاع والثقة والاقتباس لدى ChatGPT وPerplexity وملخصات جوجل الذكية. الثلاثة تبدأ من نفس الأساس: صفحات قابلة للزحف والفهرسة ومنظمة جيداً.',
    },
    {
      q: 'هل ملف llms.txt يساعد في الظهور في الذكاء الاصطناعي؟',
      a: 'llms.txt مقترح اختياري يعطي أدوات الذكاء الاصطناعي خريطة Markdown لصفحاتك الأساسية. إضافته سهلة، لكن لم يؤكد أي محرك بحث ذكي كبير استخدامه في الترتيب، لذلك وزنه في الفحص منخفض.',
    },
    {
      q: 'لماذا يقول الفحص إنه لم يكتمل؟',
      a: 'غالباً لأن جداراً نارياً أو CDN أو خدمة حماية من البوتات حجبت سيرفرنا، أو النطاق لا يعمل، أو السيرفر لم يستجب في الوقت المحدد. لا تظهر درجة في هذه الحالة لأنه لم يُفحص شيء. إذا كانت الحماية تحجب كل الطلبات الآلية، تأكد أن زواحف البحث والذكاء الاصطناعي مسموح لها.',
    },
    {
      q: 'درجتي عالية لكن موقعي لا يتصدر. لماذا؟',
      a: 'الدرجة تقيس جاهزية الصفحة: هل تستطيع الزواحف الوصول إليها وقراءتها وفهمها. الترتيب يعتمد أيضاً على أشياء لا يراها فحص صفحة واحدة — الروابط الخلفية وسلطة العلامة والمنافسة ومدى تطابق المحتوى مع نية البحث. الدرجة العالية تزيل العوائق التقنية لكنها لا تضمن الزيارات.',
    },
    {
      q: 'هل سكيما Schema.org الصحيحة تضمن النتائج الغنية؟',
      a: 'لا. JSON-LD الصحيح يجعل الصفحة مؤهلة، وجوجل يقرر عرض النتيجة الغنية أم لا. أنواع مثل HowTo ومعظم نتائج FAQ لم تعد تظهر، ويجب أن تصف السكيما محتوى ظاهراً في الصفحة.',
    },
  ],
};

export interface CheckArea {
  title: string;
  checks: string[];
}

export const CHECK_AREAS: Record<'en' | 'ar', CheckArea[]> = {
  en: [
    { title: 'AI search readiness', checks: ['OAI-SearchBot, PerplexityBot, Claude-SearchBot access', 'ChatGPT-User / Claude-User / Perplexity-User', 'Live requests with each crawler user-agent', 'Content visible without JavaScript', 'nosnippet / max-snippet controls', 'llms.txt and citable facts'] },
    { title: 'Technical SEO', checks: ['noindex in meta and X-Robots-Tag', 'Canonical tag and target', 'Title, meta description, H1, headings', 'HTTPS, HTTP→HTTPS, redirect chains', 'Soft-404 test with a random URL', 'Open Graph, hreflang, image alt, mixed content'] },
    { title: 'Crawlability & speed', checks: ['robots.txt fetched and parsed (RFC 9309)', 'Googlebot and Bingbot verdicts for this URL', 'XML sitemap found and lists this URL', 'Server response time (TTFB)', 'gzip / Brotli compression', 'HTML weight and internal links'] },
    { title: 'Content answerability', checks: ['Answer-first opening paragraph', 'Question-style headings', 'Lists and tables engines can extract', 'Content depth in the raw HTML', 'Published / updated dates', 'Author byline on articles'] },
    { title: 'Entity & structured data', checks: ['JSON-LD syntax errors', 'Required properties per Google type', 'Organization / Person identity', 'sameAs profiles and logo', 'Schema that matches the page type', 'Deprecated rich-result types'] },
  ],
  ar: [
    { title: 'جاهزية البحث الذكي', checks: ['وصول OAI-SearchBot وPerplexityBot وClaude-SearchBot', 'ChatGPT-User وClaude-User وPerplexity-User', 'طلبات حية بوكيل كل زاحف', 'المحتوى ظاهر بدون جافاسكربت', 'صلاحيات nosnippet وmax-snippet', 'llms.txt والحقائق القابلة للاقتباس'] },
    { title: 'السيو التقني', checks: ['noindex في الميتا وX-Robots-Tag', 'وسم canonical ووجهته', 'العنوان والوصف وH1 والعناوين', 'HTTPS والتحويل من HTTP وسلاسل التحويل', 'اختبار 404 الوهمي برابط عشوائي', 'Open Graph وhreflang وalt للصور والمحتوى المختلط'] },
    { title: 'الزحف والسرعة', checks: ['جلب وتحليل robots.txt وفق RFC 9309', 'حكم Googlebot وBingbot لهذا الرابط', 'وجود خريطة XML واحتواؤها على الرابط', 'زمن استجابة السيرفر TTFB', 'ضغط gzip أو Brotli', 'حجم HTML والروابط الداخلية'] },
    { title: 'قابلية المحتوى للإجابة', checks: ['فقرة افتتاحية تجيب مباشرة', 'عناوين بصيغة أسئلة', 'قوائم وجداول قابلة للاستخراج', 'عمق المحتوى في HTML الخام', 'تواريخ النشر والتحديث', 'اسم الكاتب في المقالات'] },
    { title: 'الكيان والبيانات المنظمة', checks: ['أخطاء صياغة JSON-LD', 'الخصائص المطلوبة لكل نوع في جوجل', 'هوية Organization أو Person', 'روابط sameAs والشعار', 'سكيما مناسبة لنوع الصفحة', 'أنواع نتائج غنية متوقفة'] },
  ],
};
