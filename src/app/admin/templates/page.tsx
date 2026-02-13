"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { MessageTemplate } from "@/types/database";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("message_templates")
      .select("*")
      .order("category")
      .order("created_at", { ascending: false });

    setTemplates(data || []);
    setIsLoading(false);
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFormData({ title: "", content: "", category: "general" });
    setIsModalOpen(true);
  };

  const openEditModal = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      content: template.content,
      category: template.category,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      if (editingTemplate) {
        // 수정
        const { error } = await supabase
          .from("message_templates")
          .update({
            title: formData.title,
            content: formData.content,
            category: formData.category,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingTemplate.id);

        if (error) throw error;
      } else {
        // 생성
        const { error } = await supabase
          .from("message_templates")
          .insert({
            title: formData.title,
            content: formData.content,
            category: formData.category,
          });

        if (error) throw error;
      }

      setIsModalOpen(false);
      loadTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (template: MessageTemplate) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("message_templates")
      .update({ is_active: !template.is_active })
      .eq("id", template.id);

    if (error) {
      console.error("Error toggling template:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
      return;
    }

    loadTemplates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 템플릿을 삭제하시겠습니까?")) return;

    const supabase = createClient();

    const { error } = await supabase
      .from("message_templates")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting template:", error);
      alert("삭제 중 오류가 발생했습니다.");
      return;
    }

    loadTemplates();
  };

  const categoryLabels: Record<string, string> = {
    welcome: "환영",
    reminder: "활동 독려",
    habit: "습관 체크",
    product: "제품 추천",
    general: "일반",
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-pulse text-vb-muted">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-vb-black">메시지 템플릿 관리</h1>
          <p className="text-vb-muted">카운셀러가 사용할 메시지 템플릿</p>
        </div>
        <Button onClick={openCreateModal}>+ 새 템플릿</Button>
      </div>

      {/* 안내 */}
      <Card className="mb-6 bg-vb-subtle border-0">
        <p className="text-sm text-vb-charcoal">
          <strong>변수 사용법:</strong>{" "}
          <code className="bg-white px-1 rounded">{"{{name}}"}</code> = 고객 이름,{" "}
          <code className="bg-white px-1 rounded">{"{{brainAge}}"}</code> = 뇌나이,{" "}
          <code className="bg-white px-1 rounded">{"{{streakDays}}"}</code> = 연속일수
        </p>
      </Card>

      {/* 템플릿 목록 */}
      {templates.length === 0 ? (
        <Card className="text-center py-12">
          <span className="text-5xl block mb-4">📝</span>
          <p className="text-vb-muted">등록된 템플릿이 없습니다</p>
          <Button className="mt-4" onClick={openCreateModal}>
            첫 템플릿 만들기
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`${!template.is_active ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        template.is_active
                          ? "bg-vb-teal/20 text-vb-teal"
                          : "bg-vb-lightsilver text-vb-muted"
                      }`}
                    >
                      {template.is_active ? "활성" : "비활성"}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-vb-subtle text-vb-charcoal">
                      {categoryLabels[template.category] || template.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-vb-black mb-1">{template.title}</h3>
                  <p className="text-sm text-vb-charcoal whitespace-pre-wrap">
                    {template.content}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleActive(template)}
                  >
                    {template.is_active ? "비활성화" : "활성화"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(template)}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-vb-coral"
                    onClick={() => handleDelete(template.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 생성/수정 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTemplate ? "템플릿 수정" : "새 템플릿 만들기"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-vb-charcoal mb-1">
              카테고리
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-vb-teal"
            >
              <option value="welcome">환영</option>
              <option value="reminder">활동 독려</option>
              <option value="habit">습관 체크</option>
              <option value="product">제품 추천</option>
              <option value="general">일반</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-vb-charcoal mb-1">
              제목
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="템플릿 제목"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-vb-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-vb-charcoal mb-1">
              내용
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="메시지 내용 (변수: {{name}}, {{brainAge}}, {{streakDays}})"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-vb-teal resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setIsModalOpen(false)}
            >
              취소
            </Button>
            <Button
              fullWidth
              onClick={handleSave}
              isLoading={isSaving}
            >
              {editingTemplate ? "수정" : "저장"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
