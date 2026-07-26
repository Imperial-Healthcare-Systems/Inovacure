import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db/types";
import { hasServiceRole, supabaseServiceRoleKey, supabaseUrl } from "./env";

// PRIVILEGED server-only client using the service-role key. It BYPASSES RLS, so
// use it ONLY in trusted server code (server actions / route handlers) for
// operations that must not be limited by the caller's row-level permissions
// (e.g. writing an order during checkout, recording an enquiry). Never import
// this into a client component. Returns null until the service key is present.
let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdminClient() {
  if (!hasServiceRole) return null;
  adminClient ??= createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
