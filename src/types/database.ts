export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
        };
        Insert: {
          id: string;
          code: string;
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
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_ai_generated?: boolean;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          is_ai_generated?: boolean;
          is_read?: boolean;
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
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
