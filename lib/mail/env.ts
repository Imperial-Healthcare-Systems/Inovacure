// Central SMTP env access. Deliberately mirrors lib/supabase/env.ts: it does
// NOT throw at import time, so the site keeps building and running before
// credentials are supplied. Callers gate on `isSmtpConfigured` and degrade to
// the mailto fallback until then.
//
// All four values are server-only — none are NEXT_PUBLIC, and nothing here may
// ever be imported into a client component.

export const smtpHost = process.env.SMTP_HOST ?? "";
export const smtpUser = process.env.SMTP_USER ?? "";
export const smtpPass = process.env.SMTP_PASS ?? "";

/** 0 when unset/unparseable — `isSmtpConfigured` then reads as false. */
export const smtpPort = Number.parseInt(process.env.SMTP_PORT ?? "", 10) || 0;

/**
 * Port 465 is implicit TLS (connection encrypted from the first byte); 587 and
 * 25 start plaintext and upgrade via STARTTLS. Nodemailer calls the former
 * `secure: true`. Getting this backwards is the single most common cause of
 * "connection closed unexpectedly", so it is derived rather than configured.
 */
export const smtpSecure = smtpPort === 465;

/** True once all four SMTP_* vars are present — gates every send. */
export const isSmtpConfigured =
  smtpHost.length > 0 &&
  smtpPort > 0 &&
  smtpUser.length > 0 &&
  smtpPass.length > 0;

/**
 * Names of the vars that are missing, for server-side diagnostics. Never
 * surfaced to the browser — it would tell an attacker what is unconfigured.
 */
export function missingSmtpVars(): string[] {
  const missing: string[] = [];
  if (!smtpHost) missing.push("SMTP_HOST");
  if (!smtpPort) missing.push("SMTP_PORT");
  if (!smtpUser) missing.push("SMTP_USER");
  if (!smtpPass) missing.push("SMTP_PASS");
  return missing;
}
