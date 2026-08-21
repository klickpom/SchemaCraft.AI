/**
 * SchemaCraft AI - Multi-Platform Fix Generator
 * Produces exact, drop-in code fixes and file placement instructions for WordPress, Next.js 15, and Shopify.
 */

import { AuditIssue } from './auditEngine';

export interface PlatformFix {
  platform: 'nextjs' | 'wordpress' | 'shopify';
  platformName: string;
  fileLocation: string;
  fileLocationAr: string;
  codeSnippet: string;
  installationInstructions: string;
  installationInstructionsAr: string;
}

export function generatePlatformFix(issue: AuditIssue, targetUrl: string, siteType: string): PlatformFix[] {
  const domain = targetUrl ? targetUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : 'example.com';
  const brandName = domain.split('.')[0].toUpperCase();

  const fixes: PlatformFix[] = [];

  switch (issue.fixCategory) {
    case 'robots':
      // 1. Next.js 15 App Router robots.ts
      fixes.push({
        platform: 'nextjs',
        platformName: 'Next.js 15 (App Router)',
        fileLocation: 'app/robots.ts',
        fileLocationAr: 'ملف app/robots.ts في مشروع Next.js',
        codeSnippet: `import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
    ],
    sitemap: 'https://${domain}/sitemap.xml',
  };
}`,
        installationInstructions: 'Save this file as app/robots.ts. Next.js will automatically compile and serve a standard /robots.txt endpoint allowing OAI-SearchBot.',
        installationInstructionsAr: 'احفظ هذا الكود داخل ملف app/robots.ts وسيقوم Next.js تلقائياً بإنشاء ملف robots.txt مخصص يسمح لبوتات البحث.',
      });

      // 2. WordPress robots.txt filter
      fixes.push({
        platform: 'wordpress',
        platformName: 'WordPress / WooCommerce',
        fileLocation: 'functions.php (Child Theme) or Code Snippets',
        fileLocationAr: 'ملف functions.php في القالب أو عبر إضافة Code Snippets',
        codeSnippet: `<?php
/**
 * Allow OAI-SearchBot and PerplexityBot in WordPress Virtual robots.txt
 */
add_filter('robots_txt', function($output, $public) {
    if ('1' == $public) {
        $output .= "\\nUser-agent: OAI-SearchBot\\nAllow: /\\n";
        $output .= "\\nUser-agent: PerplexityBot\\nAllow: /\\n";
        $output .= "\\nSitemap: " . home_url('/sitemap.xml') . "\\n";
    }
    return $output;
}, 10, 2);`,
        installationInstructions: 'Paste this snippet into your active theme functions.php or add as a PHP snippet in the free "Code Snippets" plugin.',
        installationInstructionsAr: 'انسخ هذا الكود والصقه في نهاية ملف functions.php في قالب ووردبريس أو عبر إضافة Code Snippets.',
      });

      // 3. Shopify robots.txt.liquid
      fixes.push({
        platform: 'shopify',
        platformName: 'Shopify Store',
        fileLocation: 'templates/robots.txt.liquid',
        fileLocationAr: 'ملف templates/robots.txt.liquid في محرر القالب',
        codeSnippet: `{%- comment -%}
  Shopify robots.txt customization allowing AI Search discovery
{%- endcomment -%}
{{ content_for_header }}

User-agent: *
Disallow: /cart
Disallow: /checkout
Disallow: /account
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: {{ 'sitemap.xml' | full_url }}`,
        installationInstructions: 'Go to Shopify Admin > Online Store > Themes > Edit code > Templates > Add a new template > robots.txt.liquid.',
        installationInstructionsAr: 'في لوحة تحكم شوبيفاي > المتجر الإلكتروني > القوالب > تعديل الكود > أضف ملف robots.txt.liquid جديد وضع الكود.',
      });
      break;

    case 'schema':
      let schemaJson: Record<string, any>;

      if (siteType === 'ecommerce') {
        schemaJson = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": `${brandName} Flagship Product`,
          "image": `https://${domain}/product.jpg`,
          "description": `High quality products by ${brandName}`,
          "brand": {
            "@type": "Brand",
            "name": brandName
          },
          "offers": {
            "@type": "Offer",
            "url": `https://${domain}/product`,
            "priceCurrency": "USD",
            "price": "29.99",
            "availability": "https://schema.org/InStock"
          }
        };
      } else if (siteType === 'clinic') {
        schemaJson = {
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": `${brandName} Medical Clinic`,
          "url": `https://${domain}`,
          "image": `https://${domain}/clinic.jpg`,
          "telephone": "+1-800-555-0199",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Health Ave",
            "addressLocality": "Medical City",
            "addressCountry": "US"
          },
          "medicalSpecialty": "PrimaryCare"
        };
      } else if (siteType === 'saas') {
        schemaJson = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": brandName,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "All Modern Web Browsers",
          "url": `https://${domain}`,
          "offers": {
            "@type": "Offer",
            "price": "9.00",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Organization",
            "name": `${brandName} Global Inc.`,
            "url": `https://${domain}`
          }
        };
      } else {
        schemaJson = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": brandName,
          "url": `https://${domain}`,
          "logo": `https://${domain}/icon.png`
        };
      }

      const jsonStr = JSON.stringify(schemaJson, null, 2);

      // Next.js 15 Component
      fixes.push({
        platform: 'nextjs',
        platformName: 'Next.js 15 (React 19)',
        fileLocation: 'components/SchemaJsonLd.tsx',
        fileLocationAr: 'ملف components/SchemaJsonLd.tsx في Next.js',
        codeSnippet: `import React from 'react';

export function SchemaJsonLd() {
  const structuredData = ${jsonStr};

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}`,
        installationInstructions: 'Save this component and render <SchemaJsonLd /> inside your app/layout.tsx within the <body> tag.',
        installationInstructionsAr: 'احفظ المكون واستدعه داخل ملف app/layout.tsx ليتم تضمينه في جميع صفحات الموقع.',
      });

      // WordPress
      fixes.push({
        platform: 'wordpress',
        platformName: 'WordPress',
        fileLocation: 'functions.php',
        fileLocationAr: 'ملف functions.php في ووردبريس',
        codeSnippet: `<?php
add_action('wp_head', function() {
    ?>
    <script type="application/ld+json">
    ${jsonStr}
    </script>
    <?php
}, 1);`,
        installationInstructions: 'Paste into functions.php. The schema will be automatically injected into your HTML <head>.',
        installationInstructionsAr: 'الصق الكود في ملف functions.php ليتم حقن السكيما مباشرة في ترويسة الموقع.',
      });

      // Shopify
      fixes.push({
        platform: 'shopify',
        platformName: 'Shopify Store',
        fileLocation: 'snippets/structured-data-schema.liquid',
        fileLocationAr: 'ملف snippets/structured-data-schema.liquid في شوبيفاي',
        codeSnippet: `<script type="application/ld+json">
${jsonStr}
</script>`,
        installationInstructions: 'Create snippet "snippets/structured-data-schema.liquid" and add {% render "structured-data-schema" %} before </head> in theme.liquid.',
        installationInstructionsAr: 'أنشئ ملف snippet جديد باسم structured-data-schema واستدعه في theme.liquid قبل إغلاق وسم </head>.',
      });
      break;

    case 'content':
      fixes.push({
        platform: 'nextjs',
        platformName: 'HTML / Next.js Component',
        fileLocation: 'components/HeroSection.tsx (Direct BLUF Block)',
        fileLocationAr: 'مكون الهيرو في الصفحة الرئيسية',
        codeSnippet: `<!-- Add BLUF Answer Block Directly Below H1 -->
<h1 className="text-4xl font-extrabold text-white">
  [Your Primary Headline Here]
</h1>

<!-- Definitive 40-60 Word Direct Answer Paragraph -->
<div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-slate-200 leading-relaxed">
  <p className="font-semibold text-cyan-300 mb-1">Direct Summary:</p>
  <p>
    [${brandName}] provides an authoritative [core service/product] designed to [primary benefit].
    Engineered for [target audience], it delivers [key outcome] with verified [primary proof point].
  </p>
</div>`,
        installationInstructions: 'Insert this direct answer summary block immediately following your main <h1> tag to feed LLM extraction algorithms.',
        installationInstructionsAr: 'أضف هذا الملخص المباشر أسفل العنوان الرئيسي H1 مباشرة لتسهيل استخراج الإجابات بواسطة الذكاء الاصطناعي.',
      });

      fixes.push({
        platform: 'wordpress',
        platformName: 'WordPress Block / Elementor',
        fileLocation: 'Homepage Top Text Block',
        fileLocationAr: 'كتلة النص الأولى في الصفحة الرئيسية في ووردبريس',
        codeSnippet: `<div class="bluf-answer-card" style="padding: 16px; border-radius: 12px; background: rgba(0,0,0,0.04); border-left: 4px solid #4f46e5; margin: 16px 0;">
  <strong>Direct Summary:</strong>
  <p style="margin-top: 6px; line-height: 1.6;">
    [${brandName}] provides specialized [primary service] in [target region]. We help [target clients] achieve [primary result] through [core mechanism].
  </p>
</div>`,
        installationInstructions: 'Add as a Custom HTML block right below your hero heading in Gutenberg, Elementor, or Divi.',
        installationInstructionsAr: 'أضف هذا البلوك كـ HTML مخصص أسفل عنوان الصفحة الرئيسي في محرر ووردبريس.',
      });

      fixes.push({
        platform: 'shopify',
        platformName: 'Shopify Theme Customizer',
        fileLocation: 'sections/hero-banner.liquid',
        fileLocationAr: 'قسم البانر الرئيسي في قالب شوبيفاي',
        codeSnippet: `<div class="hero-direct-summary" style="margin: 12px 0; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
  <p style="font-size: 14px; color: #334155; line-height: 1.5;">
    {{ section.settings.direct_summary | default: '${brandName} handcrafted products are designed for durability, premium comfort, and everyday utility.' }}
  </p>
</div>`,
        installationInstructions: 'Add this direct answer text block under the main section title in your hero banner section.',
        installationInstructionsAr: 'أضف هذا البلوك النصي أسفل العنوان في قسم الهيرو المخصص لمتجرك.',
      });
      break;

    case 'sitemap':
      // 1. Next.js Sitemap
      fixes.push({
        platform: 'nextjs',
        platformName: 'Next.js 15 (App Router)',
        fileLocation: 'app/sitemap.ts',
        fileLocationAr: 'ملف app/sitemap.ts في مشروع Next.js',
        codeSnippet: `import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://${domain}',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://${domain}/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://${domain}/products',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}`,
        installationInstructions: 'Create app/sitemap.ts to automatically generate an XML sitemap at /sitemap.xml with proper cache headers.',
        installationInstructionsAr: 'أنشئ ملف app/sitemap.ts لإنشاء خريطة موقع sitemap.xml تلقائياً مع ترويسات التخزين المناسبة.',
      });

      // 2. WordPress Sitemap
      fixes.push({
        platform: 'wordpress',
        platformName: 'WordPress / WooCommerce',
        fileLocation: 'functions.php (Child Theme) or SEO Plugin',
        fileLocationAr: 'ملف functions.php أو عبر إضافات سيو مثل Yoast / RankMath',
        codeSnippet: `<?php
/**
 * Ensure native WordPress XML Sitemap is enabled and add custom entries if needed
 */
add_filter('wp_sitemaps_enabled', '__return_true');

// If using Yoast SEO or Rank Math, ensure XML Sitemaps are active in plugin settings:
// - Rank Math: Dashboard > General Settings > XML Sitemap -> ON
// - Yoast SEO: Settings > Site features > XML sitemaps -> ON
// Sitemap URL: https://${domain}/sitemap_index.xml (or https://${domain}/wp-sitemap.xml)`,
        installationInstructions: 'WordPress 5.5+ includes core XML sitemaps at /wp-sitemap.xml. If using Yoast or Rank Math, enable the Sitemap feature in plugin settings and verify /sitemap_index.xml.',
        installationInstructionsAr: 'يتضمن ووردبريس 5.5+ خريطة موقع افتراضية على wp-sitemap.xml. إذا كنت تستخدم Yoast أو Rank Math، فعّل ميزة الخريطة في الإعدادات وتأكد من رابط sitemap_index.xml.',
      });

      // 3. Shopify Sitemap
      fixes.push({
        platform: 'shopify',
        platformName: 'Shopify Store',
        fileLocation: 'Shopify Admin / Google Search Console',
        fileLocationAr: 'لوحة تحكم شوبيفاي / Google Search Console',
        codeSnippet: `<!-- Shopify automatically generates and updates sitemap.xml at your root domain -->
<!-- Primary Sitemap URL: https://${domain}/sitemap.xml -->

<!-- Verification Steps: -->
<!-- 1. Open https://${domain}/sitemap.xml in browser to verify availability -->
<!-- 2. Submit https://${domain}/sitemap.xml in Google Search Console under Sitemaps -->
<!-- 3. Verify that products, collections, pages, and blogs are properly listed -->`,
        installationInstructions: `Shopify generates your sitemap automatically at https://${domain}/sitemap.xml. Verify it in your browser and submit the URL to Google Search Console and Bing Webmaster Tools.`,
        installationInstructionsAr: `يقوم شوبيفاي بتوليد خريطة الموقع تلقائياً على https://${domain}/sitemap.xml. تأكد من فتح الرابط ثم أرسله إلى أدوات مشرفي المواقع Google Search Console.`,
      });
      break;

    case 'headers':
      // 1. Next.js Headers Configuration
      fixes.push({
        platform: 'nextjs',
        platformName: 'Next.js 15 (next.config.js)',
        fileLocation: 'next.config.js',
        fileLocationAr: 'ملف next.config.js في جذر المشروع',
        codeSnippet: `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;`,
        installationInstructions: 'Add this headers configuration to your next.config.js to ensure crawlers and AI bots are not blocked by invalid response headers.',
        installationInstructionsAr: 'أضف تكوين الترويسات هذا إلى next.config.js للتأكد من عدم حظر روبوتات البحث والذكاء الاصطناعي بواسطة ترويسات استجابة غير صحيحة.',
      });

      // 2. WordPress WAF / .htaccess Safelist
      fixes.push({
        platform: 'wordpress',
        platformName: 'WordPress / Web Server (.htaccess)',
        fileLocation: '.htaccess (Apache/LiteSpeed) or Cloudflare WAF',
        fileLocationAr: 'ملف .htaccess في خادم أباتشي أو قواعد WAF في Cloudflare',
        codeSnippet: `# Allow AI Search Bots and Search Engines through WAF/Security Rules
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (OAI-SearchBot|PerplexityBot|Googlebot|bingbot) [NC]
RewriteRule .* - [E=WAF_BYPASS:1,L]
</IfModule>

# Ensure X-Robots-Tag does not block indexing
<IfModule mod_headers.c>
Header set X-Robots-Tag "index, follow"
</IfModule>`,
        installationInstructions: 'Add this snippet to your root .htaccess file or configure your WordPress security plugin (Wordfence, iThemes) / Cloudflare WAF to safelist OAI-SearchBot and PerplexityBot user-agents.',
        installationInstructionsAr: 'أضف هذا الكود إلى ملف .htaccess أو قم بتهيئة إضافة الحماية (Wordfence) أو Cloudflare WAF للسماح لروبوتات OAI-SearchBot و PerplexityBot.',
      });

      // 3. Shopify CDN / WAF Safelist
      fixes.push({
        platform: 'shopify',
        platformName: 'Shopify Store / Cloudflare',
        fileLocation: 'Shopify Admin / Cloudflare Domain DNS/WAF',
        fileLocationAr: 'لوحة تحكم شوبيفاي / إعدادات Cloudflare WAF',
        codeSnippet: `# Shopify Cloudflare / Reverse Proxy Configuration
# If using custom Cloudflare proxy in front of Shopify:
# 1. Navigate to Cloudflare Dashboard > Security > WAF > Custom Rules
# 2. Create Rule: "Allow AI Search Crawlers"
# 3. Expression:
(http.user_agent contains "OAI-SearchBot") or (http.user_agent contains "PerplexityBot")
# 4. Action: Skip / Bypass WAF & Managed Challenge

# Verify in Shopify Admin:
# Online Store > Preferences > Ensure store is NOT password-protected.`,
        installationInstructions: 'If using Cloudflare or a CDN proxy in front of Shopify, create a WAF bypass rule for OAI-SearchBot and PerplexityBot. Ensure your store password protection is disabled for public indexing.',
        installationInstructionsAr: 'إذا كنت تستخدم Cloudflare أمام شوبيفاي، أنشئ قاعدة استثناء (Bypass) في WAF لروبوتات OAI-SearchBot و PerplexityBot، وتأكد من تعطيل كلمة مرور المتجر.',
      });
      break;

    default:
      fixes.push({
        platform: 'nextjs',
        platformName: 'Standard Configuration',
        fileLocation: 'app/layout.tsx',
        fileLocationAr: 'ملف app/layout.tsx',
        codeSnippet: `// Canonical & Meta Configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://${domain}'),
  alternates: {
    canonical: 'https://${domain}',
  },
  robots: {
    index: true,
    follow: true,
  },
};`,
        installationInstructions: 'Update your layout metadata export with proper canonical and index directives.',
        installationInstructionsAr: 'حدّث إعدادات الـ metadata في ملف layout الرئيسي لتضمين الرابط الأساسي وإرشادات الفهرسة.',
      });

      fixes.push({
        platform: 'wordpress',
        platformName: 'WordPress Header',
        fileLocation: 'header.php',
        fileLocationAr: 'ترويسة الموقع header.php',
        codeSnippet: `<!-- Ensure Canonical Tag is Present -->
<link rel="canonical" href="<?php echo esc_url(get_permalink()); ?>" />`,
        installationInstructions: 'Ensure your theme header.php calls wp_head() and outputs a self-referencing canonical tag.',
        installationInstructionsAr: 'تأكد من وجود دالة wp_head() ووسم canonical الصحيح في ملف header.php.',
      });

      fixes.push({
        platform: 'shopify',
        platformName: 'Shopify theme.liquid',
        fileLocation: 'layout/theme.liquid',
        fileLocationAr: 'ملف layout/theme.liquid',
        codeSnippet: `<link rel="canonical" href="{{ canonical_url }}">`,
        installationInstructions: 'Place the canonical tag inside the <head> element of your theme.liquid template.',
        installationInstructionsAr: 'ضع وسم canonical داخل وسم <head> في ملف theme.liquid الرئيسي.',
      });
      break;
  }

  return fixes;
}
