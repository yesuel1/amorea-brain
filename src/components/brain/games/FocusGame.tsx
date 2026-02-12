"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface FocusGameProps {
  onComplete: (score: number, duration: number) => void;
  standalone?: boolean;
}

const COLORS = [
  { name: "coral", class: "bg-vb-coral", hex: "#E8625C" },
  { name: "teal", class: "bg-vb-teal", hex: "#3AAFA9" },
  { name: "blue", class: "bg-vb-blue", hex: "#5C6BC0" },
  { name: "gold", class: "bg-vb-gold", hex: "#C8956C" },
  { name: "green", class: "bg-vb-green", hex: "#5D8A6B" },
  { name: "pink", class: "bg-vb-pink", hex: "#E89DB1" },
];

const TOTAL_ROUNDS = 6;
const GRID_SIZE = 9;

export function FocusGame({ onComplete, standalone = false }: FocusGameProps) {
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [grid, setGrid] = useState<string[]>([]);
  const [changedIndex, setChangedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<"showing" | "changed" | "waiting">("waiting");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 게임 초기화
  const initializeGame = useCallback(() => {
    setRound(0);
    setCorrectCount(0);
    setGrid([]);
    setChangedIndex(null);
    setPhase("waiting");
    setSelectedIndex(null);
    setIsCorrect(null);
    setStartTime(0);
    setGameStarted(false);
  }, []);

  // 라운드 시작
  const startRound = useCallback(() => {
    // 랜덤 그리드 생성
    const newGrid = Array.from({ length: GRID_SIZE }, () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return color.class;
    });
    setGrid(newGrid);
    setPhase("showing");
    setSelectedIndex(null);
    setIsCorrect(null);

    // 2초 후 색상 변경
    timerRef.current = setTimeout(() => {
      const indexToChange = Math.floor(Math.random() * GRID_SIZE);
      const currentColor = newGrid[indexToChange];
      let differentColor = currentColor;
      while (differentColor === currentColor) {
        differentColor = COLORS[Math.floor(Math.random() * COLORS.length)].class;
      }

      setChangedIndex(indexToChange);

      const changedGrid = [...newGrid];
      changedGrid[indexToChange] = differentColor;
      setGrid(changedGrid);
      setPhase("changed");
    }, 2000);
  }, []);

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [initializeGame]);

  // 게임 시작
  const handleStartGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    startRound();
  };

  // 셀 클릭
  const handleCellClick = (index: number) => {
    if (phase !== "changed" || selectedIndex !== null) return;

    setSelectedIndex(index);
    const correct = index === changedIndex;
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }

    // 다음 라운드 또는 게임 완료
    setTimeout(() => {
      if (round < TOTAL_ROUNDS - 1) {
        setRound((prev) => prev + 1);
        startRound();
      } else {
        // 게임 완료
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const finalCorrect = correct ? correctCount + 1 : correctCount;
        const score = Math.round((finalCorrect / TOTAL_ROUNDS) * 100);
        onComplete(score, duration);
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 진행 상태 */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-sm text-vb-muted">
          라운드 <span className="font-bold text-vb-black">{round + 1}</span>/{TOTAL_ROUNDS}
        </div>
        <div className="text-sm text-vb-muted">
          정답 <span className="font-bold text-vb-teal">{correctCount}</span>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-2 bg-vb-subtle rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-vb-coral to-vb-teal rounded-full transition-all duration-300"
          style={{ width: `${((round + 1) / TOTAL_ROUNDS) * 100}%` }}
        />
      </div>

      {/* 안내 메시지 */}
      <div className="text-center mb-4">
        {phase === "waiting" && (
          <div>
            <p className="text-vb-charcoal mb-4">
              그리드를 잘 기억한 후,
              <br />
              <span className="font-bold text-vb-coral">색이 바뀐 칸</span>을 찾아주세요!
            </p>
            <Button onClick={handleStartGame}>
              {gameStarted ? "다음 라운드" : "게임 시작"}
            </Button>
          </div>
        )}
        {phase === "showing" && (
          <p className="text-vb-navy font-semibold animate-pulse">
            그리드를 기억하세요... 👀
          </p>
        )}
        {phase === "changed" && selectedIndex === null && (
          <p className="text-vb-coral font-semibold">
            어떤 칸의 색이 바뀌었나요? 🔍
          </p>
        )}
      </div>

      {/* 게임 그리드 */}
      {grid.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {grid.map((color, index) => {
            let extraClass = "";
            if (selectedIndex !== null) {
              if (index === changedIndex) {
                extraClass = "ring-4 ring-vb-teal ring-offset-2";
              } else if (index === selectedIndex && !isCorrect) {
                extraClass = "ring-4 ring-vb-coral ring-offset-2";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={phase !== "changed" || selectedIndex !== null}
                className={`
                  aspect-square rounded-xl ${color}
                  transition-all duration-300
                  ${phase === "changed" && selectedIndex === null ? "hover:scale-105 cursor-pointer" : ""}
                  ${extraClass}
                `}
              />
            );
          })}
        </div>
      )}

      {/* 피드백 */}
      {isCorrect !== null && (
        <div className={`text-center text-lg font-semibold animate-in zoom-in duration-200 ${isCorrect ? "text-vb-teal" : "text-vb-coral"}`}>
          {isCorrect ? "정확해요! 👏" : "아쉬워요, 다시 집중! 🧐"}
        </div>
      )}

      {/* 다시하기 (standalone 모드) */}
      {standalone && gameStarted && round === TOTAL_ROUNDS - 1 && selectedIndex !== null && (
        <div className="mt-6">
          <Button variant="ghost" fullWidth onClick={initializeGame}>
            다시 하기
          </Button>
        </div>
      )}
    </div>
  );
}
