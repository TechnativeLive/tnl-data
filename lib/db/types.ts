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
      ds_keys: {
        Row: {
          description: string | null
          id: number
          kind: Database["public"]["Enums"]["datastream_kind"]
          name: string
          private: string
          public: string
        }
        Insert: {
          description?: string | null
          id: number
          kind?: Database["public"]["Enums"]["datastream_kind"]
          name: string
          private: string
          public: string
        }
        Update: {
          description?: string | null
          id?: number
          kind?: Database["public"]["Enums"]["datastream_kind"]
          name?: string
          private?: string
          public?: string
        }
        Relationships: []
      }
      entrants: {
        Row: {
          country: string | null
          created_at: string
          data: Json | null
          dob: string | null
          first_name: string
          id: number
          last_name: string
          nick_name: string | null
          photo: string | null
          primary_sport: number | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          data?: Json | null
          dob?: string | null
          first_name: string
          id?: number
          last_name: string
          nick_name?: string | null
          photo?: string | null
          primary_sport?: number | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          data?: Json | null
          dob?: string | null
          first_name?: string
          id?: number
          last_name?: string
          nick_name?: string | null
          photo?: string | null
          primary_sport?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entrants_primary_sport_fkey"
            columns: ["primary_sport"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          _format: string | null
          created_at: string
          ds_keys: string | null
          ends_at: string | null
          format: Json | null
          format_options: Json | null
          judge_data: Json[] | null
          name: string
          results: Json | null
          slug: string
          snapshot: Json | null
          sport: string
          starts_at: string | null
          timers: number[] | null
          updated_at: string | null
        }
        Insert: {
          _format?: string | null
          created_at?: string
          ds_keys?: string | null
          ends_at?: string | null
          format?: Json | null
          format_options?: Json | null
          judge_data?: Json[] | null
          name: string
          results?: Json | null
          slug: string
          snapshot?: Json | null
          sport: string
          starts_at?: string | null
          timers?: number[] | null
          updated_at?: string | null
        }
        Update: {
          _format?: string | null
          created_at?: string
          ds_keys?: string | null
          ends_at?: string | null
          format?: Json | null
          format_options?: Json | null
          judge_data?: Json[] | null
          name?: string
          results?: Json | null
          slug?: string
          snapshot?: Json | null
          sport?: string
          starts_at?: string | null
          timers?: number[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events__format_fkey"
            columns: ["_format"]
            isOneToOne: false
            referencedRelation: "formats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_ds_keys_fkey"
            columns: ["ds_keys"]
            isOneToOne: false
            referencedRelation: "ds_keys"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "events_sport_fkey"
            columns: ["sport"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["slug"]
          },
        ]
      }
      formats: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          sport_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: string
          name: string
          sport_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sport_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "formats_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      results: {
        Row: {
          created_at: string
          data: Json | null
          entry_id: number
          is_active: boolean
          is_dirty: boolean
        }
        Insert: {
          created_at?: string
          data?: Json | null
          entry_id?: number
          is_active?: boolean
          is_dirty?: boolean
        }
        Update: {
          created_at?: string
          data?: Json | null
          entry_id?: number
          is_active?: boolean
          is_dirty?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "results_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: true
            referencedRelation: "round_entrants"
            referencedColumns: ["id"]
          },
        ]
      }
      round_entrants: {
        Row: {
          created_at: string
          data: Json | null
          entrant_id: number
          id: number
          round_id: number
        }
        Insert: {
          created_at?: string
          data?: Json | null
          entrant_id: number
          id?: number
          round_id: number
        }
        Update: {
          created_at?: string
          data?: Json | null
          entrant_id?: number
          id?: number
          round_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "round_entrants_entrant_id_fkey"
            columns: ["entrant_id"]
            isOneToOne: false
            referencedRelation: "entrants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_entrants_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      rounds: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          name: string
          order: number | null
          parent_event_id: string | null
          parent_round_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean
          name: string
          order?: number | null
          parent_event_id?: string | null
          parent_round_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string
          order?: number | null
          parent_event_id?: string | null
          parent_round_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rounds_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "rounds_parent_round_id_fkey"
            columns: ["parent_round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      runs_bouldering: {
        Row: {
          active: boolean
          bloc: number
          category: number
          ended_at: number | null
          id: number
          started_at: number
          time_elapsed: number
          top_at: number | null
          top_at_provisional: number | null
          top_override: number | null
          zone_at: number | null
          zone_override: number | null
        }
        Insert: {
          active?: boolean
          bloc: number
          category: number
          ended_at?: number | null
          id?: number
          started_at: number
          time_elapsed: number
          top_at?: number | null
          top_at_provisional?: number | null
          top_override?: number | null
          zone_at?: number | null
          zone_override?: number | null
        }
        Update: {
          active?: boolean
          bloc?: number
          category?: number
          ended_at?: number | null
          id?: number
          started_at?: number
          time_elapsed?: number
          top_at?: number | null
          top_at_provisional?: number | null
          top_override?: number | null
          zone_at?: number | null
          zone_override?: number | null
        }
        Relationships: []
      }
      scorecards: {
        Row: {
          active: boolean
          created_at: string
          id: number
          order: number | null
          parent_round: number
          scores: Json | null
          status: Database["public"]["Enums"]["status"] | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: number
          order?: number | null
          parent_round: number
          scores?: Json | null
          status?: Database["public"]["Enums"]["status"] | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
          order?: number | null
          parent_round?: number
          scores?: Json | null
          status?: Database["public"]["Enums"]["status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "scorecards_parent_round_fkey"
            columns: ["parent_round"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      sports: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      timers: {
        Row: {
          countdown: boolean
          created_at: string
          datastream: string | null
          end_hours: number
          end_mins: number
          end_secs: number
          format: string
          id: number
          isRunning: boolean
          muted: boolean
          name: string | null
          repeat_count: number | null
          repeat_delay: number
          repeating: boolean
          sounds: Json
          UTC: number
          value: number
        }
        Insert: {
          countdown?: boolean
          created_at?: string
          datastream?: string | null
          end_hours?: number
          end_mins?: number
          end_secs?: number
          format?: string
          id?: number
          isRunning?: boolean
          muted?: boolean
          name?: string | null
          repeat_count?: number | null
          repeat_delay?: number
          repeating?: boolean
          sounds?: Json
          UTC?: number
          value?: number
        }
        Update: {
          countdown?: boolean
          created_at?: string
          datastream?: string | null
          end_hours?: number
          end_mins?: number
          end_secs?: number
          format?: string
          id?: number
          isRunning?: boolean
          muted?: boolean
          name?: string | null
          repeat_count?: number | null
          repeat_delay?: number
          repeating?: boolean
          sounds?: Json
          UTC?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "timers_datastream_fkey"
            columns: ["datastream"]
            isOneToOne: false
            referencedRelation: "ds_keys"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_judge_data: {
        Args: {
          index: number
          value: Json
          event: string
        }
        Returns: undefined
      }
    }
    Enums: {
      datastream_kind: "timer" | "data"
      status: "DNS" | "DNF"
      timer_play_sounds_on: "none" | "all" | "overview" | "fullscreen"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
