"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Client {
  id: string;
  display_name: string | null;
  birth_year: number | null;
  created_at: string;
}

interface CounselorData {
  id: string;
  code: string;
  full_name: string;
  client_count: number;
  today_message: string | null;
}

export default function CounselorDashboardPage() {
  const router = useRouter();
  const [counselor, setCounselor] = useState<CounselorData | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeThisWeek: 0,
    avgBrainAge: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login?redirect=/counselor/dashboard");
      return;
    }

    // 카운셀러 정보 조회
    const { data: counselorData } = await supabase
      .from("counselors")
      .select("*")
      .eq("id", user.id)
      .eq("is_approved", true)
      .single();

    if (!counselorData) {
      // 승인된 카운셀러가 아님
      router.push("/brain");
      return;
    }

    setCounselor(counselorData);

    // 내 고객 목록 조회
    const { data: clientsData } = await supabase
      .from("profiles")
      .select("id, display_name, birth_year, created_at")
      .eq("counselor_id", user.id)
      .order("created_at", { ascending: false });

    setClients(clientsData || []);

    // 통계 계산
    const totalClients = clientsData?.length || 0;

    // 이번 주 활성 고객 (습관 체크한 고객)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: activeData } = await supabase
      .from("habits")
      .select("user_id")
      .in("user_id", clientsData?.map(c => c.id) || [])
      .gte("created_at", weekAgo.toISOString());

    const activeUserIds = new Set(activeData?.map(h => h.user_id));
    const activeThisWeek = activeUserIds.size;

    // 평균 뇌나이
    const { data: brainAgeData } = await supabase
      .from("brain_tests")
      .select("brain_age, user_id")
      .in("user_id", clientsData?.map(c => c.id) || [])
      .order("created_at", { ascending: false });

    // 각 고객의 최신 뇌나이만 추출
    const latestBrainAges = new Map<string, number>();
    brainAgeData?.forEach(test => {
      if (!latestBrainAges.has(test.user_id)) {
        latestBrainAges.set(test.user_id, test.brain_age);
      }
    });

    const avgBrainAge = latestBrainAges.size > 0
      ? Math.round(Array.from(latestBrainAges.values()).reduce((a, b) => a + b, 0) / latestBrainAges.size)
      : 0;

    setStats({ totalClients, activeThisWeek, avgBrainAge });
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">로딩 중...</div>
      </div>
    );
  }

  if (!counselor) {
    return null;
  }

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/counselor/${counselor.code}`;

  return (
    <div className="min-h-screen bg-vb-bg pt-20 pb-8 px-4">
      <div className="max-w-mobile mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-vb-black">
            👋 {counselor.full_name} 카운셀러님
          </h1>
          <p className="text-vb-muted">오늘도 고객님들의 뇌 건강을 응원해주세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card padding="sm" className="text-center">
            <div className="text-xs text-vb-muted mb-1">내 고객</div>
            <div className="text-2xl font-bold text-vb-coral">
              {stats.totalClients}
              <span className="text-sm font-normal">명</span>
            </div>
          </Card>

          <Card padding="sm" className="text-center">
            <div className="text-xs text-vb-muted mb-1">이번 주 활성</div>
            <div className="text-2xl font-bold text-vb-teal">
              {stats.activeThisWeek}
              <span className="text-sm font-normal">명</span>
            </div>
          </Card>

          <Card padding="sm" className="text-center">
            <div className="text-xs text-vb-muted mb-1">평균 뇌나이</div>
            <div className="text-2xl font-bold text-vb-blue">
              {stats.avgBrainAge || "-"}
              <span className="text-sm font-normal">세</span>
            </div>
          </Card>
        </div>

        {/* 내 링크 공유 */}
        <Card className="mb-6">
          <h2 className="font-bold text-vb-black mb-3">🔗 내 초대 링크</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-vb-subtle rounded-lg text-sm text-vb-charcoal"
            />
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("링크가 복사되었습니다!");
              }}
            >
              복사
            </Button>
          </div>
          <p className="text-xs text-vb-muted mt-2">
            이 링크로 가입한 고객은 자동으로 내 고객이 됩니다
          </p>
        </Card>

        {/* 빠른 액션 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/counselor/clients">
            <Card hoverable className="text-center py-6">
              <span className="text-3xl block mb-2">👥</span>
              <span className="font-medium text-vb-black">고객 관리</span>
            </Card>
          </Link>
          <Link href="/counselor/mypage">
            <Card hoverable className="text-center py-6">
              <span className="text-3xl block mb-2">⚙️</span>
              <span className="font-medium text-vb-black">내 프로필</span>
            </Card>
          </Link>
        </div>

        {/* 최근 가입 고객 */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-vb-black">최근 가입 고객</h2>
            <Link href="/counselor/clients" className="text-sm text-vb-teal">
              전체보기 →
            </Link>
          </div>

          {clients.length === 0 ? (
            <div className="text-center py-8 text-vb-muted">
              <span className="text-4xl block mb-2">📭</span>
              <p>아직 고객이 없습니다</p>
              <p className="text-sm mt-1">초대 링크를 공유해보세요!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between py-2 border-b border-vb-lightsilver last:border-0"
                >
                  <div>
                    <span className="font-medium text-vb-black">
                      {client.display_name || "이름 미입력"}
                    </span>
                    {client.birth_year && (
                      <span className="text-sm text-vb-muted ml-2">
                        ({new Date().getFullYear() - client.birth_year}세)
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-vb-muted">
                    {new Date(client.created_at).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
