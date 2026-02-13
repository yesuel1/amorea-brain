"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthCodeHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      const supabase = createClient();

      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          console.error("Auth error:", error.message);
          router.replace(`/brain?error=${encodeURIComponent(error.message)}`);
        } else if (data.session) {
          router.replace("/brain");
          router.refresh();
        } else {
          router.replace("/brain?error=no_session");
        }
      });
    }
  }, [searchParams, router]);

  return null;
}
