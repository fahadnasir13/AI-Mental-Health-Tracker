import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  created_at: string
}

export type MoodLog = {
  id: string
  user_id: string
  mood: number
  stress_level: 'low' | 'medium' | 'high'
  journal_entry?: string
  ai_response?: string
  ai_conversation?: AIMessage[]
  emergency_detected?: boolean
  created_at: string
}

export type AIMessage = {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type UserSettings = {
  id: string
  user_id: string
  ai_persona: 'therapist' | 'coach' | 'spiritual' | 'friend'
  language: string
  notifications_enabled: boolean
  emergency_contacts?: string[]
  created_at: string
  updated_at: string
}

export type Achievement = {
  id: string
  user_id: string
  type: 'streak' | 'milestone' | 'first_time'
  title: string
  description: string
  icon: string
  earned_at: string
}