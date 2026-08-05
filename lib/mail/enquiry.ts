import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import {
  isSmtpConfigured,
  missingSmtpVars,
  smtpHost,
  smtpPass,
  smtpPort,
  smtpSecure,
  smtpUser,
} from "./env";
import { COMPANY } from "@/lib/site/company";
import { resolveTrack } from "@/lib/site/enquiry-tracks";
import type { EnquiryTrack } from "@/lib/db/types";

// Delivery for public enquiry submissions. Every enquiry form on the site
// funnels into this one send (there is only one real form — /contact's
// EnquiryPanel — and every other page's enquiry CTA links to it).
//
// Notifications go to COMPANY.email, so the destination stays in the same
// single-source-of-truth file as the rest of the contact facts.

export type EnquiryMailInput = {
  track: EnquiryTrack;
  name: string;
  organisation?: string | null;
  email?: string | null;
  message: string;
};

// ---- Injection guards -------------------------------------------------------

/**
 * Header values must never contain CR/LF: a newline in a subject or address
 * lets a submitter append arbitrary SMTP headers (Bcc:, etc.) and turn the form
 * into an open relay. Collapse all whitespace and clamp the length.
 */
function headerSafe(value: string, max = 200): string {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, max);
}

/** Escape before interpolating submitter text into the HTML part. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Conservative address check. Only a well-formed single address is used as
 * Reply-To — anything else is dropped (the address still appears in the body,
 * so nothing is lost, but it can't corrupt the envelope).
 */
function safeReplyTo(value: string | null | undefined): string | undefined {
  const v = (value ?? "").trim();
  if (!v || v.length > 254) return undefined;
  return /^[^\s@<>,;:"'\\[\]]+@[^\s@<>,;:"'\\[\]]+\.[a-z]{2,}$/i.test(v) ? v : undefined;
}

// ---- Transport --------------------------------------------------------------

let transporter: Transporter | null = null;

function getTransport(): Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure, // 465 = implicit TLS; 587/25 = STARTTLS (see ./env)
    auth: { user: smtpUser, pass: smtpPass },
    // A server action blocks the user's request, so never hang on a dead host.
    // Kept under 10s in total because serverless hosts kill the function at
    // their max-duration limit (10s on Vercel's Hobby plan) — past that the
    // visitor gets a hard error instead of the graceful mailto fallback.
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 8_000,
  });
  return transporter;
}

// ---- Send -------------------------------------------------------------------

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "error" };

export async function sendEnquiryEmail(
  input: EnquiryMailInput,
): Promise<SendResult> {
  if (!isSmtpConfigured) {
    console.warn(
      `[enquiry] SMTP not configured — missing ${missingSmtpVars().join(", ")}. ` +
        "Falling back to the client-side mailto compose.",
    );
    return { ok: false, reason: "unconfigured" };
  }

  const track = resolveTrack(input.track);
  const name = headerSafe(input.name, 120);
  const org = headerSafe(input.organisation ?? "", 120);
  const replyTo = safeReplyTo(input.email);
  const emailShown = (input.email ?? "").trim() || "— not supplied —";

  const receivedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const subject = headerSafe(`[${track.subject}] ${org || name}`);

  const rows: [string, string][] = [
    ["Track", track.label],
    ["Name", name],
    ["Organisation", org || "— not supplied —"],
    ["Email", emailShown],
    ["Received", `${receivedAt} IST`],
  ];

  const text = [
    "New website enquiry",
    "",
    ...rows.map(([k, v]) => `${k.padEnd(13)}${v}`),
    "",
    "Message",
    "-------",
    input.message.trim(),
    "",
    "--",
    `Sent by the enquiry form at ${COMPANY.website}`,
    replyTo
      ? "Reply directly to this email to answer the sender."
      : "No email address was supplied — this enquiry cannot be answered by reply.",
  ].join("\n");

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#10243f;line-height:1.55">
  <p style="margin:0 0 4px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#4f8a37"><strong>New website enquiry</strong></p>
  <h2 style="margin:0 0 18px;font-size:19px;color:#10243f">${esc(track.label)}</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin-bottom:20px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 18px 4px 0;color:#48586c;vertical-align:top;white-space:nowrap">${esc(
            k,
          )}</td><td style="padding:4px 0;vertical-align:top"><strong>${esc(v)}</strong></td></tr>`,
      )
      .join("\n    ")}
  </table>
  <div style="border-left:3px solid #58963d;padding:2px 0 2px 14px;margin-bottom:22px">
    <p style="margin:0;white-space:pre-wrap;font-size:14px">${esc(input.message.trim())}</p>
  </div>
  <p style="margin:0;font-size:12px;color:#48586c;border-top:1px solid #e3e9f1;padding-top:12px">
    Sent by the enquiry form at ${esc(COMPANY.website)}.
    ${
      replyTo
        ? "Reply directly to this email to answer the sender."
        : "No email address was supplied &mdash; this enquiry cannot be answered by reply."
    }
  </p>
</div>`;

  try {
    await getTransport().sendMail({
      // From MUST stay the authenticated mailbox — most providers (Google
      // Workspace, Zoho, Titan) reject or silently rewrite a mismatched From,
      // and a spoofed one fails SPF/DMARC. The sender's own address rides in
      // Reply-To instead, so "Reply" in the client still reaches them.
      from: { name: "Inovacure Website", address: smtpUser },
      to: COMPANY.email,
      replyTo,
      subject,
      text,
      html,
    });
    return { ok: true };
  } catch (err) {
    // Log server-side only; the caller returns a generic message so SMTP
    // topology and credential state never leak to the browser.
    console.error("[enquiry] SMTP send failed:", err);
    return { ok: false, reason: "error" };
  }
}
