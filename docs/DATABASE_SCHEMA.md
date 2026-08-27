# Career Dashboard - Supabase 데이터베이스 스키마

## 개요
석화고 취업길잡이 서비스의 데이터베이스 설계 문서입니다. Supabase PostgreSQL을 기반으로 합니다.

---

## 1. 테이블 구조

### 1.1 Companies (기업)
**설명**: 채용을 진행 중인 모든 기업 정보

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | TEXT | PK | 기업 고유 ID (예: 'gs-caltex') |
| name | TEXT | NOT NULL | 기업 한글명 (예: 'GS칼텍스') |
| english_name | TEXT | | 기업 영문명 |
| logo_url | TEXT | | 로고 이미지 URL |
| industry | TEXT | NOT NULL | 산업군 (예: '정유 · 석유화학') |
| industry_detail | TEXT | | 상세 산업 분류 |
| location | TEXT | | 근무지 (예: '전남 여수시') |
| sector | TEXT | | 부문 (정유/석화/가스/배터리/발전/반도체/기타) |
| is_popular_rank | INT | | 주목할만한 기업 순위 (1-23, 0=미포함) |
| description | TEXT | | 기업 소개 (인재상, 합격가이드 포함) |
| business_process | TEXT | | 사업 내용 및 공정 설명 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일시 |

**인덱스**:
- `idx_companies_sector` on `sector`
- `idx_companies_is_popular_rank` on `is_popular_rank`

---

### 1.2 Company_Characteristics (기업 특성 점수)
**설명**: 각 기업의 특성별 점수 (1-5점)

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| company_id | TEXT | FK -> companies(id) | 기업 ID |
| salary | INT | CHECK (1-5) | 연봉 점수 |
| welfare | INT | CHECK (1-5) | 복지 점수 |
| work_life_balance | INT | CHECK (1-5) | 일과삶의균형 점수 |
| safety | INT | CHECK (1-5) | 안전 점수 |
| growth | INT | CHECK (1-5) | 성장성 점수 |
| stability | INT | CHECK (1-5) | 안정성 점수 |

**관계**: Companies (1:1)

---

### 1.3 Company_Stats (기업 통계)
**설명**: 기업 규모 및 처우 정보

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| company_id | TEXT | FK -> companies(id) | 기업 ID |
| employees | TEXT | | 직원수 (예: '2,500명+') |
| avg_salary | TEXT | | 평균 연봉 (예: '1.2억+') |
| established_year | TEXT | | 설립년도 |
| shift_system | TEXT | | 근무제 (4조 3교대 등) |

**관계**: Companies (1:1)

---

### 1.4 Company_Benefits (기업 복리후생)
**설명**: 기업별 복리후생 항목

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| company_id | TEXT | FK -> companies(id) | 기업 ID |
| icon | TEXT | | 아이콘 타입 |
| title | TEXT | NOT NULL | 복지 항목명 |
| description | TEXT | | 상세 설명 |
| order_index | INT | | 표시 순서 |

**관계**: Companies (1:N)

---

### 1.5 Company_Reviews (기업 평가)
**설명**: 기업에 대한 직원 평가 및 후기

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| company_id | TEXT | FK -> companies(id) | 기업 ID |
| rating | DECIMAL | CHECK (0-5) | 평점 |
| date | TEXT | | 작성 날짜 (예: '2023.10.12') |
| role | TEXT | | 작성자 직책 |
| title | TEXT | NOT NULL | 제목 |
| content | TEXT | | 내용 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

**관계**: Companies (1:N)

---

### 1.6 Company_Tags (기업 태그)
**설명**: 기업별 태그 (카테고리 분류)

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| company_id | TEXT | FK -> companies(id) | 기업 ID |
| tag | TEXT | NOT NULL | 태그명 |
| order_index | INT | | 표시 순서 |

**관계**: Companies (1:N)

---

