'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  MapPin,
  Building2,
  Phone,
  Clock,
  DollarSign,
  Star,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Navigation,
  ShieldCheck,
  Code2,
  Eye,
} from 'lucide-react';

interface LocalBusinessSchemaToolProps {
  lang: Language;
}

const BUSINESS_TYPES = [
  { id: 'LocalBusiness', nameEn: 'General Local Business', nameAr: 'نشاط تجاري محلي عام' },
  { id: 'MedicalBusiness', nameEn: 'Medical Clinic & Doctor', nameAr: 'عيادة طبية ومركز صحي' },
  { id: 'LegalService', nameEn: 'Law Firm & Attorney', nameAr: 'مكتب محاماة واستشارات قانونية' },
  { id: 'Restaurant', nameEn: 'Restaurant & Cafe', nameAr: 'مطعم ومقهى' },
  { id: 'RealEstateAgent', nameEn: 'Real Estate Agency', nameAr: 'وكالة عقارات' },
  { id: 'AutoRepair', nameEn: 'Automotive & Repair', nameAr: 'مركز صيانة سيارات' },
];

export default function LocalBusinessSchemaTool({ lang }: LocalBusinessSchemaToolProps) {
  const [businessType, setBusinessType] = useState('LocalBusiness');
  const [name, setName] = useState('Apex Dental & Orthodontics');
  const [street, setStreet] = useState('742 Evergreen Terrace, Suite 100');
  const [city, setCity] = useState('Austin');
  const [state, setState] = useState('TX');
  const [postalCode, setPostalCode] = useState('78701');
  const [country, setCountry] = useState('US');
  const [phone, setPhone] = useState('+1 (512) 555-0199');
  const [url, setUrl] = useState('https://apexdental-austin.com');
  const [priceRange, setPriceRange] = useState('$$');
  const [rating, setRating] = useState('4.9');
  const [reviews, setReviews] = useState('240');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const generateJsonLd = () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': businessType,
      '@id': `${url.replace(/\/$/, '')}/#local`,
      name: name,
      url: url,
      telephone: phone,
      priceRange: priceRange,
      address: {
        '@type': 'PostalAddress',
        streetAddress: street,
        addressLocality: city,
        addressRegion: state,
        postalCode: postalCode,
        addressCountry: country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '30.2672',
        longitude: '-97.7431',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '09:00',
          closes: '14:00',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviews,
        bestRating: '5',
      },
    };
    return JSON.stringify(jsonLd, null, 2);
  };

  const handleCopy = async () => {
    try {
      const code = `<script type="application/ld+json">\n${generateJsonLd()}\n</script>`;
      await navigator.clipboard.writeText(code);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/40 text-[10px] sm:text-xs font-bold text-teal-300">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>{lang === 'ar' ? 'مولد سكيما الأنشطة المحلية وخرائط جوجل' : 'Google Maps 3-Pack & Local SEO Architect'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'تصدر نتائج خرائط جوجل وبطاقات الـ Local 3-Pack'
              : 'Dominate Google Maps 3-Pack & Local Knowledge Graph'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولد كود LocalBusiness معتمد يتضمن بيانات الـ NAP (الاسم، العنوان، الهاتف) والموقع الجغرافي وساعات العمل لتصدر نتائج البحث المحلي.'
              : 'Generate Google-compliant NAP structured microdata with GeoCoordinates, opening hours, and verified star ratings.'}
          </p>
        </div>

        {/* Business Type Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-teal-300 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            {BUSINESS_TYPES.map((bt) => (
              <option key={bt.id} value={bt.id} className="bg-[#0e0e18] text-white">
                {lang === 'ar' ? bt.nameAr : bt.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'بيانات النشاط التجاري (NAP):' : 'Business NAP & Location Parameters:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'اسم النشاط التجاري:' : 'Business Name:'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'العنوان والشارع:' : 'Street Address:'}
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'المدينة:' : 'City:'}
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'المنطقة / الرمز البريدي:' : 'State / Zip Code:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Zip"
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'رقم الهاتف الموثق:' : 'Phone Number:'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-teal-300 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'التقييم وعدد المراجعات:' : 'Star Rating & Reviews:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="4.9"
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-amber-300 focus:outline-none focus:border-teal-500 font-bold"
                />
                <input
                  type="text"
                  value={reviews}
                  onChange={(e) => setReviews(e.target.value)}
                  placeholder="Reviews"
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Maps Card & Code Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google Maps Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>JSON-LD Code</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود السكيما' : 'Copy Local Schema')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-4 font-sans shadow-xl text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                      Google Maps Verified
                    </span>
                    <span className="text-[11px] text-slate-400">• {priceRange}</span>
                  </div>
                  <h3 className="text-base text-white font-bold">{name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#fbbc04]">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-[#fbbc04]" />
                      ))}
                    </div>
                    <span className="text-[#bdc1c6] text-xs font-mono font-bold">
                      {rating} ({reviews})
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#bdc1c6] pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{street}, {city}, {state} {postalCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-mono text-cyan-300">{phone}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold">Open Now • Closes 6:00 PM</span>
                </div>
              </div>
            </div>
          ) : (
            <pre className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-inner max-h-[360px]">
              {`<script type="application/ld+json">\n${generateJsonLd()}\n</script>`}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
