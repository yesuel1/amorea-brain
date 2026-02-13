"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthCodeHandler() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // 이미 처리 중이면 스킵
    if (isProcessing) return;

    // URL에 code가 있으면 처리
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      setIsProcessing(true);

      // URL에서 code 제거 (history 변경)
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);

      // 클라이언트에서 code 교환
      supabase.auth.exchangeCodeForSession(code)
        .then(async ({ data, error }) => {
          if (error) {
            console.error("Auth error:", error.message);
            router.replace(`/brain?error=${encodeURIComponent(error.message)}`);
          } else if (data.session) {
            // Google에서 이름 가져와서 프로필 업데이트
            const user = data.session.user;
            const googleName = user.user_metadata?.full_name ||
                               user.user_metadata?.name ||
                               user.email?.split("@")[0];

            if (googleName) {
              // profiles 테이블에 이름 저장 (없으면)
              const { data: profile } = await supabase
                .from("profiles")
                .select("display_name")
                .eq("id", user.id)
                .single();

              if (!profile?.display_name) {
                await supabase
                  .from("profiles")
                  .upsert({
                    id: user.id,
                    display_name: googleName,
                    updated_at: new Date().toISOString(),
                  });
              }
            }

            // 로그인 성공
            router.replace("/brain");
            router.refresh();
          }
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }, [router, isProcessing]);

  return null;
}
