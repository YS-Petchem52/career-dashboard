# 📱 Career Dashboard - 핵심 코드 전체 (Google AI Studio용)

## 🏗️ 아키텍처 개요
```
App.tsx (루트)
├── Header (상단)
├── Main Content (activeTab에 따라 변환)
│   ├── HomeScreen (홈)
│   ├── SearchScreen (검색)
│   ├── RecommendationScreen (추천) ← NEW
│   ├── TrendScreen (트렌드) ← NEW
│   ├── MyPageScreen (마이페이지)
│   └── CompanyDetailScreen (기업 상세)
├── BottomNavBar (하단 네비게이션)
├── SidebarDrawer (슬라이드 메뉴)
├── Modal 컴포넌트들
│   ├── JobDetailModal
│   ├── ApplyModal
│   └── NotificationsModal
└── 상태 관리
    ├── activeTab (현재 탭)
    ├── selectedCompanyId (선택된 기업)
    ├── applications (지원 기록)
    ├── bookmarkedJobIds (북마크)
    └── followedCompanyIds (팔로우)
```

---

## 📝 타입 정의 (src/types.ts)

```typescript
// ===== 기업 특성 점수 (1-5) =====
export interface CompanyCharacteristics {
  salary: number;           // 1-5: 연봉 수준
  welfare: number;          // 1-5: 복지
  workLifeBalance: number;  // 1-5: 워라밸
  safety: number;           // 1-5: 안전
  growth: number;           // 1-5: 성장성
  stability: number;        // 1-5: 안정성
}

// ===== 분야별 트렌드 분석 (NEW) =====
export interface SectorTrend {
  sector: string;              // '정유', '석화', '가스', '배터리', '발전', '반도체'
  englishName: string;         // 'Refining', 'Petrochemical' 등
  icon: string;                // 이모지 (🛢️ 🧪 ⛽ 🔋 ⚡ 🔌)
  currentStatus: string;       // 현재 시장 상태
  marketSize: string;          // '약 600조 원대'
  growthRate: string;          // '연평균 15-25%'
  trends: string[];            // 주요 트렌드 (5개)
  opportunities: string[];     // 기회 요인
  challenges: string[];        // 도전 요인
  futureOutlook: string;       // 향후 전망 (3-4문장)
  keyTechnologies: string[];   // 핵심 기술 (4-5개)
  careerOpportunities: string[]; // 경력 기회 (4-5개)
  skillDemand: {
    technical: string[];       // 기술 스킬 (4-5개)
    soft: string[];           // 소프트 스킬 (4-5개)
  };
  salaryTrend: string;         // 연봉 트렌드 및 추가 수당
  jobOutlook: string;          // 채용 전망
}

// ===== 기업 정보 =====
export interface Company {
  id: string;
  name: string;
  englishName?: string;
  logo: string;
  industry: string;
  industryDetail: string;
  tags: string[];
  location: string;
  isPopularRank?: number;      // 순위 (1-23)
  description: string;         // '[인재상] ... [합격가이드] ...'
  businessProcess?: string;    // 사업/공정 상세 설명 (NEW)
  sector?: string;             // 분야: '정유', '석화', '가스', '배터리', '발전', '반도체', '기타'
  characteristics?: CompanyCharacteristics; // 특성 점수
  stats: {
    employees: string;
    avgSalary: string;
    establishedYear: string;
    shiftSystem: string;
  };
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  reviews: Review[];
  openingsCount?: number;
}

// ===== 기타 타입 =====
export interface Review {
  id: string;
  rating: number;
  date: string;
  role: string;
  title: string;
  content: string;
}

export interface JobOpening {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  koreanTitle?: string;
  englishTitle?: string;
  location: string;
  educationReq: string;
  status: 'hiring' | 'ongoing' | 'closed';
  dDay: string;
  tags: string[];
  category: 'process' | 'maintenance' | 'electrical' | 'safety' | 'qa' | 'dev' | 'design' | 'strategy';
  salaryGuide?: string;
  workSchedule?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  preferred?: string[];
  isMeisterRecommended?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type: 'job' | 'system' | 'deadline';
  companyName?: string;
  jobId?: string;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  appliedDate: string;
  status: string;
  applicantName: string;
  school: string;
}
```

---

## 🎯 RecommendationScreen.tsx (추천 기능)

