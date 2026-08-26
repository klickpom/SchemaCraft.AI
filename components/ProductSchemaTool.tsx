'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  ShoppingBag,
  Tag,
  Star,
  Truck,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Code2,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface ProductSchemaToolProps {
  lang: Language;
}

export default function ProductSchemaTool({ lang }: ProductSchemaToolProps) {
  const [name, setName] = useState('Pro Wireless Noise-Cancelling Headphones');
  const [brand, setBrand] = useState('SoundCraft Audio');
  const [image, setImage] = useState('https://schemacraft-ai.site/og-image.png');
  const [price, setPrice] = useState('149.00');
  const [currency, setCurrency] = useState('USD');
  const [availability, setAvailability] = useState('https://schema.org/InStock');
  const [condition, setCondition] = useState('https://schema.org/NewCondition');
  const [rating, setRating] = useState('4.9');
  const [reviewCount, setReviewCount] = useState('512');
  const [sku, setSku] = useState('SC-WH-2026');
  const [freeShipping, setFreeShipping] = useState(true);
  const [easyReturns, setEasyReturns] = useState(true);
  const [copied, setCopied] = useState(false);
  const [codePlatform, setCodePlatform] = useState<'jsonld' | 'shopify' | 'woo' | 'nextjs'>('jsonld');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const generateJsonLdObj = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: name,
      image: image,
      description: `${name} by ${brand}. High-performance audio engineered for professional monitoring.`,
      sku: sku,
      brand: {
        '@type': 'Brand',
        name: brand,
      },
      offers: {
        '@type': 'Offer',
        url: 'https://example.com/product/headphones',
        priceCurrency: currency,
        price: price,
        availability: availability,
        itemCondition: condition,
        shippingDetails: freeShipping
          ? {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: '0.00',
                currency: currency,
              },
            }
          : undefined,
        hasMerchantReturnPolicy: easyReturns
          ? {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'US',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 30,
            }
          : undefined,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviewCount,
        bestRating: '5',
      },
    };
  };

  const getExportCode = () => {
    const jsonObj = generateJsonLdObj();
    const jsonStr = JSON.stringify(jsonObj, null, 2);

    if (codePlatform === 'shopify') {
      return `{% comment %} Shopify Liquid Product Schema {% endcomment %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": {{ product.title | json }},
  "image": {{ product.featured_image | image_url: width: 1000 | json }},
  "description": {{ product.description | strip_html | truncatewords: 40 | json }},
  "sku": {{ product.selected_or_first_available_variant.sku | json }},
  "brand": {
    "@type": "Brand",
    "name": {{ product.vendor | json }}
  },
  "offers": {
    "@type": "Offer",
    "url": "{{ shop.url }}{{ product.url }}",
    "priceCurrency": {{ cart.currency.iso_code | json }},
    "price": "{{ product.selected_or_first_available_variant.price | money_without_currency | remove: ',' }}",
    "availability": "{% if product.available %}https://schema.org/InStock{% else %}https://schema.org/OutOfStock{% endif %}"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "${rating}",
    "reviewCount": "${reviewCount}"
  }
}
</script>`;
    }

    if (codePlatform === 'woo') {
      return `<?php
/**
 * WooCommerce functions.php hook for 0ms Validated Product JSON-LD
 */
add_action('wp_head', function() {
  if (is_product()) {
    global $product;
    $schema = [
      '@context' => 'https://schema.org',
      '@type' => 'Product',
      'name' => $product->get_name(),
      'image' => wp_get_attachment_url($product->get_image_id()),
      'sku' => $product->get_sku() ?: 'SKU-' . $product->get_id(),
      'offers' => [
        '@type' => 'Offer',
        'price' => $product->get_price(),
        'priceCurrency' => get_woocommerce_currency(),
        'availability' => $product->is_in_stock() ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      ]
    ];
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
  }
});
?>`;
    }

    if (codePlatform === 'nextjs') {
      return `// Next.js 15 TSX Component
export default function ProductJsonLd({ product }: { product: any }) {
  const jsonLd = ${jsonStr};

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}`;
    }

    return `<script type="application/ld+json">\n${jsonStr}\n</script>`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getExportCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#10101c] via-[#090912] to-[#050508] p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/40 text-[10px] sm:text-xs font-bold text-amber-300">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'سكيما التجارة الإلكترونية وبطاقات جوجل شوبينج' : 'Google Merchant & E-Commerce Product Schema'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'تفعيل نجوم التقييم وشارات الأسعار والشحن المجاني في نتائج جوجل'
              : 'Unlock 5-Star Ratings, Price Badges & In-Stock Snippets'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولد كود Product و Offer و AggregateRating المعتمد لزيادة معدل النقر (CTR) ومبيعات متجرك في شوبيفاي وووكومرس.'
              : 'Generate verified Product, Offer, and Merchant Return Policy structured data to boost Google Shopping & organic CTR.'}
          </p>
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10">
          <button
            type="button"
            onClick={() => setCodePlatform('jsonld')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              codePlatform === 'jsonld' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            HTML JSON-LD
          </button>
          <button
            type="button"
            onClick={() => setCodePlatform('shopify')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              codePlatform === 'shopify' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shopify
          </button>
          <button
            type="button"
            onClick={() => setCodePlatform('woo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              codePlatform === 'woo' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            WooCommerce
          </button>
          <button
            type="button"
            onClick={() => setCodePlatform('nextjs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              codePlatform === 'nextjs' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Next.js
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'معايير المنتج والمتجر:' : 'Product & Offer Parameters:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'اسم المنتج:' : 'Product Name:'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'العلامة التجارية (Brand):' : 'Brand Name:'}
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'رمز المنتج (SKU):' : 'SKU / Barcode:'}
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'السعر والعملة:' : 'Price & Currency:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-2/3 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-emerald-400 focus:outline-none focus:border-amber-500 font-bold font-mono"
                />
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-1/3 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 font-bold font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'التقييم والمراجعات:' : 'Star Rating & Reviews:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-bold font-mono"
                />
                <input
                  type="text"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 font-medium font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'حالة التوفر:' : 'Availability:'}
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="https://schema.org/InStock">InStock (متوفر في المخزون)</option>
                <option value="https://schema.org/PreOrder">PreOrder (طلب مسبق)</option>
                <option value="https://schema.org/OutOfStock">OutOfStock (نفذت الكمية)</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={freeShipping}
                  onChange={(e) => setFreeShipping(e.target.checked)}
                  className="rounded bg-black border-white/20 text-amber-500 focus:ring-0"
                />
                <span>{lang === 'ar' ? 'شحن مجاني (Free Shipping)' : 'Free Shipping Eligible'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={easyReturns}
                  onChange={(e) => setEasyReturns(e.target.checked)}
                  className="rounded bg-black border-white/20 text-amber-500 focus:ring-0"
                />
                <span>{lang === 'ar' ? 'إرجاع مجاني 30 يوم' : '30-Day Free Returns'}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Live SERP Preview & Code */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google Merchant Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Export Code</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الكود' : 'Copy Code')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-3 font-sans shadow-xl text-left">
              <div className="text-[11px] text-[#bdc1c6] font-mono leading-none truncate">
                https://store.example.com/product/headphones
              </div>
              <h3 className="text-base text-[#8ab4f8] font-bold hover:underline cursor-pointer">
                {name} — {brand}
              </h3>

              {/* Rich Badges */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-sm font-black text-white font-mono bg-white/10 px-2 py-0.5 rounded-md">
                  ${price} {currency}
                </span>

                <div className="flex items-center gap-1 text-[#fbbc04] text-xs">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-[#fbbc04]" />
                    ))}
                  </div>
                  <span className="text-[#bdc1c6] text-xs font-mono font-bold">
                    {rating} ({reviewCount})
                  </span>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  ✓ In stock
                </span>

                {freeShipping && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Free shipping
                  </span>
                )}

                {easyReturns && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" />
                    30-day returns
                  </span>
                )}
              </div>

              <p className="text-xs text-[#bdc1c6] leading-relaxed pt-1">
                Premium audio equipment manufactured by {brand}. Model SKU {sku} with full manufacturer warranty.
              </p>
            </div>
          ) : (
            <pre className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-inner max-h-[360px]">
              {getExportCode()}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
