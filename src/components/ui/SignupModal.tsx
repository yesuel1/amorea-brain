"use client";

import { Modal } from "./Modal";
import { trackSignupStart } from "@/lib/analytics";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const handleGoogleLogin = () => {
    trackSignupStart("google");
    // TODO: Supabase Google OAuth
    window.location.href = "/auth/login?provider=google";
  };

  const handleKakaoLogin = () => {
    trackSignupStart("kakao");
    // TODO: Supabase Kakao OAuth
    window.location.href = "/auth/login?provider=kakao";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* 아이콘 */}
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-vb-coral/20 to-vb-teal/20 rounded-full flex items-center justify-center">
          <span className="text-4xl">🧠</span>
        </div>

        {/* 제목 */}
        <h2 className="text-xl font-bold text-vb-black mb-2">
          무료 체험이 끝났어요
        </h2>

        {/* 설명 */}
        <p className="text-vb-muted mb-6 leading-relaxed">
          지금까지의 결과를 저장하고
          <br />
          <span className="text-vb-teal font-semibold">동년배 상위 몇%</span>인지 확인하세요!
        </p>

        {/* 혜택 목록 */}
        <div className="bg-vb-subtle rounded-2xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-vb-black mb-2">가입하면 받는 혜택</p>
          <ul className="space-y-2 text-sm text-vb-charcoal">
            <li className="flex items-center gap-2">
              <span className="text-vb-teal">✓</span>
              뇌나이 기록 저장 및 추이 분석
            </li>
            <li className="flex items-center gap-2">
              <span className="text-vb-teal">✓</span>
              동년배 비교 통계 확인
            </li>
            <li className="flex items-center gap-2">
              <span className="text-vb-teal">✓</span>
              매일 뇌운동 게임 무제한
            </li>
            <li className="flex items-center gap-2">
              <span className="text-vb-teal">✓</span>
              전담 카운셀러 응원 메시지
            </li>
          </ul>
        </div>

        {/* 로그인 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3 p-4 bg-[#FEE500] rounded-xl font-semibold text-vb-black hover:bg-opacity-90 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#3C1E1E">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.8 5.27 4.5 6.7-.14.52-.9 3.27-.93 3.48 0 0-.02.17.09.24.11.07.24.02.24.02.31-.04 3.64-2.4 4.19-2.79.63.09 1.28.14 1.91.14 5.52 0 10-3.58 10-8C22 6.58 17.52 3 12 3z" />
            </svg>
            카카오로 시작하기
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-vb-lightsilver rounded-xl font-semibold text-vb-black hover:bg-vb-subtle transition-colors"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google로 시작하기
          </button>
        </div>

        {/* 하단 안내 */}
        <p className="mt-4 text-xs text-vb-muted">
          가입 시 <span className="underline">이용약관</span> 및{" "}
          <span className="underline">개인정보처리방침</span>에 동의합니다
        </p>
      </div>
    </Modal>
  );
}
