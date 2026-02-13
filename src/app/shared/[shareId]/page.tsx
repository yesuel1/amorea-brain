import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

interface SharedPageProps {
  params: Promise<{ shareId: string }>;
}

async function getShareData(shareId: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data } = await supabase
    .from("share_links")
    .select("*")
    .eq("id", shareId)
    .single();

  return data;
}

export async function generateMetadata({
  params,
}: SharedPageProps): Promise<Metadata> {
  const { shareId } = await params;
  const shareData = await getShareData(shareId);

  if (!shareData) {
    return {
      title: "AMOREA Brain Care",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://amorea.kr";
  const data = shareData.data as Record<string, unknown>;

  if (shareData.share_type === "brain_test") {
    const brainAge = data.brain_age as number;
    const percentile = data.percentile as number;

    return {
      title: `나의 뇌나이는 ${brainAge}세! | AMOREA Brain Care`,
      description: `동년배 상위 ${percentile}%의 젊은 뇌! 당신의 뇌나이도 측정해보세요.`,
      openGraph: {
        title: `나의 뇌나이는 ${brainAge}세! 🧠`,
        description: `동년배 상위 ${percentile}%의 젊은 뇌! 당신의 뇌나이도 측정해보세요.`,
        images: [`${baseUrl}/api/share/og?type=brain_test&brainAge=${brainAge}&percentile=${percentile}`],
      },
    };
  }

  if (shareData.share_type === "game_score") {
    const gameType = data.game_type as string;
    const score = data.score as number;
    const gameNames: Record<string, string> = {
      memory: "기억력",
      calc: "계산력",
      focus: "집중력",
    };
    const gameName = gameNames[gameType] || gameType;

    return {
      title: `${gameName} 게임 ${score}점! | AMOREA Brain Care`,
      description: `AMOREA 뇌 건강 게임에서 ${score}점을 달성했어요!`,
      openGraph: {
        title: `${gameName} 게임 ${score}점 달성! 🏆`,
        description: `AMOREA 뇌 건강 게임에서 ${score}점을 달성했어요. 당신도 도전해보세요!`,
      },
    };
  }

  return {
    title: "AMOREA Brain Care",
    description: "뇌 건강 습관 플랫폼",
  };
}

export default async function SharedPage({ params }: SharedPageProps) {
  const { shareId } = await params;
  const shareData = await getShareData(shareId);

  if (!shareData) {
    notFound();
  }

  const data = shareData.data as Record<string, unknown>;

  // 공유 타입에 따라 적절한 페이지로 리다이렉트
  if (shareData.share_type === "brain_test") {
    redirect(`/brain/result?brain_age=${data.brain_age}&percentile=${data.percentile}&shared=true`);
  }

  if (shareData.share_type === "game_score") {
    redirect(`/brain/games/${data.game_type}`);
  }

  if (shareData.share_type === "counselor_message") {
    redirect(`/brain`);
  }

  // 기본 리다이렉트
  redirect("/brain");
}
