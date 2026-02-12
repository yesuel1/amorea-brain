// 바이탈뷰티 제품 데이터
export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  benefits: string[];
  ingredients: string;
  accentColor: string;
  category: string;
  externalUrl: string;
  brainBenefit?: string; // 뇌 건강 관련 효능
}

export const PRODUCTS: Product[] = [
  {
    slug: "energy-shot-body-brain",
    name: "에너지샷 바디앤브레인",
    subtitle: "열처리 녹차추출물 함유",
    description:
      "열처리 녹차추출물과 비타민B군이 함유된 프리미엄 기능성 건강기능식품입니다. 일상의 피로감을 해소하고 기억력 개선에 도움을 줍니다.",
    benefits: ["기억력 개선", "에너지 증진", "피로회복"],
    ingredients: "열처리 녹차추출물, 비타민B1, B2, B6, 나이아신",
    accentColor: "#E8625C",
    category: "brain",
    externalUrl:
      "https://www.vitalbeautie.com/kr/ko/products/energy-shot-body-brain.html",
    brainBenefit: "기억력 개선에 도움을 주는 열처리 녹차추출물 함유",
  },
  {
    slug: "liver-prime",
    name: "리버프라임",
    subtitle: "밀크씨슬 함유",
    description:
      "밀크씨슬 추출물이 함유된 간 건강 기능식품입니다. 간 건강 유지와 피로회복에 도움을 줍니다.",
    benefits: ["간 건강", "피로회복", "항산화"],
    ingredients: "밀크씨슬추출물, 비타민E, 아연",
    accentColor: "#5D8A6B",
    category: "liver",
    externalUrl:
      "https://www.vitalbeautie.com/kr/ko/products/liver-prime.html",
    brainBenefit: "간 해독으로 뇌에 전달되는 독소 감소, 맑은 정신 유지",
  },
  {
    slug: "super-collagen-gold",
    name: "슈퍼콜라겐 골드",
    subtitle: "저분자 피쉬콜라겐",
    description:
      "저분자 피쉬콜라겐 펩타이드가 함유된 프리미엄 이너뷰티 제품입니다. 피부 탄력과 보습에 도움을 줍니다.",
    benefits: ["피부 탄력", "피부 보습", "이너뷰티"],
    ingredients: "저분자 피쉬콜라겐펩타이드, 비타민C, 히알루론산",
    accentColor: "#E89DB1",
    category: "collagen",
    externalUrl:
      "https://www.vitalbeautie.com/kr/ko/products/super-collagen-gold.html",
    brainBenefit: "혈관 건강 유지로 뇌 혈류 개선에 간접 도움",
  },
  {
    slug: "metagreen-enzyme",
    name: "메타그린 엔자임",
    subtitle: "녹차 카테킨 + 효소",
    description:
      "녹차 카테킨과 소화효소가 함유된 체지방 감소 기능식품입니다. 체지방 감소와 대사 활성에 도움을 줍니다.",
    benefits: ["체지방 감소", "대사 활성", "소화 개선"],
    ingredients: "녹차추출물, 소화효소, L-카르니틴",
    accentColor: "#5D8A6B",
    category: "diet",
    externalUrl:
      "https://www.vitalbeautie.com/kr/ko/products/metagreen-enzyme.html",
    brainBenefit: "건강한 체중 관리로 뇌 건강 위험요소 감소",
  },
  {
    slug: "all-in-one-multipack",
    name: "올인원 멀티팩",
    subtitle: "종합 영양 설계",
    description:
      "하루에 필요한 필수 영양소를 한 팩에 담은 종합 멀티비타민입니다. 균형 잡힌 영양 섭취를 도와줍니다.",
    benefits: ["기초 영양", "면역 건강", "활력 증진"],
    ingredients: "종합비타민, 미네랄, 오메가3, 유산균",
    accentColor: "#5C6BC0",
    category: "multi",
    externalUrl:
      "https://www.vitalbeautie.com/kr/ko/products/all-in-one-multipack.html",
    brainBenefit: "뇌 기능에 필수적인 비타민B군과 오메가3 함유",
  },
  {
    slug: "red-ginseng-gold",
    name: "홍삼 골드",
    subtitle: "6년근 홍삼 농축액",
    description:
      "6년근 홍삼 농축액이 함유된 프리미엄 홍삼 제품입니다. 면역력 증진과 피로회복에 도움을 줍니다.",
    benefits: ["면역력 증진", "피로회복", "혈행 개선"],
    ingredients: "6년근 홍삼농축액, 진세노사이드",
    accentColor: "#C8956C",
    category: "ginseng",
    externalUrl:
      "https://www.vitalbeautie.com/kr/ko/products/red-ginseng-gold.html",
    brainBenefit: "홍삼의 진세노사이드가 인지 기능 개선에 도움",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}
