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
      ds_keys: {
        Row: {
          description: string | null
          name: string
          private: string
          public: string
        }
        Insert: {
          description?: string | null
          name: string
          private: string
          public: string
        }
        Update: {
          description?: string | null
          name?: string
          private?: string
          public?: string
        }
        Relationships: []
      }
      entrants: {
        Row: {
          created_at: string
          data: Json | null
          dob: string | null
          first_name: string
          id: number
          last_name: string
          nick_name: string | null
          primary_sport: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          dob?: string | null
          first_name: string
          id?: number
          last_name: string
          nick_name?: string | null
          primary_sport?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          dob?: string | null
          first_name?: string
          id?: number
          last_name?: string
          nick_name?: string | null
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
          }
        ]
      }
      events: {
        Row: {
          created_at: string
          ds_keys: string | null
          ends_at: string | null
          format: Json | null
          name: string
          results: Json | null
          slug: string
          snapshot: Json | null
          sport: string
          starts_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          ds_keys?: string | null
          ends_at?: string | null
          format?: Json | null
          name: string
          results?: Json | null
          slug: string
          snapshot?: Json | null
          sport: string
          starts_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          ds_keys?: string | null
          ends_at?: string | null
          format?: Json | null
          name?: string
          results?: Json | null
          slug?: string
          snapshot?: Json | null
          sport?: string
          starts_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
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
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
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
