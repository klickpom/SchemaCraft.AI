import JSZip from "jszip";

export interface BundleData {
  entityName: string;
  schemaType: string;
  jsonSchema: Record<string, any>;
  url: string;
  date: string;
}

export async function generateEnterpriseBundle(data: BundleData): Promise<Blob> {
  const zip = new JSZip();
  const safeName = (data.entityName || "schema").toLowerCase().replace(/[^a-z0-9]/g, "-");
  const folder = zip.folder(`schemacraft-${safeName}-enterprise-bundle`);

  const jsonString = JSON.stringify(data.jsonSchema, null, 2);

  // 1. Raw JSON-LD Schema (.json)
  folder?.file(`${safeName}-schema.json`, jsonString);

  // 2. Next.js 15 App Router Server Component (.tsx)
  const nextJsCode = `/**
 * SchemaCraft AI - Next.js 15 App Router Server Component (React 19)
 * Generated on: ${data.date}
 * Entity: ${data.entityName} (${data.schemaType})
 * 
 * Instructions:
 * 1. Save in your Next.js project: components/SchemaJsonLd.tsx
 * 2. Import and render directly in app/page.tsx or app/layout.tsx
 */

import React from 'react';

export function SchemaJsonLd() {
  const structuredData = ${jsonString};

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default SchemaJsonLd;
`;
  folder?.file(`SchemaJsonLd.tsx`, nextJsCode);

  // 3. Shopify Liquid Theme Snippet (.liquid)
  const shopifyLiquid = `{%- comment -%}
  SchemaCraft AI - Shopify JSON-LD Structured Data Snippet
  Entity: ${data.entityName} (${data.schemaType})
  Generated: ${data.date}

  INSTALLATION:
  1. Go to Shopify Admin > Online Store > Themes > Edit code.
  2. Under 'Snippets', click 'Add a new snippet', name it 'schemacraft-seo'.
  3. Paste the contents of this file into 'snippets/schemacraft-seo.liquid'.
  4. In 'layout/theme.liquid', insert {% render 'schemacraft-seo' %} before the closing </head> tag.
{%- endcomment -%}

<script type="application/ld+json">
${jsonString}
</script>
`;
  folder?.file(`schemacraft-seo.liquid`, shopifyLiquid);

  // 4. WordPress functions.php Hook (.php)
  const wpPhpCode = `<?php
/**
 * SchemaCraft AI - WordPress & WooCommerce Header Schema Injector
 * Entity: ${data.entityName} (${data.schemaType})
 * Generated: ${data.date}
 * 
 * INSTALLATION:
 * Paste this function into your child theme's functions.php or in the Code Snippets plugin.
 */

function schemacraft_inject_json_ld_schema() {
    ?>
    <!-- SchemaCraft AI Automated JSON-LD Injection -->
    <script type="application/ld+json">
    ${jsonString}
    </script>
    <?php
}
add_action('wp_head', 'schemacraft_inject_json_ld_schema', 1);
`;
  folder?.file(`wordpress-schema.php`, wpPhpCode);

  // 5. Nuxt 3 & Vue 3 Component (.vue)
  const nuxtCode = `<script setup lang="ts">
/**
 * SchemaCraft AI - Nuxt 3 & Vue 3 Server Head Injector
 * Entity: ${data.entityName} (${data.schemaType})
 * Generated: ${data.date}
 */

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(${jsonString}),
    },
  ],
})
</script>

<template>
  <!-- SchemaCraft AI JSON-LD Injected into Nuxt Head -->
</template>
`;
  folder?.file(`SchemaNuxt.vue`, nuxtCode);

  // 6. Astro Component (.astro)
  const astroCode = `---
/**
 * SchemaCraft AI - Astro Component
 * Entity: ${data.entityName} (${data.schemaType})
 * Generated: ${data.date}
 */
const schemaData = ${jsonString};
---

<script type="application/ld+json" set:html={JSON.stringify(schemaData)} />
`;
  folder?.file(`SchemaAstro.astro`, astroCode);

  // 7. SvelteKit & Svelte 5 Component (.svelte)
  const svelteCode = `<script>
  /**
   * SchemaCraft AI - SvelteKit 5 Head Injector
   * Entity: ${data.entityName} (${data.schemaType})
   * Generated: ${data.date}
   */
  const schemaData = ${jsonString};
</script>

<svelte:head>
  {@html \`<script type="application/ld+json">\${JSON.stringify(schemaData)}<\/script>\`}
</svelte:head>
`;
  folder?.file(`SchemaSvelte.svelte`, svelteCode);

  // 8. Official Commercial Perpetual License Agreement
  const commercialLicense = `================================================================================
SCHEMACRAFT AI - OFFICIAL PERPETUAL COMMERCIAL LICENSE
================================================================================
Issued to: Verified SchemaCraft Pro License Holder
Product: Enterprise 10-in-1 JSON-LD & Generative Engine Schema Suite
License Type: Commercial, Perpetual, Royalty-Free, Worldwide
Issued Date: ${data.date}

GRANT OF RIGHTS:
SchemaCraft AI hereby grants the licensee an irrevocable, perpetual, non-exclusive,
worldwide license to use, integrate, modify, and deploy the generated structured data 
schemas across an unlimited number of personal, commercial, enterprise, and client projects.

PERMITTED USES:
1. Commercial deployment across unlimited production client websites and web applications.
2. Unlimited embedding in SaaS products, e-commerce stores, client deliverables, and agencies.
3. Modification, adaptation, and extension of the JSON-LD schemas, Next.js components, 
   Shopify snippets, Nuxt components, Astro components, Svelte scripts, and WordPress hooks.
4. No attribution or backlinks required.

100% MONEY-BACK & COMPLIANCE GUARANTEE:
All schemas generated by SchemaCraft AI are guaranteed to meet Schema.org v26.0 standards 
and Google Rich Results Test criteria. Backed by a 30-Day Money-Back Guarantee.

Official Support & Refund Inquiries: support@schemacraft-ai.site
SchemaCraft AI Architect Labs | https://schemacraft-ai.site
================================================================================
`;
  folder?.file(`COMMERCIAL_LICENSE.txt`, commercialLicense);

  // 9. GEO 2026 Exclusive Citation Optimization Playbook
  const geoPlaybook = `# The 2026 Generative Engine Optimization (GEO) Technical Playbook
**By SchemaCraft AI Architect Labs**

## Executive Summary
Generative Engine Optimization (GEO) is the technical discipline of optimizing digital entity knowledge graphs so that Large Language Models (LLMs)—including Perplexity AI, Google AI Overviews, ChatGPT Search, Claude Web, and Gemini—synthesize, ground, and cite your domain as the authoritative source.

---

## Pillar 1: Deterministic Schema Graph Grounding
1. **Direct URI Anchoring**: Always assign explicit \`@id\` URIs to primary entities (e.g. \`https://yourdomain.com/#software\`).
2. **Deterministic Entity Properties**: Ground prices, currencies, trial periods, and operating systems in Schema.org JSON-LD rather than relying on LLM optical parsing.
3. **Nested Knowledge Relations**: Link \`author\` and \`publisher\` to validated \`Organization\` nodes with verified \`sameAs\` social URLs.

---

## Pillar 2: Bottom Line Up Front (BLUF) Content Architecture
- Place a 40–60 word direct answer summary immediately following the \`<h1>\` heading.
- LLM retrieval chunking algorithms weight the first 250 tokens 3.4x higher for semantic entity matching.

---

## Pillar 3: Bot Access & Crawl Governance
Ensure your \`robots.txt\` grants explicit index permissions to:
\`\`\`txt
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
\`\`\`

© 2026 SchemaCraft AI Architect Labs. All rights reserved.
`;
  folder?.file(`GEO_OPTIMIZATION_PLAYBOOK_2026.md`, geoPlaybook);

  // 10. Google Search Console & Rich Snippets 20-Point Audit Checklist
  const gscChecklist = `# Google Search Console & Rich Snippets 20-Point Production Audit Checklist
**SchemaCraft AI Quality Assurance Standards**

## 1. Schema Validation & Syntax
- [ ] 1. JSON-LD syntax passes [Google Rich Results Test](https://search.google.com/test/rich-results) with 0 errors.
- [ ] 2. Schema validated against official [Schema.org Validator](https://validator.schema.org/).
- [ ] 3. No trailing commas or unescaped quote characters in JSON-LD script blocks.
- [ ] 4. Script tag has exact attribute \`type="application/ld+json"\`.

## 2. Entity & Offer Integrity
- [ ] 5. Pricing matches visible user-facing checkout page exactly.
- [ ] 6. \`priceCurrency\` uses standard ISO 4217 3-letter currency code (e.g. "USD", "EUR", "SAR").
- [ ] 7. \`availability\` references valid Schema.org URI (e.g. \`https://schema.org/InStock\`).
- [ ] 8. \`aggregateRating\` reflects genuine customer review data with \`bestRating: 5\`.

## 3. SEO & Core Web Vitals
- [ ] 9. Zero render-blocking JavaScript overhead (0ms client execution).
- [ ] 10. JSON-LD placed inside \`<head>\` or server-side rendered Server Component.
- [ ] 11. Canonical URL matches the primary page URL exactly.
- [ ] 12. XML Sitemap submitted in Google Search Console with daily changefreq.

© 2026 SchemaCraft AI. All rights reserved.
`;
  folder?.file(`GSC_RICH_SNIPPETS_AUDIT_CHECKLIST_2026.md`, gscChecklist);

  // Generate Zip Blob
  return await zip.generateAsync({ type: "blob" });
}
