"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";

// 초성 퀴즈 데이터 (초성 → 정답들)
const QUIZ_DATA = [
  { consonants: "ㄱㅅㅇ", answers: ["감사합니다", "건강원", "고속도로", "과수원"], hint: "인사말" },
  { consonants: "ㅎㅂ", answers: ["행복", "한복", "함박", "혜빈"], hint: "기분 좋은 것" },
  { consonants: "ㄱㄱ", answers: ["건강", "가격", "과거", "기관"], hint: "소중한 것" },
  { consonants: "ㅅㄹ", answers: ["사랑", "서류", "수리", "실력"], hint: "마음" },
  { consonants: "ㄱㅈ", answers: ["가족", "기자", "감자", "건조"], hint: "소중한 사람들" },
  { consonants: "ㅇㅎ", answers: ["여행", "은행", "안녕", "영화"], hint: "떠나는 것" },
  { consonants: "ㅈㄱ", answers: ["자기", "적금", "전기", "주거"], hint: "나를 부르는 말" },
  { consonants: "ㅊㄱ", answers: ["친구", "축구", "참기", "철거"], hint: "함께하는 사람" },
  { consonants: "ㅁㄹ", answers: ["미래", "머리", "무료", "마라"], hint: "앞으로 올 것" },
  { consonants: "ㅎㅁ", answers: ["희망", "한미", "항만", "헌명"], hint: "꿈꾸는 것" },
  { consonants: "ㄴㄹ", answers: ["나라", "노래", "누리", "느리"], hint: "대한민국" },
  { consonants: "ㅂㄹ", answers: ["바람", "부럼", "볼일", "비료"], hint: "불어오는 것" },
];

interface LanguageGameProps {
  onComplete: (score: number, duration: number) => void;
  standalone?: boolean;
}

export function LanguageGame({ onComplete, standalone = false }: LanguageGameProps) {
  const [questions, setQuestions] = useState<typeof QUIZ_DATA>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const TOTAL_QUESTIONS = 5;

  // 게임 초기화
  const initializeGame = useCallback(() => {
    const shuffled = [...QUIZ_DATA].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setUserInput("");
    setCorrectCount(0);
    setShowResult(false);
    setIsCorrect(null);
    setGameStarted(false);
    setStartTime(0);
    setShowHint(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    const isAnswerCorrect = currentQuestion?.answers.some(
      (answer) => answer.toLowerCase() === userInput.trim().toLowerCase()
    );

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    // 다음 문제로 이동
    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS - 1) {
        setCurrentIndex((prev) => prev + 1);
        setUserInput("");
        setShowResult(false);
        setIsCorrect(null);
        setShowHint(false);
      } else {
        // 게임 완료
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const finalCorrect = isAnswerCorrect ? correctCount + 1 : correctCount;
        const score = Math.round((finalCorrect / TOTAL_QUESTIONS) * 100);
        onComplete(score, duration);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showResult) {
      handleSubmit();
    }
  };

  if (questions.length === 0) {
    return <div className="text-center p-4">로딩 중...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 진행 상황 */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-sm text-vb-muted">
          문제: <span className="font-bold text-vb-black">{currentIndex + 1}/{TOTAL_QUESTIONS}</span>
        </div>
        <div className="text-sm text-vb-muted">
          정답: <span className="font-bold text-vb-teal">{correctCount}</span>
        </div>
      </div>

      {/* 문제 카드 */}
      <div className="bg-vb-navy rounded-2xl p-6 mb-4 text-center">
        <p className="text-vb-silver text-sm mb-2">이 초성이 나타내는 단어는?</p>
        <p className="text-5xl font-bold text-white tracking-widest mb-4">
          {currentQuestion?.consonants}
        </p>
        {showHint && (
          <p className="text-vb-teal text-sm animate-in fade-in">
            힌트: {currentQuestion?.hint}
          </p>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="space-y-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="단어를 입력하세요"
          disabled={showResult}
          className={`
            w-full px-4 py-4 text-lg text-center rounded-xl
            border-2 transition-colors
            ${showResult
              ? isCorrect
                ? "border-vb-teal bg-vb-teal/10"
                : "border-vb-coral bg-vb-coral/10"
              : "border-vb-subtle focus:border-vb-teal"
            }
            outline-none
          `}
        />

        {/* 결과 표시 */}
        {showResult && (
          <div className={`text-center p-3 rounded-xl animate-in fade-in ${
            isCorrect ? "bg-vb-teal/10 text-vb-teal" : "bg-vb-coral/10 text-vb-coral"
          }`}>
            {isCorrect ? (
              <span className="font-bold">정답입니다! 🎉</span>
            ) : (
              <span>
                아쉬워요! 정답: <span className="font-bold">{currentQuestion?.answers[0]}</span>
              </span>
            )}
          </div>
        )}

        {/* 버튼 */}
        {!showResult && (
          <div className="flex gap-2">
            {!showHint && (
              <Button
                variant="ghost"
                onClick={() => setShowHint(true)}
                className="flex-1"
              >
                힌트 보기
              </Button>
            )}
            <Button
              fullWidth={showHint}
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className={showHint ? "" : "flex-1"}
            >
              확인
            </Button>
          </div>
        )}
      </div>

      {/* 안내 */}
      <p className="text-center text-vb-muted text-sm mt-4">
        초성을 보고 떠오르는 단어를 입력하세요
      </p>

      {/* 다시하기 */}
      {standalone && (
        <div className="mt-4">
          <Button variant="ghost" fullWidth onClick={initializeGame}>
            다시 하기
          </Button>
        </div>
      )}
    </div>
  );
}
