import Link from "next/link";
import { Card } from "@/components/ui/Card";

const games = [
  {
    slug: "memory",
    name: "기억력 게임",
    icon: "🧩",
    description: "카드 짝 맞추기로 기억력을 테스트하세요",
    color: "from-vb-coral to-vb-pink",
  },
  {
    slug: "calc",
    name: "계산력 게임",
    icon: "🔢",
    description: "빠른 암산으로 두뇌를 깨워보세요",
    color: "from-vb-blue to-vb-teal",
  },
  {
    slug: "focus",
    name: "집중력 게임",
    icon: "🎯",
    description: "색 변화를 감지하며 집중력을 키워보세요",
    color: "from-vb-teal to-vb-green",
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-mobile mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-vb-black mb-2">
            🧠 일일 뇌운동
          </h1>
          <p className="text-vb-muted">
            매일 10분, 게임으로 뇌를 깨워보세요
          </p>
        </div>

        {/* 게임 카드 목록 */}
        <div className="space-y-4">
          {games.map((game) => (
            <Link key={game.slug} href={`/brain/games/${game.slug}`}>
              <Card hoverable className="relative overflow-hidden">
                {/* 배경 그라데이션 */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-10`}
                />

                <div className="relative flex items-center gap-4">
                  {/* 아이콘 */}
                  <div className="w-16 h-16 rounded-2xl bg-vb-navy flex items-center justify-center text-3xl">
                    {game.icon}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-vb-black">
                      {game.name}
                    </h2>
                    <p className="text-sm text-vb-muted">{game.description}</p>
                  </div>

                  {/* 화살표 */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-vb-silver"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 안내 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-vb-muted">
            각 게임을 완료하면 점수가 기록됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
