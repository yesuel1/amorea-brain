"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShareSheet } from "@/components/ui/ShareSheet";
import { trackBrainTestComplete } from "@/lib/analytics";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showShareSheet, setShowShareSheet] = useState(false);

  // URL 파라미터에서 점수 가져오기
  const memoryScore = parseInt(searchParams.get("memory") || "0", 10);
  const calcScore = parseInt(searchParams.get("calc") || "0", 10);
  const focusScore = parseInt(searchParams.get("focus") || "0", 10);

  // 평균 점수 계산
  const avgScore = Math.round((memoryScore + calcScore + focusScore) / 3);

  // 뇌나이 계산: 70 - (평균점수 × 0.45), 최소 25세, 최대 75세
  const rawBrainAge = 70 - avgScore * 0.45;
  const brainAge = Math.max(25, Math.min(75, Math.round(rawBrainAge)));

  // 동년배 상위 % 계산 (점수 기반 추정)
  const percentile = Math.max(1, Math.min(99, Math.round(100 - avgScore)));

  // 점수별 레벨
  const getScoreLevel = (score: number) => {
    if (score >= 90) return { label: "최상", color: "text-vb-teal" };
    if (score >= 70) return { label: "상", color: "text-vb-blue" };
    if (score >= 50) return { label: "중", color: "text-vb-gold" };
    return { label: "향상필요", color: "text-vb-coral" };
  };

  useEffect(() => {
    // 결과 추적
    trackBrainTestComplete(brainAge, avgScore, percentile);
  }, [brainAge, avgScore, percentile]);

  const scores = [
    { name: "기억력", score: memoryScore, icon: "🧩" },
    { name: "계산력", score: calcScore, icon: "🔢" },
    { name: "집중력", score: focusScore, icon: "🎯" },
  ];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen pt-20 pb-32 px-4">
      <div className="max-w-mobile mx-auto">
        {/* 뇌나이 히어로 */}
        <div className="bg-gradient-to-br from-vb-navy to-vb-charcoal rounded-3xl p-8 text-center mb-6 relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-white rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <p className="text-vb-silver text-sm mb-2">당신의 뇌나이는</p>

          <div className="relative inline-block">
            <span className="text-7xl font-bold bg-gradient-to-r from-white via-vb-teal to-white bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
              {brainAge}
            </span>
            <span className="text-2xl text-white ml-1">세</span>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
            <span className="text-vb-teal font-bold">동년배 상위 {percentile}%</span>
            <span className="text-2xl">🏆</span>
          </div>
        </div>

        {/* 영역별 점수 */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-vb-black mb-4">영역별 점수</h2>

          <div className="space-y-4">
            {scores.map((item) => {
              const level = getScoreLevel(item.score);
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="font-medium text-vb-black">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${level.color}`}>
                        {level.label}
                      </span>
                      <span className="font-bold text-vb-black">{item.score}점</span>
                    </div>
                  </div>
                  <div className="h-3 bg-vb-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-vb-coral via-vb-gold to-vb-teal rounded-full transition-all duration-1000"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 총평 */}
        <Card variant="gradient" className="mb-6">
          <div className="text-center">
            <span className="text-4xl mb-3 block">
              {avgScore >= 80 ? "🌟" : avgScore >= 60 ? "💪" : "🔥"}
            </span>
            <p className="text-white leading-relaxed">
              {avgScore >= 80 && "뛰어난 뇌 건강 상태입니다! 현재의 좋은 습관을 유지하세요."}
              {avgScore >= 60 &&
                avgScore < 80 &&
                "좋은 상태입니다! 꾸준한 뇌 운동으로 더 좋아질 수 있어요."}
              {avgScore < 60 &&
                "지금부터 시작하면 됩니다! 매일 10분 뇌 운동으로 젊은 뇌를 유지하세요."}
            </p>
          </div>
        </Card>

        {/* 추천 행동 */}
        <Card className="mb-6">
          <h2 className="text-lg font-bold text-vb-black mb-3">추천 행동</h2>
          <ul className="space-y-2 text-sm text-vb-charcoal">
            <li className="flex items-start gap-2">
              <span className="text-vb-teal">✓</span>
              매일 10분 뇌운동 게임하기
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vb-teal">✓</span>
              뇌 건강 영양제 꾸준히 복용하기
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vb-teal">✓</span>
              하루 30분 걷기 운동
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vb-teal">✓</span>
              충분한 수면 취하기
            </li>
          </ul>
        </Card>

        {/* 버튼들 */}
        <div className="space-y-3">
          <Button fullWidth onClick={() => setShowShareSheet(true)}>
            🎉 결과 공유하기
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push("/brain")}>
            습관 시작하기
          </Button>
          <Button variant="ghost" fullWidth onClick={() => router.push("/brain/test")}>
            다시 측정하기
          </Button>
        </div>
      </div>

      {/* 공유 시트 */}
      <ShareSheet
        isOpen={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        title={`나의 뇌나이는 ${brainAge}세!`}
        text={`AMOREA Brain Care에서 뇌나이를 측정했어요. 동년배 상위 ${percentile}%! 🧠`}
        url={shareUrl}
        contentType="brain_test"
      />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">결과 불러오는 중...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
