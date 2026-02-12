import { Card } from "@/components/ui/Card";
import { PRODUCTS } from "@/lib/products";

export default function AdminProductsPage() {
  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-vb-black">제품 관리</h1>
        <p className="text-vb-muted">바이탈뷰티 제품 정보 관리</p>
      </div>

      {/* 안내 */}
      <Card className="mb-6 bg-vb-subtle border-none">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-medium text-vb-black">제품 정보 안내</p>
            <p className="text-sm text-vb-muted mt-1">
              현재 제품 정보는 코드에서 관리됩니다. DB 기반 관리 기능은 추후
              업데이트 예정입니다.
            </p>
          </div>
        </div>
      </Card>

      {/* 제품 목록 */}
      <div className="space-y-4">
        {PRODUCTS.map((product) => (
          <Card key={product.slug}>
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ backgroundColor: `${product.accentColor}20` }}
              >
                {getCategoryEmoji(product.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-vb-black">{product.name}</h3>
                    <p className="text-sm text-vb-muted">{product.subtitle}</p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${product.accentColor}20`,
                      color: product.accentColor,
                    }}
                  >
                    {getCategoryLabel(product.category)}
                  </span>
                </div>

                <p className="text-sm text-vb-charcoal mt-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {product.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 bg-vb-subtle rounded-full text-vb-charcoal"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-vb-lightsilver">
                  <code className="text-xs text-vb-muted bg-vb-subtle px-2 py-1 rounded">
                    {product.slug}
                  </code>
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-vb-teal hover:underline"
                  >
                    공식몰 링크 →
                  </a>
                  <a
                    href={`/brain/products/${product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-vb-blue hover:underline"
                  >
                    상세페이지 →
                  </a>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 통계 */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-vb-black">{PRODUCTS.length}</p>
          <p className="text-sm text-vb-muted">전체 제품</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-vb-coral">
            {PRODUCTS.filter((p) => p.category === "brain").length}
          </p>
          <p className="text-sm text-vb-muted">뇌 건강</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-vb-teal">
            {new Set(PRODUCTS.map((p) => p.category)).size}
          </p>
          <p className="text-sm text-vb-muted">카테고리</p>
        </Card>
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

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    brain: "뇌 건강",
    liver: "간 건강",
    collagen: "콜라겐",
    diet: "다이어트",
    multi: "종합",
    ginseng: "홍삼",
  };
  return labels[category] || category;
}
