export type Language = 'en' | 'ar';

export interface Translations {
  nav: {
    brandTitle: string;
    engineTag: string;
    ctaUnlock: string;
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
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      brandTitle: 'SchemaCraft',
      engineTag: 'Audit Engine v1.0',
      ctaUnlock: 'Fix My Website — $9',
      ctaUnlocked: 'Full Audit Unlocked',
      shareReport: 'Share Snapshot',
      reportShared: 'Link Copied!',
      langEn: 'English',
      langAr: 'العربية',
    },
    hero: {
      badge: 'Fast Deterministic SEO + GEO + AEO Diagnostic',
      h1: 'See How Search Engines and AI Understand Your Website',
      subtitle: 'Run a free SEO + AI Search audit and uncover the technical, content, entity, and crawlability issues limiting your visibility.',
      inputPlaceholder: 'Enter your website URL (e.g. https://yourcompany.com)...',
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
    },
  },
  ar: {
    nav: {
      brandTitle: 'SchemaCraft',
      engineTag: 'محرك الفحص v1.0',
      ctaUnlock: 'أصلح موقعي الآن — $9',
      ctaUnlocked: 'تم فتح الفحص بالكامل',
      shareReport: 'مشاركة التقرير',
      reportShared: 'تم نسخ الرابط!',
      langEn: 'English',
      langAr: 'العربية',
    },
    hero: {
      badge: 'فحص تشخيصي حتمي شامل لـ SEO والذكاء الاصطناعي',
      h1: 'اكتشف كيف تفهم محركات البحث والذكاء الاصطناعي موقعك',
      subtitle: 'قم بتشغيل فحص مجاني شامل واكتشف المشاكل التقنية ومشاكل المحتوى والزحف التي تحد من ظهور وفهم موقعك.',
      inputPlaceholder: 'أدخل رابط موقعك (مثال: https://yourcompany.com)...',
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
    },
  },
};
