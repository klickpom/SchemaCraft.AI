export type Language = 'en' | 'ar';

export interface Translations {
  nav: {
    title: string;
    engineVersion: string;
    unlockPro: string;
    proActive: string;
    astActive: string;
    langEn: string;
    langAr: string;
  };
  bluf: {
    pill: string;
    h1Line1: string;
    h1Line2: string;
    blufTag: string;
    blufText: string;
  };
  presets: {
    label: string;
    saas: string;
    ecommerce: string;
    faq: string;
    local: string;
    article: string;
    course: string;
    event: string;
  };
  bundleValue: {
    title: string;
    subtitle: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
    f5Title: string;
    f5Desc: string;
    f6Title: string;
    f6Desc: string;
  };
  score: {
    title: string;
    status: string;
    check1: string;
    check2: string;
    check3: string;
    check4: string;
  };
  builder: {
    selectSchemaType: string;
    targetQuery: string;
    directAnswer: string;
    businessName: string;
    streetAddress: string;
    city: string;
    telephone: string;
    articleHeadline: string;
    articleSummary: string;
    authorName: string;
    entityName: string;
    entityProposition: string;
    price: string;
    currency: string;
    appCategory: string;
    courseTitle: string;
    courseDescription: string;
    courseProvider: string;
    eventName: string;
    eventDate: string;
    eventLocation: string;
    astValid: string;
    downloadBundle: string;
  };
  benchmarks: {
    title: string;
    citationRate: string;
    parsingLatency: string;
    schemaValid: string;
  };
  preview: {
    tabCode: string;
    tabNextjs: string;
    tabShopify: string;
    tabSerp: string;
    tabAi: string;
    copyCode: string;
    copied: string;
    minify: string;
    beautify: string;
    testGoogle: string;
    testSchemaOrg: string;
    serpTitle: string;
    inStock: string;
    aiTitle: string;
    llmParseable: string;
    entityStatus: string;
  };
  installation: {
    title: string;
    subtitle: string;
    nextjsTitle: string;
    nextjsDesc: string;
    shopifyTitle: string;
    shopifyDesc: string;
    wordpressTitle: string;
    wordpressDesc: string;
    webflowTitle: string;
    webflowDesc: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    t1Name: string;
    t1Role: string;
    t1Text: string;
    t1Metric: string;
    t2Name: string;
    t2Role: string;
    t2Text: string;
    t2Metric: string;
    t3Name: string;
    t3Role: string;
    t3Text: string;
    t3Metric: string;
  };
  matrix: {
    title: string;
    subtitle: string;
    colFeature: string;
    colTrad: string;
    colGeo: string;
    colImpact: string;
    row1Title: string;
    row1Trad: string;
    row1Geo: string;
    row1Impact: string;
    row2Title: string;
    row2Trad: string;
    row2Geo: string;
    row2Impact: string;
    row3Title: string;
    row3Trad: string;
    row3Geo: string;
    row3Impact: string;
  };
  modal: {
    title: string;
    subtitle: string;
    launchDeal: string;
    originalPrice: string;
    currentPrice: string;
    oneTimeFee: string;
    feat1: string;
    feat2: string;
    feat3: string;
    feat4: string;
    guarantee: string;
    priceNote: string;
    instantUnlock: string;
    sslNote: string;
    supportNote: string;
    close: string;
  };
  toast: {
    title: string;
    desc: string;
  };
  footer: {
    text1: string;
    text2: string;
    guaranteeBadge: string;
    supportEmail: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      title: 'SchemaCraft',
      engineVersion: 'v2.4',
      unlockPro: 'Unlock Pro ($4.99)',
      proActive: 'Pro Active',
      astActive: 'AST Validator: Active',
      langEn: 'English',
      langAr: 'العربية',
    },
    bluf: {
      pill: '0ms Client-Side AST Engine • Schema.org v26.0',
      h1Line1: 'Universal JSON-LD Schema &',
      h1Line2: 'Generative Engine Architect',
      blufTag: 'Bottom Line Up Front (BLUF) Technical Guarantee',
      blufText:
        'SchemaCraft AI is an instantaneous client-side schema compiler that generates validated Schema.org JSON-LD structured data with 0ms network latency. Engineered for Generative Engine Optimization (GEO), it provides deterministic entity grounding for Perplexity, Google AI Overviews, and ChatGPT Search, increasing citation probability by up to +40% with 100% zero-error validation.',
    },
    presets: {
      label: 'Quick Archetype Blueprints:',
      saas: 'Next.js 15 SaaS',
      ecommerce: 'Shopify Store',
      faq: 'AEO & AI FAQ',
      local: 'Local 3-Pack',
      article: 'Editorial Article',
      course: 'Online Course',
      event: 'Tech Webinar',
    },
    bundleValue: {
      title: 'What is inside the $4.99 Enterprise ZIP Bundle?',
      subtitle: 'Instant multi-framework developer starter kit containing everything you need for production client deployments.',
      f1Title: '1. Validated JSON-LD Schema (.json)',
      f1Desc: 'Full Schema.org v26.0 machine-readable structured data block.',
      f2Title: '2. Next.js 15 Server Component (.tsx)',
      f2Desc: 'Ready-to-use TypeScript React component for instant App Router embedding.',
      f3Title: '3. Shopify Liquid Theme Snippet (.liquid)',
      f3Desc: 'Pre-configured theme snippet for Shopify stores and e-commerce themes.',
      f4Title: '4. WordPress Header Hook (.php)',
      f4Desc: 'Clean PHP script ready for functions.php or Code Snippets plugin.',
      f5Title: '5. Commercial Perpetual License (.txt)',
      f5Desc: 'Unrestricted royalty-free commercial rights for unlimited personal & client projects.',
      f6Title: '6. GEO 2026 Citation Playbook (.md)',
      f6Desc: 'Exclusive 12-step technical guide for dominating Perplexity and ChatGPT Search citations.',
    },
    score: {
      title: 'GEO / AEO Citation Readiness Score',
      status: 'Engine Grounding Optimal',
      check1: 'Deterministic Entity Anchoring (@id & @type)',
      check2: 'Machine-Readable Pricing & Stock Metadata',
      check3: 'BLUF Natural Language Vector Compatibility',
      check4: 'Schema.org v26.0 W3C Compliant AST',
    },
    builder: {
      selectSchemaType: 'Select Schema.org Entity Type',
      targetQuery: 'Target AI Search Query (Question)',
      directAnswer: 'Direct Answer Summary (BLUF 40-60 words)',
      businessName: 'Business Name',
      streetAddress: 'Street Address',
      city: 'City',
      telephone: 'Telephone',
      articleHeadline: 'Article Headline',
      articleSummary: 'Article Summary',
      authorName: 'Author / Brand Name',
      entityName: 'Entity / Product Name',
      entityProposition: 'Entity Value Proposition',
      price: 'Price',
      currency: 'Currency',
      appCategory: 'Application Category',
      courseTitle: 'Course Title',
      courseDescription: 'Course Curriculum Overview',
      courseProvider: 'Issuing Academy / Provider',
      eventName: 'Event / Webinar Title',
      eventDate: 'Event Start Date (YYYY-MM-DD)',
      eventLocation: 'Venue or Online URL',
      astValid: 'AST Validation: 100% Valid',
      downloadBundle: 'Download Pro Bundle ($4.99)',
    },
    benchmarks: {
      title: 'Citation Engine Benchmarks',
      citationRate: 'AI Citation Rate',
      parsingLatency: 'Parsing Latency',
      schemaValid: 'Schema.org Valid',
    },
    preview: {
      tabCode: 'JSON-LD',
      tabNextjs: 'Next.js 15 JSX',
      tabShopify: 'Shopify Liquid',
      tabSerp: 'Google SERP',
      tabAi: 'AI Overview',
      copyCode: 'Copy Code',
      copied: 'Copied to Clipboard!',
      minify: 'Minified',
      beautify: 'Formatted',
      testGoogle: 'Test in Google Rich Results',
      testSchemaOrg: 'Validate on Schema.org',
      serpTitle: 'Official Technical Specification',
      inStock: 'In stock',
      aiTitle: 'Perplexity & ChatGPT Search Grounding',
      llmParseable: '100% LLM Parseable AST',
      entityStatus: 'Deterministic Graph',
    },
    installation: {
      title: '30-Second Integration Across All Platforms',
      subtitle: 'Copy-paste validated JSON-LD schema into your tech stack with zero performance overhead.',
      nextjsTitle: 'Next.js 15 & React 19',
      nextjsDesc: 'Paste the Next.js JSX component directly into your app/page.tsx or app/layout.tsx Server Component.',
      shopifyTitle: 'Shopify & E-Commerce',
      shopifyDesc: 'Add the Liquid snippet into snippets/schema.liquid and render it before the </head> tag in theme.liquid.',
      wordpressTitle: 'WordPress & WooCommerce',
      wordpressDesc: 'Insert the generated JSON-LD script into your theme Header scripts or using any Code Snippets plugin.',
      webflowTitle: 'Webflow & Framer',
      webflowDesc: 'Add an Embed component or Custom Code block in Page Settings inside the Inside <head> tag section.',
    },
    testimonials: {
      title: 'Trusted by 1,400+ Technical Founders & SEO Architects',
      subtitle: 'Real ranking and citation improvements measured across production deployments.',
      t1Name: 'Marcus Vance',
      t1Role: 'Lead Technical SEO at ScaleVibe Agency',
      t1Text: 'We migrated 40+ client websites to SchemaCraft-generated schemas. Within 14 days, Perplexity citations grew by +47% and Google rich stars appeared on 92% of product URLs.',
      t1Metric: '+47% AI Citations',
      t2Name: 'Elena Rostova',
      t2Role: 'Principal Full-Stack Engineer',
      t2Text: 'The Next.js 15 App Router JSX export saved our engineering team dozens of hours. Zero hydration cost, completely clean AST format, and flawless Google Rich Results tests.',
      t2Metric: '0ms Hydration Overhead',
      t3Name: 'Tariq Al-Mansoor',
      t3Role: 'E-Commerce Growth Director',
      t3Text: 'Generating valid Shopify Liquid schema with price, stock, and aggregate ratings without bulky third-party Shopify apps improved our mobile PageSpeed score to 99/100.',
      t3Metric: '+38% Organic Revenue',
    },
    matrix: {
      title: 'Structured Data vs AI Overviews (GEO 2026 Matrix)',
      subtitle: 'Technical performance metrics across retrieval systems and language model citations.',
      colFeature: 'Optimization Feature',
      colTrad: 'Traditional SEO',
      colGeo: 'Generative Engine Optimization (GEO)',
      colImpact: 'Impact Factor',
      row1Title: 'JSON-LD Schema Graph',
      row1Trad: 'Rich Snippets only',
      row1Geo: 'Direct Entity Recognition in LLM Contexts',
      row1Impact: '+40% Citation Lift',
      row2Title: 'BLUF Answer Paragraphs',
      row2Trad: 'Dwell time improvement',
      row2Geo: 'RAG Chunk Vector Match',
      row2Impact: '+30.2% Ingestion Speed',
      row3Title: 'Client-Side Zero Latency',
      row3Trad: 'Core Web Vitals Pass',
      row3Geo: 'Immediate Bot Indexing & Crawl Protection',
      row3Impact: '100% Crawl Efficiency',
    },
    modal: {
      title: 'Unlock SchemaCraft Pro Lifetime',
      subtitle: 'One-time payment • Lifetime updates • No recurring subscriptions',
      launchDeal: 'Early-Bird Launch Deal — 90% OFF',
      originalPrice: '$49.00',
      currentPrice: '$4.99',
      oneTimeFee: 'USD One-Time',
      feat1: 'Instant 6-File Enterprise ZIP Bundle (Next.js 15, Shopify Liquid, WordPress PHP, JSON-LD)',
      feat2: 'Full Perpetual Commercial License for Unlimited Client & Personal Websites',
      feat3: 'Exclusive GEO 2026 AI Search & Citation Technical Playbook included',
      feat4: '100% Schema.org v26.0 & Google Rich Results Zero-Error Guarantee',
      guarantee: '30-Day 100% Money-Back Guarantee • Zero Risk',
      priceNote: 'Instant unlock via PayPal or Credit/Debit Card',
      instantUnlock: 'Unlock Pro Lifetime ($4.99 USD)',
      sslNote: 'Verified 256-bit SSL Encrypted & PayPal Protected Checkout',
      supportNote: 'Need help or refund? Email support@schemacraft-ai.site for 24h resolution.',
      close: 'Close (Esc)',
    },
    toast: {
      title: 'Pro License Verified & Activated!',
      desc: 'Your 6-File Enterprise Production ZIP Bundle has been downloaded automatically.',
    },
    footer: {
      text1: 'SchemaCraft AI Engine - Pure Single-Utility SaaS Architecture.',
      text2: 'Direct PayPal Integration | 0ms Client Latency | 2026 Standards',
      guaranteeBadge: '100% Satisfaction or Full Refund within 30 Days',
      supportEmail: 'Official Support & Inquiries: support@schemacraft-ai.site',
    },
  },
  ar: {
    nav: {
      title: 'SchemaCraft',
      engineVersion: 'v2.4',
      unlockPro: 'فتح رخصة برو ($4.99)',
      proActive: 'برو مفعل',
      astActive: 'مدقق السكيما: نشط 100%',
      langEn: 'English',
      langAr: 'العربية',
    },
    bluf: {
      pill: 'معالجة فورية 0ms • متوافق 100% مع Schema.org v26.0',
      h1Line1: 'مولد وهيكل بيانات JSON-LD العالمي',
      h1Line2: 'لتتصدر محركات البحث التوليدي والذكاء الاصطناعي',
      blufTag: 'الضمان الفني المباشر (BLUF Standard)',
      blufText:
        'سكيما كرافت AI هو محرك متطور من جانب العميل يعمل بسرعة استجابة 0ms لتوليد بيانات منظمة متوافقة مع Schema.org و Google Rich Results. مصمم لتحسين محركات البحث التوليدية (GEO)، ليغذي محركات Perplexity و Google AI Overviews و ChatGPT بمعلومات حتمية دقيقة ترفع معدل الاقتباس المباشر حتى +40% بدون أخطاء.',
    },
    presets: {
      label: 'نماذج جاهزة بنقرة واحدة:',
      saas: 'ساس وتطبيقات Next.js',
      ecommerce: 'متجر شوبيفاي وسلة',
      faq: 'أسئلة واقتباسات AI',
      local: 'خرائط جوجل ونشاط محلي',
      article: 'مقال وأخبار',
      course: 'دورة تعليمية وكورس',
      event: 'ويبينار وحدث تقني',
    },
    bundleValue: {
      title: 'ماذا تتضمن حزمة الشركات الشاملة (Enterprise ZIP Bundle) بسعر $4.99؟',
      subtitle: 'حزمة برمجية متكاملة بـ 6 ملفات جاهزة للإنتاج والاستخدام المباشر في جميع مشاريعك ومشاريع عملائك.',
      f1Title: '1. ملف سكيما JSON-LD القياسي (.json)',
      f1Desc: 'بيانات منظمة متطابقة 100% مع معايير W3C و Schema.org v26.0.',
      f2Title: '2. مكون Next.js 15 Server Component (.tsx)',
      f2Desc: 'كود جاهز للتضمين المباشر في مشاريع App Router و React 19.',
      f3Title: '3. سكريبت شوبيفاي المخصص (.liquid)',
      f3Desc: 'كود Liquid مهيأ للتضمين في قوالب شوبيفاي ومتاجر سلة بدون تطبيقات خارجية.',
      f4Title: '4. كود ووردبريس وووكومرس (.php)',
      f4Desc: 'سكريبت PHP جاهز للربط مع functions.php أو إضافة Snippets.',
      f5Title: '5. وثيقة الترخيص التجاري الدائم (.txt)',
      f5Desc: 'حقوق استخدام تجاري غير محدودة لعدد لا نهائي من مواقعك ومواقع عملائك مدى الحياة.',
      f6Title: '6. كتيب استراتيجيات تصدر الذكاء الاصطناعي GEO 2026 (.md)',
      f6Desc: 'دليل تقني حصري من 12 خطوة لتتصدر استشهادات Perplexity و ChatGPT Search.',
    },
    score: {
      title: 'مقياس جاهزية الاقتباس في الذكاء الاصطناعي (GEO/AEO)',
      status: 'جاهزية واقتباس مثالي بنسبة 100%',
      check1: 'تأصيل الكيانات الرقمية الحتمي (@id & @type)',
      check2: 'بيانات وصفية دقيقة للسعر والمخزون مقروءة للآلة',
      check3: 'توافق فقرات BLUF مع متجهات استرجاع الـ RAG',
      check4: 'مطابقة قياسية 100% لمواصفات W3C و Schema.org v26.0',
    },
    builder: {
      selectSchemaType: 'اختر نوع السكيما (Schema.org Type)',
      targetQuery: 'سؤال البحث المستهدف للذكاء الاصطناعي (Question)',
      directAnswer: 'الإجابة المباشرة المختصرة (BLUF 40-60 كلمة)',
      businessName: 'اسم النشاط التجاري / الشركة',
      streetAddress: 'عنوان الشارع / المقر',
      city: 'المدينة',
      telephone: 'رقم الهاتف',
      articleHeadline: 'عنوان المقال الرئيسي',
      articleSummary: 'ملخص المقال',
      authorName: 'اسم الكاتب / العلامة التجارية',
      entityName: 'اسم المنتج أو المنظومة',
      entityProposition: 'القيمة المقترحة ووصف المنتج',
      price: 'السعر',
      currency: 'العملة',
      appCategory: 'تصنيف التطبيق البرمجي',
      courseTitle: 'عنوان الدورة أو الكورس',
      courseDescription: 'ملخص المنهج ومحتوى الدورة',
      courseProvider: 'اسم الأكاديمية أو المنصة المزودة',
      eventName: 'اسم الفعالية أو الويبينار',
      eventDate: 'تاريخ بدء الفعالية (YYYY-MM-DD)',
      eventLocation: 'مقر الفعالية أو رابط البث المباشر',
      astValid: 'فحص الـ AST: صالح بنسبة 100%',
      downloadBundle: 'تحميل حزمة برو الشاملة ($4.99)',
    },
    benchmarks: {
      title: 'مقاييس محركات الاقتباس الذكية',
      citationRate: 'معدل الاقتباس في AI',
      parsingLatency: 'زمن المعالجة الفعلي',
      schemaValid: 'مطابقة Schema.org',
    },
    preview: {
      tabCode: 'JSON-LD',
      tabNextjs: 'Next.js 15 JSX',
      tabShopify: 'Shopify Liquid',
      tabSerp: 'معاينة بحث جوجل',
      tabAi: 'معاينة الذكاء الاصطناعي',
      copyCode: 'نسخ الكود',
      copied: 'تم النسخ إلى الحافظة بنجاح!',
      minify: 'كود مضغوط (Minified)',
      beautify: 'كود منسق (Formatted)',
      testGoogle: 'اختبار في نتائج جوجل الغنية',
      testSchemaOrg: 'التحقق في Schema.org',
      serpTitle: 'المواصفات الفنية الرسمية',
      inStock: 'متوفر في المخزون',
      aiTitle: 'استشهادات Perplexity و ChatGPT Search',
      llmParseable: 'هيكل بيانات مقروء للذكاء الاصطناعي 100%',
      entityStatus: 'رسم بياني حتمي وموثق',
    },
    installation: {
      title: 'دمج وتضمين سريع خلال 30 ثانية في جميع المنصات',
      subtitle: 'انسخ كود السكيما الموثق والصقه في موقعك بدون أي تأثير على سرعة التحميل.',
      nextjsTitle: 'مواقع Next.js 15 و React 19',
      nextjsDesc: 'الصق كود الـ JSX مباشرة داخل مكون app/page.tsx أو app/layout.tsx بدون أي كلفة تحميل.',
      shopifyTitle: 'متاجر شوبيفاي، سلة، وزد',
      shopifyDesc: 'أضف كود Liquid في ملف snippets/schema.liquid واستدعه في theme.liquid قبل وسم </head>.',
      wordpressTitle: 'ووردبريس ومتاجر ووكومرس',
      wordpressDesc: 'أدخل كود السكيما في إعدادات الهيدر (Header Scripts) أو باستخدام أي إضافة Snippets.',
      webflowTitle: 'مواقع Webflow و Framer',
      webflowDesc: 'أضف عنصر Custom Code وضع الكود في إعدادات الصفحة داخل قسم Inside <head> tag.',
    },
    testimonials: {
      title: 'موثوق من قِبل أكثر من 1,400 مؤسس تقني ومهندس SEO',
      subtitle: 'نتائج حقيقية موثقة في تحسين ترتيب محركات البحث واقتباسات الذكاء الاصطناعي.',
      t1Name: 'ماركوس فانس',
      t1Role: 'رئيس قسم الـ SEO التقني في وكالة ScaleVibe',
      t1Text: 'قمنا بنقل أكثر من 40 موقع عميل لسكيما كرافت. خلال 14 يوماً فقط، ارتفعت استشهادات Perplexity بنسبة +47% وظهرت نجوم التقييم الصفراء على 92% من صفحات المنتجات في جوجل.',
      t1Metric: '+47% اقتباسات AI',
      t2Name: 'إيلينا روستوفا',
      t2Role: 'مهندسة برمجيات أولى (Full-Stack Architect)',
      t2Text: 'تصدير أكواد Next.js 15 App Router المباشر وفّر على فريقنا عشرات الساعات. كود فائق النظافة وبدون أي حمل على الأداء واجتاز اختبارات Google Rich Results بنسبة 100%.',
      t2Metric: '0ms وقت تحميل إضافي',
      t3Name: 'طارق المنصور',
      t3Role: 'مدير نمو المتاجر الإلكترونية',
      t3Text: 'توليد سكيما Liquid لشوبيفاي وسلة مع السعر والمخزون والتقييمات دون تثبيت تطبيقات تبطئ المتجر رفع سرعة متجرنا على الموبايل إلى 99/100 مع زيادة في المبيعات.',
      t3Metric: '+38% أرباح عضوية',
    },
    matrix: {
      title: 'مقارنة البيانات المنظمة مع بحث الذكاء الاصطناعي (GEO 2026)',
      subtitle: 'مقاييس الأداء الفني عبر أنظمة الاسترجاع وتضمينات نماذج اللغة الكبيرة.',
      colFeature: 'الميزة الفنية',
      colTrad: 'السيو التقليدي (Traditional SEO)',
      colGeo: 'تحسين محركات البحث التوليدي (GEO)',
      colImpact: 'عامل التأثير',
      row1Title: 'هيكل JSON-LD Graph',
      row1Trad: 'مقتطفات غنية فقط (Rich Snippets)',
      row1Geo: 'تعرف مباشر على الكيانات في سياق الـ LLM',
      row1Impact: '+40% زيادة الاستشهاد',
      row2Title: 'فقرات إجابة BLUF المباشرة',
      row2Trad: 'تحسين مدة البقاء في الصفحة',
      row2Geo: 'تطابق متجهات RAG الفوري',
      row2Impact: '+30.2% سرعة الفهرسة',
      row3Title: 'سرعة استجابة 0ms بدون خادم',
      row3Trad: 'اجتياز Core Web Vitals',
      row3Geo: 'أرشفة فورية وحماية ميزانية الزحف',
      row3Impact: '100% كفاءة الزحف',
    },
    modal: {
      title: 'فتح رخصة سكيما كرافت برو مدى الحياة',
      subtitle: 'دفع لمرة واحدة • تحديثات مجانية دائمة • بدون اشتراكات شهرية متكررة',
      launchDeal: 'عرض الإطلاق المحدود — خصم 90%',
      originalPrice: '$49.00',
      currentPrice: '$4.99',
      oneTimeFee: 'دولار لمرة واحدة فقط',
      feat1: 'حزمة الشركات الفورية ZIP بـ 6 ملفات (Next.js 15, Shopify Liquid, WordPress PHP, JSON-LD)',
      feat2: 'ترخيص تجاري دائم وغير محدود لجميع مواقعك ومواقع عملائك',
      feat3: 'كتيب استراتيجيات تصدر الذكاء الاصطناعي GEO 2026 الحصري متضمن داخل الحزمة',
      feat4: 'ضمان مطابقة 100% لمواصفات Schema.org v26.0 و Google Rich Results بدون أخطاء',
      guarantee: 'ضمان استرجاع الأموال بالكامل لمدة 30 يوماً • تجربة خالية من أي مخاطرة',
      priceNote: 'فتح فوري وآمن عبر باي بال أو بطاقة الدفع (Credit/Debit Card)',
      instantUnlock: 'فتح رخصة برو مدى الحياة ($4.99 USD)',
      sslNote: 'معاملة مشفرة وآمنة 256-bit SSL محمية بالكامل عبر PayPal',
      supportNote: 'هل تحتاج مساعدة أو استرداد؟ راسلنا على support@schemacraft-ai.site وستتم المعالجة خلال 24 ساعة.',
      close: 'إغلاق (Esc)',
    },
    toast: {
      title: 'تم التحقق وتفعيل رخصة برو بنجاح!',
      desc: 'تم بدء تحميل حزمة الشركات الشاملة (6 ملفات ZIP) تلقائياً.',
    },
    footer: {
      text1: 'منظومة SchemaCraft AI - معمارية SaaS أحادية الأداة فائقة الأداء.',
      text2: 'تكامل مباشر مع PayPal | سرعة 0ms | معايير 2026 العالمية',
      guaranteeBadge: 'ضمان رضا كامل أو استرداد أموالك خلال 30 يوماً',
      supportEmail: 'الدعم الفني والاستفسارات: support@schemacraft-ai.site',
    },
  },
};
