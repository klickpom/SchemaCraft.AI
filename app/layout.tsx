import type { Metadata, Viewport } from "next";
import "./globals.css";
import { sitewideGraph } from "@/lib/seo/jsonld";
import { ogImageUrl, SITE_ORIGIN } from "@/lib/seo/urls";

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Free SEO Audit & JSON-LD Schema Generator | SchemaCraft AI",
    template: "%s",
  },
  description:
    "Paste a URL. SchemaCraft fetches the page from our server, scores only what it inspected, and generates Schema.org JSON-LD.",
  keywords: [
    "AI Search Visibility Audit",
    "GEO Audit Tool",
    "AEO Optimization",
    "Technical SEO Audit",
    "Schema Markup Generator",
    "JSON-LD Schema Generator",
    "OAI-SearchBot",
    "ChatGPT Search Readiness",
    "Perplexity AI SEO",
    "Google Rich Snippets Generator",
    "Shopify Schema Markup",
    "Next.js SEO Metadata",
    "WordPress Schema Generator",
    "Schema.org Validator",
    "مولد سكيما",
    "فحص سيو الذكاء الاصطناعي",
    "تحسين الظهور في شات جي بي تي",
  ],
  authors: [{ name: "SchemaCraft AI Architect Labs", url: SITE_ORIGIN }],
  creator: "SchemaCraft AI",
  publisher: "SchemaCraft AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Free SEO Audit & JSON-LD Schema Generator | SchemaCraft AI",
    description:
      "Server-side website audit and in-browser Schema.org JSON-LD generator. Unretrieved pages are not scored.",
    url: SITE_ORIGIN,
    siteName: "SchemaCraft.AI",
    images: [
      {
        url: ogImageUrl(),
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
    title: "Free SEO Audit & JSON-LD Schema Generator | SchemaCraft AI",
    description:
      "Server-side website audit and in-browser Schema.org JSON-LD generator. Unretrieved pages are not scored.",
    images: [ogImageUrl()],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitewideGraph()) }}
        />
      </head>
      <body className="min-h-screen w-full max-w-full bg-[#060608] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
