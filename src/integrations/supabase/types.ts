export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      digital_products_links: {
        Row: {
          created_at: string | null
          id: number
          is_published: boolean | null
          link_produk: string
          nama_produk: string
          required_permission_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          is_published?: boolean | null
          link_produk: string
          nama_produk: string
          required_permission_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          is_published?: boolean | null
          link_produk?: string
          nama_produk?: string
          required_permission_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      generic_codes: {
        Row: {
          code_string: string
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          permissions_granted_json: Json
        }
        Insert: {
          code_string: string
          created_at?: string | null
          description?: string | null
          id?: never
          is_active?: boolean | null
          permissions_granted_json: Json
        }
        Update: {
          code_string?: string
          created_at?: string | null
          description?: string | null
          id?: never
          is_active?: boolean | null
          permissions_granted_json?: Json
        }
        Relationships: []
      }
      ide_produk: {
        Row: {
          created_at: string | null
          deskripsi_konten: string | null
          id: number
          is_published: boolean | null
          judul_konten: string
          required_permission_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi_konten?: string | null
          id?: never
          is_published?: boolean | null
          judul_konten: string
          required_permission_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi_konten?: string | null
          id?: never
          is_published?: boolean | null
          judul_konten?: string
          required_permission_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          request_prompt_quota: number | null
          role: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          request_prompt_quota?: number | null
          role?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          request_prompt_quota?: number | null
          role?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          created_at: string | null
          deskripsi_konten: string | null
          id: number
          is_published: boolean | null
          judul_konten: string
          required_permission_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi_konten?: string | null
          id?: never
          is_published?: boolean | null
          judul_konten: string
          required_permission_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi_konten?: string | null
          id?: never
          is_published?: boolean | null
          judul_konten?: string
          required_permission_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          granted_at: string | null
          granted_by_code: string | null
          id: number
          permission_key: string
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by_code?: string | null
          id?: never
          permission_key: string
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by_code?: string | null
          id?: never
          permission_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_requests: {
        Row: {
          admin_notes: string | null
          id: number
          processed_at: string | null
          request_text: string
          requested_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          id?: never
          processed_at?: string | null
          request_text: string
          requested_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          id?: never
          processed_at?: string | null
          request_text?: string
          requested_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