```typescript
import React, { useState, useMemo } from 'react';
import { Company } from '../types';
import { BarChart3, ChevronDown, TrendingUp, X } from 'lucide-react';

interface RecommendationScreenProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

const SECTORS = ['정유', '석화', '가스', '배터리', '발전', '반도체', '기타'];
const CHARACTERISTICS = ['연봉', '복지', '워라밸', '안전', '성장성', '안정성'];
const CHARACTERISTIC_KEYS = [
  'salary',
  'welfare',
  'workLifeBalance',
  'safety',
  'growth',
  'stability',
] as const;

export default function RecommendationScreen({
  companies,
  onSelectCompany,
}: RecommendationScreenProps) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['배터리', '반도체']);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>(['연봉']);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // 분야 토글
  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  // 특성 토글
  const toggleCharacteristic = (char: string) => {
    setSelectedCharacteristics((prev) =>
      prev.includes(char) ? prev.filter((c) => c !== char) : [...prev, char]
    );
  };

  // 추천 계산
  const recommendedCompanies = useMemo(() => {
    if (!showRecommendations || selectedSectors.length === 0 || selectedCharacteristics.length === 0) {
      return [];
    }

    return companies
      .filter((company) => selectedSectors.includes(company.sector || ''))
      .map((company) => {
        const scores = selectedCharacteristics.map((char) => {
          const charIdx = CHARACTERISTICS.indexOf(char);
          return company.characteristics?.[CHARACTERISTIC_KEYS[charIdx]] ?? 0;
        });
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        return {
          company,
          avgScore,
          scores: CHARACTERISTIC_KEYS.map((key, idx) => ({
            name: CHARACTERISTICS[idx],
            value: company.characteristics?.[key] ?? 0,
            isSelected: selectedCharacteristics.includes(CHARACTERISTICS[idx]),
          })),
        };
      })
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [companies, selectedSectors, selectedCharacteristics, showRecommendations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 py-4">
        <h1 className="text-2xl font-bold text-slate-900">맞춤 기업 추천</h1>
        <p className="text-sm text-slate-600 mt-1">당신의 우선순위에 맞는 기업을 찾아보세요</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 분야 선택 */}
        <div>
          <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span>📍 관심 분야</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {selectedSectors.length}개 선택
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((sector) => (
              <button
                key={sector}
                onClick={() => toggleSector(sector)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSectors.includes(sector)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        {/* 특성 선택 */}
        <div>
          <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span>⭐ 중요한 조건</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              {selectedCharacteristics.length}개 선택
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {CHARACTERISTICS.map((char) => (
              <button
                key={char}
                onClick={() => toggleCharacteristic(char)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCharacteristics.includes(char)
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* 추천 버튼 */}
        <button
          onClick={() => setShowRecommendations(true)}
          disabled={selectedSectors.length === 0 || selectedCharacteristics.length === 0}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
            selectedSectors.length === 0 || selectedCharacteristics.length === 0
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg'
          }`}
        >
          맞춤 기업 추천받기 ✨
        </button>
      </div>

      {/* 추천 결과 */}
      {showRecommendations && (
        <div className="px-4 pb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" />
            추천 기업 ({recommendedCompanies.length}개)
          </h2>

          {recommendedCompanies.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <p className="text-slate-600">조건에 맞는 기업이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendedCompanies.map((item, idx) => (
                <div
                  key={item.company.id}
                  onClick={() => onSelectCompany(item.company)}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-lg hover:border-blue-400 cursor-pointer transition-all"
                >
                  {/* Rank & Score */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.company.logo}
                        alt={item.company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm text-slate-600">#{idx + 1}</p>
                        <h3 className="font-bold text-slate-900">{item.company.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{item.avgScore.toFixed(1)}</p>
                      <p className="text-xs text-slate-600">점수</p>
                    </div>
                  </div>

                  {/* Score Bars (Top 3만) */}
                  <div className="space-y-2">
                    {item.scores.slice(0, 3).map((score) => (
                      <div key={score.name} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600 w-14">{score.name}</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-full rounded-full ${
                              score.value >= 4 ? 'bg-green-500' : score.value >= 3 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${(score.value / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-900 w-6 text-right">
                          {score.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Sector Tag */}
                  <div className="mt-3">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {item.company.sector}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 📈 TrendScreen.tsx (트렌드 기능)

**주요 기능:**
- 6개 분야별 카드 (성장률순/분야명순 정렬)
- 확장형 카드로 상세 정보 표시
- 트렌드, 기회, 도전 요인 시각화
- 기술 스킬/소프트 스킬 분류
- 연봉 & 채용 전망 표시

**구조:**
```
TrendScreen
├── Header (정렬 옵션: 성장률순/분야명순)
└── Trend Cards (반복)
    ├── Collapsed Header (분야명, 성장률, 현재상태)
    └── Expanded Content (클릭 시)
        ├── 시장 규모 & 성장률
        ├── 주요 트렌드 (최대 4개)
        ├── 기회 요인 (최대 3개)
        ├── 도전 요인 (최대 3개)
        ├── 향후 전망
        ├── 핵심 기술 (태그)
        ├── 경력 기회 (태그)
        ├── 필요 기술 (기술/소프트스킬)
        └── 연봉 & 채용 전망
```

---

## 📊 SECTOR_TRENDS 데이터 구조

```typescript
SECTOR_TRENDS = [
  {
    sector: '배터리',
    englishName: 'Secondary Battery',
    icon: '🔋',
    currentStatus: '글로벌 EV 시장 폭발적 성장...',
    marketSize: '약 1,200조 원대 (2030년 예상)',
    growthRate: '연평균 15-25% 고속 성장',
    trends: [
      '고에너지 밀도 고니켈 배터리 개발',
      'Solid-State Battery 상용화 추진',
      '배터리 재활용 기술 고도화',
      '미국 EU의 공급망 현지화 요구',
      '셀부터 팩까지 통합 솔루션'
    ],
    opportunities: [...],  // 4-5개
    challenges: [...],     // 4-5개
    futureOutlook: '2030년 배터리 산업은 한국 GDP의 3-4%를...',
    keyTechnologies: [...], // 4-5개 (태그)
    careerOpportunities: [...], // 4-5개 (태그)
    skillDemand: {
      technical: [...],    // 4-5개
      soft: [...]         // 4-5개
    },
    salaryTrend: '초봉 5,500~7,500만 원대...',
    jobOutlook: '2026-2030년 연 25-35% 고속 채용...'
  },
  // ... 반도체, 정유, 석화, 발전, 가스
]
```

---

## 🔄 App.tsx (라우팅 로직)

```typescript
const handleTabChange = (tab: TabType) => {
  setActiveTab(tab);
};

// Main render logic
<main className="flex-1">
  {selectedCompanyId && activeCompany ? (
    <CompanyDetailScreen {...props} />
  ) : activeTab === 'home' ? (
    <HomeScreen {...props} />
  ) : activeTab === 'search' ? (
    <SearchScreen {...props} />
  ) : activeTab === 'recommendation' ? (
    <RecommendationScreen
      companies={COMPANIES_DATA}
      onSelectCompany={(company) => setSelectedCompanyId(company.id)}
    />
  ) : activeTab === 'trend' ? (
    <TrendScreen trends={SECTOR_TRENDS} />  // ← NEW
  ) : (
    <MyPageScreen {...props} />
  )}
</main>
```

---

## 🎨 BottomNavBar.tsx (네비게이션)

```typescript
export type TabType = 'home' | 'search' | 'recommendation' | 'trend' | 'mypage';

// 5개 탭 버튼:
1. home      → HomeScreen
2. search    → SearchScreen
3. recommendation (🎯) → RecommendationScreen
4. trend (📈)   → TrendScreen  ← NEW
5. mypage    → MyPageScreen
```

---

## 📦 mockData.ts (데이터)

**기업 데이터 23개 예시:**
```typescript
{
  id: 'posco-future-m',
  name: '포스코퓨터엠',
  sector: '배터리',
  characteristics: {
    salary: 4,
    welfare: 4,
    workLifeBalance: 3,
    safety: 5,
    growth: 5,
    stability: 4
  },
  businessProcess: '하이니켈 NCM 양극재 소성로...',
  description: '[인재상]... [합격가이드]...'
}
```

---

## 🧪 테스트 체크리스트

### RecommendationScreen
- [ ] 분야 선택/해제 정상 작동
- [ ] 특성 선택/해제 정상 작동
- [ ] "맞춤 추천받기" 클릭 → 결과 표시
- [ ] 추천 결과 클릭 → 기업 상세화면 이동
- [ ] 점수 계산 정확성 (평균값)
- [ ] 순위 정렬 (높은 점수순)

### TrendScreen
- [ ] 카드 클릭/확장 정상 작동
- [ ] 성장률순 정렬 (배터리 > 반도체 > ...)
- [ ] 분야명순 정렬 (가나다)
- [ ] 모든 분야의 데이터 표시
- [ ] 태그/특성 시각화 정상
- [ ] 스크롤 성능

---

## 🚀 배포 확인

```bash
# 빌드 성공
npm run build
# dist/index-*.js: 335KB → gzip 98KB

# 타입 검사 성공
npm run lint
# 0 에러

# 개발 서버 실행
npm run dev
# http://localhost:3002

# GitHub 푸시 완료
git push origin main
# Commit: 82dc8e2
```

---

**업데이트**: 2026-08-27  
**최신 기능**: TrendScreen (분야별 산업 트렌드 분석)  
**다음 단계**: CompanyDetailScreen에 businessProcess 시각화
