import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `당신은 아모레퍼시픽 뷰티 카운셀러를 돕는 뇌 건강 전문 AI입니다.
카운셀러가 고객에게 보내는 따뜻한 응원 메시지를 작성합니다.

규칙:
- 한국어로 2~3문장
- 50~60대 고객에게 존칭 사용
- 구체적 칭찬 + 다음 행동 격려
- 바이탈뷰티 제품 자연스럽게 연결 (강요하지 않기)
- 이모지 적절히 사용 (2~3개)
- 따뜻하고 진심어린 톤으로 작성`;

interface MessageRequest {
  clientName: string;
  brainAge?: number;
  realAge?: number;
  streakDays?: number;
  recentScore?: number;
  gameType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: MessageRequest = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const userPrompt = buildUserPrompt(body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to generate message" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error generating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildUserPrompt(data: MessageRequest): string {
  const lines: string[] = ["고객 정보:"];

  lines.push(`- 이름: ${data.clientName}님`);

  if (data.brainAge && data.realAge) {
    const diff = data.realAge - data.brainAge;
    lines.push(`- 뇌나이: ${data.brainAge}세 (실제나이 ${data.realAge}세, ${diff > 0 ? `-${diff}` : `+${Math.abs(diff)}`}세!)`);
  } else if (data.brainAge) {
    lines.push(`- 뇌나이: ${data.brainAge}세`);
  }

  if (data.streakDays) {
    lines.push(`- 연속 습관: ${data.streakDays}일`);
  }

  if (data.recentScore && data.gameType) {
    const gameNames: Record<string, string> = {
      memory: "기억력",
      calc: "계산력",
      focus: "집중력",
    };
    const gameName = gameNames[data.gameType] || data.gameType;
    lines.push(`- 최근 게임: ${gameName} ${data.recentScore}점`);
  }

  lines.push("");
  lines.push("응원 메시지를 작성해주세요.");

  return lines.join("\n");
}
