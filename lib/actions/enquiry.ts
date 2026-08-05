"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createEnquiry } from "@/lib/db/enquiries";
import { sendEnquiryEmail } from "@/lib/mail/enquiry";
import { resolveTrack } from "@/lib/site/enquiry-tracks";

// Server action behind the public enquiry form.
//
// Delivery is EMAIL (SMTP → COMPANY.email); that send decides whether the
// submission succeeded. The Supabase write is kept as a best-effort side
// effect: it no-ops while the DB is unconfigured, and a failure there never
// costs the visitor their enquiry. If SMTP is unreachable the action reports
// back so the UI can fall back to composing a mailto — the enquiry is never
// silently dropped.

const MAX = { name: 120, org: 160, email: 254, message: 5000 } as const;

export type EnquiryInput = {
  track: string;
  name: string;
  organisation?: string;
  email?: string;
  message: string;
  /** Honeypot — must stay empty. Hidden from humans, irresistible to bots. */
  website?: string;
};

export type EnquiryResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "invalid" | "error"; message?: string };

export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  // Bot check first — costs nothing and skips all downstream work. Reported as
  // success so a scripted submitter gets no signal that it was filtered.
  if ((input.website ?? "").trim().length > 0) return { ok: true };

  const name = (input.name ?? "").trim().slice(0, MAX.name);
  const message = (input.message ?? "").trim().slice(0, MAX.message);
  const organisation = (input.organisation ?? "").trim().slice(0, MAX.org);
  const email = (input.email ?? "").trim().slice(0, MAX.email);
  const track = resolveTrack(input.track).key;

  if (name.length < 2 || message.length < 5) {
    return { ok: false, reason: "invalid", message: "Add your name and a short message." };
  }

  // Best-effort persistence. Never gates the reply to the visitor.
  if (isSupabaseConfigured) {
    try {
      const supabase = await getSupabaseServerClient();
      if (supabase) {
        const { error } = await createEnquiry(supabase, {
          track,
          name,
          organisation: organisation || null,
          email: email || null,
          message,
        });
        if (error) console.error("[enquiry] Supabase write failed:", error);
      }
    } catch (err) {
      console.error("[enquiry] Supabase write threw:", err);
    }
  }

  const sent = await sendEnquiryEmail({
    track,
    name,
    organisation: organisation || null,
    email: email || null,
    message,
  });

  if (sent.ok) return { ok: true };

  // `unconfigured` (no SMTP_* vars) and `error` (send failed) both send the UI
  // to its mailto fallback. Deliberately vague: the browser learns nothing
  // about the mail server's state.
  return {
    ok: false,
    reason: sent.reason,
    message: "Could not send right now.",
  };
}
