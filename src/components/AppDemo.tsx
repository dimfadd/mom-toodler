"use client";

// Landing page demo: a phone showing the real app screens for the example family.
// Menus, portions and percentages come from the same nutrition engine as /app, computed in the browser.

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useLanguage } from "./LanguageProvider";
import { overallPercent } from "./app/TodayView";
import { GrowthChart } from "./app/ProgressView";
import { Icon, NutrientBars, Ring, displayKeys, rupiah, type ICONS } from "./app/ui";
import { DISH_BY_ID } from "@/lib/nutrition/dishes";
import { classify, zScore } from "@/lib/nutrition/growth";
import { dishNutrients, eatenNutrients, formatGrams, portionGrams, shoppingList, swapMeal } from "@/lib/nutrition/planner";
import { ageInMonths, targetsFor } from "@/lib/nutrition/targets";
import { SLOT_INFO, type DayPlan, type MealLog, type Member, type Slot } from "@/lib/nutrition/types";
import { SAMPLE_IDS, sampleHousehold } from "@/lib/sample";
import { addDays, fillPlans, today, type AppState } from "@/lib/store";

type Screen = "hari-ini" | "menu" | "chat" | "progres" | "belanja";
const SCREENS: { id: Screen; label: string; icon: keyof typeof ICONS }[] = [
  { id: "hari-ini", label: "Hari ini", icon: "today" },
  { id: "menu", label: "Menu", icon: "menu" },
  { id: "chat", label: "Chat", icon: "chat" },
  { id: "progres", label: "Progres", icon: "progress" },
  { id: "belanja", label: "Belanja", icon: "shopping" },
];

const noop = () => () => {};

function buildState(date: string): AppState {
  const sample = sampleHousehold(date);
  const base: AppState = {
    version: 1,
    members: sample.members,
    prefs: sample.prefs,
    plans: {},
    logs: { [date]: sample.logs },
    measurements: sample.measurements,
    chat: [],
    acceptedTerms: true,
    sample: true,
  };
  return { ...base, plans: fillPlans(base, date).plans };
}

