export interface CompanyCharacteristics {
  salary: number; // 1-5: 연봉 수준
  welfare: number; // 1-5: 복지
  workLifeBalance: number; // 1-5: 워라밸
  safety: number; // 1-5: 안전
  growth: number; // 1-5: 성장성
  stability: number; // 1-5: 안정성
}

export interface SectorTrend {
  sector: string; // '정유', '석화', '가스', '배터리', '발전' 등
  englishName: string;
  icon: string;
  currentStatus: string; // 현재 상태 요약
  marketSize: string; // 시장 규모
  growthRate: string; // 성장률
  trends: string[]; // 주요 트렌드 (배열)
  opportunities: string[]; // 기회 요인
  challenges: string[]; // 도전 요인
  futureOutlook: string; // 향후 전망
  keyTechnologies: string[]; // 핵심 기술
  careerOpportunities: string[]; // 경력 기회
  skillDemand: {
    technical: string[];
    soft: string[];
  };
  salaryTrend: string; // 연봉 트렌드
  jobOutlook: string; // 채용 전망
}

export interface Company {
  id: string;
  name: string;
  englishName?: string;
  logo: string;
  industry: string;
  industryDetail: string;
  tags: string[];
  location: string;
  isPopularRank?: number;
  description: string;
  businessProcess?: string; // 사업/공정 상세 설명
  sector?: string; // 세부 분야: '정유', '석화', '가스', '배터리', '발전' 등
  characteristics?: CompanyCharacteristics; // 추천 특성
  stats: {
    employees: string;
    avgSalary: string;
    establishedYear: string;
    shiftSystem: string;
  };
  benefits: {
    icon: string;
    title: string;
    description: string;
  }[];
  reviews: Review[];
  openingsCount?: number;
}

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
  educationReq: string; // e.g., '고졸 신입', '고졸 신입 / 경력'
  status: 'hiring' | 'ongoing' | 'closed';
  dDay: string; // e.g. 'D-5', 'D-10', 'D-15', '상시채용', '마감'
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
  status: '서류접수' | '서류합격' | '인적성검사' | '최종면접';
  applicantName: string;
  school: string;
}

// ===== 자격증 관련 인터페이스 =====
export interface Certification {
  id: string;
  name: string; // 자격증명 (예: 산업안전기능사)
  category: string; // 분류 (기능사, 기사, 산업기사, 운전면허 등)
  issuer: string; // 발급 기관 (예: 한국산업인력공단)
  difficulty: 'easy' | 'medium' | 'hard'; // 난이도
  passingRate: string; // 합격률 (예: '45%')
  examFee: string; // 응시료 (예: '26,000원')
  relevantFields: string[]; // 관련 분야 (예: ['정유', '석화', '안전'])
}

export interface UserCertification {
  id: string;
  certificationId: string;
  certificationName: string;
  acquiredDate?: string; // 취득일 (YYYY-MM-DD)
  status: 'acquired' | 'scheduled' | 'recommended'; // 보유/응시예정/추천
}

export interface CertificationRoute {
  id: string;
  title: string; // 경로명 (예: "안전전문가 루트")
  description: string;
  targetSectors: string[]; // 목표 분야
  route: string[]; // 자격증 ID 순서
  estimatedDuration: string; // 예상 기간 (예: "12-18개월")
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  priority: number; // 추천 우선순위
}
