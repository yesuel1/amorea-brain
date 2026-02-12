"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { trackCounselorMessageSent } from "@/lib/analytics";

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

  const currentYear = new Date().getFullYear();
  const realAge = client.birth_year ? currentYear - client.birth_year : undefined;

  const handleGenerateAI = async () => {
    setIsGenerating(true);

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
        is_ai_generated: isGenerating, // 마지막으로 AI 생성했으면 true
      });

      if (error) throw error;

      trackCounselorMessageSent(isGenerating);
      setSent(true);

      setTimeout(() => {
        onClose();
        setSent(false);
        setMessage("");
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

        {/* AI 추천 버튼 */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleGenerateAI}
          isLoading={isGenerating}
        >
          ✨ AI 추천 메시지 생성
        </Button>

        {/* 메시지 입력 */}
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
