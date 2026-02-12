"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CounselorProfile {
  id: string;
  code: string;
  full_name: string;
  title: string | null;
  photo_url: string | null;
  introduction: string | null;
  blog_url: string | null;
  product_page_url: string | null;
  today_message: string | null;
}

export default function CounselorMyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CounselorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 폼 상태
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [productPageUrl, setProductPageUrl] = useState("");
  const [todayMessage, setTodayMessage] = useState("");

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login?redirect=/counselor/mypage");
      return;
    }

    const { data } = await supabase
      .from("counselors")
      .select("*")
      .eq("id", user.id)
      .eq("is_approved", true)
      .single();

    if (!data) {
      router.push("/brain");
      return;
    }

    setProfile(data);
    setTitle(data.title || "");
    setIntroduction(data.introduction || "");
    setBlogUrl(data.blog_url || "");
    setProductPageUrl(data.product_page_url || "");
    setTodayMessage(data.today_message || "");
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("counselors")
      .update({
        title: title || null,
        introduction: introduction || null,
        blog_url: blogUrl || null,
        product_page_url: productPageUrl || null,
        today_message: todayMessage || null,
      })
      .eq("id", profile.id);

    setIsSaving(false);

    if (error) {
      alert("저장 중 오류가 발생했습니다.");
    } else {
      alert("저장되었습니다!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">로딩 중...</div>
      </div>
    );
  }

  if (!profile) return null;

  const previewUrl = `/counselor/${profile.code}`;

  return (
    <div className="min-h-screen bg-vb-bg pt-20 pb-8 px-4">
      <div className="max-w-mobile mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-vb-black">⚙️ 내 프로필</h1>
            <p className="text-vb-muted">고객에게 보여지는 정보를 수정하세요</p>
          </div>
          <Button variant="ghost" onClick={() => router.push("/counselor/dashboard")}>
            ← 대시보드
          </Button>
        </div>

        {/* 프로필 정보 */}
        <Card className="mb-6">
          <div className="space-y-4">
            {/* 이름 (수정 불가) */}
            <div>
              <label className="block text-sm font-medium text-vb-muted mb-1">
                이름
              </label>
              <div className="px-4 py-3 bg-vb-subtle rounded-xl text-vb-black">
                {profile.full_name}
              </div>
            </div>

            {/* 직함 */}
            <div>
              <label className="block text-sm font-medium text-vb-black mb-1">
                직함
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 수석 카운셀러"
                className="w-full px-4 py-3 rounded-xl border-2 border-vb-lightsilver focus:border-vb-teal focus:outline-none"
              />
            </div>

            {/* 소개 */}
            <div>
              <label className="block text-sm font-medium text-vb-black mb-1">
                자기소개
              </label>
              <textarea
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="간단한 자기소개를 작성해주세요"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-vb-lightsilver focus:border-vb-teal focus:outline-none resize-none"
              />
            </div>

            {/* 블로그 URL */}
            <div>
              <label className="block text-sm font-medium text-vb-black mb-1">
                블로그 URL
              </label>
              <input
                type="url"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                placeholder="https://blog.naver.com/..."
                className="w-full px-4 py-3 rounded-xl border-2 border-vb-lightsilver focus:border-vb-teal focus:outline-none"
              />
            </div>

            {/* 제품 페이지 URL */}
            <div>
              <label className="block text-sm font-medium text-vb-black mb-1">
                제품 페이지 URL
              </label>
              <input
                type="url"
                value={productPageUrl}
                onChange={(e) => setProductPageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border-2 border-vb-lightsilver focus:border-vb-teal focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* 오늘의 메시지 */}
        <Card className="mb-6">
          <h2 className="font-bold text-vb-black mb-3">💌 오늘의 메시지</h2>
          <textarea
            value={todayMessage}
            onChange={(e) => setTodayMessage(e.target.value)}
            placeholder="고객들에게 전하고 싶은 오늘의 메시지를 작성해주세요"
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-vb-lightsilver focus:border-vb-teal focus:outline-none resize-none"
          />
          <p className="text-xs text-vb-muted mt-2">
            이 메시지는 내 카운셀러 페이지에 표시됩니다
          </p>
        </Card>

        {/* 버튼들 */}
        <div className="space-y-3">
          <Button fullWidth onClick={handleSave} isLoading={isSaving}>
            저장하기
          </Button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="secondary" fullWidth>
              👀 내 페이지 미리보기
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
