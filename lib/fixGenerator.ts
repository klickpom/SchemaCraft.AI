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
      const schemaJson = siteType === 'saas' ? {
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
      } : {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": brandName,
        "url": `https://${domain}`,
        "logo": `https://${domain}/icon.png`
      };

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
  ${issue.title}
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
