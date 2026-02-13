
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/Card";

async function getStats() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 전체 회원 수
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // 카운셀러 수
  const { count: totalCounselors } = await supabase
    .from("counselors")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", true);

  // 미승인 카운셀러 수
  const { count: pendingCounselors } = await supabase
    .from("counselors")
    .select("*", { count: "exact", head: true })
    .eq("is_approved", false);

  // 오늘 가입자 수
  const today = new Date().toISOString().split("T")[0];
  const { count: todaySignups } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today);

  // 뇌나이 측정 횟수
  const { count: totalTests } = await supabase
    .from("brain_tests")
    .select("*", { count: "exact", head: true });

  // 게임 플레이 횟수
  const { count: totalGames } = await supabase
    .from("game_records")
    .select("*", { count: "exact", head: true });

  return {
    totalUsers: totalUsers || 0,
    totalCounselors: totalCounselors || 0,
    pendingCounselors: pendingCounselors || 0,
    todaySignups: todaySignups || 0,
    totalTests: totalTests || 0,
    totalGames: totalGames || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-vb-black">관리자 대시보드</h1>
        <p className="text-vb-muted">AMOREA Brain Care 서비스 현황</p>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="👥"
          label="전체 회원"
          value={stats.totalUsers}
          color="#5C6BC0"
        />
        <StatCard
          icon="👩‍💼"
          label="활성 카운셀러"
          value={stats.totalCounselors}
          color="#3AAFA9"
        />
        <StatCard
          icon="📝"
          label="승인 대기"
          value={stats.pendingCounselors}
          color="#E8625C"
          highlight={stats.pendingCounselors > 0}
        />
      </div>

      {/* 활동 지표 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="📅"
          label="오늘 가입"
          value={stats.todaySignups}
          color="#5D8A6B"
        />
        <StatCard
          icon="🧠"
          label="뇌나이 측정"
          value={stats.totalTests}
          color="#E89DB1"
        />
        <StatCard
          icon="🎮"
          label="게임 플레이"
          value={stats.totalGames}
          color="#C8956C"
        />
      </div>

      {/* 빠른 작업 */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <a href="/admin/counselors" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-vb-teal/20 flex items-center justify-center text-2xl">
              👩‍💼
            </div>
            <div>
              <h3 className="font-bold text-vb-black">카운셀러 관리</h3>
              <p className="text-sm text-vb-muted">
                {stats.pendingCounselors > 0
                  ? `${stats.pendingCounselors}명 승인 대기 중`
                  : "모두 처리됨"}
              </p>
            </div>
          </a>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <a href="/admin/users" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-vb-blue/20 flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <h3 className="font-bold text-vb-black">회원 관리</h3>
              <p className="text-sm text-vb-muted">
                전체 {stats.totalUsers}명 조회
              </p>
            </div>
          </a>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <a href="/admin/content" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-vb-coral/20 flex items-center justify-center text-2xl">
              📝
            </div>
            <div>
              <h3 className="font-bold text-vb-black">콘텐츠 관리</h3>
              <p className="text-sm text-vb-muted">랜딩페이지 편집</p>
            </div>
          </a>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <a href="/admin/products" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-vb-green/20 flex items-center justify-center text-2xl">
              💊
            </div>
            <div>
              <h3 className="font-bold text-vb-black">제품 관리</h3>
              <p className="text-sm text-vb-muted">바이탈뷰티 제품 설정</p>
            </div>
          </a>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "ring-2 ring-vb-coral" : ""}>
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-vb-muted">{label}</p>
          <p className="text-2xl font-bold text-vb-black">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
