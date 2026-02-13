import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CounselorLanding } from "@/components/counselor/CounselorLanding";

interface CounselorPageProps {
  params: Promise<{ code: string }>;
}

export default async function CounselorPage({ params }: CounselorPageProps) {
  const { code } = await params;

  // br로 시작하는 코드만 카운셀러 페이지로 처리
  if (!code.startsWith("br")) {
    notFound();
  }

  const supabase = await createClient();

  // 카운셀러 정보 조회
  const { data: counselor } = await supabase
    .from("counselors")
    .select("*")
    .eq("code", code)
    .eq("status", "active")
    .single();

  if (!counselor) {
    notFound();
  }

  // 현재 로그인 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <CounselorLanding counselor={counselor} isLoggedIn={!!user} />;
}

// 동적 메타데이터
export async function generateMetadata({ params }: CounselorPageProps) {
  const { code } = await params;

  if (!code.startsWith("br")) {
    return { title: "페이지를 찾을 수 없습니다" };
  }

  const supabase = await createClient();

  const { data: counselor } = await supabase
    .from("counselors")
    .select("full_name, title")
    .eq("code", code)
    .eq("status", "active")
    .single();

  if (!counselor) {
    return { title: "카운셀러를 찾을 수 없습니다" };
  }

  const counselorData = counselor as { full_name: string; title: string | null };

  return {
    title: `${counselorData.full_name} ${counselorData.title || "카운셀러"} | AMOREA 뇌건강`,
    description: `${counselorData.full_name} ${counselorData.title || "카운셀러"}와 함께하는 뇌건강 관리`,
  };
}
