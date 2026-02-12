import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface CounselorPageProps {
  params: { code: string };
}

async function getCounselor(code: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data } = await supabase
    .from("counselors")
    .select("*")
    .eq("code", code)
    .eq("is_approved", true)
    .single();

  return data;
}

export default async function CounselorPage({ params }: CounselorPageProps) {
  const counselor = await getCounselor(params.code);

  if (!counselor) {
    notFound();
  }

  const signupUrl = `/auth/login?counselor_code=${params.code}&redirect=/brain`;

  return (
    <div className="min-h-screen bg-vb-bg">
      {/* 헤더 */}
      <header className="bg-vb-navy text-white py-4 px-4">
        <div className="max-w-mobile mx-auto flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <div>
            <span className="font-display font-bold text-sm">AMOREA</span>
            <span className="font-display text-vb-teal text-xs ml-1">BRAIN CARE</span>
          </div>
        </div>
      </header>

      {/* 카운셀러 프로필 히어로 */}
      <section className="bg-gradient-to-b from-vb-navy to-vb-charcoal pt-8 pb-16 px-4">
        <div className="max-w-mobile mx-auto text-center">
          {/* 프로필 사진 */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-vb-coral to-vb-teal p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-vb-navy">
                {counselor.photo_url ? (
                  <Image
                    src={counselor.photo_url}
                    alt={counselor.full_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    👩‍💼
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 이름 & 직함 */}
          <h1 className="text-2xl font-bold text-white mb-1">
            {counselor.full_name}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            {counselor.title && (
              <span className="text-vb-silver">{counselor.title}</span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-vb-teal/20 text-vb-teal text-xs font-medium rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              인증 카운셀러
            </span>
          </div>

          {/* 소개 */}
          {counselor.introduction && (
            <p className="text-vb-silver text-sm leading-relaxed max-w-xs mx-auto">
              {counselor.introduction}
            </p>
          )}
        </div>
      </section>

      {/* 메인 컨텐츠 */}
      <div className="max-w-mobile mx-auto px-4 -mt-8">
        {/* 오늘의 메시지 */}
        {counselor.today_message && (
          <Card className="mb-6 relative overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-vb-coral via-vb-teal to-vb-blue absolute top-0 left-0 right-0" />
            <div className="pt-2">
              <p className="text-xs text-vb-muted mb-2">오늘의 메시지</p>
              <p className="text-vb-charcoal leading-relaxed">
                &ldquo;{counselor.today_message}&rdquo;
              </p>
            </div>
          </Card>
        )}

        {/* 브레인케어 소개 */}
        <Card variant="gradient" className="mb-6">
          <div className="text-center">
            <span className="text-4xl block mb-3">🧠</span>
            <h2 className="text-xl font-bold text-white mb-2">
              뇌 습관, 미리 만들어야 늦지 않습니다
            </h2>
            <p className="text-vb-silver text-sm leading-relaxed">
              매일 10분, 재미있는 게임으로 뇌를 깨우고
              <br />
              좋은 습관으로 젊은 뇌를 유지하세요
            </p>
          </div>
        </Card>

        {/* 혜택 안내 */}
        <Card className="mb-6">
          <h3 className="font-bold text-vb-black mb-4">
            {counselor.full_name} 카운셀러와 함께하면
          </h3>
          <ul className="space-y-3">
            {[
              { icon: "🎯", text: "맞춤형 뇌 건강 관리 조언" },
              { icon: "💌", text: "정기적인 응원 메시지" },
              { icon: "📊", text: "나의 뇌 건강 리포트 분석" },
              { icon: "💊", text: "뇌 건강 영양제 상담" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-vb-charcoal">{item.text}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* 외부 링크 */}
        {(counselor.blog_url || counselor.product_page_url) && (
          <div className="flex gap-3 mb-6">
            {counselor.blog_url && (
              <a
                href={counselor.blog_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-vb-subtle rounded-xl text-center text-sm font-medium text-vb-charcoal hover:bg-vb-lightsilver transition-colors"
              >
                📝 블로그 보기
              </a>
            )}
            {counselor.product_page_url && (
              <a
                href={counselor.product_page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-vb-subtle rounded-xl text-center text-sm font-medium text-vb-charcoal hover:bg-vb-lightsilver transition-colors"
              >
                🛒 제품 보기
              </a>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="pb-8">
          <Link href={signupUrl}>
            <Button fullWidth size="lg">
              🧠 {counselor.full_name} 카운셀러와 시작하기
            </Button>
          </Link>
          <p className="text-center text-vb-muted text-xs mt-3">
            무료로 뇌나이 측정 + 맞춤 관리를 받아보세요
          </p>
        </div>
      </div>
    </div>
  );
}
