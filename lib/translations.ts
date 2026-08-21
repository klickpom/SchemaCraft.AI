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
    tabSerp: string;
    tabAi: string;
    copyCode: string;
    copied: string;
    serpTitle: string;
    inStock: string;
    aiTitle: string;
    llmParseable: string;
    entityStatus: string;
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
    feat1: string;
    feat2: string;
    feat3: string;
    priceNote: string;
    instantUnlock: string;
    sslNote: string;
    close: string;
  };
  toast: {
    title: string;
    desc: string;
  };
  footer: {
    text1: string;
    text2: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    nav: {
      title: 'SchemaCraft',
      engineVersion: 'v2.4 Engine',
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
      astValid: 'AST Validation: 100% Valid',
      downloadBundle: 'Download Bundle',
    },
    benchmarks: {
      title: 'Citation Engine Benchmarks',
      citationRate: 'AI Citation Rate',
      parsingLatency: 'Parsing Latency',
      schemaValid: 'Schema.org Valid',
    },
    preview: {
      tabCode: 'JSON-LD Code',
      tabSerp: 'Google SERP',
      tabAi: 'AI Overview',
      copyCode: 'Copy Code',
      copied: 'Copied',
      serpTitle: 'Official Technical Specification',
      inStock: 'In stock',
      aiTitle: 'Perplexity & ChatGPT Search Grounding',
      llmParseable: '100% LLM Parseable AST',
      entityStatus: 'Deterministic Graph',
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
      title: 'Unlock SchemaCraft Pro',
      subtitle: 'One-time payment • Instant unlimited bundle download',
      feat1: 'Unlimited Batch JSON-LD File Exports',
      feat2: 'Pre-Configured Next.js 15 & Shopify Liquid Scripts',
      feat3: '100% Commercial Usage & Schema.org Standards',
      priceNote: 'Direct instant checkout via PayPal Smart Buttons',
      instantUnlock: 'Complete Instant Unlock ($4.99 USD)',
      sslNote: 'Verified 256-bit SSL encrypted checkout',
      close: 'Close (Esc)',
    },
    toast: {
      title: 'Pro License Verified & Activated!',
      desc: 'Your production JSON-LD bundle has been downloaded automatically.',
    },
    footer: {
      text1: 'SchemaCraft AI Engine - Pure Single-Utility SaaS Architecture.',
      text2: 'Direct PayPal Integration | 0ms Client Latency | 2026 Standards',
    },
  },
  ar: {
    nav: {
      title: 'سكيما كرافت',
      engineVersion: 'محرك v2.4 الذكي',
      unlockPro: 'فتح رخصة برو ($4.99)',
      proActive: 'رخصة برو مفعلة',
      astActive: 'مدقق السكيما: نشط 100%',
      langEn: 'English',
      langAr: 'العربية',
    },
    bluf: {
      pill: 'معالجة فورية 0ms • متوافق 100% مع Schema.org v26.0',
      h1Line1: 'مولد وهيكل بيانات JSON-LD العالمي',
      h1Line2: 'لتصدر محركات البحث التوليدي والذكاء الاصطناعي',
      blufTag: 'الضمان الفني المباشر (BLUF Standard)',
      blufText:
        'سكيما كرافت AI هو محرك متطور من جانب العميل يعمل بسرعة استجابة 0ms لتوليد بيانات منظمة متوافقة مع Schema.org و Google Rich Results. مصمم لتحسين محركات البحث التوليدية (GEO)، ليغذي محركات Perplexity و Google AI Overviews و ChatGPT بمعلومات حتمية دقيقة ترفع معدل الاقتباس المباشر حتى +40% بدون أخطاء.',
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
      astValid: 'فحص الـ AST: صالح بنسبة 100%',
      downloadBundle: 'تحميل حزمة السكيما',
    },
    benchmarks: {
      title: 'مقاييس محركات الاقتباس الذكية',
      citationRate: 'معدل الاقتباس في AI',
      parsingLatency: 'زمن المعالجة الفعلي',
      schemaValid: 'مطابقة Schema.org',
    },
    preview: {
      tabCode: 'كود JSON-LD',
      tabSerp: 'معاينة بحث جوجل',
      tabAi: 'معاينة الذكاء الاصطناعي',
      copyCode: 'نسخ الكود',
      copied: 'تم النسخ بنجاح',
      serpTitle: 'المواصفات الفنية الرسمية',
      inStock: 'متوفر في المخزون',
      aiTitle: 'استشهادات Perplexity و ChatGPT Search',
      llmParseable: 'هيكل بيانات مقروء للذكاء الاصطناعي 100%',
      entityStatus: 'رسم بياني حتمي وموثق',
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
      title: 'فتح رخصة سكيما كرافت برو',
      subtitle: 'دفع لمرة واحدة • تحميل فوري وغير محدود لحزم السكيما',
      feat1: 'تصدير وتحميل غير محدود لملفات JSON-LD',
      feat2: 'أكواد جاهزة وتلقائية لمواقع Next.js 15 و Shopify',
      feat3: 'ترخيص تجاري كامل 100% ومطابقة رسمية للمواصفات',
      priceNote: 'دفع فوري وآمن مباشرة عبر PayPal Smart Buttons',
      instantUnlock: 'إتمام الفتح الفوري ($4.99 USD)',
      sslNote: 'معاملة مشفرة وآمنة 256-bit SSL',
      close: 'إغلاق (Esc)',
    },
    toast: {
      title: 'تم التحقق وتفعيل رخصة برو بنجاح!',
      desc: 'تم بدء تحميل حزمة الـ JSON-LD الخاصة بك تلقائياً.',
    },
    footer: {
      text1: 'منظومة SchemaCraft AI - معمارية SaaS أحادية الأداة فائقة الأداء.',
      text2: 'تكامل مباشر مع PayPal | سرعة 0ms | معايير 2026 العالمية',
    },
  },
};
