"use client";

import { Fragment } from "react";
import { useLanguage } from "./LanguageProvider";

/** Replaces {key} placeholders with values. */
export function fill(text: string, vars: Record<string, string | number> = {}): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** A citation marker that jumps to the matching source in the footer. */
export function Cite({ n }: { n: number }) {
  const { t } = useLanguage();
  return (
    <a
      href={`#ref-${n}`}
      aria-label={fill(t.footer.cite, { n })}
      className="ml-0.5 inline-flex min-w-[1.4rem] items-center justify-center rounded-md bg-accent-soft px-1 align-[0.15em] text-[0.7em] leading-[1.5] font-semibold text-accent tabular-nums no-underline hover:underline"
    >
      {n}
    </a>
  );
}

/** Renders copy text, turning [[n]] markers into citation links and filling {key} placeholders. */
export function Rich({ text, vars }: { text: string; vars?: Record<string, string | number> }) {
  const parts = fill(text, vars).split(/(\[\[\d+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[\[(\d+)\]\]$/);
        if (match) return <Cite key={i} n={Number(match[1])} />;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
