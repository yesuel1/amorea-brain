// Window.Kakao 타입은 @/components/ui/ShareSheet.tsx에서 선언됨

export function initKakao() {
  if (typeof window === "undefined") return;

  const script = document.createElement("script");
  script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js";
  script.async = true;
  script.onload = () => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
    }
  };
  document.head.appendChild(script);
}

export function shareToKakao({
  title,
  description,
  imageUrl,
  url,
  buttonText = "자세히 보기",
}: {
  title: string;
  description: string;
  imageUrl?: string;
  url: string;
  buttonText?: string;
}) {
  if (typeof window === "undefined" || !window.Kakao?.isInitialized()) {
    console.error("Kakao SDK not initialized");
    return false;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://amorea.kr";
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const defaultImage = `${baseUrl}/og-image.png`;

  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title,
      description,
      imageUrl: imageUrl || defaultImage,
      link: {
        mobileWebUrl: fullUrl,
        webUrl: fullUrl,
      },
    },
    buttons: [
      {
        title: buttonText,
        link: {
          mobileWebUrl: fullUrl,
          webUrl: fullUrl,
        },
      },
    ],
  });

  return true;
}

// 뇌나이 결과 공유
export function shareBrainAgeResult(brainAge: number, percentile: number) {
  return shareToKakao({
    title: `나의 뇌나이는 ${brainAge}세! 🧠`,
    description: `동년배 상위 ${percentile}%의 젊은 뇌! 당신의 뇌나이도 측정해보세요.`,
    url: "/brain/test",
    buttonText: "나도 측정하기",
  });
}

// 게임 점수 공유
export function shareGameScore(
  gameType: string,
  score: number,
  gameNames: Record<string, string> = {
    memory: "기억력",
    calc: "계산력",
    focus: "집중력",
  }
) {
  const gameName = gameNames[gameType] || gameType;
  return shareToKakao({
    title: `${gameName} 게임 ${score}점 달성! 🏆`,
    description: `AMOREA 뇌 건강 게임에서 ${score}점을 달성했어요. 당신도 도전해보세요!`,
    url: `/brain/games/${gameType}`,
    buttonText: "나도 도전하기",
  });
}

// 카운셀러 메시지 공유
export function shareCounselorMessage(
  counselorName: string,
  message: string,
  shareUrl: string
) {
  return shareToKakao({
    title: `${counselorName} 카운셀러의 응원 메시지 💌`,
    description: message.slice(0, 100) + (message.length > 100 ? "..." : ""),
    url: shareUrl,
    buttonText: "메시지 보기",
  });
}
