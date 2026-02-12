-- ============================================
-- AMOREA Brain Care 초기 스키마
-- ============================================

-- 1. 회원 프로필 (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  birth_year INTEGER,
  gender TEXT CHECK (gender IN ('M', 'F', 'O')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'counselor', 'admin')),
  counselor_id UUID REFERENCES profiles(id),
  free_uses_remaining INTEGER DEFAULT 3,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 카운셀러 정보
CREATE TABLE counselors (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT,
  photo_url TEXT,
  introduction TEXT,
  blog_url TEXT,
  product_page_url TEXT,
  today_message TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  client_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 뇌나이 측정 결과
CREATE TABLE brain_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  brain_age INTEGER NOT NULL,
  total_score INTEGER NOT NULL,
  memory_score INTEGER,
  calc_score INTEGER,
  focus_score INTEGER,
  language_score INTEGER,
  thinking_score INTEGER,
  percentile INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 게임 기록
CREATE TABLE game_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  game_type TEXT NOT NULL CHECK (game_type IN ('memory', 'calc', 'focus', 'language', 'thinking')),
  score INTEGER NOT NULL,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 습관 트래커
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  habit_type TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, habit_type, date)
);

-- 6. 카운셀러 → 고객 메시지
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 제품 정보
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  benefits TEXT[],
  ingredients TEXT,
  image_url TEXT,
  external_url TEXT,
  accent_color TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 랜딩페이지 콘텐츠
CREATE TABLE page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  content_type TEXT DEFAULT 'text',
  content TEXT NOT NULL,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. 공유 링크
CREATE TABLE share_links (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  share_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_brain_tests_user_id ON brain_tests(user_id);
CREATE INDEX idx_brain_tests_session_id ON brain_tests(session_id);
CREATE INDEX idx_game_records_user_id ON game_records(user_id);
CREATE INDEX idx_habits_user_date ON habits(user_id, date);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_counselors_code ON counselors(code);

-- ============================================
-- RLS 정책 (Row Level Security)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- profiles 정책
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- counselors 정책 (공개 읽기 가능)
CREATE POLICY "Anyone can read approved counselors" ON counselors
  FOR SELECT USING (is_approved = true);
CREATE POLICY "Counselors can update own profile" ON counselors
  FOR UPDATE USING (auth.uid() = id);

-- brain_tests 정책
CREATE POLICY "Users can read own tests" ON brain_tests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert tests" ON brain_tests
  FOR INSERT WITH CHECK (true);

-- game_records 정책
CREATE POLICY "Users can read own records" ON game_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert records" ON game_records
  FOR INSERT WITH CHECK (true);

-- habits 정책
CREATE POLICY "Users can manage own habits" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- messages 정책
CREATE POLICY "Users can read received messages" ON messages
  FOR SELECT USING (auth.uid() = receiver_id OR auth.uid() = sender_id);
CREATE POLICY "Counselors can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- products 정책 (공개 읽기)
CREATE POLICY "Anyone can read active products" ON products
  FOR SELECT USING (is_active = true);

-- page_content 정책 (공개 읽기)
CREATE POLICY "Anyone can read page content" ON page_content
  FOR SELECT USING (true);

-- share_links 정책 (공개 읽기)
CREATE POLICY "Anyone can read share links" ON share_links
  FOR SELECT USING (true);
CREATE POLICY "Anyone can create share links" ON share_links
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 트리거: 프로필 자동 생성
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 트리거: updated_at 자동 갱신
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
