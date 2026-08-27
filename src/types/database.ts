// Supabase Database 타입 정의
// types/database.ts

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          english_name: string | null;
          logo_url: string | null;
          industry: string;
          industry_detail: string | null;
          location: string | null;
          sector: 'ν정유' | '석화' | '가스' | '배터리' | '발전' | '반도체' | '기타' | null;
          is_popular_rank: number | null;
          description: string | null;
          business_process: string | null;
          openings_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['companies']['Row']>;
      };
      company_characteristics: {
        Row: {
          id: string;
          company_id: string;
          salary: number;
          welfare: number;
          work_life_balance: number;
          safety: number;
          growth: number;
          stability: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['company_characteristics']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['company_characteristics']['Row']>;
      };
      company_stats: {
        Row: {
          id: string;
          company_id: string;
          employees: string | null;
          avg_salary: string | null;
          established_year: string | null;
          shift_system: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['company_stats']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['company_stats']['Row']>;
      };
      company_benefits: {
        Row: {
          id: string;
          company_id: string;
          icon: string | null;
          title: string;
          description: string | null;
          order_index: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['company_benefits']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['company_benefits']['Row']>;
      };
      company_reviews: {
        Row: {
          id: string;
          company_id: string;
          rating: number;
          review_date: string | null;
          role: string | null;
          title: string;
          content: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['company_reviews']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['company_reviews']['Row']>;
      };
      company_tags: {
        Row: {
          id: string;
          company_id: string;
          tag: string;
          order_index: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['company_tags']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['company_tags']['Row']>;
      };
      job_openings: {
        Row: {
          id: string;
          company_id: string;
          company_name: string;
          title: string;
          korean_title: string | null;
          location: string | null;
          education_req: string | null;
          category: string | null;
          salary_guide: string | null;
          work_schedule: string | null;
          description: string | null;
          status: 'hiring' | 'closed';
          d_day: string | null;
          is_meister_recommended: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['job_openings']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['job_openings']['Row']>;
      };
      job_requirements: {
        Row: {
          id: string;
          job_opening_id: string;
          requirement: string;
          order_index: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['job_requirements']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['job_requirements']['Row']>;
      };
      job_responsibilities: {
        Row: {
          id: string;
          job_opening_id: string;
          responsibility: string;
          order_index: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['job_responsibilities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['job_responsibilities']['Row']>;
      };
      sector_trends: {
        Row: {
          id: string;
          sector: 'ν정유' | '석화' | '가스' | '배터리' | '발전' | '반도체' | '기타';
          english_name: string | null;
          icon: string | null;
          current_status: string | null;
          market_size: string | null;
          growth_rate: string | null;
          outlook_status: 'positive' | 'neutral' | 'caution' | null;
          future_outlook: string | null;
          salary_trend: string | null;
          job_outlook: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sector_trends']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['sector_trends']['Row']>;
      };
      sector_trends_items: {
        Row: {
          id: string;
          sector_id: string;
          item_type: 'trends' | 'opportunities' | 'challenges' | 'technologies' | 'skill_demand';
          content: string;
          order_index: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sector_trends_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['sector_trends_items']['Row']>;
      };
      certifications: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          issuer: string | null;
          difficulty: 'easy' | 'medium' | 'hard' | null;
          test_type: 'practical' | 'written';
          passing_rate: string | null;
          exam_fee: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['certifications']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['certifications']['Row']>;
      };
      certification_relevant_fields: {
        Row: {
          id: string;
          certification_id: string;
          field: string;
          order_index: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['certification_relevant_fields']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['certification_relevant_fields']['Row']>;
      };
      certification_routes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          estimated_duration: string | null;
          difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
          priority: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['certification_routes']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['certification_routes']['Row']>;
      };
      certification_routes_items: {
        Row: {
          id: string;
          route_id: string;
          certification_id: string;
          order_index: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['certification_routes_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['certification_routes_items']['Row']>;
      };
      certification_routes_target_sectors: {
        Row: {
          id: string;
          route_id: string;
          sector: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['certification_routes_target_sectors']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['certification_routes_target_sectors']['Row']>;
      };
      users: {
        Row: {
          id: string;
          name: string | null;
          class_info: string | null;
          graduation_date: string | null;
          avatar_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      user_certifications: {
        Row: {
          id: string;
          user_id: string;
          certification_id: string;
          certification_name: string;
          status: 'acquired' | 'scheduled';
          acquired_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_certifications']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_certifications']['Row']>;
      };
      user_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          job_opening_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_bookmarks']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      user_followed_companies: {
        Row: {
          id: string;
          user_id: string;
          company_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_followed_companies']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      application_records: {
        Row: {
          id: string;
          user_id: string;
          job_opening_id: string;
          company_name: string;
          position: string;
          status: 'applied' | 'pass' | 'fail' | 'interview';
          applied_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['application_records']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['application_records']['Row']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string | null;
          notification_type: string | null;
          related_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
    };
    Views: {
      company_profiles: {
        Row: {
          id: string;
          name: string;
          english_name: string | null;
          logo_url: string | null;
          industry: string;
          location: string | null;
          sector: string | null;
          is_popular_rank: number | null;
          description: string | null;
          business_process: string | null;
          employees: string | null;
          avg_salary: string | null;
          established_year: string | null;
          shift_system: string | null;
          salary: number | null;
          welfare: number | null;
          work_life_balance: number | null;
          safety: number | null;
          growth: number | null;
          stability: number | null;
          job_count: number;
          benefit_count: number;
          review_count: number;
        };
      };
      user_certification_progress: {
        Row: {
          route_id: string;
          route_title: string;
          user_id: string;
          total_certifications: number;
          acquired_certifications: number;
          progress_percentage: number;
        };
      };
      sector_company_stats: {
        Row: {
          sector: string;
          english_name: string | null;
          outlook_status: string | null;
          company_count: number;
          active_job_count: number;
          avg_salary_score: number;
          avg_welfare_score: number;
          avg_safety_score: number;
          avg_stability_score: number;
        };
      };
    };
  };
};
