"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Activity {
  time: string;
  activity: string;
  duration: string;
  icon: string;
  description: string;
}

interface Supplement {
  name: string;
  time: string;
  benefit: string;
}

interface Routine {
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  supplements: Supplement[];
  focusArea: string;
  weeklyGoal: string;
}

const DEFAULT_ROUTINE: Routine = {
  morning: [
    {
      time: "07:00",
      activity: "기억력 게임",
      duration: "10분",
      icon: "🧠",
      description: "숫자 순서 기억하기로 뇌 깨우기",
    },
    {
      time: "07:30",
      activity: "가벼운 스트레칭",
      duration: "10분",
      icon: "🧘",
      description: "혈액순환으로 뇌에 산소 공급",
    },
  ],
  afternoon: [
    {
      time: "14:00",
      activity: "계산력 게임",
      duration: "10분",
      icon: "🔢",
      description: "암산으로 전두엽 활성화",
    },
    {
      time: "15:00",
      activity: "산책",
      duration: "20분",
      icon: "🚶",
      description: "유산소 운동으로 BDNF 분비",
    },
  ],
  evening: [
    {
      time: "20:00",
      activity: "집중력 게임",
      duration: "10분",
      icon: "🎯",
      description: "색깔 구분으로 주의력 훈련",
    },
    {
      time: "21:00",
      activity: "명상",
      duration: "10분",
      icon: "😌",
      description: "마음 정리와 뇌 휴식",
    },
  ],
  supplements: [
    {
      name: "바디앤브레인",
      time: "아침 식후",
      benefit: "기억력 개선",
    },
    {
      name: "홍삼 골드",
      time: "저녁 식후",
      benefit: "면역력 & 피로회복",
    },
  ],
  focusArea: "기억력",
  weeklyGoal: "이번 주는 기억력 게임에 집중해보세요! 매일 꾸준히 하면 2주 후 눈에 띄는 변화가 있을 거예요 💪",
};

export default function RoutinePage() {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium] = useState(false); // TODO: 실제 프리미엄 체크

  useEffect(() => {
    // 기본 루틴 표시
    setRoutine(DEFAULT_ROUTINE);
  }, []);

  const handleGenerateAIRoutine = async () => {
    if (!isPremium) {
      alert("AI 맞춤 루틴은 프리미엄 회원 전용 기능입니다.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brainAge: 45,
          realAge: 55,
          memoryScore: 85,
          calcScore: 72,
          focusScore: 68,
          streakDays: 7,
          weakAreas: ["집중력", "계산력"],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoutine(data);
      }
    } catch (error) {
      console.error("Error generating routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!routine) {
    return (
      <div className="min-h-screen bg-vb-bg pt-20 pb-24 flex items-center justify-center">
        <p className="text-vb-muted">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vb-bg pt-20 pb-24">
      <div className="max-w-mobile mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-vb-black mb-2">
            🗓️ 오늘의 뇌 건강 루틴
          </h1>
          <p className="text-vb-muted">
            {routine.focusArea} 집중 강화 프로그램
          </p>
        </div>

        {/* 주간 목표 */}
        <Card className="mb-6 bg-gradient-to-r from-vb-navy to-vb-charcoal text-white">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <p className="text-sm leading-relaxed">{routine.weeklyGoal}</p>
          </div>
        </Card>

        {/* AI 맞춤 루틴 버튼 */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleGenerateAIRoutine}
          isLoading={isLoading}
          className="mb-6"
        >
          ✨ AI 맞춤 루틴 생성 {!isPremium && "(프리미엄)"}
        </Button>

        {/* 오전 루틴 */}
        <TimeSection title="☀️ 오전" activities={routine.morning} />

        {/* 오후 루틴 */}
        <TimeSection title="🌤️ 오후" activities={routine.afternoon} />

        {/* 저녁 루틴 */}
        <TimeSection title="🌙 저녁" activities={routine.evening} />

        {/* 영양제 */}
        <div className="mb-6">
          <h2 className="font-bold text-vb-black mb-3 flex items-center gap-2">
            <span>💊</span> 오늘의 영양제
          </h2>
          <Card>
            <div className="space-y-3">
              {routine.supplements.map((supp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-vb-lightsilver last:border-0"
                >
                  <div>
                    <p className="font-medium text-vb-black">{supp.name}</p>
                    <p className="text-xs text-vb-muted">{supp.benefit}</p>
                  </div>
                  <span className="text-sm text-vb-teal font-medium">
                    {supp.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 진행률 */}
        <Card className="bg-vb-subtle">
          <div className="text-center">
            <p className="text-sm text-vb-muted mb-2">오늘의 완료율</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-32 h-2 bg-vb-lightsilver rounded-full overflow-hidden">
                <div
                  className="h-full bg-vb-teal rounded-full"
                  style={{ width: "0%" }}
                />
              </div>
              <span className="text-sm font-bold text-vb-black">0%</span>
            </div>
            <p className="text-xs text-vb-muted mt-2">
              습관 트래커에서 완료 체크하세요!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TimeSection({
  title,
  activities,
}: {
  title: string;
  activities: Activity[];
}) {
  return (
    <div className="mb-6">
      <h2 className="font-bold text-vb-black mb-3">{title}</h2>
      <div className="space-y-3">
        {activities.map((activity, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-vb-subtle flex items-center justify-center text-2xl flex-shrink-0">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-vb-black">{activity.activity}</h3>
                  <span className="text-xs text-vb-muted">{activity.time}</span>
                </div>
                <p className="text-sm text-vb-charcoal">{activity.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-vb-teal/10 text-vb-teal rounded-full">
                  {activity.duration}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
