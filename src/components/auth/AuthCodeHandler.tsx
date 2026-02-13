"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthCodeHandler() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // URL hash에서 세션 감지 (Supabase implicit flow)
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/brain");
        router.refresh();
      }
    });

    // URL에 code가 있으면 처리
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      // URL에서 code 제거
      url.searchParams.delete("code");
      window.history.replaceState({}, "", url.pathname);

      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error("Auth error:", error);
          alert(`로그인 에러: ${error.message}`);
        }
      });
    }
  }, [router]);

  return null;
}
