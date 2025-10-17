export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alternatives: {
        Row: {
          id: string
          order_number: number
          question_id: string | null
          text_en: string
          text_es: string
          text_pt: string
          weight: number
        }
        Insert: {
          id?: string
          order_number: number
          question_id?: string | null
          text_en: string
          text_es: string
          text_pt: string
          weight: number
        }
        Update: {
          id?: string
          order_number?: number
          question_id?: string | null
          text_en?: string
          text_es?: string
          text_pt?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "alternatives_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_applications: {
        Row: {
          access_token: string | null
          assessment_id: string | null
          company_id: string | null
          completed_at: string | null
          created_at: string | null
          employee_id: string | null
          expires_at: string | null
          id: string
          language: Database["public"]["Enums"]["supported_language"] | null
          sent_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["assessment_status"] | null
        }
        Insert: {
          access_token?: string | null
          assessment_id?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          language?: Database["public"]["Enums"]["supported_language"] | null
          sent_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["assessment_status"] | null
        }
        Update: {
          access_token?: string | null
          assessment_id?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          language?: Database["public"]["Enums"]["supported_language"] | null
          sent_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["assessment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_applications_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_applications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_quizzes: {
        Row: {
          assessment_id: string | null
          id: string
          order_number: number
          quiz_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          id?: string
          order_number: number
          quiz_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          id?: string
          order_number?: number
          quiz_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_quizzes_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_quizzes_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_es: string | null
          description_pt: string | null
          estimated_time_minutes: number | null
          id: string
          is_active: boolean | null
          psychologist_id: string | null
          title_en: string
          title_es: string
          title_pt: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_pt?: string | null
          estimated_time_minutes?: number | null
          id?: string
          is_active?: boolean | null
          psychologist_id?: string | null
          title_en: string
          title_es: string
          title_pt: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_pt?: string | null
          estimated_time_minutes?: number | null
          id?: string
          is_active?: boolean | null
          psychologist_id?: string | null
          title_en?: string
          title_es?: string
          title_pt?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologists"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          cnpj: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          plan: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          plan?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          plan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_users: {
        Row: {
          company_id: string | null
          id: string
          position: string | null
          profile_id: string | null
        }
        Insert: {
          company_id?: string | null
          id?: string
          position?: string | null
          profile_id?: string | null
        }
        Update: {
          company_id?: string | null
          id?: string
          position?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          company_id: string | null
          created_at: string | null
          department: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          position: string | null
          preferred_language:
            | Database["public"]["Enums"]["supported_language"]
            | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          position?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["supported_language"]
            | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          position?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["supported_language"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          preferred_language:
            | Database["public"]["Enums"]["supported_language"]
            | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          preferred_language?:
            | Database["public"]["Enums"]["supported_language"]
            | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          preferred_language?:
            | Database["public"]["Enums"]["supported_language"]
            | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      psychological_traits: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_es: string | null
          description_pt: string | null
          id: string
          is_active: boolean | null
          name_en: string
          name_es: string
          name_pt: string
          psychologist_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_pt?: string | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_es: string
          name_pt: string
          psychologist_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_pt?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_es?: string
          name_pt?: string
          psychologist_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psychological_traits_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologists"
            referencedColumns: ["id"]
          },
        ]
      }
      psychologist_companies: {
        Row: {
          company_id: string | null
          granted_at: string | null
          id: string
          psychologist_id: string | null
        }
        Insert: {
          company_id?: string | null
          granted_at?: string | null
          id?: string
          psychologist_id?: string | null
        }
        Update: {
          company_id?: string | null
          granted_at?: string | null
          id?: string
          psychologist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psychologist_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psychologist_companies_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologists"
            referencedColumns: ["id"]
          },
        ]
      }
      psychologists: {
        Row: {
          bio: string | null
          id: string
          license_number: string | null
          profile_id: string | null
          specialization: string | null
        }
        Insert: {
          bio?: string | null
          id?: string
          license_number?: string | null
          profile_id?: string | null
          specialization?: string | null
        }
        Update: {
          bio?: string | null
          id?: string
          license_number?: string | null
          profile_id?: string | null
          specialization?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "psychologists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string | null
          id: string
          order_number: number
          quiz_id: string | null
          text_en: string
          text_es: string
          text_pt: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_number: number
          quiz_id?: string | null
          text_en: string
          text_es: string
          text_pt: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_number?: number
          quiz_id?: string | null
          text_en?: string
          text_es?: string
          text_pt?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          application_id: string | null
          calculated_at: string | null
          id: string
          level: Database["public"]["Enums"]["trait_level"] | null
          percentage: number
          quiz_id: string | null
          raw_score: number
        }
        Insert: {
          application_id?: string | null
          calculated_at?: string | null
          id?: string
          level?: Database["public"]["Enums"]["trait_level"] | null
          percentage: number
          quiz_id?: string | null
          raw_score: number
        }
        Update: {
          application_id?: string | null
          calculated_at?: string | null
          id?: string
          level?: Database["public"]["Enums"]["trait_level"] | null
          percentage?: number
          quiz_id?: string | null
          raw_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "assessment_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_es: string | null
          description_pt: string | null
          id: string
          is_active: boolean | null
          psychologist_id: string | null
          title_en: string
          title_es: string
          title_pt: string
          trait_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_pt?: string | null
          id?: string
          is_active?: boolean | null
          psychologist_id?: string | null
          title_en: string
          title_es: string
          title_pt: string
          trait_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_pt?: string | null
          id?: string
          is_active?: boolean | null
          psychologist_id?: string | null
          title_en?: string
          title_es?: string
          title_pt?: string
          trait_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_trait_id_fkey"
            columns: ["trait_id"]
            isOneToOne: false
            referencedRelation: "psychological_traits"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          alternative_id: string | null
          answered_at: string | null
          application_id: string | null
          id: string
          question_id: string | null
        }
        Insert: {
          alternative_id?: string | null
          answered_at?: string | null
          application_id?: string | null
          id?: string
          question_id?: string | null
        }
        Update: {
          alternative_id?: string | null
          answered_at?: string | null
          application_id?: string | null
          id?: string
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_alternative_id_fkey"
            columns: ["alternative_id"]
            isOneToOne: false
            referencedRelation: "alternatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "assessment_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
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
      assessment_status: "pending" | "in_progress" | "completed" | "expired"
      supported_language: "pt" | "es" | "en"
      trait_level: "low" | "medium" | "high"
      user_role: "psychologist" | "company" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assessment_status: ["pending", "in_progress", "completed", "expired"],
      supported_language: ["pt", "es", "en"],
      trait_level: ["low", "medium", "high"],
      user_role: ["psychologist", "company", "employee"],
    },
  },
} as const
