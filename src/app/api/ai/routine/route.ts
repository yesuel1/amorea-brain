import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `당신은 50~60대 프리시니어를 위한 뇌 건강 전문가입니다.
사용자의 뇌 테스트 결과와 습관 데이터를 분석하여 개인 맞춤 일일 루틴을 추천합니다.

응답 형식 (JSON):
{
  "morning": [
    { "time": "07:00", "activity": "활동명", "duration": "10분", "icon": "🧠", "description": "설명" }
  ],
  "afternoon": [...],
  "evening": [...],
  "supplements": [
    { "name": "제품명", "time": "아침 식후", "benefit": "효과" }
  ],
  "focusArea": "집중 개선 영역",
  "weeklyGoal": "주간 목표 메시지"
}

규칙:
- 뇌운동 2종 + 신체활동 1종 + 마음챙김 1종 포함
- 실현 가능한 시간대와 소요시간
- 약한 영역에 맞춘 게임 추천
- 바이탈뷰티 제품 자연스럽게 연결
- 동기부여 메시지 포함`;

interface RoutineRequest {
  brainAge?: number;
  realAge?: number;
  memoryScore?: number;
  calcScore?: number;
  focusScore?: number;
  streakDays?: number;
  weakAreas?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RoutineRequest = await request.json();

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
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to generate routine" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const routineJson = data.choices?.[0]?.message?.content || "{}";

    try {
      const routine = JSON.parse(routineJson);
      return NextResponse.json(routine);
    } catch {
      return NextResponse.json(
        { error: "Invalid routine format" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating routine:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildUserPrompt(data: RoutineRequest): string {
  const lines: string[] = ["사용자 정보:"];

  if (data.brainAge && data.realAge) {
    const diff = data.realAge - data.brainAge;
    lines.push(`- 뇌나이: ${data.brainAge}세 (실제 ${data.realAge}세, ${diff > 0 ? `${diff}세 젊음` : `${Math.abs(diff)}세 높음`})`);
  }

  if (data.memoryScore !== undefined) {
    lines.push(`- 기억력 점수: ${data.memoryScore}점`);
  }
  if (data.calcScore !== undefined) {
    lines.push(`- 계산력 점수: ${data.calcScore}점`);
  }
  if (data.focusScore !== undefined) {
    lines.push(`- 집중력 점수: ${data.focusScore}점`);
  }

  if (data.streakDays) {
    lines.push(`- 연속 습관: ${data.streakDays}일`);
  }

  if (data.weakAreas && data.weakAreas.length > 0) {
    lines.push(`- 개선 필요 영역: ${data.weakAreas.join(", ")}`);
  }

  lines.push("");
  lines.push("위 정보를 바탕으로 맞춤 일일 루틴을 JSON으로 생성해주세요.");

  return lines.join("\n");
}
