import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";


export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/brain";
  const counselorCode = searchParams.get("counselor_code");

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          remove(name: string, _options: CookieOptions) {
            cookieStore.delete(name);
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // 카운셀러 코드가 있고 새 사용자인 경우 연결
      if (counselorCode) {
        // 카운셀러 찾기
        const { data: counselor } = await supabase
          .from("counselors")
          .select("id")
          .eq("code", counselorCode)
          .eq("status", "active")
          .single();

        if (counselor) {
          // 프로필에 카운셀러 연결 (이미 없는 경우에만)
          const { data: profile } = await supabase
            .from("profiles")
            .select("counselor_id")
            .eq("id", data.user.id)
            .single();

          if (profile && !profile.counselor_id) {
            await supabase
              .from("profiles")
              .update({ counselor_id: counselor.id })
              .eq("id", data.user.id);

            // 무료 구독 생성
            await supabase
              .from("subscriptions")
              .upsert({
                user_id: data.user.id,
                plan_type: "free",
                status: "active",
              });

            // 카운셀러 클라이언트 수 증가
            await supabase
              .from("counselors")
              .update({ client_count: counselor.id })
              .eq("id", counselor.id);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    // 에러가 있으면 에러 메시지 포함
    console.error("Auth callback error:", error);
    return NextResponse.redirect(`${origin}/brain?error=${encodeURIComponent(error?.message || "unknown")}`);
  }

  // code가 없으면 에러
  return NextResponse.redirect(`${origin}/brain?error=no_code`);
}
