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
      account: {
        Row: {
          account_id: string
          buyer_id: string | null
          name: string | null
        }
        Insert: {
          account_id: string
          buyer_id?: string | null
          name?: string | null
        }
        Update: {
          account_id?: string
          buyer_id?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyer"
            referencedColumns: ["buyer_id"]
          },
        ]
      }
      account_contract: {
        Row: {
          ac_id: string
          account_id: string | null
          contract_id: string | null
        }
        Insert: {
          ac_id: string
          account_id?: string | null
          contract_id?: string | null
        }
        Update: {
          ac_id?: string
          account_id?: string | null
          contract_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_contract_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "account_contract_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract"
            referencedColumns: ["contract_id"]
          },
        ]
      }
      buyer: {
        Row: {
          buyer_id: string
          name: string | null
        }
        Insert: {
          buyer_id: string
          name?: string | null
        }
        Update: {
          buyer_id?: string
          name?: string | null
        }
        Relationships: []
      }
      campus: {
        Row: {
          "address line": string | null
          campus_id: string
          "hours bought": string | null
          name: string | null
          school_id: string | null
          stage_id: string | null
        }
        Insert: {
          "address line"?: string | null
          campus_id: string
          "hours bought"?: string | null
          name?: string | null
          school_id?: string | null
          stage_id?: string | null
        }
        Update: {
          "address line"?: string | null
          campus_id?: string
          "hours bought"?: string | null
          name?: string | null
          school_id?: string | null
          stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campus_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "campus_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stage"
            referencedColumns: ["stage_id"]
          },
        ]
      }
      contact: {
        Row: {
          contact_id: string
          email: string | null
          name: string | null
          type: string | null
        }
        Insert: {
          contact_id: string
          email?: string | null
          name?: string | null
          type?: string | null
        }
        Update: {
          contact_id?: string
          email?: string | null
          name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      contract: {
        Row: {
          buyer_id: string | null
          contract_id: string
          date: string | null
          discount: string | null
          "full value": string | null
          name: string | null
          "pdf link": string | null
          "total hours": string | null
          type: string | null
        }
        Insert: {
          buyer_id?: string | null
          contract_id: string
          date?: string | null
          discount?: string | null
          "full value"?: string | null
          name?: string | null
          "pdf link"?: string | null
          "total hours"?: string | null
          type?: string | null
        }
        Update: {
          buyer_id?: string | null
          contract_id?: string
          date?: string | null
          discount?: string | null
          "full value"?: string | null
          name?: string | null
          "pdf link"?: string | null
          "total hours"?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyer"
            referencedColumns: ["buyer_id"]
          },
        ]
      }
      contract_program: {
        Row: {
          contract_id: string | null
          cp_id: string
          "end date": string | null
          "hours bought": string | null
          program_id: string | null
          "start date": string | null
        }
        Insert: {
          contract_id?: string | null
          cp_id: string
          "end date"?: string | null
          "hours bought"?: string | null
          program_id?: string | null
          "start date"?: string | null
        }
        Update: {
          contract_id?: string | null
          cp_id?: string
          "end date"?: string | null
          "hours bought"?: string | null
          program_id?: string | null
          "start date"?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_program_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract"
            referencedColumns: ["contract_id"]
          },
          {
            foreignKeyName: "contract_program_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["program_id"]
          },
        ]
      }
      country: {
        Row: {
          code: string | null
          country_id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          country_id: string
          name?: string | null
        }
        Update: {
          code?: string | null
          country_id?: string
          name?: string | null
        }
        Relationships: []
      }
      curriculum: {
        Row: {
          curriculum_id: string
          description: string | null
          name: string | null
        }
        Insert: {
          curriculum_id: string
          description?: string | null
          name?: string | null
        }
        Update: {
          curriculum_id?: string
          description?: string | null
          name?: string | null
        }
        Relationships: []
      }
      curriculum_subject: {
        Row: {
          cs_id: string
          curriculum_id: string | null
          name: string | null
          subejct_id: string | null
        }
        Insert: {
          cs_id: string
          curriculum_id?: string | null
          name?: string | null
          subejct_id?: string | null
        }
        Update: {
          cs_id?: string
          curriculum_id?: string | null
          name?: string | null
          subejct_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_subject_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curriculum"
            referencedColumns: ["curriculum_id"]
          },
          {
            foreignKeyName: "curriculum_subject_subejct_id_fkey"
            columns: ["subejct_id"]
            isOneToOne: false
            referencedRelation: "subject"
            referencedColumns: ["subejct_id"]
          },
        ]
      }
      district: {
        Row: {
          district_id: string
          name: string | null
          region_id: string | null
        }
        Insert: {
          district_id: string
          name?: string | null
          region_id?: string | null
        }
        Update: {
          district_id?: string
          name?: string | null
          region_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "district_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "region"
            referencedColumns: ["region_id"]
          },
        ]
      }
      grade: {
        Row: {
          code: string | null
          grade_id: string
          name: string | null
          number: string | null
        }
        Insert: {
          code?: string | null
          grade_id: string
          name?: string | null
          number?: string | null
        }
        Update: {
          code?: string | null
          grade_id?: string
          name?: string | null
          number?: string | null
        }
        Relationships: []
      }
      group: {
        Row: {
          contact_id: string | null
          "end date": string | null
          grade_id: string | null
          group_id: string
          language_id: string | null
          name: string | null
          program_id: string | null
          "start date": string | null
        }
        Insert: {
          contact_id?: string | null
          "end date"?: string | null
          grade_id?: string | null
          group_id: string
          language_id?: string | null
          name?: string | null
          program_id?: string | null
          "start date"?: string | null
        }
        Update: {
          contact_id?: string | null
          "end date"?: string | null
          grade_id?: string | null
          group_id?: string
          language_id?: string | null
          name?: string | null
          program_id?: string | null
          "start date"?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "groups_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grade"
            referencedColumns: ["grade_id"]
          },
          {
            foreignKeyName: "groups_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["language_id"]
          },
          {
            foreignKeyName: "groups_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["program_id"]
          },
        ]
      }
      language: {
        Row: {
          code: string | null
          language_id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          language_id: string
          name?: string | null
        }
        Update: {
          code?: string | null
          language_id?: string
          name?: string | null
        }
        Relationships: []
      }
      program: {
        Row: {
          account_id: string | null
          campus_id: string | null
          cs_id: string | null
          name: string | null
          program_id: string
          "start date": string | null
          "super tutor": string | null
        }
        Insert: {
          account_id?: string | null
          campus_id?: string | null
          cs_id?: string | null
          name?: string | null
          program_id: string
          "start date"?: string | null
          "super tutor"?: string | null
        }
        Update: {
          account_id?: string | null
          campus_id?: string | null
          cs_id?: string | null
          name?: string | null
          program_id?: string
          "start date"?: string | null
          "super tutor"?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "program_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campus"
            referencedColumns: ["campus_id"]
          },
          {
            foreignKeyName: "program_cs_id_fkey"
            columns: ["cs_id"]
            isOneToOne: false
            referencedRelation: "curriculum_subject"
            referencedColumns: ["cs_id"]
          },
        ]
      }
      region: {
        Row: {
          name: string | null
          region_id: string
          state_id: string | null
        }
        Insert: {
          name?: string | null
          region_id: string
          state_id?: string | null
        }
        Update: {
          name?: string | null
          region_id?: string
          state_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "region_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "state"
            referencedColumns: ["state_id"]
          },
        ]
      }
      schedule: {
        Row: {
          "end hour": string | null
          FRI: boolean | null
          group_id: string | null
          MON: boolean | null
          name: string | null
          SAT: boolean | null
          schedule_id: string
          "start date": string | null
          "start hour": string | null
          SUN: boolean | null
          THU: boolean | null
          Timeframe: string | null
          TUE: boolean | null
          WED: boolean | null
        }
        Insert: {
          "end hour"?: string | null
          FRI?: boolean | null
          group_id?: string | null
          MON?: boolean | null
          name?: string | null
          SAT?: boolean | null
          schedule_id: string
          "start date"?: string | null
          "start hour"?: string | null
          SUN?: boolean | null
          THU?: boolean | null
          Timeframe?: string | null
          TUE?: boolean | null
          WED?: boolean | null
        }
        Update: {
          "end hour"?: string | null
          FRI?: boolean | null
          group_id?: string | null
          MON?: boolean | null
          name?: string | null
          SAT?: boolean | null
          schedule_id?: string
          "start date"?: string | null
          "start hour"?: string | null
          SUN?: boolean | null
          THU?: boolean | null
          Timeframe?: string | null
          TUE?: boolean | null
          WED?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["group_id"]
          },
        ]
      }
      school: {
        Row: {
          district_id: string | null
          name: string | null
          school_id: string
        }
        Insert: {
          district_id?: string | null
          name?: string | null
          school_id: string
        }
        Update: {
          district_id?: string | null
          name?: string | null
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "district"
            referencedColumns: ["district_id"]
          },
        ]
      }
      stage: {
        Row: {
          code: string | null
          concept: string | null
          name: string | null
          stage_id: string
        }
        Insert: {
          code?: string | null
          concept?: string | null
          name?: string | null
          stage_id: string
        }
        Update: {
          code?: string | null
          concept?: string | null
          name?: string | null
          stage_id?: string
        }
        Relationships: []
      }
      state: {
        Row: {
          country_id: string | null
          name: string | null
          state_id: string
        }
        Insert: {
          country_id?: string | null
          name?: string | null
          state_id: string
        }
        Update: {
          country_id?: string | null
          name?: string | null
          state_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "state_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["country_id"]
          },
        ]
      }
      student: {
        Row: {
          campus_id: string | null
          grade_id: string | null
          id: number
          language_id: string | null
          name: string
        }
        Insert: {
          campus_id?: string | null
          grade_id?: string | null
          id?: number
          language_id?: string | null
          name: string
        }
        Update: {
          campus_id?: string | null
          grade_id?: string | null
          id?: number
          language_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_duplicate_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campus"
            referencedColumns: ["campus_id"]
          },
          {
            foreignKeyName: "student_duplicate_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grade"
            referencedColumns: ["grade_id"]
          },
          {
            foreignKeyName: "student_duplicate_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["language_id"]
          },
        ]
      }
      subject: {
        Row: {
          name: string | null
          subejct_id: string
        }
        Insert: {
          name?: string | null
          subejct_id: string
        }
        Update: {
          name?: string | null
          subejct_id?: string
        }
        Relationships: []
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
