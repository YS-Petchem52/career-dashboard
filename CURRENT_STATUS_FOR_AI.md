# Career Dashboard - 현재 프로젝트 전체 상태 (2026-08-27)

## 📋 프로젝트 개요
React + TypeScript + Vite 기반의 석유화학 기업 취업 정보/추천 앱
- 마이스터고 학생들을 위한 기업 및 채용 정보 제공
- 기업별 맞춤 추천 시스템
- 분야별 트렌드 분석

## ✅ 구현된 기능 목록

### 1️⃣ 기본 기능 (초기)
- ✅ 23개 기업 데이터베이스
- ✅ 채용공고 검색 및 필터링
- ✅ 기업 상세 정보 화면
- ✅ 지원서 작성 및 제출
- ✅ 북마크 및 팔로우 기능
- ✅ 알림 시스템

### 2️⃣ 기업 정보 확충 (Phase 1)
- ✅ 기업별 [인재상] 정의
- ✅ [합격가이드] (면접 준비 방법)
- ✅ 직원 후기 및 평가
- ✅ 모든 기업에 로고 URL 추가

### 3️⃣ 면접 준비 콘텐츠 (Phase 2)
- ✅ businessProcess 필드 추가
  - GS칼텍스, LG화학, 한화솔루션, 포스코퓨터엠, LG에너지솔루션
  - 공정 설명, 주요 설비, 면접 포인트 포함
- ✅ INTERVIEW_GUIDE.md 작성

### 4️⃣ 기업 추천 시스템 (Phase 3)
- ✅ RecommendationScreen 컴포넌트
- ✅ CompanyCharacteristics 인터페이스 추가
  - salary (1-5): 연봉 수준
  - welfare (1-5): 복지
  - workLifeBalance (1-5): 워라밸
  - safety (1-5): 안전
  - growth (1-5): 성장성
  - stability (1-5): 안정성
- ✅ sector 필드 추가 (정유, 석화, 가스, 배터리, 발전, 반도체, 기타)
- ✅ 모든 23개 기업에 sector + characteristics 추가
- ✅ 추천 알고리즘: 선택한 분야 × 선택한 특성 기반 매칭
- ✅ BottomNavBar에 🎯 추천 탭 추가

### 5️⃣ 분야별 트렌드 분석 (Phase 4) - 최신
- ✅ SectorTrend 인터페이스 정의
- ✅ TrendScreen 컴포넌트 구현
  - 6개 분야 카드 (정유, 석화, 가스, 배터리, 발전, 반도체)
  - 성장률순/분야명순 정렬
  - 확장형 카드로 상세 정보 표시
- ✅ 각 분야별 상세 데이터
  - 현재 상태, 시장 규모, 성장률
  - 주요 트렌드 (5개)
  - 기회 요인 & 도전 요인
  - 향후 전망
  - 핵심 기술 태그
  - 경력 기회
  - 필요 기술 (기술/소프트 스킬)
  - 연봉 & 채용 전망
- ✅ BottomNavBar에 📈 트렌드 탭 추가

## 📁 파일 구조

### 타입 정의 (src/types.ts)
```typescript
// CompanyCharacteristics: 기업별 특성 점수 (1-5)
// SectorTrend: 분야별 트렌드 분석 데이터
// Company: 기업 정보 (sector, characteristics, businessProcess 추가)
// JobOpening: 채용공고
// Review: 직원 후기
// NotificationItem: 알림
// ApplicationRecord: 지원 기록
```

### 데이터 (src/data/mockData.ts)
```typescript
// LOGO_URLS: 23개 기업 로고
// COMPANIES_DATA: 23개 기업 정보
//   - 모든 기업에 sector + characteristics 추가
//   - 5개 기업에 businessProcess 추가 (GS칼텍스, LG화학 등)
// JOB_OPENINGS_DATA: 채용공고 (10개)
// INITIAL_NOTIFICATIONS: 초기 알림
// INITIAL_APPLICATIONS: 초기 지원 기록
// SECTOR_TRENDS: 6개 분야 트렌드 데이터 (NEW)
```

### 컴포넌트 (src/components/)
```
Header.tsx                   - 상단 헤더 (메뉴, 알림 버튼)
BottomNavBar.tsx            - 하단 네비게이션 (5개 탭)
SidebarDrawer.tsx           - 슬라이드 메뉴
HomeScreen.tsx              - 홈 화면 (인기 기업, 추천 채용공고)
SearchScreen.tsx            - 검색 화면
CompanyDetailScreen.tsx     - 기업 상세 정보
MyPageScreen.tsx            - 마이페이지 (지원 기록, 북마크)
JobDetailModal.tsx          - 채용공고 상세 모달
ApplyModal.tsx              - 지원서 작성 모달
NotificationsModal.tsx      - 알림 목록 모달
RecommendationScreen.tsx    - 맞춤 기업 추천 (NEW)
TrendScreen.tsx             - 분야별 트렌드 분석 (NEW)
```

