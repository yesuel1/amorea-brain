import { Card } from "@/components/ui/Card";
import Image from "next/image";

export function CounselorMessageCard() {
  return (
    <section className="-mt-8 relative z-10 mb-8">
      <Card className="overflow-hidden" padding="sm">
        {/* 상단 그라데이션 악센트 바 */}
        <div className="h-1.5 bg-gradient-to-r from-vb-coral via-vb-teal to-vb-blue -mx-4 -mt-4 mb-4" />

        <div className="flex gap-4">
          {/* 카운셀러 프로필 */}
          <div className="flex-shrink-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-vb-subtle">
              <Image
                src="/images/counselor-choi.jpg"
                alt="최연옥 수석 카운셀러"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </div>

          {/* 메시지 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-vb-black">최연옥</span>
              <span className="text-vb-muted text-sm">수석 카운셀러</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-vb-teal/10 text-vb-teal text-xs font-medium rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                인증
              </span>
            </div>
            <p className="text-vb-charcoal text-sm leading-relaxed">
              치매는 유전이 아니라 습관입니다. 오늘 10분의 뇌 운동이 10년 뒤 당신의 뇌를 지켜줍니다.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
