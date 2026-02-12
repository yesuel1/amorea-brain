-- ============================================
-- 바이탈뷰티 제품 시드 데이터
-- ============================================

INSERT INTO products (slug, name, subtitle, benefits, accent_color, category, external_url, display_order) VALUES
  (
    'energy-shot-body-brain',
    '에너지샷 바디앤브레인',
    '열처리 녹차추출물 함유',
    ARRAY['기억력 개선', '에너지 증진'],
    '#E8625C',
    'brain',
    'https://www.vitalbeautie.com/kr/ko/products/energy-shot-body-brain.html',
    1
  ),
  (
    'liver-prime',
    '리버프라임',
    '밀크씨슬 함유',
    ARRAY['간 건강', '피로회복'],
    '#5D8A6B',
    'liver',
    'https://www.vitalbeautie.com/kr/ko/products/liver-prime.html',
    2
  ),
  (
    'super-collagen-gold',
    '슈퍼콜라겐 골드',
    '저분자 피쉬콜라겐',
    ARRAY['피부 탄력', '이너뷰티'],
    '#E89DB1',
    'collagen',
    'https://www.vitalbeautie.com/kr/ko/products/super-collagen-gold.html',
    3
  ),
  (
    'metagreen-enzyme',
    '메타그린 엔자임',
    '녹차 카테킨 + 효소',
    ARRAY['체지방 감소', '대사 활성'],
    '#5D8A6B',
    'diet',
    'https://www.vitalbeautie.com/kr/ko/products/metagreen-enzyme.html',
    4
  ),
  (
    'all-in-one-multipack',
    '올인원 멀티팩',
    '종합 영양 설계',
    ARRAY['기초 영양', '면역 건강'],
    '#5C6BC0',
    'multi',
    'https://www.vitalbeautie.com/kr/ko/products/all-in-one-multipack.html',
    5
  ),
  (
    'red-ginseng-gold',
    '홍삼 골드',
    '6년근 홍삼 농축액',
    ARRAY['면역력 증진', '피로회복'],
    '#C8956C',
    'ginseng',
    'https://www.vitalbeautie.com/kr/ko/products/red-ginseng-gold.html',
    6
  );

-- ============================================
-- 기본 페이지 콘텐츠
-- ============================================

INSERT INTO page_content (section_key, content_type, content) VALUES
  ('hero_title', 'text', '뇌 습관, 미리 만들어야 늦지 않습니다'),
  ('hero_subtitle', 'text', '매일 10분, 재미있는 게임으로 뇌를 깨우고 좋은 습관으로 젊은 뇌를 유지하세요'),
  ('counselor_message', 'text', '치매는 유전이 아니라 습관입니다. 오늘 10분의 뇌 운동이 10년 뒤 당신의 뇌를 지켜줍니다.'),
  ('quote_text', 'text', '알츠하이머 유전자가 있어도 발병하지 않을 수 있습니다. 핵심은 습관입니다.');