### 1.7 Job_Openings (채용공고)
**설명**: 기업별 채용공고

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | TEXT | PK | 채용공고 고유 ID |
| company_id | TEXT | FK -> companies(id) | 기업 ID |
| company_name | TEXT | NOT NULL | 기업명 |
| title | TEXT | NOT NULL | 직무명 |
| korean_title | TEXT | | 한글 직무명 |
| location | TEXT | | 근무지 |
| education_req | TEXT | | 학력 요구사항 |
| category | TEXT | | 직무 카테고리 |
| salary_guide | TEXT | | 연봉 안내 |
| work_schedule | TEXT | | 근무 시간표 |
| description | TEXT | | 공고 상세 설명 |
| status | TEXT | | 채용 상태 (hiring/closed) |
| d_day | TEXT | | D-Day |
| is_meister_recommended | BOOLEAN | | 마이스터고 추천 여부 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일시 |

**관계**: Companies (N:1)

---

### 1.8 Job_Requirements (직무 요구사항)
**설명**: 채용공고별 요구사항 항목

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| job_opening_id | TEXT | FK -> job_openings(id) | 채용공고 ID |
| requirement | TEXT | NOT NULL | 요구사항 |
| order_index | INT | | 표시 순서 |

**관계**: Job_Openings (1:N)

---

### 1.9 Job_Responsibilities (직무 책임)
**설명**: 채용공고별 직무 책임 항목

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| job_opening_id | TEXT | FK -> job_openings(id) | 채용공고 ID |
| responsibility | TEXT | NOT NULL | 책임/업무 내용 |
| order_index | INT | | 표시 순서 |

**관계**: Job_Openings (1:N)

---

### 1.10 Sector_Trends (부문 트렌드)
**설명**: 산업 부문별 트렌드 및 전망

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| sector | TEXT | NOT NULL UNIQUE | 부문명 (정유/석화/가스 등) |
| english_name | TEXT | | 영문명 |
| icon | TEXT | | 아이콘 |
| current_status | TEXT | | 현재 상황 설명 |
| market_size | TEXT | | 시장 규모 |
| growth_rate | TEXT | | 성장률 |
| outlook_status | TEXT | CHECK (positive/neutral/caution) | 전망 상태 |
| future_outlook | TEXT | | 미래 전망 설명 |
| salary_trend | TEXT | | 연봉 추이 |
| job_outlook | TEXT | | 일자리 전망 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일시 |

**인덱스**:
- `idx_sector_trends_sector` on `sector`

---

### 1.11 Sector_Trends_Items (트렌드 항목)
**설명**: 부문별 트렌드/기회/과제 항목 (동적 배열 대신 테이블화)

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| sector_id | UUID | FK -> sector_trends(id) | 부문 ID |
| item_type | TEXT | CHECK (trends/opportunities/challenges/technologies) | 항목 타입 |
| content | TEXT | NOT NULL | 내용 |
| order_index | INT | | 표시 순서 |

**관계**: Sector_Trends (1:N)

---

### 1.12 Certifications (자격증)
**설명**: 취업 관련 자격증 목록

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | TEXT | PK | 자격증 고유 ID (예: 'cert-1') |
| name | TEXT | NOT NULL | 자격증명 |
| category | TEXT | | 카테고리 |
| issuer | TEXT | | 발급기관 |
| difficulty | TEXT | CHECK (easy/medium/hard) | 난이도 |
| test_type | TEXT | CHECK (practical/written) | 시험 유형 (실기/필기) |
| passing_rate | TEXT | | 합격률 |
| exam_fee | TEXT | | 시험 응시료 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

**인덱스**:
- `idx_certifications_test_type` on `test_type`

---

### 1.13 Certification_Relevant_Fields (자격증 관련 분야)
**설명**: 각 자격증의 관련 분야/직무

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| certification_id | TEXT | FK -> certifications(id) | 자격증 ID |
| field | TEXT | NOT NULL | 관련 분야 |
| order_index | INT | | 표시 순서 |

**관계**: Certifications (1:N)

---

