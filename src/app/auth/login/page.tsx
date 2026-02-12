"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { trackSignupStart } from "@/lib/analytics";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/brain";
  const counselorCode = searchParams.get("counselor_code");

  const handleOAuthLogin = async (providerName: "google" | "kakao") => {
    const supabase = createClient();
    trackSignupStart(providerName);

    // 리다이렉트 URL에 counselor_code 포함
    const redirectUrl = new URL("/auth/callback", window.location.origin);
    redirectUrl.searchParams.set("redirect", redirect);
    if (counselorCode) {
      redirectUrl.searchParams.set("counselor_code", counselorCode);
    }

    await supabase.auth.signInWithOAuth({
      provider: providerName,
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-vb-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🧠</span>
            <div>
              <h1 className="font-display font-bold text-2xl text-vb-black">
                AMOREA
              </h1>
              <p className="font-display text-vb-teal text-sm tracking-wider">
                BRAIN CARE
              </p>
            </div>
          </div>
          <p className="text-vb-charcoal">
            뇌 건강 습관 플랫폼에 오신 것을 환영합니다
          </p>
        </div>

        {/* 로그인 카드 */}
        <Card>
          <div className="space-y-4">
            {/* 카카오 로그인 */}
            <button
              onClick={() => handleOAuthLogin("kakao")}
              className="w-full flex items-center justify-center gap-3 p-4 bg-[#FEE500] rounded-xl font-semibold text-vb-black hover:bg-opacity-90 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#3C1E1E">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.8 5.27 4.5 6.7-.14.52-.9 3.27-.93 3.48 0 0-.02.17.09.24.11.07.24.02.24.02.31-.04 3.64-2.4 4.19-2.79.63.09 1.28.14 1.91.14 5.52 0 10-3.58 10-8C22 6.58 17.52 3 12 3z" />
              </svg>
              카카오로 계속하기
            </button>

            {/* Google 로그인 */}
            <button
              onClick={() => handleOAuthLogin("google")}
              className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-vb-lightsilver rounded-xl font-semibold text-vb-black hover:bg-vb-subtle transition-colors"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 계속하기
            </button>
          </div>

          {/* 안내 */}
          <div className="mt-6 p-4 bg-vb-subtle rounded-xl">
            <p className="text-sm text-vb-charcoal text-center leading-relaxed">
              로그인하면 뇌나이 기록이 저장되고
              <br />
              <span className="text-vb-teal font-medium">동년배 비교</span>가 가능합니다
            </p>
          </div>

          {/* 약관 */}
          <p className="mt-4 text-xs text-vb-muted text-center">
            로그인 시{" "}
            <span className="underline cursor-pointer">이용약관</span> 및{" "}
            <span className="underline cursor-pointer">개인정보처리방침</span>에 동의합니다
          </p>
        </Card>

        {/* 돌아가기 */}
        <div className="mt-6 text-center">
          <a href="/brain" className="text-vb-muted hover:text-vb-black text-sm">
            ← 메인으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">로딩 중...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
