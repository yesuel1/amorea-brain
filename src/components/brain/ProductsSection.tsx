import { Card } from "@/components/ui/Card";
import Link from "next/link";

const products = [
  {
    slug: "energy-shot-body-brain",
    name: "바디앤브레인",
    subtitle: "기억력 개선",
    benefits: ["열처리 녹차추출물", "FDA 인정 기능성"],
    accentColor: "#E8625C",
  },
  {
    slug: "liver-prime",
    name: "리버프라임",
    subtitle: "간 건강",
    benefits: ["밀크씨슬", "피로회복"],
    accentColor: "#5D8A6B",
  },
  {
    slug: "red-ginseng-gold",
    name: "홍삼 골드",
    subtitle: "면역력 증진",
    benefits: ["6년근 홍삼", "진세노사이드"],
    accentColor: "#C8956C",
  },
];

export function ProductsSection() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-vb-black mb-4">추천 브레인 영양</h2>

      <div className="space-y-3">
        {products.map((product) => (
          <Link key={product.slug} href={`/brain/products/${product.slug}`}>
            <Card
              variant="dark"
              hoverable
              padding="md"
              className="relative overflow-hidden"
            >
              {/* 악센트 컬러 바 */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: product.accentColor }}
              />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{product.name}</h3>
                    <span
                      className="px-2 py-0.5 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: `${product.accentColor}30`,
                        color: product.accentColor,
                      }}
                    >
                      {product.subtitle}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {product.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="text-xs text-vb-silver bg-white/10 px-2 py-1 rounded"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 화살표 */}
                <div className="ml-4 text-vb-silver">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
