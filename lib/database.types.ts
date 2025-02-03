export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tiktok_users: {
        Row: {
          id: string
          username: string
          avatar_url: string
          created_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string
          created_at?: string
        }
      }
      tiktok_videos: {
        Row: {
          id: string
          user_id: string
          url: string
          thumbnail_url: string | null
          title: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          thumbnail_url?: string | null
          title: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          thumbnail_url?: string | null
          title?: string
          description?: string | null
          created_at?: string
        }
      }
      video_likes: {
        Row: {
          id: string
          video_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string
          created_at?: string
        }
      }
      video_dislikes: {
        Row: {
          id: string
          video_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string
          created_at?: string
        }
      }
      video_comments: {
        Row: {
          id: string
          video_id: string
          user_id: string
          content: string
          parent_comment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_id: string
          user_id: string
          content: string
          parent_comment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string
          content?: string
          parent_comment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          interests: string[]
          preferred_categories: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          interests?: string[]
          preferred_categories?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          interests?: string[]
          preferred_categories?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      video_watch_history: {
        Row: {
          id: string
          video_id: string
          user_id: string
          watch_duration_seconds: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          video_id: string
          user_id: string
          watch_duration_seconds?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string
          watch_duration_seconds?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_video_engagement_metrics: {
        Args: {
          video_id: string
        }
        Returns: {
          likes_count: number
          dislikes_count: number
          comments_count: number
          total_watch_time: number
          completion_rate: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 