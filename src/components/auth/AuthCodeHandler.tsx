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
        .then(({ data, error }) => {
          if (error) {
            console.error("Auth error:", error.message);
            router.replace(`/brain?error=${encodeURIComponent(error.message)}`);
          } else if (data.session) {
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
