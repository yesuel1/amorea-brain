import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // multipart/form-data로 오디오 파일 받기
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // OpenAI Whisper API로 전송
    const openAIFormData = new FormData();
    openAIFormData.append("file", audioFile);
    openAIFormData.append("model", process.env.OPENAI_STT_MODEL || "whisper-1");
    openAIFormData.append("language", "ko"); // 한국어 우선
    openAIFormData.append("response_format", "json");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: openAIFormData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI STT error:", error);
      return NextResponse.json(
        { error: "Failed to transcribe audio" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      text: data.text,
      language: data.language || "ko",
    });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
