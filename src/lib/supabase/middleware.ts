import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Supabase 설정이 없으면 그냥 통과
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { response, user: null };
  }

  let updatedResponse = response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          updatedResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          updatedResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          updatedResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          updatedResponse.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // 세션 갱신
  const { data: { user } } = await supabase.auth.getUser();

  return { response: updatedResponse, user };
}
