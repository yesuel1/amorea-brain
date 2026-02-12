"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";

interface Question {
  num1: number;
  num2: number;
  operator: "+" | "-" | "×";
  answer: number;
  options: number[];
}

interface CalcGameProps {
  onComplete: (score: number, duration: number) => void;
  standalone?: boolean;
}

const TOTAL_QUESTIONS = 8;

function generateQuestion(): Question {
  const operators: ("+" | "-" | "×")[] = ["+", "-", "×"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let num1: number, num2: number, answer: number;

  switch (operator) {
    case "+":
      num1 = Math.floor(Math.random() * 50) + 10;
      num2 = Math.floor(Math.random() * 50) + 10;
      answer = num1 + num2;
      break;
    case "-":
      num1 = Math.floor(Math.random() * 50) + 30;
      num2 = Math.floor(Math.random() * 30) + 1;
      answer = num1 - num2;
      break;
    case "×":
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      answer = num1 * num2;
      break;
  }

  // 오답 생성
  const wrongAnswers = new Set<number>();
  while (wrongAnswers.size < 3) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const wrong = answer + offset;
    if (wrong !== answer && wrong > 0) {
      wrongAnswers.add(wrong);
    }
  }

  const options = [answer, ...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5);

  return { num1, num2, operator, answer, options };
}

export function CalcGame({ onComplete, standalone = false }: CalcGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);

  // 게임 초기화
  const initializeGame = useCallback(() => {
    const newQuestions = Array.from({ length: TOTAL_QUESTIONS }, generateQuestion);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setStartTime(0);
    setGameStarted(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // 답변 선택
  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;

    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    const currentQuestion = questions[currentIndex];
    const correct = answer === currentQuestion.answer;

    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }

    // 다음 문제로
    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // 게임 완료
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const finalCorrect = correct ? correctCount + 1 : correctCount;
        const score = Math.round((finalCorrect / TOTAL_QUESTIONS) * 100);
        onComplete(score, duration);
      }
    }, 800);
  };

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 진행 상태 */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="text-sm text-vb-muted">
          문제 <span className="font-bold text-vb-black">{currentIndex + 1}</span>/{TOTAL_QUESTIONS}
        </div>
        <div className="text-sm text-vb-muted">
          정답 <span className="font-bold text-vb-teal">{correctCount}</span>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-2 bg-vb-subtle rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-vb-coral to-vb-teal rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {/* 문제 */}
      <div className="bg-vb-navy rounded-3xl p-8 mb-6 text-center">
        <p className="text-4xl font-bold text-white">
          {currentQuestion.num1} {currentQuestion.operator} {currentQuestion.num2} = ?
        </p>
      </div>

      {/* 선택지 */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((option, index) => {
          let buttonClass = "bg-white border-2 border-vb-lightsilver hover:border-vb-teal";

          if (selectedAnswer !== null) {
            if (option === currentQuestion.answer) {
              buttonClass = "bg-vb-teal border-2 border-vb-teal text-white";
            } else if (option === selectedAnswer) {
              buttonClass = "bg-vb-coral border-2 border-vb-coral text-white";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                p-6 rounded-2xl text-2xl font-bold
                transition-all duration-200
                ${buttonClass}
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* 피드백 */}
      {isCorrect !== null && (
        <div className={`mt-4 text-center text-lg font-semibold animate-in zoom-in duration-200 ${isCorrect ? "text-vb-teal" : "text-vb-coral"}`}>
          {isCorrect ? "정답입니다! 🎉" : "아쉬워요 😅"}
        </div>
      )}

      {/* 다시하기 (standalone 모드) */}
      {standalone && (
        <div className="mt-6">
          <Button variant="ghost" fullWidth onClick={initializeGame}>
            다시 하기
          </Button>
        </div>
      )}
    </div>
  );
}