### 1.14 User_Certifications (사용자 자격증)
**설명**: 학생이 취득한 또는 계획 중인 자격증

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| user_id | UUID | FK -> auth.users(id) | 사용자 ID |
| certification_id | TEXT | FK -> certifications(id) | 자격증 ID |
| certification_name | TEXT | | 자격증명 |
| status | TEXT | CHECK (acquired/scheduled) | 상태 (취득/계획) |
| acquired_date | DATE | | 취득 날짜 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

**관계**: Certifications (N:1)

---

### 1.15 Certification_Routes (자격증 취득 경로)
**설명**: 추천 자격증 취득 로드맵

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | TEXT | PK | 경로 고유 ID |
| title | TEXT | NOT NULL | 경로 제목 |
| description | TEXT | | 설명 |
| estimated_duration | TEXT | | 예상 기간 |
| difficulty | TEXT | | 난이도 |
| priority | INT | | 우선순위 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

---

### 1.16 Certification_Routes_Items (경로별 자격증)
**설명**: 각 경로에 포함된 자격증

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| route_id | TEXT | FK -> certification_routes(id) | 경로 ID |
| certification_id | TEXT | FK -> certifications(id) | 자격증 ID |
| order_index | INT | | 순서 |

**관계**: 
- Certification_Routes (1:N)
- Certifications (N:1)

---

### 1.17 Certification_Routes_Target_Sectors (경로별 대상 부문)
**설명**: 각 경로가 대상으로 하는 산업 부문

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| route_id | TEXT | FK -> certification_routes(id) | 경로 ID |
| sector | TEXT | | 부문명 |

**관계**: Certification_Routes (1:N)

---

### 1.18 Users (사용자 프로필)
**설명**: 앱 사용자(학생) 정보

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | Supabase Auth User ID |
| name | TEXT | | 학생명 |
| class_info | TEXT | | 학년/학과 (예: '공정운전과 2학년') |
| graduation_date | DATE | | 졸업예정일 (예: 2028-02-28) |
| avatar_text | TEXT | | 아바타 텍스트 (성의 한 글자) |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일시 |

---

### 1.19 User_Bookmarks (북마크)
**설명**: 사용자가 북마크한 채용공고

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| user_id | UUID | FK -> users(id) | 사용자 ID |
| job_opening_id | TEXT | FK -> job_openings(id) | 채용공고 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

**제약**: UNIQUE(user_id, job_opening_id)

---

### 1.20 User_Followed_Companies (팔로우 회사)
**설명**: 사용자가 팔로우한 기업

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| user_id | UUID | FK -> users(id) | 사용자 ID |
| company_id | TEXT | FK -> companies(id) | 기업 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

**제약**: UNIQUE(user_id, company_id)

---

### 1.21 Application_Records (지원 현황)
**설명**: 사용자의 채용공고 지원 현황

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| user_id | UUID | FK -> users(id) | 사용자 ID |
| job_opening_id | TEXT | FK -> job_openings(id) | 채용공고 ID |
| company_name | TEXT | | 기업명 |
| position | TEXT | | 직무명 |
| status | TEXT | CHECK (applied/pass/fail/interview) | 상태 |
| applied_date | DATE | | 지원일 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일시 |

---

### 1.22 Notifications (알림)
**설명**: 앱 알림 메시지

**필드**:
| 필드명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | UUID | PK | |
| user_id | UUID | FK -> users(id) | 사용자 ID |
| title | TEXT | NOT NULL | 알림 제목 |
| message | TEXT | | 알림 내용 |
| notification_type | TEXT | | 알림 유형 (job/company/cert 등) |
| related_id | TEXT | | 관련 데이터 ID |
| is_read | BOOLEAN | DEFAULT FALSE | 읽음 여부 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |

**인덱스**:
- `idx_notifications_user_id_created_at` on `(user_id, created_at DESC)`

---

## 2. 테이블 관계도 (ERD)

