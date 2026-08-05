import type { EnquiryTrack } from "@/lib/db/types";

// Single source of truth for the enquiry intent tracks (brief: export buyers ·
// distributors/PCD · doctors/prescribers · general).
//
// This copy previously lived only inside EnquiryPanel, which meant the server
// had just the bare track key — so the emailed subject line and the label the
// visitor actually clicked could drift apart. The client form (labels, hints),
// the server action (validation) and the mailer (subject line) now all read
// from here. `import type` keeps this safe to pull into a client component.

export type EnquiryTrackDef = {
  key: EnquiryTrack;
  /** Tab label in the form. */
  label: string;
  /** Sub-label under the tab. */
  desc: string;
  /** Bracketed prefix on the notification email's subject line. */
  subject: string;
  /** Placeholder text for the message field. */
  hint: string;
};

export const ENQUIRY_TRACKS = [
  {
    key: "export",
    label: "Export buyer",
    desc: "International distribution & registration",
    subject: "Export enquiry",
    hint: "Your market, products of interest and volumes",
  },
  {
    key: "distributor",
    label: "Distributor / PCD",
    desc: "Territory distribution within India",
    subject: "Distribution enquiry",
    hint: "Your territory, channel and current lines",
  },
  {
    key: "doctor",
    label: "Doctor / Pharmacy",
    desc: "Product information & stocking",
    subject: "Clinician & pharmacy enquiry",
    hint: "Your practice or pharmacy and products of interest",
  },
  {
    key: "general",
    label: "Something else",
    desc: "Careers, media, anything at all",
    subject: "General enquiry",
    hint: "Tell us what brings you here",
  },
] as const satisfies readonly EnquiryTrackDef[];

/** The fallback track for anything unrecognised. */
export const DEFAULT_TRACK: EnquiryTrackDef = ENQUIRY_TRACKS[3];

/** Resolve a raw (untrusted) track key to a definition — never throws. */
export function resolveTrack(key: string | undefined): EnquiryTrackDef {
  return ENQUIRY_TRACKS.find((t) => t.key === key) ?? DEFAULT_TRACK;
}
