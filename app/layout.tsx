import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SchemaCraft AI | Universal JSON-LD & GEO Schema Generator",
  description:
    "Generate, validate, and optimize zero-error JSON-LD schemas for Generative Engine Optimization (GEO) and AI Overviews instantly. No account required.",
  metadataBase: new URL("https://schemacraft.ai"),
  openGraph: {
    title: "SchemaCraft AI - Instant Schema & Structured Data Generator",
    description:
      "Generate valid Schema.org JSON-LD scripts in under 2 seconds for high-ranking search and AI citations.",
    type: "website",
    url: "https://schemacraft.ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "SchemaCraft AI",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "4.99",
          priceCurrency: "USD",
        },
        description:
          "Client-side automated JSON-LD and structured data generator optimized for Google AI Overviews and Perplexity search citations.",
      },
      {
        "@type": "Organization",
        name: "SchemaCraft AI",
        url: "https://schemacraft.ai",
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
      <body
        className="font-sans bg-[#09090b] text-slate-100 antialiased min-h-screen selection:bg-indigo-600 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
