"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageComposer } from "@/components/counselor/MessageComposer";

interface ClientDetail {
  id: string;
  display_name: string | null;
  birth_year: number | null;
  created_at: string;
  latestBrainAge: number | null;
  streakDays: number;
  lastActivity: string | null;
}

export default function CounselorClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientDetail[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [counselorId, setCounselorId] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadClients = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login?redirect=/counselor/clients");
      return;
    }

    // 카운셀러 확인
    const { data: counselorData } = await supabase
      .from("counselors")
      .select("id")
      .eq("id", user.id)
      .eq("status", "active")
      .single();

    if (!counselorData) {
      router.push("/brain");
      return;
    }

    setCounselorId(user.id);

    // 고객 목록 조회
    const { data: clientsData } = await supabase
      .from("profiles")
      .select("id, display_name, birth_year, created_at")
      .eq("counselor_id", user.id)
      .order("created_at", { ascending: false });

    if (!clientsData) {
      setClients([]);
      setIsLoading(false);
      return;
    }

    // 각 고객의 추가 정보 조회
    const clientDetails: ClientDetail[] = await Promise.all(
      clientsData.map(async (client) => {
        // 최신 뇌나이
        const { data: brainTest } = await supabase
          .from("brain_tests")
          .select("brain_age")
          .eq("user_id", client.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        // 연속일수 계산 (간단히)
        const { data: habitsData } = await supabase
          .from("habits")
          .select("date, completed")
          .eq("user_id", client.id)
          .order("date", { ascending: false })
          .limit(30);

        let streakDays = 0;
        if (habitsData) {
          const dateMap = new Map<string, number>();
          habitsData.forEach((h) => {
            const count = dateMap.get(h.date) || 0;
            dateMap.set(h.date, count + (h.completed ? 1 : 0));
          });

          const today = new Date().toISOString().split("T")[0];
          const checkDate = new Date();
          while (true) {
            const dateStr = checkDate.toISOString().split("T")[0];
            const completedCount = dateMap.get(dateStr) || 0;
            if (completedCount >= 5) {
              streakDays++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else if (dateStr === today) {
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
        }

        // 마지막 활동
        const { data: lastHabit } = await supabase
          .from("habits")
          .select("created_at")
          .eq("user_id", client.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        return {
          ...client,
          latestBrainAge: brainTest?.brain_age || null,
          streakDays,
          lastActivity: lastHabit?.created_at || null,
        };
      })
    );

    setClients(clientDetails);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vb-bg pt-20 pb-8 px-4">
      <div className="max-w-mobile mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-vb-black">👥 고객 관리</h1>
            <p className="text-vb-muted">총 {clients.length}명</p>
          </div>
          <Button variant="ghost" onClick={() => router.push("/counselor/dashboard")}>
            ← 대시보드
          </Button>
        </div>

        {/* 고객 목록 */}
        {clients.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-5xl block mb-4">📭</span>
            <p className="text-vb-muted">아직 고객이 없습니다</p>
            <p className="text-sm text-vb-muted mt-1">초대 링크를 공유해보세요!</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <Card key={client.id} className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* 이름 & 나이 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-vb-black text-lg">
                        {client.display_name || "이름 미입력"}
                      </span>
                      {client.birth_year && (
                        <span className="text-sm text-vb-muted">
                          ({new Date().getFullYear() - client.birth_year}세)
                        </span>
                      )}
                    </div>

                    {/* 통계 */}
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-vb-muted">뇌나이 </span>
                        <span className="font-semibold text-vb-coral">
                          {client.latestBrainAge || "-"}세
                        </span>
                      </div>
                      <div>
                        <span className="text-vb-muted">연속 </span>
                        <span className="font-semibold text-vb-gold">
                          🔥{client.streakDays}일
                        </span>
                      </div>
                    </div>

                    {/* 마지막 활동 */}
                    {client.lastActivity && (
                      <p className="text-xs text-vb-muted mt-2">
                        마지막 활동:{" "}
                        {new Date(client.lastActivity).toLocaleDateString("ko-KR", {
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  {/* 메시지 버튼 */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedClient(client)}
                  >
                    💌 메시지
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 메시지 작성 모달 */}
      {selectedClient && counselorId && (
        <MessageComposer
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
          counselorId={counselorId}
        />
      )}
    </div>
  );
}
