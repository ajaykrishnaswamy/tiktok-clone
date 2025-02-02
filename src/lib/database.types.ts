export interface Database {
  public: {
    Tables: {
      tiktok_videos: {
        Row: {
          id: string
          user_id: string
          url: string
          thumbnail_url: string | null
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          thumbnail_url?: string | null
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          thumbnail_url?: string | null
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tiktok_users: {
        Row: {
          id: string
          username: string
          email: string
          avatar_url: string
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
          avatar_url: string
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          avatar_url?: string
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 