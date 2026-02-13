"use client";

import Image from "next/image";
import Link from "next/link";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Counselor } from "@/types/database";

interface CounselorLandingProps {
  counselor: Counselor;
  isLoggedIn: boolean;
}

export function CounselorLanding({ counselor, isLoggedIn }: CounselorLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-vb-navy to-vb-black">
      {/* 히어로 섹션 */}
      <div className="pt-12 pb-8 px-4 text-center">
        <div className="max-w-mobile mx-auto">
          {/* 카운셀러 프로필 */}
          <div className="mb-6">
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
              {counselor.photo_url ? (
                <Image
                  src={counselor.photo_url}
                  alt={counselor.full_name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-vb-teal flex items-center justify-center text-4xl text-white">
                  {counselor.full_name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* 카운셀러 이름 */}
          <h1 className="text-2xl font-bold text-white mb-1">
            {counselor.full_name}
          </h1>
          {counselor.title && (
            <p className="text-vb-teal font-medium mb-4">{counselor.title}</p>
          )}

          {/* 소개 */}
          {counselor.introduction && (
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
              {counselor.introduction}
            </p>
          )}

          {/* SNS 링크 */}
          <div className="flex justify-center gap-3 mb-8">
            {counselor.phone && (
              <a
                href={`tel:${counselor.phone}`}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <span className="text-lg">📞</span>
              </a>
            )}
            {counselor.kakao_link && (
              <a
                href={counselor.kakao_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FEE500] flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <span className="text-lg">💬</span>
              </a>
            )}
            {counselor.instagram_link && (
              <a
                href={counselor.instagram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <span className="text-lg text-white">📷</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="bg-vb-bg rounded-t-3xl pt-8 pb-12 px-4 min-h-[50vh]">
        <div className="max-w-mobile mx-auto">
          {/* 오늘의 메시지 */}
          {counselor.today_message && (
            <Card className="mb-6 bg-gradient-to-r from-vb-teal/10 to-vb-blue/10 border-vb-teal/20">
              <div className="flex gap-3">
                <span className="text-2xl">💌</span>
                <div>
                  <p className="text-sm font-medium text-vb-teal mb-1">오늘의 메시지</p>
                  <p className="text-vb-charcoal">{counselor.today_message}</p>
                </div>
              </div>
            </Card>
          )}

          {/* 소개 카드 */}
          <Card className="mb-6">
            <h2 className="font-bold text-vb-black mb-3 flex items-center gap-2">
              <span>🧠</span> AMOREA 뇌건강 케어
            </h2>
            <ul className="space-y-2 text-sm text-vb-charcoal">
              <li className="flex items-start gap-2">
                <span className="text-vb-teal">✓</span>
                <span>매일 3분, 재미있는 두뇌 게임으로 뇌 활성화</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-vb-teal">✓</span>
                <span>뇌건강 습관 체크리스트로 일상 관리</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-vb-teal">✓</span>
                <span>나만의 뇌건강 카운셀러와 함께하는 케어</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-vb-teal">✓</span>
                <span>맞춤 뇌건강 영양 추천</span>
              </li>
            </ul>
          </Card>

          {/* 무료 혜택 안내 */}
          <Card className="mb-6 bg-gradient-to-r from-vb-gold/10 to-vb-coral/10 border-vb-gold/30">
            <div className="text-center">
              <p className="text-vb-gold font-bold mb-1">🎁 특별 혜택</p>
              <p className="text-vb-black font-medium">
                {counselor.full_name} 카운셀러 링크로 가입하시면
              </p>
              <p className="text-2xl font-bold text-vb-coral mt-2">
                모든 기능 무료!
              </p>
              <p className="text-xs text-vb-muted mt-1">
                (정가 월 4,900원)
              </p>
            </div>
          </Card>

          {/* 로그인/시작 버튼 */}
          <div className="space-y-3">
            {isLoggedIn ? (
              <Link href="/brain">
                <Button fullWidth size="lg">
                  🧠 뇌건강 케어 시작하기
                </Button>
              </Link>
            ) : (
              <>
                <GoogleLoginButton
                  redirectTo="/brain"
                  counselorCode={counselor.code}
                />
                <p className="text-center text-xs text-vb-muted">
                  가입 시 {counselor.full_name} 카운셀러와 자동 연결됩니다
                </p>
              </>
            )}
          </div>

          {/* 제품 링크 */}
          {counselor.product_page_url && (
            <div className="mt-8 pt-6 border-t border-vb-lightsilver">
              <a
                href={counselor.product_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="bg-vb-green/5 border-vb-green/20 hover:border-vb-green/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌿</span>
                    <div className="flex-1">
                      <p className="font-medium text-vb-black">추천 뇌건강 영양제</p>
                      <p className="text-sm text-vb-muted">바로가기 →</p>
                    </div>
                  </div>
                </Card>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
