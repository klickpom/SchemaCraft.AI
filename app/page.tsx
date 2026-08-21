"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Download,
  Lock,
  ExternalLink,
  Zap,
  Layers,
  CheckCircle2,
  Code2,
  Eye,
  TrendingUp,
  Bot,
  Building2,
  ShoppingBag,
  FileText,
  HelpCircle,
  MapPin,
  Terminal,
  X,
  CreditCard,
  ChevronDown,
  Smartphone,
  Monitor,
  Star,
  Globe,
  RotateCcw,
  BookOpen,
  Search,
  CheckCheck,
  Award,
  ShieldAlert,
  Flame,
} from "lucide-react";
import PayPalCheckout from "@/components/PayPalCheckout";
import { CustomSelect, CustomSelectOption } from "@/components/CustomSelect";
import { TRANSLATIONS, Language } from "@/lib/translations";

const STORAGE_KEYS = {
  FORM_DATA: "schemacraft_form_data_v1",
  SCHEMA_TYPE: "schemacraft_schema_type_v1",
  PRO_LICENSE: "schemacraft_pro_unlocked_v1",
  LANG: "schemacraft_lang",
  ACTIVE_TAB: "schemacraft_active_tab_v1",
  SERP_DEVICE: "schemacraft_serp_device_v1",
};

const DEFAULT_FORM_DATA = {
  name: "ApexFlow SaaS",
  description: "Automated real-time data sync and workflow orchestration platform for enterprise engineering teams.",
  url: "https://apexflow.io",
  price: "49.00",
  currency: "USD",
  category: "BusinessApplication",
  authorName: "Apex Labs Global",
  operatingSystem: "Web Browser, macOS, Linux, Windows",
  ratingValue: "4.9",
  ratingCount: "348",
  question: "How does automated structured data improve AI engine visibility?",
  answer: "Structured JSON-LD schema feeds deterministic entity graphs directly to LLM retrieval pipelines (RAG), lifting citation frequency in Perplexity and Google AI Overviews by up to +40%.",
  streetAddress: "500 Howard Street, Suite 400",
  city: "San Francisco",
  state: "CA",
  postalCode: "94105",
  telephone: "+1 (415) 555-0199",
  headline: "The 2026 Architectural Guide to Generative Engine Optimization",
  articleSummary: "Comprehensive benchmark analysis on how deterministic Schema.org graph entities improve retrieval-augmented generation accuracy.",
};

