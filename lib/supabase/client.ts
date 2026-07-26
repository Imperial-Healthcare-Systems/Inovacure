"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db/types";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

// Browser (client-component) Supabase client. Reads run against RLS-protected
// tables with the anon key. Returns null until configured so importing this
// never throws in an un-provisioned build.
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) return null;
  browserClient ??= createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
