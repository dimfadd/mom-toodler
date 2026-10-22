"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "./LanguageProvider";
import type { Lang } from "@/content/copy";

type Theme = "light" | "dark";

const THEME_EVENT = "nourish:theme";

// The inline script in layout.tsx sets data-theme before paint; this reads it.
function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeTheme(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function ThemeToggle() {
  const { t } = useLanguage();
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("nourish-theme", next);
    } catch {}
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  const label = theme === "dark" ? t.nav.themeToLight : t.nav.themeToDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-surface"
    >
      {theme === "dark" ? (
        // Sun
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
        </svg>
      ) : (
        // Moon
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage();
  const options: Lang[] = ["id", "en"];
  return (
    <div role="group" aria-label={t.nav.language} className="flex rounded-lg border border-line p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className={`h-10 min-w-11 rounded-md px-2 text-sm font-semibold uppercase ${
            lang === option ? "bg-ink text-bg" : "text-muted hover:text-ink"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and returns focus to its button.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "#fitur", label: t.nav.features },
    { href: "#rujukan", label: t.nav.trust },
    { href: "#harga", label: t.nav.pricing },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Nourish
        </a>

        <nav aria-label="Utama" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-[15px] font-medium text-muted hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitch />
          <ThemeToggle />
          <a
            href="#daftar"
            className="hidden h-11 items-center rounded-lg bg-green px-4 text-[15px] font-semibold text-on-green hover:opacity-90 sm:inline-flex"
          >
            {t.nav.cta}
          </a>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-surface md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Utama" className="border-t border-line px-4 pb-4 md:hidden">
          <ul className="flex flex-col">
            {[...links, { href: "#daftar", label: t.nav.cta }].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center border-b border-line text-base font-medium text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