const PRESET_ARCHETYPES = {
  saas: {
    type: "SoftwareApplication",
    data: {
      name: "ApexFlow SaaS Engine",
      description: "Automated real-time data sync and workflow orchestration platform for high-velocity engineering teams.",
      url: "https://apexflow.io",
      price: "49.00",
      currency: "USD",
      category: "BusinessApplication",
      authorName: "Apex Labs Global",
      operatingSystem: "Web Browser, macOS, Linux, Windows",
      ratingValue: "4.9",
      ratingCount: "348",
    },
  },
  ecommerce: {
    type: "Product",
    data: {
      name: "Aura Pro Ergonomic Noise-Cancelling Headphones",
      description: "Flagship wireless studio headphones with planar magnetic drivers and 40-hour ultra-low latency playback.",
      url: "https://audiopro.store/products/aura-pro",
      price: "249.00",
      currency: "USD",
      ratingValue: "4.9",
      ratingCount: "812",
    },
  },
  faq: {
    type: "FAQPage",
    data: {
      question: "How does structured JSON-LD schema increase AI Search citations?",
      answer: "Structured JSON-LD schema feeds deterministic entity graphs directly to LLM retrieval pipelines (RAG), lifting citation frequency in Perplexity and Google AI Overviews by up to +40%.",
    },
  },
  local: {
    type: "LocalBusiness",
    data: {
      name: "Apex Dental & Wellness Clinic",
      streetAddress: "500 Howard Street, Suite 400",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      telephone: "+1 (415) 555-0199",
    },
  },
  article: {
    type: "Article",
    data: {
      headline: "The 2026 Architectural Guide to Generative Engine Optimization",
      articleSummary: "Comprehensive benchmark analysis on how deterministic Schema.org graph entities improve retrieval-augmented generation accuracy.",
      authorName: "Dr. Alexander Wright",
    },
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en");
  const [schemaType, setSchemaType] = useState<string>("SoftwareApplication");
  const [copied, setCopied] = useState<boolean>(false);
  const [isProUnlocked, setIsProUnlocked] = useState<boolean>(false);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"code" | "nextjs" | "shopify" | "serp" | "ai">("code");
  const [serpDevice, setSerpDevice] = useState<"desktop" | "mobile">("desktop");
  const [showCelebrationBanner, setShowCelebrationBanner] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const t = TRANSLATIONS[lang];

  // Hydrate all state from localStorage on client mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANG) as Language;
      if (savedLang === "ar" || savedLang === "en") {
        setLang(savedLang);
      }

      const savedType = localStorage.getItem(STORAGE_KEYS.SCHEMA_TYPE);
      if (savedType) {
        setSchemaType(savedType);
      }

      const savedForm = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      if (savedForm) {
        setFormData((prev) => ({ ...prev, ...JSON.parse(savedForm) }));
      }

      const savedPro = localStorage.getItem(STORAGE_KEYS.PRO_LICENSE);
      if (savedPro === "true") {
        setIsProUnlocked(true);
      }

      const savedTab = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) as any;
      if (savedTab) {
        setActiveTab(savedTab);
      }

      const savedDevice = localStorage.getItem(STORAGE_KEYS.SERP_DEVICE) as "desktop" | "mobile";
      if (savedDevice) {
        setSerpDevice(savedDevice);
      }
    } catch {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist Form Data
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData, isHydrated]);

  // Persist Schema Type
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEMA_TYPE, schemaType);
    } catch {
      // ignore
    }
  }, [schemaType, isHydrated]);

  const handleTabChange = (tab: "code" | "nextjs" | "shopify" | "serp" | "ai") => {
    setActiveTab(tab);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
    } catch {
      // ignore
    }
  };

  const handleDeviceChange = (device: "desktop" | "mobile") => {
    setSerpDevice(device);
    try {
      localStorage.setItem(STORAGE_KEYS.SERP_DEVICE, device);
    } catch {
      // ignore
    }
  };

  const handleLanguageToggle = () => {
    const nextLang = lang === "en" ? "ar" : "en";
    setLang(nextLang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, nextLang);
    } catch {
      // ignore
    }
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_FORM_DATA);
    setSchemaType("SoftwareApplication");
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(DEFAULT_FORM_DATA));
      localStorage.setItem(STORAGE_KEYS.SCHEMA_TYPE, "SoftwareApplication");
    } catch {
      // ignore
    }
  };

  const handleLoadPreset = (key: keyof typeof PRESET_ARCHETYPES) => {
    const preset = PRESET_ARCHETYPES[key];
    setSchemaType(preset.type);
    setFormData((prev) => ({ ...prev, ...preset.data }));
  };

  // Close modal with Escape key & lock background scrolling when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPaywall(false);
      }
    };
    if (showPaywall) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPaywall]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const schemaTypeOptions: CustomSelectOption[] = useMemo(() => {
    return [
      {
        value: "SoftwareApplication",
        label: lang === "ar" ? "SoftwareApplication (تطبيقات وساس)" : "SoftwareApplication",
        description: lang === "ar" ? "منصات البرمجيات والساس والأدوات السحابية" : "SaaS platforms, developer tools, and cloud apps",
        icon: Terminal,
        badge: lang === "ar" ? "تقييمات AI" : "AI Star Ratings",
      },
      {
        value: "Product",
        label: lang === "ar" ? "Product (منتجات ومتاجر إلكترونية)" : "Product & E-Commerce",
        description: lang === "ar" ? "السلع والمنتجات الرقمية والمادية مع السعر والمخزون" : "Physical goods, digital items, and merchant listings",
        icon: ShoppingBag,
        badge: lang === "ar" ? "السعر والمخزون" : "Price & Stock",
      },
      {
        value: "FAQPage",
        label: lang === "ar" ? "FAQPage (أسئلة شائعة منسدلة)" : "FAQPage Accordion",
        description: lang === "ar" ? "إجابات منسدلة في جوجل واقتباسات الذكاء الاصطناعي" : "Expandable Google search answers and AI citations",
        icon: HelpCircle,
        badge: lang === "ar" ? "قوائم SERP" : "SERP Dropdowns",
      },
      {
        value: "LocalBusiness",
        label: lang === "ar" ? "LocalBusiness (نشاط تجاري ومحلي)" : "LocalBusiness & Store",
        description: lang === "ar" ? "خرائط جوجل وLocal 3-Pack ورقم الهاتف والعنوان" : "Google Maps, Local 3-Pack, and phone/address NAP",
        icon: MapPin,
        badge: lang === "ar" ? "خرائط جوجل" : "Local 3-Pack",
      },
      {
        value: "Organization",
        label: lang === "ar" ? "Organization (لوحة العلامة التجارية)" : "Organization & Brand",
        description: lang === "ar" ? "لوحة المعرفة الرسمية والهوية المؤسسية" : "Google Knowledge Graph panel and corporate identity",
        icon: Building2,
        badge: lang === "ar" ? "لوحة المعرفة" : "Knowledge Panel",
      },
      {
        value: "Article",
        label: lang === "ar" ? "Article (مقالات وأخبار)" : "Article & News Editorial",
        description: lang === "ar" ? "كاروسيل Google Discover وتصدر الأخبار" : "Google Discover carousels and Top Stories indexing",
        icon: FileText,
        badge: lang === "ar" ? "Google Discover" : "Google Discover",
      },
    ];
  }, [lang]);

  const currencyOptions: CustomSelectOption[] = useMemo(() => [
    { value: "USD", label: "USD ($)", description: lang === "ar" ? "دولار أمريكي" : "US Dollar" },
    { value: "SAR", label: "SAR (﷼)", description: lang === "ar" ? "ريال سعودي" : "Saudi Riyal" },
    { value: "AED", label: "AED (د.إ)", description: lang === "ar" ? "درهم إماراتي" : "UAE Dirham" },
    { value: "EUR", label: "EUR (€)", description: lang === "ar" ? "يورو أوروبي" : "Euro" },
    { value: "GBP", label: "GBP (£)", description: lang === "ar" ? "جنيه إسترليني" : "British Pound" },
    { value: "CAD", label: "CAD ($)", description: lang === "ar" ? "دولار كندي" : "Canadian Dollar" },
  ], [lang]);

  const categoryOptions: CustomSelectOption[] = useMemo(() => [
    { value: "BusinessApplication", label: "BusinessApplication", description: lang === "ar" ? "أدوات الأعمال والشركات و B2B" : "Productivity, ERP, CRM & B2B SaaS" },
    { value: "DeveloperApplication", label: "DeveloperApplication", description: lang === "ar" ? "أدوات المطورين والـ API" : "API tools, DevOps, IDEs & SDKs" },
    { value: "UtilitiesApplication", label: "UtilitiesApplication", description: lang === "ar" ? "الأدوات والمرافق الخدمية" : "System utilities and optimization tools" },
    { value: "DesignApplication", label: "DesignApplication", description: lang === "ar" ? "أدوات التصميم والـ UI/UX" : "Creative tools, UI/UX & media editing" },
  ], [lang]);

  const generatedSchema = useMemo(() => {
    if (schemaType === "SoftwareApplication") {
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: formData.name,
        description: formData.description,
        applicationCategory: formData.category,
        operatingSystem: formData.operatingSystem,
        url: formData.url,
        offers: {
          "@type": "Offer",
          price: formData.price,
          priceCurrency: formData.currency,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: formData.ratingValue,
          reviewCount: formData.ratingCount,
          bestRating: "5",
          worstRating: "1",
        },
        author: {
          "@type": "Organization",
          name: formData.authorName,
        },
      };
    } else if (schemaType === "Product") {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: formData.name,
        description: formData.description,
        offers: {
          "@type": "Offer",
          url: formData.url,
          priceCurrency: formData.currency,
          price: formData.price,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: formData.ratingValue,
          reviewCount: formData.ratingCount,
        },
      };
    } else if (schemaType === "FAQPage") {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: formData.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: formData.answer,
            },
          },
        ],
      };
    } else if (schemaType === "LocalBusiness") {
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: formData.name,
        telephone: formData.telephone,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: formData.streetAddress,
          addressLocality: formData.city,
          addressRegion: formData.state,
          postalCode: formData.postalCode,
          addressCountry: "US",
        },
      };
    } else if (schemaType === "Organization") {
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: formData.name,
        url: formData.url,
        description: formData.description,
      };
    } else {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: formData.headline,
        description: formData.articleSummary,
        author: {
          "@type": "Person",
          name: formData.authorName,
        },
        datePublished: new Date().toISOString().split("T")[0],
      };
    }
  }, [schemaType, formData]);

  const jsonString = JSON.stringify(generatedSchema, null, 2);

  const nextJsJsxString = useMemo(() => {
    return `// Next.js 15 App Router (app/page.tsx or app/layout.tsx)
export default function Page() {
  const jsonLd = ${JSON.stringify(generatedSchema, null, 2)};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Your page content */}
    </>
  );
}`;
  }, [generatedSchema]);

  const shopifyLiquidString = useMemo(() => {
    return `{% comment %}
  SchemaCraft AI - Shopify JSON-LD Snippet
  Place in snippets/schema-craft.liquid and include in theme.liquid before </head>
{% endcomment %}
<script type="application/ld+json">
${JSON.stringify(generatedSchema, null, 2)}
</script>`;
  }, [generatedSchema]);

  const handleCopy = () => {
    const textToCopy =
      activeTab === "nextjs"
        ? nextJsJsxString
        : activeTab === "shopify"
        ? shopifyLiquidString
        : jsonString;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${(formData.name || formData.headline).toLowerCase().replace(/\s+/g, "-")}-schema.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBundle = () => {
    if (!isProUnlocked) {
      setShowPaywall(true);
      return;
    }
    triggerDownload();
  };

  const handlePayPalSuccess = () => {
    setIsProUnlocked(true);
    setShowPaywall(false);
    setShowCelebrationBanner(true);
    try {
      localStorage.setItem(STORAGE_KEYS.PRO_LICENSE, "true");
    } catch {
      // ignore
    }
    triggerDownload();
    setTimeout(() => setShowCelebrationBanner(false), 6000);
  };

  const faqs = [
    {
      q: lang === "ar" ? "كيف تُحسن بيانات Schema.org JSON-LD تصدر محركات الذكاء الاصطناعي (GEO)؟" : "How does Schema.org JSON-LD improve Generative Engine Optimization (GEO)?",
      a: lang === "ar" ? "تعتمد محركات البحث التوليدي (مثل Perplexity و Google AI Overviews و ChatGPT Search) على شبكات المعرفة الحتمية (Knowledge Graphs). كود الـ JSON-LD يوفر بيانات مهيكلة وموثقة بنسبة 100% تفهمها خوارزميات RAG مباشرة دون تشويش أو تخمين، مما يرفع احتمالية الاقتباس المباشر بنسبة تتجاوز +40%." : "Generative search engines (Perplexity, Google AI Overviews, ChatGPT Search) rely on deterministic knowledge graphs. JSON-LD structured data feeds exact entity properties directly to Retrieval-Augmented Generation (RAG) pipelines, removing ambiguity and lifting AI citation rates by up to +40%.",
    },
    {
      q: lang === "ar" ? "ما الفرق بين السيو التقليدي (Traditional SEO) وتحسين محركات التوليد (GEO)؟" : "What is the difference between Traditional SEO and GEO (Generative Engine Optimization)?",
      a: lang === "ar" ? "السيو التقليدي يركز على الكلمات المفتاحية والروابط الخلفية للحصول على نقرة كلاسيكية في محرك البحث. بينما GEO يركز على تأصيل الكيانات الرقمية (Entity Grounding) وفقرات إجابة BLUF المباشرة ليتم تلخيص واقتباس علامتك التجارية في نتائج الذكاء الاصطناعي الفورية." : "Traditional SEO optimizes for keyword density and backlink signals to earn standard blue link clicks. GEO optimizes for machine-readable entity grounding and BLUF answer blocks so your brand is directly synthesized and cited inside AI answer engines.",
    },
    {
      q: lang === "ar" ? "هل هناك ضمان استرجاع أموال إذا لم أكن راضياً عن الخدمة؟" : "Is there a money-back guarantee if I am not satisfied?",
      a: lang === "ar" ? "نعم بالتأكيد! نقدم ضمان استرجاع أموال كامل بنسبة 100% لمدة 30 يوماً بدون أي أسئلة. إذا لم تكن راضياً تماماً عن الأداة يمكنك استرداد أموالك فوراً." : "Yes, absolutely! We offer an unconditional 30-day 100% money-back guarantee. If SchemaCraft AI doesn't save you hours of work and boost your rich snippet coverage, we will issue a full refund immediately.",
    },
  ];

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white font-sans"
    >
      {/* Instant Pro Success Celebration Toast */}
      {showCelebrationBanner && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 w-[92%] sm:w-auto max-w-md">
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 p-4 shadow-2xl backdrop-blur-xl text-white text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <p className="text-emerald-200 font-bold">{t.toast.title}</p>
              <p className="text-[11px] text-emerald-300/80 font-normal mt-0.5">
                {t.toast.desc}
              </p>
            </div>
            <button
              onClick={() => setShowCelebrationBanner(false)}
              className="text-emerald-400/70 hover:text-emerald-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-10 sm:space-y-12">
        
        {/* Navigation Bar */}
        <header className="flex flex-wrap items-center justify-between border-b border-white/[0.08] pb-5 gap-3">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                {t.nav.title}
                <span className="text-indigo-400">.AI</span>
              </span>
              <span className="ml-2 rtl:mr-2 text-[10px] uppercase px-2 py-0.5 rounded-full border border-indigo-500/30 text-indigo-300 bg-indigo-500/10 font-mono tracking-wider">
                {t.nav.engineVersion}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            {/* Reset to Defaults Button */}
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-xs text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
              title={lang === "ar" ? "استعادة القيم الافتراضية" : "Reset to defaults"}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === "ar" ? "استعادة الافتراضي" : "Reset"}</span>
            </button>

            {/* Language Switcher Toggle */}
            <button
              type="button"
              onClick={handleLanguageToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white transition active:scale-95 cursor-pointer"
              title="Switch language (EN / العربية)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === "en" ? "العربية" : "English"}</span>
            </button>

            {/* Pro Unlock Action Button */}
            <button
              type="button"
              onClick={() => setShowPaywall(true)}
              className={`text-xs transition px-3.5 sm:px-4 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                isProUnlocked
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "text-white border-indigo-500/40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 animate-pulse"
              }`}
            >
              {isProUnlocked ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.nav.proActive}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{t.nav.unlockPro}</span>
                </>
              )}
            </button>
            
            <div className="hidden md:flex text-xs text-emerald-400 font-mono items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.nav.astActive}
            </div>
          </div>
        </header>

        {/* Hero & BLUF Technical Optimization Statement */}
        <section className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>{t.bluf.pill}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {t.bluf.h1Line1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300">
              {t.bluf.h1Line2}
            </span>
          </h1>

          {/* Quick Preset Chips for 0-Second Instant Gratification */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-semibold">{t.presets.label}</span>
            <button
              type="button"
              onClick={() => handleLoadPreset("saas")}
              className="rounded-lg bg-white/[0.04] hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 px-2.5 py-1 text-slate-200 hover:text-white transition font-medium cursor-pointer"
            >
              {t.presets.saas}
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("ecommerce")}
              className="rounded-lg bg-white/[0.04] hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 px-2.5 py-1 text-slate-200 hover:text-white transition font-medium cursor-pointer"
            >
              {t.presets.ecommerce}
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("faq")}
              className="rounded-lg bg-white/[0.04] hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 px-2.5 py-1 text-slate-200 hover:text-white transition font-medium cursor-pointer"
            >
              {t.presets.faq}
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("local")}
              className="rounded-lg bg-white/[0.04] hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 px-2.5 py-1 text-slate-200 hover:text-white transition font-medium cursor-pointer"
            >
              {t.presets.local}
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("article")}
              className="rounded-lg bg-white/[0.04] hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 px-2.5 py-1 text-slate-200 hover:text-white transition font-medium cursor-pointer"
            >
              {t.presets.article}
            </button>
          </div>

          {/* BLUF Definition Paragraph */}
          <div className="rounded-2xl border border-white/[0.12] bg-[#101015]/90 p-4 sm:p-5 text-left rtl:text-right text-xs sm:text-sm text-slate-200 leading-relaxed shadow-xl">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.bluf.blufTag}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t.bluf.blufText}</p>
          </div>
        </section>

        {/* Dual-Panel Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Dynamic Form Builder with Luxury Custom Dropdown */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div className="rounded-2xl border border-white/[0.1] bg-[#121218]/90 backdrop-blur-xl p-4 sm:p-6 shadow-2xl space-y-4 relative">
              
              {/* Luxury Custom Schema Type Select */}
              <div className="relative z-40">
                <CustomSelect
                  label={t.builder.selectSchemaType}
                  options={schemaTypeOptions}
                  value={schemaType}
                  onChange={(val) => setSchemaType(val)}
                />
              </div>

              {/* Dynamic Form Fields based on Type */}
              <div className="space-y-3.5 text-xs pt-1">
                {schemaType === "FAQPage" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-semibold">{t.builder.targetQuery}</label>
                      <input
                        type="text"
                        value={formData.question}
                        onChange={(e) => handleInputChange("question", e.target.value)}
                        className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-semibold">{t.builder.directAnswer}</label>
                      <textarea
                        rows={4}
                        value={formData.answer}
                        onChange={(e) => handleInputChange("answer", e.target.value)}
                        className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none transition shadow-inner"
                      />
                    </div>
                  </>
                ) : schemaType === "LocalBusiness" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-semibold">{t.builder.businessName}</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-semibold">{t.builder.streetAddress}</label>
                      <input
                        type="text"
                        value={formData.streetAddress}
                        onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                        className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1.5">
                        <label className="block text-slate-300 font-semibold">{t.builder.city}</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-slate-300 font-semibold">{t.builder.telephone}</label>
                        <input
                          type="text"
                          value={formData.telephone}
                          onChange={(e) => handleInputChange("telephone", e.target.value)}
                          className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                        />
                      </div>
                    </div>
                  </>
                ) : schemaType === "Article" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-semibold">{t.builder.articleHeadline}</label>
                      <input
                        type="text"
                        value={formData.headline}
                        onChange={(e) => handleInputChange("headline", e.target.value)}
                        className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-semibold">{t.builder.articleSummary}</label>
                      <textarea
                        rows={3}
                        value={formData.articleSummary}
                        onChange={(e) => handleInputChange("articleSummary", e.target.value)}
                        className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none transition shadow-inner"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-semibold">{t.builder.authorName}</label>
                      <input
                        type="text"
                        value={formData.authorName}
                        onChange={(e) => handleInputChange("authorName", e.target.value)}
                        className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-semibold">{t.builder.entityName}</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                    </div>

                    {schemaType === "SoftwareApplication" && (
                      <div className="relative z-30">
                        <CustomSelect
                          label={t.builder.appCategory}
                          options={categoryOptions}
                          value={formData.category}
                          onChange={(val) => handleInputChange("category", val)}
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-semibold">{t.builder.entityProposition}</label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                      />
                    </div>

                    {/* Price & Currency */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-30">
                      <div className="space-y-1.5">
                        <label className="block text-slate-300 font-semibold">{t.builder.price}</label>
                        <input
                          type="text"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          className="w-full bg-[#181822] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                        />
                      </div>
                      <div className="relative z-30">
                        <CustomSelect
                          label={t.builder.currency}
                          options={currencyOptions}
                          value={formData.currency}
                          onChange={(val) => handleInputChange("currency", val)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-4 pt-4 border-t border-white/[0.1] flex flex-wrap items-center justify-between gap-3 relative z-10">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.builder.astValid}</span>
                </span>

                <button
                  type="button"
                  onClick={handleDownloadBundle}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/25 active:scale-95 cursor-pointer"
                >
                  {isProUnlocked ? <Download className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{t.builder.downloadBundle}</span>
                </button>
              </div>
            </div>

            {/* Performance Benchmark Widget */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-4 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.benchmarks.title}
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white/[0.025] border border-white/10">
                  <div className="text-base font-bold text-indigo-400">+40%</div>
                  <div className="text-[10px] text-slate-300 font-medium">{t.benchmarks.citationRate}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.025] border border-white/10">
                  <div className="text-base font-bold text-cyan-400">0ms</div>
                  <div className="text-[10px] text-slate-300 font-medium">{t.benchmarks.parsingLatency}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.025] border border-white/10">
                  <div className="text-base font-bold text-emerald-400">100%</div>
                  <div className="text-[10px] text-slate-300 font-medium">{t.benchmarks.schemaValid}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Format Code & Simulation Viewer */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="rounded-2xl border border-white/[0.1] bg-[#0d0d10] p-4 sm:p-5 shadow-2xl flex flex-col h-full">
              
              <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] pb-3 mb-4 gap-2">
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 rtl:space-x-reverse">
                  <button
                    type="button"
                    onClick={() => handleTabChange("code")}
                    className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "code" ? "bg-white/15 text-white shadow" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{t.preview.tabCode}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange("nextjs")}
                    className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "nextjs" ? "bg-white/15 text-white shadow" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.preview.tabNextjs}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange("shopify")}
                    className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "shopify" ? "bg-white/15 text-white shadow" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.preview.tabShopify}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange("serp")}
                    className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "serp" ? "bg-white/15 text-white shadow" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t.preview.tabSerp}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange("ai")}
                    className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "ai" ? "bg-white/15 text-white shadow" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.preview.tabAi}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/15 text-white border border-white/15 px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.preview.copied : t.preview.copyCode}</span>
                </button>
              </div>

              {activeTab === "code" ? (
                <pre
                  dir="ltr"
                  className="flex-1 bg-[#060608] p-4 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-white/[0.08] leading-relaxed max-h-[380px] sm:max-h-[440px] text-left shadow-inner"
                >
                  <code>{jsonString}</code>
                </pre>
              ) : activeTab === "nextjs" ? (
                <pre
                  dir="ltr"
                  className="flex-1 bg-[#060608] p-4 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto border border-white/[0.08] leading-relaxed max-h-[380px] sm:max-h-[440px] text-left shadow-inner"
                >
                  <code>{nextJsJsxString}</code>
                </pre>
              ) : activeTab === "shopify" ? (
                <pre
                  dir="ltr"
                  className="flex-1 bg-[#060608] p-4 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto border border-white/[0.08] leading-relaxed max-h-[380px] sm:max-h-[440px] text-left shadow-inner"
                >
                  <code>{shopifyLiquidString}</code>
                </pre>
              ) : activeTab === "serp" ? (
                /* Google SERP Preview with Mobile / Desktop Switcher */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Google Rich Snippet Simulation
                    </span>
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/50 border border-white/15">
                      <button
                        type="button"
                        onClick={() => handleDeviceChange("desktop")}
                        className={`p-1 rounded cursor-pointer ${serpDevice === "desktop" ? "bg-white/15 text-cyan-300" : "text-slate-400"}`}
                        title="Desktop view"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeviceChange("mobile")}
                        className={`p-1 rounded cursor-pointer ${serpDevice === "mobile" ? "bg-white/15 text-cyan-300" : "text-slate-400"}`}
                        title="Mobile view"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl bg-[#202124] border border-zinc-700 text-xs text-[#bdc1c6] space-y-2.5 shadow-xl ${serpDevice === "mobile" ? "max-w-xs mx-auto" : "w-full"}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[9px] font-bold text-white">
                        SC
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-[11px] text-[#e8eaed] font-medium">{formData.authorName || formData.name}</span>
                        <span className="text-[10px] text-[#9aa0a6] truncate">{formData.url} › {schemaType.toLowerCase()}</span>
                      </div>
                    </div>

                    <h3 className="text-[#8ab4f8] text-[15px] font-medium leading-snug hover:underline cursor-pointer">
                      {formData.name || formData.headline} - {t.preview.serpTitle}
                    </h3>

                    {/* Rich review stars & price badge */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#9aa0a6]">
                      <div className="flex items-center gap-1 text-[#fbbc04]">
                        <span className="font-semibold text-[#e8eaed]">4.9</span>
                        <div className="flex text-[#fbbc04]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-[#fbbc04] text-[#fbbc04]" />
                          ))}
                        </div>
                        <span>(348)</span>
                      </div>
                      {formData.price && (
                        <>
                          <span className="text-zinc-500">•</span>
                          <span className="font-semibold text-[#e8eaed]">{formData.currency === "USD" ? "$" : formData.currency} {formData.price}</span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-emerald-400 font-medium">{t.preview.inStock}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-3">
                      {formData.description || formData.articleSummary || formData.answer}
                    </p>

                    {schemaType === "FAQPage" && (
                      <div className="pt-2 border-t border-zinc-700/60 space-y-1.5">
                        <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-2.5 text-xs">
                          <span className="font-medium text-[#e8eaed] block">{formData.question}</span>
                          <p className="text-[11px] text-[#bdc1c6] mt-1">{formData.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Perplexity & ChatGPT AI Overview Card */
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.preview.aiTitle}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-indigo-300 font-bold">{formData.name || formData.headline}</span>
                      <span className="text-[10px] text-cyan-300 font-mono font-semibold">{t.preview.llmParseable}</span>
                    </div>

                    <p className="text-slate-200 text-xs leading-relaxed">
                      {formData.description || formData.articleSummary || formData.answer}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono pt-2 border-t border-white/10">
                      <div>Entity: Schema.org/{schemaType}</div>
                      <div>Status: {t.preview.entityStatus}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Proof & Developer Testimonials */}
        <section className="border-t border-white/[0.1] pt-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>{t.testimonials.title}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {lang === "ar" ? "ماذا يقول المهندسون وخبراء النمو عن سكيما كرافت" : "Engineered for Conversion & Citation Impact"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#111116] p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  {t.testimonials.t1Metric}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{t.testimonials.t1Text}"
              </p>
              <div className="pt-2 border-t border-white/5">
                <div className="text-xs font-bold text-white">{t.testimonials.t1Name}</div>
                <div className="text-[10px] text-slate-400">{t.testimonials.t1Role}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111116] p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                  {t.testimonials.t2Metric}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{t.testimonials.t2Text}"
              </p>
              <div className="pt-2 border-t border-white/5">
                <div className="text-xs font-bold text-white">{t.testimonials.t2Name}</div>
                <div className="text-[10px] text-slate-400">{t.testimonials.t2Role}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111116] p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="rounded-md bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  {t.testimonials.t3Metric}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{t.testimonials.t3Text}"
              </p>
              <div className="pt-2 border-t border-white/5">
                <div className="text-xs font-bold text-white">{t.testimonials.t3Name}</div>
                <div className="text-[10px] text-slate-400">{t.testimonials.t3Role}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Architectural Comparison Matrix (GEO 2026) */}
        <section className="border-t border-white/[0.1] pt-10">
          <div className="text-center max-w-2xl mx-auto mb-6 space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t.matrix.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.matrix.subtitle}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-[#101015] shadow-2xl">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-white/[0.05] text-slate-200 font-bold border-b border-white/10">
                <tr>
                  <th className="p-4">{t.matrix.colFeature}</th>
                  <th className="p-4">{t.matrix.colTrad}</th>
                  <th className="p-4">{t.matrix.colGeo}</th>
                  <th className="p-4 text-emerald-400">{t.matrix.colImpact}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                <tr>
                  <td className="p-4 font-semibold text-white">{t.matrix.row1Title}</td>
                  <td className="p-4">{t.matrix.row1Trad}</td>
                  <td className="p-4 text-indigo-300 font-medium">{t.matrix.row1Geo}</td>
                  <td className="p-4 text-emerald-400 font-bold">{t.matrix.row1Impact}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">{t.matrix.row2Title}</td>
                  <td className="p-4">{t.matrix.row2Trad}</td>
                  <td className="p-4 text-indigo-300 font-medium">{t.matrix.row2Geo}</td>
                  <td className="p-4 text-emerald-400 font-bold">{t.matrix.row2Impact}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">{t.matrix.row3Title}</td>
                  <td className="p-4">{t.matrix.row3Trad}</td>
                  <td className="p-4 text-indigo-300 font-medium">{t.matrix.row3Geo}</td>
                  <td className="p-4 text-emerald-400 font-bold">{t.matrix.row3Impact}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Master AEO & Generative AI FAQ Accordion */}
        <section className="border-t border-white/[0.1] pt-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {lang === "ar" ? "الأسئلة الشائعة وتصدر محركات الذكاء الاصطناعي (AEO/GEO)" : "Frequently Asked Questions (AEO & GEO Knowledge Base)"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === "ar" ? "كل ما تحتاج معرفته عن معايير السكيما الحديثة وتصدر Perplexity و Google AI Overviews." : "Everything you need to know about modern Schema.org standards and LLM search ingestion."}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#121218] overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-xs sm:text-sm font-bold text-white text-left rtl:text-right hover:bg-white/[0.03] transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 ml-2 rtl:mr-2 rtl:ml-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-cyan-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 bg-white/[0.01]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Modal: High-Converting PayPal Checkout */}
        {showPaywall && (
          <div
            onClick={() => setShowPaywall(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl border border-white/20 bg-[#111116] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
            >
              {/* Modal Fixed Top Header */}
              <div className="bg-[#16161f] px-5 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold mb-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{t.modal.launchDeal}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">{t.modal.title}</h3>
                  <p className="text-[11px] text-slate-300">{t.modal.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaywall(false)}
                  className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                  title={t.modal.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.modal.feat1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.modal.feat2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.modal.feat3}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.modal.feat4}</span>
                  </div>
                </div>

                {/* Price Anchor Card */}
                <div className="rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-cyan-950/50 border border-indigo-500/30 p-3.5 text-center shadow-inner">
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="text-sm line-through text-slate-500 font-semibold">{t.modal.originalPrice}</span>
                    <span className="text-3xl font-black text-white">{t.modal.currentPrice}</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">{t.modal.oneTimeFee}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{t.modal.priceNote}</p>
                </div>

                {/* 100% Money-Back Guarantee Seal */}
                <div className="flex items-center justify-center gap-2 rounded-lg bg-white/[0.02] border border-white/5 p-2 text-[11px] text-slate-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t.modal.guarantee}</span>
                </div>

                {/* PayPal Smart Buttons Container */}
                <div className="pt-1">
                  <PayPalCheckout
                    price="4.99"
                    onSuccess={handlePayPalSuccess}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-slate-400 space-y-2.5 bg-[#060608]">
        <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t.footer.guaranteeBadge}</span>
        </div>
        <p className="text-slate-300 font-medium">{t.footer.text1}</p>
        <p className="text-[11px] text-slate-500">{t.footer.text2}</p>
      </footer>
    </div>
  );
}
