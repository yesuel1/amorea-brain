"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { trackCounselorMessageSent } from "@/lib/analytics";
import type { MessageTemplate } from "@/types/database";

interface Client {
  id: string;
  display_name: string | null;
  birth_year: number | null;
  latestBrainAge: number | null;
  streakDays: number;
}

interface MessageComposerProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  counselorId: string;
}

export function MessageComposer({
  isOpen,
  onClose,
  client,
  counselorId,
}: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const currentYear = new Date().getFullYear();
  const realAge = client.birth_year ? currentYear - client.birth_year : undefined;

  // 템플릿 로드
  useEffect(() => {
    const loadTemplates = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("message_templates")
        .select("*")
        .eq("is_active", true)
        .order("category");

      if (data) {
        setTemplates(data);
      }
    };

    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  // 템플릿에서 변수 치환
  const applyTemplate = (template: MessageTemplate) => {
    let content = template.content;
    content = content.replace(/\{\{name\}\}/g, client.display_name || "고객");
    content = content.replace(/\{\{brainAge\}\}/g, client.latestBrainAge?.toString() || "??");
    content = content.replace(/\{\{streakDays\}\}/g, client.streakDays.toString());
    setMessage(content);
    setSelectedTemplateId(template.id);
    setShowTemplates(false);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setSelectedTemplateId(null);

    try {
      const response = await fetch("/api/ai/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: client.display_name || "고객",
          brainAge: client.latestBrainAge,
          realAge,
          streakDays: client.streakDays,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        alert("메시지 생성에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error generating message:", error);
      alert("메시지 생성에 실패했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      alert("메시지를 입력해주세요.");
      return;
    }

    setIsSending(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("messages").insert({
        sender_id: counselorId,
        receiver_id: client.id,
        content: message.trim(),
        is_ai_generated: isGenerating,
        template_id: selectedTemplateId,
      });

      if (error) throw error;

      trackCounselorMessageSent(isGenerating);
      setSent(true);

      setTimeout(() => {
        onClose();
        setSent(false);
        setMessage("");
        setSelectedTemplateId(null);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="text-center py-8">
          <span className="text-5xl block mb-4">✅</span>
          <p className="text-xl font-bold text-vb-black">메시지 전송 완료!</p>
          <p className="text-vb-muted mt-2">
            {client.display_name || "고객"}님에게 전달되었습니다
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="응원 메시지 보내기">
      <div className="space-y-4">
        {/* 고객 정보 */}
        <div className="p-3 bg-vb-subtle rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👤</span>
            <div>
              <p className="font-bold text-vb-black">
                {client.display_name || "이름 미입력"}
              </p>
              <div className="flex gap-3 text-sm text-vb-muted">
                {client.latestBrainAge && (
                  <span>뇌나이 {client.latestBrainAge}세</span>
                )}
                {client.streakDays > 0 && (
                  <span>🔥 {client.streakDays}일</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 메시지 옵션 버튼들 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleGenerateAI}
            isLoading={isGenerating}
          >
            ✨ AI 추천
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            📋 템플릿
          </Button>
        </div>

        {/* 템플릿 목록 */}
        {showTemplates && templates.length > 0 && (
          <div className="border border-vb-lightsilver rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template)}
                className="w-full text-left p-2 rounded-lg hover:bg-vb-subtle transition-colors"
              >
                <p className="font-medium text-vb-black text-sm">{template.title}</p>
                <p className="text-xs text-vb-muted line-clamp-1">
                  {template.content.substring(0, 50)}...
                </p>
              </button>
            ))}
          </div>
        )}

        {/* 메시지 입력 */}
        <div>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setSelectedTemplateId(null);
            }}
            placeholder="고객님에게 전할 응원 메시지를 작성해주세요..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border-2 border-vb-lightsilver focus:border-vb-teal focus:outline-none resize-none"
          />
          <p className="text-xs text-vb-muted mt-1 text-right">
            {message.length}/200
          </p>
        </div>

        {/* 전송 버튼 */}
        <Button
          fullWidth
          onClick={handleSend}
          isLoading={isSending}
          disabled={!message.trim()}
        >
          💌 메시지 보내기
        </Button>
      </div>
    </Modal>
  );
}
