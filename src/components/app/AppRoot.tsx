"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ThemeToggle } from "@/components/Header";
import { site } from "@/content/site";
import { DATA_VERIFIED } from "@/lib/nutrition/foods";
import { targetsFor } from "@/lib/nutrition/targets";
import { ensurePlans, loadSample, resetAll, today, useAppState } from "@/lib/store";
import { ChatView } from "./ChatView";
import { MenuView } from "./MenuView";
import { Onboarding } from "./Onboarding";
import { ProgressView } from "./ProgressView";
import { SettingsView } from "./SettingsView";
import { ShoppingView } from "./ShoppingView";
import { TodayView } from "./TodayView";
import { Icon, MemberSwitcher, type ICONS } from "./ui";

type Tab = "hari-ini" | "menu" | "chat" | "progres" | "belanja" | "pengaturan";

const TABS: { id: Tab; label: string; title: string; icon: keyof typeof ICONS }[] = [
  { id: "hari-ini", label: "Hari ini", title: "Hari ini", icon: "today" },
  { id: "menu", label: "Menu", title: "Menu 7 hari", icon: "menu" },
  { id: "chat", label: "Chat", title: "Chat asisten", icon: "chat" },
  { id: "progres", label: "Progres", title: "Progres", icon: "progress" },
  { id: "belanja", label: "Belanja", title: "Daftar belanja", icon: "shopping" },
];
const SETTINGS = { id: "pengaturan" as Tab, label: "Pengaturan", title: "Pengaturan", icon: "settings" as const };

function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

function readHash(): Tab {
  const h = window.location.hash.slice(1) as Tab;
  return [...TABS, SETTINGS].some((t) => t.id === h) ? h : "hari-ini";
}

function navigate(next: Tab) {
  window.location.hash = next;
  window.scrollTo({ top: 0 });
}

export function AppRoot() {
  const state = useAppState();
  const tab = useSyncExternalStore(subscribeHash, readHash, () => "hari-ini" as Tab);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const memberCount = state?.members.length ?? 0;
  useEffect(() => {
    if (memberCount > 0) ensurePlans(today());
  }, [memberCount]);

  // "/app?contoh=1" from the landing page opens the example family, unless this device already has a household.
  const loaded = state !== null;
  useEffect(() => {
    if (!loaded) return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("contoh")) return;
    if (memberCount === 0) loadSample();
    url.searchParams.delete("contoh");
    window.history.replaceState(null, "", url.pathname + url.hash);
  }, [loaded, memberCount]);

  const go = navigate;

  if (!state) {
    return (
      <div className="flex min-h-dvh items-center justify-center" role="status">
        <p className="text-muted">Memuat data keluarga...</p>
      </div>
    );
  }

  if (state.members.length === 0 || !state.acceptedTerms || editing) {
    return (
      <div className="min-h-dvh">
        <header className="border-b border-line">
          <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="text-xl font-bold text-ink">{site.name}</Link>
            <ThemeToggle />
          </div>
        </header>
        {state.members.length === 0 && (
          <div className="mx-auto max-w-2xl px-4 pt-4 sm:px-6">
            <p className="rounded-lg bg-green-soft px-4 py-3 text-sm text-ink">
              Mau lihat-lihat dulu?{" "}
              <button type="button" onClick={() => { loadSample(); go("hari-ini"); }} className="font-semibold text-green underline underline-offset-2">
                Coba dengan keluarga contoh
              </button>
            </p>
          </div>
        )}
        <Onboarding
          members={state.members}
          prefs={state.prefs}
          onDone={() => { setEditing(false); go("hari-ini"); }}
          onCancel={editing ? () => setEditing(false) : undefined}
        />
      </div>
    );
  }

  const date = today();
  const selected = state.members.find((m) => m.id === memberId) ?? state.members.find((m) => targetsFor(m, date).plan) ?? state.members[0];
  const labels = Object.fromEntries(state.members.map((m) => [m.id, targetsFor(m, date).label]));
  const current = [...TABS, SETTINGS].find((t) => t.id === tab)!;
  const perMember = tab === "hari-ini" || tab === "menu" || tab === "progres";

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      {/* Side navigation from tablet width up */}
      <aside className="hidden border-r border-line md:block">
        <div className="sticky top-0 flex h-dvh flex-col gap-1 p-4">
          <Link href="/" className="mb-6 px-3 pt-2 text-xl font-bold text-ink">{site.name}</Link>
          <nav aria-label="Navigasi aplikasi" className="flex flex-col gap-1">
            {[...TABS, SETTINGS].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => go(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-left font-semibold ${tab === t.id ? "bg-green-soft text-green" : "text-muted hover:bg-surface hover:text-ink"}`}
              >
                <Icon name={t.icon} className="h-5 w-5" strokeWidth={tab === t.id ? 2.2 : 1.8} />
                {t.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between px-1">
            <span className="text-sm text-muted">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-accent md:hidden">{site.name}</p>
              <h1 className="truncate text-lg font-bold text-ink md:text-2xl">{current.title}</h1>
            </div>
            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />
              <button type="button" onClick={() => go("pengaturan")} aria-label="Pengaturan" className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-surface">
                <Icon name="settings" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {state.sample && (
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line bg-green-soft px-4 py-2 text-sm text-ink sm:px-6">
            <span>Ini keluarga contoh (Rina dan Kakak).</span>
            <button type="button" onClick={() => { resetAll(); go("hari-ini"); }} className="min-h-9 font-semibold text-green underline underline-offset-2">
              Mulai dengan keluargaku
            </button>
          </div>
        )}
        {!DATA_VERIFIED && (
          <p className="border-b border-line bg-warn-soft px-4 py-2 text-xs text-ink sm:px-6">
            Versi beta: kandungan gizi bahan makanan sedang diverifikasi ahli gizi. <button type="button" onClick={() => go("pengaturan")} className="font-semibold underline">Selengkapnya</button>
          </p>
        )}

        <main className="mx-auto max-w-5xl px-4 pt-4 pb-28 sm:px-6 md:pb-12">
          {perMember && (
            <div className="mb-4">
              <MemberSwitcher members={state.members} value={selected.id} onChange={setMemberId} labels={labels} />
            </div>
          )}
          {tab === "hari-ini" && <TodayView key={selected.id} state={state} member={selected} />}
          {tab === "menu" && <MenuView key={selected.id} state={state} member={selected} />}
          {tab === "chat" && <ChatView state={state} />}
          {tab === "progres" && <ProgressView key={selected.id} state={state} member={selected} />}
          {tab === "belanja" && <ShoppingView state={state} />}
          {tab === "pengaturan" && <SettingsView state={state} onEdit={() => setEditing(true)} />}
        </main>
      </div>

      {/* Bottom navigation on phones: within thumb reach */}
      <nav aria-label="Navigasi aplikasi" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-5">
          {TABS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => go(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold ${tab === t.id ? "text-green" : "text-muted"}`}
              >
                <Icon name={t.icon} strokeWidth={tab === t.id ? 2.2 : 1.7} />
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
