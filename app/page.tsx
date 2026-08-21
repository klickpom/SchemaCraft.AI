'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  evaluateEvidence,
  fetchLiveEvidence,
  SAMPLE_PROFILES,
  AuditReport,
  AuditIssue,
  AUDIT_ENGINE_VERSION,
  RawEvidence,
} from '@/lib/auditEngine';
import { translations, Language } from '@/lib/translations';
import { isProUnlockedClient, setProUnlockedClient } from '@/lib/payment';
import FixGeneratorModal from '@/components/FixGeneratorModal';
import PayPalCheckout from '@/components/PayPalCheckout';
import {
  Layers,
  Globe,
  Zap,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Lock,
  ArrowRight,
  Share2,
  Check,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Terminal,
  ShoppingBag,
  Sparkles,
  FileCode2,
  RotateCcw,
  Bot,
} from 'lucide-react';

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanPercent, setScanPercent] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isProUnlocked, setIsProUnlocked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedIssueForFix, setSelectedIssueForFix] = useState<AuditIssue | null>(null);
  const [showEvidenceLedger, setShowEvidenceLedger] = useState(true);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [activeDemoProfile, setActiveDemoProfile] = useState<string | null>(null);

  const t = translations[lang];

  // Initialize with a high-impact demo audit on mount & listen to Escape key
  useEffect(() => {
    if (isProUnlockedClient()) setIsProUnlocked(true);
    handleRunAudit('https://saasmetrics-app.io', SAMPLE_PROFILES.saas.raw, 'saas');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPaywall(false);
        setSelectedIssueForFix(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLanguageToggle = () => {
    const nextLang = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const handleRunAudit = async (url: string, rawData?: RawEvidence, profileKey?: string) => {
    setScanError(null);
    setIsScanning(true);
    setScanStep(1);
    setScanPercent(12);
    setActiveDemoProfile(profileKey || null);

    // Smooth percentage ticker
    const interval = setInterval(() => {
      setScanPercent((prev) => {
        if (prev < 20) return prev + 3;
        if (prev < 45) return prev + 2;
        if (prev < 70) return prev + 1.5;
        if (prev < 88) return prev + 0.5;
        return prev;
      });
    }, 200);

    const timer1 = setTimeout(() => setScanStep(2), 800);
    const timer2 = setTimeout(() => setScanStep(3), 2500);
    const timer3 = setTimeout(() => setScanStep(4), 5000);
    const timer4 = setTimeout(() => setScanStep(5), 8000);

    try {
      let evidence = rawData;
      if (!evidence) {
        // Perform 100% REAL live HTTP crawl & DOM inspection
        evidence = await fetchLiveEvidence(url);
      } else {
        setTimeout(() => setScanStep(2), 300);
        setTimeout(() => setScanStep(3), 700);
        setTimeout(() => setScanStep(4), 1100);
        await new Promise((r) => setTimeout(r, 1500));
      }

      const generatedReport = evaluateEvidence(url, evidence);
      setScanPercent(100);
      
      setTimeout(() => {
        setReport(generatedReport);
        setIsScanning(false);
        setScanStep(0);
        setScanPercent(0);

        // Smooth scroll to results
        setTimeout(() => {
          document.getElementById('audit-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 350);

    } catch (err) {
      console.error('Live audit fetch error:', err);
      setScanError(t.errors.scanFailed);
      setIsScanning(false);
      setScanStep(0);
      setScanPercent(0);
    } finally {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    let formatted = urlInput.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    handleRunAudit(formatted);
  };

  const handleShareSnapshot = () => {
    if (!report) return;
    const shareUrl = `${window.location.origin}/#audit-${report.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  const handlePaymentSuccess = () => {
    setProUnlockedClient(true);
    setIsProUnlocked(true);
    setShowPaywall(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getCategoryBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-400';
    if (score >= 50) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  const getCategoryTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBadgeText = (score: number) => {
    if (score >= 80) return t.scoreSection.badgeHealthy;
    if (score >= 50) return t.scoreSection.badgeNeedsOpt;
    return t.scoreSection.badgeCritical;
  };

  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 font-sans selection:bg-indigo-600 selection:text-white pb-20">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#07070a]/95 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* Brand Logo & Engine Version */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/25 shrink-0">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-sm sm:text-base font-black tracking-tight text-white">
                SchemaCraft<span className="text-indigo-400">.AI</span>
              </span>
              <span className="hidden lg:inline-flex text-[9px] uppercase px-1.5 py-0.5 rounded-full border border-indigo-500/30 text-indigo-300 bg-indigo-500/10 font-mono tracking-wider font-semibold">
                {t.nav.engineTag}
              </span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {report && (
              <button
                type="button"
                onClick={handleShareSnapshot}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="Copy shareable audit link"
              >
                {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copiedShareLink ? t.nav.reportShared : t.nav.shareReport}</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              type="button"
              onClick={handleLanguageToggle}
              className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-[11px] sm:text-xs font-bold text-slate-200 transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              title="Toggle Language"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
              <span>{lang === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Primary $9 Conversion Action */}
            <button
              type="button"
              onClick={() => setShowPaywall(true)}
              className={`transition px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg border font-black flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer shrink-0 whitespace-nowrap text-[11px] sm:text-xs ${
                isProUnlocked
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'text-white border-indigo-500/40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-500/25 cta-glow-pulse'
              }`}
            >
              {isProUnlocked ? (
                <>
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.nav.ctaUnlocked}</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300 fill-cyan-300/30 shrink-0" />
                  <span className="sm:hidden">{t.nav.ctaUnlockMobile}</span>
                  <span className="hidden sm:inline">{t.nav.ctaUnlock}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 space-y-12 sm:space-y-16">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-5 px-2">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-[10px] sm:text-xs font-semibold text-cyan-300 shadow-sm max-w-full">
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="truncate">{t.hero.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {t.hero.h1}
          </h1>

          {/* Subheadline */}
          <p className="text-xs sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto pt-2 sm:pt-3">
            <div className="relative flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-[#111118] border border-white/15 shadow-2xl focus-within:border-indigo-500 transition-all">
              <div className="relative flex items-center w-full pl-3 rtl:pl-0 rtl:pr-3">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={t.hero.inputPlaceholder}
                  className="w-full bg-transparent px-3 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  disabled={isScanning}
                />
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/30 active:scale-95 transition cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin shrink-0" />
                    <span>{t.hero.scanningText}</span>
                  </>
                ) : (
                  <>
                    <span>{t.hero.ctaAnalyze}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* One-Click Demo Profiles */}
          <div className="pt-2 flex flex-col items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">{t.hero.orTryDemo}</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {Object.entries(SAMPLE_PROFILES).map(([key, prof]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setUrlInput(prof.url);
                    handleRunAudit(prof.url, prof.raw, key);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold transition active:scale-95 cursor-pointer ${
                    activeDemoProfile === key
                      ? 'bg-indigo-600/30 border-indigo-400 text-cyan-300 shadow-md'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? prof.nameAr : prof.name}
                </button>
              ))}
            </div>
          </div>

        </section>

        {/* Live Scanning Step Feedback */}
        {isScanning && (
          <section className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl border border-indigo-500/40 bg-[#0d0d16] space-y-5 shadow-2xl shadow-indigo-950/50 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-cyan-300 flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                {t.hero.scanningText}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">{lang === 'ar' ? `خطوة ${scanStep}/5` : `Step ${scanStep}/5`}</span>
                <span className="font-mono text-sm font-black px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {scanPercent}%
                </span>
              </div>
            </div>

            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-150 shadow-lg shadow-cyan-500/50"
                style={{ width: `${scanPercent}%` }}
              />
            </div>

            <div className="text-xs text-slate-300 font-mono space-y-2 pt-1">
              <div className={scanStep >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                ✓ {t.scanning.step1}
              </div>
              <div className={scanStep >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {scanStep >= 2 ? '✓' : '○'} {t.scanning.step2}
              </div>
              <div className={scanStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {scanStep >= 3 ? '✓' : '○'} {t.scanning.step3}
              </div>
              <div className={scanStep >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {scanStep >= 4 ? '✓' : '○'} {t.scanning.step4}
              </div>
              <div className={scanStep >= 5 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {scanStep >= 5 ? '✓' : '○'} {t.scanning.step5}
              </div>
            </div>
          </section>
        )}

        {/* Scan Error Banner */}
        {scanError && !isScanning && (
          <div className="max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-300 flex items-center gap-3 animate-in fade-in duration-300 shadow-xl">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <p className="text-sm font-medium">{scanError}</p>
          </div>
        )}

        {/* Audit Results Dashboard */}
        {report && !isScanning && (
          <div id="audit-results" className="space-y-10 animate-in fade-in duration-500 scroll-mt-24">
            
            {/* Overall Score Banner Card */}
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#12121a] via-[#0c0c12] to-[#07070a] p-6 sm:p-8 shadow-2xl">
              
              {/* Snapshot Header Details */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-cyan-300">
                      {lang === 'ar' ? `رقم اللقطة: #${report.id}` : `Snapshot ID: #${report.id}`}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {report.engineVersion}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white break-all">
                    {report.url}
                  </h2>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setUrlInput('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setTimeout(() => {
                        (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus();
                      }, 400);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-bold text-cyan-300 transition cursor-pointer active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.scoreSection.scanAnother}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShareSnapshot}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition cursor-pointer"
                  >
                    {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{copiedShareLink ? t.nav.reportShared : t.agencyBanner.ctaCopyLink}</span>
                  </button>
                </div>
              </div>

              {/* Executive Summary Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-5 pb-2">
                <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400">
                  {report.criticalBlockers.length} {lang === 'ar' ? 'عوائق حرجة' : 'Critical Blockers'}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  {report.allIssues.length} {lang === 'ar' ? 'مشكلة مكتشفة' : 'Issues Found'}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  {report.evidenceLedger.filter(e => e.status === 'pass').length} {lang === 'ar' ? 'فحص ناجح' : 'Checks Passed'}
                </span>
              </div>

              {/* Score & 5 Category Breakdown Grid */}
              <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Master Score Ring (Animated SVG) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-[#09090e]/80 text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t.scoreSection.overallTitle}
                  </span>
                  
                  <div className="relative h-32 w-32 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        strokeWidth="8" strokeLinecap="round"
                        className={`transition-all duration-1000 ease-out ${report.overallScore >= 80 ? 'stroke-emerald-400' : report.overallScore >= 50 ? 'stroke-amber-400' : 'stroke-rose-400'}`}
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - report.overallScore / 100)}`}
                      />
                    </svg>
                    <span className={`relative text-4xl font-black ${report.overallScore >= 80 ? 'text-emerald-400' : report.overallScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {report.overallScore}
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getScoreColor(report.overallScore)}`}>
                    {getScoreBadgeText(report.overallScore)}
                  </span>

                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                    {t.scoreSection.scoreExplanation}
                  </p>
                </div>

                {/* 5 Dimension Metrics — Dynamic Colors */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d14] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">{t.scoreSection.technicalSEO}</span>
                      <span className={`font-mono font-bold ${getCategoryTextColor(report.categoryScores.technicalSEO)}`}>{report.categoryScores.technicalSEO}/100</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className={`${getCategoryBarColor(report.categoryScores.technicalSEO)} h-full rounded-full transition-all duration-700`} style={{ width: `${report.categoryScores.technicalSEO}%` }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d14] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">{t.scoreSection.crawlability}</span>
                      <span className={`font-mono font-bold ${getCategoryTextColor(report.categoryScores.crawlability)}`}>{report.categoryScores.crawlability}/100</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className={`${getCategoryBarColor(report.categoryScores.crawlability)} h-full rounded-full transition-all duration-700`} style={{ width: `${report.categoryScores.crawlability}%` }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d14] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">{t.scoreSection.contentAnswerability}</span>
                      <span className={`font-mono font-bold ${getCategoryTextColor(report.categoryScores.contentAnswerability)}`}>{report.categoryScores.contentAnswerability}/100</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className={`${getCategoryBarColor(report.categoryScores.contentAnswerability)} h-full rounded-full transition-all duration-700`} style={{ width: `${report.categoryScores.contentAnswerability}%` }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d14] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">{t.scoreSection.entitySchema}</span>
                      <span className={`font-mono font-bold ${getCategoryTextColor(report.categoryScores.entitySchema)}`}>{report.categoryScores.entitySchema}/100</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className={`${getCategoryBarColor(report.categoryScores.entitySchema)} h-full rounded-full transition-all duration-700`} style={{ width: `${report.categoryScores.entitySchema}%` }} />
                    </div>
                  </div>

                  <div className="sm:col-span-2 p-4 rounded-xl border border-indigo-500/25 bg-indigo-950/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        {t.scoreSection.aiSearchReadiness}
                      </span>
                      <span className={`font-mono font-bold ${getCategoryTextColor(report.categoryScores.aiSearchReadiness)}`}>{report.categoryScores.aiSearchReadiness}/100</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: `${report.categoryScores.aiSearchReadiness}%` }} />
                    </div>
                  </div>

                </div>

              </div>

              {/* Live Extracted Real Data Transparency Card */}
              <div className={`mt-6 p-4 rounded-2xl border space-y-3 ${
                report.evidence.htmlFetched
                  ? 'border-cyan-500/20 bg-cyan-950/15'
                  : 'border-amber-500/20 bg-amber-950/15'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={`flex items-center gap-2 ${report.evidence.htmlFetched ? 'text-cyan-300' : 'text-amber-300'}`}>
                    <Globe className={`w-4 h-4 ${report.evidence.htmlFetched ? 'text-cyan-400' : 'text-amber-400'}`} />
                    {report.evidence.htmlFetched
                      ? (lang === 'ar' ? 'البيانات الحقيقية المستخرجة مباشرة من كود الصفحة:' : 'Live Data Extracted Directly From Target HTML:')
                      : (lang === 'ar' ? 'لم يتمكن المحرك من جلب كود HTML (حماية CORS/WAF):' : 'HTML Could Not Be Fetched (CORS/WAF Protection):')
                    }
                  </span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${
                    report.evidence.htmlFetched
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {report.evidence.htmlFetched ? (lang === 'ar' ? 'تم الاستخراج' : 'Fetched') : (lang === 'ar' ? 'محظور' : 'Blocked')}
                  </span>
                </div>

                {report.evidence.htmlFetched ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {lang === 'ar' ? 'عنوان الصفحة الفعلي (<title>):' : 'Live Page Title (<title>):'}
                      </span>
                      <p className={`font-mono text-[11px] truncate ${report.evidence.title ? 'text-white' : 'text-rose-400 italic'}`}>
                        {report.evidence.title || (lang === 'ar' ? 'لم يُعثر عليه في HTML' : 'Not found in HTML')}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {lang === 'ar' ? 'العنوان الرئيسي الفعلي (<h1>):' : 'Live Primary Heading (<h1>):'}
                      </span>
                      <p className={`font-mono text-[11px] truncate ${report.evidence.h1Tags.length > 0 ? 'text-white' : 'text-rose-400 italic'}`}>
                        {report.evidence.h1Tags[0] || (lang === 'ar' ? 'لم يُعثر على وسم H1' : 'No <h1> tag detected')}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1 md:col-span-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {lang === 'ar' ? 'الوصف التعريفي الفعلي (<meta description>):' : 'Live Meta Description:'}
                      </span>
                      <p className={`font-mono text-[11px] line-clamp-2 ${report.evidence.metaDescription ? 'text-slate-300' : 'text-rose-400 italic'}`}>
                        {report.evidence.metaDescription || (lang === 'ar' ? 'لم يُعثر على وصف تعريفي' : 'No meta description found in HTML')}
                      </p>
                    </div>

                    {report.evidence.schemaTypesDetected.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1 md:col-span-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          {lang === 'ar' ? 'أنواع السكيما المكتشفة (JSON-LD):' : 'Detected Schema Types (JSON-LD):'}
                        </span>
                        <p className="font-mono text-[11px] text-emerald-400">
                          {report.evidence.schemaTypesDetected.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-black/30 border border-amber-500/10 text-xs text-amber-300/80">
                    <p>
                      {lang === 'ar'
                        ? 'لم يتمكن محرك الفحص من جلب كود HTML بسبب حماية CORS أو جدار حماية الموقع. النتائج أدناه مبنية على ملف robots.txt والإشارات المتاحة فقط. لتحقيق أفضل نتائج، افحص موقعك مباشرة من نفس النطاق.'
                        : 'The audit engine could not fetch the HTML due to CORS restrictions or WAF protection. Results below are based on robots.txt and available signals only. For best results, run the audit from the same domain.'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Raw Evidence Ledger Accordion */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEvidenceLedger(!showEvidenceLedger)}
                  className="flex items-center justify-between w-full text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-indigo-400" />
                    <span>{t.scoreSection.evidenceLedgerTitle}</span>
                  </div>
                  {showEvidenceLedger ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showEvidenceLedger && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
                    {report.evidenceLedger.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-white/10 bg-[#08080c] space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-slate-300">{lang === 'ar' ? item.nameAr : item.name}</span>
                          <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                            item.status === 'pass'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : item.status === 'fail'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : item.status === 'warning'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {lang === 'ar' ? item.detailAr : item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Top 3 Detected Blockers (Free Teaser Cards) */}
            <section className="space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t.blockers.badge}</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {t.blockers.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {t.blockers.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                {report.criticalBlockers.map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-2xl border border-rose-500/30 bg-[#0f0b12] p-5 space-y-4 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border border-rose-500/40 bg-rose-500/15 text-rose-300">
                          {issue.severity.toUpperCase()} ({issue.weight}x {t.blockers.impactLabel})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {issue.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">
                        {lang === 'ar' ? issue.titleAr : issue.title}
                      </h4>

                      {/* Signal & Evidence */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-rose-300">
                        <span className="text-slate-400 block text-[10px] uppercase">{t.blockers.evidenceLabel}</span>
                        {lang === 'ar' ? issue.evidenceAr : issue.evidence}
                      </div>

                      {/* Why it Matters */}
                      <div className="text-xs text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-200">{t.blockers.whyMattersLabel} </span>
                        {lang === 'ar' ? issue.whyItMattersAr : issue.whyItMatters}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedIssueForFix(issue)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition cursor-pointer active:scale-95 mt-2"
                    >
                      <span>{t.blockers.viewFixBtn}</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Locked Opportunities & $9 Paywall Section */}
            {!isProUnlocked ? (
              <section className="relative rounded-3xl border border-indigo-500/30 bg-[#0c0c14] p-6 sm:p-10 shadow-2xl overflow-hidden">
                
                {/* Background Blurred Teasers */}
                <div className="space-y-4 select-none filter blur-[5px] pointer-events-none opacity-40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.lockedIssues.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-1">
                        <span className="text-xs font-bold text-amber-400">{lang === 'ar' ? `فرصة #${idx + 4}` : `Opportunity #${idx + 4}`}: {lang === 'ar' ? item.titleAr : item.title}</span>
                        <p className="text-[11px] text-slate-400">{lang === 'ar' ? item.signalDetectedAr : item.signalDetected}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion Overlay Box */}
                <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5 pt-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/40 bg-indigo-500/15 text-xs font-bold text-cyan-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{t.lockedSection.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {t.lockedSection.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {t.lockedSection.subtitle}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left rtl:text-right text-xs text-slate-200 py-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.lockedSection.feature1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.lockedSection.feature2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.lockedSection.feature3}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.lockedSection.feature4}</span>
                    </div>
                  </div>

                  <div className="pt-3 space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowPaywall(true)}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-indigo-500/30 active:scale-95 transition cursor-pointer cta-glow-pulse"
                    >
                      {t.lockedSection.ctaUnlockAll}
                    </button>
                    <p className="text-[11px] text-slate-400">
                      {t.lockedSection.ctaSubtext}
                    </p>
                  </div>
                </div>

              </section>
            ) : (
              /* UNLOCKED FULL AUDIT VIEW */
              <div className="space-y-10 animate-in fade-in duration-300">
                
                {/* Full Issues List */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {t.issuesSection.title} ({report.allIssues.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        {t.issuesSection.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.allIssues.map((issue, idx) => (
                      <div
                        key={issue.id}
                        className="rounded-xl border border-white/10 bg-[#0e0e14] p-4 space-y-2.5 hover:border-indigo-500/40 transition flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                              issue.severity === 'critical'
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                                : issue.severity === 'high'
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                            }`}>
                              #{idx + 1} {issue.severity.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{issue.category}</span>
                          </div>

                          <h4 className="font-bold text-xs sm:text-sm text-white">
                            {lang === 'ar' ? issue.titleAr : issue.title}
                          </h4>

                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                            {lang === 'ar' ? issue.whyItMattersAr : issue.whyItMatters}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedIssueForFix(issue)}
                          className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-indigo-600 text-slate-200 hover:text-white font-semibold text-xs transition cursor-pointer border border-white/10"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>{t.issuesSection.generateFix}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* AI Search Opportunity Finder Matrix */}
                <section className="rounded-3xl border border-indigo-500/30 bg-[#0d0d16] p-6 sm:p-8 space-y-6">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>{t.opportunitySection.badge}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {t.opportunitySection.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {t.opportunitySection.subtitle}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {report.aiOpportunities.map((opp, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-white/10 bg-[#08080d] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-xs sm:text-sm text-white block">
                            "{lang === 'ar' ? opp.queryAr : opp.query}"
                          </span>
                          <p className="text-xs text-slate-400">
                            {lang === 'ar' ? opp.reasonAr : opp.reason}
                          </p>
                        </div>

                        <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                          opp.status === 'covered'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : opp.status === 'partially_covered'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}>
                          {opp.status === 'covered' ? t.opportunitySection.coveredTag : opp.status === 'partially_covered' ? t.opportunitySection.partiallyCoveredTag : t.opportunitySection.missingTag}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* Agency Sales Weapon Banner */}
            <section className="rounded-2xl border border-white/10 bg-[#0b0b10] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>{t.agencyBanner.title}</span>
                </h4>
                <p className="text-xs text-slate-400">
                  {t.agencyBanner.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={handleShareSnapshot}
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
              >
                {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShareLink ? t.nav.reportShared : t.agencyBanner.ctaCopyLink}</span>
              </button>
            </section>

          </div>
        )}

        {/* Authoritative 2026 Knowledge Standard Section */}
        <section className="pt-8 sm:pt-12 border-t border-white/10 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/30 text-[10px] sm:text-xs font-bold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.knowledge.badge}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {t.knowledge.h2}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.knowledge.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl border border-white/10 bg-[#0c0c12] space-y-2 hover:border-indigo-500/30 transition">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.knowledge.p1Title}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.knowledge.p1Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0c0c12] space-y-2 hover:border-cyan-500/30 transition">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t.knowledge.p2Title}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.knowledge.p2Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0c0c12] space-y-2 hover:border-indigo-500/30 transition">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{t.knowledge.p3Title}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.knowledge.p3Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#0c0c12] space-y-2 hover:border-amber-500/30 transition">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.knowledge.p4Title}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.knowledge.p4Desc}
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Global Authority Footer */}
      <footer className="mt-20 border-t border-white/10 bg-[#050508] pt-12 pb-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand & Description */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-black text-white tracking-tight">
                  {t.nav.brandTitle}<span className="text-indigo-400">.AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.footer.brandDesc}
              </p>
              <span className="inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-300">
                {AUDIT_ENGINE_VERSION}
              </span>
            </div>

            {/* Column 2: Crawlers & Standards */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                {t.footer.crawlersTitle}
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-mono">✓</span> OAI-SearchBot (ChatGPT)</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-mono">✓</span> Googlebot & Google-Extended</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-mono">✓</span> PerplexityBot Discovery</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-mono">✓</span> Bingbot & ClaudeBot</li>
              </ul>
            </div>

            {/* Column 3: Frameworks Supported */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                {t.footer.platformsTitle}
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>• WordPress & WooCommerce</li>
                <li>• Next.js 15 (App Router)</li>
                <li>• Shopify Liquid Themes</li>
                <li>• Schema.org v26.0 Graph</li>
              </ul>
            </div>

            {/* Column 4: Trust & Guarantee */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.footer.guaranteeTitle}</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.footer.guaranteeDesc}
              </p>
              <div className="pt-1">
                <a
                  href="mailto:support@schemacraft-ai.site"
                  className="text-[11px] font-mono text-cyan-300 hover:underline flex items-center gap-1"
                >
                  ✉ support@schemacraft-ai.site
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px]">
            <p className="text-slate-500">
              {t.footer.rights}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <span className="hover:text-white transition cursor-pointer">{t.footer.privacy}</span>
              <span>•</span>
              <span className="hover:text-white transition cursor-pointer">{t.footer.terms}</span>
              <span>•</span>
              <span className="hover:text-white transition cursor-pointer">{t.footer.whitepaper}</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive Platform Fix Generator Modal */}
      <FixGeneratorModal
        issue={selectedIssueForFix}
        targetUrl={report?.url || 'https://example.com'}
        siteType={report?.detectedSiteType || 'saas'}
        lang={lang}
        onClose={() => setSelectedIssueForFix(null)}
      />

      {/* $9 PayPal Checkout Paywall Modal */}
      {showPaywall && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowPaywall(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#12121a] p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button X */}
            <button
              type="button"
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition cursor-pointer"
              title={t.modal.close}
            >
              <XCircle className="w-5 h-5" />
            </button>
            
            <div className="text-center space-y-1.5 pt-2">
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-cyan-300">
                <Zap className="w-5 h-5 fill-cyan-300/20" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">
                {t.modal.title}
              </h3>
              <p className="text-xs text-slate-400">
                {t.modal.subtitle}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-center space-y-1">
              <div className="text-xl font-black text-white">
                {t.modal.price}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.modal.guarantee}</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <PayPalCheckout onSuccess={handlePaymentSuccess} price="9.00" />
            </div>

            <div className="text-center space-y-1 border-t border-white/10 pt-3">
              <p className="text-[10px] text-slate-400">{t.modal.support}</p>
              <button
                type="button"
                onClick={() => setShowPaywall(false)}
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                {t.modal.cancel}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
