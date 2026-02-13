"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageGame } from "@/components/brain/games/LanguageGame";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SignupModal } from "@/components/ui/SignupModal";
import { ShareSheet } from "@/components/ui/ShareSheet";
import { canUseGame, decrementFreeUses, getFreeUsesRemaining } from "@/lib/free-usage";
import { trackGamePlay, trackFreeUse, trackPaywallShown } from "@/lib/analytics";

export default function LanguageGamePage() {
  const router = useRouter();
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const allowed = await canUseGame();
      if (!allowed) {
        setCanPlay(false);
        setShowSignupModal(true);
        trackPaywallShown();
      } else {
        const remaining = getFreeUsesRemaining();
        if (remaining > 0) {
          const newRemaining = decrementFreeUses();
          trackFreeUse(newRemaining);
        }
      }
    };
    checkAccess();
  }, []);

  const handleComplete = (finalScore: number, finalDuration: number) => {
    setScore(finalScore);
    setDuration(finalDuration);
    setGameCompleted(true);
    trackGamePlay("language", finalScore);
  };

  const handlePlayAgain = () => {
    setGameCompleted(false);
    setScore(0);
    setDuration(0);
  };

  if (!canPlay) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <SignupModal isOpen={showSignupModal} onClose={() => router.push("/brain/games")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-mobile mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-vb-black">
            📝 언어력 게임
          </h1>
          <p className="text-vb-muted mt-1">초성 퀴즈</p>
        </div>

        {!gameCompleted ? (
          <Card>
            <LanguageGame onComplete={handleComplete} standalone />
          </Card>
        ) : (
          <div className="space-y-4">
            {/* 결과 카드 */}
            <Card variant="gradient" className="text-center">
              <span className="text-5xl block mb-4">🎉</span>
              <p className="text-vb-silver text-sm">게임 완료!</p>
              <p className="text-5xl font-bold text-white my-2">{score}점</p>
              <p className="text-vb-silver text-sm">
                소요시간: {duration}초
              </p>
            </Card>

            {/* 버튼들 */}
            <Button fullWidth onClick={() => setShowShareSheet(true)}>
              점수 공유하기
            </Button>
            <Button variant="secondary" fullWidth onClick={handlePlayAgain}>
              다시 하기
            </Button>
            <Button variant="ghost" fullWidth onClick={() => router.push("/brain/games")}>
              다른 게임 하기
            </Button>
          </div>
        )}
      </div>

      <ShareSheet
        isOpen={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        title={`언어력 게임 ${score}점 달성!`}
        text={`AMOREA Brain Care 언어력 게임에서 ${score}점을 달성했어요! 📝`}
        url={typeof window !== "undefined" ? window.location.origin + "/brain/games/language" : ""}
        contentType="brain_test"
      />
    </div>
  );
}
