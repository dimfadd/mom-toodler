"use client";

import { useState } from "react";
import { Cite } from "@/components/Rich";
import { DISH_BY_ID } from "@/lib/nutrition/dishes";
import { FOODS } from "@/lib/nutrition/foods";
import { classify, curve, zScore } from "@/lib/nutrition/growth";
import { eatenNutrients, percentOf } from "@/lib/nutrition/planner";
import { ageInMonths, targetsFor } from "@/lib/nutrition/targets";
import { NUTRIENT_INFO, type Member } from "@/lib/nutrition/types";
import { addDays, addMeasurement, removeMeasurement, today, type AppState } from "@/lib/store";
import { Alert, Button, Card, Check, SOURCES, Title, displayKeys } from "./ui";
import { overallPercent } from "./TodayView";

/* ---------- Weekly overview ---------- */

function lastDays(n: number) {
  const t = today();
  return Array.from({ length: n }, (_, i) => addDays(t, i - n + 1));
}

function WeeklyBars({ state, member }: { state: AppState; member: Member }) {
  const days = lastDays(7);
  const values = days.map((d) => {
    const logged = Object.keys(state.logs[d]?.[member.id] ?? {}).length > 0;
    return { date: d, value: logged ? overallPercent(member, state, d) : null };
  });
  const h = 120;
  if (values.every((v) => v.value === null)) {
    return <p className="py-6 text-sm text-muted">Belum ada makanan yang dicatat dalam 7 hari terakhir. Catat di tab Hari ini, grafiknya muncul di sini.</p>;
  }
  return (
    <svg viewBox="0 0 320 160" className="w-full" role="img" aria-label="Persentase target gizi tercapai, 7 hari terakhir">
      <line x1="0" x2="320" y1={10} y2={10} stroke="var(--muted)" strokeDasharray="4 4" />
      <text x="318" y="22" textAnchor="end" fontSize="10" className="fill-muted">target 100%</text>
      {values.map((v, i) => {
        const x = 12 + i * 44;
        const bh = v.value ? (Math.min(v.value, 100) / 100) * h : 0;
        const label = new Date(v.date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "short" });
        return (
          <g key={v.date}>
            {v.value !== null ? (
              <>
                <rect x={x} y={h - bh + 10} width="28" height={Math.max(bh, 2)} rx="6" fill="var(--green)" />
                <text x={x + 14} y={h - bh + 4} textAnchor="middle" fontSize="10" className="fill-ink">{v.value}</text>
              </>
            ) : (
              <text x={x + 14} y={h + 6} textAnchor="middle" fontSize="12" className="fill-muted">–</text>
            )}
            <text x={x + 14} y="150" textAnchor="middle" fontSize="10" className="fill-muted">{i === 6 ? "Hari ini" : label}</text>
          </g>
        );
      })}
    </svg>
  );
}


