import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://schemacraft-ai.site"),
  title: "SchemaCraft AI | 0ms Universal JSON-LD Schema & GEO Engine Architect",
  description:
    "Generate 100% validated Schema.org JSON-LD structured data with 0ms client-side AST compilation. Engineered for Generative Engine Optimization (GEO), Google Rich Snippets, and AI Overviews citation in Perplexity & ChatGPT Search.",
  keywords: [
    "Schema Generator",
    "JSON-LD Schema",
    "Generative Engine Optimization",
    "GEO 2026",
    "AEO Answer Engine Optimization",
    "Schema.org Generator",
    "Google Rich Results Validator",
    "SoftwareApplication Schema",
    "Shopify Product Schema",
    "FAQPage Schema Generator",
    "LocalBusiness Schema",
    "Perplexity AI SEO",
    "ChatGPT Search Citations",
    "Next.js 15 App Router Schema",
    "Shopify Liquid Schema Snippet",
  ],
  authors: [{ name: "SchemaCraft AI Architect Labs", url: "https://schemacraft-ai.site" }],
  creator: "SchemaCraft AI",
  publisher: "SchemaCraft AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://schemacraft-ai.site",
  },
  openGraph: {
    title: "SchemaCraft AI | 0ms JSON-LD Schema & Generative Engine Architect",
    description:
      "Instant 0ms client-side schema compiler with 100% Schema.org v26.0 compliance. Ground your website entities in Perplexity, ChatGPT Search, and Google AI Overviews.",
    url: "https://schemacraft-ai.site",
    siteName: "SchemaCraft.AI",
    images: [
      {
        url: "https://schemacraft-ai.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "SchemaCraft AI - Universal JSON-LD Schema Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SchemaCraft AI | Universal JSON-LD & GEO Architect",
    description:
      "Generate validated Schema.org JSON-LD with 0ms network latency. Engineered for Google Rich Results and AI Overviews.",
    images: ["https://schemacraft-ai.site/og-image.png"],
    creator: "@SchemaCraftAI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootSchemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://schemacraft-ai.site/#software",
        name: "SchemaCraft AI",
        alternateName: "SchemaCraft Generative Engine Architect",
        description:
          "Instant client-side JSON-LD structured data generator and validator designed for Generative Engine Optimization (GEO), Google Rich Results, and Perplexity/ChatGPT AI Search citation ingestion.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "All Modern Web Browsers, macOS, Windows, Linux, iOS, Android",
        url: "https://schemacraft-ai.site",
        softwareVersion: "2.4.0",
        offers: {
          "@type": "Offer",
          price: "4.99",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.95",
          reviewCount: "512",
          bestRating: "5",
          worstRating: "1",
        },
        author: {
          "@type": "Organization",
          "@id": "https://schemacraft-ai.site/#organization",
          name: "SchemaCraft AI Global",
          url: "https://schemacraft-ai.site",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://schemacraft-ai.site/#website",
        url: "https://schemacraft-ai.site",
        name: "SchemaCraft AI",
        description: "0ms Universal Schema.org JSON-LD & Generative Engine Optimizer",
        publisher: {
          "@id": "https://schemacraft-ai.site/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://schemacraft-ai.site/#organization",
        name: "SchemaCraft AI",
        url: "https://schemacraft-ai.site",
        logo: {
          "@type": "ImageObject",
          url: "https://schemacraft-ai.site/icon.png",
        },
        sameAs: [
          "https://twitter.com/schemacraft",
          "https://github.com/klickpom/SchemaCraft.AI",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://schemacraft-ai.site/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does JSON-LD structured data improve Generative Engine Optimization (GEO)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Generative search engines like Perplexity, Google AI Overviews, and ChatGPT Search ingest deterministic Schema.org entity graphs. High-precision JSON-LD feeds exact entity properties directly into LLM retrieval pipelines (RAG), boosting direct AI citation frequency by up to +40%.",
            },
          },
          {
            "@type": "Question",
            name: "What makes SchemaCraft AI faster than other schema generators?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SchemaCraft executes 100% of its Abstract Syntax Tree (AST) validation and code generation client-side with 0ms network latency. It generates production-ready exports for Next.js 15 Server Components, Shopify Liquid, and WordPress PHP.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="canonical" href="https://schemacraft-ai.site" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Cairo:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchemaGraph) }}
        />
      </head>
      <body className="antialiased bg-[#070709] text-slate-100 min-h-screen selection:bg-indigo-600 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
