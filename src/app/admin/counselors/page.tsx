
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/Card";
import { CounselorApprovalActions } from "@/components/admin/CounselorApprovalActions";

interface Counselor {
  id: string;
  code: string;
  full_name: string;
  title: string | null;
  introduction: string | null;
  phone: string | null;
  status: "pending" | "active" | "inactive";
  created_at: string;
  client_count: number;
}

async function getCounselors() {
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

  const { data: pending } = await supabase
    .from("counselors")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: active } = await supabase
    .from("counselors")
    .select("*")
    .eq("status", "active")
    .order("client_count", { ascending: false });

  const { data: inactive } = await supabase
    .from("counselors")
    .select("*")
    .eq("status", "inactive")
    .order("created_at", { ascending: false });

  return {
    pending: (pending || []) as Counselor[],
    active: (active || []) as Counselor[],
    inactive: (inactive || []) as Counselor[],
  };
}

export default async function AdminCounselorsPage() {
  const { pending, active, inactive } = await getCounselors();

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-vb-black">카운셀러 관리</h1>
        <p className="text-vb-muted">카운셀러 신청 승인 및 관리</p>
      </div>

      {/* 승인 대기 */}
      <section className="mb-8">
        <h2 className="font-bold text-vb-black mb-4 flex items-center gap-2">
          <span className="text-xl">⏳</span>
          승인 대기 ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <Card>
            <p className="text-center text-vb-muted py-4">
              승인 대기 중인 신청이 없습니다
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((counselor) => (
              <Card key={counselor.id} className="border-2 border-vb-coral">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-vb-subtle flex items-center justify-center text-2xl">
                      👩‍💼
                    </div>
                    <div>
                      <h3 className="font-bold text-vb-black">
                        {counselor.full_name}
                      </h3>
                      {counselor.title && (
                        <p className="text-sm text-vb-muted">{counselor.title}</p>
                      )}
                      {counselor.phone && (
                        <p className="text-sm text-vb-charcoal">📞 {counselor.phone}</p>
                      )}
                      {counselor.introduction && (
                        <p className="text-sm text-vb-charcoal mt-1 line-clamp-2">
                          {counselor.introduction}
                        </p>
                      )}
                      <p className="text-xs text-vb-muted mt-2">
                        코드: {counselor.code} | 신청일:{" "}
                        {new Date(counselor.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                  <CounselorApprovalActions counselorId={counselor.id} currentStatus="pending" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 활성 카운셀러 */}
      <section className="mb-8">
        <h2 className="font-bold text-vb-black mb-4 flex items-center gap-2">
          <span className="text-xl">✅</span>
          활성 카운셀러 ({active.length})
        </h2>

        {active.length === 0 ? (
          <Card>
            <p className="text-center text-vb-muted py-4">
              활성 카운셀러가 없습니다
            </p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-vb-subtle">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-vb-charcoal">
                    카운셀러
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-vb-charcoal">
                    코드
                  </th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-vb-charcoal">
                    고객 수
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-vb-charcoal">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-vb-lightsilver">
                {active.map((counselor) => (
                  <tr key={counselor.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-vb-teal/20 flex items-center justify-center text-lg">
                          👩‍💼
                        </div>
                        <div>
                          <p className="font-medium text-vb-black">
                            {counselor.full_name}
                          </p>
                          {counselor.title && (
                            <p className="text-xs text-vb-muted">
                              {counselor.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm text-vb-charcoal bg-vb-subtle px-2 py-1 rounded">
                        {counselor.code}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-vb-black">
                        {counselor.client_count}
                      </span>
                      <span className="text-vb-muted text-sm">명</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/${counselor.code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-vb-teal hover:underline"
                        >
                          페이지
                        </a>
                        <CounselorApprovalActions counselorId={counselor.id} currentStatus="active" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 비활성 카운셀러 */}
      {inactive.length > 0 && (
        <section>
          <h2 className="font-bold text-vb-black mb-4 flex items-center gap-2">
            <span className="text-xl">⛔</span>
            비활성 카운셀러 ({inactive.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full opacity-60">
              <thead className="bg-vb-subtle">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-vb-charcoal">
                    카운셀러
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-vb-charcoal">
                    코드
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-vb-charcoal">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-vb-lightsilver">
                {inactive.map((counselor) => (
                  <tr key={counselor.id}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-vb-black">{counselor.full_name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm text-vb-muted">{counselor.code}</code>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <CounselorApprovalActions counselorId={counselor.id} currentStatus="inactive" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
