import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, EnquiryTrack } from "./types";

// Data-access for enquiries. Pure functions that take a client — the caller
// (server action) decides which client (RLS-respecting server client is enough;
// the "enquiries insert" policy allows anonymous submits).

export type NewEnquiry = {
  track: EnquiryTrack;
  name: string;
  organisation?: string | null;
  email?: string | null;
  phone?: string | null;
  message: string;
};

export async function createEnquiry(
  supabase: SupabaseClient<Database>,
  input: NewEnquiry,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("enquiries").insert({
    track: input.track,
    name: input.name,
    organisation: input.organisation ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    message: input.message,
    source: "website",
  });
  return { error: error ? error.message : null };
}
