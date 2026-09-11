import React from 'react';

export function ArticlePage({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
        {title}
      </h1>
      <p className="mt-4 text-base text-slate-300 leading-relaxed">{lede}</p>
      <div className="mt-10 space-y-6 text-sm sm:text-[15px] text-slate-300 leading-relaxed [&_h2]:text-white [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-2 [&_p]:text-slate-300 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-cyan-300 [&_a]:underline">
        {children}
      </div>
    </main>
  );
}
