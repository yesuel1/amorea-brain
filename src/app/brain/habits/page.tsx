"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { trackHabitCheck } from "@/lib/analytics";

interface Habit {
  id: string;
  habit_type: string;
  completed: boolean;
}

const HABIT_TYPES = [
  { type: "brain_game", label: "뇌운동 게임 10분", icon: "🧠" },
  { type: "supplement_body_brain", label: "바디앤브레인 복용", icon: "💊" },
  { type: "omega", label: "오메가3 복용", icon: "🐟" },
  { type: "exercise", label: "산책 30분", icon: "🚶" },
  { type: "meditation", label: "감사명상 5분", icon: "🧘" },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHabits = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsLoading(false);
      return;
    }

    setUserId(user.id);

    // 오늘의 습관 조회
    const { data: todayHabits } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today);

    // 습관 초기화 (없으면 생성)
    const existingTypes = new Set(todayHabits?.map((h) => h.habit_type) || []);
    const habitsToInsert = HABIT_TYPES
      .filter((ht) => !existingTypes.has(ht.type))
      .map((ht) => ({
        user_id: user.id,
        habit_type: ht.type,
        completed: false,
        date: today,
      }));

    if (habitsToInsert.length > 0) {
      await supabase.from("habits").insert(habitsToInsert);
    }

    // 다시 조회
    const { data: allHabits } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today);

    setHabits(allHabits || []);

    // 연속일수 계산
    await calculateStreak(supabase, user.id);

    setIsLoading(false);
  };

  const calculateStreak = async (supabase: ReturnType<typeof createClient>, userId: string) => {
    // 최근 30일간의 완료된 습관 조회
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data } = await supabase
      .from("habits")
      .select("date, completed")
      .eq("user_id", userId)
      .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
      .order("date", { ascending: false });

    if (!data) {
      setStreakDays(0);
      return;
    }

    // 날짜별로 그룹화하여 모든 습관을 완료한 날 계산
    const dateMap = new Map<string, number>();
    data.forEach((h) => {
      const count = dateMap.get(h.date) || 0;
      dateMap.set(h.date, count + (h.completed ? 1 : 0));
    });

    // 연속일수 계산
    let streak = 0;
    const checkDate = new Date();

    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const completedCount = dateMap.get(dateStr) || 0;

      if (completedCount >= HABIT_TYPES.length) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dateStr === today) {
        // 오늘은 아직 안 끝났을 수 있으니 스킵
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreakDays(streak);
  };

  const toggleHabit = async (habitType: string) => {
    if (!userId) return;

    const habit = habits.find((h) => h.habit_type === habitType);
    if (!habit) return;

    const newCompleted = !habit.completed;

    // 로컬 상태 업데이트
    setHabits((prev) =>
      prev.map((h) =>
        h.habit_type === habitType ? { ...h, completed: newCompleted } : h
      )
    );

    // DB 업데이트
    const supabase = createClient();
    await supabase
      .from("habits")
      .update({ completed: newCompleted })
      .eq("id", habit.id);

    if (newCompleted) {
      trackHabitCheck(habitType, streakDays);
    }

    // 연속일수 재계산
    await calculateStreak(supabase, userId);
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const progress = (completedCount / HABIT_TYPES.length) * 100;
  const allComplete = completedCount === HABIT_TYPES.length;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">로딩 중...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-mobile mx-auto text-center py-12">
          <span className="text-5xl block mb-4">🔐</span>
          <h1 className="text-xl font-bold text-vb-black mb-2">
            로그인이 필요합니다
          </h1>
          <p className="text-vb-muted mb-6">
            습관 기록을 저장하려면 로그인해주세요
          </p>
          <Button onClick={() => window.location.href = "/auth/login?redirect=/brain/habits"}>
            로그인하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-mobile mx-auto">
        {/* 연속일수 히어로 */}
        <div className="bg-gradient-to-br from-vb-navy to-vb-charcoal rounded-3xl p-8 text-center mb-6 relative overflow-hidden">
          {/* 배경 효과 */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                🔥
              </div>
            ))}
          </div>

          <p className="text-vb-silver text-sm mb-2 relative z-10">연속 습관</p>
          <div className="flex items-center justify-center gap-2 relative z-10">
            <span className="text-5xl">🔥</span>
            <span className="text-6xl font-bold text-white">{streakDays}</span>
            <span className="text-2xl text-white">일</span>
          </div>
          <p className="text-vb-silver mt-2 relative z-10">
            {streakDays === 0
              ? "오늘부터 시작해보세요!"
              : `${streakDays}일째 뇌 건강 습관을 실천 중!`}
          </p>
        </div>

        {/* 오늘의 습관 */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-vb-black">오늘의 습관</h2>
            <span className="text-vb-teal font-semibold">
              {completedCount}/{HABIT_TYPES.length}
            </span>
          </div>

          {/* 프로그레스 바 */}
          <div className="h-3 bg-vb-subtle rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-vb-coral to-vb-teal rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 습관 목록 */}
          <div className="space-y-3">
            {HABIT_TYPES.map((habitType) => {
              const habit = habits.find((h) => h.habit_type === habitType.type);
              const isChecked = habit?.completed || false;

              return (
                <button
                  key={habitType.type}
                  onClick={() => toggleHabit(habitType.type)}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl
                    transition-all duration-200
                    ${isChecked ? "bg-vb-teal/10" : "bg-vb-subtle hover:bg-vb-lightsilver"}
                  `}
                >
                  {/* 체크박스 */}
                  <div
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      transition-all duration-200
                      ${isChecked ? "bg-vb-teal text-white" : "bg-white border-2 border-vb-silver"}
                    `}
                  >
                    {isChecked && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  {/* 아이콘 & 라벨 */}
                  <span className="text-2xl">{habitType.icon}</span>
                  <span
                    className={`
                      flex-1 text-left font-medium text-lg
                      ${isChecked ? "text-vb-teal line-through" : "text-vb-black"}
                    `}
                  >
                    {habitType.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 완료 축하 */}
          {allComplete && (
            <div className="mt-6 p-6 bg-gradient-to-r from-vb-coral/10 to-vb-teal/10 rounded-2xl text-center animate-in zoom-in duration-300">
              <span className="text-5xl mb-3 block">🎉</span>
              <p className="text-xl font-bold text-vb-black">오늘의 습관 완료!</p>
              <p className="text-vb-muted mt-1">대단해요! 내일도 함께 해요</p>
            </div>
          )}
        </Card>

        {/* 안내 */}
        <div className="text-center">
          <p className="text-sm text-vb-muted">
            매일 습관을 완료하면 연속일수가 쌓여요
          </p>
        </div>
      </div>
    </div>
  );
}
