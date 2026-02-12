"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { trackShare } from "@/lib/analytics";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url: string;
  contentType: "brain_test" | "message";
}

export function ShareSheet({
  isOpen,
  onClose,
  title,
  text,
  url,
  contentType,
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleKakaoShare = async () => {
    // Kakao SDK가 로드되어 있는지 확인
    if (typeof window !== "undefined" && window.Kakao) {
      if (!window.Kakao.isInitialized() && process.env.NEXT_PUBLIC_KAKAO_JS_KEY) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title,
          description: text,
          imageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`,
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
        buttons: [
          {
            title: "나도 측정하기",
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });

      trackShare(contentType, "kakao");
      onClose();
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        trackShare(contentType, "sms");
        onClose();
      } catch {
        // 사용자가 취소한 경우
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackShare(contentType, "link");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 복사 실패
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="공유하기">
      <div className="space-y-3">
        {/* 카카오톡 공유 */}
        <button
          onClick={handleKakaoShare}
          className="w-full flex items-center gap-4 p-4 bg-[#FEE500] rounded-2xl hover:bg-opacity-90 transition-colors"
        >
          <div className="w-12 h-12 bg-[#3C1E1E] rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#FEE500">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.8 5.27 4.5 6.7-.14.52-.9 3.27-.93 3.48 0 0-.02.17.09.24.11.07.24.02.24.02.31-.04 3.64-2.4 4.19-2.79.63.09 1.28.14 1.91.14 5.52 0 10-3.58 10-8C22 6.58 17.52 3 12 3z" />
            </svg>
          </div>
          <span className="font-semibold text-vb-black">카카오톡으로 공유</span>
        </button>

        {/* 기타 공유 (Web Share API) */}
        {"share" in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center gap-4 p-4 bg-vb-subtle rounded-2xl hover:bg-vb-lightsilver transition-colors"
          >
            <div className="w-12 h-12 bg-vb-teal rounded-xl flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </div>
            <span className="font-semibold text-vb-black">문자 / 다른 앱으로 공유</span>
          </button>
        )}

        {/* 링크 복사 */}
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center gap-4 p-4 bg-vb-subtle rounded-2xl hover:bg-vb-lightsilver transition-colors"
        >
          <div className="w-12 h-12 bg-vb-charcoal rounded-xl flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="font-semibold text-vb-black">
            {copied ? "복사 완료!" : "링크 복사"}
          </span>
        </button>
      </div>
    </Modal>
  );
}

// Kakao SDK 타입 선언
declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: KakaoShareOptions) => void;
      };
    };
  }
}

interface KakaoShareOptions {
  objectType: string;
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}
