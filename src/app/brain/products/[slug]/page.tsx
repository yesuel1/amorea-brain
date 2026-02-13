import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getProductBySlug, PRODUCTS } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-vb-bg">
      {/* 히어로 */}
      <div
        className="pt-20 pb-12 px-4"
        style={{
          background: `linear-gradient(180deg, ${product.accentColor}15 0%, ${product.accentColor}05 100%)`,
        }}
      >
        <div className="max-w-mobile mx-auto text-center">
          {/* 제품 아이콘 */}
          <div
            className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${product.accentColor}20` }}
          >
            {getCategoryEmoji(product.category)}
          </div>

          {/* 제품명 */}
          <h1 className="text-2xl font-bold text-vb-black mb-1">
            {product.name}
          </h1>
          <p className="text-vb-muted">{product.subtitle}</p>

          {/* 효능 태그 */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {product.benefits.map((benefit, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm font-medium"
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
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-mobile mx-auto px-4 -mt-4">
        {/* 뇌 건강 연관성 */}
        {product.brainBenefit && (
          <Card className="mb-4 border-2" style={{ borderColor: product.accentColor }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧠</span>
              <div>
                <p className="font-bold text-vb-black text-sm mb-1">
                  뇌 건강과의 연관성
                </p>
                <p className="text-vb-charcoal text-sm leading-relaxed">
                  {product.brainBenefit}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 제품 설명 */}
        <Card className="mb-4">
          <h2 className="font-bold text-vb-black mb-3">제품 소개</h2>
          <p className="text-vb-charcoal text-sm leading-relaxed">
            {product.description}
          </p>
        </Card>

        {/* 주요 성분 */}
        <Card className="mb-4">
          <h2 className="font-bold text-vb-black mb-3">주요 성분</h2>
          <p className="text-vb-charcoal text-sm">{product.ingredients}</p>
        </Card>

        {/* 기대 효과 */}
        <Card className="mb-6">
          <h2 className="font-bold text-vb-black mb-3">기대 효과</h2>
          <ul className="space-y-2">
            {product.benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: product.accentColor }}
                >
                  ✓
                </span>
                <span className="text-vb-charcoal">{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* CTA */}
        <div className="pb-8">
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
            <Button fullWidth size="lg">
              바이탈뷰티 공식몰에서 보기 →
            </Button>
          </a>
          <p className="text-center text-vb-muted text-xs mt-3">
            바이탈뷰티 공식 온라인몰로 이동합니다
          </p>
        </div>

        {/* 다른 제품 추천 */}
        <div className="pb-8">
          <h3 className="font-bold text-vb-black mb-3">다른 추천 제품</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {PRODUCTS.filter((p) => p.slug !== product.slug)
              .slice(0, 3)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/brain/products/${p.slug}`}
                  className="flex-shrink-0 w-28"
                >
                  <Card className="text-center">
                    <div
                      className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${p.accentColor}20` }}
                    >
                      {getCategoryEmoji(p.category)}
                    </div>
                    <p className="text-xs font-medium text-vb-black truncate">
                      {p.name}
                    </p>
                  </Card>
                </Link>
              ))}
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="text-center text-vb-muted text-xs pb-8">
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
