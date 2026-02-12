"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const FREE_FEATURES = [
  { icon: "🧠", name: "뇌나이 측정", desc: "월 3회" },
  { icon: "🎮", name: "기본 뇌운동 게임", desc: "3종 무제한" },
  { icon: "📅", name: "습관 트래커", desc: "기본 5개" },
  { icon: "📊", name: "기본 통계", desc: "주간 요약" },
];

const PREMIUM_FEATURES = [
  { icon: "🧠", name: "뇌나이 측정", desc: "무제한", highlight: true },
  { icon: "🎮", name: "프리미엄 게임", desc: "12종 전체", highlight: true },
  { icon: "✨", name: "AI 맞춤 루틴", desc: "매일 새로운 추천", highlight: true },
  { icon: "📊", name: "심층 분석", desc: "영역별 상세 리포트", highlight: true },
  { icon: "👩‍💼", name: "전담 카운셀러", desc: "1:1 맞춤 관리" },
  { icon: "💌", name: "맞춤 응원 메시지", desc: "매주 발송" },
  { icon: "📅", name: "습관 트래커", desc: "커스텀 무제한" },
  { icon: "🏆", name: "도전 프로그램", desc: "월간 챌린지" },
  { icon: "📱", name: "알림 설정", desc: "맞춤 알림" },
  { icon: "💊", name: "영양제 상담", desc: "전문가 추천" },
];

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  const prices = {
    monthly: 9900,
    yearly: 79000, // 33% 할인
  };

  const monthlyEquivalent = Math.round(prices.yearly / 12);

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
              연간 <span className="text-vb-coral text-xs">33% 할인</span>
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
                  연 ₩{prices.yearly.toLocaleString()} (₩{(prices.monthly * 12 - prices.yearly).toLocaleString()} 절약)
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-vb-black">
                ₩{prices.monthly.toLocaleString()}
                <span className="text-lg font-normal text-vb-muted">/월</span>
              </p>
            )}
          </div>

          <Button fullWidth size="lg">
            프리미엄 시작하기
          </Button>
          <p className="text-center text-vb-muted text-xs mt-2">
            7일 무료 체험 후 결제됩니다
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

        {/* 무료 vs 프리미엄 비교 */}
        <div className="mb-6">
          <h2 className="font-bold text-vb-black mb-3 flex items-center gap-2">
            <span>📋</span> 무료 vs 프리미엄
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* 무료 */}
            <Card className="bg-vb-subtle">
              <p className="text-center font-bold text-vb-black mb-3">무료</p>
              <div className="space-y-2">
                {FREE_FEATURES.map((feature, i) => (
                  <div key={i} className="text-center">
                    <span className="text-lg">{feature.icon}</span>
                    <p className="text-xs text-vb-charcoal">{feature.name}</p>
                    <p className="text-xs text-vb-muted">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 프리미엄 */}
            <Card className="bg-gradient-to-b from-vb-gold/10 to-vb-gold/5 border-2 border-vb-gold">
              <p className="text-center font-bold text-vb-black mb-3">
                ⭐ 프리미엄
              </p>
              <div className="space-y-2">
                {PREMIUM_FEATURES.slice(0, 4).map((feature, i) => (
                  <div key={i} className="text-center">
                    <span className="text-lg">{feature.icon}</span>
                    <p className="text-xs text-vb-charcoal">{feature.name}</p>
                    <p className="text-xs text-vb-teal font-medium">
                      {feature.desc}
                    </p>
                  </div>
                ))}
                <p className="text-center text-xs text-vb-muted pt-2">
                  +6개 더...
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="font-bold text-vb-black mb-3 flex items-center gap-2">
            <span>❓</span> 자주 묻는 질문
          </h2>
          <div className="space-y-3">
            <FAQItem
              q="언제든 해지할 수 있나요?"
              a="네, 설정에서 언제든 해지 가능합니다. 해지 후에도 결제 기간 동안 프리미엄을 사용할 수 있습니다."
            />
            <FAQItem
              q="무료 체험 중 결제되나요?"
              a="아니요, 7일 무료 체험 기간 동안은 결제되지 않습니다. 체험 중 해지하면 비용이 발생하지 않습니다."
            />
            <FAQItem
              q="환불 정책은 어떻게 되나요?"
              a="결제 후 7일 이내 사용 기록이 없으면 전액 환불 가능합니다."
            />
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="pb-8">
          <Button fullWidth size="lg">
            7일 무료로 시작하기
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
