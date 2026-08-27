-- Career Dashboard - Supabase Database Schema
-- 석화고 취업길잡이 PostgreSQL 스키마 정의

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- ============================================================
-- 1. Companies (기업)
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  english_name TEXT,
  logo_url TEXT,
  industry TEXT NOT NULL,
  industry_detail TEXT,
  location TEXT,
  sector TEXT CHECK (sector IN ('정유', '석화', '가스', '배터리', '발전', '반도체', '기타')),
  is_popular_rank INT CHECK (is_popular_rank IS NULL OR (is_popular_rank >= 0 AND is_popular_rank <= 23)),
  description TEXT,
  business_process TEXT,
  openings_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_companies_is_popular_rank ON companies(is_popular_rank);
CREATE INDEX idx_companies_location ON companies(location);

-- ============================================================
-- 2. Company_Characteristics (기업 특성 점수)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_characteristics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
  salary INT NOT NULL CHECK (salary >= 1 AND salary <= 5),
  welfare INT NOT NULL CHECK (welfare >= 1 AND welfare <= 5),
  work_life_balance INT NOT NULL CHECK (work_life_balance >= 1 AND work_life_balance <= 5),
  safety INT NOT NULL CHECK (safety >= 1 AND safety <= 5),
  growth INT NOT NULL CHECK (growth >= 1 AND growth <= 5),
  stability INT NOT NULL CHECK (stability >= 1 AND stability <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. Company_Stats (기업 통계)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
  employees TEXT,
  avg_salary TEXT,
  established_year TEXT,
  shift_system TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. Company_Benefits (기업 복리후생)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_benefits_company_id ON company_benefits(company_id, order_index);

-- ============================================================
-- 5. Company_Reviews (기업 평가)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  review_date TEXT,
  role TEXT,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_reviews_company_id ON company_reviews(company_id);

-- ============================================================
-- 6. Company_Tags (기업 태그)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  order_index INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_tags_company_id ON company_tags(company_id);

-- ============================================================
-- 7. Job_Openings (채용공고)
-- ============================================================
CREATE TABLE IF NOT EXISTS job_openings (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  korean_title TEXT,
  location TEXT,
  education_req TEXT,
  category TEXT,
  salary_guide TEXT,
  work_schedule TEXT,
  description TEXT,
  status TEXT CHECK (status IN ('hiring', 'closed')) DEFAULT 'hiring',
  d_day TEXT,
  is_meister_recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_openings_company_id ON job_openings(company_id);
CREATE INDEX idx_job_openings_status ON job_openings(status);
CREATE INDEX idx_job_openings_is_meister ON job_openings(is_meister_recommended);

-- ============================================================
-- 8. Job_Requirements (직무 요구사항)
-- ============================================================
CREATE TABLE IF NOT EXISTS job_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_opening_id TEXT NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
  requirement TEXT NOT NULL,
  order_index INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_requirements_job_id ON job_requirements(job_opening_id, order_index);

-- ============================================================
-- 9. Job_Responsibilities (직무 책임)
-- ============================================================
CREATE TABLE IF NOT EXISTS job_responsibilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_opening_id TEXT NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
  responsibility TEXT NOT NULL,
  order_index INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_responsibilities_job_id ON job_responsibilities(job_opening_id, order_index);

-- ============================================================
-- 10. Sector_Trends (부문 트렌드)
-- ============================================================
CREATE TABLE IF NOT EXISTS sector_trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector TEXT NOT NULL UNIQUE CHECK (sector IN ('정유', '석화', '가스', '배터리', '발전', '반도체', '기타')),
  english_name TEXT,
  icon TEXT,
  current_status TEXT,
  market_size TEXT,
  growth_rate TEXT,
  outlook_status TEXT CHECK (outlook_status IN ('positive', 'neutral', 'caution')),
  future_outlook TEXT,
  salary_trend TEXT,
  job_outlook TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sector_trends_sector ON sector_trends(sector);

-- ============================================================
-- 11. Sector_Trends_Items (트렌드 항목)
-- ============================================================
CREATE TABLE IF NOT EXISTS sector_trends_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector_id UUID NOT NULL REFERENCES sector_trends(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('trends', 'opportunities', 'challenges', 'technologies', 'skill_demand')),
  content TEXT NOT NULL,
  order_index INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sector_trends_items_sector_id ON sector_trends_items(sector_id, item_type, order_index);

-- ============================================================
-- 12. Certifications (자격증)
-- ============================================================
CREATE TABLE IF NOT EXISTS certifications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  issuer TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  test_type TEXT CHECK (test_type IN ('practical', 'written')) DEFAULT 'practical',
  passing_rate TEXT,
  exam_fee TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certifications_test_type ON certifications(test_type);

-- ============================================================
-- 13. Certification_Relevant_Fields (자격증 관련 분야)
-- ============================================================
CREATE TABLE IF NOT EXISTS certification_relevant_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certification_id TEXT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  field TEXT NOT NULL,
  order_index INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cert_relevant_fields_cert_id ON certification_relevant_fields(certification_id, order_index);

-- ============================================================
-- 14. Certification_Routes (자격증 취득 경로)
-- ============================================================
CREATE TABLE IF NOT EXISTS certification_routes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  priority INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 15. Certification_Routes_Items (경로별 자격증)
-- ============================================================
CREATE TABLE IF NOT EXISTS certification_routes_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id TEXT NOT NULL REFERENCES certification_routes(id) ON DELETE CASCADE,
  certification_id TEXT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  order_index INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(route_id, certification_id)
);

CREATE INDEX idx_cert_routes_items_route_id ON certification_routes_items(route_id, order_index);

-- ============================================================
-- 16. Certification_Routes_Target_Sectors (경로별 대상 부문)
-- ============================================================
CREATE TABLE IF NOT EXISTS certification_routes_target_sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id TEXT NOT NULL REFERENCES certification_routes(id) ON DELETE CASCADE,
  sector TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(route_id, sector)
);

