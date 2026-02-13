import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/brain";
  const counselorCode = searchParams.get("counselor_code");

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // 프로필 확인 - 추가 정보가 필요한지 체크
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, birth_year")
        .eq("id", data.user.id)
        .single();

      // 추가 정보가 없으면 회원가입 페이지로
      if (!profile?.display_name || !profile?.birth_year) {
        const signupUrl = new URL("/auth/signup", origin);
        signupUrl.searchParams.set("redirect", redirect);
        if (counselorCode) {
          signupUrl.searchParams.set("counselor_code", counselorCode);
        }
        return NextResponse.redirect(signupUrl);
      }

      // 이미 프로필이 있으면 원래 목적지로
      return NextResponse.redirect(new URL(redirect, origin));
    }
  }

  // 에러 시 로그인 페이지로
  return NextResponse.redirect(new URL("/auth/login?error=auth_failed", origin));
}
