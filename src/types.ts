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
