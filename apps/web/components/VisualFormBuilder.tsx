'use client';

import React from 'react';
import { SchemaCategory, SCHEMA_DEFINITIONS, SchemaFieldConfig } from '@/lib/schemaTypes';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

interface VisualFormBuilderProps {
  category: SchemaCategory;
  values: Record<string, any>;
  onChange: (newValues: Record<string, any>) => void;
  lang?: 'en' | 'ar';
}

const LABEL_AR: Record<string, string> = {
  'Application Name': 'اسم التطبيق',
  Category: 'الفئة',
  'Operating System': 'نظام التشغيل',
  Description: 'الوصف',
  'Application URL': 'رابط التطبيق',
  Price: 'السعر',
  Currency: 'العملة',
  'Rating (0-5)': 'التقييم (0-5)',
  'Rating Count': 'عدد التقييمات',
  'Developer / Company Name': 'اسم المطوّر أو الشركة',
  'Product Name': 'اسم المنتج',
  'Product Description': 'وصف المنتج',
  'Image URL': 'رابط الصورة',
  'Brand Name': 'اسم العلامة',
  'SKU / Model Number': 'رمز المنتج',
  Availability: 'التوفر',
  'Average Rating': 'متوسط التقييم',
  'Total Reviews': 'عدد المراجعات',
  'FAQ Items (Question & Answer)': 'الأسئلة والأجوبة',
  'Business Name': 'اسم النشاط',
  'Storefront Image URL': 'رابط صورة الواجهة',
  'Phone Number': 'رقم الهاتف',
  'Street Address': 'الشارع',
  City: 'المدينة',
  'State / Province': 'المنطقة',
  'Postal / ZIP Code': 'الرمز البريدي',
  Country: 'الدولة',
  'Price Range (e.g. $$)': 'نطاق السعر',
  'Opening Hours': 'ساعات العمل',
  'Headline / Title': 'العنوان',
  'Article Summary': 'ملخص المقال',
  'Cover Image URL': 'رابط صورة الغلاف',
  'Author Name': 'اسم المؤلف',
  'Publisher / Publication': 'الناشر',
  'Date Published (YYYY-MM-DD)': 'تاريخ النشر',
  'Date Modified (YYYY-MM-DD)': 'تاريخ التعديل',
  'Guide Title': 'عنوان الدليل',
  'Total Time (ISO 8601, e.g. PT5M)': 'المدة الكلية',
  'Steps (Name & Text)': 'الخطوات',
  'Organization Name': 'اسم المنظمة',
  'Website URL': 'رابط الموقع',
  'Logo URL': 'رابط الشعار',
  'Corporate Bio': 'نبذة',
  'Social Profiles (comma separated)': 'الحسابات، مفصولة بفاصلة',
  'Item / Service Reviewed': 'العنصر المُراجَع',
  'Review text': 'نص المراجعة',
  'Reviewer name': 'اسم المراجع',
  'Rating (1-5)': 'التقييم (1-5)',
  'Max rating': 'أعلى تقييم',
  'Course Title': 'عنوان الدورة',
  'Course Overview': 'وصف الدورة',
  'Academy / Issuer': 'الجهة',
  'Event Title': 'عنوان الفعالية',
  'Start Date (YYYY-MM-DD)': 'تاريخ البداية',
  'Virtual URL or Venue': 'المكان أو رابط البث',
  'Ticket Price': 'سعر التذكرة',
  'Clinic / Practice Name': 'اسم العيادة',
  'Medical Specialty': 'التخصص',
  'State / Region': 'المنطقة',
  'Postal Code': 'الرمز البريدي',
  'Price Range': 'نطاق السعر',
  'Law Firm Name': 'اسم المكتب',
  State: 'الولاية',
  'Recipe Name': 'اسم الوصفة',
  'Cook Time (ISO 8601, e.g. PT45M)': 'وقت الطهي',
  'Prep Time (ISO 8601, e.g. PT20M)': 'وقت التحضير',
  'Yield / Servings': 'الحصص',
  Calories: 'السعرات',
  'Video Title': 'عنوان الفيديو',
  'Video Description': 'وصف الفيديو',
  'Thumbnail URL': 'رابط الصورة المصغرة',
  'Upload Date (YYYY-MM-DD)': 'تاريخ الرفع',
};

const DESC_AR: Partial<Record<SchemaCategory, string>> = {
  LocalBusiness: 'العنوان والهاتف وساعات العمل بصيغة يقرأها جوجل. هذا لا يضمن الحزمة المحلية.',
  MedicalBusiness: 'تخصص العيادة والعنوان والهاتف كما يظهران في الصفحة. الترميز لا يثبت ترخيصاً.',
  LegalService: 'مجال العمل والعنوان والهاتف. لا يضمن موضعاً في الحزمة المحلية.',
  Product: 'السعر والعملة والتوفر الظاهرون في الصفحة. لا تضف تقييماً غير موجود.',
  SoftwareApplication: 'فئة التطبيق ونظام التشغيل والسعر الظاهر. لا ضمان لنتيجة منسّقة.',
  FAQPage: 'أسئلة وأجوبة ظاهرة في الصفحة. جوجل لم يعد يعرض نتيجة الأسئلة لمعظم المواقع.',
  Article: 'العنوان والتواريخ والمؤلف. لا يضمن الظهور في Discover.',
  HowTo: 'خطوات مرتبة. جوجل أزال النتيجة المنسّقة لهذا النوع.',
  Organization: 'الاسم والشعار وحسابات موجودة فعلاً. لا يضمن لوحة معرفة.',
  Review: 'مراجعة ظاهرة في الصفحة فقط. لا تخترع تقييماً.',
  Course: 'عنوان الدورة والجهة والسعر الظاهر. الظهور قرار جوجل.',
  Event: 'تاريخ ومكان الفعالية. الظهور في نتائج الأحداث ليس مضموناً.',
  Recipe: 'المدة والمكونات والسعرات المكتوبة في الوصفة.',
  VideoObject: 'الصورة المصغرة والمدة وتاريخ الرفع. لا يضمن تبويب الفيديو.',
};

