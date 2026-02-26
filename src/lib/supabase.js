import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        mode: 'cors',
      });
    },
  },
});

export const handleSupabaseError = (error) => {
  if (!error) return null;
  console.error('Supabase error:', error);
  return error.message || 'An unexpected error occurred';
};

export default supabase;
