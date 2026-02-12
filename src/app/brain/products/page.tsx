import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PRODUCTS } from "@/lib/products";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-vb-bg pt-20 pb-24">
      <div className="max-w-mobile mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-vb-black mb-2">
            🧠 뇌 건강 추천 제품
          </h1>
          <p className="text-vb-muted">
            바이탈뷰티가 추천하는 뇌 건강 영양제
          </p>
        </div>

        {/* 뇌 건강 TOP 추천 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⭐</span>
            <h2 className="font-bold text-vb-black">뇌 건강 TOP 추천</h2>
          </div>

          {PRODUCTS.filter((p) => p.category === "brain").map((product) => (
            <Link
              key={product.slug}
              href={`/brain/products/${product.slug}`}
            >
              <Card className="mb-3 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: `${product.accentColor}20` }}
                  >
                    🧠
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-vb-black">{product.name}</h3>
                    <p className="text-sm text-vb-muted mb-2">
                      {product.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.benefits.slice(0, 2).map((benefit, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${product.accentColor}20`,
                            color: product.accentColor,
                          }}
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-vb-silver">→</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 전체 제품 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💊</span>
            <h2 className="font-bold text-vb-black">전체 건강기능식품</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.filter((p) => p.category !== "brain").map((product) => (
              <Link
                key={product.slug}
                href={`/brain/products/${product.slug}`}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-3"
                    style={{ backgroundColor: `${product.accentColor}20` }}
                  >
                    {getCategoryEmoji(product.category)}
                  </div>
                  <h3 className="font-bold text-vb-black text-sm mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-vb-muted">{product.subtitle}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="text-center text-vb-muted text-xs mt-8">
          ※ 건강기능식품은 질병의 예방 및 치료를 위한 의약품이 아닙니다
        </p>
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    brain: "🧠",
    liver: "💚",
    collagen: "✨",
    diet: "🍃",
    multi: "💊",
    ginseng: "🌿",
  };
  return emojis[category] || "💊";
}
