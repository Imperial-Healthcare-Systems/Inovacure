import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/db/types";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

// Server (RSC / route handler / server action) Supabase client, bound to the
// request cookies so an authenticated session is respected and refreshed. Runs
// under RLS with the anon key. Returns null until configured.
export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // setAll from a Server Component is a no-op (read-only cookies);
          // session refresh is handled in middleware. Safe to ignore.
        }
      },
    },
  });
}
