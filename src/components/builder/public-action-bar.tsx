"use client";

import { Link } from "@/i18n/routing";

export function PublicActionBar({ resumeTitle }: { resumeTitle: string }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black print:hidden">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm line-clamp-1">{resumeTitle}</span>
          <span className="text-xs text-gray-500 uppercase tracking-widest hidden sm:inline-block">
            Public View
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors hidden sm:inline-block"
          >
            Build yours for free
          </Link>
          <button
            onClick={handlePrint}
            className="border border-black bg-black text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
          >
            Print / Save
          </button>
        </div>
      </div>
    </div>
  );
}
