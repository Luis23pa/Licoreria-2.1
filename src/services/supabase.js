import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    '[Supabase] Las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están definidas en el entorno. Por favor, crea un archivo .env.local basándote en .env.example.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
