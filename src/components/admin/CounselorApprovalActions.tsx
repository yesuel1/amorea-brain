"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface CounselorApprovalActionsProps {
  counselorId: string;
  currentStatus: "pending" | "active" | "inactive";
}

export function CounselorApprovalActions({
  counselorId,
  currentStatus,
}: CounselorApprovalActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const updateStatus = async (newStatus: "active" | "inactive", action: string) => {
    const confirmMessage = {
      active: "이 카운셀러를 활성화하시겠습니까?",
      inactive: "이 카운셀러를 비활성화하시겠습니까?",
    };

    if (!confirm(confirmMessage[newStatus])) return;

    setIsLoading(action);
    try {
      const supabase = createClient();

      // 카운셀러 상태 변경
      const updateData: Record<string, unknown> = { status: newStatus };
      if (newStatus === "active" && currentStatus === "pending") {
        updateData.approved_at = new Date().toISOString();
        updateData.is_approved = true;
      }

      const { error: counselorError } = await supabase
        .from("counselors")
        .update(updateData)
        .eq("id", counselorId);

      if (counselorError) throw counselorError;

      // 활성화 시 프로필 역할 변경
      if (newStatus === "active") {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ role: "counselor" })
          .eq("id", counselorId);

        if (profileError) throw profileError;
      } else if (newStatus === "inactive") {
        // 비활성화 시 역할을 user로 변경
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ role: "user" })
          .eq("id", counselorId);

        if (profileError) throw profileError;
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating counselor status:", error);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("이 카운셀러 신청을 삭제하시겠습니까? 복구할 수 없습니다.")) return;

    setIsLoading("delete");
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("counselors")
        .delete()
        .eq("id", counselorId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error deleting counselor:", error);
      alert("삭제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(null);
    }
  };

  // 승인 대기 상태
  if (currentStatus === "pending") {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => updateStatus("active", "approve")}
          isLoading={isLoading === "approve"}
          disabled={isLoading !== null}
        >
          ✅ 승인
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          isLoading={isLoading === "delete"}
          disabled={isLoading !== null}
        >
          ❌ 거절
        </Button>
      </div>
    );
  }

  // 활성 상태
  if (currentStatus === "active") {
    return (
      <Button
        size="sm"
        variant="ghost"
        onClick={() => updateStatus("inactive", "deactivate")}
        isLoading={isLoading === "deactivate"}
        disabled={isLoading !== null}
        className="text-vb-muted"
      >
        비활성화
      </Button>
    );
  }

  // 비활성 상태
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => updateStatus("active", "activate")}
        isLoading={isLoading === "activate"}
        disabled={isLoading !== null}
      >
        재활성화
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleDelete}
        isLoading={isLoading === "delete"}
        disabled={isLoading !== null}
        className="text-vb-coral"
      >
        삭제
      </Button>
    </div>
  );
}