CREATE INDEX idx_cert_routes_sectors_route_id ON certification_routes_target_sectors(route_id);

-- ============================================================
-- 17. Users (사용자 프로필)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  class_info TEXT,
  graduation_date DATE,
  avatar_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================================
-- 18. User_Certifications (사용자 자격증)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  certification_id TEXT NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('acquired', 'scheduled')) DEFAULT 'scheduled',
  acquired_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_certifications_user_id ON user_certifications(user_id, status);
CREATE INDEX idx_user_certifications_cert_id ON user_certifications(certification_id);

-- ============================================================
-- 19. User_Bookmarks (북마크)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_opening_id TEXT NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, job_opening_id)
);

CREATE INDEX idx_user_bookmarks_user_id ON user_bookmarks(user_id, created_at DESC);

-- ============================================================
-- 20. User_Followed_Companies (팔로우 회사)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_followed_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, company_id)
);

CREATE INDEX idx_user_followed_companies_user_id ON user_followed_companies(user_id);

-- ============================================================
-- 21. Application_Records (지원 현황)
-- ============================================================
CREATE TABLE IF NOT EXISTS application_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_opening_id TEXT NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('applied', 'pass', 'fail', 'interview')) DEFAULT 'applied',
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_application_records_user_id ON application_records(user_id, applied_date DESC);
CREATE INDEX idx_application_records_status ON application_records(user_id, status);

-- ============================================================
-- 22. Notifications (알림)
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  notification_type TEXT,
  related_id TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_is_read ON notifications(user_id, is_read);

-- ============================================================
-- Row Level Security (RLS) 정책
-- ============================================================

-- 공개 테이블 (모두 읽기 가능)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_characteristics ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_responsibilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_trends_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_relevant_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_routes_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_routes_target_sectors ENABLE ROW LEVEL SECURITY;

-- 공개 테이블 - 모두 읽기
CREATE POLICY "Public read access" ON companies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_characteristics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_benefits FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_reviews FOR SELECT USING (true);
CREATE POLICY "Public read access" ON company_tags FOR SELECT USING (true);
CREATE POLICY "Public read access" ON job_openings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON job_requirements FOR SELECT USING (true);
CREATE POLICY "Public read access" ON job_responsibilities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sector_trends FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sector_trends_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certification_relevant_fields FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certification_routes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certification_routes_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certification_routes_target_sectors FOR SELECT USING (true);

-- 사용자 프로필 (본인만 읽고 쓰기 가능)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- 사용자 자격증 (본인만 관리)
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own certifications" ON user_certifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own certifications" ON user_certifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own certifications" ON user_certifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own certifications" ON user_certifications FOR DELETE USING (auth.uid() = user_id);

