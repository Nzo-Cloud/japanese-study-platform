import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Supabase Client ─────────────────────────────────────────
// Creates a singleton Supabase client for browser-side use.
// Credentials come from environment variables set in .env.local.
//
// Uses a lazy initialization pattern so the app can build
// even when environment variables aren't set (Vercel first build, CI, etc).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client during build / when credentials are missing.
    // All Supabase calls will fail gracefully at runtime.
    _supabase = createClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    );
    return _supabase;
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

export const supabase = getSupabaseClient();
