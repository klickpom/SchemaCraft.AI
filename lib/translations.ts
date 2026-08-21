export type Language = 'en' | 'ar';

export interface Translations {
  nav: {
    brandTitle: string;
    engineTag: string;
    ctaUnlock: string;
    ctaUnlockMobile: string;
    ctaUnlocked: string;
    shareReport: string;
    reportShared: string;
    langEn: string;
    langAr: string;
  };
  hero: {
    badge: string;
    h1: string;
    subtitle: string;
    inputPlaceholder: string;
    ctaAnalyze: string;
    scanningText: string;
    orTryDemo: string;
    demoSaas: string;
    demoEcom: string;
    demoClinic: string;
    demoAgency: string;
  };
  scanning: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  };
  errors: {
    scanFailed: string;
  };
  scoreSection: {
    overallTitle: string;
    scoreExplanation: string;
    technicalSEO: string;
    crawlability: string;
    contentAnswerability: string;
    entitySchema: string;
    aiSearchReadiness: string;
    evidenceLedgerTitle: string;
    evidenceLedgerSubtitle: string;
    badgeHealthy: string;
    badgeNeedsOpt: string;
    badgeCritical: string;
    scanAnother: string;
  };
  blockers: {
    badge: string;
    title: string;
    subtitle: string;
    viewFixBtn: string;
    signalLabel: string;
    evidenceLabel: string;
    whyMattersLabel: string;
    actionLabel: string;
    impactLabel: string;
  };
  lockedSection: {
    badge: string;
    title: string;
    subtitle: string;
    ctaUnlockAll: string;
    ctaSubtext: string;
    feature1: string;
    feature2: string;
    feature3: string;
    feature4: string;
  };
  opportunitySection: {
    badge: string;
    title: string;
    subtitle: string;
    coveredTag: string;
    partiallyCoveredTag: string;
    missingTag: string;
  };
  agencyBanner: {
    title: string;
    desc: string;
    ctaCopyLink: string;
  };
  modal: {
    title: string;
    subtitle: string;
    price: string;
    guarantee: string;
    support: string;
    instantAccess: string;
    close: string;
    cancel: string;
  };
  issuesSection: {
    title: string;
    subtitle: string;
    generateFix: string;
  };
  stickyBar: {
    badge: string;
    text: string;
    cta: string;
    guarantee: string;
  };
  roiComparison: {
    badge: string;
    title: string;
    subtitle: string;
    colFeature: string;
    colAgency: string;
    colSchemaCraft: string;
    rowCost: string;
    rowCostAgency: string;
    rowCostSchemaCraft: string;
    rowTime: string;
    rowTimeAgency: string;
    rowTimeSchemaCraft: string;
    rowCoverage: string;
    rowCoverageAgency: string;
    rowCoverageSchemaCraft: string;
    rowGuarantee: string;
    rowGuaranteeAgency: string;
    rowGuaranteeSchemaCraft: string;
  };
  aiPreview: {
    badge: string;
    title: string;
    subtitle: string;
    tabBefore: string;
    tabAfter: string;
    chatgptTitle: string;
    googleTitle: string;
    statusBefore: string;
    statusAfter: string;
    beforeNote: string;
    afterNote: string;
  };
  trafficLoss: {
    badge: string;
    title: string;
    subtitle: string;
    lostRate: string;
    estLostVisitors: string;
    recoveryTime: string;
    actionNote: string;
  };
  pdfExport: {
    btnExport: string;
    reportHeader: string;
  };
  knowledge: {
    badge: string;
    h2: string;
    subtitle: string;
    p1Title: string;
    p1Desc: string;
    p2Title: string;
    p2Desc: string;
    p3Title: string;
    p3Desc: string;
    p4Title: string;
    p4Desc: string;
  };
  footer: {
    brandDesc: string;
    crawlersTitle: string;
    platformsTitle: string;
    guaranteeTitle: string;
    guaranteeDesc: string;
    supportTitle: string;
    rights: string;
    privacy: string;
    terms: string;
    whitepaper: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      brandTitle: 'SchemaCraft',
      engineTag: 'Audit Engine v1.0',
      ctaUnlock: 'Fix My Website — $9',
      ctaUnlockMobile: '$9 Fix',
      ctaUnlocked: 'Unlocked',
      shareReport: 'Share Snapshot',
      reportShared: 'Link Copied!',
      langEn: 'English',
      langAr: 'العربية',
    },
    hero: {
      badge: 'Fast Deterministic SEO + GEO + AEO Diagnostic',
      h1: 'See How Search Engines and AI Understand Your Website',
      subtitle: 'Run a free SEO + AI Search audit and uncover the technical, content, entity, and crawlability issues limiting your visibility.',
      inputPlaceholder: 'Enter website URL (e.g. company.com)...',
      ctaAnalyze: 'Analyze My Website →',
      scanningText: 'Running Deep Diagnostic Scan...',
      orTryDemo: 'Or Explore a Live Demo Audit:',
      demoSaas: 'SaaS Platform',
      demoEcom: 'Shopify Store',
      demoClinic: 'Dental Clinic',
      demoAgency: 'B2B Agency',
    },
    scanning: {
      step1: 'Evaluating Server HTTP Status & Indexability Gate...',
      step2: 'Inspecting robots.txt, OAI-SearchBot & Bot Firewalls...',
      step3: 'Parsing Content, Headings & Direct BLUF Answerability...',
      step4: 'Auditing Schema.org Entity Graph & Weighted Score Matrix...',
      step5: 'Compiling AI Search visibility report...',
    },
    errors: {
      scanFailed: 'Could not reach this website. Please check the URL and try again.',
    },
    scoreSection: {
      overallTitle: 'AI Search Visibility Score',
      scoreExplanation: 'Weighted composite metric evaluated across 5 core technical & semantic search dimensions.',
      technicalSEO: 'Technical SEO',
      crawlability: 'Crawlability & Bots',
      contentAnswerability: 'Content & Answers',
      entitySchema: 'Entity & Schema.org',
      aiSearchReadiness: 'AI Search Readiness',
      evidenceLedgerTitle: 'Raw Evidence Ledger (Why this score exists)',
      evidenceLedgerSubtitle: 'Deterministic signals inspected directly on the target website.',
      badgeHealthy: 'Optimized & Healthy',
      badgeNeedsOpt: 'Needs Optimization',
      badgeCritical: 'Critical Action Required',
      scanAnother: 'Scan Another Website',
    },
    blockers: {
      badge: 'Immediate Action Required',
      title: 'Top 3 Detected Visibility Blockers',
      subtitle: 'These critical issues directly hinder how Google, ChatGPT Search, and AI engines discover and parse your pages.',
      viewFixBtn: 'View Ready Fix Code →',
      signalLabel: 'Signal Detected:',
      evidenceLabel: 'Raw Evidence:',
      whyMattersLabel: 'Why It Matters:',
      actionLabel: 'Recommended Action:',
      impactLabel: 'Impact',
    },
    lockedSection: {
      badge: 'Full Action Plan',
      title: '11+ Additional High-Impact Opportunities Found',
      subtitle: 'Unlock complete evidence breakdowns, priority severity matrix, and interactive code fixes for all detected issues.',
      ctaUnlockAll: 'Fix My Website — $9 (One-Time)',
      ctaSubtext: 'Instant access to all 17+ fixes across WordPress, Next.js, and Shopify. 30-Day Money-Back Guarantee.',
      feature1: '17+ Prioritized Technical & Content Issues with Evidence',
      feature2: 'Interactive Fix Generator for WordPress, Next.js 15 & Shopify',
      feature3: 'AI Search Opportunity Finder & Niche Query Matrix',
      feature4: 'Shareable Snapshot Link for Client & Prospect Presentations',
    },
    opportunitySection: {
      badge: 'AI Search Opportunity Finder',
      title: 'High-Intent Niche Search Queries',
      subtitle: 'Evaluation of how well your current landing page content answers top commercial and informational queries.',
      coveredTag: 'Covered in Content',
      partiallyCoveredTag: 'Partially Covered',
      missingTag: 'Coverage Gap (Missing)',
    },
    agencyBanner: {
      title: 'Agency Sales Weapon: Audit Any Prospect Before Your Call',
      desc: 'Use this diagnostic report as an evidence-backed sales asset to close high-ticket SEO & AI optimization retainer clients.',
      ctaCopyLink: 'Copy Shareable Audit Snapshot',
    },
    modal: {
      title: 'Unlock Full Audit & Interactive Fix Generator',
      subtitle: 'Get instant, production-ready code fixes for WordPress, Next.js, and Shopify across all 17+ detected issues.',
      price: '$9.00 USD (One-Time Lifetime Access)',
      guarantee: '100% Satisfaction Guarantee or Full Refund within 30 Days',
      support: 'Official Inquiries: support@schemacraft-ai.site',
      instantAccess: 'Instant Unlock via PayPal Checkout',
      close: 'Close',
      cancel: 'Cancel and return',
    },
    issuesSection: {
      title: 'All Detected Issues & Improvement Opportunities',
      subtitle: 'Click on any issue to view exact code fixes for WordPress, Next.js, and Shopify',
      generateFix: 'Generate Platform Fix',
    },
    stickyBar: {
      badge: 'Critical Optimization Pass',
      text: 'Instant 1-click code fixes for all detected issues on your website.',
      cta: 'Fix My Website — $9',
      guarantee: '30-Day Money-Back Guarantee',
    },
    roiComparison: {
      badge: 'Transparent ROI & Value Comparison',
      title: 'Why Pay $300+ to an Agency When You Can Fix It in 60s?',
      subtitle: 'Compare the real cost, speed, and accuracy of diagnosing and fixing your website for Google & AI search engines:',
      colFeature: 'Capability / Metric',
      colAgency: 'Traditional Agency / $129/mo SEO Tool',
      colSchemaCraft: 'SchemaCraft AI (Lifetime Pass)',
      rowCost: 'Investment Model',
      rowCostAgency: '$150/hr or $129/mo recurring subscription',
      rowCostSchemaCraft: '$9.00 One-Time Lifetime Pass (Zero Subscriptions)',
      rowTime: 'Time to Resolution',
      rowTimeAgency: '2 to 4 weeks of consultations & manual tickets',
      rowTimeSchemaCraft: 'Instant 60 seconds with production-ready copy-paste code',
      rowCoverage: 'Generative AI & GEO Coverage',
      rowCoverageAgency: 'Rarely addressed (Legacy 2018 SEO methods only)',
      rowCoverageSchemaCraft: '100% Optimized for ChatGPT Search, Perplexity & Google AI',
      rowGuarantee: 'Risk & Satisfaction',
      rowGuaranteeAgency: 'Locked retainer contracts with zero refunds',
      rowGuaranteeSchemaCraft: '100% Unconditional 30-Day Money-Back Guarantee',
    },
    aiPreview: {
      badge: 'Live Search Engine & AI Simulation',
      title: 'How ChatGPT & Google View Your Website (Before vs After)',
      subtitle: 'See how adding SchemaCraft JSON-LD and bot configurations transforms your search appearance from invisible to authoritative:',
      tabBefore: 'Current Status (Unoptimized)',
      tabAfter: 'After SchemaCraft ($9 Fix)',
      chatgptTitle: 'ChatGPT Search / Perplexity Citation Mockup',
      googleTitle: 'Google Rich Snippet Search Result',
      statusBefore: 'Unverified Entity • Low Citation Priority',
      statusAfter: 'Authoritative Verified Entity • Rich Snippet Active',
      beforeNote: 'AI models struggle to extract structured facts and may cite competitors instead.',
      afterNote: 'Structured Schema.org JSON-LD enables direct AI answer extraction and rich snippet cards.',
    },
    trafficLoss: {
      badge: 'AI Visibility & Revenue Risk',
      title: 'Estimated AI Search Traffic Loss',
      subtitle: 'Based on your current diagnostic score and crawlability barriers:',
      lostRate: 'Visibility Deficit',
      estLostVisitors: 'Monthly High-Intent Visitors at Risk',
      recoveryTime: 'Time to Recover Visibility',
      actionNote: 'Fix all detected issues with ready-to-use code in under 60 seconds.',
    },
    pdfExport: {
      btnExport: 'Export PDF Audit Report',
      reportHeader: 'Official SchemaCraft AI Technical SEO & Visibility Report',
    },
    knowledge: {
      badge: 'Authoritative 2026 Knowledge Standard',
      h2: 'How Search Engines and AI Understand Websites in 2026',
      subtitle: 'Based on official Google Search Console documentation, OpenAI SearchBot guidelines, and Schema.org v26.0 standards.',
      p1Title: '1. Indexability Gate Hierarchy',
      p1Desc: 'Before any AI parsing can take place, the page must clear the sequential gate: HTTP 200 -> robots.txt allow -> absence of noindex header/meta -> self-referential canonical URL.',
      p2Title: '2. Multi-Level Bot Accessibility',
      p2Desc: 'OpenAI explicitly documents that OAI-SearchBot must be allowed in robots.txt and safelisted in WAF/CDNs (Cloudflare) for content to be indexed and cited in ChatGPT Search summaries.',
      p3Title: '3. BLUF Semantic Answerability',
      p3Desc: 'Modern LLMs extract facts from top semantic text chunks. Positioning a definitive 40-60 word direct summary directly beneath the primary H1 maximizes extraction fidelity.',
      p4Title: '4. Context-Aware Entity Graphs',
      p4Desc: 'Replacing generic schema checklists with context-aware JSON-LD graphs (SoftwareApplication for SaaS, Product for E-Com, MedicalBusiness for Clinics) grounds your brand in the Knowledge Graph.',
    },
    footer: {
      brandDesc: 'SchemaCraft.AI is the global evidence-based AI Search Visibility Auditor & Optimizer engineered for digital agencies, SaaS founders, and enterprise brands.',
      crawlersTitle: 'Monitored Search & AI Bots',
      platformsTitle: 'Supported Code Platforms',
      guaranteeTitle: '30-Day Money-Back Guarantee',
      guaranteeDesc: '100% risk-free. If you are not satisfied with the diagnostic evidence and fixes, contact support@schemacraft-ai.site for an immediate refund.',
      supportTitle: 'Official Support & Inquiries',
      rights: '© 2026 SchemaCraft.AI • Deterministic Audit Engine v1.0 • All Rights Reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      whitepaper: 'GEO 2026 Architecture Whitepaper',
    },
  },
  ar: {
    nav: {
      brandTitle: 'SchemaCraft',
      engineTag: 'محرك الفحص v1.0',
      ctaUnlock: 'أصلح موقعي الآن — $9',
      ctaUnlockMobile: 'أصلح $9',
      ctaUnlocked: 'مفعل',
      shareReport: 'مشاركة التقرير',
      reportShared: 'تم نسخ الرابط!',
      langEn: 'English',
      langAr: 'العربية',
    },
    hero: {
      badge: 'فحص تشخيصي حتمي شامل لـ SEO والذكاء الاصطناعي',
      h1: 'اكتشف كيف تفهم محركات البحث والذكاء الاصطناعي موقعك',
      subtitle: 'قم بتشغيل فحص مجاني شامل واكتشف المشاكل التقنية ومشاكل المحتوى والزحف التي تحد من ظهور وفهم موقعك.',
      inputPlaceholder: 'أدخل رابط موقعك (مثل: company.com)...',
      ctaAnalyze: 'افحص موقعي الآن →',
      scanningText: 'جاري تشغيل الفحص التشخيصي العميق...',
      orTryDemo: 'أو استكشف نماذج فحص حية جاهزة:',
      demoSaas: 'تطبيق ساس',
      demoEcom: 'متجر شوبيفاي',
      demoClinic: 'عيادة طبية',
      demoAgency: 'وكالة B2B',
    },
    scanning: {
      step1: 'فحص استجابة الخادم وبوابة الفهرسة (Indexability Gate)...',
      step2: 'فحص ملف robots.txt وبوت شات جي بي تي (OAI-SearchBot)...',
      step3: 'تحليل المحتوى والعناوين وقابلية الإجابة المباشرة (BLUF)...',
      step4: 'تدقيق شبكة بيانات السكيما المنظمة وحساب مصفوفة النقاط...',
      step5: 'تجميع تقرير الظهور في بحث AI...',
    },
    errors: {
      scanFailed: 'لم نتمكن من الوصول لهذا الموقع. تحقق من الرابط وحاول مرة أخرى.',
    },
    scoreSection: {
      overallTitle: 'مقياس جاهزية الظهور في محركات البحث والذكاء الاصطناعي',
      scoreExplanation: 'مقياس مركب وموزون مبني على 5 أبعاد تقنية ودلالية حاسمة.',
      technicalSEO: 'السيو التقني (Technical SEO)',
      crawlability: 'قابلية الزحف والبوتات',
      contentAnswerability: 'المحتوى والإجابات المباشرة',
      entitySchema: 'الكيان وبيانات Schema.org',
      aiSearchReadiness: 'الجاهزية للذكاء الاصطناعي',
      evidenceLedgerTitle: 'سجل الأدلة المرصودة (لماذا حصلت على هذه النتيجة؟)',
      evidenceLedgerSubtitle: 'إشارات حتمية تم فحصها والتأكد منها مباشرة في كود موقعك.',
      badgeHealthy: 'ممتاز ومستقر',
      badgeNeedsOpt: 'يحتاج تحسين فوري',
      badgeCritical: 'حرج — عوائق رئيسية',
      scanAnother: 'فحص موقع آخر',
    },
    blockers: {
      badge: 'مطلوب اتخاذ إجراء فوري',
      title: 'أهم 3 عوائق حرجة تمنع ظهور وفهم موقعك',
      subtitle: 'هذه المشاكل الحرجة تؤثر مباشرة على قدرة جوجل وبحث ChatGPT ومحركات الذكاء الاصطناعي على قراءة موقعك.',
      viewFixBtn: 'عرض كود الإصلاح الجاهز →',
      signalLabel: 'الإشارة المرصودة:',
      evidenceLabel: 'الدليل المباشر:',
      whyMattersLabel: 'لماذا يهم محركات البحث؟',
      actionLabel: 'الإجراء الموصى به:',
      impactLabel: 'التأثير',
    },
    lockedSection: {
      badge: 'خطة العمل الشاملة',
      title: 'تم اكتشاف 11+ فرصة تحسين إضافية عالية التأثير',
      subtitle: 'افتح تفاصيل الأدلة الكاملة، ومصفوفة الأولوية، وأكواد الإصلاح التفاعلية لجميع المشاكل المكتشفة.',
      ctaUnlockAll: 'أصلح موقعي الآن — $9 (دفعة واحدة)',
      ctaSubtext: 'وصول فوري لجميع الأكواد الجاهزة لووردبريس وNext.js وشوبيفاي مع ضمان استرجاع 30 يوماً.',
      feature1: '17+ مشكلة تقنية ومحتوى مرتبة حسب الأولوية مع الأدلة الكاملة',
      feature2: 'مولد إصلاحات تفاعلي جاهز لـ WordPress و Next.js 15 و Shopify',
      feature3: 'مستكشف فرص أسئلة واستفسارات الذكاء الاصطناعي لمجال عملك',
      feature4: 'رابط تقرير فحص مباشر لمشاركته مع العملاء المحتملين في الوكالات',
    },
    opportunitySection: {
      badge: 'مستكشف فرص استفسارات الذكاء الاصطناعي',
      title: 'أسئلة البحث عالية القيمة لمجال عملك',
      subtitle: 'تقييم مدى إجابة محتوى صفحتك الحالية على الأسئلة التجارية والمعلوماتية الأكثر بحثاً.',
      coveredTag: 'مغطاة في المحتوى',
      partiallyCoveredTag: 'مغطاة جزئياً',
      missingTag: 'فجوة في المحتوى (مفقودة)',
    },
    agencyBanner: {
      title: 'أداة الوكالات المغناطيسية: افحص موقع أي عميل قبل جلسة المبيعات',
      desc: 'استخدم هذا التقرير التشخيصي المدعوم بالأدلة لإقناع وإغلاق صفقات تحسين السيو والذكاء الاصطناعي مع عملائك.',
      ctaCopyLink: 'نسخ رابط تقرير الفحص المباشر',
    },
    modal: {
      title: 'فتح الفحص الكامل ومولد الإصلاحات البرمجية',
      subtitle: 'احصل فوراً على أكواد جاهزة للإنتاج لـ WordPress و Next.js و Shopify لجميع المشاكل الـ 17 المكتشفة.',
      price: '9.00 دولار أمريكي فقط (دفعة واحدة مدى الحياة)',
      guarantee: 'ضمان رضا كامل بنسبة 100% أو استرجاع المبلغ خلال 30 يوماً',
      support: 'الدعم الرسمي: support@schemacraft-ai.site',
      instantAccess: 'دفع وتفعيل فوري عبر PayPal الآمن',
      close: 'إغلاق',
      cancel: 'إلغاء والعودة',
    },
    issuesSection: {
      title: 'جميع المشاكل وفرص التحسين المكتشفة',
      subtitle: 'انقر على أي مشكلة للحصول على كود الإصلاح المباشر لمنصتك',
      generateFix: 'توليد كود الإصلاح',
    },
    stickyBar: {
      badge: 'تحسين تقني فوري متاح',
      text: 'احصل فوراً على أكواد الإصلاح الجاهزة لجميع المشاكل المكتشفة في موقعك.',
      cta: 'أصلح موقعي الآن — $9',
      guarantee: 'ضمان استرجاع كامل 30 يوماً',
    },
    roiComparison: {
      badge: 'مقارنة القيمة والعائد المباشر على الاستثمار',
      title: 'لماذا تدفع 300$+ لوكالة أو مطور بينما يمكنك إصلاح كل شيء في 60 ثانية؟',
      subtitle: 'قارن بين تكلفة وسرعة ودقة تشخيص وإصلاح موقعك للظهور في جوجل والذكاء الاصطناعي:',
      colFeature: 'الميزة / المعيار',
      colAgency: 'الوكالات التقليدية / أدوات السيو (129$/شهر)',
      colSchemaCraft: 'SchemaCraft AI (تصريح مدى الحياة)',
      rowCost: 'طريقة الدفع والتكلفة',
      rowCostAgency: '150$/ساعة أو 129$/شهرياً باشتراك متكرر',
      rowCostSchemaCraft: '9.00$ فقط لمرة واحدة مدى الحياة (بدون أي اشتراك)',
      rowTime: 'سرعة الحصول على الحل',
      rowTimeAgency: 'من أسبوعين إلى 4 أسابيع من الانتظار والتواصل',
      rowTimeSchemaCraft: 'فوري في 60 ثانية بأكواد جاهزة للنسخ واللصق',
      rowCoverage: 'التوافق مع بحث الذكاء الاصطناعي (GEO)',
      rowCoverageAgency: 'نادر جداً (طرق سيو تقليدية قديمة لا تشمل محركات الذكاء الاصطناعي)',
      rowCoverageSchemaCraft: '100% مخصص لـ ChatGPT Search و Perplexity وبحث جوجل الحديث',
      rowGuarantee: 'الضمان وحماية المخاطر',
      rowGuaranteeAgency: 'عقود ملزمة وغير قابلة للاسترداد',
      rowGuaranteeSchemaCraft: 'ضمان استرجاع الأموال بنسبة 100% لمدة 30 يوماً بدون أي أسئلة',
    },
    aiPreview: {
      badge: 'محاكاة بصرية حية لنتائج البحث والذكاء الاصطناعي',
      title: 'كيف يرى ChatGPT وبحث Google موقعك (قبل وبعد الإصلاح)',
      subtitle: 'شاهد كيف يحوّل كود SchemaCraft موقعك من موقع غير معروف إلى مصدر موثوق ومقتبس في نتائج الذكاء الاصطناعي:',
      tabBefore: 'الوضع الحالي (غير محسن)',
      tabAfter: 'بعد كود SchemaCraft (إصلاح $9)',
      chatgptTitle: 'معاينة اقتباس ChatGPT Search / Perplexity',
      googleTitle: 'معاينة النتيجة الغنية في Google (Rich Snippet)',
      statusBefore: 'كيان غير موثق • أولوية اقتباس منخفضة',
      statusAfter: 'كيان رسمي موثق • بطاقة نتائج غنية مفعلة',
      beforeNote: 'نماذج الذكاء الاصطناعي تجد صعوبة في استخراج بيانات موقعك وقد ترشح المنافسين بدلاً منك.',
      afterNote: 'كود Schema.org المخصص يتيح للذكاء الاصطناعي اقتباس إجاباتك وموقعك كمرجع رسمي مباشرة.',
    },
    trafficLoss: {
      badge: 'مؤشر مخاطر فقدان الزيارات والأرباح',
      title: 'الخسائر التقديرية لزيارات ومبيعات الذكاء الاصطناعي',
      subtitle: 'بناءً على نتيجة الفحص الحالية وعوائق الزحف المرصودة في موقعك:',
      lostRate: 'نسبة نقص الظهور والجاهزية',
      estLostVisitors: 'زيارات شهرية عالية النية معرّضة للضياع',
      recoveryTime: 'الوقت المقدر لاستعادة الظهور الكامل',
      actionNote: 'أصلح جميع المشاكل بأكواد جاهزة خلال أقل من 60 ثانية.',
    },
    pdfExport: {
      btnExport: 'تصدير تقرير الفحص التنفيذي (PDF)',
      reportHeader: 'التقرير الفني الرسمي لظهور وسيو الذكاء الاصطناعي - SchemaCraft AI',
    },
    knowledge: {
      badge: 'المرجع التقني المعتمد لعام 2026',
      h2: 'كيف تفهم محركات البحث والذكاء الاصطناعي المواقع الإلكترونية في 2026',
      subtitle: 'مبني وفق التوثيق الرسمي لـ Google Search Console وإرشادات OpenAI SearchBot ومعايير Schema.org v26.0.',
      p1Title: '1. تسلسل بوابة الفهرسة (Indexability Gate)',
      p1Desc: 'قبل أي معالجة بالذكاء الاصطناعي، يجب أن تجتاز الصفحة البوابة التسلسلية: استجابة HTTP 200 -> سماح robots.txt -> غياب وسم noindex -> وسم الرابط الأساسي Canonical.',
      p2Title: '2. إتاحة الزحف للبوتات متعددة المستويات',
      p2Desc: 'توضح OpenAI رسمياً أن السماح لـ OAI-SearchBot في robots.txt واستثنائه من حظر جدران الحماية (Cloudflare WAF) شرط أساسي لاقتباس المحتوى في ملخصات بحث ChatGPT.',
      p3Title: '3. هيكلة الإجابات المباشرة (BLUF Architecture)',
      p3Desc: 'تعتمد نماذج الذكاء الاصطناعي على أول 200 كلمة لاستخراج الإجابات. وضع ملخص حاسم من 40-60 كلمة أسفل العنوان الرئيسي H1 مباشرة يرفع دقة الاقتباس.',
      p4Title: '4. شبكات السكيما الذكية المخصصة (Context-Aware Schema)',
      p4Desc: 'استبدال قوائم السكيما العشوائية بكود JSON-LD مخصص لنوع النشاط (SoftwareApplication للساس، Product للمتاجر، MedicalBusiness للعيادات) يربط هويتك بدقة في الرسم البياني المعرفي.',
    },
    footer: {
      brandDesc: 'SchemaCraft.AI هو المحرك العالمي المعتمد لفحص وتشخيص وتحسين قابلية ظهور المواقع في محركات البحث وأنظمة الذكاء الاصطناعي للوكالات والشركات حول العالم.',
      crawlersTitle: 'البوتات ومحركات البحث المدعومة',
      platformsTitle: 'أطر العمل البرمجية المدعومة',
      guaranteeTitle: 'ضمان استرجاع الأموال لمدة 30 يوماً',
      guaranteeDesc: 'فحص واستثمار آمن 100%. إذا لم تكن راضياً عن دقة الأدلة وأكواد الإصلاح، تواصل معنا عبر support@schemacraft-ai.site للاسترجاع الفوري.',
      supportTitle: 'الدعم الرسمي والاستفسارات المعتمدة',
      rights: '© 2026 SchemaCraft.AI • محرك الفحص الحتمي v1.0 • جميع الحقوق محفوظة.',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة والاستخدام',
      whitepaper: 'ورقة عمل بنية GEO 2026',
    },
  },
};
