"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ContentItem {
  id: string;
  section_key: string;
  content_type: string;
  content: string;
  updated_at: string;
}

const CONTENT_SECTIONS = [
  { key: "hero_title", label: "히어로 타이틀", type: "text" },
  { key: "hero_subtitle", label: "히어로 서브타이틀", type: "text" },
  { key: "counselor_message", label: "대표 카운셀러 메시지", type: "text" },
  { key: "cta_text", label: "CTA 버튼 텍스트", type: "text" },
];

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("page_content").select("*");

    const contentMap: Record<string, string> = {};
    (data || []).forEach((item: ContentItem) => {
      contentMap[item.section_key] = item.content;
    });

    // 기본값 설정
    CONTENT_SECTIONS.forEach((section) => {
      if (!contentMap[section.key]) {
        contentMap[section.key] = getDefaultContent(section.key);
      }
    });

    setContent(contentMap);
    setIsLoading(false);
  };

  const handleSave = async (key: string) => {
    setIsSaving(true);
    try {
      const supabase = createClient();

      const { error } = await supabase.from("page_content").upsert(
        {
          section_key: key,
          content: content[key],
          content_type: "text",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" }
      );

      if (error) throw error;

      setEditingKey(null);
      alert("저장되었습니다.");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-vb-muted">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-vb-black">콘텐츠 관리</h1>
        <p className="text-vb-muted">랜딩페이지 텍스트 및 콘텐츠 편집</p>
      </div>

      {/* 콘텐츠 편집 */}
      <div className="space-y-4">
        {CONTENT_SECTIONS.map((section) => (
          <Card key={section.key}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-vb-black">{section.label}</h3>
                <p className="text-xs text-vb-muted">키: {section.key}</p>
              </div>
              {editingKey === section.key ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSave(section.key)}
                    isLoading={isSaving}
                  >
                    저장
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingKey(null);
                      loadContent();
                    }}
                  >
                    취소
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingKey(section.key)}
                >
                  편집
                </Button>
              )}
            </div>

            {editingKey === section.key ? (
              <textarea
                value={content[section.key] || ""}
                onChange={(e) =>
                  setContent({ ...content, [section.key]: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-vb-lightsilver focus:border-vb-teal focus:outline-none resize-none"
              />
            ) : (
              <p className="text-vb-charcoal bg-vb-subtle p-3 rounded-lg">
                {content[section.key] || "(내용 없음)"}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* 미리보기 안내 */}
      <div className="mt-8 p-4 bg-vb-subtle rounded-xl">
        <p className="text-sm text-vb-muted text-center">
          💡 변경사항은 저장 후 실제 페이지에서 확인할 수 있습니다.{" "}
          <a
            href="/brain"
            target="_blank"
            className="text-vb-teal hover:underline"
          >
            랜딩페이지 보기 →
          </a>
        </p>
      </div>
    </div>
  );
}

function getDefaultContent(key: string): string {
  const defaults: Record<string, string> = {
    hero_title: "뇌 습관, 미리 만들어야 늦지 않습니다",
    hero_subtitle: "매일 10분, 재미있는 게임으로 뇌를 깨우세요",
    counselor_message: "오늘도 뇌 건강을 위한 작은 습관을 시작해보세요!",
    cta_text: "무료로 뇌나이 측정하기",
  };
  return defaults[key] || "";
}
