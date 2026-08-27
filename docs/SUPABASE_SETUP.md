# Supabase 통합 가이드

## 1. Supabase 프로젝트 세팅

### 1.1 Supabase 계정 생성
1. [https://supabase.com](https://supabase.com) 접속
2. GitHub 또는 이메일로 가입
3. 새 프로젝트 생성

### 1.2 프로젝트 정보
```
Project Name: career-dashboard
Database Password: [강력한 비밀번호 설정]
Region: Asia Pacific (싱가포르)
Pricing Plan: Free 또는 Pro
```

### 1.3 프로젝트 URL 복사
프로젝트 Settings → API에서:
- **Project URL**: `https://your-project.supabase.co`
- **Public Anon Key**: `eyJhbGci...`
- **Service Role Secret**: (관리자용, 노출 금지)

---

## 2. 데이터베이스 스키마 초기화

### 2.1 SQL 스키마 실행
1. Supabase 대시보드 → SQL Editor
2. `supabase_schema.sql` 전체 복사
3. 붙여넣기 후 실행 (RUN 또는 Ctrl+Enter)

```sql
-- 기본 확장 활성화 (자동)
CREATE EXTENSION "uuid-ossp";
```

### 2.2 Authentication 설정
1. **Authentication** → **URL Configuration**
   - Site URL: `http://localhost:3002` (개발) / `https://yourdomain.com` (운영)
   - Redirect URLs: `http://localhost:3002/auth/callback`

2. **Providers** → **Email** 활성화 (기본)

3. **Email** 템플릿 커스터마이징 (선택사항)

---

## 3. React 클라이언트 설정

### 3.1 Supabase 클라이언트 라이브러리 설치
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-react
```

### 3.2 환경 변수 설정
`.env.local` 파일 생성:
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**주의**: 
- Anon Key만 클라이언트에 노출 (Public)
- Service Role Secret은 절대 노출하지 않기

### 3.3 Supabase 클라이언트 초기화
`src/lib/supabase.ts` 생성:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의를 위한 export
export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          // ... 나머지 필드
        };
        Insert: {
          id: string;
          name: string;
          // ...
        };
        Update: {
          // ...
        };
      };
      // ... 나머지 테이블
    };
  };
};
```

---

## 4. 데이터 마이그레이션

### 4.1 CSV로 데이터 임포트 (추천)

#### Step 1: mockData.ts를 CSV로 변환
`scripts/export-to-csv.js` 생성:

```javascript
import { COMPANIES_DATA, CERTIFICATIONS_DATA, SECTOR_TRENDS } from '../src/data/mockData.ts';
import { createObjectCsvWriter } from 'csv-writer';

// Companies CSV
const companiesWriter = createObjectCsvWriter({
  path: 'data/companies.csv',
  header: [
    { id: 'id', title: 'id' },
    { id: 'name', title: 'name' },
    { id: 'english_name', title: 'english_name' },
    { id: 'logo_url', title: 'logo_url' },
    { id: 'industry', title: 'industry' },
    { id: 'location', title: 'location' },
    { id: 'sector', title: 'sector' },
    { id: 'is_popular_rank', title: 'is_popular_rank' },
  ]
});

const companiesRecords = COMPANIES_DATA.map(c => ({
  id: c.id,
  name: c.name,
  english_name: c.englishName,
  logo_url: c.logo,
  industry: c.industry,
  location: c.location,
  sector: c.sector,
  is_popular_rank: c.isPopularRank || null,
}));

await companiesWriter.writeRecords(companiesRecords);
console.log('Companies CSV 생성 완료');
```

실행:
```bash
node scripts/export-to-csv.js
```

#### Step 2: Supabase에 CSV 임포트
1. 대시보드 → **SQL Editor**
2. 각 테이블별로 데이터 로드:
   - `data/companies.csv` → `companies` 테이블
   - `data/company_characteristics.csv` → `company_characteristics` 테이블
   - 등등...

또는 Supabase UI에서:
1. 각 테이블 클릭
2. **Import data** → CSV 파일 선택 → 매핑 확인 → Import

### 4.2 API를 통한 마이그레이션

`scripts/migrate-data.ts`:

```typescript
import { supabase } from '../src/lib/supabase';
import { COMPANIES_DATA, CERTIFICATIONS_DATA } from '../src/data/mockData';

async function migrateCompanies() {
  console.log('🔄 Companies 마이그레이션 시작...');
  
  const { data, error } = await supabase
    .from('companies')
    .insert(
      COMPANIES_DATA.map(c => ({
        id: c.id,
        name: c.name,
        english_name: c.englishName,
        logo_url: c.logo,
        industry: c.industry,
        industry_detail: c.industryDetail,
        location: c.location,
        sector: c.sector,
        is_popular_rank: c.isPopularRank || 0,
        description: c.description,
        business_process: c.businessProcess,
        openings_count: c.openingsCount,
      })),
      { count: 'exact' }
    );

  if (error) {
    console.error('❌ Companies 마이그레이션 실패:', error);
    return;
  }
  
  console.log(`✅ Companies ${data?.length || 0}개 저장 완료`);
}

async function migrateCharacteristics() {
  console.log('🔄 Characteristics 마이그레이션 시작...');
  
  const { data, error } = await supabase
    .from('company_characteristics')
    .insert(
      COMPANIES_DATA.map(c => ({
        company_id: c.id,
        salary: c.characteristics.salary,
        welfare: c.characteristics.welfare,
        work_life_balance: c.characteristics.workLifeBalance,
        safety: c.characteristics.safety,
        growth: c.characteristics.growth,
        stability: c.characteristics.stability,
      })),
      { count: 'exact' }
    );

  if (error) {
    console.error('❌ Characteristics 마이그레이션 실패:', error);
    return;
  }
  
  console.log(`✅ Characteristics ${data?.length || 0}개 저장 완료`);
}

// 전체 마이그레이션 실행
async function migrateAll() {
  try {
    await migrateCompanies();
    await migrateCharacteristics();
    // ... 나머지 테이블들
    console.log('✅ 전체 마이그레이션 완료!');
  } catch (err) {
    console.error('❌ 마이그레이션 중 오류:', err);
  }
}

migrateAll();
```

실행:
```bash
npx tsx scripts/migrate-data.ts
```

---

## 5. React 컴포넌트에서 Supabase 사용

### 5.1 데이터 조회
`src/hooks/useCompanies.ts`:

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Company } from '../types';

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select(`
            *,
            company_characteristics (*),
            company_stats (*),
            company_benefits (*),
            company_reviews (*),
            company_tags (tag)
          `)
          .order('is_popular_rank', { ascending: true, nullsLast: true });

        if (error) throw error;

        // API 응답을 Company 타입으로 변환
        const transformedData = data?.map(company => ({
          id: company.id,
          name: company.name,
          englishName: company.english_name,
          logo: company.logo_url,
          industry: company.industry,
          location: company.location,
          sector: company.sector,
          isPopularRank: company.is_popular_rank,
          characteristics: company.company_characteristics?.[0] || {},
          stats: company.company_stats?.[0] || {},
          benefits: company.company_benefits || [],
          reviews: company.company_reviews || [],
          tags: company.company_tags?.map(t => t.tag) || [],
          // ... 나머지 필드
        })) || [];

        setCompanies(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  return { companies, loading, error };
}
```

### 5.2 인증
`src/hooks/useAuth.ts`:

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return { user, loading, signUp, signIn, signOut };
}
```

