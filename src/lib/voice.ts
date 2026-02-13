// 음성 관련 유틸리티 (OpenAI TTS/STT)

type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

// ============================================
// TTS (Text-to-Speech) - 텍스트를 음성으로
// ============================================

export interface TTSOptions {
  voice?: Voice;
  speed?: number;
}

export async function textToSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<HTMLAudioElement | null> {
  try {
    const response = await fetch("/api/voice/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice: options.voice || "nova", // nova: 여성 음성, 친근함
        speed: options.speed || 1.0,
      }),
    });

    if (!response.ok) {
      throw new Error("TTS request failed");
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // 재생 완료 후 URL 해제
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

    return audio;
  } catch (error) {
    console.error("TTS error:", error);
    return null;
  }
}

// 텍스트 읽어주기 (바로 재생)
export async function speakText(
  text: string,
  options: TTSOptions = {}
): Promise<void> {
  const audio = await textToSpeech(text, options);
  if (audio) {
    await audio.play();
  }
}

// ============================================
// STT (Speech-to-Text) - 음성을 텍스트로
// ============================================

export async function speechToText(audioBlob: Blob): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const response = await fetch("/api/voice/stt", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("STT request failed");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("STT error:", error);
    return null;
  }
}

// ============================================
// 음성 녹음 헬퍼
// ============================================

export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async start(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (error) {
      console.error("Failed to start recording:", error);
      return false;
    }
  }

  stop(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }
}

// ============================================
// 미리 정의된 음성 메시지
// ============================================

export const VOICE_MESSAGES = {
  // 게임 관련
  gameStart: "게임을 시작합니다. 준비되셨나요?",
  gameComplete: "잘하셨어요! 게임이 완료되었습니다.",
  correctAnswer: "정답입니다!",
  wrongAnswer: "아쉽네요, 다시 한번 해보세요.",

  // 뇌나이 테스트
  testStart: "뇌나이 측정을 시작합니다. 세 가지 간단한 테스트를 진행할게요.",
  testComplete: "측정이 완료되었습니다. 결과를 확인해볼까요?",

  // 습관 트래커
  habitReminder: "오늘의 뇌 건강 습관을 확인해보세요.",
  habitComplete: "오늘의 습관을 모두 완료하셨네요! 대단해요.",

  // 응원 메시지
  encouragement: "꾸준히 하고 계시네요. 정말 잘하고 계세요!",
  streak: "연속 기록을 이어가고 있어요. 멋져요!",
};

// 미리 정의된 메시지 재생
export async function playVoiceMessage(
  messageKey: keyof typeof VOICE_MESSAGES
): Promise<void> {
  const text = VOICE_MESSAGES[messageKey];
  await speakText(text);
}