export function AppDemo() {
  const { t } = useLanguage();
  // Dates and menus depend on the visitor's day, so the phone renders after hydration.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [screen, setScreen] = useState<Screen>("hari-ini");
  const steps = t.demo.steps;
  const active = steps.find((s) => s.id === screen) ?? steps[0];

  return (
    <section id="demo" className="scroll-mt-16 border-y border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-24 grid-cols-1 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div className="min-w-0 lg:pt-6">
          <p className="text-[15px] font-semibold text-accent">{t.demo.kicker}</p>
          <h2 className="mt-2 font-display text-[2rem] leading-[1.1] font-semibold tracking-tight text-balance text-ink sm:text-[2.6rem]">{t.demo.title}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{t.demo.body}</p>

          {/* Picking a step changes the phone; on phones this list sits under the phone (see order classes). */}
          <ol className="mt-8 hidden space-y-2 lg:block">
            {steps.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setScreen(s.id as Screen)}
                  aria-pressed={screen === s.id}
                  className={`grid w-full grid-cols-[2rem_1fr] gap-3 rounded-xl border px-4 py-3 text-left ${screen === s.id ? "border-green bg-bg" : "border-transparent hover:bg-bg"}`}
                >
                  <span className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${screen === s.id ? "bg-green text-on-green" : "bg-line text-ink"}`}>{i + 1}</span>
                  <span>
                    <span className="block font-semibold text-ink">{s.title}</span>
                    {screen === s.id && <span className="mt-1 block leading-relaxed text-muted">{s.body}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
            <DemoCtas />
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center">
          {/* Phone-width step picker, above the phone so the change is visible without scrolling. */}
          <div className="-mx-4 mb-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 lg:hidden" role="group" aria-label={t.demo.pick}>
            {steps.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScreen(s.id as Screen)}
                aria-pressed={screen === s.id}
                className={`min-h-11 shrink-0 rounded-lg border px-3 text-sm font-semibold ${screen === s.id ? "border-green bg-green text-on-green" : "border-line bg-bg text-ink"}`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <Phone screen={screen} onScreen={setScreen} mounted={mounted} />

          <p className="mt-4 max-w-[20rem] text-center leading-relaxed text-ink lg:hidden" aria-live="polite">{active.body}</p>
          <p className="mt-3 max-w-[20rem] text-center text-xs text-muted">{t.demo.note}</p>
          <div className="mt-6 flex w-full max-w-[20rem] flex-col gap-3 lg:hidden">
            <DemoCtas />
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoCtas() {
  const { t } = useLanguage();
  return (
    <>
      <Link href="/app?contoh=1" className="inline-flex h-12 items-center justify-center rounded-lg bg-green px-6 text-base font-semibold text-on-green hover:opacity-90">
        {t.demo.tryCta}
      </Link>
      <Link href="/app" className="inline-flex h-12 items-center justify-center rounded-lg border border-line bg-bg px-6 text-base font-semibold text-ink hover:bg-surface">
        {t.demo.startCta}
      </Link>
    </>
  );
}

function Phone({ screen, onScreen, mounted }: { screen: Screen; onScreen: (s: Screen) => void; mounted: boolean }) {
  return (
    <div className="w-[300px] max-w-full rounded-[2.6rem] bg-[#1F2A24] p-2.5 shadow-[0_24px_50px_-28px_rgba(31,42,36,0.6)] ring-1 ring-line sm:w-[320px]">
      <div className="flex h-[600px] flex-col overflow-hidden rounded-[2.1rem] bg-bg text-ink">
        <div className="flex h-7 shrink-0 items-center justify-center" aria-hidden="true">
          <span className="h-1.5 w-16 rounded-full bg-line" />
        </div>
        {mounted ? <DemoApp screen={screen} onScreen={onScreen} /> : <div className="flex-1" />}
      </div>
    </div>
  );
}

function DemoApp({ screen, onScreen }: { screen: Screen; onScreen: (s: Screen) => void }) {
  const date = useMemo(() => today(), []);
  const [state, setState] = useState<AppState>(() => buildState(date));
  const [memberId, setMemberId] = useState<string>(SAMPLE_IDS.mother);
  const member = state.members.find((m) => m.id === memberId)!;
  const title = SCREENS.find((s) => s.id === screen)!.label;

  function setPlan(id: string, plan: DayPlan) {
    setState((s) => ({ ...s, plans: { ...s.plans, [date]: { ...s.plans[date], [id]: plan } } }));
  }
  function log(id: string, slot: Slot, value: MealLog) {
    setState((s) => ({ ...s, logs: { ...s.logs, [date]: { ...s.logs[date], [id]: { ...s.logs[date]?.[id], [slot]: value } } } }));
  }

  return (
    <>
      <div className="shrink-0 border-b border-line px-4 pb-2">
        <p className="text-[11px] font-semibold text-accent">Mommy Plate</p>
        <p className="text-base font-bold">{screen === "progres" ? "Progres Kakak" : title}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 text-[13px]">
        {(screen === "hari-ini" || screen === "menu") && (
          <div className="mb-3 flex gap-1.5" role="group" aria-label="Anggota keluarga">
            {state.members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMemberId(m.id)}
                aria-pressed={m.id === memberId}
                className={`min-h-8 rounded-full border px-3 text-xs font-semibold ${m.id === memberId ? "border-green bg-green-soft text-ink" : "border-line text-muted"}`}
              >
                {m.name}
              </button>
            ))}
          </div>
        )}
        {screen === "hari-ini" && <TodayScreen state={state} member={member} date={date} onLog={log} onSwap={setPlan} />}
        {screen === "menu" && <MenuScreen state={state} member={member} date={date} />}
        {screen === "chat" && <ChatScreen state={state} date={date} onSwap={setPlan} onDone={() => { setMemberId(SAMPLE_IDS.mother); onScreen("hari-ini"); }} />}
        {screen === "progres" && <GrowthScreen state={state} date={date} />}
        {screen === "belanja" && <ShoppingScreen state={state} date={date} />}
      </div>
      <nav aria-label="Navigasi demo" className="shrink-0 border-t border-line">
        <ul className="grid grid-cols-5">
          {SCREENS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onScreen(s.id)}
                aria-current={screen === s.id ? "page" : undefined}
                className={`flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-semibold ${screen === s.id ? "text-green" : "text-muted"}`}
              >
                <Icon name={s.icon} className="h-5 w-5" strokeWidth={screen === s.id ? 2.2 : 1.7} />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

function kcal(plan: DayPlan, slot: Slot) {
  const meal = plan.meals.find((m) => m.slot === slot)!;
  return Math.round(dishNutrients(DISH_BY_ID[meal.dishId], meal.portion).energi);
}

function TodayScreen({ state, member, date, onLog, onSwap }: {
  state: AppState; member: Member; date: string;
  onLog: (id: string, slot: Slot, v: MealLog) => void; onSwap: (id: string, plan: DayPlan) => void;
}) {
  const plan = state.plans[date]?.[member.id];
  const info = targetsFor(member, date);
  if (!plan) return null;
  const logs = state.logs[date]?.[member.id] ?? {};
  const next = plan.meals.find((m) => !logs[m.slot]);
  const eaten = eatenNutrients(plan, logs);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
        <div className="scale-90">
          <Ring value={overallPercent(member, state, date) ?? 0} />
        </div>
        <p className="text-xs leading-relaxed text-muted">Target harian dari AKG 2019 untuk {info.label.toLowerCase()}.</p>
      </div>
      {next ? (
        <div className="rounded-2xl border border-green bg-surface p-3">
          <p className="text-xs font-semibold text-accent">Berikutnya · {SLOT_INFO[next.slot].time}</p>
          <p className="mt-1 font-semibold">{DISH_BY_ID[next.dishId].name}</p>
          <p className="mt-1 text-xs text-muted">
            {portionGrams(DISH_BY_ID[next.dishId], next.portion).slice(0, 3).map((g) => `${g.name} ${g.grams} g`).join(", ")} · {kcal(plan, next.slot)} kkal
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => onLog(member.id, next.slot, "habis")} className="min-h-9 flex-1 rounded-lg bg-green text-xs font-semibold text-on-green">Catat: habis</button>
            <button
              type="button"
              onClick={() => { const p = swapMeal(plan, next.slot, member, state.prefs, state.members.length); if (p) onSwap(member.id, p); }}
              className="min-h-9 flex-1 rounded-lg border border-line text-xs font-semibold"
            >
              Ganti menu
            </button>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl bg-green-soft p-3 text-xs font-semibold">Semua makan hari ini sudah dicatat.</p>
      )}
      <div className="rounded-2xl border border-line bg-surface p-3 text-xs">
        <NutrientBars keys={displayKeys(member).slice(0, 3)} eaten={eaten} targets={info.targets} />
      </div>
    </div>
  );
}

function MenuScreen({ state, member, date }: { state: AppState; member: Member; date: string }) {
  const plan = state.plans[date]?.[member.id];
  const motherPlan = state.plans[date]?.[SAMPLE_IDS.mother];
  if (!plan) return null;
  return (
    <ol className="space-y-2">
      {plan.meals.map((m) => {
        const shared = member.role === "anak" && motherPlan?.meals.some((x) => x.slot === m.slot && x.dishId === m.dishId);
        return (
          <li key={m.slot} className="rounded-xl border border-line bg-surface p-2.5">
            <p className="flex justify-between text-[11px] text-muted">
              <span className="font-semibold text-accent">{SLOT_INFO[m.slot].label} · {SLOT_INFO[m.slot].time}</span>
              <span>{kcal(plan, m.slot)} kkal</span>
            </p>
            <p className="mt-0.5 font-semibold leading-snug">{DISH_BY_ID[m.dishId].name}</p>
            {shared && <p className="mt-1 inline-block rounded-full bg-green-soft px-2 py-0.5 text-[11px] font-semibold text-green">Sama dengan menu Rina, porsi anak</p>}
          </li>
        );
      })}
    </ol>
  );
}

type Bubble = { from: "user" | "bot"; text: string };

function ChatScreen({ state, date, onSwap, onDone }: { state: AppState; date: string; onSwap: (id: string, p: DayPlan) => void; onDone: () => void }) {
  const [messages, setMessages] = useState<Bubble[]>([]);
  const ask = "Siang ini pengen yang pedas, bosan ayam";
  const mother = state.members.find((m) => m.id === SAMPLE_IDS.mother)!;

  function send() {
    const plan = state.plans[date]?.[mother.id];
    const next = plan && swapMeal(plan, "siang", mother, state.prefs, state.members.length, { tags: ["pedas"], avoidFoods: ["ayam", "ayam-fillet"] });
    const dish = next?.meals.find((m) => m.slot === "siang")?.dishId;
    if (next) onSwap(mother.id, next);
    setMessages([
      { from: "user", text: ask },
      { from: "bot", text: dish ? `Bisa. Makan siang Rina diganti ${DISH_BY_ID[dish].name}. Gizi hari ini sudah dihitung ulang, protein tetap cukup.` : "Belum ada menu pedas tanpa ayam yang cocok hari ini." },
    ]);
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <p className="max-w-[88%] rounded-2xl rounded-bl-md border border-line bg-surface px-3 py-2 leading-relaxed">Halo. Mau ganti menu karena ngidam, anak menolak makanan, atau isi kulkas terbatas? Ceritakan saja.</p>
      {messages.map((m, i) => (
        <p key={i} className={`max-w-[88%] rounded-2xl px-3 py-2 leading-relaxed ${m.from === "user" ? "self-end rounded-br-md bg-green text-on-green" : "rounded-bl-md border border-line bg-surface"}`}>{m.text}</p>
      ))}
      <div className="mt-auto pt-2">
        {messages.length === 0 ? (
          <button type="button" onClick={send} className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-green bg-surface px-3 text-left text-xs font-semibold">
            <span>{ask}</span>
            <span className="rounded-md bg-green px-2 py-1 text-on-green">Kirim</span>
          </button>
        ) : (
          <button type="button" onClick={onDone} className="min-h-10 w-full rounded-lg bg-green text-xs font-semibold text-on-green">Lihat menu yang baru</button>
        )}
      </div>
    </div>
  );
}

function GrowthScreen({ state, date }: { state: AppState; date: string }) {
  const child = state.members.find((m) => m.id === SAMPLE_IDS.child) as Extract<Member, { role: "anak" }>;
  const last = state.measurements[child.id]?.at(-1);
  const months = ageInMonths(child.birthDate, date);
  const rows = last
    ? ([["Berat badan", "wfa", last.weightKg!, "kg"], ["Tinggi badan", "lhfa", last.lengthCm!, "cm"]] as const)
    : [];
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-line bg-surface p-3 text-[11px]">
        <p className="mb-1 text-xs font-semibold">Berat badan menurut umur</p>
        <GrowthChart member={child} state={state} />
      </div>
      {rows.map(([label, ind, value, unit]) => {
        const z = zScore(ind, child.sex, months, value) ?? 0;
        const status = classify(ind, z);
        return (
          <div key={ind} className="flex items-center justify-between rounded-xl border border-line bg-surface p-2.5">
            <span>
              <span className="block font-semibold">{label}</span>
              <span className="text-[11px] text-muted">{value.toLocaleString("id-ID")} {unit} · z {z.toLocaleString("id-ID")}</span>
            </span>
            <span className="rounded-full bg-green-soft px-2 py-0.5 text-[11px] font-semibold text-green">{status.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ShoppingScreen({ state, date }: { state: AppState; date: string }) {
  const plans = Array.from({ length: 7 }, (_, i) => addDays(date, i)).flatMap((d) => Object.values(state.plans[d] ?? {}).filter((p): p is DayPlan => !!p));
  const { items, total } = shoppingList(plans);
  const shown = items.slice(0, 9);
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-green-soft p-3">
        <p className="text-[11px] text-muted">Perkiraan belanja 7 hari, 2 orang</p>
        <p className="text-lg font-bold">{rupiah(total)}</p>
        <p className="text-[11px] text-muted">Budget {rupiah(state.prefs.weeklyBudget)} per minggu</p>
      </div>
      <ul className="divide-y divide-line rounded-xl border border-line bg-surface px-2.5">
        {shown.map((i) => (
          <li key={i.foodId} className="flex items-center gap-2 py-2">
            <span className="h-4 w-4 shrink-0 rounded border border-line" aria-hidden="true" />
            <span className="flex-1">{i.name}</span>
            <span className="text-muted tabular-nums">{formatGrams(i.grams, i.foodId)}</span>
          </li>
        ))}
      </ul>
      {items.length > shown.length && <p className="text-center text-[11px] text-muted">dan {items.length - shown.length} bahan lain · kirim ke WhatsApp</p>}
    </div>
  );
}
