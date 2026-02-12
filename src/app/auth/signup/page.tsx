"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSessionId } from "@/lib/free-usage";
import { trackSignupComplete } from "@/lib/analytics";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/brain";
  const counselorCode = searchParams.get("counselor_code");

  const [displayName, setDisplayName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "O" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 80 }, (_, i) => currentYear - 20 - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("이름을 입력해주세요");
      return;
    }
    if (!birthYear) {
      setError("출생연도를 선택해주세요");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인 세션이 만료되었습니다");
        router.push("/auth/login");
        return;
      }

      // 프로필 업데이트
      const updateData: {
        display_name: string;
        birth_year: number;
        gender?: "M" | "F" | "O" | null;
        counselor_id?: string | null;
      } = {
        display_name: displayName.trim(),
        birth_year: parseInt(birthYear, 10),
      };

      if (gender) {
        updateData.gender = gender as "M" | "F" | "O";
      }

      if (counselorCode) {
        updateData.counselor_id = await getCounselorId(supabase, counselorCode);
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      // 이전 비로그인 결과를 계정에 연동
      const sessionId = getSessionId();
      if (sessionId) {
        await supabase
          .from("brain_tests")
          .update({ user_id: user.id })
          .eq("session_id", sessionId)
          .is("user_id", null);

        await supabase
          .from("game_records")
          .update({ user_id: user.id })
          .eq("session_id", sessionId)
          .is("user_id", null);
      }

      trackSignupComplete(counselorCode || undefined);

      // 완료 - 원래 목적지로 이동
      router.push(redirect);
    } catch (err) {
      console.error("Signup error:", err);
      setError("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vb-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🎉</span>
          <h1 className="text-2xl font-bold text-vb-black mb-2">
            거의 다 됐어요!
          </h1>
          <p className="text-vb-muted">
            마지막으로 간단한 정보만 입력해주세요
          </p>
        </div>

        {/* 폼 */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-vb-black mb-2">
                이름 <span className="text-vb-coral">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 rounded-xl border-2 border-vb-lightsilver focus:border-vb-teal focus:outline-none transition-colors text-lg"
                maxLength={20}
              />
            </div>

            {/* 출생연도 */}
            <div>
              <label className="block text-sm font-medium text-vb-black mb-2">
                출생연도 <span className="text-vb-coral">*</span>
              </label>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-vb-lightsilver focus:border-vb-teal focus:outline-none transition-colors text-lg bg-white"
              >
                <option value="">선택해주세요</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}년생 ({currentYear - year}세)
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-vb-muted">
                동년배 비교를 위해 필요합니다
              </p>
            </div>

            {/* 성별 (선택) */}
            <div>
              <label className="block text-sm font-medium text-vb-black mb-2">
                성별 <span className="text-vb-muted text-xs">(선택)</span>
              </label>
              <div className="flex gap-3">
                {[
                  { value: "M", label: "남성" },
                  { value: "F", label: "여성" },
                  { value: "O", label: "기타" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGender(option.value as "M" | "F" | "O")}
                    className={`
                      flex-1 py-3 rounded-xl border-2 font-medium transition-colors
                      ${
                        gender === option.value
                          ? "border-vb-teal bg-vb-teal/10 text-vb-teal"
                          : "border-vb-lightsilver text-vb-muted hover:border-vb-silver"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p className="text-vb-coral text-sm text-center">{error}</p>
            )}

            {/* 제출 버튼 */}
            <Button type="submit" fullWidth isLoading={isLoading}>
              시작하기
            </Button>
          </form>

          {/* 카운셀러 연결 안내 */}
          {counselorCode && (
            <div className="mt-4 p-3 bg-vb-teal/10 rounded-xl text-center">
              <p className="text-sm text-vb-teal">
                🎁 카운셀러 추천으로 가입하셨습니다
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// 카운셀러 코드로 ID 조회
async function getCounselorId(supabase: ReturnType<typeof createClient>, code: string): Promise<string | null> {
  const { data } = await supabase
    .from("counselors")
    .select("id")
    .eq("code", code)
    .eq("is_approved", true)
    .single();

  return data?.id || null;
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">로딩 중...</div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
