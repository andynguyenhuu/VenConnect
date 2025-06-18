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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'user' | 'admin' | 'super_admin'
          status: 'active' | 'inactive' | 'suspended'
          region: 'AU' | 'VN'
          timezone: string
          created_at: string
          last_login: string | null
          metadata: Json
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          status?: 'active' | 'inactive' | 'suspended'
          region: 'AU' | 'VN'
          timezone?: string
          created_at?: string
          last_login?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          status?: 'active' | 'inactive' | 'suspended'
          region?: 'AU' | 'VN'
          timezone?: string
          created_at?: string
          last_login?: string | null
          metadata?: Json
        }
      }
      organisations: {
        Row: {
          id: string
          name: string
          slug: string
          region: 'AU' | 'VN'
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          region: 'AU' | 'VN'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          region?: 'AU' | 'VN'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          organisation_id: string | null
          title: string
          model_version: string
          created_at: string
          updated_at: string
          metadata: Json
          is_archived: boolean
        }
        Insert: {
          id?: string
          user_id: string
          organisation_id?: string | null
          title: string
          model_version?: string
          created_at?: string
          updated_at?: string
          metadata?: Json
          is_archived?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          organisation_id?: string | null
          title?: string
          model_version?: string
          created_at?: string
          updated_at?: string
          metadata?: Json
          is_archived?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          tokens_used: number | null
          cost_aud: number | null
          cost_vnd: number | null
          model_version: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          tokens_used?: number | null
          cost_aud?: number | null
          cost_vnd?: number | null
          model_version?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          tokens_used?: number | null
          cost_aud?: number | null
          cost_vnd?: number | null
          model_version?: string | null
          created_at?: string
          metadata?: Json
        }
      }
      attachments: {
        Row: {
          id: string
          message_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          storage_path?: string
          created_at?: string
        }
      }
      api_usage: {
        Row: {
          id: string
          user_id: string
          organisation_id: string | null
          endpoint: string
          method: string
          status_code: number | null
          response_time_ms: number | null
          tokens_used: number | null
          cost_aud: number | null
          cost_vnd: number | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organisation_id?: string | null
          endpoint: string
          method: string
          status_code?: number | null
          response_time_ms?: number | null
          tokens_used?: number | null
          cost_aud?: number | null
          cost_vnd?: number | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organisation_id?: string | null
          endpoint?: string
          method?: string
          status_code?: number | null
          response_time_ms?: number | null
          tokens_used?: number | null
          cost_aud?: number | null
          cost_vnd?: number | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      daily_usage: {
        Row: {
          date: string | null
          user_id: string | null
          organisation_id: string | null
          api_calls: number | null
          total_tokens: number | null
          total_cost_aud: number | null
          total_cost_vnd: number | null
          avg_response_time: number | null
        }
      }
      user_statistics: {
        Row: {
          id: string | null
          email: string | null
          full_name: string | null
          role: 'user' | 'admin' | 'super_admin' | null
          region: 'AU' | 'VN' | null
          conversation_count: number | null
          message_count: number | null
          total_tokens_used: number | null
          total_cost_aud: number | null
          total_cost_vnd: number | null
        }
      }
    }
    Functions: {
      calculate_costs: {
        Args: {
          p_tokens: number
          p_model?: string
        }
        Returns: {
          cost_aud: number
          cost_vnd: number
        }[]
      }
    }
  }
}
