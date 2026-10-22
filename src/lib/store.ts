"use client";

// Household data lives on the device (localStorage) until accounts and sync are added.
// One store, read with useSyncExternalStore, written through the actions below.

import { useSyncExternalStore } from "react";
import { DISH_BY_ID } from "./nutrition/dishes";
import { planDay, swapMeal, type Wish } from "./nutrition/planner";
import { ageInMonths, childStage } from "./nutrition/targets";
import type { DayPlan, Member, MealLog, Preferences, Slot } from "./nutrition/types";

export type Measurement = { date: string; weightKg?: number; lengthCm?: number };

export type ChatEntry = { from: "user" | "bot"; text: string; danger?: boolean; at: string };

export type AppState = {
  version: 1;
  members: Member[];
  prefs: Preferences;
  plans: Record<string, Record<string, DayPlan | null>>; // date -> memberId -> plan
  logs: Record<string, Record<string, Partial<Record<Slot, MealLog>>>>; // date -> memberId -> slot -> log
  measurements: Record<string, Measurement[]>; // memberId -> list
  chat: ChatEntry[];
  acceptedTerms: boolean;
};

const KEY = "mommyplate-v1";
const EVENT = "mommyplate:state";

const EMPTY: AppState = {
  version: 1,
  members: [],
  prefs: { avoid: [], allergens: [], likesSpicy: true, weeklyBudget: 1_000_000 },
  plans: {},
  logs: {},
  measurements: {},
  chat: [],
  acceptedTerms: false,
};

let cache: AppState | null = null;
let raw: string | null = null;

function read(): AppState {
  let current: string | null = null;
  try {
    current = localStorage.getItem(KEY);
  } catch {}
  if (cache && current === raw) return cache;
  raw = current;
  try {
    cache = current ? { ...EMPTY, ...(JSON.parse(current) as AppState) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: AppState) {
  cache = next;
  try {
    raw = JSON.stringify(next);
    localStorage.setItem(KEY, raw);
  } catch {
    // Storage full or blocked: keep working in memory for this session.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useAppState(): AppState | null {
  // Server render has no storage: null means "not loaded yet".
  return useSyncExternalStore(subscribe, read, () => null);
}

export function getState(): AppState {
  return read();
}

function update(fn: (s: AppState) => AppState) {
  write(fn(read()));
}

/* ---------- Dates ---------- */

export function today(): string {
  return toISO(new Date());
}

export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return toISO(d);
}

/* ---------- Planning ---------- */

function recentDishes(s: AppState, memberId: string, date: string): Set<string> {
  const set = new Set<string>();
  for (const back of [1, 2]) {
    const p = s.plans[addDays(date, -back)]?.[memberId];
    p?.meals.forEach((m) => set.add(m.dishId));
  }
  return set;
}

function plannedCount(s: AppState): number {
  return s.members.length;
}

/** Make sure plans exist for `days` days starting at `from`. Mothers are planned first so children can share dishes. */
export function ensurePlans(from: string, days = 7) {
  const s = read();
  if (s.members.length === 0) return;
  let changed = false;
  const plans = { ...s.plans };
  const ordered = [...s.members].sort((a, b) => (a.role === "ibu" ? -1 : b.role === "ibu" ? 1 : 0));
  for (let i = 0; i < days; i++) {
    const date = addDays(from, i);
    const day = { ...(plans[date] ?? {}) };
    for (const member of ordered) {
      if (member.id in day) continue;
      const mother = ordered.find((m) => m.role === "ibu");
      const shared = new Map<Slot, string>();
      if (member.role === "anak" && mother && day[mother.id] && childStage(ageInMonths(member.birthDate, date)) === "keluarga") {
        day[mother.id]!.meals.forEach((m) => {
          if (DISH_BY_ID[m.dishId].childOk) shared.set(m.slot, m.dishId);
        });
      }
      day[member.id] = planDay({
        member,
        date,
        prefs: s.prefs,
        householdSize: plannedCount(s),
        recentDishes: recentDishes({ ...s, plans }, member.id, date),
        sharedDishes: shared,
      });
      changed = true;
    }
    plans[date] = day;
  }
  if (changed) write({ ...s, plans });
}

export function regenerateDay(date: string, memberId: string) {
  update((s) => {
    const member = s.members.find((m) => m.id === memberId);
    if (!member) return s;
    const plan = planDay({
      member,
      date,
      prefs: s.prefs,
      householdSize: plannedCount(s),
      recentDishes: recentDishes(s, memberId, date),
      seed: Date.now() % 100000,
    });
    return { ...s, plans: { ...s.plans, [date]: { ...s.plans[date], [memberId]: plan } } };
  });
}

/** Returns the new dish id, or null when nothing fits. */
export function swap(date: string, memberId: string, slot: Slot, wish: Wish = {}): string | null {
  const s = read();
  const member = s.members.find((m) => m.id === memberId);
  const plan = s.plans[date]?.[memberId];
  if (!member || !plan) return null;
  const next = swapMeal(plan, slot, member, s.prefs, plannedCount(s), wish);
  if (!next) return null;
  write({ ...s, plans: { ...s.plans, [date]: { ...s.plans[date], [memberId]: next } } });
  return next.meals.find((m) => m.slot === slot)?.dishId ?? null;
}

/* ---------- Logs, measurements, chat ---------- */

export function logMeal(date: string, memberId: string, slot: Slot, log: MealLog | null) {
  update((s) => {
    const day = { ...(s.logs[date] ?? {}) };
    const entry = { ...(day[memberId] ?? {}) };
    if (log) entry[slot] = log;
    else delete entry[slot];
    day[memberId] = entry;
    return { ...s, logs: { ...s.logs, [date]: day } };
  });
}

export function addMeasurement(memberId: string, m: Measurement) {
  update((s) => {
    const list = [...(s.measurements[memberId] ?? []).filter((x) => x.date !== m.date), m].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    return { ...s, measurements: { ...s.measurements, [memberId]: list } };
  });
}

export function removeMeasurement(memberId: string, date: string) {
  update((s) => ({
    ...s,
    measurements: { ...s.measurements, [memberId]: (s.measurements[memberId] ?? []).filter((x) => x.date !== date) },
  }));
}

export function pushChat(entry: Omit<ChatEntry, "at">) {
  update((s) => ({ ...s, chat: [...s.chat, { ...entry, at: new Date().toISOString() }].slice(-60) }));
}

export function clearChat() {
  update((s) => ({ ...s, chat: [] }));
}

/* ---------- Household ---------- */

export function saveHousehold(members: Member[], prefs: Preferences) {
  // Changing the household invalidates future plans; past plans and logs stay for history.
  update((s) => {
    const t = today();
    const plans: AppState["plans"] = {};
    for (const [date, v] of Object.entries(s.plans)) if (date < t) plans[date] = v;
    return { ...s, members, prefs, plans, acceptedTerms: true };
  });
  ensurePlans(today());
}

export function resetAll() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  cache = null;
  raw = null;
  window.dispatchEvent(new Event(EVENT));
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}
