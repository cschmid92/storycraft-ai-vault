import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DatabaseConversation {
  id: string
  user1_id: string
  user2_id: string
  book_id?: number
  book_for_sale_id?: string
  status: 'Available' | 'Sold' | 'Picked'
  created_at: string
  updated_at: string
  last_message_id?: string
}

export interface DatabaseMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  type: 'text' | 'status_update' | 'rating_request'
  metadata?: any
  created_at: string
  seen: boolean
}

export interface DatabaseUserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar?: string
  created_at: string
  updated_at: string
}