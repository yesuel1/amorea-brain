"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import type { Counselor } from "@/types/database";

export function MyCounselorCard() {
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCounselor = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      // 내 프로필에서 카운셀러 ID 확인
      const { data: profile } = await supabase
        .from("profiles")
        .select("counselor_id")
        .eq("id", user.id)
        .single();

      if (!profile?.counselor_id) {
        setIsLoading(false);
        return;
      }

      // 카운셀러 정보 조회
      const { data: counselorData } = await supabase
        .from("counselors")
        .select("*")
        .eq("id", profile.counselor_id)
        .eq("status", "active")
        .single();

      setCounselor(counselorData);
      setIsLoading(false);
    };

    loadCounselor();
  }, []);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-20 bg-vb-subtle rounded-lg"></div>
      </Card>
    );
  }

  if (!counselor) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-vb-teal/5 to-vb-blue/5 border-vb-teal/20">
      <div className="flex items-start gap-4">
        {/* 프로필 사진 */}
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-vb-teal/30">
          {counselor.photo_url ? (
            <Image
              src={counselor.photo_url}
              alt={counselor.full_name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-vb-teal flex items-center justify-center text-2xl text-white">
              {counselor.full_name.charAt(0)}
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-vb-teal font-medium">나의 뇌건강 친구</span>
          </div>
          <h3 className="font-bold text-vb-black text-lg truncate">
            {counselor.full_name}
          </h3>
          {counselor.title && (
            <p className="text-sm text-vb-muted">{counselor.title}</p>
          )}

          {/* 연락처 링크 */}
          <div className="flex gap-2 mt-3">
            {counselor.phone && (
              <a
                href={`tel:${counselor.phone}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm text-vb-charcoal border border-vb-lightsilver hover:border-vb-teal transition-colors"
              >
                <span>📞</span>
                <span>전화</span>
              </a>
            )}
            {counselor.kakao_link && (
              <a
                href={counselor.kakao_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-[#FEE500] rounded-full text-sm text-vb-black hover:opacity-80 transition-opacity"
              >
                <span>💬</span>
                <span>카톡</span>
              </a>
            )}
            {counselor.instagram_link && (
              <a
                href={counselor.instagram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#833AB4] to-[#FD1D1D] rounded-full text-sm text-white hover:opacity-80 transition-opacity"
              >
                <span>📷</span>
                <span>인스타</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 오늘의 메시지 */}
      {counselor.today_message && (
        <div className="mt-4 pt-4 border-t border-vb-lightsilver">
          <div className="flex items-start gap-2">
            <span className="text-lg">💌</span>
            <p className="text-sm text-vb-charcoal leading-relaxed">
              {counselor.today_message}
            </p>
          </div>
        </div>
      )}

      {/* 추천 제품 */}
      {counselor.product_page_url && (
        <a
          href={counselor.product_page_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-between p-3 bg-vb-green/10 rounded-xl hover:bg-vb-green/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="font-medium text-vb-green">추천 뇌건강 영양제</span>
          </div>
          <span className="text-vb-green">→</span>
        </a>
      )}
    </Card>
  );
}
