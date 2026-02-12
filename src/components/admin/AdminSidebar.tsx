"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin", label: "대시보드", icon: "📊" },
  { href: "/admin/counselors", label: "카운셀러 관리", icon: "👩‍💼" },
  { href: "/admin/users", label: "회원 관리", icon: "👥" },
  { href: "/admin/content", label: "콘텐츠 관리", icon: "📝" },
  { href: "/admin/products", label: "제품 관리", icon: "💊" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-vb-navy text-white">
      {/* 로고 */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <div>
            <span className="font-display font-bold text-sm">AMOREA</span>
            <span className="font-display text-vb-teal text-xs ml-1">ADMIN</span>
          </div>
        </Link>
      </div>

      {/* 메뉴 */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-vb-silver hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 하단 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <Link
          href="/brain"
          className="flex items-center gap-2 text-sm text-vb-silver hover:text-white transition-colors"
        >
          <span>←</span>
          <span>서비스로 돌아가기</span>
        </Link>
      </div>
    </aside>
  );
}
