"use client";

import type { ReactNode } from "react";
import { NUTRIENT_INFO, type Member, type NutrientKey, type Nutrients } from "@/lib/nutrition/types";
import { percentOf } from "@/lib/nutrition/planner";
import { ageInMonths } from "@/lib/nutrition/targets";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function Title({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-ink">{children}</h2>
      {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "quiet" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function Button({ children, onClick, variant = "primary", type = "button", disabled, className = "", ariaLabel }: ButtonProps) {
  const styles = {
    primary: "bg-green text-on-green hover:opacity-90",
    ghost: "border border-line text-ink hover:bg-bg",
    quiet: "text-green underline underline-offset-4",
    danger: "bg-danger text-bg hover:opacity-90",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${variant === "quiet" ? "" : "px-4"} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Check({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Alert({ tone = "info", title, children }: { tone?: "info" | "warn" | "danger"; title?: string; children: ReactNode }) {
  const styles = {
    info: "bg-green-soft text-ink",
    warn: "bg-warn-soft text-ink",
    danger: "border border-danger bg-danger-soft text-ink",
  }[tone];
  const titleColor = { info: "text-green", warn: "text-warn", danger: "text-danger" }[tone];
  return (
    <div className={`rounded-2xl p-4 text-[15px] leading-relaxed ${styles}`} role={tone === "danger" ? "alert" : undefined}>
      {title && <p className={`mb-1 font-bold ${titleColor}`}>{title}</p>}
      {children}
    </div>
  );
}

/* ---------- Nutrient display ---------- */

export function displayKeys(member: Member): NutrientKey[] {
  if (member.role === "anak") {
    return ["energi", "protein", "besi", "kalsium", "lemak"];
  }
  return ["energi", "protein", "besi", "kalsium", "serat"];
}

export function isInfant(member: Member, on: string): boolean {
  return member.role === "anak" && ageInMonths(member.birthDate, on) < 12;
}

// A nearly closed ring pulls people to finish it (goal-gradient effect); one number per day.
export function Ring({ value, label = "dari target" }: { value: number; label?: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const shown = Math.min(Math.max(value, 0), 100);
  return (
    <svg viewBox="0 0 128 128" className="h-32 w-32 shrink-0" role="img" aria-label={`${value}% ${label}`}>
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--line)" strokeWidth="12" />
      <circle
        cx="64" cy="64" r={r} fill="none" stroke="var(--green)" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${(shown / 100) * c} ${c}`} transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dasharray 400ms ease" }}
      />
      <text x="64" y="64" textAnchor="middle" className="fill-ink" fontSize="28" fontWeight="700">{value}%</text>
      <text x="64" y="84" textAnchor="middle" className="fill-muted" fontSize="11">{label}</text>
    </svg>
  );
}

export function NutrientBars({ keys, eaten, targets }: { keys: NutrientKey[]; eaten: Nutrients; targets: Nutrients }) {
  return (
    <ul className="w-full space-y-2.5">
      {keys.map((k) => {
        const pct = percentOf(eaten[k], targets[k]);
        const done = pct >= 100;
        const info = NUTRIENT_INFO[k];
        return (
          <li key={k}>
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="font-semibold text-ink">{info.label}</span>
              <span className={`flex items-center gap-1 tabular-nums ${done ? "font-semibold text-green" : "text-muted"}`}>
                {done && <Check className="h-3.5 w-3.5" />}
                {format(eaten[k])} / {format(targets[k])} {info.unit}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="h-full rounded-full bg-green" style={{ width: `${Math.min(pct, 100)}%`, transition: "width 400ms ease" }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function format(n: number): string {
  return n >= 100 ? Math.round(n).toLocaleString("id-ID") : (Math.round(n * 10) / 10).toLocaleString("id-ID");
}

export function rupiah(n: number): string {
  return "Rp" + (Math.round(n / 500) * 500).toLocaleString("id-ID");
}

export const SOURCES: Partial<Record<NutrientKey, string>> = {
  protein: "telur, ikan, ayam, tempe, dan tahu",
  besi: "daging sapi, ikan, bayam, daun kelor, dan kacang merah",
  kalsium: "susu, keju, yogurt, tahu, dan daun kelor",
  serat: "sayur, buah, kacang hijau, dan nasi merah",
  lemak: "alpukat, santan, ikan, dan telur",
};

/* ---------- Member switcher ---------- */

export function MemberSwitcher({ members, value, onChange, labels }: { members: Member[]; value: string; onChange: (id: string) => void; labels: Record<string, string> }) {
  if (members.length < 2) return null;
  return (
    <div role="group" aria-label="Pilih anggota keluarga" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {members.map((m) => (
        <button
          key={m.id}
          type="button"
          aria-pressed={value === m.id}
          onClick={() => onChange(m.id)}
          className={`min-h-11 shrink-0 rounded-lg px-3.5 text-left text-sm font-semibold ${value === m.id ? "bg-ink text-bg" : "border border-line text-ink hover:bg-surface"}`}
        >
          {m.name}
          <span className={`block text-xs font-normal ${value === m.id ? "opacity-80" : "text-muted"}`}>{labels[m.id]}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Icons for navigation ---------- */

export const ICONS = {
  today: <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" strokeLinejoin="round" />,
  menu: <path d="M5 5h14M5 12h14M5 19h9" strokeLinecap="round" />,
  chat: <path d="M4 5h16v11H9l-5 4z" strokeLinejoin="round" />,
  progress: <path d="M5 20V12M12 20V5M19 20v-6" strokeLinecap="round" />,
  shopping: <path d="M5 8h14l-1.5 12h-11zM9 8a3 3 0 0 1 6 0" strokeLinejoin="round" />,
  // Sliders, so it is never confused with the sun icon of the theme toggle.
  settings: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" strokeLinecap="round" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
};

export function Icon({ name, className = "h-6 w-6", strokeWidth = 1.8 }: { name: keyof typeof ICONS; className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}
