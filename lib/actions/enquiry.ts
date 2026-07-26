"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createEnquiry } from "@/lib/db/enquiries";
import type { EnquiryTrack } from "@/lib/db/types";

// Server action behind the public enquiry form. Persists to Supabase when
// configured; otherwise returns `unconfigured` so the UI falls back to composing
// an email (progressive enhancement — the form always works).

const TRACKS: EnquiryTrack[] = ["export", "distributor", "doctor", "general"];

export type EnquiryInput = {
  track: string;
  name: string;
  organisation?: string;
  email?: string;
  message: string;
};

export type EnquiryResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "invalid" | "error"; message?: string };

export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  const name = (input.name ?? "").trim();
  const message = (input.message ?? "").trim();
  const track: EnquiryTrack = TRACKS.includes(input.track as EnquiryTrack)
    ? (input.track as EnquiryTrack)
    : "general";

  if (name.length < 2 || message.length < 5) {
    return { ok: false, reason: "invalid", message: "Add your name and a short message." };
  }

  if (!isSupabaseConfigured) return { ok: false, reason: "unconfigured" };
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, reason: "unconfigured" };

  const { error } = await createEnquiry(supabase, {
    track,
    name,
    organisation: input.organisation?.trim() || null,
    email: input.email?.trim() || null,
    message,
  });
  if (error) return { ok: false, reason: "error", message: "Could not submit right now." };
  return { ok: true };
}