```
Companies
  ├─ (1:1) Company_Characteristics
  ├─ (1:1) Company_Stats
  ├─ (1:N) Company_Benefits
  ├─ (1:N) Company_Reviews
  ├─ (1:N) Company_Tags
  └─ (1:N) Job_Openings
       ├─ (1:N) Job_Requirements
       └─ (1:N) Job_Responsibilities

Sector_Trends
  └─ (1:N) Sector_Trends_Items

Certifications
  ├─ (1:N) Certification_Relevant_Fields
  └─ (N:M) Certification_Routes_Items ← Certification_Routes

Users
  ├─ (1:N) User_Certifications → Certifications
  ├─ (1:N) User_Bookmarks → Job_Openings
  ├─ (1:N) User_Followed_Companies → Companies
  ├─ (1:N) Application_Records → Job_Openings
  └─ (1:N) Notifications
```

---

## 3. 주요 쿼리 예시

### 추천 시스템
```sql
-- 사용자 선택 특성과 매칭되는 기업
SELECT c.id, c.name, c.logo_url,
       AVG((cc.salary + cc.welfare + cc.work_life_balance + 
            cc.safety + cc.growth + cc.stability) / 6.0) as avg_score
FROM companies c
JOIN company_characteristics cc ON c.id = cc.company_id
WHERE c.sector = :selected_sector
GROUP BY c.id, c.name, c.logo_url
ORDER BY avg_score DESC;
```

### 부문 분석
```sql
-- 부문별 트렌드 및 기업
SELECT st.sector, st.outlook_status, COUNT(c.id) as company_count,
       AVG(cc.salary) as avg_salary_score
FROM sector_trends st
LEFT JOIN companies c ON c.sector = st.sector
LEFT JOIN company_characteristics cc ON c.id = cc.company_id
GROUP BY st.sector, st.outlook_status;
```

### 자격증 경로 진행률
```sql
-- 사용자의 자격증 경로 완료도
SELECT cr.id, cr.title, 
       COUNT(DISTINCT cri.certification_id) as total_certs,
       COUNT(DISTINCT CASE WHEN uc.status = 'acquired' THEN cri.certification_id END) as acquired_certs
FROM certification_routes cr
JOIN certification_routes_items cri ON cr.id = cri.route_id
LEFT JOIN user_certifications uc ON cri.certification_id = uc.certification_id 
                                AND uc.user_id = :user_id
GROUP BY cr.id, cr.title;
```

---

## 4. 성능 최적화

### 추천 인덱스
```sql
-- 빈번한 쿼리
CREATE INDEX idx_companies_sector_popular ON companies(sector, is_popular_rank);
CREATE INDEX idx_job_openings_company ON job_openings(company_id);
CREATE INDEX idx_user_cert_user ON user_certifications(user_id, status);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
```

### RLS (Row Level Security) 정책
- `users` 테이블: 사용자는 자신의 레코드만 접근
- `user_certifications`: 사용자는 자신의 자격증 정보만 접근
- `user_bookmarks`: 사용자는 자신의 북마크만 접근
- `application_records`: 사용자는 자신의 지원 현황만 접근
- `notifications`: 사용자는 자신의 알림만 접근

---

## 5. 마이그레이션 전략

### Phase 1: 핵심 테이블 (1주차)
- Companies, Company_Characteristics, Company_Stats
- Sector_Trends
- Job_Openings

### Phase 2: 부가 테이블 (2주차)
- Company_Benefits, Company_Reviews, Company_Tags
- Job_Requirements, Job_Responsibilities
- Sector_Trends_Items

### Phase 3: 사용자 기능 (3주차)
- Users, User_Certifications
- User_Bookmarks, User_Followed_Companies
- Application_Records, Notifications
- Certifications, Certification_Routes

---

## 6. 데이터 마이그레이션

기존 mockData.ts의 데이터를 Supabase로 이전하려면:

1. **데이터 추출**: mockData.ts에서 JSON 형식으로 추출
2. **CSV 변환**: 각 테이블별 CSV 생성
3. **Bulk Insert**: Supabase CSV Import 또는 API 사용
4. **검증**: 데이터 무결성 확인

---

## 7. 보안 고려사항

- ✅ RLS (Row Level Security) 활성화
- ✅ API 인증 (Supabase Auth)
- ✅ 민감 정보 암호화 (해당 시 구현)
- ✅ Rate Limiting 설정
- ✅ 감사 로그 (created_at, updated_at)
