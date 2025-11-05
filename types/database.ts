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
      niches: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          id: string
          title: string
          problem: string | null
          solution: string | null
          audience: string | null
          status: 'Backlog' | 'Exploring' | 'Validating' | 'Building' | 'Launched'
          impact: number
          confidence: number
          effort: number
          ice_score: number
          notes: string | null
          source_url: string | null
          tags: string | null
          created_at: string
          updated_at: string
          niche_id: string
        }
        Insert: {
          id?: string
          title: string
          problem?: string | null
          solution?: string | null
          audience?: string | null
          status?: 'Backlog' | 'Exploring' | 'Validating' | 'Building' | 'Launched'
          impact?: number
          confidence?: number
          effort?: number
          ice_score?: number
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          created_at?: string
          updated_at?: string
          niche_id: string
        }
        Update: {
          id?: string
          title?: string
          problem?: string | null
          solution?: string | null
          audience?: string | null
          status?: 'Backlog' | 'Exploring' | 'Validating' | 'Building' | 'Launched'
          impact?: number
          confidence?: number
          effort?: number
          ice_score?: number
          notes?: string | null
          source_url?: string | null
          tags?: string | null
          created_at?: string
          updated_at?: string
          niche_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_niche_id_fkey"
            columns: ["niche_id"]
            referencedRelation: "niches"
            referencedColumns: ["id"]
          }
        ]
      }
      highlights: {
        Row: {
          id: string
          quote: string
          permalink: string | null
          subreddit: string | null
          author: string | null
          upvotes: number | null
          notes: string | null
          tags: string | null
          created_at: string
          updated_at: string
          niche_id: string
          idea_id: string | null
        }
        Insert: {
          id?: string
          quote: string
          permalink?: string | null
          subreddit?: string | null
          author?: string | null
          upvotes?: number | null
          notes?: string | null
          tags?: string | null
          created_at?: string
          updated_at?: string
          niche_id: string
          idea_id?: string | null
        }
        Update: {
          id?: string
          quote?: string
          permalink?: string | null
          subreddit?: string | null
          author?: string | null
          upvotes?: number | null
          notes?: string | null
          tags?: string | null
          created_at?: string
          updated_at?: string
          niche_id?: string
          idea_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "highlights_niche_id_fkey"
            columns: ["niche_id"]
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "highlights_idea_id_fkey"
            columns: ["idea_id"]
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      subreddits: {
        Row: {
          id: string
          name: string
          url: string
          subscriber_count: number
          notes: string | null
          created_at: string
          updated_at: string
          niche_id: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          subscriber_count?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          niche_id: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          subscriber_count?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
          niche_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subreddits_niche_id_fkey"
            columns: ["niche_id"]
            referencedRelation: "niches"
            referencedColumns: ["id"]
          }
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
