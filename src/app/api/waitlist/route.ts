import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { normalizeWhatsapp, validateWaitlist, type WaitlistInput } from "@/lib/waitlist";

/*
  Where sign-ups go:
  1. WAITLIST_WEBHOOK_URL set: the entry is POSTed there as JSON
     (for example a Google Apps Script that appends a row to Google Sheets).
  2. Not set: the entry is appended to .data/waitlist.jsonl. Works on a normal server,
     not on read-only hosting such as Vercel, where the route answers 503 instead.
*/

export async function POST(request: Request) {
  let body: Partial<WaitlistInput> & { website?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill the "website" field.
  if (body.website) return Response.json({ ok: true });

  const input: WaitlistInput = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    whatsapp: String(body.whatsapp ?? ""),
    stage: (body.stage ?? "") as WaitlistInput["stage"],
    preorder: body.preorder === true,
    consent: body.consent === true,
    lang: body.lang === "en" ? "en" : "id",
  };

  const errors = validateWaitlist(input);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, error: "validation", fields: Object.keys(errors) }, { status: 422 });
  }

  const entry = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    whatsapp: normalizeWhatsapp(input.whatsapp),
    stage: input.stage,
    preorder: input.preorder,
    lang: input.lang,
    consentAt: new Date().toISOString(),
  };

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } else {
      const dir = path.join(process.cwd(), ".data");
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, "waitlist.jsonl"), JSON.stringify(entry) + "\n", "utf8");
    }
  } catch (error) {
    console.error("waitlist: could not store entry", error);
    return Response.json({ ok: false, error: "storage" }, { status: 503 });
  }

  return Response.json({ ok: true });
}