### 5.3 실시간 구독 (선택)
```typescript
const { data: subscription } = supabase
  .channel('job_openings')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'job_openings' },
    (payload) => {
      console.log('채용공고 변경:', payload);
      // UI 업데이트
    }
  )
  .subscribe();
```

---

## 6. 배포

### 6.1 환경 변수 설정 (Vercel/Netlify)
1. 배포 플랫폼의 Environment Variables 설정
2. Supabase 프로젝트의 API 키 추가:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 6.2 Supabase 보안 설정
1. **Settings** → **Database** → **SSL enforcement** 활성화
2. **Policies** → RLS 정책 확인
3. **Logs** → 쿼리 성능 모니터링

---

## 7. 성능 최적화

### 7.1 쿼리 최적화
```typescript
// ❌ 비효율적
const { data } = await supabase.from('companies').select('*');
const allCharacteristics = data?.map(c => 
  supabase.from('company_characteristics').select('*').eq('company_id', c.id)
);

// ✅ 효율적 (조인 사용)
const { data } = await supabase
  .from('companies')
  .select(`
    *,
    company_characteristics (*),
    company_stats (*),
    company_benefits (*)
  `);
```

### 7.2 캐싱 전략
```typescript
const cacheKey = 'companies_popular';
const cached = localStorage.getItem(cacheKey);

if (cached) {
  setCompanies(JSON.parse(cached));
} else {
  const { data } = await supabase
    .from('companies')
    .select('*')
    .gt('is_popular_rank', 0);
  
  localStorage.setItem(cacheKey, JSON.stringify(data));
  setCompanies(data);
}
```

### 7.3 페이지네이션
```typescript
const pageSize = 20;
const page = 1;

const { data } = await supabase
  .from('companies')
  .select('*', { count: 'exact' })
  .range((page - 1) * pageSize, page * pageSize - 1);
```

---

## 8. 문제 해결

### 8.1 RLS 정책 오류
```
Error: new row violates row-level security policy
```
**해결**: RLS 정책 확인 및 사용자 ID 확인

### 8.2 CORS 오류
```
Access to XMLHttpRequest blocked by CORS policy
```
**해결**: Supabase Settings → API → CORS 허용 목록에 도메인 추가

### 8.3 인증 오류
```
Invalid or expired token
```
**해결**: 
- 토큰 만료 시간 확인
- JWT 시크릿 확인
- 환경 변수 다시 로드

---

## 9. 모니터링 및 유지보수

### 9.1 데이터베이스 백업
1. Supabase 대시보드 → **Settings** → **Backups**
2. 자동 백업 설정 (Pro 플랜)

### 9.2 사용량 모니터링
- Supabase Dashboard → **Usage**
- API 요청 수, 저장소 용량 확인

### 9.3 로그 확인
```sql
-- 최근 에러 쿼리
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%error%'
ORDER BY query_time DESC
LIMIT 10;
```

---

## 10. 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [JavaScript 클라이언트 라이브러리](https://supabase.com/docs/reference/javascript)
- [Database 가이드](https://supabase.com/docs/guides/database/overview)
- [React Auth 가이드](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
