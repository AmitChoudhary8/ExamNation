import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug: Check if variables are loaded
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// Error handling
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseKey);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