-- 사용자 북마크 (본인만 관리)
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own bookmarks" ON user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON user_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- 팔로우 회사 (본인만 관리)
ALTER TABLE user_followed_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own followed companies" ON user_followed_companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own followed companies" ON user_followed_companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own followed companies" ON user_followed_companies FOR DELETE USING (auth.uid() = user_id);

-- 지원 현황 (본인만 관리)
ALTER TABLE application_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own applications" ON application_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications" ON application_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON application_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON application_records FOR DELETE USING (auth.uid() = user_id);

-- 알림 (본인만 관리)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 유용한 뷰
-- ============================================================

-- 회사 전체 프로필 (통합 뷰)
CREATE OR REPLACE VIEW company_profiles AS
SELECT 
  c.id,
  c.name,
  c.english_name,
  c.logo_url,
  c.industry,
  c.location,
  c.sector,
  c.is_popular_rank,
  c.description,
  c.business_process,
  cs.employees,
  cs.avg_salary,
  cs.established_year,
  cs.shift_system,
  cc.salary,
  cc.welfare,
  cc.work_life_balance,
  cc.safety,
  cc.growth,
  cc.stability,
  COUNT(DISTINCT jo.id) as job_count,
  COUNT(DISTINCT cb.id) as benefit_count,
  COUNT(DISTINCT cr.id) as review_count
FROM companies c
LEFT JOIN company_stats cs ON c.id = cs.company_id
LEFT JOIN company_characteristics cc ON c.id = cc.company_id
LEFT JOIN job_openings jo ON c.id = jo.company_id AND jo.status = 'hiring'
LEFT JOIN company_benefits cb ON c.id = cb.company_id
LEFT JOIN company_reviews cr ON c.id = cr.company_id
GROUP BY c.id, c.name, c.english_name, c.logo_url, c.industry, c.location, 
         c.sector, c.is_popular_rank, c.description, c.business_process,
         cs.employees, cs.avg_salary, cs.established_year, cs.shift_system,
         cc.salary, cc.welfare, cc.work_life_balance, cc.safety, cc.growth, cc.stability;

-- 사용자 자격증 현황 (경로별)
CREATE OR REPLACE VIEW user_certification_progress AS
SELECT 
  cr.id as route_id,
  cr.title as route_title,
  uc.user_id,
  COUNT(DISTINCT cri.certification_id) as total_certifications,
  COUNT(DISTINCT CASE WHEN uc.status = 'acquired' THEN uc.certification_id END) as acquired_certifications,
  ROUND(COUNT(DISTINCT CASE WHEN uc.status = 'acquired' THEN uc.certification_id END)::numeric / 
        COUNT(DISTINCT cri.certification_id)::numeric * 100, 2) as progress_percentage
FROM certification_routes cr
LEFT JOIN certification_routes_items cri ON cr.id = cri.route_id
LEFT JOIN user_certifications uc ON cri.certification_id = uc.certification_id 
                                  AND uc.status = 'acquired'
GROUP BY cr.id, cr.title, uc.user_id;

-- 부문별 기업 통계
CREATE OR REPLACE VIEW sector_company_stats AS
SELECT 
  st.sector,
  st.english_name,
  st.outlook_status,
  COUNT(c.id) as company_count,
  COUNT(DISTINCT jo.id) as active_job_count,
  ROUND(AVG(cc.salary), 2) as avg_salary_score,
  ROUND(AVG(cc.welfare), 2) as avg_welfare_score,
  ROUND(AVG(cc.safety), 2) as avg_safety_score,
  ROUND(AVG(cc.stability), 2) as avg_stability_score
FROM sector_trends st
LEFT JOIN companies c ON c.sector = st.sector
LEFT JOIN company_characteristics cc ON c.id = cc.company_id
LEFT JOIN job_openings jo ON c.id = jo.company_id AND jo.status = 'hiring'
GROUP BY st.sector, st.english_name, st.outlook_status;

-- ============================================================
-- 저장 프로시저
-- ============================================================

-- 사용자 프로필 생성 (Supabase Auth 사용자가 가입할 때 호출)
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, created_at)
  VALUES (NEW.id, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거: auth.users에 새 사용자가 추가되면 users 테이블에도 추가
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- ============================================================
-- 마이그레이션 헬퍼 함수
-- ============================================================

-- mockData 데이터를 한꺼번에 삽입하는 함수 (개발용)
-- 실제 사용 시에는 CSV Import 또는 API를 권장합니다.
