import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";


export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/brain";

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

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // 에러가 있으면 에러 메시지 포함
    console.error("Auth callback error:", error);
    return NextResponse.redirect(`${origin}/brain?error=${encodeURIComponent(error.message)}`);
  }

  // code가 없으면 에러
  return NextResponse.redirect(`${origin}/brain?error=no_code`);
}
