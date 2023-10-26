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
      events: {
        Row: {
          created_at: string
          ends_at: string | null
          name: string
          slug: string
          sport: string
          starts_at: string | null
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          name: string
          slug: string
          sport: string
          starts_at?: string | null
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          name?: string
          slug?: string
          sport?: string
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_sport_fkey"
            columns: ["sport"]
            referencedRelation: "sports"
            referencedColumns: ["slug"]
          }
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
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      rounds: {
        Row: {
          created_at: string
          event: string
          id: number
          name: string
          order: number | null
          slug: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: number
          name: string
          order?: number | null
          slug: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: number
          name?: string
          order?: number | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "rounds_event_fkey"
            columns: ["event"]
            referencedRelation: "events"
            referencedColumns: ["slug"]
          }
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
