import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cairo, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { UiLangProvider } from "@/components/UiLangProvider";
import { sitewideGraph } from "@/lib/seo/jsonld";
import { ogImageUrl, SITE_ORIGIN } from "@/lib/seo/urls";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "600", "700", "800", "900"], variable: "--font-cairo", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-jbmono", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Free AI SEO Audit & AI Visibility Checker | SchemaCraft",
    template: "%s",
  },
  description:
    "Check if ChatGPT, Google, Perplexity and Claude can crawl and cite your page. Free SEO, GEO and AEO audit with evidence and exact fixes.",
  applicationName: "SchemaCraft AI",
  authors: [{ name: "SchemaCraft AI", url: SITE_ORIGIN }],
  creator: "SchemaCraft AI",
  publisher: "SchemaCraft AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Free AI SEO Audit & AI Visibility Checker | SchemaCraft",
    description: "Check if ChatGPT, Google, Perplexity and Claude can crawl and cite your page.",
    url: SITE_ORIGIN,
    siteName: "SchemaCraft AI",
    images: [{ url: ogImageUrl(), width: 1200, height: 630, alt: "SchemaCraft AI — AI search visibility audit" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI SEO Audit & AI Visibility Checker | SchemaCraft",
    description: "Check if ChatGPT, Google, Perplexity and Claude can crawl and cite your page.",
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
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
    // lang/dir are rewritten to ar/rtl for /ar/ pages by scripts/postbuild.mjs
    <html lang="en" className={`dark overflow-x-hidden max-w-full ${jakarta.variable} ${cairo.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitewideGraph()) }}
        />
      </head>
      <body className="min-h-screen w-full max-w-full bg-[#060608] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden">
        <Script id="sc-lang" strategy="beforeInteractive">
          {`(function(){try{var l=localStorage.getItem('sc-lang');var p=location.pathname;if(l==='ar'&&(p==='/'||p==='')){location.replace('/ar/'+location.search+location.hash);return;}var ar=l==='ar'||p==='/ar'||p.indexOf('/ar/')===0;if(ar){document.documentElement.lang='ar';document.documentElement.dir='rtl';}if(l==='ar'&&p!=='/ar'&&p.indexOf('/ar/')!==0){document.documentElement.classList.add('sc-lang-pending');setTimeout(function(){document.documentElement.classList.remove('sc-lang-pending');},3000);}}catch(e){}})();`}
        </Script>
        <UiLangProvider>{children}</UiLangProvider>
      </body>
    </html>
  );
}