function Insights({ state, member }: { state: AppState; member: Member }) {
  const days = lastDays(7).filter((d) => Object.keys(state.logs[d]?.[member.id] ?? {}).length >= 3);
  if (days.length < 2) {
    return <p className="text-sm text-muted">Catatan minggu ini muncul setelah ada minimal 2 hari dengan 3 kali makan tercatat.</p>;
  }
  const keys = displayKeys(member).filter((k) => k !== "energi");
  return (
    <ul className="space-y-2">
      {keys.map((k) => {
        const ok = days.filter((d) => {
          const plan = state.plans[d]?.[member.id];
          if (!plan) return false;
          const eaten = eatenNutrients(plan, state.logs[d]?.[member.id] ?? {});
          return percentOf(eaten[k], targetsFor(member, d).targets[k]) >= 80;
        }).length;
        const good = ok / days.length >= 0.7;
        return (
          <li key={k} className={`flex gap-3 rounded-2xl p-3.5 ${good ? "bg-green-soft" : "bg-warn-soft"}`}>
            <span className={`mt-0.5 shrink-0 ${good ? "text-green" : "text-warn"}`} aria-hidden="true">
              {good ? <Check /> : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 8v5M12 16.5v.5" strokeLinecap="round" /><circle cx="12" cy="12" r="9" /></svg>}
            </span>
            <p className="text-sm text-ink">
              <span className={`font-bold ${good ? "text-green" : "text-warn"}`}>
                <span className="sr-only">{good ? "Baik: " : "Perlu perhatian: "}</span>
                {NUTRIENT_INFO[k].label} cukup di {ok} dari {days.length} hari.
              </span>{" "}
              {good ? "Pertahankan." : `Sumbernya antara lain ${SOURCES[k]}. Pilih menu yang memakainya lewat tombol Ganti menu atau chat.`}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Growth ---------- */

function GrowthChart({ member, state }: { member: Extract<Member, { role: "anak" }>; state: AppState }) {
  const points = (state.measurements[member.id] ?? [])
    .filter((m) => m.weightKg)
    .map((m) => ({ month: ageInMonths(member.birthDate, m.date) + (new Date(m.date).getDate() - new Date(member.birthDate).getDate()) / 30, kg: m.weightKg! }))
    .filter((p) => p.month <= 60);
  const nowMonth = ageInMonths(member.birthDate, today());
  const from = Math.max(0, Math.min(nowMonth, ...points.map((p) => p.month)) - 3);
  const to = Math.min(60, Math.max(nowMonth + 3, from + 12));
  const data = curve("wfa", member.sex, from, to);
  if (data.length < 2) return null;
  const maxKg = Math.max(...data.map((d) => d.high), ...points.map((p) => p.kg)) + 1;
  const minKg = Math.max(0, Math.min(...data.map((d) => d.low), ...points.map((p) => p.kg)) - 1);
  const W = 320, H = 200, pad = { l: 30, r: 10, t: 10, b: 28 };
  const x = (m: number) => pad.l + ((m - from) / (to - from)) * (W - pad.l - pad.r);
  const y = (kg: number) => H - pad.b - ((kg - minKg) / (maxKg - minKg)) * (H - pad.t - pad.b);
  const line = (key: "low" | "median" | "high") => data.map((d, i) => `${i ? "L" : "M"}${x(d.month)},${y(d[key])}`).join(" ");
  const band = data.map((d, i) => `${i ? "L" : "M"}${x(d.month)},${y(d.high)}`).join(" ") + [...data].reverse().map((d) => `L${x(d.month)},${y(d.low)}`).join(" ") + "Z";
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round(minKg + ((maxKg - minKg) * (i + 0.5)) / 5));
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Kurva berat badan menurut umur untuk ${member.name}`}>
        {ticks.map((kg) => (
          <g key={kg}>
            <line x1={pad.l} x2={W - pad.r} y1={y(kg)} y2={y(kg)} stroke="var(--line)" />
            <text x={pad.l - 6} y={y(kg) + 3} textAnchor="end" fontSize="10" className="fill-muted">{kg}</text>
          </g>
        ))}
        {[from, Math.round((from + to) / 2), to].map((m, i) => (
          <text key={m} x={x(m)} y={H - 10} textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"} fontSize="10" className="fill-muted">{Math.round(m)} bln</text>
        ))}
        <path d={band} fill="var(--green-soft)" />
        <path d={line("median")} fill="none" stroke="var(--green)" strokeWidth="1.5" strokeDasharray="5 4" />
        {points.length > 1 && <path d={points.map((p, i) => `${i ? "L" : "M"}${x(p.month)},${y(p.kg)}`).join(" ")} fill="none" stroke="var(--ink)" strokeWidth="2.2" />}
        {points.map((p, i) => <circle key={i} cx={x(p.month)} cy={y(p.kg)} r="3.5" fill="var(--ink)" />)}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-green-soft" /> Rentang normal (-2 sampai +2 SD)</span>
        <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t-2 border-dashed border-green" /> Median WHO</span>
        <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t-2 border-ink" /> {member.name}</span>
      </figcaption>
    </figure>
  );
}

function Growth({ member, state }: { member: Extract<Member, { role: "anak" }>; state: AppState }) {
  const [date, setDate] = useState(today());
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [error, setError] = useState<string | null>(null);
  const list = state.measurements[member.id] ?? [];
  const latest = list[list.length - 1];
  const months = latest ? ageInMonths(member.birthDate, latest.date) : null;
  const zw = latest?.weightKg && months !== null ? zScore("wfa", member.sex, months, latest.weightKg) : null;
  const zl = latest?.lengthCm && months !== null ? zScore("lhfa", member.sex, months, latest.lengthCm) : null;
  const tooOld = ageInMonths(member.birthDate, today()) > 60;

  function save(e: React.FormEvent) {
    e.preventDefault();
    const w = Number(weight.replace(",", "."));
    const l = Number(length.replace(",", "."));
    if (!weight && !length) return setError("Isi berat atau panjang/tinggi badan.");
    if (weight && !(w > 1 && w < 60)) return setError("Berat badan diisi dalam kg, contoh 9,5.");
    if (length && !(l > 40 && l < 170)) return setError("Panjang atau tinggi badan diisi dalam cm, contoh 76.");
    if (date > today() || date < member.birthDate) return setError("Tanggal pengukuran tidak valid.");
    addMeasurement(member.id, { date, weightKg: weight ? w : undefined, lengthCm: length ? l : undefined });
    setWeight("");
    setLength("");
    setError(null);
  }

  const field = "mt-1 block h-12 w-full rounded-lg border border-line bg-bg px-3 text-base text-ink";
  return (
    <Card className="space-y-4">
      <Title sub={`Dibandingkan dengan Standar Pertumbuhan Anak WHO`}>Pertumbuhan {member.name}<Cite n={5} /></Title>
      {tooOld ? (
        <p className="text-sm text-muted">Kurva di sini mencakup usia 0 sampai 5 tahun. Untuk usia di atas 5 tahun, kurva akan menyusul.</p>
      ) : (
        <>
          {latest ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {zw !== null && <Status label="Berat menurut umur" z={zw} status={classify("wfa", zw)} />}
              {zl !== null && <Status label="Panjang/tinggi menurut umur" z={zl} status={classify("lhfa", zl)} />}
            </div>
          ) : (
            <p className="text-sm text-muted">Belum ada pengukuran. Masukkan hasil timbang terakhir dari posyandu, bidan, atau dokter.</p>
          )}
          {zl !== null && zl < -2 && (
            <Alert tone="danger" title="Perlu diperiksa dokter">
              Panjang atau tinggi badan {member.name} berada di bawah -2 SD. Bawa ke dokter anak atau puskesmas untuk pemeriksaan lebih lanjut. Menu di aplikasi tidak menggantikan penanganan medis.
            </Alert>
          )}
          <GrowthChart member={member} state={state} />
          <form onSubmit={save} className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end" noValidate>
            <div>
              <label htmlFor="g-date" className="text-sm font-semibold text-ink">Tanggal</label>
              <input id="g-date" type="date" max={today()} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
            </div>
            <div>
              <label htmlFor="g-w" className="text-sm font-semibold text-ink">Berat (kg)</label>
              <input id="g-w" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="9,5" className={field} />
            </div>
            <div>
              <label htmlFor="g-l" className="text-sm font-semibold text-ink">Panjang/tinggi (cm)</label>
              <input id="g-l" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} placeholder="76" className={field} />
            </div>
            <Button type="submit">Simpan</Button>
          </form>
          {error && <p className="text-sm font-semibold text-danger" role="alert">{error}</p>}
          {list.length > 0 && (
            <ul className="divide-y divide-line rounded-xl border border-line text-sm">
              {[...list].reverse().map((m) => (
                <li key={m.date} className="flex items-center justify-between gap-3 px-3 py-2">
                  <span className="text-muted">{new Date(m.date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="text-ink tabular-nums">{m.weightKg ? `${m.weightKg} kg` : "–"} · {m.lengthCm ? `${m.lengthCm} cm` : "–"}</span>
                  <button type="button" onClick={() => removeMeasurement(member.id, m.date)} className="min-h-11 text-sm text-muted underline">Hapus</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Card>
  );
}

function Status({ label, z, status }: { label: string; z: number; status: ReturnType<typeof classify> }) {
  const tone = { ok: "bg-green-soft text-green", warn: "bg-warn-soft text-warn", danger: "bg-danger-soft text-danger" }[status.tone];
  return (
    <div className={`rounded-xl p-3 ${tone}`}>
      <p className="text-xs text-ink">{label}</p>
      <p className="font-bold">{status.label}</p>
      <p className="text-xs text-ink tabular-nums">z-score {z.toLocaleString("id-ID")}</p>
    </div>
  );
}

/* ---------- Foods being introduced ---------- */

function Acceptance({ state, member }: { state: AppState; member: Member }) {
  const counts = new Map<string, { tries: number; accepted: number }>();
  for (let i = 0; i < 30; i++) {
    const d = addDays(today(), -i);
    const plan = state.plans[d]?.[member.id];
    const logs = state.logs[d]?.[member.id] ?? {};
    plan?.meals.forEach((m) => {
      const log = logs[m.slot];
      const protein = DISH_BY_ID[m.dishId].mainProtein;
      if (!log || !protein) return;
      const c = counts.get(protein) ?? { tries: 0, accepted: 0 };
      c.tries += 1;
      if (log !== "tidak") c.accepted += 1;
      counts.set(protein, c);
    });
  }
  const rows = [...counts.entries()].sort((a, b) => a[1].accepted / a[1].tries - b[1].accepted / b[1].tries).slice(0, 6);
  return (
    <Card className="space-y-3">
      <Title sub="Setiap titik satu kali ditawarkan. Titik penuh berarti dimakan.">Makanan yang dikenalkan</Title>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">Belum ada catatan. Catat makan {member.name} di tab Hari ini, termasuk yang tidak dimakan.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map(([food, c]) => (
            <li key={food}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold text-ink">{FOODS[food]?.name ?? food}</p>
                <p className="text-xs text-muted">{c.accepted} dari {c.tries} kali dimakan</p>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5" aria-hidden="true">
                {Array.from({ length: Math.min(c.tries, 15) }).map((_, i) => (
                  <span key={i} className={`h-3 w-3 rounded-full ${i < c.accepted ? "bg-green" : "border border-green"}`} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm text-muted">Makanan yang ditolak tetap ditawarkan lagi dalam bentuk lain. Banyak anak perlu mencicipi berkali-kali sebelum mau menerimanya<Cite n={6} />.</p>
    </Card>
  );
}

export function ProgressView({ state, member }: { state: AppState; member: Member }) {
  const info = targetsFor(member, today());
  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <div className="space-y-4">
        {info.plan && (
          <Card>
            <Title sub="Persentase target gizi yang tercapai dari makanan yang dicatat">7 hari terakhir</Title>
            <div className="mt-3"><WeeklyBars state={state} member={member} /></div>
          </Card>
        )}
        {info.plan && (
          <div>
            <Title>Catatan minggu ini</Title>
            <div className="mt-3"><Insights state={state} member={member} /></div>
          </div>
        )}
        {member.role === "anak" && info.plan && <Acceptance state={state} member={member} />}
      </div>
      {member.role === "anak" ? (
        <Growth member={member} state={state} />
      ) : (
        <Card>
          <Title>Kehamilan dan menyusui</Title>
          <p className="mt-2 text-sm text-muted">Pencatatan kenaikan berat badan selama hamil akan menyusul. Sementara itu, ikuti pemantauan dari dokter atau bidanmu di buku KIA.</p>
        </Card>
      )}
    </div>
  );
}
