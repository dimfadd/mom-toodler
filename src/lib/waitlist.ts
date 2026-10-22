// Shared by the signup form (client) and the API route (server), so both validate the same way.

export const STAGES = ["planning", "pregnant", "breastfeeding", "mpasi", "older"] as const;
export type Stage = (typeof STAGES)[number];

export type WaitlistInput = {
  name: string;
  email: string;
  whatsapp: string;
  stage: Stage | "";
  preorder: boolean;
  consent: boolean;
  lang: "id" | "en";
};

export type WaitlistField = "name" | "email" | "whatsapp" | "stage" | "consent";
export type WaitlistErrors = Partial<Record<WaitlistField, true>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepts 08xx, +628xx, or 628xx with optional spaces and dashes. */
export function normalizeWhatsapp(raw: string): string {
  return raw.replace(/[\s-]/g, "").replace(/^\+/, "");
}

export function validateWaitlist(input: WaitlistInput): WaitlistErrors {
  const errors: WaitlistErrors = {};
  const name = input.name.trim();
  if (name.length < 1 || name.length > 60) errors.name = true;
  if (!EMAIL.test(input.email.trim()) || input.email.length > 120) errors.email = true;
  const wa = normalizeWhatsapp(input.whatsapp);
  if (wa && !/^\d{9,15}$/.test(wa)) errors.whatsapp = true;
  if (!STAGES.includes(input.stage as Stage)) errors.stage = true;
  if (!input.consent) errors.consent = true;
  return errors;
}
