"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

const habits = [
  { id: "brain_game", label: "뇌운동 게임 10분", icon: "🧠" },
  { id: "supplement_body_brain", label: "바디앤브레인 복용", icon: "💊" },
  { id: "omega", label: "오메가3 복용", icon: "🐟" },
  { id: "exercise", label: "산책 30분", icon: "🚶" },
  { id: "meditation", label: "감사명상 5분", icon: "🧘" },
];

export function HabitChecklist() {
  const [checkedHabits, setCheckedHabits] = useState<Set<string>>(new Set());

  const toggleHabit = (habitId: string) => {
    const newChecked = new Set(checkedHabits);
    if (newChecked.has(habitId)) {
      newChecked.delete(habitId);
    } else {
      newChecked.add(habitId);
    }
    setCheckedHabits(newChecked);
  };

  const progress = (checkedHabits.size / habits.length) * 100;
  const allComplete = checkedHabits.size === habits.length;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-vb-black">오늘의 뇌 습관</h2>
        <span className="text-vb-teal font-semibold">
          {checkedHabits.size}/{habits.length}
        </span>
      </div>

      <Card>
        {/* 프로그레스 바 */}
        <div className="h-2 bg-vb-subtle rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-vb-coral to-vb-teal rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 습관 목록 */}
        <div className="space-y-2">
          {habits.map((habit) => {
            const isChecked = checkedHabits.has(habit.id);
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl
                  transition-all duration-200
                  ${isChecked ? "bg-vb-teal/10" : "bg-vb-subtle hover:bg-vb-lightsilver"}
                `}
              >
                {/* 체크박스 */}
                <div
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center
                    transition-all duration-200
                    ${isChecked ? "bg-vb-teal text-white" : "bg-white border-2 border-vb-silver"}
                  `}
                >
                  {isChecked && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                {/* 아이콘 & 라벨 */}
                <span className="text-xl">{habit.icon}</span>
                <span
                  className={`
                    flex-1 text-left font-medium
                    ${isChecked ? "text-vb-teal line-through" : "text-vb-black"}
                  `}
                >
                  {habit.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 완료 축하 메시지 */}
        {allComplete && (
          <div className="mt-4 p-4 bg-gradient-to-r from-vb-coral/10 to-vb-teal/10 rounded-xl text-center animate-in zoom-in duration-300">
            <span className="text-2xl mb-2 block">🎉</span>
            <p className="font-bold text-vb-black">오늘의 습관 완료!</p>
            <p className="text-sm text-vb-muted">내일도 함께 해요</p>
          </div>
        )}
      </Card>
    </section>
  );
}
