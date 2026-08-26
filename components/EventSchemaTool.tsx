'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  Calendar,
  MapPin,
  Ticket,
  User,
  Building,
  Clock,
  Sparkles,
  Copy,
  Check,
  Globe,
  Code2,
  Eye,
  ExternalLink,
} from 'lucide-react';

interface EventSchemaToolProps {
  lang: Language;
}

export default function EventSchemaTool({ lang }: EventSchemaToolProps) {
  const [name, setName] = useState('Global AI Search & AEO Summit 2026');
  const [description, setDescription] = useState(
    'The premier technical conference exploring neural search architecture, knowledge graph synthesis, and next-gen citation indexing.'
  );
  const [attendanceMode, setAttendanceMode] = useState('https://schema.org/OnlineEventAttendanceMode');
  const [startDate, setStartDate] = useState('2026-09-15T09:00:00-07:00');
  const [endDate, setEndDate] = useState('2026-09-16T17:00:00-07:00');
  const [locationName, setLocationName] = useState('Moscone Center & Virtual Livestream');
  const [locationAddress, setLocationAddress] = useState('747 Howard St, San Francisco, CA 94103');
  const [performerName, setPerformerName] = useState('Dr. Sarah Chen, AI Systems Lead');
  const [organizerName, setOrganizerName] = useState('SchemaCraft AI Labs');
  const [price, setPrice] = useState('199.00');
  const [currency, setCurrency] = useState('USD');
  const [ticketUrl, setTicketUrl] = useState('https://schemacraft-ai.site/tickets');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const generateJsonLdObj = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: name,
      description: description,
      startDate: startDate,
      endDate: endDate,
      eventAttendanceMode: attendanceMode,
      eventStatus: 'https://schema.org/EventScheduled',
      location:
        attendanceMode === 'https://schema.org/OnlineEventAttendanceMode'
          ? {
              '@type': 'VirtualLocation',
              url: 'https://schemacraft-ai.site/live-stream',
            }
          : {
              '@type': 'Place',
              name: locationName,
              address: {
                '@type': 'PostalAddress',
                streetAddress: locationAddress,
              },
            },
      image: ['https://schemacraft-ai.site/og-image.png'],
      performer: {
        '@type': 'Person',
        name: performerName,
      },
      organizer: {
        '@type': 'Organization',
        name: organizerName,
        url: 'https://schemacraft-ai.site',
      },
      offers: {
        '@type': 'Offer',
        url: ticketUrl,
        price: price,
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        validFrom: '2026-08-01T00:00:00+00:00',
      },
    };
  };

  const getJsonLdString = () => {
    return JSON.stringify(generateJsonLdObj(), null, 2);
  };

  const handleCopy = async () => {
    try {
      const code = `<script type="application/ld+json">\n${getJsonLdString()}\n</script>`;
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-950/40 text-[10px] sm:text-xs font-bold text-pink-300">
            <Calendar className="w-3.5 h-3.5 text-pink-400" />
            <span>{lang === 'ar' ? 'سكيما الفعاليات وحجز التذاكر' : 'Google Events & Ticket Booking Architect'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'تفعيل شريط الفعاليات التفاعلي وبطاقات حجز التذاكر في جوجل'
              : 'Unlock Interactive Google Event Carousels & Direct Ticket Booking'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولد كود Event معتمد للمؤتمرات والندوات عبر الإنترنت وحجز التذاكر مع توثيق التوقيت والمكان والمتحدثين.'
              : 'Generate structured Event JSON-LD with verified dates, virtual/in-person venues, performer E-E-A-T, and direct ticket booking integration.'}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-pink-300 shrink-0">
          Schema.org/Event
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'معايير الفعالية والمكان والتذاكر:' : 'Event Schedule & Ticket Parameters:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'اسم الفعالية / المؤتمر:' : 'Event Name:'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'نمط الحضور (Mode):' : 'Attendance Mode:'}
              </label>
              <select
                value={attendanceMode}
                onChange={(e) => setAttendanceMode(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-pink-300 font-bold focus:outline-none focus:border-pink-500 cursor-pointer"
              >
                <option value="https://schema.org/OnlineEventAttendanceMode">Online / Webinar (عبر الإنترنت)</option>
                <option value="https://schema.org/OfflineEventAttendanceMode">In-Person / Physical Venue (حضوري)</option>
                <option value="https://schema.org/MixedEventAttendanceMode">Hybrid (حضوري وافتراضي)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'سعر التذكرة والعملة:' : 'Ticket Price & Currency:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-2/3 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-emerald-400 focus:outline-none focus:border-pink-500 font-bold font-mono"
                />
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-1/3 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500 font-bold font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'تاريخ ووقت البدء:' : 'Start Date & Time:'}
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'تاريخ ووقت الانتهاء:' : 'End Date & Time:'}
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'اسم المتحدث الرئيسي (Performer):' : 'Keynote Performer:'}
              </label>
              <input
                type="text"
                value={performerName}
                onChange={(e) => setPerformerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'المؤسسة المنظمة:' : 'Organizer Name:'}
              </label>
              <input
                type="text"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Google Event SERP Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google Event Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود الفعالية' : 'Copy Event Schema')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-4 font-sans shadow-xl text-left">
              <div className="flex items-start gap-4">
                {/* Calendar Square */}
                <div className="h-16 w-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">
                    SEP
                  </span>
                  <span className="text-2xl font-black text-white font-mono leading-none">
                    15
                  </span>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="text-[11px] text-[#bdc1c6] font-mono leading-none truncate">
                    https://schemacraft-ai.site/summit-2026
                  </div>
                  <h3 className="text-base font-bold text-[#8ab4f8] leading-snug hover:underline cursor-pointer">
                    {name}
                  </h3>
                  <div className="text-xs text-[#bdc1c6] flex items-center gap-2">
                    <Clock className="w-3 h-3 text-pink-400" />
                    <span>Tue, Sep 15, 9:00 AM – Wed, Sep 16</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-pink-400" />
                    <span className="truncate">{locationName}</span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400 font-mono">
                    Tickets from ${price} {currency}
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Ticket className="w-3 h-3" />
                  <span>Get Tickets</span>
                </button>
              </div>
            </div>
          ) : (
            <pre className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-inner max-h-[360px]">
              {`<script type="application/ld+json">\n${getJsonLdString()}\n</script>`}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
