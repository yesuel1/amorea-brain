"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Subscription, Counselor } from "@/types/database";

const PREMIUM_FEATURES = [
  { icon: "🧠", name: "뇌나이 측정", desc: "무제한", highlight: true },
  { icon: "🎮", name: "프리미엄 게임", desc: "12종 전체", highlight: true },
  { icon: "✨", name: "AI 맞춤 루틴", desc: "매일 새로운 추천", highlight: true },
  { icon: "📊", name: "심층 분석", desc: "영역별 상세 리포트", highlight: true },
  { icon: "👩‍💼", name: "나의 뇌건강 친구", desc: "전담 카운셀러 연결" },
  { icon: "💌", name: "맞춤 응원 메시지", desc: "카운셀러 메시지 수신" },
  { icon: "📅", name: "습관 트래커", desc: "커스텀 무제한" },
  { icon: "🏆", name: "도전 프로그램", desc: "월간 챌린지" },
  { icon: "📱", name: "알림 설정", desc: "맞춤 알림" },
  { icon: "💊", name: "영양제 상담", desc: "전문가 추천" },
];

export default function PremiumPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const prices = {
    monthly: 4900,
    yearly: Math.round(4900 * 12 * 0.9), // 10% 할인 = 52,920원
  };

  const monthlyEquivalent = Math.round(prices.yearly / 12);
  const savings = prices.monthly * 12 - prices.yearly;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsLoading(false);
      return;
    }

    // 현재 구독 정보
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setSubscription(sub);

    // 카운셀러 연결 확인
    const { data: profile } = await supabase
      .from("profiles")
      .select("counselor_id")
      .eq("id", user.id)
      .single();

    if (profile?.counselor_id) {
      const { data: counselorData } = await supabase
        .from("counselors")
        .select("*")
        .eq("id", profile.counselor_id)
        .single();

      setCounselor(counselorData);
    }

    setIsLoading(false);
  };

  const handleSubscribe = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login?redirect=/brain/premium");
      return;
    }

    setIsSubscribing(true);

    // TODO: 실제 결제 연동
    // 지금은 UI 데모로 구독 정보만 저장
    const expiresAt = new Date();
    if (selectedPlan === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const { error } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        plan_type: selectedPlan,
        status: "active",
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      });

    if (error) {
      console.error("Subscription error:", error);
      alert("구독 처리 중 오류가 발생했습니다.");
    } else {
      alert("🎉 프리미엄 구독이 시작되었습니다!");
      router.push("/brain");
    }

    setIsSubscribing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vb-bg pt-20 flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">로딩 중...</div>
      </div>
    );
  }

  // 이미 무료 구독 중 (카운셀러 연결)
  if (subscription?.plan_type === "free" && counselor) {
    return (
      <div className="min-h-screen bg-vb-bg pt-20 pb-8 px-4">
        <div className="max-w-mobile mx-auto">
          <Card className="text-center py-8 bg-gradient-to-r from-vb-teal/10 to-vb-blue/10 border-vb-teal">
            <span className="text-5xl block mb-4">🎁</span>
            <h1 className="text-2xl font-bold text-vb-black mb-2">
              무료로 이용 중이에요!
            </h1>
            <p className="text-vb-charcoal mb-4">
              <strong>{counselor.full_name}</strong> 카운셀러 링크로 가입하셔서<br />
              모든 프리미엄 기능을 무료로 이용하고 계십니다.
            </p>
            <Button variant="outline" onClick={() => router.push("/brain")}>
              뇌건강 케어 하러가기
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // 이미 유료 구독 중
  if (subscription?.status === "active" && subscription.plan_type !== "free") {
    return (
      <div className="min-h-screen bg-vb-bg pt-20 pb-8 px-4">
        <div className="max-w-mobile mx-auto">
          <Card className="text-center py-8 bg-gradient-to-r from-vb-gold/10 to-vb-coral/10 border-vb-gold">
            <span className="text-5xl block mb-4">⭐</span>
            <h1 className="text-2xl font-bold text-vb-black mb-2">
              프리미엄 회원이에요!
            </h1>
            <p className="text-vb-charcoal mb-2">
              {subscription.plan_type === "yearly" ? "연간" : "월간"} 구독 중
            </p>
            {subscription.expires_at && (
              <p className="text-sm text-vb-muted mb-4">
                만료일: {new Date(subscription.expires_at).toLocaleDateString("ko-KR")}
              </p>
            )}
            <Button variant="outline" onClick={() => router.push("/brain")}>
              뇌건강 케어 하러가기
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vb-bg">
      {/* 히어로 */}
      <div className="bg-gradient-to-b from-vb-navy to-vb-charcoal pt-20 pb-16 px-4">
        <div className="max-w-mobile mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-vb-gold/20 text-vb-gold text-sm font-medium rounded-full mb-4">
            ⭐ PREMIUM
          </span>
          <h1 className="text-2xl font-bold text-white mb-2">
            뇌 건강, 전문가와 함께
          </h1>
          <p className="text-vb-silver">
            AI 맞춤 루틴과 전담 카운셀러가 함께합니다
          </p>
        </div>
      </div>

      <div className="max-w-mobile mx-auto px-4 -mt-8">
        {/* 무료 이용 안내 */}
        <Card className="mb-4 bg-vb-teal/10 border-vb-teal/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="font-medium text-vb-black">무료로 이용하는 방법</p>
              <p className="text-sm text-vb-charcoal">
                카운셀러 링크로 가입하면 <strong>모든 기능 무료!</strong>
              </p>
            </div>
          </div>
        </Card>

        {/* 요금제 선택 */}
        <Card className="mb-6">
          <div className="flex gap-2 p-1 bg-vb-subtle rounded-xl mb-4">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPlan === "monthly"
                  ? "bg-white text-vb-black shadow-sm"
                  : "text-vb-muted"
              }`}
            >
              월간
            </button>
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPlan === "yearly"
                  ? "bg-white text-vb-black shadow-sm"
                  : "text-vb-muted"
              }`}
            >
              연간 <span className="text-vb-coral text-xs">10% 할인</span>
            </button>
          </div>

          <div className="text-center mb-4">
            {selectedPlan === "yearly" ? (
              <>
                <p className="text-3xl font-bold text-vb-black">
                  ₩{monthlyEquivalent.toLocaleString()}
                  <span className="text-lg font-normal text-vb-muted">/월</span>
                </p>
                <p className="text-sm text-vb-muted">
                  연 ₩{prices.yearly.toLocaleString()} (₩{savings.toLocaleString()} 절약)
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-vb-black">
                ₩{prices.monthly.toLocaleString()}
                <span className="text-lg font-normal text-vb-muted">/월</span>
              </p>
            )}
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleSubscribe}
            isLoading={isSubscribing}
          >
            프리미엄 시작하기
          </Button>
          <p className="text-center text-vb-muted text-xs mt-2">
            결제 시스템 준비 중 (곧 오픈 예정)
          </p>
        </Card>

        {/* 프리미엄 혜택 */}
        <div className="mb-6">
          <h2 className="font-bold text-vb-black mb-3 flex items-center gap-2">
            <span>⭐</span> 프리미엄 혜택
          </h2>
          <Card>
            <div className="space-y-3">
              {PREMIUM_FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 py-2 ${
                    i !== PREMIUM_FEATURES.length - 1
                      ? "border-b border-vb-lightsilver"
                      : ""
                  }`}
                >
                  <span className="text-xl">{feature.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-vb-black">{feature.name}</p>
                    <p className="text-xs text-vb-muted">{feature.desc}</p>
                  </div>
                  {feature.highlight && (
                    <span className="text-xs px-2 py-0.5 bg-vb-coral/10 text-vb-coral rounded-full">
                      NEW
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 가격 비교 */}
        <div className="mb-6">
          <h2 className="font-bold text-vb-black mb-3 flex items-center gap-2">
            <span>💰</span> 가격 비교
          </h2>
          <Card>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-vb-lightsilver">
                <div>
                  <p className="font-medium text-vb-black">월간 구독</p>
                  <p className="text-xs text-vb-muted">매월 자동 결제</p>
                </div>
                <p className="font-bold text-vb-black">₩4,900/월</p>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-vb-lightsilver">
                <div>
                  <p className="font-medium text-vb-black">연간 구독</p>
                  <p className="text-xs text-vb-teal">10% 할인 적용</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-vb-black">₩4,410/월</p>
                  <p className="text-xs text-vb-muted">연 ₩52,920</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 bg-vb-teal/10 rounded-lg px-3 -mx-3">
                <div>
                  <p className="font-medium text-vb-teal">카운셀러 링크 가입</p>
                  <p className="text-xs text-vb-charcoal">추천 링크로 가입 시</p>
                </div>
                <p className="font-bold text-vb-teal text-xl">무료!</p>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="font-bold text-vb-black mb-3 flex items-center gap-2">
            <span>❓</span> 자주 묻는 질문
          </h2>
          <div className="space-y-3">
            <FAQItem
              q="카운셀러 링크로 무료 가입하려면?"
              a="주변에 AMOREA 카운셀러가 있다면, 카운셀러의 초대 링크를 통해 가입하시면 모든 프리미엄 기능을 무료로 이용할 수 있습니다."
            />
            <FAQItem
              q="언제든 해지할 수 있나요?"
              a="네, 설정에서 언제든 해지 가능합니다. 해지 후에도 결제 기간 동안 프리미엄을 사용할 수 있습니다."
            />
            <FAQItem
              q="환불 정책은 어떻게 되나요?"
              a="결제 후 7일 이내 사용 기록이 없으면 전액 환불 가능합니다."
            />
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="pb-8">
          <Button
            fullWidth
            size="lg"
            onClick={handleSubscribe}
            isLoading={isSubscribing}
          >
            프리미엄 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium text-vb-black">{q}</p>
        <span className="text-vb-muted">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <p className="text-sm text-vb-charcoal mt-3 pt-3 border-t border-vb-lightsilver">
          {a}
        </p>
      )}
    </Card>
  );
}