export function VisualFormBuilder({ category, values, onChange, lang = 'en' }: VisualFormBuilderProps) {
  const currentDef = SCHEMA_DEFINITIONS[category];

  const handleFieldChange = (fieldId: string, val: any) => {
    onChange({
      ...values,
      [fieldId]: val,
    });
  };

  // FAQ Array management
  const faqs = values.faqs || [];
  const handleFaqChange = (index: number, key: 'question' | 'answer', text: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [key]: text };
    handleFieldChange('faqs', updated);
  };
  const handleAddFaq = () => {
    handleFieldChange('faqs', [
      ...faqs,
      { question: 'What is the implementation timeline?', answer: 'Structured data updates immediately upon deployment.' },
    ]);
  };
  const handleRemoveFaq = (index: number) => {
    const updated = faqs.filter((_: any, i: number) => i !== index);
    handleFieldChange('faqs', updated);
  };

  // HowTo Steps Array management
  const steps = values.steps || [];
  const handleStepChange = (index: number, key: 'name' | 'text', text: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [key]: text };
    handleFieldChange('steps', updated);
  };
  const handleAddStep = () => {
    handleFieldChange('steps', [
      ...steps,
      { name: `Step ${steps.length + 1}`, text: 'Execute step instructions.' },
    ]);
  };
  const handleRemoveStep = (index: number) => {
    const updated = steps.filter((_: any, i: number) => i !== index);
    handleFieldChange('steps', updated);
  };

  return (
    <div className="space-y-4">
      {/* Category Info Header */}
      <div className="rounded-xl bg-indigo-950/30 border border-indigo-500/20 p-3.5 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-300">
            {lang === 'ar' ? `نوع جوجل: ${currentDef.googleRichResultType}` : `${currentDef.googleRichResultType} target`}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {lang === 'ar' ? (DESC_AR[category] ?? currentDef.description) : currentDef.description}
          </p>
        </div>
        <span className="inline-flex rounded-full bg-indigo-500/20 px-2.5 py-1 text-[11px] font-bold text-cyan-300 ring-1 ring-cyan-500/30 font-mono">
          {currentDef.badge}
        </span>
      </div>

      {/* Dynamic Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {currentDef.fields.map((field: SchemaFieldConfig) => {
          if (field.type === 'array-faq') {
            return (
              <div key={field.id} className="sm:col-span-2 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <span>Q&amp;A Questions &amp; Answers ({faqs.length})</span>
                    <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 px-2.5 py-1 rounded-xl transition-all font-bold cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Question
                  </button>
                </div>

                <div className="space-y-2.5">
                  {faqs.map((faq: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-black/60 p-3 space-y-2 relative group focus-within:border-indigo-500/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider">
                          QUESTION #{idx + 1}
                        </span>
                        {faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(idx)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                            title="Remove Question"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={faq.question || ''}
                        onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                        placeholder="e.g. How does this service work?"
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer || ''}
                        onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                        placeholder="Detailed answer text..."
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (field.type === 'array-howto') {
            return (
              <div key={field.id} className="sm:col-span-2 space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <span>HowTo Step Sequence ({steps.length})</span>
                    <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 px-2.5 py-1 rounded-xl transition-all font-bold cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add Step
                  </button>
                </div>

                <div className="space-y-2.5">
                  {steps.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-black/60 p-3 space-y-2 relative group focus-within:border-indigo-500/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider">
                          STEP #{idx + 1}
                        </span>
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                            title="Remove Step"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={step.name || ''}
                        onChange={(e) => handleStepChange(idx, 'name', e.target.value)}
                        placeholder="Step title (e.g. Initialize project)"
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                      <textarea
                        rows={2}
                        value={step.text || ''}
                        onChange={(e) => handleStepChange(idx, 'text', e.target.value)}
                        placeholder="Detailed instructions for this step..."
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          const isFullWidth = field.type === 'textarea' || field.id === 'name' || field.id === 'headline' || field.id === 'description' || field.id === 'sameAs';

          return (
            <div
              key={field.id}
              className={`space-y-1.5 ${isFullWidth ? 'sm:col-span-2' : 'sm:col-span-1'}`}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  {lang === 'ar' ? (LABEL_AR[field.label] ?? field.label) : field.label}
                  {field.required && <span className="text-rose-400 font-bold">*</span>}
                </label>
                {field.help && (
                  <span className="text-[10px] text-slate-500 cursor-help" title={field.help}>
                    <HelpCircle className="h-3 w-3 inline text-slate-400" />
                  </span>
                )}
              </div>

              {field.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={values[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl bg-black/60 border border-white/12 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-black/90 resize-none font-medium transition-all shadow-inner"
                />
              ) : field.type === 'select' ? (
                <select
                  value={values[field.id] || field.options?.[0]}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/12 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 focus:bg-black/90 font-medium transition-all shadow-inner cursor-pointer"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0e0e18] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={values[field.id] !== undefined ? values[field.id] : ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl bg-black/60 border border-white/12 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-black/90 font-medium transition-all shadow-inner"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
