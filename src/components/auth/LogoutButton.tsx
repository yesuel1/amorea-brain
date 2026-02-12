"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({
  className = "",
  children = "로그아웃",
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    const supabase = createClient();

    await supabase.auth.signOut();
    router.push("/brain");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`text-gray-600 hover:text-vb-black transition-colors
        disabled:opacity-50 ${className}`}
    >
      {isLoading ? "로그아웃 중..." : children}
    </button>
  );
}
