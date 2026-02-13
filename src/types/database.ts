export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CounselorStatus = "pending" | "active" | "inactive";
export type SubscriptionPlan = "free" | "monthly" | "yearly";
export type SubscriptionStatus = "active" | "cancelled" | "expired";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          birth_year: number | null;
          gender: "M" | "F" | "O" | null;
          role: "user" | "counselor" | "admin";
          counselor_id: string | null;
          free_uses_remaining: number;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          birth_year?: number | null;
          gender?: "M" | "F" | "O" | null;
          role?: "user" | "counselor" | "admin";
          counselor_id?: string | null;
          free_uses_remaining?: number;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          birth_year?: number | null;
          gender?: "M" | "F" | "O" | null;
          role?: "user" | "counselor" | "admin";
          counselor_id?: string | null;
          free_uses_remaining?: number;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      counselors: {
        Row: {
          id: string;
          code: string;
          full_name: string;
          title: string | null;
          photo_url: string | null;
          introduction: string | null;
          blog_url: string | null;
          product_page_url: string | null;
          today_message: string | null;
          is_approved: boolean;
          approved_at: string | null;
          client_count: number;
          created_at: string;
          // 추가 필드
          phone: string | null;
          kakao_link: string | null;
          instagram_link: string | null;
          status: CounselorStatus;
        };
        Insert: {
          id: string;
          code?: string; // 자동 생성됨
          full_name: string;
          title?: string | null;
          photo_url?: string | null;
          introduction?: string | null;
          blog_url?: string | null;
          product_page_url?: string | null;
          today_message?: string | null;
          is_approved?: boolean;
          approved_at?: string | null;
          client_count?: number;
          created_at?: string;
          phone?: string | null;
          kakao_link?: string | null;
          instagram_link?: string | null;
          status?: CounselorStatus;
        };
        Update: {
          id?: string;
          code?: string;
          full_name?: string;
          title?: string | null;
          photo_url?: string | null;
          introduction?: string | null;
          blog_url?: string | null;
          product_page_url?: string | null;
          today_message?: string | null;
          is_approved?: boolean;
          approved_at?: string | null;
          client_count?: number;
          created_at?: string;
          phone?: string | null;
          kakao_link?: string | null;
          instagram_link?: string | null;
          status?: CounselorStatus;
        };
      };
      brain_tests: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          brain_age: number;
          total_score: number;
          memory_score: number | null;
          calc_score: number | null;
          focus_score: number | null;
          language_score: number | null;
          thinking_score: number | null;
          percentile: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          brain_age: number;
          total_score: number;
          memory_score?: number | null;
          calc_score?: number | null;
          focus_score?: number | null;
          language_score?: number | null;
          thinking_score?: number | null;
          percentile?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          brain_age?: number;
          total_score?: number;
          memory_score?: number | null;
          calc_score?: number | null;
          focus_score?: number | null;
          language_score?: number | null;
          thinking_score?: number | null;
          percentile?: number | null;
          created_at?: string;
        };
      };
      game_records: {
        Row: {
          id: string;
          user_id: string | null;
          game_type: "memory" | "calc" | "focus" | "language" | "thinking";
          score: number;
          duration_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          game_type: "memory" | "calc" | "focus" | "language" | "thinking";
          score: number;
          duration_seconds?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          game_type?: "memory" | "calc" | "focus" | "language" | "thinking";
          score?: number;
          duration_seconds?: number | null;
          created_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          habit_type: string;
          completed: boolean;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          habit_type: string;
          completed?: boolean;
          date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          habit_type?: string;
          completed?: boolean;
          date?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_ai_generated: boolean;
          is_read: boolean;
          created_at: string;
          template_id: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_ai_generated?: boolean;
          is_read?: boolean;
          created_at?: string;
          template_id?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          is_ai_generated?: boolean;
          is_read?: boolean;
          created_at?: string;
          template_id?: string | null;
        };
      };
      message_templates: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category?: string;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: SubscriptionPlan;
          status: SubscriptionStatus;
          started_at: string;
          expires_at: string | null;
          cancelled_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type: SubscriptionPlan;
          status?: SubscriptionStatus;
          started_at?: string;
          expires_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_type?: SubscriptionPlan;
          status?: SubscriptionStatus;
          started_at?: string;
          expires_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          subtitle: string | null;
          description: string | null;
          benefits: string[] | null;
          ingredients: string | null;
          image_url: string | null;
          external_url: string | null;
          accent_color: string | null;
          category: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          subtitle?: string | null;
          description?: string | null;
          benefits?: string[] | null;
          ingredients?: string | null;
          image_url?: string | null;
          external_url?: string | null;
          accent_color?: string | null;
          category?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          subtitle?: string | null;
          description?: string | null;
          benefits?: string[] | null;
          ingredients?: string | null;
          image_url?: string | null;
          external_url?: string | null;
          accent_color?: string | null;
          category?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      page_content: {
        Row: {
          id: string;
          section_key: string;
          content_type: string;
          content: string;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          content_type?: string;
          content: string;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          content_type?: string;
          content?: string;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      share_links: {
        Row: {
          id: string;
          user_id: string | null;
          share_type: string;
          data: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          share_type: string;
          data: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          share_type?: string;
          data?: Json;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      generate_counselor_code: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: Record<string, never>;
  };
}

// 편의를 위한 타입 별칭
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Counselor = Database["public"]["Tables"]["counselors"]["Row"];
export type BrainTest = Database["public"]["Tables"]["brain_tests"]["Row"];
export type GameRecord = Database["public"]["Tables"]["game_records"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MessageTemplate = Database["public"]["Tables"]["message_templates"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];

// 카운셀러 + 프로필 조인 타입
export type CounselorWithProfile = Counselor & {
  profiles?: Profile;
};

// 회원 + 카운셀러 정보 조인 타입
export type ProfileWithCounselor = Profile & {
  counselor?: Counselor | null;
};
