"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface CounselorApprovalActionsProps {
  counselorId: string;
}

export function CounselorApprovalActions({
  counselorId,
}: CounselorApprovalActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null);

  const handleApprove = async () => {
    if (!confirm("이 카운셀러를 승인하시겠습니까?")) return;

    setIsLoading("approve");
    try {
      const supabase = createClient();

      // 카운셀러 승인
      const { error: counselorError } = await supabase
        .from("counselors")
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
        })
        .eq("id", counselorId);

      if (counselorError) throw counselorError;

      // 프로필 역할 변경
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: "counselor" })
        .eq("id", counselorId);

      if (profileError) throw profileError;

      router.refresh();
    } catch (error) {
      console.error("Error approving counselor:", error);
      alert("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleReject = async () => {
    if (!confirm("이 카운셀러 신청을 거절하시겠습니까? 신청 정보가 삭제됩니다."))
      return;

    setIsLoading("reject");
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("counselors")
        .delete()
        .eq("id", counselorId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error rejecting counselor:", error);
      alert("거절 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={handleApprove}
        isLoading={isLoading === "approve"}
        disabled={isLoading !== null}
      >
        ✅ 승인
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleReject}
        isLoading={isLoading === "reject"}
        disabled={isLoading !== null}
      >
        ❌ 거절
      </Button>
    </div>
  );
}
