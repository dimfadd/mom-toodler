"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ThemeToggle } from "@/components/Header";
import { Cite, Rich } from "@/components/Rich";
import { references } from "@/content/references";
import { site } from "@/content/site";
import {
  FOOD_GROUPS,
  acceptance,
  growth,
  insights,
  profiles,
  shopping,
  weekly,
  type Meal,
  type MealStatus,
  type NutrientKey,
  type Profile,
} from "./data";

type Tab = "hari-ini" | "menu" | "chat" | "progres" | "belanja";

/* ---------- Shared bits ---------- */

const STATUS_TEXT: Record<Exclude<MealStatus, null>, string> = {
  habis: "Habis",
  sebagian: "Sebagian",
  tidak: "Tidak dimakan",
};
const STATUS_FACTOR: Record<Exclude<MealStatus, null>, number> = { habis: 1, sebagian: 0.5, tidak: 0 };

function totals(meals: Meal[], keys: NutrientKey[]) {
  const result = {} as Record<NutrientKey, number>;
  for (const key of keys) {
    result[key] = Math.round(
      meals.reduce((sum, meal) => sum + (meal.status ? (meal.covers[key] ?? 0) * STATUS_FACTOR[meal.status] : 0), 0),
    );
  }
  return result;
}

function Check({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-4 ${className}`}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xl font-semibold text-ink">{children}</h2>;
}

/* ---------- Charts ---------- */

// Ring: the single summary number for the day. Familiar from fitness apps, and a nearly closed ring
// pulls people to finish it (goal-gradient effect).
function Ring({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const shown = Math.min(value, 100);
  return (
    <svg viewBox="0 0 128 128" className="h-32 w-32 shrink-0" role="img" aria-label={`${value}% dari target harian`}>
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--line)" strokeWidth="12" />
      <circle
        cx="64" cy="64" r={r} fill="none" stroke="var(--green)" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${(shown / 100) * c} ${c}`} transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dasharray 400ms ease" }}
      />
      <text x="64" y="62" textAnchor="middle" className="fill-ink font-display" fontSize="30" fontWeight="600">{value}%</text>
      <text x="64" y="82" textAnchor="middle" className="fill-muted" fontSize="11">dari target</text>
    </svg>
  );
}

