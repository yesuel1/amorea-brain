"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MemoryGame } from "@/components/brain/games/MemoryGame";
import { CalcGame } from "@/components/brain/games/CalcGame";
import { FocusGame } from "@/components/brain/games/FocusGame";
import { SignupModal } from "@/components/ui/SignupModal";
import { canUseFree, decrementFreeUses, getSessionId } from "@/lib/free-usage";
import { trackBrainTestStart, trackFreeUse, trackPaywallShown } from "@/lib/analytics";

type GameType = "memory" | "calc" | "focus";

interface GameScore {
  type: GameType;
  score: number;
  duration: number;
}

const STEPS: { type: GameType; name: string; icon: string }[] = [
  { type: "memory", name: "기억력", icon: "🧩" },
  { type: "calc", name: "계산력", icon: "🔢" },
  { type: "focus", name: "집중력", icon: "🎯" },
];

export default function BrainTestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<GameScore[]>([]);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [canProceed, setCanProceed] = useState(true);

  useEffect(() => {
    // 무료 사용 체크
    if (!canUseFree()) {
      setCanProceed(false);
      setShowSignupModal(true);
      trackPaywallShown();
    } else {
      // 무료 횟수 차감 및 테스트 시작 추적
      const remaining = decrementFreeUses();
      trackFreeUse(remaining);
      trackBrainTestStart();
    }
  }, []);

  const handleGameComplete = (score: number, duration: number) => {
    const newScore: GameScore = {
      type: STEPS[currentStep].type,
      score,
      duration,
    };
    const updatedScores = [...scores, newScore];
    setScores(updatedScores);

    if (currentStep < STEPS.length - 1) {
      // 다음 게임으로
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500);
    } else {
      // 모든 테스트 완료 - 결과 페이지로 이동
      const sessionId = getSessionId();
      const queryParams = new URLSearchParams({
        memory: String(updatedScores.find((s) => s.type === "memory")?.score || 0),
        calc: String(updatedScores.find((s) => s.type === "calc")?.score || 0),
        focus: String(updatedScores.find((s) => s.type === "focus")?.score || 0),
        session: sessionId,
      });

      setTimeout(() => {
        router.push(`/brain/result?${queryParams.toString()}`);
      }, 1500);
    }
  };

  const currentGame = STEPS[currentStep];

  if (!canProceed) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <SignupModal isOpen={showSignupModal} onClose={() => router.push("/brain")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-mobile mx-auto">
        {/* 스텝 인디케이터 */}
        <div className="flex justify-center gap-3 mb-8">
          {STEPS.map((step, index) => (
            <div
              key={step.type}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full
                transition-all duration-300
                ${
                  index === currentStep
                    ? "bg-vb-navy text-white"
                    : index < currentStep
                    ? "bg-vb-teal/20 text-vb-teal"
                    : "bg-vb-subtle text-vb-muted"
                }
              `}
            >
              {index < currentStep ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : (
                <span>{step.icon}</span>
              )}
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          ))}
        </div>

        {/* 현재 게임 제목 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-vb-black">
            {currentGame.icon} {currentGame.name} 테스트
          </h1>
          <p className="text-vb-muted mt-1">
            {currentGame.type === "memory" && "카드의 위치를 기억하세요"}
            {currentGame.type === "calc" && "빠르게 암산하세요"}
            {currentGame.type === "focus" && "색 변화를 감지하세요"}
          </p>
        </div>

        {/* 게임 컴포넌트 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          {currentGame.type === "memory" && (
            <MemoryGame onComplete={handleGameComplete} />
          )}
          {currentGame.type === "calc" && (
            <CalcGame onComplete={handleGameComplete} />
          )}
          {currentGame.type === "focus" && (
            <FocusGame onComplete={handleGameComplete} />
          )}
        </div>

        {/* 완료된 게임 점수 표시 */}
        {scores.length > 0 && (
          <div className="mt-6 flex justify-center gap-4">
            {scores.map((score) => {
              const step = STEPS.find((s) => s.type === score.type);
              return (
                <div
                  key={score.type}
                  className="bg-vb-teal/10 rounded-xl px-4 py-2 text-center"
                >
                  <span className="text-xs text-vb-muted">{step?.name}</span>
                  <p className="text-lg font-bold text-vb-teal">{score.score}점</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
