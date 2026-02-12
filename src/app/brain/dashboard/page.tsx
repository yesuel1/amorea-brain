"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Profile {
  display_name: string | null;
  birth_year: number | null;
}

interface BrainTest {
  brain_age: number;
  total_score: number;
  memory_score: number | null;
  calc_score: number | null;
  focus_score: number | null;
  created_at: string;
}

interface GameRecord {
  game_type: string;
  score: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [brainTests, setBrainTests] = useState<BrainTest[]>([]);
  const [gameRecords, setGameRecords] = useState<GameRecord[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login?redirect=/brain/dashboard");
      return;
    }

    // 프로필 조회
    const { data: profileData } = await supabase
      .from("profiles")
      .select("display_name, birth_year")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    // 뇌나이 테스트 기록 (최근 5회)
    const { data: testsData } = await supabase
      .from("brain_tests")
      .select("brain_age, total_score, memory_score, calc_score, focus_score, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setBrainTests(testsData || []);

    // 게임 기록 (최근 10회)
    const { data: gamesData } = await supabase
      .from("game_records")
      .select("game_type, score, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    setGameRecords(gamesData || []);

    // 습관 통계
    const { data: habitsData } = await supabase
      .from("habits")
      .select("date, completed")
      .eq("user_id", user.id);

    if (habitsData) {
      // 총 운동일 (습관을 모두 완료한 날)
      const dateMap = new Map<string, number>();
      habitsData.forEach((h) => {
        const count = dateMap.get(h.date) || 0;
        dateMap.set(h.date, count + (h.completed ? 1 : 0));
      });

      const completeDays = Array.from(dateMap.entries()).filter(
        ([, count]) => count >= 5
      ).length;
      setTotalDays(completeDays);

      // 연속일수
      let streak = 0;
      const checkDate = new Date();
      const today = new Date().toISOString().split("T")[0];

      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];
        const completedCount = dateMap.get(dateStr) || 0;

        if (completedCount >= 5) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (dateStr === today) {
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      setStreakDays(streak);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">로딩 중...</div>
      </div>
    );
  }

  const latestTest = brainTests[0];
  const currentYear = new Date().getFullYear();
  const realAge = profile?.birth_year ? currentYear - profile.birth_year : null;

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-mobile mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-vb-black">
            {profile?.display_name}님의 대시보드
          </h1>
          <p className="text-vb-muted">나의 뇌 건강 여정</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card padding="sm" className="text-center">
            <div className="text-xs text-vb-muted mb-1">뇌나이</div>
            <div className="text-2xl font-bold text-vb-coral">
              {latestTest?.brain_age || "-"}
              <span className="text-sm font-normal">세</span>
            </div>
            {realAge && latestTest && (
              <div className="text-xs text-vb-teal">
                실제보다 {realAge - latestTest.brain_age}세 젊음
              </div>
            )}
          </Card>

          <Card padding="sm" className="text-center">
            <div className="text-xs text-vb-muted mb-1">총 운동일</div>
            <div className="text-2xl font-bold text-vb-blue">
              {totalDays}
              <span className="text-sm font-normal">일</span>
            </div>
          </Card>

          <Card padding="sm" className="text-center">
            <div className="text-xs text-vb-muted mb-1">연속일수</div>
            <div className="text-2xl font-bold text-vb-gold">
              🔥 {streakDays}
              <span className="text-sm font-normal">일</span>
            </div>
          </Card>
        </div>

        {/* 뇌나이 추이 차트 */}
        {brainTests.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-lg font-bold text-vb-black mb-4">뇌나이 추이</h2>

            {/* 간단한 SVG 라인 차트 */}
            <div className="h-40 relative">
              <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                {/* 그리드 라인 */}
                <line x1="0" y1="30" x2="300" y2="30" stroke="#E8E8E8" strokeDasharray="4" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#E8E8E8" strokeDasharray="4" />
                <line x1="0" y1="90" x2="300" y2="90" stroke="#E8E8E8" strokeDasharray="4" />

                {/* 데이터 라인 */}
                {brainTests.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#3AAFA9"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={brainTests
                      .slice()
                      .reverse()
                      .map((test, i) => {
                        const x = (i / (brainTests.length - 1)) * 280 + 10;
                        const y = 110 - ((test.brain_age - 25) / 50) * 100;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />
                )}

                {/* 데이터 포인트 */}
                {brainTests
                  .slice()
                  .reverse()
                  .map((test, i) => {
                    const x = brainTests.length > 1 ? (i / (brainTests.length - 1)) * 280 + 10 : 150;
                    const y = 110 - ((test.brain_age - 25) / 50) * 100;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#3AAFA9"
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  })}
              </svg>

              {/* Y축 레이블 */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-vb-muted py-2">
                <span>75세</span>
                <span>50세</span>
                <span>25세</span>
              </div>
            </div>

            {/* 테스트 날짜 */}
            <div className="flex justify-between mt-2 text-xs text-vb-muted">
              {brainTests
                .slice()
                .reverse()
                .map((test, i) => (
                  <span key={i}>
                    {new Date(test.created_at).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                ))}
            </div>
          </Card>
        )}

        {/* 최근 게임 기록 */}
        {gameRecords.length > 0 && (
          <Card className="mb-6">
            <h2 className="text-lg font-bold text-vb-black mb-4">최근 게임 기록</h2>

            <div className="space-y-2">
              {gameRecords.slice(0, 5).map((record, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-vb-lightsilver last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {record.game_type === "memory" && "🧩"}
                      {record.game_type === "calc" && "🔢"}
                      {record.game_type === "focus" && "🎯"}
                    </span>
                    <span className="text-vb-charcoal">
                      {record.game_type === "memory" && "기억력"}
                      {record.game_type === "calc" && "계산력"}
                      {record.game_type === "focus" && "집중력"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-vb-teal">{record.score}점</span>
                    <span className="text-xs text-vb-muted">
                      {new Date(record.created_at).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <Button fullWidth onClick={() => router.push("/brain/test")}>
            🧠 뇌나이 다시 측정하기
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push("/brain/habits")}>
            ✅ 오늘의 습관 체크하기
          </Button>
        </div>
      </div>
    </div>
  );
}
