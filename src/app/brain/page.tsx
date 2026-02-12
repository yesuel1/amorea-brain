import { HeroSection } from "@/components/brain/HeroSection";
import { CounselorMessageCard } from "@/components/brain/CounselorMessageCard";
import { BrainMapSection } from "@/components/brain/BrainMapSection";
import { StatsSection } from "@/components/brain/StatsSection";
import { HabitChecklist } from "@/components/brain/HabitChecklist";
import { ProductsSection } from "@/components/brain/ProductsSection";
import { QuoteSection } from "@/components/brain/QuoteSection";
import { BottomCTA } from "@/components/brain/BottomCTA";
import { GoogleLoginButton } from "@/components/auth";
import { createClient } from "@/lib/supabase/server";

export default async function BrainPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 메인 컨텐츠 */}
      <div className="max-w-mobile mx-auto px-4 pb-32">
        {/* 로그인 (비로그인 시에만 표시) */}
        {!user && (
          <div className="mt-6 mb-8">
            <GoogleLoginButton redirectTo="/brain/dashboard" />
          </div>
        )}

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
