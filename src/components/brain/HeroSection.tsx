"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative pt-16 overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-vb-navy via-vb-navy to-vb-teal/30" />

      {/* 배경 파티클 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 컨텐츠 */}
      <div className="relative max-w-mobile mx-auto px-4 py-16 text-center">
        {/* 메인 카피 */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          <span className="inline-block bg-gradient-to-r from-white via-vb-teal to-white bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
            뇌 습관,
          </span>
          <br />
          미리 만들어야
          <br />
          늦지 않습니다
        </h1>

        {/* 서브 카피 */}
        <p className="text-vb-silver text-lg mb-8 leading-relaxed">
          매일 10분, 재미있는 게임으로
          <br />
          뇌를 깨우고 좋은 습관으로
          <br />
          젊은 뇌를 유지하세요
        </p>

        {/* CTA 버튼 */}
        <Link href="/brain/test">
          <Button size="lg" className="text-lg px-10">
            🧠 내 뇌 나이 알아보기
          </Button>
        </Link>

        {/* 사용자 수 */}
        <p className="mt-6 text-vb-silver/70 text-sm">
          지금까지 <span className="text-vb-teal font-semibold">12,847명</span>이 측정했어요
        </p>
      </div>

      {/* 하단 웨이브 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#FAFAF7"
          />
        </svg>
      </div>
    </section>
  );
}