### 스타일
- Tailwind CSS 4.1.14
- 반응형 모바일 우선 디자인

## 🎯 주요 기능 설명

### 1. 기업 추천 (RecommendationScreen)
**사용자 선택:**
- 분야: 정유, 석화, 가스, 배터리, 발전, 반도체, 기타 (복수선택)
- 중요시 여기는 것: 연봉, 복지, 워라밸, 안전, 성장성, 안정성 (복수선택)

**추천 알고리즘:**
```
1. 선택한 분야에 해당하는 기업 필터링
2. 각 기업의 선택한 특성 평균점수 계산
3. 점수가 높은 순서대로 정렬
4. 결과 표시 (상위 3개는 특성별 점수 막대 표시)
```

### 2. 분야별 트렌드 (TrendScreen)
**6개 분야 분석:**

| 분야 | 성장률 | 시장규모 | 특징 |
|------|--------|---------|------|
| 배터리 | 15-25% | 1,200조(2030) | 초대 수요, 높은 연봉 |
| 반도체 | 5-8% | 600조 | AI 칩 중심, 최고 연봉 |
| 정유 | 1-2% | 800조 | 수소 전환, 규모 축소 |
| 석화 | 1-3% | 600조 | 고부가가치화, R&D 기회 |
| 발전 | 2-3% | 500조 | 재생에너지, 구조 재편 |
| 가스 | 0-2% | 300조 | 안정적, 성장성 제한 |

**각 분야별 정보:**
- 현재 상태 & 시장 규모
- 주요 트렌드 (최대 5개)
- 기회 요인 (최대 3개)
- 도전 요인 (최대 3개)
- 향후 전망
- 핵심 기술 (태그)
- 경력 기회 (태그)
- 필요 기술 (기술/소프트 스킬 분류)
- 연봉 트렌드
- 채용 전망

## 📊 23개 기업 현황

### Rank 1-5 (대형 정유·화학)
1. GS칼텍스 - 정유, 초봉 5천만원대
2. LG화학 - 석화, 초봉 5천만원대
3. 한화솔루션 - 석화, 초봉 5천만원대
4. 포스코퓨터엠 - 배터리, 초봉 5천만원대
5. LG에너지솔루션 - 배터리, 초봉 5천만원대

### Rank 6-10 (중형 정유·화학)
6. S-Oil - 정유, 초봉 3천만원대
7. 현대오일뱅크 - 정유, 초봉 3천만원대
8. SK이노베이션 - 석화, 초봉 4천만원대
9. YNCC - 석화, 초봉 3천만원대
10. 롯데케미칼 - 석화, 초봉 3천만원대

### Rank 11-15 (발전·가스)
11. 한국가스공사 - 가스, 초봉 4천만원대
12-16. 5개 발전사 (남부/남동/서부/중부/동서) - 발전, 초봉 3천만원대

### Rank 17-23 (에너지·기타)
17. 한국석유공사 - 정유, 초봉 3천만원대
18. 한전KPS - 발전, 초봉 3천만원대
19. 앰코테크놀로지 - 반도체, 초봉 4천만원대
20. MTS CORPORATION - 기타, 초봉 3천만원대
21. 도로공사 - 기타, 초봉 3천만원대
22. E1 - 기타, 초봉 3천만원대
23. 한국바스프 - 석화, 초봉 4천만원대

## 🔧 네비게이션 구조

### BottomNavBar (5개 탭)
1. **Home (홈)** - 인기 기업, 추천 채용공고
2. **Search (검색)** - 기업/채용공고 검색
3. **🎯 추천** - 맞춤 기업 추천
4. **📈 트렌드** - 분야별 산업 분석 (NEW)
5. **My Page** - 지원 기록, 북마크

## 🚀 기술 스택
- React 19.0.1 (TypeScript)
- Vite 6.4.3
- Tailwind CSS 4.1.14
- lucide-react (아이콘)
- Node.js npm 11.19.0

## 📦 빌드 & 배포
```bash
npm install          # 214개 패키지
npm run lint        # TypeScript 검사 ✅
npm run build       # dist/ 생성 (dist/index-*.js 335KB → gzip 98KB)
npm run dev         # http://localhost:3002
```

## 🔗 GitHub
- Repository: https://github.com/YS-Petchem52/career-dashboard.git
- 최신 커밋: 82dc8e2 (분야별 트렌드 기능 추가)

## 🎯 향후 계획
- [ ] 더 많은 기업 추가 (50+개로 확대)
- [ ] 모든 기업의 businessProcess 상세 기술
- [ ] CompanyDetailScreen에서 businessProcess 시각화
- [ ] 사용자별 맞춤 알림 (지원한 기업 소식)
- [ ] 직원 후기 작성 기능
- [ ] 채용공고 자동 업데이트
- [ ] PWA화 (오프라인 지원)

---

**작성일**: 2026-08-27  
**최신 상태**: 트렌드 분석 기능 완성, GitHub 동기화 완료
