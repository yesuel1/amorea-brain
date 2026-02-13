"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";

// 난이도별 이모지 설정
const EMOJIS_EASY = ["🍎", "🍊", "🍋", "🍇"]; // 4쌍 = 8장
const EMOJIS_HARD = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍑", "🥝", "🍒"]; // 8쌍 = 16장

type Difficulty = "easy" | "hard";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onComplete: (score: number, duration: number) => void;
  standalone?: boolean;
  initialDifficulty?: Difficulty;
}

export function MemoryGame({ onComplete, standalone = false, initialDifficulty }: MemoryGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(initialDifficulty || null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [isChecking, setIsChecking] = useState(false);

  const currentEmojis = difficulty === "easy" ? EMOJIS_EASY : EMOJIS_HARD;

  // 게임 초기화
  const initializeGame = useCallback((diff: Difficulty) => {
    const emojis = diff === "easy" ? EMOJIS_EASY : EMOJIS_HARD;
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(false);
    setStartTime(0);
    setIsChecking(false);
    setDifficulty(diff);
  }, []);

  // 난이도 선택 시 게임 시작
  const handleSelectDifficulty = (diff: Difficulty) => {
    initializeGame(diff);
  };

  useEffect(() => {
    if (initialDifficulty) {
      initializeGame(initialDifficulty);
    }
  }, [initialDifficulty, initializeGame]);

  // 카드 클릭 핸들러
  const handleCardClick = (cardId: number) => {
    if (isChecking) return;
    if (flippedCards.length === 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        // 매칭 성공
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        // 매칭 실패
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  // 게임 완료 체크
  useEffect(() => {
    if (difficulty && matchedPairs === currentEmojis.length && gameStarted) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      // 점수 계산: 최소 이동 횟수에서 가까울수록 높은 점수
      const minMoves = currentEmojis.length;
      const efficiency = Math.max(0, 1 - (moves - minMoves) / (minMoves * 2));
      const timeBonus = Math.max(0, 1 - duration / (difficulty === "easy" ? 60 : 120));
      const score = Math.round((efficiency * 70 + timeBonus * 30));

      setTimeout(() => {
        onComplete(score, duration);
      }, 500);
    }
  }, [matchedPairs, gameStarted, moves, startTime, onComplete, difficulty, currentEmojis.length]);

  // 난이도 선택 화면
  if (!difficulty) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <p className="text-vb-muted mb-6">난이도를 선택하세요</p>
        <div className="space-y-3">
          <Button
            fullWidth
            variant="secondary"
            onClick={() => handleSelectDifficulty("easy")}
            className="py-6"
          >
            <div>
              <span className="text-2xl block mb-1">🌱</span>
              <span className="font-bold">1단계 (쉬움)</span>
              <span className="block text-sm text-vb-muted mt-1">8장 (4쌍)</span>
            </div>
          </Button>
          <Button
            fullWidth
            onClick={() => handleSelectDifficulty("hard")}
            className="py-6"
          >
            <div>
              <span className="text-2xl block mb-1">🔥</span>
              <span className="font-bold">2단계 (어려움)</span>
              <span className="block text-sm text-vb-silver mt-1">16장 (8쌍)</span>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 난이도 표시 */}
      <div className="text-center mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          difficulty === "easy" ? "bg-vb-teal/20 text-vb-teal" : "bg-vb-coral/20 text-vb-coral"
        }`}>
          {difficulty === "easy" ? "1단계 쉬움" : "2단계 어려움"}
        </span>
      </div>

      {/* 게임 정보 */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-sm text-vb-muted">
          이동: <span className="font-bold text-vb-black">{moves}</span>
        </div>
        <div className="text-sm text-vb-muted">
          매칭: <span className="font-bold text-vb-teal">{matchedPairs}/{currentEmojis.length}</span>
        </div>
      </div>

      {/* 게임 보드 */}
      <div className={`grid gap-2 mb-4 ${difficulty === "easy" ? "grid-cols-4" : "grid-cols-4"}`}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched || isChecking}
            className={`
              aspect-square rounded-xl ${difficulty === "easy" ? "text-4xl" : "text-3xl"}
              flex items-center justify-center
              transition-all duration-300 transform
              ${
                card.isFlipped || card.isMatched
                  ? "bg-white border-2 border-vb-teal shadow-md scale-100"
                  : "bg-vb-navy hover:bg-vb-charcoal hover:scale-105 cursor-pointer"
              }
              ${card.isMatched ? "opacity-60" : ""}
            `}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="animate-in zoom-in duration-200">{card.emoji}</span>
            ) : (
              <span className="text-white/30">?</span>
            )}
          </button>
        ))}
      </div>

      {/* 안내 텍스트 */}
      <p className="text-center text-vb-muted text-sm">
        같은 그림을 찾아 짝을 맞춰주세요
      </p>

      {/* 다시하기 (standalone 모드) */}
      {standalone && (
        <div className="mt-4 space-y-2">
          <Button variant="ghost" fullWidth onClick={() => initializeGame(difficulty)}>
            다시 하기
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setDifficulty(null)}>
            난이도 변경
          </Button>
        </div>
      )}
    </div>
  );
}
