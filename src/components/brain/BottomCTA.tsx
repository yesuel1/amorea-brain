"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function BottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-6 px-4">
      <div className="max-w-mobile mx-auto">
        <Link href="/brain/test" className="block">
          <Button fullWidth size="lg" className="shadow-xl shadow-vb-coral/30">
            🧠 지금 무료로 뇌 나이 측정하기
          </Button>
        </Link>
        <p className="text-center text-vb-muted text-xs mt-2">
          3분이면 끝나요 · 무료 3회 제공
        </p>
      </div>
    </div>
  );
}
