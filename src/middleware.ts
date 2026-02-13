import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// 보호된 경로 정의
const protectedRoutes = ["/brain/dashboard", "/brain/habits"];
const counselorRoutes = ["/counselor/dashboard", "/counselor/clients", "/counselor/mypage"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // OAuth code가 있으면 /api/auth/callback으로 리다이렉트
  const code = searchParams.get("code");
  if (code && pathname === "/") {
    const callbackUrl = new URL("/api/auth/callback", request.url);
    callbackUrl.searchParams.set("code", code);
    callbackUrl.searchParams.set("next", "/brain");
    return NextResponse.redirect(callbackUrl);
  }

  const { response, user } = await updateSession(request);

  // 보호된 경로 체크
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isCounselorRoute = counselorRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // 로그인 필요 경로
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 카운셀러 전용 경로 (추후 role 체크 추가)
  if (isCounselorRoute && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 관리자 전용 경로 (추후 role 체크 추가)
  if (isAdminRoute && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
