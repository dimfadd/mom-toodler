"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { fill } from "./Rich";
import { site } from "@/content/site";
import { STAGES, validateWaitlist, type WaitlistErrors, type WaitlistField, type WaitlistInput } from "@/lib/waitlist";

type Status = "idle" | "submitting" | "success" | "error";

/** Fired by the pricing section when there is no payment link yet. */
export const PREORDER_EVENT = "nourish:preorder";

const FIELD_ORDER: WaitlistField[] = ["name", "email", "whatsapp", "stage", "consent"];

const inputClass =
  "mt-1.5 block h-12 w-full rounded-lg border bg-bg px-3 text-base text-ink placeholder:text-muted aria-[invalid=true]:border-accent";

export function SignupForm() {
  const { t, lang } = useLanguage();
  const [values, setValues] = useState({ name: "", email: "", whatsapp: "", stage: "", preorder: false, consent: false });
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitted, setSubmitted] = useState({ name: "", email: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPreorder = () => setValues((v) => ({ ...v, preorder: true }));
    window.addEventListener(PREORDER_EVENT, onPreorder);
    return () => window.removeEventListener(PREORDER_EVENT, onPreorder);
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as WaitlistField]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const honeypot = (new FormData(event.currentTarget).get("website") as string) ?? "";
    const input: WaitlistInput = { ...values, stage: values.stage as WaitlistInput["stage"], lang };
    const found = validateWaitlist(input);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website: honeypot }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubmitted({ name: values.name.trim(), email: values.email.trim() });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setValues({ name: "", email: "", whatsapp: "", stage: "", preorder: false, consent: false });
    setErrors({});
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <p className="font-display text-2xl font-semibold text-ink">{fill(t.form.successTitle, { name: submitted.name })}</p>
        <p className="mt-2 text-muted">{fill(t.form.successBody, { email: submitted.email })}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center rounded-lg border border-line px-4 font-semibold text-ink hover:bg-bg"
        >
          {t.form.again}
        </button>
      </div>
    );
  }

  const busy = status === "submitting";
  const errorId = (field: WaitlistField) => (errors[field] ? `${field}-error` : undefined);
  const errorText = (field: WaitlistField) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-sm font-medium text-accent">
        {t.form.errors[field]}
      </p>
    ) : null;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-semibold text-ink">{t.form.name}</label>
          <input
            id="name" name="name" autoComplete="given-name" value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined} aria-describedby={errorId("name")}
            className={`${inputClass} border-line`}
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-ink">{t.form.email}</label>
          <input
            id="email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined} aria-describedby={errorId("email")}
            className={`${inputClass} border-line`}
          />
          {errorText("email")}
        </div>
        <div>
          <label htmlFor="whatsapp" className="text-sm font-semibold text-ink">{t.form.whatsapp}</label>
          <input
            id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder="0812..." value={values.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            aria-invalid={errors.whatsapp ? true : undefined} aria-describedby={errorId("whatsapp")}
            className={`${inputClass} border-line`}
          />
          {errorText("whatsapp")}
        </div>
        <div>
          <label htmlFor="stage" className="text-sm font-semibold text-ink">{t.form.stage}</label>
          <select
            id="stage" name="stage" value={values.stage}
            onChange={(e) => update("stage", e.target.value)}
            aria-invalid={errors.stage ? true : undefined} aria-describedby={errorId("stage")}
            className={`${inputClass} border-line`}
          >
            <option value="" disabled>{t.form.stagePlaceholder}</option>
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>{t.form.stages[stage]}</option>
            ))}
          </select>
          {errorText("stage")}
        </div>
      </div>

      {/* Honeypot for bots. Hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 space-y-3">
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[15px] text-ink">
          <input
            type="checkbox" name="preorder" checked={values.preorder}
            onChange={(e) => update("preorder", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--green)]"
          />
          <span>{t.form.preorder}</span>
        </label>
        <div>
          <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[15px] text-ink">
            <input
              type="checkbox" name="consent" checked={values.consent}
              onChange={(e) => update("consent", e.target.checked)}
              aria-invalid={errors.consent ? true : undefined} aria-describedby={errorId("consent")}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--green)]"
            />
            <span>{t.form.consent}</span>
          </label>
          {errorText("consent")}
        </div>
      </div>

      {status === "error" && (
        <div role="alert" className="mt-6 rounded-lg border border-accent bg-accent-soft p-4 text-[15px] text-ink">
          <p className="font-semibold">{t.form.errorGeneric}</p>
          {site.contactEmail && (
            <p className="mt-1">
              {t.form.errorContact.split("{email}")[0]}
              <a href={`mailto:${site.contactEmail}`} className="font-semibold underline">{site.contactEmail}</a>
              {t.form.errorContact.split("{email}")[1]}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-green px-6 text-base font-semibold text-on-green hover:opacity-90 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {busy && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {busy ? t.form.submitting : t.form.submit}
      </button>
    </form>
  );
}
