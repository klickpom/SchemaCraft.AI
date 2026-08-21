import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 max-w-md space-y-4 shadow-2xl">
        <h2 className="text-3xl font-black text-white">404</h2>
        <p className="text-sm text-slate-400">Page not found in SchemaCraft AI.</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
        >
          Return to Workspace
        </Link>
      </div>
    </div>
  );
}
