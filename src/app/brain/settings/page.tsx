"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NotificationSettings } from "@/components/brain/NotificationSettings";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  display_name: string | null;
  birth_year: number | null;
  role: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      setUser(profile);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;

    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/brain";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vb-bg pt-20 pb-24 flex items-center justify-center">
        <p className="text-vb-muted">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vb-bg pt-20 pb-24">
      <div className="max-w-mobile mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-vb-black">⚙️ 설정</h1>
        </div>

        {/* 프로필 */}
        <Card className="mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-vb-subtle flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="flex-1">
              {user ? (
                <>
                  <p className="font-bold text-vb-black">
                    {user.display_name || "이름 미입력"}
                  </p>
                  <p className="text-sm text-vb-muted">
                    {user.birth_year
                      ? `${new Date().getFullYear() - user.birth_year}세`
                      : "나이 미입력"}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-vb-black">로그인이 필요합니다</p>
                  <p className="text-sm text-vb-muted">
                    로그인하고 기록을 저장하세요
                  </p>
                </>
              )}
            </div>
            {user ? (
              <Link
                href="/auth/signup"
                className="text-sm text-vb-teal hover:underline"
              >
                수정
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button size="sm">로그인</Button>
              </Link>
            )}
          </div>
        </Card>

        {/* 알림 설정 */}
        <div className="mb-4">
          <NotificationSettings />
        </div>

        {/* 앱 설정 */}
        <Card className="mb-4">
          <h3 className="font-bold text-vb-black mb-3 flex items-center gap-2">
            <span>📱</span> 앱 설정
          </h3>
          <div className="space-y-3">
            <SettingRow
              icon="🌙"
              title="다크 모드"
              description="추후 지원 예정"
              disabled
            />
            <SettingRow
              icon="🔊"
              title="효과음"
              description="게임 효과음 켜기/끄기"
              hasToggle
            />
            <SettingRow
              icon="📏"
              title="글씨 크기"
              description="기본"
              disabled
            />
          </div>
        </Card>

        {/* 정보 */}
        <Card className="mb-4">
          <h3 className="font-bold text-vb-black mb-3 flex items-center gap-2">
            <span>ℹ️</span> 정보
          </h3>
          <div className="space-y-3">
            <InfoRow label="버전" value="1.0.0" />
            <InfoRow label="서비스" value="AMOREA Brain Care" />
            <a
              href="https://vitalbeautie.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-sm text-vb-teal hover:underline"
            >
              바이탈뷰티 공식 사이트 →
            </a>
          </div>
        </Card>

        {/* 프리미엄 */}
        {user && user.role === "user" && (
          <Link href="/brain/premium">
            <Card className="mb-4 bg-gradient-to-r from-vb-gold/10 to-vb-gold/5 border-2 border-vb-gold">
              <div className="flex items-center gap-4">
                <span className="text-3xl">⭐</span>
                <div className="flex-1">
                  <p className="font-bold text-vb-black">프리미엄 업그레이드</p>
                  <p className="text-sm text-vb-muted">
                    AI 맞춤 루틴, 전담 카운셀러 등
                  </p>
                </div>
                <span className="text-vb-gold">→</span>
              </div>
            </Card>
          </Link>
        )}

        {/* 로그아웃 */}
        {user && (
          <div className="pt-4">
            <Button
              variant="ghost"
              fullWidth
              onClick={handleLogout}
              className="text-vb-muted"
            >
              로그아웃
            </Button>
          </div>
        )}

        {/* 법적 고지 */}
        <div className="pt-8 text-center space-y-2">
          <div className="flex justify-center gap-4 text-xs text-vb-muted">
            <a href="#" className="hover:underline">
              이용약관
            </a>
            <a href="#" className="hover:underline">
              개인정보처리방침
            </a>
            <a href="#" className="hover:underline">
              고객센터
            </a>
          </div>
          <p className="text-xs text-vb-muted">
            © 2024 AMOREPACIFIC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  hasToggle = false,
  disabled = false,
}: {
  icon: string;
  title: string;
  description: string;
  hasToggle?: boolean;
  disabled?: boolean;
}) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div
      className={`flex items-center justify-between py-2 border-b border-vb-lightsilver last:border-0 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="font-medium text-vb-black text-sm">{title}</p>
          <p className="text-xs text-vb-muted">{description}</p>
        </div>
      </div>
      {hasToggle && !disabled && (
        <button
          onClick={() => setEnabled(!enabled)}
          className={`
            w-10 h-5 rounded-full transition-colors relative
            ${enabled ? "bg-vb-teal" : "bg-vb-lightsilver"}
          `}
        >
          <div
            className={`
              absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform
              ${enabled ? "translate-x-5" : "translate-x-0.5"}
            `}
          />
        </button>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-vb-lightsilver last:border-0">
      <span className="text-sm text-vb-charcoal">{label}</span>
      <span className="text-sm text-vb-muted">{value}</span>
    </div>
  );
}
