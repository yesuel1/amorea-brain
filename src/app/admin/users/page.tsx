import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/Card";

interface User {
  id: string;
  display_name: string | null;
  birth_year: number | null;
  role: string;
  created_at: string;
  counselor_id: string | null;
}

interface BrainTest {
  user_id: string;
  brain_age: number;
  created_at: string;
}

async function getUsers() {
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

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  // 최근 뇌나이 측정 기록
  const { data: brainTests } = await supabase
    .from("brain_tests")
    .select("user_id, brain_age, created_at")
    .order("created_at", { ascending: false });

  // 사용자별 최신 뇌나이 맵
  const latestBrainAge = new Map<string, number>();
  (brainTests || []).forEach((test: BrainTest) => {
    if (test.user_id && !latestBrainAge.has(test.user_id)) {
      latestBrainAge.set(test.user_id, test.brain_age);
    }
  });

  return {
    users: (users || []) as User[],
    latestBrainAge,
  };
}

export default async function AdminUsersPage() {
  const { users, latestBrainAge } = await getUsers();

  const currentYear = new Date().getFullYear();

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-vb-black">회원 관리</h1>
        <p className="text-vb-muted">전체 회원 조회 및 데이터 분석</p>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-sm text-vb-muted">전체 회원</p>
          <p className="text-2xl font-bold text-vb-black">{users.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-vb-muted">일반 회원</p>
          <p className="text-2xl font-bold text-vb-black">
            {users.filter((u) => u.role === "user").length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-vb-muted">카운셀러</p>
          <p className="text-2xl font-bold text-vb-teal">
            {users.filter((u) => u.role === "counselor").length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-vb-muted">뇌나이 측정</p>
          <p className="text-2xl font-bold text-vb-coral">
            {latestBrainAge.size}
          </p>
        </Card>
      </div>

      {/* 회원 목록 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-vb-subtle">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-vb-charcoal">
                  이름
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-vb-charcoal">
                  나이
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-vb-charcoal">
                  뇌나이
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-vb-charcoal">
                  역할
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-vb-charcoal">
                  카운셀러
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-vb-charcoal">
                  가입일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vb-lightsilver">
              {users.map((user) => {
                const realAge = user.birth_year
                  ? currentYear - user.birth_year
                  : null;
                const brainAge = latestBrainAge.get(user.id);
                const ageDiff =
                  realAge && brainAge ? realAge - brainAge : null;

                return (
                  <tr key={user.id} className="hover:bg-vb-subtle/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-vb-subtle flex items-center justify-center text-sm">
                          👤
                        </div>
                        <span className="font-medium text-vb-black">
                          {user.display_name || "이름 미입력"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {realAge ? (
                        <span className="text-vb-charcoal">{realAge}세</span>
                      ) : (
                        <span className="text-vb-muted">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {brainAge ? (
                        <div>
                          <span className="font-bold text-vb-black">
                            {brainAge}세
                          </span>
                          {ageDiff !== null && (
                            <span
                              className={`text-xs ml-1 ${
                                ageDiff > 0 ? "text-vb-teal" : "text-vb-coral"
                              }`}
                            >
                              ({ageDiff > 0 ? `-${ageDiff}` : `+${Math.abs(ageDiff)}`})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-vb-muted">미측정</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.counselor_id ? (
                        <span className="text-vb-teal text-sm">연결됨</span>
                      ) : (
                        <span className="text-vb-muted text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-vb-muted">
                      {new Date(user.created_at).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-vb-coral/20 text-vb-coral",
    counselor: "bg-vb-teal/20 text-vb-teal",
    user: "bg-vb-blue/20 text-vb-blue",
  };

  const labels: Record<string, string> = {
    admin: "관리자",
    counselor: "카운셀러",
    user: "일반",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[role] || styles.user}`}
    >
      {labels[role] || role}
    </span>
  );
}
