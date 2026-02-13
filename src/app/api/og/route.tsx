import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") || "default";
  const brainAge = searchParams.get("brainAge");
  const percentile = searchParams.get("percentile");
  const score = searchParams.get("score");
  const gameType = searchParams.get("gameType");

  let title = "AMOREA Brain Care";
  let subtitle = "뇌 습관, 미리 만들어야 늦지 않습니다";
  let emoji = "🧠";

  if (type === "brain_test" && brainAge) {
    title = `나의 뇌나이 ${brainAge}세`;
    subtitle = percentile ? `동년배 상위 ${percentile}%` : "지금 바로 측정해보세요";
    emoji = "🧠";
  } else if (type === "game" && score) {
    const gameNames: Record<string, string> = {
      memory: "기억력",
      calc: "계산력",
      focus: "집중력",
    };
    const gameName = gameNames[gameType || ""] || "뇌운동";
    title = `${gameName} ${score}점`;
    subtitle = "AMOREA 뇌 건강 게임";
    emoji = "🏆";
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A1A2E",
          backgroundImage: "linear-gradient(135deg, #1A1A2E 0%, #2D2D2D 100%)",
        }}
      >
        {/* 로고 영역 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 24, marginRight: 8 }}>🧠</span>
          <span style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700 }}>
            AMOREA
          </span>
          <span style={{ color: "#3AAFA9", fontSize: 16, marginLeft: 6 }}>
            BRAIN CARE
          </span>
        </div>

        {/* 메인 아이콘 */}
        <div
          style={{
            fontSize: 100,
            marginBottom: 20,
          }}
        >
          {emoji}
        </div>

        {/* 타이틀 */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          {title}
        </div>

        {/* 서브타이틀 */}
        <div
          style={{
            fontSize: 24,
            color: "#C0C0C0",
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>

        {/* 하단 CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
            padding: "12px 32px",
            backgroundColor: "#E8625C",
            borderRadius: 50,
          }}
        >
          <span style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 600 }}>
            나도 측정하기 →
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
