"use client";

import { useState } from "react";

const brainAreas = [
  { id: "memory", name: "기억력", score: 85, color: "#E8625C", x: 30, y: 25 },
  { id: "creativity", name: "창의력", score: 72, color: "#E89DB1", x: 70, y: 20 },
  { id: "focus", name: "집중력", score: 91, color: "#3AAFA9", x: 50, y: 50 },
  { id: "calc", name: "계산력", score: 78, color: "#5C6BC0", x: 25, y: 65 },
  { id: "language", name: "언어력", score: 88, color: "#5D8A6B", x: 75, y: 60 },
  { id: "thinking", name: "사고력", score: 82, color: "#C8956C", x: 50, y: 85 },
];

export function BrainMapSection() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-vb-black mb-4">나의 두뇌 영역</h2>

      <div className="relative aspect-square bg-vb-navy rounded-3xl overflow-hidden">
        {/* 그리드 패턴 배경 */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* 두뇌 영역 버블 */}
        {brainAreas.map((area) => (
          <button
            key={area.id}
            onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              left: `${area.x}%`,
              top: `${area.y}%`,
            }}
          >
            <div
              className={`
                relative flex flex-col items-center justify-center
                rounded-full transition-all duration-300
                ${selectedArea === area.id ? "w-24 h-24 scale-110" : "w-16 h-16"}
              `}
              style={{
                backgroundColor: `${area.color}20`,
                border: `2px solid ${area.color}`,
                boxShadow: selectedArea === area.id ? `0 0 20px ${area.color}50` : "none",
              }}
            >
              <span className="text-white text-xs font-medium">{area.name}</span>
              {selectedArea === area.id && (
                <span
                  className="text-lg font-bold animate-in zoom-in duration-200"
                  style={{ color: area.color }}
                >
                  {area.score}점
                </span>
              )}
            </div>

            {/* 펄스 효과 */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: area.color }}
            />
          </button>
        ))}

        {/* 중앙 뇌 아이콘 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl opacity-30">
          🧠
        </div>
      </div>

      {/* 안내 텍스트 */}
      <p className="text-center text-vb-muted text-sm mt-3">
        각 영역을 터치하면 점수를 확인할 수 있어요
      </p>
    </section>
  );
}