function NutrientBars({ profile, values }: { profile: Profile; values: Record<NutrientKey, number> }) {
  return (
    <ul className="w-full space-y-2.5">
      {profile.nutrients.map(({ key, label }) => {
        const value = values[key];
        const done = value >= 100;
        return (
          <li key={key}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink">{label}</span>
              <span className={`flex items-center gap-1 tabular-nums ${done ? "font-semibold text-green" : "text-muted"}`}>
                {done && <Check className="h-3.5 w-3.5" />}
                {done ? "Tercapai" : `${value}%`}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="h-full rounded-full bg-green" style={{ width: `${Math.min(value, 100)}%`, transition: "width 400ms ease" }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// Bars against a dashed 100% line: easier to compare days than seven rings.
function WeeklyBars({ today }: { today: number }) {
  const data = weekly.map((d) => (d.day === "Hari ini" ? { ...d, value: today } : d));
  const h = 120;
  const max = 110;
  return (
    <figure>
      <svg viewBox="0 0 320 160" className="w-full" role="img" aria-label="Pencapaian target harian 7 hari terakhir">
        <line x1="0" x2="320" y1={h - (100 / max) * h + 10} y2={h - (100 / max) * h + 10} stroke="var(--muted)" strokeDasharray="4 4" strokeWidth="1" />
        <text x="318" y={h - (100 / max) * h + 4} textAnchor="end" fontSize="10" className="fill-muted">target</text>
        {data.map((d, i) => {
          const x = 12 + i * 44;
          const bh = (Math.min(d.value, max) / max) * h;
          const isToday = d.day === "Hari ini";
          return (
            <g key={d.day}>
              <rect x={x} y={h - bh + 10} width="28" height={bh} rx="6" fill={isToday ? "var(--green-soft)" : "var(--green)"} stroke={isToday ? "var(--green)" : "none"} strokeDasharray={isToday ? "3 3" : undefined} />
              <text x={x + 14} y={h - bh + 4} textAnchor="middle" fontSize="10" className="fill-ink tabular-nums">{d.value}</text>
              <text x={x + 14} y="150" textAnchor="middle" fontSize="10" className="fill-muted">{d.day}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

function GrowthChart() {
  const W = 320, H = 200, pad = { l: 30, r: 10, t: 10, b: 28 };
  const x = (m: number) => pad.l + (m / 24) * (W - pad.l - pad.r);
  const y = (kg: number) => H - pad.b - ((kg - 2) / 14) * (H - pad.t - pad.b);
  const line = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"}${x(growth.months[i])},${y(v)}`).join(" ");
  const band =
    growth.high.map((v, i) => `${i ? "L" : "M"}${x(growth.months[i])},${y(v)}`).join(" ") +
    growth.low.slice().reverse().map((v, i) => `L${x(growth.months[growth.months.length - 1 - i])},${y(v)}`).join(" ") + "Z";
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Berat badan Kakak berada di dalam rentang normal, sedikit di bawah garis tengah">
        {[4, 8, 12, 16].map((kg) => (
          <g key={kg}>
            <line x1={pad.l} x2={W - pad.r} y1={y(kg)} y2={y(kg)} stroke="var(--line)" />
            <text x={pad.l - 6} y={y(kg) + 3} textAnchor="end" fontSize="10" className="fill-muted">{kg}</text>
          </g>
        ))}
        {[0, 6, 12, 18, 24].map((m) => (
          <text key={m} x={x(m)} y={H - 10} textAnchor="middle" fontSize="10" className="fill-muted">{m} bln</text>
        ))}
        <path d={band} fill="var(--green-soft)" />
        <path d={line(growth.median)} fill="none" stroke="var(--green)" strokeWidth="1.5" strokeDasharray="5 4" />
        <path d={line(growth.child)} fill="none" stroke="var(--ink)" strokeWidth="2.2" />
        {growth.child.map((v, i) => (
          <circle key={i} cx={x(growth.months[i])} cy={y(v)} r="3.2" fill="var(--ink)" />
        ))}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-green-soft" /> Rentang normal</span>
        <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t-2 border-dashed border-green" /> Garis tengah</span>
        <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t-2 border-ink" /> Kakak</span>
      </figcaption>
    </figure>
  );
}

/* ---------- Screens ---------- */

function TodayScreen({ profile, setMeals, overall, values }: {
  profile: Profile;
  setMeals: (fn: (meals: Meal[]) => Meal[]) => void;
  overall: number;
  values: Record<NutrientKey, number>;
}) {
  const next = profile.meals.find((m) => m.status === null);
  const [choiceIndex, setChoiceIndex] = useState<Record<string, number>>({});
  const [logging, setLogging] = useState(false);
  const lowest = profile.nutrients.reduce((a, b) => (values[a.key] <= values[b.key] ? a : b));

  function log(status: Exclude<MealStatus, null>) {
    if (!next) return;
    setMeals((meals) => meals.map((m) => (m.id === next.id ? { ...m, status } : m)));
    setLogging(false);
  }

  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-4">
        <Ring value={overall} />
        <NutrientBars profile={profile} values={values} />
      </Card>

      {next ? (
        <Card className="border-green bg-bg">
          <p className="text-sm font-semibold text-accent">Berikutnya · {next.label} {next.time}</p>
          <p className="mt-1.5 font-display text-xl leading-snug font-semibold text-ink">
            {next.options[(choiceIndex[next.id] ?? 0) % next.options.length]}
          </p>
          {logging ? (
            <div className="mt-4">
              <p className="text-sm text-muted">Seberapa banyak yang dimakan?</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["habis", "sebagian", "tidak"] as const).map((s) => (
                  <button key={s} type="button" onClick={() => log(s)} className="h-12 rounded-lg border border-line text-sm font-semibold text-ink hover:bg-surface">
                    {STATUS_TEXT[s]}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setLogging(false)} className="mt-2 h-11 text-sm font-medium text-muted underline">Batal</button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setLogging(true)} className="h-12 rounded-lg bg-green font-semibold text-on-green hover:opacity-90">
                Catat
              </button>
              <button
                type="button"
                disabled={next.options.length < 2}
                onClick={() => setChoiceIndex((c) => ({ ...c, [next.id]: (c[next.id] ?? 0) + 1 }))}
                className="h-12 rounded-lg border border-line font-semibold text-ink hover:bg-surface disabled:opacity-50"
              >
                Ganti menu
              </button>
            </div>
          )}
          {next.options.length > 1 && !logging && (
            <p className="mt-3 text-xs text-muted">Pilihan pengganti tetap memenuhi target gizi yang sama.</p>
          )}
        </Card>
      ) : (
        <Card className="text-center">
          <p className="font-display text-xl font-semibold text-ink">Semua makan hari ini sudah dicatat.</p>
          <p className="mt-1 text-sm text-muted">Menu besok sudah siap di tab Menu.</p>
        </Card>
      )}

      {values[lowest.key] < 100 && (
        <div className="flex gap-3 rounded-2xl bg-green-soft p-4 text-[15px] text-ink">
          <span aria-hidden="true" className="mt-0.5 font-display text-lg leading-none text-green">i</span>
          <p>
            <strong>{lowest.label}</strong> paling rendah sejauh ini ({values[lowest.key]}%). Menu sisa hari ini sudah
            menghitungnya.
          </p>
        </div>
      )}

      <div>
        <SectionTitle>Jadwal hari ini</SectionTitle>
        <ol className="mt-3 divide-y divide-line rounded-2xl border border-line">
          {profile.meals.map((meal) => (
            <li key={meal.id} className="flex items-start gap-3 p-3.5">
              <span className="w-12 shrink-0 pt-0.5 text-sm text-muted tabular-nums">{meal.time}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{meal.label}</p>
                <p className="text-sm text-muted">{meal.options[(choiceIndex[meal.id] ?? 0) % meal.options.length]}</p>
              </div>
              {meal.status ? (
                <span className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${meal.status === "tidak" ? "bg-warn-soft text-warn" : "bg-green-soft text-green"}`}>
                  {meal.status !== "tidak" && <Check className="h-3 w-3" />}
                  {STATUS_TEXT[meal.status]}
                </span>
              ) : (
                <span className="shrink-0 text-xs text-muted">Belum</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function MenuScreen({ profile }: { profile: Profile }) {
  const [day, setDay] = useState(1);
  const [swaps, setSwaps] = useState<Record<string, number>>({});
  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Pilih hari" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {DAYS.map((d, i) => (
          <button
            key={d} role="tab" type="button" aria-selected={day === i} onClick={() => setDay(i)}
            className={`h-11 min-w-14 shrink-0 rounded-lg px-3 text-sm font-semibold ${day === i ? "bg-ink text-bg" : "border border-line text-ink"}`}
          >
            {d}
          </button>
        ))}
      </div>
      <Card className="flex items-center justify-between gap-3 bg-bg">
        <div>
          <p className="text-sm text-muted">Perkiraan belanja minggu ini</p>
          <p className="font-display text-xl font-semibold text-ink">Rp412.000</p>
        </div>
        <p className="text-right text-sm text-muted">Budget<br /><span className="font-semibold text-ink">Rp450.000</span></p>
      </Card>
      <ul className="space-y-3">
        {profile.meals.map((meal, i) => {
          const key = `${day}-${meal.id}`;
          const index = (swaps[key] ?? day + i) % meal.options.length;
          return (
            <li key={meal.id}>
              <Card className="bg-bg">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold text-accent">{meal.label}</p>
                  <p className="text-sm text-muted tabular-nums">{meal.time}</p>
                </div>
                <p className="mt-1 font-semibold text-ink">{meal.options[index]}</p>
                {meal.options.length > 1 && (
                  <button
                    type="button" onClick={() => setSwaps((s) => ({ ...s, [key]: index + 1 }))}
                    className="mt-2 h-11 text-sm font-semibold text-green underline underline-offset-2"
                  >
                    Ganti menu ini
                  </button>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type ChatMessage = { from: "user" | "bot"; text: string; danger?: boolean };

const QUICK = ["Lagi pengen yang pedas", "Kakak nolak telur", "Kulkas tinggal tahu, bayam, ayam", "Ada flek darah"];

function reply(text: string): ChatMessage {
  const t = text.toLowerCase();
  if (/(darah|flek|pendarahan|perdarahan|gerak|kejang|sesak)/.test(t)) {
    return { from: "bot", danger: true, text: "Ini tanda yang perlu diperiksa langsung. Segera hubungi dokter kandunganmu atau pergi ke IGD terdekat. Saya tidak memberi saran menu untuk kondisi ini." };
  }
  if (/(pedas|pedes)/.test(t)) {
    return { from: "bot", text: "Bisa. Makan siang diganti ayam woku kemangi, nasi, dan tumis buncis wortel. Sambalnya dipisah supaya pedasnya bisa kamu atur. Target gizi hari ini tetap sama[[3]]." };
  }
  if (/(telur|nolak|menolak|nggak mau|gak mau)/.test(t)) {
    return { from: "bot", text: "Sarapan Kakak diganti bubur ayam suwir dan tahu, proteinnya setara. Telur saya jadwalkan lagi lusa dalam bentuk dadar sayur. Banyak anak perlu mencicipi makanan berkali-kali sebelum mau menerimanya[[6]]." };
  }
  if (/(kulkas|tinggal|sisa)/.test(t)) {
    return { from: "bot", text: "Dari bahan itu: makan malam tumis ayam tahu, sayur bening bayam, dan nasi. Untuk Kakak, ayam dan tahu dicincang halus, bayam direbus lunak. Tidak perlu belanja tambahan." };
  }
  return { from: "bot", text: "Di prototipe ini saya baru bisa menjawab contoh pertanyaan di tombol atas. Di aplikasi asli, kamu bisa bertanya bebas." };
}

function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: "Halo. Mau ganti menu, cerita soal ngidam, atau si kecil lagi susah makan? Ketik saja, atau pilih salah satu di bawah." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [messages, typing]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function send(text: string) {
    const clean = text.trim();
    if (!clean || typing) return;
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setInput("");
    setTyping(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, reply(clean)]);
      setTyping(false);
    }, 700);
  }

  const used = useMemo(() => {
    const ids = new Set<number>();
    messages.forEach((m) => [...m.text.matchAll(/\[\[(\d+)\]\]/g)].forEach((x) => ids.add(Number(x[1]))));
    return references.filter((r) => ids.has(r.id));
  }, [messages]);

  return (
    <div className="flex flex-col gap-3">
      <ol className="space-y-3" aria-live="polite">
        {messages.map((m, i) => (
          <li key={i} className={m.from === "user" ? "flex justify-end" : ""}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                m.from === "user"
                  ? "rounded-br-md bg-green text-on-green"
                  : m.danger
                    ? "rounded-bl-md border border-danger bg-danger-soft text-ink"
                    : "rounded-bl-md border border-line bg-surface text-ink"
              }`}
            >
              {m.danger && <p className="mb-1 text-sm font-bold text-danger">Perlu diperiksa dokter</p>}
              <Rich text={m.text} />
            </div>
          </li>
        ))}
        {typing && (
          <li className="text-sm text-muted" role="status">Sedang menyusun jawaban...</li>
        )}
      </ol>
      {/* Leaves room for the pinned composer and bottom navigation when auto-scrolling. */}
      <div ref={endRef} className="scroll-mb-56" />

      {/* Composer stays pinned above the bottom navigation so it is always within thumb reach. */}
      <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] -mx-4 space-y-2 border-t border-line bg-bg px-4 pt-3 pb-3">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {QUICK.map((q) => (
          <button key={q} type="button" onClick={() => send(q)} disabled={typing} className="h-11 shrink-0 rounded-lg border border-line px-3 text-sm font-medium text-ink hover:bg-surface disabled:opacity-50">
            {q}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
        <label htmlFor="chat-input" className="sr-only">Tulis pesan</label>
        <input
          id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tulis pesan..."
          className="h-12 min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 text-base text-ink placeholder:text-muted"
        />
        <button type="submit" disabled={!input.trim() || typing} className="h-12 shrink-0 rounded-lg bg-green px-4 font-semibold text-on-green disabled:opacity-50">
          Kirim
        </button>
      </form>
      </div>

      {used.length > 0 && (
        <div className="mt-2 border-t border-line pt-3">
          <p className="text-sm font-semibold text-ink">Rujukan di percakapan ini</p>
          <ol className="mt-2 space-y-2">
            {used.map((r) => (
              <li key={r.id} id={`ref-${r.id}`} className="grid grid-cols-[1.5rem_1fr] gap-2 text-xs leading-relaxed text-muted">
                <span className="font-semibold text-accent">{r.id}</span>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{r.citation}</a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function ProgressScreen({ profile, overall }: { profile: Profile; overall: number }) {
  const eatenGroups = FOOD_GROUPS.filter((g) => g.eaten).length;
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle>7 hari terakhir</SectionTitle>
        <p className="mt-1 text-sm text-muted">Persentase target gizi harian yang tercapai.</p>
        <div className="mt-3"><WeeklyBars today={overall} /></div>
      </Card>

      <div>
        <SectionTitle>Catatan minggu ini</SectionTitle>
        <ul className="mt-3 space-y-2">
          {insights[profile.id].map((item) => (
            <li key={item.title} className={`flex gap-3 rounded-2xl p-4 ${item.tone === "warn" ? "bg-warn-soft" : "bg-green-soft"}`}>
              <span className={`mt-0.5 shrink-0 ${item.tone === "warn" ? "text-warn" : "text-green"}`} aria-hidden="true">
                {item.tone === "warn" ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 8v5M12 16.5v.5" strokeLinecap="round" /><circle cx="12" cy="12" r="9" /></svg>
                ) : (
                  <Check />
                )}
              </span>
              <div>
                <p className={`text-sm font-semibold ${item.tone === "warn" ? "text-warn" : "text-green"}`}>
                  <span className="sr-only">{item.tone === "warn" ? "Perlu perhatian: " : "Baik: "}</span>
                  {item.title}
                </p>
                <p className="mt-0.5 text-sm text-ink">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {profile.id === "anak" && (
        <>
          <Card>
            <SectionTitle>Berat badan menurut umur</SectionTitle>
            <p className="mt-1 text-sm text-muted">Kakak di dalam rentang normal, sedikit di bawah garis tengah. Penimbangan berikutnya: 19 bulan.</p>
            <div className="mt-3"><GrowthChart /></div>
            <p className="mt-2 text-xs text-muted">Kurva ilustrasi. Versi final memakai tabel resmi Standar Pertumbuhan Anak WHO<Cite n={5} />.</p>
          </Card>

          <Card>
            <SectionTitle>Keragaman makanan hari ini</SectionTitle>
            <p className="mt-1 text-sm text-muted">
              {eatenGroups} dari 8 kelompok makanan. Anjuran WHO untuk usia 6 sampai 23 bulan: minimal 5 kelompok per hari<Cite n={2} />.
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {FOOD_GROUPS.map((g) => (
                <li key={g.name} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs ${g.eaten ? "border-green bg-green-soft text-ink" : "border-line text-muted"}`}>
                  {g.eaten ? <Check className="h-3.5 w-3.5 shrink-0 text-green" /> : <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-line" aria-hidden="true" />}
                  <span><span className="sr-only">{g.eaten ? "Sudah: " : "Belum: "}</span>{g.name}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionTitle>Makanan yang sedang dikenalkan</SectionTitle>
            <p className="mt-1 text-sm text-muted">Setiap titik satu kali dicoba. Titik penuh berarti dimakan.</p>
            <ul className="mt-3 space-y-3">
              {acceptance.map((a) => (
                <li key={a.food}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-ink">{a.food}</p>
                    <p className="text-xs text-muted">{a.accepted} dari {a.tries} kali dimakan</p>
                  </div>
                  <div className="mt-1.5 flex gap-1.5" aria-hidden="true">
                    {Array.from({ length: a.tries }).map((_, i) => (
                      <span key={i} className={`h-3 w-3 rounded-full ${i < a.accepted ? "bg-green" : "border border-green"}`} />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted">{a.note}</p>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}

function ShoppingScreen() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const remaining = shopping.flatMap((g) => g.items).filter((item) => !checked[item]);
  const text = `Daftar belanja minggu ini (${site.name}):\n` + remaining.map((i) => `- ${i}`).join("\n");
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Disusun dari menu 7 hari. Centang yang sudah dibeli.</p>
      {shopping.map((group) => (
        <div key={group.group}>
          <SectionTitle>{group.group}</SectionTitle>
          <ul className="mt-2 divide-y divide-line rounded-2xl border border-line">
            {group.items.map((item) => (
              <li key={item}>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 px-3.5">
                  <input
                    type="checkbox" checked={!!checked[item]}
                    onChange={(e) => setChecked((c) => ({ ...c, [item]: e.target.checked }))}
                    className="h-5 w-5 shrink-0 accent-[var(--green)]"
                  />
                  <span className={checked[item] ? "text-muted line-through" : "text-ink"}>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {remaining.length > 0 ? (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"
          className="flex h-12 items-center justify-center rounded-lg bg-green font-semibold text-on-green hover:opacity-90"
        >
          Kirim {remaining.length} item ke WhatsApp
        </a>
      ) : (
        <p className="rounded-2xl bg-green-soft p-4 text-center font-semibold text-green">Semua sudah dibeli.</p>
      )}
    </div>
  );
}

/* ---------- Frame ---------- */

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "hari-ini", label: "Hari ini", icon: <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" strokeLinejoin="round" /> },
  { id: "menu", label: "Menu", icon: <path d="M5 5h14M5 12h14M5 19h9" strokeLinecap="round" /> },
  { id: "chat", label: "Chat", icon: <path d="M4 5h16v11H9l-5 4z" strokeLinejoin="round" /> },
  { id: "progres", label: "Progres", icon: <path d="M5 20V12M12 20V5M19 20v-6" strokeLinecap="round" /> },
  { id: "belanja", label: "Belanja", icon: <path d="M5 8h14l-1.5 12h-11zM9 8a3 3 0 0 1 6 0" strokeLinejoin="round" /> },
];

const TITLES: Record<Tab, string> = {
  "hari-ini": "Hari ini",
  menu: "Menu minggu ini",
  chat: "Chat",
  progres: "Progres",
  belanja: "Daftar belanja",
};

export function AppPrototype() {
  const [tab, setTab] = useState<Tab>("hari-ini");
  const [profileId, setProfileId] = useState<Profile["id"]>("ibu");
  const [mealsByProfile, setMealsByProfile] = useState(() =>
    Object.fromEntries(profiles.map((p) => [p.id, p.meals])) as Record<Profile["id"], Meal[]>,
  );

  const base = profiles.find((p) => p.id === profileId)!;
  const profile: Profile = { ...base, meals: mealsByProfile[profileId] };
  const keys = profile.nutrients.map((n) => n.key);
  const values = totals(profile.meals, keys);
  const overall = Math.round(keys.reduce((s, k) => s + Math.min(values[k], 100), 0) / keys.length);
  const setMeals = (fn: (meals: Meal[]) => Meal[]) =>
    setMealsByProfile((all) => ({ ...all, [profileId]: fn(all[profileId]) }));

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col border-x border-line bg-bg">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/95 px-4 pt-3 pb-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-ink">{site.name}</p>
            <h1 className="text-sm text-muted">{TITLES[tab]}</h1>
          </div>
          <ThemeToggle />
        </div>
        {tab !== "belanja" && tab !== "chat" && (
          <div role="group" aria-label="Pilih anggota keluarga" className="mt-3 grid grid-cols-2 gap-1 rounded-lg border border-line p-1">
            {profiles.map((p) => (
              <button
                key={p.id} type="button" aria-pressed={profileId === p.id} onClick={() => setProfileId(p.id)}
                className={`h-11 rounded-md text-sm font-semibold ${profileId === p.id ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
              >
                {p.name} · {p.stage}
              </button>
            ))}
          </div>
        )}
      </header>

      <p className="bg-accent-soft px-4 py-2 text-xs text-ink">
        Prototipe dengan data contoh. Angka belum dihitung dari tabel gizi asli.{" "}
        <Link href="/" className="font-semibold underline">Kembali ke halaman utama</Link>
      </p>

      <main className="flex-1 px-4 pt-4 pb-28">
        {tab === "hari-ini" && <TodayScreen profile={profile} setMeals={setMeals} overall={overall} values={values} />}
        {tab === "menu" && <MenuScreen profile={profile} />}
        {tab === "chat" && <ChatScreen />}
        {tab === "progres" && <ProgressScreen profile={profile} overall={overall} />}
        {tab === "belanja" && <ShoppingScreen />}
      </main>

      {/* Bottom navigation: within thumb reach for one-handed use, five familiar destinations. */}
      <nav aria-label="Navigasi aplikasi" className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-x border-line bg-bg pb-[env(safe-area-inset-bottom)]">
        <ul className="grid grid-cols-5">
          {TABS.map((t) => (
            <li key={t.id}>
              <button
                type="button" onClick={() => { setTab(t.id); window.scrollTo({ top: 0 }); }}
                aria-current={tab === t.id ? "page" : undefined}
                className={`flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold ${tab === t.id ? "text-green" : "text-muted"}`}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={tab === t.id ? 2.2 : 1.7} aria-hidden="true">
                  {t.icon}
                </svg>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
