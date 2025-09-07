import { createClient } from '@supabase/supabase-js'

// Netlify Environment Variables se Supabase connect karna
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug ke liye
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

// Supabase client banayenge
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
