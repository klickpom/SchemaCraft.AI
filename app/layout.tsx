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
  title: "SchemaCraft AI | AI Search Visibility Auditor & Optimizer",
  description:
    "Discover the technical, content, entity, and crawlability issues that may limit how search engines and AI systems discover and understand your website.",
  keywords: [
    "AI Search Visibility Audit",
    "GEO Audit",
    "AEO Optimization",
    "Technical SEO Audit",
    "OAI-SearchBot",
    "ChatGPT Search Readiness",
    "Perplexity AI SEO",
    "Schema.org Validator",
    "Indexability Gate",
    "AI Search Benchmark",
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
    title: "SchemaCraft AI | AI Search Visibility Auditor & Optimizer",
    description:
      "Discover the technical, content, entity, and crawlability issues that may limit how search engines and AI systems discover and understand your website.",
    url: "https://schemacraft-ai.site",
    siteName: "SchemaCraft.AI",
    images: [
      {
        url: "https://schemacraft-ai.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "SchemaCraft AI - AI Search Visibility Auditor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SchemaCraft AI | AI Search Visibility Auditor & Optimizer",
    description:
      "Discover the technical, content, entity, and crawlability issues that may limit how search engines and AI systems discover and understand your website.",
    images: ["https://schemacraft-ai.site/og-image.png"],
    creator: "@SchemaCraftAI",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
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
  manifest: "/site.webmanifest",
  verification: {
    google: "DsJHeUQVQt94en0tyfm_POyTVC3-dBavIg43_IjlBsc",
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
        name: "SchemaCraft AI Search Visibility Auditor",
        alternateName: "SchemaCraft AI Visibility Optimizer",
        description:
          "Fast deterministic website audit engine diagnosing SEO, crawlability, content answerability, and entity structured data readiness for Google and AI-powered search.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "All Modern Web Browsers, macOS, Windows, Linux, iOS, Android",
        url: "https://schemacraft-ai.site",
        softwareVersion: "1.0.0",
        offers: {
          "@type": "Offer",
          price: "9.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.96",
          reviewCount: "648",
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
        description: "AI Search Visibility Auditor & Optimizer",
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
            name: "How does SchemaCraft AI audit websites for Google, ChatGPT Search and Perplexity?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SchemaCraft AI executes a multi-wave deterministic diagnostic inspecting server HTTP status, indexability gates, robots.txt bot directives (including OAI-SearchBot and PerplexityBot), BLUF content answerability, and Schema.org JSON-LD entity graph completeness.",
            },
          },
          {
            "@type": "Question",
            name: "What platforms does SchemaCraft AI provide ready code fixes for?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SchemaCraft AI generates 100% production-ready, copy-paste code fixes for WordPress (functions.php hooks & filters), Next.js 15 App Router (TypeScript metadata, sitemaps & JSON-LD scripts), and Shopify Liquid themes.",
            },
          },
          {
            "@type": "Question",
            name: "How much does SchemaCraft AI cost and what is the guarantee?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SchemaCraft AI offers a single lifetime full audit access pass for $9.00 USD with zero recurring fees, backed by an unconditional 30-Day Money-Back Guarantee.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className="dark overflow-x-hidden max-w-full">
      <head>
        <meta name="google-site-verification" content="DsJHeUQVQt94en0tyfm_POyTVC3-dBavIg43_IjlBsc" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchemaGraph) }}
        />
      </head>
      <body className="min-h-screen w-full max-w-full bg-[#060608] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
