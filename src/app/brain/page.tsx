
import { HeroSection } from "@/components/brain/HeroSection";
import { CounselorMessageCard } from "@/components/brain/CounselorMessageCard";
import { BrainMapSection } from "@/components/brain/BrainMapSection";
import { StatsSection } from "@/components/brain/StatsSection";
import { HabitChecklist } from "@/components/brain/HabitChecklist";
import { ProductsSection } from "@/components/brain/ProductsSection";
import { QuoteSection } from "@/components/brain/QuoteSection";
import { BottomCTA } from "@/components/brain/BottomCTA";
import { GoogleLoginButton, LogoutButton } from "@/components/auth";
import { createClient } from "@/lib/supabase/server";

export default async function BrainPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 메인 컨텐츠 */}
      <div className="max-w-mobile mx-auto px-4 pb-32">
        {/* 로그인/로그아웃 */}
        <div className="mt-6 mb-8">
          {user ? (
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <span className="text-vb-charcoal">
                {user.email}로 로그인됨
              </span>
              <LogoutButton className="text-sm text-vb-coral hover:underline" />
            </div>
          ) : (
            <GoogleLoginButton redirectTo="/brain" />
          )}
        </div>

        {/* 카운셀러 메시지 카드 */}
        <CounselorMessageCard />

        {/* 인터랙티브 두뇌 맵 */}
        <BrainMapSection />

        {/* 통계 카드 */}
        <StatsSection />

        {/* 오늘의 뇌 습관 체크리스트 */}
        <HabitChecklist />

        {/* 추천 브레인 영양 */}
        <ProductsSection />

        {/* 명언 섹션 */}
        <QuoteSection />
      </div>

      {/* 하단 고정 CTA */}
      <BottomCTA />
    </>
  );
}
