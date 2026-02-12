"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";

const EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍑", "🥝", "🍒"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onComplete: (score: number, duration: number) => void;
  standalone?: boolean;
}

export function MemoryGame({ onComplete, standalone = false }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [isChecking, setIsChecking] = useState(false);

  // 게임 초기화
  const initializeGame = useCallback(() => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
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
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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
    if (matchedPairs === EMOJIS.length && gameStarted) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      // 점수 계산: 최소 이동 횟수(8)에서 가까울수록 높은 점수
      const minMoves = EMOJIS.length;
      const efficiency = Math.max(0, 1 - (moves - minMoves) / (minMoves * 2));
      const timeBonus = Math.max(0, 1 - duration / 120); // 2분 기준
      const score = Math.round((efficiency * 70 + timeBonus * 30));

      setTimeout(() => {
        onComplete(score, duration);
      }, 500);
    }
  }, [matchedPairs, gameStarted, moves, startTime, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 게임 정보 */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-sm text-vb-muted">
          이동: <span className="font-bold text-vb-black">{moves}</span>
        </div>
        <div className="text-sm text-vb-muted">
          매칭: <span className="font-bold text-vb-teal">{matchedPairs}/{EMOJIS.length}</span>
        </div>
      </div>

      {/* 게임 보드 */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched || isChecking}
            className={`
              aspect-square rounded-xl text-3xl
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
        <div className="mt-4">
          <Button variant="ghost" fullWidth onClick={initializeGame}>
            다시 하기
          </Button>
        </div>
      )}
    </div>
  );
}
