"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";

// 패턴 찾기 문제 데이터
interface PatternQuestion {
  sequence: string[];
  options: string[];
  answer: string;
  type: "shape" | "number" | "emoji";
}

const PATTERN_QUESTIONS: PatternQuestion[] = [
  // 도형 패턴
  { sequence: ["⬛", "⬜", "⬛", "⬜", "⬛"], options: ["⬛", "⬜", "🔲", "◾"], answer: "⬜", type: "shape" },
  { sequence: ["🔴", "🔵", "🔴", "🔵", "🔴"], options: ["🔴", "🔵", "🟢", "🟡"], answer: "🔵", type: "shape" },
  { sequence: ["⭐", "⭐", "🌙", "⭐", "⭐"], options: ["⭐", "🌙", "☀️", "💫"], answer: "🌙", type: "shape" },
  { sequence: ["🔺", "🔻", "🔺", "🔻", "🔺"], options: ["🔺", "🔻", "⬛", "🔷"], answer: "🔻", type: "shape" },

  // 숫자 패턴
  { sequence: ["2", "4", "6", "8", "?"], options: ["9", "10", "11", "12"], answer: "10", type: "number" },
  { sequence: ["1", "3", "5", "7", "?"], options: ["8", "9", "10", "11"], answer: "9", type: "number" },
  { sequence: ["3", "6", "9", "12", "?"], options: ["13", "14", "15", "16"], answer: "15", type: "number" },
  { sequence: ["1", "2", "4", "8", "?"], options: ["10", "12", "14", "16"], answer: "16", type: "number" },
  { sequence: ["10", "20", "30", "40", "?"], options: ["45", "50", "55", "60"], answer: "50", type: "number" },
  { sequence: ["100", "90", "80", "70", "?"], options: ["50", "55", "60", "65"], answer: "60", type: "number" },

  // 이모지 패턴
  { sequence: ["🍎", "🍊", "🍎", "🍊", "🍎"], options: ["🍎", "🍊", "🍋", "🍇"], answer: "🍊", type: "emoji" },
  { sequence: ["🐶", "🐱", "🐶", "🐱", "🐶"], options: ["🐶", "🐱", "🐭", "🐰"], answer: "🐱", type: "emoji" },
  { sequence: ["🌸", "🌺", "🌸", "🌺", "🌸"], options: ["🌸", "🌺", "🌻", "🌷"], answer: "🌺", type: "emoji" },
  { sequence: ["☀️", "🌙", "☀️", "🌙", "☀️"], options: ["☀️", "🌙", "⭐", "🌟"], answer: "🌙", type: "emoji" },
  { sequence: ["❤️", "💛", "💚", "💙", "?"], options: ["❤️", "💜", "🖤", "🤍"], answer: "💜", type: "emoji" },
];

interface ThinkingGameProps {
  onComplete: (score: number, duration: number) => void;
  standalone?: boolean;
}

export function ThinkingGame({ onComplete, standalone = false }: ThinkingGameProps) {
  const [questions, setQuestions] = useState<PatternQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);

  const TOTAL_QUESTIONS = 5;

  // 게임 초기화
  const initializeGame = useCallback(() => {
    const shuffled = [...PATTERN_QUESTIONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, TOTAL_QUESTIONS);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setShowResult(false);
    setGameStarted(false);
    setStartTime(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (showResult) return;

    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    setSelectedAnswer(option);
    setShowResult(true);

    const isCorrect = option === currentQuestion?.answer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    // 다음 문제로 이동
    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // 게임 완료
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
        const score = Math.round((finalCorrect / TOTAL_QUESTIONS) * 100);
        onComplete(score, duration);
      }
    }, 1500);
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
        <p className="text-vb-silver text-sm mb-4">다음에 올 것은 무엇일까요?</p>
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {currentQuestion?.sequence.map((item, index) => (
            <div
              key={index}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${item === "?"
                  ? "bg-vb-coral/30 border-2 border-vb-coral border-dashed"
                  : "bg-white/10"
                }
              `}
            >
              <span className={`${currentQuestion.type === "number" ? "text-2xl font-bold text-white" : "text-3xl"}`}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 선택지 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {currentQuestion?.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentQuestion.answer;

          let buttonClass = "bg-white border-2 border-vb-subtle hover:border-vb-teal";
          if (showResult) {
            if (isCorrectAnswer) {
              buttonClass = "bg-vb-teal/10 border-2 border-vb-teal";
            } else if (isSelected && !isCorrectAnswer) {
              buttonClass = "bg-vb-coral/10 border-2 border-vb-coral";
            }
          } else if (isSelected) {
            buttonClass = "bg-vb-teal/10 border-2 border-vb-teal";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={showResult}
              className={`
                p-4 rounded-xl transition-all
                ${buttonClass}
                ${!showResult && "hover:scale-105 active:scale-95"}
              `}
            >
              <span className={`${currentQuestion.type === "number" ? "text-2xl font-bold" : "text-4xl"}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* 결과 표시 */}
      {showResult && (
        <div className={`text-center p-3 rounded-xl animate-in fade-in ${
          selectedAnswer === currentQuestion?.answer
            ? "bg-vb-teal/10 text-vb-teal"
            : "bg-vb-coral/10 text-vb-coral"
        }`}>
          {selectedAnswer === currentQuestion?.answer ? (
            <span className="font-bold">정답입니다! 🎉</span>
          ) : (
            <span>
              아쉬워요! 정답: <span className="font-bold text-2xl">{currentQuestion?.answer}</span>
            </span>
          )}
        </div>
      )}

      {/* 안내 */}
      <p className="text-center text-vb-muted text-sm mt-4">
        패턴을 파악하고 다음에 올 것을 선택하세요
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
