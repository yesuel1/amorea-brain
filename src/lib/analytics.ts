declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("event", eventName, params);
  }
};

// 뇌나이 측정 관련
export const trackBrainTestStart = () => trackEvent("brain_test_start");
export const trackBrainTestComplete = (brainAge: number, totalScore: number, percentile: number) =>
  trackEvent("brain_test_complete", { brain_age: brainAge, total_score: totalScore, percentile });

// 게임 관련
export const trackGamePlay = (gameType: string, score: number) =>
  trackEvent("game_play", { game_type: gameType, score });

// 습관 관련
export const trackHabitCheck = (habitType: string, streakDays: number) =>
  trackEvent("habit_check", { habit_type: habitType, streak_days: streakDays });

// 가입 관련
export const trackSignupStart = (method: "google" | "kakao") =>
  trackEvent("signup_start", { method });
export const trackSignupComplete = (counselorCode?: string) =>
  trackEvent("signup_complete", { counselor_code: counselorCode });

// 공유 관련
export const trackShare = (contentType: "brain_test" | "message", method: "kakao" | "sms" | "link") =>
  trackEvent("share", { content_type: contentType, method });

// 제품 관련
export const trackProductView = (productSlug: string) =>
  trackEvent("product_view", { product_slug: productSlug });
export const trackProductClickExternal = (productSlug: string) =>
  trackEvent("product_click_external", { product_slug: productSlug, destination: "vitalbeautie" });

// 카운셀러 관련
export const trackCounselorPageView = (counselorCode: string) =>
  trackEvent("counselor_page_view", { counselor_code: counselorCode });
export const trackCounselorMessageSent = (isAiGenerated: boolean) =>
  trackEvent("counselor_message_sent", { is_ai_generated: isAiGenerated });

// 무료 사용 관련
export const trackFreeUse = (remaining: number) =>
  trackEvent("free_use", { remaining });
export const trackPaywallShown = () => trackEvent("paywall_shown");
