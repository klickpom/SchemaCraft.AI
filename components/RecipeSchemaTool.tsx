'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import {
  Utensils,
  Clock,
  Flame,
  Users,
  Star,
  Sparkles,
  Copy,
  Check,
  Code2,
  Eye,
  CheckCircle2,
  ChefHat,
} from 'lucide-react';

interface RecipeSchemaToolProps {
  lang: Language;
}

export default function RecipeSchemaTool({ lang }: RecipeSchemaToolProps) {
  const [name, setName] = useState('Authentic Mediterranean Grilled Salmon Bowl');
  const [description, setDescription] = useState(
    'Crispy pan-seared wild salmon served over lemon herb quinoa, roasted chickpeas, and fresh avocado tzatziki.'
  );
  const [imageUrl, setImageUrl] = useState('https://schemacraft-ai.site/og-image.png');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState('15');
  const [cookTimeMinutes, setCookTimeMinutes] = useState('20');
  const [servings, setServings] = useState('4');
  const [calories, setCalories] = useState('420 kcal');
  const [cuisine, setCuisine] = useState('Mediterranean');
  const [rating, setRating] = useState('4.9');
  const [reviews, setReviews] = useState('384');
  const [ingredients, setIngredients] = useState(
    '4 fresh salmon fillets (6 oz each)\n1 cup organic quinoa (cooked in vegetable broth)\n1 ripe avocado (sliced)\n1 cup English cucumber (diced)\n2 tbsp extra virgin olive oil\n1 lemon (juiced)\nFresh dill and sea salt to taste'
  );
  const [instructions, setInstructions] = useState(
    'Rinse and cook quinoa in simmering vegetable broth for 15 minutes.\nSeason salmon fillets generously with sea salt, black pepper, and olive oil.\nSear salmon in a cast-iron skillet over medium-high heat for 4 minutes per side.\nAssemble bowls with quinoa base, flaked salmon, cucumber, avocado, and fresh dill.'
  );
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const generateJsonLdObj = () => {
    const ingredientList = ingredients
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);

    const instructionList = instructions
      .split('\n')
      .map((ins) => ins.trim())
      .filter(Boolean)
      .map((ins, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        text: ins,
      }));

    return {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: name,
      image: [imageUrl],
      description: description,
      prepTime: `PT${prepTimeMinutes}M`,
      cookTime: `PT${cookTimeMinutes}M`,
      totalTime: `PT${parseInt(prepTimeMinutes || '0') + parseInt(cookTimeMinutes || '0')}M`,
      recipeYield: `${servings} servings`,
      recipeCuisine: cuisine,
      recipeCategory: 'Main Course',
      nutrition: {
        '@type': 'NutritionInformation',
        calories: calories,
      },
      recipeIngredient: ingredientList,
      recipeInstructions: instructionList,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviews,
        bestRating: '5',
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-950/40 text-[10px] sm:text-xs font-bold text-orange-300">
            <ChefHat className="w-3.5 h-3.5 text-orange-400" />
            <span>{lang === 'ar' ? 'سكيما الوصفات والطهي والقيم الغذائية' : 'Google Recipe & Culinary Nutrition Architect'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'تفعيل بطاقات الوصفات الغنية والسعرات الحرارية في نتائج بحث جوجل'
              : 'Unlock Google Recipe Rich Cards & Calorie Snippets'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ar'
              ? 'ولد كود Recipe معتمد للمدونات ومواقع الطهي مع توثيق مدة التحضير والطهي والمكونات والقيم الغذائية ونجوم التقييم.'
              : 'Construct Schema.org/Recipe JSON-LD with verified prep/cook durations, nutritional microdata, and guided cooking step arrays.'}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-orange-300 shrink-0">
          Schema.org/Recipe
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'ar' ? 'معايير الوصفة والمكونات:' : 'Recipe Parameters & Ingredients:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'اسم الوصفة / الوجبة:' : 'Recipe Title:'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'مدة التحضير (دقيقة):' : 'Prep Time (Mins):'}
              </label>
              <input
                type="number"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'مدة الطهي (دقيقة):' : 'Cook Time (Mins):'}
              </label>
              <input
                type="number"
                value={cookTimeMinutes}
                onChange={(e) => setCookTimeMinutes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-cyan-300 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'عدد الحصص (Servings):' : 'Servings Yield:'}
              </label>
              <input
                type="text"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'السعرات الحرارية:' : 'Calories (Nutrition):'}
              </label>
              <input
                type="text"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-emerald-400 focus:outline-none focus:border-orange-500 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'المكونات (سطر لكل مكون):' : 'Recipe Ingredients (1 per line):'}
              </label>
              <textarea
                rows={3}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {lang === 'ar' ? 'خطوات التحضير (سطر لكل خطوة):' : 'Cooking Instructions (1 per line):'}
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-orange-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Google Recipe SERP Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Google Recipe Card</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
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
              <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ كود الوصفة' : 'Copy Recipe Schema')}</span>
            </button>
          </div>

          {activeTab === 'preview' ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#202124] border border-white/10 space-y-3 font-sans shadow-xl text-left">
              <div className="text-[11px] text-[#bdc1c6] font-mono leading-none truncate">
                https://schemacraft-ai.site/recipes/grilled-salmon
              </div>
              <h3 className="text-base font-bold text-[#8ab4f8] leading-snug hover:underline cursor-pointer">
                {name}
              </h3>

              {/* Badges Bar */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <div className="flex items-center gap-1 text-[#fbbc04] text-xs">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-[#fbbc04]" />
                    ))}
                  </div>
                  <span className="text-[#bdc1c6] text-xs font-mono font-bold">
                    {rating} ({reviews})
                  </span>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {parseInt(prepTimeMinutes || '0') + parseInt(cookTimeMinutes || '0')} mins total
                </span>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {calories}
                </span>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {servings} servings
                </span>
              </div>

              <p className="text-xs text-[#bdc1c6] leading-relaxed pt-1">
                {description}
              </p>

              {/* Ingredients preview */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-300">Key Ingredients:</span>
                <p className="text-[11px] text-[#bdc1c6] line-clamp-2">
                  {ingredients.replace(/\n/g, ', ')}
                </p>
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
