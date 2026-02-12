"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CounselorHeader() {
  const pathname = usePathname();

  // [code] 페이지는 별도 헤더 사용하므로 제외
  if (pathname.match(/^\/counselor\/[^/]+$/) && !pathname.includes("/dashboard") && !pathname.includes("/clients") && !pathname.includes("/mypage")) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-vb-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-mobile mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/counselor/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">👩‍💼</span>
          <div className="flex flex-col">
            <span className="font-display font-bold text-white text-sm tracking-tight">
              COUNSELOR
            </span>
            <span className="font-display text-vb-teal text-xs tracking-wider">
              DASHBOARD
            </span>
          </div>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-1">
          <NavLink href="/counselor/dashboard" current={pathname}>
            홈
          </NavLink>
          <NavLink href="/counselor/clients" current={pathname}>
            고객
          </NavLink>
          <NavLink href="/counselor/mypage" current={pathname}>
            프로필
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
}) {
  const isActive = current === href;

  return (
    <Link
      href={href}
      className={`
        px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
        ${isActive ? "bg-white/10 text-white" : "text-vb-silver hover:text-white"}
      `}
    >
      {children}
    </Link>
  );
}
