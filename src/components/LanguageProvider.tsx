"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { copy, type Copy, type Lang } from "@/content/copy";

type LanguageContextValue = {
  lang: Lang;
  t: Copy;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "app-lang";
const CHANGE_EVENT = "app:lang";

// The visitor's choice lives in localStorage. Storage can be blocked, so the choice is also kept in memory.
let chosen: Lang | null = null;

function readLang(): Lang {
  if (chosen) return chosen;
  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "id";
  } catch {
    return "id";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function LanguageProvider({ children, setTitle = true }: { children: React.ReactNode; setTitle?: boolean }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "id" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (setTitle) document.title = copy[lang].meta.title;
  }, [lang, setTitle]);

  const setLang = useCallback((next: Lang) => {
    chosen = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: copy[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
