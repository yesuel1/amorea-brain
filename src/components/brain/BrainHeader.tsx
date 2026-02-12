"use client";

import Link from "next/link";

export function BrainHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-vb-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-mobile mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/brain" className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <div className="flex flex-col">
            <span className="font-display font-bold text-white text-sm tracking-tight">
              AMOREA
            </span>
            <span className="font-display text-vb-teal text-xs tracking-wider">
              BRAIN CARE
            </span>
          </div>
        </Link>

        {/* 연속일수 뱃지 */}
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
          <span className="text-orange-400">🔥</span>
          <span className="text-white text-sm font-semibold">12일</span>
        </div>
      </div>
    </header>
  );
}
