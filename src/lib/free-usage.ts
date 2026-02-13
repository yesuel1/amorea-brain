"use client";

import { createClient } from "@/lib/supabase/client";

const FREE_USES_KEY = "brain_free_uses";
const SESSION_ID_KEY = "brain_session_id";
const INITIAL_FREE_USES = 3;

// 세션 ID 생성/조회
export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// 남은 무료 횟수 조회
export function getFreeUsesRemaining(): number {
  if (typeof window === "undefined") return INITIAL_FREE_USES;

  const stored = localStorage.getItem(FREE_USES_KEY);
  if (stored === null) {
    localStorage.setItem(FREE_USES_KEY, String(INITIAL_FREE_USES));
    return INITIAL_FREE_USES;
  }
  return parseInt(stored, 10);
}

// 무료 횟수 차감
export function decrementFreeUses(): number {
  if (typeof window === "undefined") return INITIAL_FREE_USES;

  const current = getFreeUsesRemaining();
  const newValue = Math.max(0, current - 1);
  localStorage.setItem(FREE_USES_KEY, String(newValue));
  return newValue;
}

// 무료 사용 가능 여부 (동기)
export function canUseFree(): boolean {
  return getFreeUsesRemaining() > 0;
}

// 무료 사용 가능 여부 (로그인 체크 포함 - 비동기)
export async function canUseGame(): Promise<boolean> {
  // 로그인한 사용자는 무제한
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return true;

  // 비로그인 사용자는 무료 횟수 체크
  return getFreeUsesRemaining() > 0;
}

// 무료 횟수 리셋 (테스트용)
export function resetFreeUses(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FREE_USES_KEY, String(INITIAL_FREE_USES));
}
