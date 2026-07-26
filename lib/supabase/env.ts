// Central Supabase env access. Deliberately does NOT throw at import time so the
// site keeps building and running before credentials are supplied — callers use
// `isSupabaseConfigured` (public) / `hasServiceRole` (server) to degrade
// gracefully until then.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Server-only. The service role bypasses RLS — never expose to the browser. */
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True once a public URL + anon key are present — gates browser/SSR access. */
export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

/** True once the service-role key is present — gates privileged server writes. */
export const hasServiceRole =
  isSupabaseConfigured && supabaseServiceRoleKey.length > 0;
