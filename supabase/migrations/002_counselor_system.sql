-- ============================================
-- 디지털 카운셀러 시스템 확장
-- ============================================

-- 1. counselors 테이블 확장 (전화, SNS 링크 추가)
ALTER TABLE counselors
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS kakao_link TEXT,
ADD COLUMN IF NOT EXISTS instagram_link TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive'));

-- 기존 is_approved를 status로 마이그레이션
UPDATE counselors SET status = 'active' WHERE is_approved = true;
UPDATE counselors SET status = 'pending' WHERE is_approved = false OR is_approved IS NULL;

-- 2. 카운셀러 코드 시퀀스 (br1001, br1002, ...)
CREATE SEQUENCE IF NOT EXISTS counselor_code_seq START WITH 1001;

-- 3. 메시지 템플릿 테이블
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. messages 테이블 확장 (템플릿 참조)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES message_templates(id);

-- 5. 구독 정보 테이블
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'monthly', 'yearly')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 인덱스 추가
-- ============================================
CREATE INDEX IF NOT EXISTS idx_counselors_status ON counselors(status);
CREATE INDEX IF NOT EXISTS idx_message_templates_active ON message_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- RLS 정책 추가
-- ============================================
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- message_templates 정책 (카운셀러/관리자 읽기 가능)
CREATE POLICY "Counselors can read active templates" ON message_templates
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('counselor', 'admin')
    )
  );

CREATE POLICY "Admins can manage templates" ON message_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- subscriptions 정책
CREATE POLICY "Users can read own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscriptions" ON subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================
-- 관리자용 RLS 정책 추가
-- ============================================

-- 관리자는 모든 프로필 읽기 가능
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- 관리자는 모든 카운셀러 관리 가능
CREATE POLICY "Admins can manage all counselors" ON counselors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- 카운셀러는 담당 회원 프로필 읽기 가능
CREATE POLICY "Counselors can read their clients" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM counselors
      WHERE id = auth.uid()
      AND status = 'active'
    )
    AND counselor_id = auth.uid()
  );

-- 관리자는 모든 건강 기록 읽기 가능
CREATE POLICY "Admins can read all brain tests" ON brain_tests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can read all game records" ON game_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can read all habits" ON habits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================
-- 카운셀러 코드 생성 함수
-- ============================================
CREATE OR REPLACE FUNCTION generate_counselor_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
BEGIN
  new_code := 'br' || nextval('counselor_code_seq')::TEXT;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 카운셀러 등록 시 코드 자동 생성 트리거
-- ============================================
CREATE OR REPLACE FUNCTION auto_generate_counselor_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := generate_counselor_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_counselor_code
  BEFORE INSERT ON counselors
  FOR EACH ROW EXECUTE FUNCTION auto_generate_counselor_code();

-- ============================================
-- 카운셀러 링크로 가입 시 자동 연결 (프로필 생성 트리거 수정)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  counselor_code_param TEXT;
  linked_counselor_id UUID;
BEGIN
  -- 메타데이터에서 카운셀러 코드 확인
  counselor_code_param := NEW.raw_user_meta_data->>'counselor_code';

  IF counselor_code_param IS NOT NULL THEN
    -- 카운셀러 ID 찾기
    SELECT id INTO linked_counselor_id
    FROM counselors
    WHERE code = counselor_code_param AND status = 'active';
  END IF;

  -- 프로필 생성 (카운셀러 연결 포함)
  INSERT INTO public.profiles (id, counselor_id)
  VALUES (NEW.id, linked_counselor_id);

  -- 카운셀러 연결 시 무료 구독 생성
  IF linked_counselor_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (user_id, plan_type, status)
    VALUES (NEW.id, 'free', 'active');

    -- 카운셀러 클라이언트 수 증가
    UPDATE counselors
    SET client_count = client_count + 1
    WHERE id = linked_counselor_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 샘플 메시지 템플릿 (관리자용)
-- ============================================
INSERT INTO message_templates (title, content, category) VALUES
('환영 인사', '안녕하세요 {{name}}님! 뇌건강 관리를 시작하신 것을 환영합니다. 매일 조금씩 두뇌 운동을 해보세요! 🧠', 'welcome'),
('활동 독려', '{{name}}님, 요즘 뇌건강 관리 잘 하고 계신가요? 오늘도 간단한 두뇌 게임으로 뇌를 깨워보세요!', 'reminder'),
('습관 체크', '{{name}}님, 오늘의 뇌건강 습관 체크하셨나요? 작은 습관이 큰 변화를 만듭니다! ✨', 'habit'),
('제품 추천', '{{name}}님께 추천드리는 뇌건강 영양제입니다. 궁금하신 점은 언제든 연락주세요!', 'product')
ON CONFLICT DO NOTHING;
